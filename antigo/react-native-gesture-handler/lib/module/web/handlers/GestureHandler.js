function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/* eslint-disable @typescript-eslint/no-empty-function */
import { State } from '../../State';
import { TouchEventType, EventTypes } from '../interfaces';
import GestureHandlerOrchestrator from '../tools/GestureHandlerOrchestrator';
import InteractionManager from '../tools/InteractionManager';
import PointerTracker from '../tools/PointerTracker';
import { MouseButton } from '../../handlers/gestureHandlerCommon';
import { PointerType } from '../../PointerType';
export default class GestureHandler {
  // Orchestrator properties
  constructor(delegate) {
    _defineProperty(this, "lastSentState", null);

    _defineProperty(this, "_state", State.UNDETERMINED);

    _defineProperty(this, "_shouldCancelWhenOutside", false);

    _defineProperty(this, "hasCustomActivationCriteria", false);

    _defineProperty(this, "_enabled", false);

    _defineProperty(this, "viewRef", void 0);

    _defineProperty(this, "propsRef", void 0);

    _defineProperty(this, "_handlerTag", void 0);

    _defineProperty(this, "_config", {
      enabled: false
    });

    _defineProperty(this, "_tracker", new PointerTracker());

    _defineProperty(this, "_activationIndex", 0);

    _defineProperty(this, "_awaiting", false);

    _defineProperty(this, "_active", false);

    _defineProperty(this, "_shouldResetProgress", false);

    _defineProperty(this, "_pointerType", PointerType.MOUSE);

    _defineProperty(this, "_delegate", void 0);

    _defineProperty(this, "sendEvent", (newState, oldState) => {
      const {
        onGestureHandlerEvent,
        onGestureHandlerStateChange
      } = this.propsRef.current;
      const resultEvent = this.transformEventData(newState, oldState); // In the new API oldState field has to be undefined, unless we send event state changed
      // Here the order is flipped to avoid workarounds such as making backup of the state and setting it to undefined first, then changing it back
      // Flipping order with setting oldState to undefined solves issue, when events were being sent twice instead of once
      // However, this may cause trouble in the future (but for now we don't know that)

      if (this.lastSentState !== newState) {
        this.lastSentState = newState;
        invokeNullableMethod(onGestureHandlerStateChange, resultEvent);
      }

      if (this.state === State.ACTIVE) {
        resultEvent.nativeEvent.oldState = undefined;
        invokeNullableMethod(onGestureHandlerEvent, resultEvent);
      }
    });

    this._delegate = delegate;
  } //
  // Initializing handler
  //


  init(viewRef, propsRef) {
    this.propsRef = propsRef;
    this.viewRef = viewRef;
    this.state = State.UNDETERMINED;
    this.delegate.init(viewRef, this);
  }

  attachEventManager(manager) {
    manager.setOnPointerDown(this.onPointerDown.bind(this));
    manager.setOnPointerAdd(this.onPointerAdd.bind(this));
    manager.setOnPointerUp(this.onPointerUp.bind(this));
    manager.setOnPointerRemove(this.onPointerRemove.bind(this));
    manager.setOnPointerMove(this.onPointerMove.bind(this));
    manager.setOnPointerEnter(this.onPointerEnter.bind(this));
    manager.setOnPointerLeave(this.onPointerLeave.bind(this));
    manager.setOnPointerCancel(this.onPointerCancel.bind(this));
    manager.setOnPointerOutOfBounds(this.onPointerOutOfBounds.bind(this));
    manager.setOnPointerMoveOver(this.onPointerMoveOver.bind(this));
    manager.setOnPointerMoveOut(this.onPointerMoveOut.bind(this));
    manager.setOnWheel(this.onWheel.bind(this));
    manager.registerListeners();
  } //
  // Resetting handler
  //


  onCancel() {}

  onReset() {}

  resetProgress() {}

  reset() {
    this.tracker.resetTracker();
    this.onReset();
    this.resetProgress();
    this.delegate.reset();
    this.state = State.UNDETERMINED;
  } //
  // State logic
  //


  moveToState(newState, sendIfDisabled) {
    if (this.state === newState) {
      return;
    }

    const oldState = this.state;
    this.state = newState;

    if (this.tracker.trackedPointersCount > 0 && this.config.needsPointerData && this.isFinished()) {
      this.cancelTouches();
    }

    GestureHandlerOrchestrator.instance.onHandlerStateChange(this, newState, oldState, sendIfDisabled);
    this.onStateChange(newState, oldState);

    if (!this.enabled && this.isFinished()) {
      this.state = State.UNDETERMINED;
    }
  }

  onStateChange(_newState, _oldState) {}

  begin() {
    if (!this.checkHitSlop()) {
      return;
    }

    if (this.state === State.UNDETERMINED) {
      this.moveToState(State.BEGAN);
    }
  }
  /**
   * @param {boolean} sendIfDisabled - Used when handler becomes disabled. With this flag orchestrator will be forced to send fail event
   */


  fail(sendIfDisabled) {
    if (this.state === State.ACTIVE || this.state === State.BEGAN) {
      // Here the order of calling the delegate and moveToState is important.
      // At this point we can use currentState as previuos state, because immediately after changing cursor we call moveToState method.
      this.delegate.onFail();
      this.moveToState(State.FAILED, sendIfDisabled);
    }

    this.resetProgress();
  }
  /**
   * @param {boolean} sendIfDisabled - Used when handler becomes disabled. With this flag orchestrator will be forced to send cancel event
   */


  cancel(sendIfDisabled) {
    if (this.state === State.ACTIVE || this.state === State.UNDETERMINED || this.state === State.BEGAN) {
      this.onCancel(); // Same as above - order matters

      this.delegate.onCancel();
      this.moveToState(State.CANCELLED, sendIfDisabled);
    }
  }

  activate(force = false) {
    if ((this.config.manualActivation !== true || force) && (this.state === State.UNDETERMINED || this.state === State.BEGAN)) {
      this.delegate.onActivate();
      this.moveToState(State.ACTIVE);
    }
  }

  end() {
    if (this.state === State.BEGAN || this.state === State.ACTIVE) {
      // Same as above - order matters
      this.delegate.onEnd();
      this.moveToState(State.END);
    }

    this.resetProgress();
  } //
  // Methods for orchestrator
  //


  getShouldResetProgress() {
    return this.shouldResetProgress;
  }

  setShouldResetProgress(value) {
    this.shouldResetProgress = value;
  }

  shouldWaitForHandlerFailure(handler) {
    if (handler === this) {
      return false;
    }

    return InteractionManager.instance.shouldWaitForHandlerFailure(this, handler);
  }

  shouldRequireToWaitForFailure(handler) {
    if (handler === this) {
      return false;
    }

    return InteractionManager.instance.shouldRequireHandlerToWaitForFailure(this, handler);
  }

  shouldRecognizeSimultaneously(handler) {
    if (handler === this) {
      return true;
    }

    return InteractionManager.instance.shouldRecognizeSimultaneously(this, handler);
  }

  shouldBeCancelledByOther(handler) {
    if (handler === this) {
      return false;
    }

    return InteractionManager.instance.shouldHandlerBeCancelledBy(this, handler);
  } //
  // Event actions
  //


  onPointerDown(event) {
    GestureHandlerOrchestrator.instance.recordHandlerIfNotPresent(this);
    this.pointerType = event.pointerType;

    if (this.pointerType === PointerType.TOUCH) {
      GestureHandlerOrchestrator.instance.cancelMouseAndPenGestures(this);
    } // TODO: Bring back touch events along with introducing `handleDown` method that will handle handler specific stuff

  } // Adding another pointer to existing ones


  onPointerAdd(event) {
    this.tryToSendTouchEvent(event);
  }

  onPointerUp(event) {
    this.tryToSendTouchEvent(event);
  } // Removing pointer, when there is more than one pointers


  onPointerRemove(event) {
    this.tryToSendTouchEvent(event);
  }

  onPointerMove(event) {
    this.tryToSendMoveEvent(false, event);
  }

  onPointerLeave(event) {
    if (this.shouldCancelWhenOutside) {
      switch (this.state) {
        case State.ACTIVE:
          this.cancel();
          break;

        case State.BEGAN:
          this.fail();
          break;
      }

      return;
    }

    this.tryToSendTouchEvent(event);
  }

  onPointerEnter(event) {
    this.tryToSendTouchEvent(event);
  }

  onPointerCancel(event) {
    this.tryToSendTouchEvent(event);
    this.cancel();
    this.reset();
  }

  onPointerOutOfBounds(event) {
    this.tryToSendMoveEvent(true, event);
  }

  onPointerMoveOver(_event) {// Used only by hover gesture handler atm
  }

  onPointerMoveOut(_event) {// Used only by hover gesture handler atm
  }

  onWheel(_event) {// Used only by pan gesture handler
  }

  tryToSendMoveEvent(out, event) {
    if (out && this.shouldCancelWhenOutside || !this.enabled) {
      return;
    }

    if (this.active) {
      this.sendEvent(this.state, this.state);
    }

    this.tryToSendTouchEvent(event);
  }

  tryToSendTouchEvent(event) {
    if (this.config.needsPointerData) {
      this.sendTouchEvent(event);
    }
  }

  sendTouchEvent(event) {
    if (!this.enabled) {
      return;
    }

    const {
      onGestureHandlerEvent
    } = this.propsRef.current;
    const touchEvent = this.transformTouchEvent(event);

    if (touchEvent) {
      invokeNullableMethod(onGestureHandlerEvent, touchEvent);
    }
  } //
  // Events Sending
  //


  transformEventData(newState, oldState) {
    return {
      nativeEvent: {
        numberOfPointers: this.tracker.trackedPointersCount,
        state: newState,
        pointerInside: this.delegate.isPointerInBounds(this.tracker.getAbsoluteCoordsAverage()),
        ...this.transformNativeEvent(),
        handlerTag: this.handlerTag,
        target: this.viewRef,
        oldState: newState !== oldState ? oldState : undefined,
        pointerType: this.pointerType
      },
      timeStamp: Date.now()
    };
  }

  transformTouchEvent(event) {
    const rect = this.delegate.measureView();
    const all = [];
    const changed = [];
    const trackerData = this.tracker.trackedPointers; // This if handles edge case where all pointers have been cancelled
    // When pointercancel is triggered, reset method is called. This means that tracker will be reset after first pointer being cancelled
    // The problem is, that handler will receive another pointercancel event from the rest of the pointers
    // To avoid crashing, we don't send event if tracker tracks no pointers, i.e. has been reset

    if (trackerData.size === 0 || !trackerData.has(event.pointerId)) {
      return;
    }

    trackerData.forEach((element, key) => {
      const id = this.tracker.getMappedTouchEventId(key);
      all.push({
        id: id,
        x: element.abosoluteCoords.x - rect.pageX,
        y: element.abosoluteCoords.y - rect.pageY,
        absoluteX: element.abosoluteCoords.x,
        absoluteY: element.abosoluteCoords.y
      });
    }); // Each pointer sends its own event, so we want changed touches to contain only the pointer that has changed.
    // However, if the event is cancel, we want to cancel all pointers to avoid crashes

    if (event.eventType !== EventTypes.CANCEL) {
      changed.push({
        id: this.tracker.getMappedTouchEventId(event.pointerId),
        x: event.x - rect.pageX,
        y: event.y - rect.pageY,
        absoluteX: event.x,
        absoluteY: event.y
      });
    } else {
      trackerData.forEach((element, key) => {
        const id = this.tracker.getMappedTouchEventId(key);
        changed.push({
          id: id,
          x: element.abosoluteCoords.x - rect.pageX,
          y: element.abosoluteCoords.y - rect.pageY,
          absoluteX: element.abosoluteCoords.x,
          absoluteY: element.abosoluteCoords.y
        });
      });
    }

    let eventType = TouchEventType.UNDETERMINED;

    switch (event.eventType) {
      case EventTypes.DOWN:
      case EventTypes.ADDITIONAL_POINTER_DOWN:
        eventType = TouchEventType.DOWN;
        break;

      case EventTypes.UP:
      case EventTypes.ADDITIONAL_POINTER_UP:
        eventType = TouchEventType.UP;
        break;

      case EventTypes.MOVE:
        eventType = TouchEventType.MOVE;
        break;

      case EventTypes.CANCEL:
        eventType = TouchEventType.CANCELLED;
        break;
    } // Here, when we receive up event, we want to decrease number of touches
    // That's because we want handler to send information that there's one pointer less
    // However, we still want this pointer to be present in allTouches array, so that its data can be accessed


    let numberOfTouches = all.length;

    if (event.eventType === EventTypes.UP || event.eventType === EventTypes.ADDITIONAL_POINTER_UP) {
      --numberOfTouches;
    }

    return {
      nativeEvent: {
        handlerTag: this.handlerTag,
        state: this.state,
        eventType: eventType,
        changedTouches: changed,
        allTouches: all,
        numberOfTouches: numberOfTouches,
        pointerType: this.pointerType
      },
      timeStamp: Date.now()
    };
  }

  cancelTouches() {
    const rect = this.delegate.measureView();
    const all = [];
    const changed = [];
    const trackerData = this.tracker.trackedPointers;

    if (trackerData.size === 0) {
      return;
    }

    trackerData.forEach((element, key) => {
      const id = this.tracker.getMappedTouchEventId(key);
      all.push({
        id: id,
        x: element.abosoluteCoords.x - rect.pageX,
        y: element.abosoluteCoords.y - rect.pageY,
        absoluteX: element.abosoluteCoords.x,
        absoluteY: element.abosoluteCoords.y
      });
      changed.push({
        id: id,
        x: element.abosoluteCoords.x - rect.pageX,
        y: element.abosoluteCoords.y - rect.pageY,
        absoluteX: element.abosoluteCoords.x,
        absoluteY: element.abosoluteCoords.y
      });
    });
    const cancelEvent = {
      nativeEvent: {
        handlerTag: this.handlerTag,
        state: this.state,
        eventType: TouchEventType.CANCELLED,
        changedTouches: changed,
        allTouches: all,
        numberOfTouches: all.length,
        pointerType: this.pointerType
      },
      timeStamp: Date.now()
    };
    const {
      onGestureHandlerEvent
    } = this.propsRef.current;
    invokeNullableMethod(onGestureHandlerEvent, cancelEvent);
  }

  transformNativeEvent() {
    // Those properties are shared by most handlers and if not this method will be overriden
    const lastCoords = this.tracker.getAbsoluteCoordsAverage();
    const lastRelativeCoords = this.tracker.getRelativeCoordsAverage();
    return {
      x: lastRelativeCoords.x,
      y: lastRelativeCoords.y,
      absoluteX: lastCoords.x,
      absoluteY: lastCoords.y
    };
  } //
  // Handling config
  //


  updateGestureConfig({
    enabled = true,
    ...props
  }) {
    this._config = {
      enabled: enabled,
      ...props
    };
    this.enabled = enabled;
    this.delegate.onEnabledChange(enabled);

    if (this.config.shouldCancelWhenOutside !== undefined) {
      this.shouldCancelWhenOutside = this.config.shouldCancelWhenOutside;
    }

    this.validateHitSlops();

    if (this.enabled) {
      return;
    }

    switch (this.state) {
      case State.ACTIVE:
        this.fail(true);
        break;

      case State.UNDETERMINED:
        GestureHandlerOrchestrator.instance.removeHandlerFromOrchestrator(this);
        break;

      default:
        this.cancel(true);
        break;
    }
  }

  checkCustomActivationCriteria(criterias) {
    for (const key in this.config) {
      if (criterias.indexOf(key) >= 0) {
        this.hasCustomActivationCriteria = true;
      }
    }
  }

  validateHitSlops() {
    if (!this.config.hitSlop) {
      return;
    }

    if (this.config.hitSlop.left !== undefined && this.config.hitSlop.right !== undefined && this.config.hitSlop.width !== undefined) {
      throw new Error('HitSlop Error: Cannot define left, right and width at the same time');
    }

    if (this.config.hitSlop.width !== undefined && this.config.hitSlop.left === undefined && this.config.hitSlop.right === undefined) {
      throw new Error('HitSlop Error: When width is defined, either left or right has to be defined');
    }

    if (this.config.hitSlop.height !== undefined && this.config.hitSlop.top !== undefined && this.config.hitSlop.bottom !== undefined) {
      throw new Error('HitSlop Error: Cannot define top, bottom and height at the same time');
    }

    if (this.config.hitSlop.height !== undefined && this.config.hitSlop.top === undefined && this.config.hitSlop.bottom === undefined) {
      throw new Error('HitSlop Error: When height is defined, either top or bottom has to be defined');
    }
  }

  checkHitSlop() {
    if (!this.config.hitSlop) {
      return true;
    }

    const {
      width,
      height
    } = this.delegate.measureView();
    let left = 0;
    let top = 0;
    let right = width;
    let bottom = height;

    if (this.config.hitSlop.horizontal !== undefined) {
      left -= this.config.hitSlop.horizontal;
      right += this.config.hitSlop.horizontal;
    }

    if (this.config.hitSlop.vertical !== undefined) {
      top -= this.config.hitSlop.vertical;
      bottom += this.config.hitSlop.vertical;
    }

    if (this.config.hitSlop.left !== undefined) {
      left = -this.config.hitSlop.left;
    }

    if (this.config.hitSlop.right !== undefined) {
      right = width + this.config.hitSlop.right;
    }

    if (this.config.hitSlop.top !== undefined) {
      top = -this.config.hitSlop.top;
    }

    if (this.config.hitSlop.bottom !== undefined) {
      bottom = width + this.config.hitSlop.bottom;
    }

    if (this.config.hitSlop.width !== undefined) {
      if (this.config.hitSlop.left !== undefined) {
        right = left + this.config.hitSlop.width;
      } else if (this.config.hitSlop.right !== undefined) {
        left = right - this.config.hitSlop.width;
      }
    }

    if (this.config.hitSlop.height !== undefined) {
      if (this.config.hitSlop.top !== undefined) {
        bottom = top + this.config.hitSlop.height;
      } else if (this.config.hitSlop.bottom !== undefined) {
        top = bottom - this.config.hitSlop.height;
      }
    }

    const rect = this.delegate.measureView();
    const {
      x,
      y
    } = this.tracker.getLastAbsoluteCoords();
    const offsetX = x - rect.pageX;
    const offsetY = y - rect.pageY;
    return offsetX >= left && offsetX <= right && offsetY >= top && offsetY <= bottom;
  }

  isButtonInConfig(mouseButton) {
    return !mouseButton || !this.config.mouseButton && mouseButton === MouseButton.LEFT || this.config.mouseButton && mouseButton & this.config.mouseButton;
  }

  resetConfig() {}

  onDestroy() {
    this.delegate.destroy(this.config);
  } //
  // Getters and setters
  //


  get handlerTag() {
    return this._handlerTag;
  }

  set handlerTag(value) {
    this._handlerTag = value;
  }

  get config() {
    return this._config;
  }

  get delegate() {
    return this._delegate;
  }

  get tracker() {
    return this._tracker;
  }

  get state() {
    return this._state;
  }

  set state(value) {
    this._state = value;
  }

  get shouldCancelWhenOutside() {
    return this._shouldCancelWhenOutside;
  }

  set shouldCancelWhenOutside(value) {
    this._shouldCancelWhenOutside = value;
  }

  get enabled() {
    return this._enabled;
  }

  set enabled(value) {
    this._enabled = value;
  }

  get pointerType() {
    return this._pointerType;
  }

  set pointerType(value) {
    this._pointerType = value;
  }

  get active() {
    return this._active;
  }

  set active(value) {
    this._active = value;
  }

  get awaiting() {
    return this._awaiting;
  }

  set awaiting(value) {
    this._awaiting = value;
  }

  get activationIndex() {
    return this._activationIndex;
  }

  set activationIndex(value) {
    this._activationIndex = value;
  }

  get shouldResetProgress() {
    return this._shouldResetProgress;
  }

  set shouldResetProgress(value) {
    this._shouldResetProgress = value;
  }

  getTrackedPointersID() {
    return this.tracker.trackedPointersIDs;
  }

  isFinished() {
    return this.state === State.END || this.state === State.FAILED || this.state === State.CANCELLED;
  }

}

function invokeNullableMethod(method, event) {
  if (!method) {
    return;
  }

  if (typeof method === 'function') {
    method(event);
    return;
  }

  if ('__getHandler' in method && typeof method.__getHandler === 'function') {
    const handler = method.__getHandler();

    invokeNullableMethod(handler, event);
    return;
  }

  if (!('__nodeConfig' in method)) {
    return;
  }

  const {
    argMapping
  } = method.__nodeConfig;

  if (!Array.isArray(argMapping)) {
    return;
  }

  for (const [index, [key, value]] of argMapping.entries()) {
    if (!(key in event.nativeEvent)) {
      continue;
    } // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access


    const nativeValue = event.nativeEvent[key]; // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access

    if (value !== null && value !== void 0 && value.setValue) {
      // Reanimated API
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
      value.setValue(nativeValue);
    } else {
      // RN Animated API
      method.__nodeConfig.argMapping[index] = [key, nativeValue];
    }
  }

  return;
}
//# sourceMappingURL=GestureHandler.js.map