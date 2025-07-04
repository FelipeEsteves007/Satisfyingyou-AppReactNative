"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.NativeViewGestureHandler = exports.nativeViewHandlerName = exports.nativeViewProps = exports.nativeViewGestureHandlerProps = void 0;

var _createHandler = _interopRequireDefault(require("./createHandler"));

var _gestureHandlerCommon = require("./gestureHandlerCommon");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const nativeViewGestureHandlerProps = ['shouldActivateOnStart', 'disallowInterruption'];
exports.nativeViewGestureHandlerProps = nativeViewGestureHandlerProps;
const nativeViewProps = [..._gestureHandlerCommon.baseGestureHandlerProps, ...nativeViewGestureHandlerProps];
exports.nativeViewProps = nativeViewProps;
const nativeViewHandlerName = 'NativeViewGestureHandler';
/**
 * @deprecated NativeViewGestureHandler will be removed in the future version of Gesture Handler. Use `Gesture.Native()` instead.
 */

exports.nativeViewHandlerName = nativeViewHandlerName;

/**
 * @deprecated NativeViewGestureHandler will be removed in the future version of Gesture Handler. Use `Gesture.Native()` instead.
 */
// eslint-disable-next-line @typescript-eslint/no-redeclare -- backward compatibility; see description on the top of gestureHandlerCommon.ts file
const NativeViewGestureHandler = (0, _createHandler.default)({
  name: nativeViewHandlerName,
  allowedProps: nativeViewProps,
  config: {}
});
exports.NativeViewGestureHandler = NativeViewGestureHandler;
//# sourceMappingURL=NativeViewGestureHandler.js.map