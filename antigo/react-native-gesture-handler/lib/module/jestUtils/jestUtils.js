import invariant from 'invariant';
import { DeviceEventEmitter } from 'react-native';
import { flingHandlerName } from '../handlers/FlingGestureHandler';
import { forceTouchHandlerName } from '../handlers/ForceTouchGestureHandler';
import { BaseGesture } from '../handlers/gestures/gesture';
import { findHandlerByTestID } from '../handlers/handlersRegistry';
import { longPressHandlerName } from '../handlers/LongPressGestureHandler';
import { nativeViewHandlerName } from '../handlers/NativeViewGestureHandler';
import { panHandlerName } from '../handlers/PanGestureHandler';
import { pinchHandlerName } from '../handlers/PinchGestureHandler';
import { rotationHandlerName } from '../handlers/RotationGestureHandler';
import { tapHandlerName } from '../handlers/TapGestureHandler';
import { State } from '../State';
import { hasProperty, withPrevAndCurrent } from '../utils'; // Load fireEvent conditionally, so RNGH may be used in setups without testing-library

let fireEvent = (_element, _name, ..._data) => {// NOOP
};

try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  fireEvent = require('@testing-library/react-native').fireEvent;
} catch (_e) {// Do nothing if not available
}

const handlersDefaultEvents = {
  [flingHandlerName]: {
    x: 0,
    y: 0,
    absoluteX: 0,
    absoluteY: 0,
    numberOfPointers: 1
  },
  [forceTouchHandlerName]: {
    x: 0,
    y: 0,
    absoluteX: 0,
    absoluteY: 0,
    force: 1,
    numberOfPointers: 1
  },
  [longPressHandlerName]: {
    x: 0,
    y: 0,
    absoluteX: 0,
    absoluteY: 0,
    duration: 100,
    numberOfPointers: 1
  },
  [nativeViewHandlerName]: {
    pointerInside: true,
    numberOfPointers: 1
  },
  [panHandlerName]: {
    x: 0,
    y: 0,
    absoluteX: 0,
    absoluteY: 0,
    translationX: 100,
    translationY: 0,
    velocityX: 3,
    velocityY: 0,
    numberOfPointers: 1,
    stylusData: undefined
  },
  [pinchHandlerName]: {
    focalX: 0,
    focalY: 0,
    scale: 2,
    velocity: 1,
    numberOfPointers: 2
  },
  [rotationHandlerName]: {
    anchorX: 0,
    anchorY: 0,
    rotation: 3.14,
    velocity: 2,
    numberOfPointers: 2
  },
  [tapHandlerName]: {
    x: 0,
    y: 0,
    absoluteX: 0,
    absoluteY: 0,
    numberOfPointers: 1
  }
};

function isGesture(componentOrGesture) {
  return componentOrGesture instanceof BaseGesture;
}

function wrapWithNativeEvent(event) {
  return {
    nativeEvent: event
  };
}

function fillOldStateChanges(previousEvent, currentEvent) {
  const isFirstEvent = previousEvent === null;

  if (isFirstEvent) {
    return {
      oldState: State.UNDETERMINED,
      ...currentEvent
    };
  }

  const isGestureStateEvent = previousEvent.state !== currentEvent.state;

  if (isGestureStateEvent) {
    return {
      oldState: previousEvent === null || previousEvent === void 0 ? void 0 : previousEvent.state,
      ...currentEvent
    };
  } else {
    return currentEvent;
  }
}

function validateStateTransitions(previousEvent, currentEvent) {
  function stringify(event) {
    return JSON.stringify(event, null, 2);
  }

  function errorMsgWithBothEvents(description) {
    return `${description}, invalid event: ${stringify(currentEvent)}, previous event: ${stringify(previousEvent)}`;
  }

  function errorMsgWithCurrentEvent(description) {
    return `${description}, invalid event: ${stringify(currentEvent)}`;
  }

  invariant(hasProperty(currentEvent, 'state'), errorMsgWithCurrentEvent('every event must have state'));
  const isFirstEvent = previousEvent === null;

  if (isFirstEvent) {
    invariant(currentEvent.state === State.BEGAN, errorMsgWithCurrentEvent('first event must have BEGAN state'));
  }

  if (previousEvent !== null) {
    if (previousEvent.state !== currentEvent.state) {
      invariant(hasProperty(currentEvent, 'oldState'), errorMsgWithCurrentEvent('when state changes, oldState field should be present'));
      invariant(currentEvent.oldState === previousEvent.state, errorMsgWithBothEvents("when state changes, oldState should be the same as previous event' state"));
    }
  }

  return currentEvent;
}

function fillMissingDefaultsFor({
  handlerType,
  handlerTag
}) {
  return event => {
    return { ...handlersDefaultEvents[handlerType],
      ...event,
      handlerTag
    };
  };
}

function isDiscreteHandler(handlerType) {
  return handlerType === 'TapGestureHandler' || handlerType === 'LongPressGestureHandler';
}

function fillMissingStatesTransitions(events, isDiscreteHandler) {
  var _events2, _events$;

  const _events = [...events];
  const lastEvent = (_events2 = _events[_events.length - 1]) !== null && _events2 !== void 0 ? _events2 : null;
  const firstEvent = (_events$ = _events[0]) !== null && _events$ !== void 0 ? _events$ : null;
  const shouldDuplicateFirstEvent = !isDiscreteHandler && !hasState(State.BEGAN)(firstEvent);

  if (shouldDuplicateFirstEvent) {
    const duplicated = { ...firstEvent,
      state: State.BEGAN
    }; // @ts-ignore badly typed, property may exist and we don't want to copy it

    delete duplicated.oldState;

    _events.unshift(duplicated);
  }

  const shouldDuplicateLastEvent = !hasState(State.END)(lastEvent) || !hasState(State.FAILED)(lastEvent) || !hasState(State.CANCELLED)(lastEvent);

  if (shouldDuplicateLastEvent) {
    const duplicated = { ...lastEvent,
      state: State.END
    }; // @ts-ignore badly typed, property may exist and we don't want to copy it

    delete duplicated.oldState;

    _events.push(duplicated);
  }

  function isWithoutState(event) {
    return event !== null && !hasProperty(event, 'state');
  }

  function hasState(state) {
    return event => event !== null && event.state === state;
  }

  function noEventsLeft(event) {
    return event === null;
  }

  function trueFn() {
    return true;
  }

  function fillEventsForCurrentState({
    shouldConsumeEvent = trueFn,
    shouldTransitionToNextState = trueFn
  }) {
    function peekCurrentEvent() {
      var _events$2;

      return (_events$2 = _events[0]) !== null && _events$2 !== void 0 ? _events$2 : null;
    }

    function peekNextEvent() {
      var _events$3;

      return (_events$3 = _events[1]) !== null && _events$3 !== void 0 ? _events$3 : null;
    }

    function consumeCurrentEvent() {
      _events.shift();
    }

    const currentEvent = peekCurrentEvent();
    const nextEvent = peekNextEvent();
    const currentRequiredState = REQUIRED_EVENTS[currentStateIdx];
    let eventData = {};
    const shouldUseEvent = shouldConsumeEvent(currentEvent);

    if (shouldUseEvent) {
      eventData = currentEvent;
      consumeCurrentEvent();
    }

    transformedEvents.push({
      state: currentRequiredState,
      ...eventData
    });

    if (shouldTransitionToNextState(nextEvent)) {
      currentStateIdx++;
    }
  }

  const REQUIRED_EVENTS = [State.BEGAN, State.ACTIVE, State.END];
  let currentStateIdx = 0;
  const transformedEvents = [];
  let hasAllStates;
  let iterations = 0;

  do {
    const nextRequiredState = REQUIRED_EVENTS[currentStateIdx];

    if (nextRequiredState === State.BEGAN) {
      fillEventsForCurrentState({
        shouldConsumeEvent: e => isWithoutState(e) || hasState(State.BEGAN)(e)
      });
    } else if (nextRequiredState === State.ACTIVE) {
      const shouldConsumeEvent = e => isWithoutState(e) || hasState(State.ACTIVE)(e);

      const shouldTransitionToNextState = nextEvent => noEventsLeft(nextEvent) || hasState(State.END)(nextEvent) || hasState(State.FAILED)(nextEvent) || hasState(State.CANCELLED)(nextEvent);

      fillEventsForCurrentState({
        shouldConsumeEvent,
        shouldTransitionToNextState
      });
    } else if (nextRequiredState === State.END) {
      fillEventsForCurrentState({});
    }

    hasAllStates = currentStateIdx === REQUIRED_EVENTS.length;
    invariant(iterations++ <= 500, 'exceeded max number of iterations, please report a bug in RNGH repository with your test case');
  } while (!hasAllStates);

  return transformedEvents;
}

function getHandlerData(componentOrGesture) {
  if (isGesture(componentOrGesture)) {
    const gesture = componentOrGesture;
    return {
      emitEvent: (eventName, args) => {
        DeviceEventEmitter.emit(eventName, args.nativeEvent);
      },
      handlerType: gesture.handlerName,
      handlerTag: gesture.handlerTag,
      enabled: gesture.config.enabled
    };
  }

  const gestureHandlerComponent = componentOrGesture;
  return {
    emitEvent: (eventName, args) => {
      fireEvent(gestureHandlerComponent, eventName, args);
    },
    handlerType: gestureHandlerComponent.props.handlerType,
    handlerTag: gestureHandlerComponent.props.handlerTag,
    enabled: gestureHandlerComponent.props.enabled
  };
}

export function fireGestureHandler(componentOrGesture, eventList = []) {
  const {
    emitEvent,
    handlerType,
    handlerTag,
    enabled
  } = getHandlerData(componentOrGesture);

  if (enabled === false) {
    return;
  }

  let _ = fillMissingStatesTransitions(eventList, isDiscreteHandler(handlerType));

  _ = _.map(fillMissingDefaultsFor({
    handlerTag,
    handlerType
  }));
  _ = withPrevAndCurrent(_, fillOldStateChanges);
  _ = withPrevAndCurrent(_, validateStateTransitions); // @ts-ignore TODO

  _ = _.map(wrapWithNativeEvent);
  const events = _;
  const firstEvent = events.shift();
  emitEvent('onGestureHandlerStateChange', firstEvent);
  let lastSentEvent = firstEvent;

  for (const event of events) {
    const hasChangedState = lastSentEvent.nativeEvent.state !== event.nativeEvent.state;

    if (hasChangedState) {
      emitEvent('onGestureHandlerStateChange', event);
    } else {
      emitEvent('onGestureHandlerEvent', event);
    }

    lastSentEvent = event;
  }
}
export function getByGestureTestId(testID) {
  const handler = findHandlerByTestID(testID);

  if (handler === null) {
    throw new Error(`Handler with id: '${testID}' cannot be found`);
  }

  return handler;
}
//# sourceMappingURL=jestUtils.js.map