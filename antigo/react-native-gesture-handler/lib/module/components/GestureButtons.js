function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import * as React from 'react';
import { Animated, Platform, processColor, StyleSheet } from 'react-native';
import createNativeWrapper from '../handlers/createNativeWrapper';
import GestureHandlerButton from './GestureHandlerButton';
import { State } from '../State';
import { isFabric } from '../utils';
export const RawButton = createNativeWrapper(GestureHandlerButton, {
  shouldCancelWhenOutside: false,
  shouldActivateOnStart: false
});
let IS_FABRIC = null;

class InnerBaseButton extends React.Component {
  constructor(props) {
    super(props);

    _defineProperty(this, "lastActive", void 0);

    _defineProperty(this, "longPressTimeout", void 0);

    _defineProperty(this, "longPressDetected", void 0);

    _defineProperty(this, "handleEvent", ({
      nativeEvent
    }) => {
      const {
        state,
        oldState,
        pointerInside
      } = nativeEvent;
      const active = pointerInside && state === State.ACTIVE;

      if (active !== this.lastActive && this.props.onActiveStateChange) {
        this.props.onActiveStateChange(active);
      }

      if (!this.longPressDetected && oldState === State.ACTIVE && state !== State.CANCELLED && this.lastActive && this.props.onPress) {
        this.props.onPress(pointerInside);
      }

      if (!this.lastActive && // NativeViewGestureHandler sends different events based on platform
      state === (Platform.OS !== 'android' ? State.ACTIVE : State.BEGAN) && pointerInside) {
        this.longPressDetected = false;

        if (this.props.onLongPress) {
          this.longPressTimeout = setTimeout(this.onLongPress, this.props.delayLongPress);
        }
      } else if ( // Cancel longpress timeout if it's set and the finger moved out of the view
      state === State.ACTIVE && !pointerInside && this.longPressTimeout !== undefined) {
        clearTimeout(this.longPressTimeout);
        this.longPressTimeout = undefined;
      } else if ( // Cancel longpress timeout if it's set and the gesture has finished
      this.longPressTimeout !== undefined && (state === State.END || state === State.CANCELLED || state === State.FAILED)) {
        clearTimeout(this.longPressTimeout);
        this.longPressTimeout = undefined;
      }

      this.lastActive = active;
    });

    _defineProperty(this, "onLongPress", () => {
      var _this$props$onLongPre, _this$props;

      this.longPressDetected = true;
      (_this$props$onLongPre = (_this$props = this.props).onLongPress) === null || _this$props$onLongPre === void 0 ? void 0 : _this$props$onLongPre.call(_this$props);
    });

    _defineProperty(this, "onHandlerStateChange", e => {
      var _this$props$onHandler, _this$props2;

      (_this$props$onHandler = (_this$props2 = this.props).onHandlerStateChange) === null || _this$props$onHandler === void 0 ? void 0 : _this$props$onHandler.call(_this$props2, e);
      this.handleEvent(e);
    });

    _defineProperty(this, "onGestureEvent", e => {
      var _this$props$onGesture, _this$props3;

      (_this$props$onGesture = (_this$props3 = this.props).onGestureEvent) === null || _this$props$onGesture === void 0 ? void 0 : _this$props$onGesture.call(_this$props3, e);
      this.handleEvent(e); // TODO: maybe it is not correct
    });

    this.lastActive = false;
    this.longPressDetected = false;
  }

  render() {
    const {
      rippleColor: unprocessedRippleColor,
      style,
      ...rest
    } = this.props;

    if (IS_FABRIC === null) {
      IS_FABRIC = isFabric();
    }

    const rippleColor = IS_FABRIC ? unprocessedRippleColor : processColor(unprocessedRippleColor !== null && unprocessedRippleColor !== void 0 ? unprocessedRippleColor : undefined);
    return /*#__PURE__*/React.createElement(RawButton, _extends({
      ref: this.props.innerRef,
      rippleColor: rippleColor,
      style: [style, Platform.OS === 'ios' && {
        cursor: undefined
      }]
    }, rest, {
      onGestureEvent: this.onGestureEvent,
      onHandlerStateChange: this.onHandlerStateChange
    }));
  }

}

_defineProperty(InnerBaseButton, "defaultProps", {
  delayLongPress: 600
});

const AnimatedInnerBaseButton = Animated.createAnimatedComponent(InnerBaseButton);
export const BaseButton = /*#__PURE__*/React.forwardRef((props, ref) => /*#__PURE__*/React.createElement(InnerBaseButton, _extends({
  innerRef: ref
}, props)));
const AnimatedBaseButton = /*#__PURE__*/React.forwardRef((props, ref) => /*#__PURE__*/React.createElement(AnimatedInnerBaseButton, _extends({
  innerRef: ref
}, props)));
const btnStyles = StyleSheet.create({
  underlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0
  }
});

class InnerRectButton extends React.Component {
  constructor(props) {
    super(props);

    _defineProperty(this, "opacity", void 0);

    _defineProperty(this, "onActiveStateChange", active => {
      var _this$props$onActiveS, _this$props4;

      if (Platform.OS !== 'android') {
        this.opacity.setValue(active ? this.props.activeOpacity : 0);
      }

      (_this$props$onActiveS = (_this$props4 = this.props).onActiveStateChange) === null || _this$props$onActiveS === void 0 ? void 0 : _this$props$onActiveS.call(_this$props4, active);
    });

    this.opacity = new Animated.Value(0);
  }

  render() {
    const {
      children,
      style,
      ...rest
    } = this.props;
    const resolvedStyle = StyleSheet.flatten(style !== null && style !== void 0 ? style : {});
    return /*#__PURE__*/React.createElement(BaseButton, _extends({}, rest, {
      ref: this.props.innerRef,
      style: resolvedStyle,
      onActiveStateChange: this.onActiveStateChange
    }), /*#__PURE__*/React.createElement(Animated.View, {
      style: [btnStyles.underlay, {
        opacity: this.opacity,
        backgroundColor: this.props.underlayColor,
        borderRadius: resolvedStyle.borderRadius,
        borderTopLeftRadius: resolvedStyle.borderTopLeftRadius,
        borderTopRightRadius: resolvedStyle.borderTopRightRadius,
        borderBottomLeftRadius: resolvedStyle.borderBottomLeftRadius,
        borderBottomRightRadius: resolvedStyle.borderBottomRightRadius
      }]
    }), children);
  }

}

_defineProperty(InnerRectButton, "defaultProps", {
  activeOpacity: 0.105,
  underlayColor: 'black'
});

export const RectButton = /*#__PURE__*/React.forwardRef((props, ref) => /*#__PURE__*/React.createElement(InnerRectButton, _extends({
  innerRef: ref
}, props)));

class InnerBorderlessButton extends React.Component {
  constructor(props) {
    super(props);

    _defineProperty(this, "opacity", void 0);

    _defineProperty(this, "onActiveStateChange", active => {
      var _this$props$onActiveS2, _this$props5;

      if (Platform.OS !== 'android') {
        this.opacity.setValue(active ? this.props.activeOpacity : 1);
      }

      (_this$props$onActiveS2 = (_this$props5 = this.props).onActiveStateChange) === null || _this$props$onActiveS2 === void 0 ? void 0 : _this$props$onActiveS2.call(_this$props5, active);
    });

    this.opacity = new Animated.Value(1);
  }

  render() {
    const {
      children,
      style,
      innerRef,
      ...rest
    } = this.props;
    return /*#__PURE__*/React.createElement(AnimatedBaseButton, _extends({}, rest, {
      innerRef: innerRef,
      onActiveStateChange: this.onActiveStateChange,
      style: [style, Platform.OS === 'ios' && {
        opacity: this.opacity
      }]
    }), children);
  }

}

_defineProperty(InnerBorderlessButton, "defaultProps", {
  activeOpacity: 0.3,
  borderless: true
});

export const BorderlessButton = /*#__PURE__*/React.forwardRef((props, ref) => /*#__PURE__*/React.createElement(InnerBorderlessButton, _extends({
  innerRef: ref
}, props)));
export { default as PureNativeButton } from './GestureHandlerButton';
//# sourceMappingURL=GestureButtons.js.map