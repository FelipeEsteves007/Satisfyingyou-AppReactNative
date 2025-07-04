function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

import React, { forwardRef, useCallback, useMemo, useRef, useState } from 'react';
import { GestureObjects as Gesture } from '../../handlers/gestures/gestureObjects';
import { GestureDetector } from '../../handlers/gestures/GestureDetector';
import { Platform, processColor } from 'react-native';
import NativeButton from '../GestureHandlerButton';
import { numberAsInset, gestureToPressableEvent, isTouchWithinInset, gestureTouchToPressableEvent, addInsets } from './utils';
import { PressabilityDebugView } from '../../handlers/PressabilityDebugView';
import { INT32_MAX, isFabric, isTestEnv } from '../../utils';
const DEFAULT_LONG_PRESS_DURATION = 500;
const IS_TEST_ENV = isTestEnv();
let IS_FABRIC = null;
const Pressable = /*#__PURE__*/forwardRef((props, pressableRef) => {
  var _android_ripple$radiu;

  const {
    testOnly_pressed,
    hitSlop,
    pressRetentionOffset,
    delayHoverIn,
    onHoverIn,
    delayHoverOut,
    onHoverOut,
    delayLongPress,
    unstable_pressDelay,
    onPress,
    onPressIn,
    onPressOut,
    onLongPress,
    style,
    children,
    android_disableSound,
    android_ripple,
    disabled,
    accessible,
    ...remainingProps
  } = props;
  const [pressedState, setPressedState] = useState(testOnly_pressed !== null && testOnly_pressed !== void 0 ? testOnly_pressed : false); // Disabled when onLongPress has been called

  const isPressCallbackEnabled = useRef(true);
  const hasPassedBoundsChecks = useRef(false);
  const shouldPreventNativeEffects = useRef(false);
  const normalizedHitSlop = useMemo(() => typeof hitSlop === 'number' ? numberAsInset(hitSlop) : hitSlop !== null && hitSlop !== void 0 ? hitSlop : {}, [hitSlop]);
  const normalizedPressRetentionOffset = useMemo(() => typeof pressRetentionOffset === 'number' ? numberAsInset(pressRetentionOffset) : pressRetentionOffset !== null && pressRetentionOffset !== void 0 ? pressRetentionOffset : {}, [pressRetentionOffset]);
  const hoverInTimeout = useRef(null);
  const hoverOutTimeout = useRef(null);
  const hoverGesture = useMemo(() => Gesture.Hover().manualActivation(true) // Stops Hover from blocking Native gesture activation on web
  .cancelsTouchesInView(false).onBegin(event => {
    if (hoverOutTimeout.current) {
      clearTimeout(hoverOutTimeout.current);
    }

    if (delayHoverIn) {
      hoverInTimeout.current = setTimeout(() => onHoverIn === null || onHoverIn === void 0 ? void 0 : onHoverIn(gestureToPressableEvent(event)), delayHoverIn);
      return;
    }

    onHoverIn === null || onHoverIn === void 0 ? void 0 : onHoverIn(gestureToPressableEvent(event));
  }).onFinalize(event => {
    if (hoverInTimeout.current) {
      clearTimeout(hoverInTimeout.current);
    }

    if (delayHoverOut) {
      hoverOutTimeout.current = setTimeout(() => onHoverOut === null || onHoverOut === void 0 ? void 0 : onHoverOut(gestureToPressableEvent(event)), delayHoverOut);
      return;
    }

    onHoverOut === null || onHoverOut === void 0 ? void 0 : onHoverOut(gestureToPressableEvent(event));
  }), [delayHoverIn, delayHoverOut, onHoverIn, onHoverOut]);
  const pressDelayTimeoutRef = useRef(null);
  const isTouchPropagationAllowed = useRef(false); // iOS only: due to varying flow of gestures, events sometimes have to be saved for later use

  const deferredEventPayload = useRef(null);
  const pressInHandler = useCallback(event => {
    if (handlingOnTouchesDown.current) {
      deferredEventPayload.current = event;
    }

    if (!isTouchPropagationAllowed.current) {
      return;
    }

    deferredEventPayload.current = null;
    onPressIn === null || onPressIn === void 0 ? void 0 : onPressIn(event);
    isPressCallbackEnabled.current = true;
    pressDelayTimeoutRef.current = null;
    setPressedState(true);
  }, [onPressIn]);
  const pressOutHandler = useCallback(event => {
    if (!isTouchPropagationAllowed.current) {
      hasPassedBoundsChecks.current = false;
      isPressCallbackEnabled.current = true;
      deferredEventPayload.current = null;

      if (longPressTimeoutRef.current) {
        clearTimeout(longPressTimeoutRef.current);
        longPressTimeoutRef.current = null;
      }

      if (pressDelayTimeoutRef.current) {
        clearTimeout(pressDelayTimeoutRef.current);
        pressDelayTimeoutRef.current = null;
      }

      return;
    }

    if (!hasPassedBoundsChecks.current || event.nativeEvent.touches.length > event.nativeEvent.changedTouches.length) {
      return;
    }

    if (unstable_pressDelay && pressDelayTimeoutRef.current !== null) {
      // When delay is preemptively finished by lifting touches,
      // we want to immediately activate it's effects - pressInHandler,
      // even though we are located at the pressOutHandler
      clearTimeout(pressDelayTimeoutRef.current);
      pressInHandler(event);
    }

    if (deferredEventPayload.current) {
      onPressIn === null || onPressIn === void 0 ? void 0 : onPressIn(deferredEventPayload.current);
      deferredEventPayload.current = null;
    }

    onPressOut === null || onPressOut === void 0 ? void 0 : onPressOut(event);

    if (isPressCallbackEnabled.current) {
      onPress === null || onPress === void 0 ? void 0 : onPress(event);
    }

    if (longPressTimeoutRef.current) {
      clearTimeout(longPressTimeoutRef.current);
      longPressTimeoutRef.current = null;
    }

    isTouchPropagationAllowed.current = false;
    hasPassedBoundsChecks.current = false;
    isPressCallbackEnabled.current = true;
    setPressedState(false);
  }, [onPress, onPressIn, onPressOut, pressInHandler, unstable_pressDelay]);
  const handlingOnTouchesDown = useRef(false);
  const onEndHandlingTouchesDown = useRef(null);
  const cancelledMidPress = useRef(false);
  const activateLongPress = useCallback(event => {
    if (!isTouchPropagationAllowed.current) {
      return;
    }

    if (hasPassedBoundsChecks.current) {
      onLongPress === null || onLongPress === void 0 ? void 0 : onLongPress(gestureTouchToPressableEvent(event));
      isPressCallbackEnabled.current = false;
    }

    if (longPressTimeoutRef.current) {
      clearTimeout(longPressTimeoutRef.current);
      longPressTimeoutRef.current = null;
    }
  }, [onLongPress]);
  const longPressTimeoutRef = useRef(null);
  const longPressMinDuration = (delayLongPress !== null && delayLongPress !== void 0 ? delayLongPress : DEFAULT_LONG_PRESS_DURATION) + (unstable_pressDelay !== null && unstable_pressDelay !== void 0 ? unstable_pressDelay : 0);
  const innerPressableRef = useRef(null);
  const measureCallback = useCallback((width, height, event) => {
    var _onEndHandlingTouches;

    if (!isTouchWithinInset({
      width,
      height
    }, normalizedHitSlop, event.changedTouches.at(-1)) || hasPassedBoundsChecks.current || cancelledMidPress.current) {
      cancelledMidPress.current = false;
      onEndHandlingTouchesDown.current = null;
      handlingOnTouchesDown.current = false;
      return;
    }

    hasPassedBoundsChecks.current = true; // In case of multiple touches, the first one starts long press gesture

    if (longPressTimeoutRef.current === null) {
      // Start long press gesture timer
      longPressTimeoutRef.current = setTimeout(() => activateLongPress(event), longPressMinDuration);
    }

    if (unstable_pressDelay) {
      pressDelayTimeoutRef.current = setTimeout(() => {
        pressInHandler(gestureTouchToPressableEvent(event));
      }, unstable_pressDelay);
    } else {
      pressInHandler(gestureTouchToPressableEvent(event));
    }

    (_onEndHandlingTouches = onEndHandlingTouchesDown.current) === null || _onEndHandlingTouches === void 0 ? void 0 : _onEndHandlingTouches.call(onEndHandlingTouchesDown);
    onEndHandlingTouchesDown.current = null;
    handlingOnTouchesDown.current = false;
  }, [activateLongPress, longPressMinDuration, normalizedHitSlop, pressInHandler, unstable_pressDelay]);
  const pressAndTouchGesture = useMemo(() => Gesture.LongPress().minDuration(INT32_MAX) // Stops long press from blocking native gesture
  .maxDistance(INT32_MAX) // Stops long press from cancelling after set distance
  .cancelsTouchesInView(false).onTouchesDown(event => {
    handlingOnTouchesDown.current = true;

    if (pressableRef) {
      var _current;

      (_current = pressableRef.current) === null || _current === void 0 ? void 0 : _current.measure((_x, _y, width, height) => {
        measureCallback(width, height, event);
      });
    } else {
      var _innerPressableRef$cu;

      (_innerPressableRef$cu = innerPressableRef.current) === null || _innerPressableRef$cu === void 0 ? void 0 : _innerPressableRef$cu.measure((_x, _y, width, height) => {
        measureCallback(width, height, event);
      });
    }
  }).onTouchesUp(event => {
    if (handlingOnTouchesDown.current) {
      onEndHandlingTouchesDown.current = () => pressOutHandler(gestureTouchToPressableEvent(event));

      return;
    } // On iOS, short taps will make LongPress gesture call onTouchesUp before Native gesture calls onStart
    // This variable ensures that onStart isn't detected as the first gesture since Pressable is pressed.


    if (deferredEventPayload.current !== null) {
      shouldPreventNativeEffects.current = true;
    }

    pressOutHandler(gestureTouchToPressableEvent(event));
  }).onTouchesCancelled(event => {
    isPressCallbackEnabled.current = false;

    if (handlingOnTouchesDown.current) {
      cancelledMidPress.current = true;

      onEndHandlingTouchesDown.current = () => pressOutHandler(gestureTouchToPressableEvent(event));

      return;
    }

    if (!hasPassedBoundsChecks.current || event.allTouches.length > event.changedTouches.length) {
      return;
    }

    pressOutHandler(gestureTouchToPressableEvent(event));
  }), [pressableRef, measureCallback, pressOutHandler]); // RNButton is placed inside ButtonGesture to enable Android's ripple and to capture non-propagating events

  const buttonGesture = useMemo(() => Gesture.Native().onBegin(() => {
    // Android sets BEGAN state on press down
    if (Platform.OS === 'android' || Platform.OS === 'macos') {
      isTouchPropagationAllowed.current = true;
    }
  }).onStart(() => {
    if (Platform.OS === 'web') {
      isTouchPropagationAllowed.current = true;
    } // iOS sets ACTIVE state on press down


    if (Platform.OS !== 'ios') {
      return;
    }

    if (deferredEventPayload.current) {
      isTouchPropagationAllowed.current = true;

      if (hasPassedBoundsChecks.current) {
        pressInHandler(deferredEventPayload.current);
        deferredEventPayload.current = null;
      } else {
        pressOutHandler(deferredEventPayload.current);
        isTouchPropagationAllowed.current = false;
      }

      return;
    }

    if (hasPassedBoundsChecks.current) {
      isTouchPropagationAllowed.current = true;
      return;
    }

    if (shouldPreventNativeEffects.current) {
      shouldPreventNativeEffects.current = false;

      if (!handlingOnTouchesDown.current) {
        return;
      }
    }

    isTouchPropagationAllowed.current = true;
  }), [pressInHandler, pressOutHandler]);
  const appliedHitSlop = addInsets(normalizedHitSlop, normalizedPressRetentionOffset);
  const isPressableEnabled = disabled !== true;
  const gestures = [buttonGesture, pressAndTouchGesture, hoverGesture];

  for (const gesture of gestures) {
    gesture.enabled(isPressableEnabled);
    gesture.runOnJS(true);
    gesture.hitSlop(appliedHitSlop);
    gesture.shouldCancelWhenOutside(Platform.OS === 'web' ? false : true);
  } // Uses different hitSlop, to activate on hitSlop area instead of pressRetentionOffset area


  buttonGesture.hitSlop(normalizedHitSlop);
  const gesture = Gesture.Simultaneous(...gestures); // `cursor: 'pointer'` on `RNButton` crashes iOS

  const pointerStyle = Platform.OS === 'web' ? {
    cursor: 'pointer'
  } : {};
  const styleProp = typeof style === 'function' ? style({
    pressed: pressedState
  }) : style;
  const childrenProp = typeof children === 'function' ? children({
    pressed: pressedState
  }) : children;
  const rippleColor = useMemo(() => {
    var _android_ripple$color;

    if (IS_FABRIC === null) {
      IS_FABRIC = isFabric();
    }

    const defaultRippleColor = android_ripple ? undefined : 'transparent';
    const unprocessedRippleColor = (_android_ripple$color = android_ripple === null || android_ripple === void 0 ? void 0 : android_ripple.color) !== null && _android_ripple$color !== void 0 ? _android_ripple$color : defaultRippleColor;
    return IS_FABRIC ? unprocessedRippleColor : processColor(unprocessedRippleColor);
  }, [android_ripple]);
  return /*#__PURE__*/React.createElement(GestureDetector, {
    gesture: gesture
  }, /*#__PURE__*/React.createElement(NativeButton, _extends({}, remainingProps, {
    ref: pressableRef !== null && pressableRef !== void 0 ? pressableRef : innerPressableRef,
    accessible: accessible !== false,
    hitSlop: appliedHitSlop,
    enabled: isPressableEnabled,
    touchSoundDisabled: android_disableSound !== null && android_disableSound !== void 0 ? android_disableSound : undefined,
    rippleColor: rippleColor,
    rippleRadius: (_android_ripple$radiu = android_ripple === null || android_ripple === void 0 ? void 0 : android_ripple.radius) !== null && _android_ripple$radiu !== void 0 ? _android_ripple$radiu : undefined,
    style: [pointerStyle, styleProp],
    testOnly_onPress: IS_TEST_ENV ? onPress : undefined,
    testOnly_onPressIn: IS_TEST_ENV ? onPressIn : undefined,
    testOnly_onPressOut: IS_TEST_ENV ? onPressOut : undefined,
    testOnly_onLongPress: IS_TEST_ENV ? onLongPress : undefined
  }), childrenProp, __DEV__ ? /*#__PURE__*/React.createElement(PressabilityDebugView, {
    color: "red",
    hitSlop: normalizedHitSlop
  }) : null));
});
export default Pressable;
//# sourceMappingURL=Pressable.js.map