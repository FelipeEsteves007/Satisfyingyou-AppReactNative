function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import { PointerType } from '../../PointerType';
import { State } from '../../State';
import PointerTracker from './PointerTracker';
export default class GestureHandlerOrchestrator {
  // Private beacuse of Singleton
  // eslint-disable-next-line no-useless-constructor, @typescript-eslint/no-empty-function
  constructor() {
    _defineProperty(this, "gestureHandlers", []);

    _defineProperty(this, "awaitingHandlers", []);

    _defineProperty(this, "awaitingHandlersTags", new Set());

    _defineProperty(this, "handlingChangeSemaphore", 0);

    _defineProperty(this, "activationIndex", 0);
  }

  scheduleFinishedHandlersCleanup() {
    if (this.handlingChangeSemaphore === 0) {
      this.cleanupFinishedHandlers();
    }
  }

  cleanHandler(handler) {
    handler.reset();
    handler.active = false;
    handler.awaiting = false;
    handler.activationIndex = Number.MAX_VALUE;
  }

  removeHandlerFromOrchestrator(handler) {
    const indexInGestureHandlers = this.gestureHandlers.indexOf(handler);
    const indexInAwaitingHandlers = this.awaitingHandlers.indexOf(handler);

    if (indexInGestureHandlers >= 0) {
      this.gestureHandlers.splice(indexInGestureHandlers, 1);
    }

    if (indexInAwaitingHandlers >= 0) {
      this.awaitingHandlers.splice(indexInAwaitingHandlers, 1);
      this.awaitingHandlersTags.delete(handler.handlerTag);
    }
  }

  cleanupFinishedHandlers() {
    const handlersToRemove = new Set();

    for (let i = this.gestureHandlers.length - 1; i >= 0; --i) {
      const handler = this.gestureHandlers[i];

      if (this.isFinished(handler.state) && !handler.awaiting) {
        this.cleanHandler(handler);
        handlersToRemove.add(handler);
      }
    }

    this.gestureHandlers = this.gestureHandlers.filter(handler => !handlersToRemove.has(handler));
  }

  hasOtherHandlerToWaitFor(handler) {
    const hasToWaitFor = otherHandler => {
      return !this.isFinished(otherHandler.state) && this.shouldHandlerWaitForOther(handler, otherHandler);
    };

    return this.gestureHandlers.some(hasToWaitFor);
  }

  shouldBeCancelledByFinishedHandler(handler) {
    const shouldBeCancelled = otherHandler => {
      return this.shouldHandlerWaitForOther(handler, otherHandler) && otherHandler.state === State.END;
    };

    return this.gestureHandlers.some(shouldBeCancelled);
  }

  tryActivate(handler) {
    if (this.shouldBeCancelledByFinishedHandler(handler)) {
      handler.cancel();
      return;
    }

    if (this.hasOtherHandlerToWaitFor(handler)) {
      this.addAwaitingHandler(handler);
      return;
    }

    const handlerState = handler.state;

    if (handlerState === State.CANCELLED || handlerState === State.FAILED) {
      return;
    }

    if (this.shouldActivate(handler)) {
      this.makeActive(handler);
      return;
    }

    if (handlerState === State.ACTIVE) {
      handler.fail();
      return;
    }

    if (handlerState === State.BEGAN) {
      handler.cancel();
    }
  }

  shouldActivate(handler) {
    const shouldBeCancelledBy = otherHandler => {
      return this.shouldHandlerBeCancelledBy(handler, otherHandler);
    };

    return !this.gestureHandlers.some(shouldBeCancelledBy);
  }

  cleanupAwaitingHandlers(handler) {
    const shouldWait = otherHandler => {
      return !otherHandler.awaiting && this.shouldHandlerWaitForOther(otherHandler, handler);
    };

    for (const otherHandler of this.awaitingHandlers) {
      if (shouldWait(otherHandler)) {
        this.cleanHandler(otherHandler);
        this.awaitingHandlersTags.delete(otherHandler.handlerTag);
      }
    }

    this.awaitingHandlers = this.awaitingHandlers.filter(otherHandler => this.awaitingHandlersTags.has(otherHandler.handlerTag));
  }

  onHandlerStateChange(handler, newState, oldState, sendIfDisabled) {
    if (!handler.enabled && !sendIfDisabled) {
      return;
    }

    this.handlingChangeSemaphore += 1;

    if (this.isFinished(newState)) {
      for (const otherHandler of this.awaitingHandlers) {
        if (!this.shouldHandlerWaitForOther(otherHandler, handler) || !this.awaitingHandlersTags.has(otherHandler.handlerTag)) {
          continue;
        }

        if (newState !== State.END) {
          this.tryActivate(otherHandler);
          continue;
        }

        otherHandler.cancel();

        if (otherHandler.state === State.END) {
          // Handle edge case, where discrete gestures end immediately after activation thus
          // their state is set to END and when the gesture they are waiting for activates they
          // should be cancelled, however `cancel` was never sent as gestures were already in the END state.
          // Send synthetic BEGAN -> CANCELLED to properly handle JS logic
          otherHandler.sendEvent(State.CANCELLED, State.BEGAN);
        }

        otherHandler.awaiting = false;
      }
    }

    if (newState === State.ACTIVE) {
      this.tryActivate(handler);
    } else if (oldState === State.ACTIVE || oldState === State.END) {
      if (handler.active) {
        handler.sendEvent(newState, oldState);
      } else if (oldState === State.ACTIVE && (newState === State.CANCELLED || newState === State.FAILED)) {
        handler.sendEvent(newState, State.BEGAN);
      }
    } else if (oldState !== State.UNDETERMINED || newState !== State.CANCELLED) {
      handler.sendEvent(newState, oldState);
    }

    this.handlingChangeSemaphore -= 1;
    this.scheduleFinishedHandlersCleanup();

    if (!this.awaitingHandlers.includes(handler)) {
      this.cleanupAwaitingHandlers(handler);
    }
  }

  makeActive(handler) {
    const currentState = handler.state;
    handler.active = true;
    handler.shouldResetProgress = true;
    handler.activationIndex = this.activationIndex++;

    for (let i = this.gestureHandlers.length - 1; i >= 0; --i) {
      if (this.shouldHandlerBeCancelledBy(this.gestureHandlers[i], handler)) {
        this.gestureHandlers[i].cancel();
      }
    }

    for (const otherHandler of this.awaitingHandlers) {
      if (this.shouldHandlerBeCancelledBy(otherHandler, handler)) {
        otherHandler.awaiting = false;
      }
    }

    handler.sendEvent(State.ACTIVE, State.BEGAN);

    if (currentState !== State.ACTIVE) {
      handler.sendEvent(State.END, State.ACTIVE);

      if (currentState !== State.END) {
        handler.sendEvent(State.UNDETERMINED, State.END);
      }
    }

    if (!handler.awaiting) {
      return;
    }

    handler.awaiting = false;
    this.awaitingHandlers = this.awaitingHandlers.filter(otherHandler => otherHandler !== handler);
  }

  addAwaitingHandler(handler) {
    if (this.awaitingHandlers.includes(handler)) {
      return;
    }

    this.awaitingHandlers.push(handler);
    this.awaitingHandlersTags.add(handler.handlerTag);
    handler.awaiting = true;
    handler.activationIndex = this.activationIndex++;
  }

  recordHandlerIfNotPresent(handler) {
    if (this.gestureHandlers.includes(handler)) {
      return;
    }

    this.gestureHandlers.push(handler);
    handler.active = false;
    handler.awaiting = false;
    handler.activationIndex = Number.MAX_SAFE_INTEGER;
  }

  shouldHandlerWaitForOther(handler, otherHandler) {
    return handler !== otherHandler && (handler.shouldWaitForHandlerFailure(otherHandler) || otherHandler.shouldRequireToWaitForFailure(handler));
  }

  canRunSimultaneously(gh1, gh2) {
    return gh1 === gh2 || gh1.shouldRecognizeSimultaneously(gh2) || gh2.shouldRecognizeSimultaneously(gh1);
  }

  shouldHandlerBeCancelledBy(handler, otherHandler) {
    if (this.canRunSimultaneously(handler, otherHandler)) {
      return false;
    }

    if (handler.awaiting || handler.state === State.ACTIVE) {
      return handler.shouldBeCancelledByOther(otherHandler);
    }

    const handlerPointers = handler.getTrackedPointersID();
    const otherPointers = otherHandler.getTrackedPointersID();

    if (!PointerTracker.shareCommonPointers(handlerPointers, otherPointers) && handler.delegate.view !== otherHandler.delegate.view) {
      return this.checkOverlap(handler, otherHandler);
    }

    return true;
  }

  checkOverlap(handler, otherHandler) {
    // If handlers don't have common pointers, default return value is false.
    // However, if at least on pointer overlaps with both handlers, we return true
    // This solves issue in overlapping parents example
    // TODO: Find better way to handle that issue, for example by activation order and handler cancelling
    const isPointerWithinBothBounds = pointer => {
      const point = handler.tracker.getLastAbsoluteCoords(pointer);
      return handler.delegate.isPointerInBounds(point) && otherHandler.delegate.isPointerInBounds(point);
    };

    return handler.getTrackedPointersID().some(isPointerWithinBothBounds);
  }

  isFinished(state) {
    return state === State.END || state === State.FAILED || state === State.CANCELLED;
  } // This function is called when handler receives touchdown event
  // If handler is using mouse or pen as a pointer and any handler receives touch event,
  // mouse/pen event dissappears - it doesn't send onPointerCancel nor onPointerUp (and others)
  // This became a problem because handler was left at active state without any signal to end or fail
  // To handle this, when new touch event is received, we loop through active handlers and check which type of
  // pointer they're using. If there are any handler with mouse/pen as a pointer, we cancel them


  cancelMouseAndPenGestures(currentHandler) {
    this.gestureHandlers.forEach(handler => {
      if (handler.pointerType !== PointerType.MOUSE && handler.pointerType !== PointerType.STYLUS) {
        return;
      }

      if (handler !== currentHandler) {
        handler.cancel();
      } else {
        // Handler that received touch event should have its pointer tracker reset
        // This allows handler to smoothly change from mouse/pen to touch
        // The drawback is, that when we try to use mouse/pen one more time, it doesn't send onPointerDown at the first time
        // so it is required to click two times to get handler to work
        //
        // However, handler will receive manually created onPointerEnter that is triggered in EventManager in onPointerMove method.
        // There may be possibility to use that fact to make handler respond properly to first mouse click
        handler.tracker.resetTracker();
      }
    });
  }

  static get instance() {
    if (!GestureHandlerOrchestrator._instance) {
      GestureHandlerOrchestrator._instance = new GestureHandlerOrchestrator();
    }

    return GestureHandlerOrchestrator._instance;
  }

}

_defineProperty(GestureHandlerOrchestrator, "_instance", void 0);
//# sourceMappingURL=GestureHandlerOrchestrator.js.map