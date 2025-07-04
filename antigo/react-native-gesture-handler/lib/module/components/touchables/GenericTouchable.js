function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import * as React from 'react';
import { Component } from 'react';
import { Animated, Platform } from 'react-native';
import { State } from '../../State';
import { BaseButton } from '../GestureButtons';

/**
 * Each touchable is a states' machine which preforms transitions.
 * On very beginning (and on the very end or recognition) touchable is
 * UNDETERMINED. Then it moves to BEGAN. If touchable recognizes that finger
 * travel outside it transits to special MOVED_OUTSIDE state. Gesture recognition
 * finishes in UNDETERMINED state.
 */
export const TOUCHABLE_STATE = {
  UNDETERMINED: 0,
  BEGAN: 1,
  MOVED_OUTSIDE: 2
};

/**
 * GenericTouchable is not intented to be used as it is.
 * Should be treated as a source for the rest of touchables
 */
export default class GenericTouchable extends Component {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "pressInTimeout", void 0);

    _defineProperty(this, "pressOutTimeout", void 0);

    _defineProperty(this, "longPressTimeout", void 0);

    _defineProperty(this, "longPressDetected", false);

    _defineProperty(this, "pointerInside", true);

    _defineProperty(this, "STATE", TOUCHABLE_STATE.UNDETERMINED);

    _defineProperty(this, "onGestureEvent", ({
      nativeEvent: {
        pointerInside
      }
    }) => {
      if (this.pointerInside !== pointerInside) {
        if (pointerInside) {
          this.onMoveIn();
        } else {
          this.onMoveOut();
        }
      }

      this.pointerInside = pointerInside;
    });

    _defineProperty(this, "onHandlerStateChange", ({
      nativeEvent
    }) => {
      const {
        state
      } = nativeEvent;

      if (state === State.CANCELLED || state === State.FAILED) {
        // Need to handle case with external cancellation (e.g. by ScrollView)
        this.moveToState(TOUCHABLE_STATE.UNDETERMINED);
      } else if ( // This platform check is an implication of slightly different behavior of handlers on different platform.
      // And Android "Active" state is achieving on first move of a finger, not on press in.
      // On iOS event on "Began" is not delivered.
      state === (Platform.OS !== 'android' ? State.ACTIVE : State.BEGAN) && this.STATE === TOUCHABLE_STATE.UNDETERMINED) {
        // Moving inside requires
        this.handlePressIn();
      } else if (state === State.END) {
        const shouldCallOnPress = !this.longPressDetected && this.STATE !== TOUCHABLE_STATE.MOVED_OUTSIDE && this.pressOutTimeout === null;
        this.handleGoToUndetermined();

        if (shouldCallOnPress) {
          var _this$props$onPress, _this$props;

          // Calls only inside component whether no long press was called previously
          (_this$props$onPress = (_this$props = this.props).onPress) === null || _this$props$onPress === void 0 ? void 0 : _this$props$onPress.call(_this$props);
        }
      }
    });

    _defineProperty(this, "onLongPressDetected", () => {
      var _this$props$onLongPre, _this$props2;

      this.longPressDetected = true; // Checked for in the caller of `onLongPressDetected`, but better to check twice

      (_this$props$onLongPre = (_this$props2 = this.props).onLongPress) === null || _this$props$onLongPre === void 0 ? void 0 : _this$props$onLongPre.call(_this$props2);
    });
  }

  // handlePressIn in called on first touch on traveling inside component.
  // Handles state transition with delay.
  handlePressIn() {
    if (this.props.delayPressIn) {
      this.pressInTimeout = setTimeout(() => {
        this.moveToState(TOUCHABLE_STATE.BEGAN);
        this.pressInTimeout = null;
      }, this.props.delayPressIn);
    } else {
      this.moveToState(TOUCHABLE_STATE.BEGAN);
    }

    if (this.props.onLongPress) {
      const time = (this.props.delayPressIn || 0) + (this.props.delayLongPress || 0);
      this.longPressTimeout = setTimeout(this.onLongPressDetected, time);
    }
  } // handleMoveOutside in called on traveling outside component.
  // Handles state transition with delay.


  handleMoveOutside() {
    if (this.props.delayPressOut) {
      this.pressOutTimeout = this.pressOutTimeout || setTimeout(() => {
        this.moveToState(TOUCHABLE_STATE.MOVED_OUTSIDE);
        this.pressOutTimeout = null;
      }, this.props.delayPressOut);
    } else {
      this.moveToState(TOUCHABLE_STATE.MOVED_OUTSIDE);
    }
  } // handleGoToUndetermined transits to UNDETERMINED state with proper delay


  handleGoToUndetermined() {
    clearTimeout(this.pressOutTimeout); // TODO: maybe it can be undefined

    if (this.props.delayPressOut) {
      this.pressOutTimeout = setTimeout(() => {
        if (this.STATE === TOUCHABLE_STATE.UNDETERMINED) {
          this.moveToState(TOUCHABLE_STATE.BEGAN);
        }

        this.moveToState(TOUCHABLE_STATE.UNDETERMINED);
        this.pressOutTimeout = null;
      }, this.props.delayPressOut);
    } else {
      if (this.STATE === TOUCHABLE_STATE.UNDETERMINED) {
        this.moveToState(TOUCHABLE_STATE.BEGAN);
      }

      this.moveToState(TOUCHABLE_STATE.UNDETERMINED);
    }
  }

  componentDidMount() {
    this.reset();
  } // Reset timeout to prevent memory leaks.


  reset() {
    this.longPressDetected = false;
    this.pointerInside = true;
    clearTimeout(this.pressInTimeout);
    clearTimeout(this.pressOutTimeout);
    clearTimeout(this.longPressTimeout);
    this.pressOutTimeout = null;
    this.longPressTimeout = null;
    this.pressInTimeout = null;
  } // All states' transitions are defined here.


  moveToState(newState) {
    var _this$props$onStateCh, _this$props6;

    if (newState === this.STATE) {
      // Ignore dummy transitions
      return;
    }

    if (newState === TOUCHABLE_STATE.BEGAN) {
      var _this$props$onPressIn, _this$props3;

      // First touch and moving inside
      (_this$props$onPressIn = (_this$props3 = this.props).onPressIn) === null || _this$props$onPressIn === void 0 ? void 0 : _this$props$onPressIn.call(_this$props3);
    } else if (newState === TOUCHABLE_STATE.MOVED_OUTSIDE) {
      var _this$props$onPressOu, _this$props4;

      // Moving outside
      (_this$props$onPressOu = (_this$props4 = this.props).onPressOut) === null || _this$props$onPressOu === void 0 ? void 0 : _this$props$onPressOu.call(_this$props4);
    } else if (newState === TOUCHABLE_STATE.UNDETERMINED) {
      // Need to reset each time on transition to UNDETERMINED
      this.reset();

      if (this.STATE === TOUCHABLE_STATE.BEGAN) {
        var _this$props$onPressOu2, _this$props5;

        // ... and if it happens inside button.
        (_this$props$onPressOu2 = (_this$props5 = this.props).onPressOut) === null || _this$props$onPressOu2 === void 0 ? void 0 : _this$props$onPressOu2.call(_this$props5);
      }
    } // Finally call lister (used by subclasses)


    (_this$props$onStateCh = (_this$props6 = this.props).onStateChange) === null || _this$props$onStateCh === void 0 ? void 0 : _this$props$onStateCh.call(_this$props6, this.STATE, newState); // ... and make transition.

    this.STATE = newState;
  }

  componentWillUnmount() {
    // To prevent memory leaks
    this.reset();
  }

  onMoveIn() {
    if (this.STATE === TOUCHABLE_STATE.MOVED_OUTSIDE) {
      // This call is not throttled with delays (like in RN's implementation).
      this.moveToState(TOUCHABLE_STATE.BEGAN);
    }
  }

  onMoveOut() {
    // Long press should no longer be detected
    clearTimeout(this.longPressTimeout);
    this.longPressTimeout = null;

    if (this.STATE === TOUCHABLE_STATE.BEGAN) {
      this.handleMoveOutside();
    }
  }

  render() {
    var _ref, _this$props$touchSoun;

    const hitSlop = (_ref = typeof this.props.hitSlop === 'number' ? {
      top: this.props.hitSlop,
      left: this.props.hitSlop,
      bottom: this.props.hitSlop,
      right: this.props.hitSlop
    } : this.props.hitSlop) !== null && _ref !== void 0 ? _ref : undefined;
    const coreProps = {
      accessible: this.props.accessible !== false,
      accessibilityLabel: this.props.accessibilityLabel,
      accessibilityHint: this.props.accessibilityHint,
      accessibilityRole: this.props.accessibilityRole,
      // TODO: check if changed to no 's' correctly, also removed 2 props that are no longer available: `accessibilityComponentType` and `accessibilityTraits`,
      // would be good to check if it is ok for sure, see: https://github.com/facebook/react-native/issues/24016
      accessibilityState: this.props.accessibilityState,
      accessibilityActions: this.props.accessibilityActions,
      onAccessibilityAction: this.props.onAccessibilityAction,
      nativeID: this.props.nativeID,
      onLayout: this.props.onLayout
    };
    return /*#__PURE__*/React.createElement(BaseButton, _extends({
      style: this.props.containerStyle,
      onHandlerStateChange: // TODO: not sure if it can be undefined instead of null
      this.props.disabled ? undefined : this.onHandlerStateChange,
      onGestureEvent: this.onGestureEvent,
      hitSlop: hitSlop,
      userSelect: this.props.userSelect,
      shouldActivateOnStart: this.props.shouldActivateOnStart,
      disallowInterruption: this.props.disallowInterruption,
      testID: this.props.testID,
      touchSoundDisabled: (_this$props$touchSoun = this.props.touchSoundDisabled) !== null && _this$props$touchSoun !== void 0 ? _this$props$touchSoun : false,
      enabled: !this.props.disabled
    }, this.props.extraButtonProps), /*#__PURE__*/React.createElement(Animated.View, _extends({}, coreProps, {
      style: this.props.style
    }), this.props.children));
  }

}

_defineProperty(GenericTouchable, "defaultProps", {
  delayLongPress: 600,
  extraButtonProps: {
    rippleColor: 'transparent',
    exclusive: true
  }
});
//# sourceMappingURL=GenericTouchable.js.map