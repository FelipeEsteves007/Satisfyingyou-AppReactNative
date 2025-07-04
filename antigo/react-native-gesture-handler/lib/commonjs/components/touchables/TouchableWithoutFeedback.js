"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var React = _interopRequireWildcard(require("react"));

var _GenericTouchable = _interopRequireDefault(require("./GenericTouchable"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

/**
 * @deprecated TouchableWithoutFeedback will be removed in the future version of Gesture Handler. Use Pressable instead.
 */
const TouchableWithoutFeedback = /*#__PURE__*/React.forwardRef(({
  delayLongPress = 600,
  extraButtonProps = {
    rippleColor: 'transparent',
    exclusive: true
  },
  ...rest
}, ref) => /*#__PURE__*/React.createElement(_GenericTouchable.default, _extends({
  ref: ref,
  delayLongPress: delayLongPress,
  extraButtonProps: extraButtonProps
}, rest)));
var _default = TouchableWithoutFeedback;
exports.default = _default;
//# sourceMappingURL=TouchableWithoutFeedback.js.map