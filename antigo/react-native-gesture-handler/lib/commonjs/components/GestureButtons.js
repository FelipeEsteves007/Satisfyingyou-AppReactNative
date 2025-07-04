"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "PureNativeButton", {
  enumerable: true,
  get: function () {
    return _GestureHandlerButton.default;
  }
});
exports.BorderlessButton = exports.RectButton = exports.BaseButton = exports.RawButton = void 0;

var React = _interopRequireWildcard(require("react"));

var _reactNative = require("react-native");

var _createNativeWrapper = _interopRequireDefault(require("../handlers/createNativeWrapper"));

var _GestureHandlerButton = _interopRequireDefault(require("./GestureHandlerButton"));

var _State = require("../State");

var _utils = require("../utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const RawButton = (0, _createNativeWrapper.default)(_GestureHandlerButton.default, {
  shouldCancelWhenOutside: false,
  shouldActivateOnStart: false
});
exports.RawButton = RawButton;
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
      const active = pointerInside && state === _State.State.ACTIVE;

      if (active !== this.lastActive && this.props.onActiveStateChange) {
        this.props.onActiveStateChange(active);
      }

      if (!this.longPressDetected && oldState === _State.State.ACTIVE && state !== _State.State.CANCELLED && this.lastActive && this.props.onPress) {
        this.props.onPress(pointerInside);
      }

      if (!this.lastActive && // NativeViewGestureHandler sends different events based on platform
      state === (_reactNative.Platform.OS !== 'android' ? _State.State.ACTIVE : _State.State.BEGAN) && pointerInside) {
        this.longPressDetected = false;

        if (this.props.onLongPress) {
          this.longPressTimeout = setTimeout(this.onLongPress, this.props.delayLongPress);
        }
      } else if ( // Cancel longpress timeout if it's set and the finger moved out of the view
      state === _State.State.ACTIVE && !pointerInside && this.longPressTimeout !== undefined) {
        clearTimeout(this.longPressTimeout);
        this.longPressTimeout = undefined;
      } else if ( // Cancel longpress timeout if it's set and the gesture has finished
      this.longPressTimeout !== undefined && (state === _State.State.END || state === _State.State.CANCELLED || state === _State.State.FAILED)) {
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
      IS_FABRIC = (0, _utils.isFabric)();
    }

    const rippleColor = IS_FABRIC ? unprocessedRippleColor : (0, _reactNative.processColor)(unprocessedRippleColor !== null && unprocessedRippleColor !== void 0 ? unprocessedRippleColor : undefined);
    return /*#__PURE__*/React.createElement(RawButton, _extends({
      ref: this.props.innerRef,
      rippleColor: rippleColor,
      style: [style, _reactNative.Platform.OS === 'ios' && {
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

const AnimatedInnerBaseButton = _reactNative.Animated.createAnimatedComponent(InnerBaseButton);

const BaseButton = /*#__PURE__*/React.forwardRef((props, ref) => /*#__PURE__*/React.createElement(InnerBaseButton, _extends({
  innerRef: ref
}, props)));
exports.BaseButton = BaseButton;
const AnimatedBaseButton = /*#__PURE__*/React.forwardRef((props, ref) => /*#__PURE__*/React.createElement(AnimatedInnerBaseButton, _extends({
  innerRef: ref
}, props)));

const btnStyles = _reactNative.StyleSheet.create({
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

      if (_reactNative.Platform.OS !== 'android') {
        this.opacity.setValue(active ? this.props.activeOpacity : 0);
      }

      (_this$props$onActiveS = (_this$props4 = this.props).onActiveStateChange) === null || _this$props$onActiveS === void 0 ? void 0 : _this$props$onActiveS.call(_this$props4, active);
    });

    this.opacity = new _reactNative.Animated.Value(0);
  }

  render() {
    const {
      children,
      style,
      ...rest
    } = this.props;

    const resolvedStyle = _reactNative.StyleSheet.flatten(style !== null && style !== void 0 ? style : {});

    return /*#__PURE__*/React.createElement(BaseButton, _extends({}, rest, {
      ref: this.props.innerRef,
      style: resolvedStyle,
      onActiveStateChange: this.onActiveStateChange
    }), /*#__PURE__*/React.createElement(_reactNative.Animated.View, {
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

const RectButton = /*#__PURE__*/React.forwardRef((props, ref) => /*#__PURE__*/React.createElement(InnerRectButton, _extends({
  innerRef: ref
}, props)));
exports.RectButton = RectButton;

class InnerBorderlessButton extends React.Component {
  constructor(props) {
    super(props);

    _defineProperty(this, "opacity", void 0);

    _defineProperty(this, "onActiveStateChange", active => {
      var _this$props$onActiveS2, _this$props5;

      if (_reactNative.Platform.OS !== 'android') {
        this.opacity.setValue(active ? this.props.activeOpacity : 1);
      }

      (_this$props$onActiveS2 = (_this$props5 = this.props).onActiveStateChange) === null || _this$props$onActiveS2 === void 0 ? void 0 : _this$props$onActiveS2.call(_this$props5, active);
    });

    this.opacity = new _reactNative.Animated.Value(1);
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
      style: [style, _reactNative.Platform.OS === 'ios' && {
        opacity: this.opacity
      }]
    }), children);
  }

}

_defineProperty(InnerBorderlessButton, "defaultProps", {
  activeOpacity: 0.3,
  borderless: true
});

const BorderlessButton = /*#__PURE__*/React.forwardRef((props, ref) => /*#__PURE__*/React.createElement(InnerBorderlessButton, _extends({
  innerRef: ref
}, props)));
exports.BorderlessButton = BorderlessButton;
//# sourceMappingURL=GestureButtons.js.map