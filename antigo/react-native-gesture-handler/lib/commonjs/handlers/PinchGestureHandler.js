"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PinchGestureHandler = exports.pinchHandlerName = void 0;

var _createHandler = _interopRequireDefault(require("./createHandler"));

var _gestureHandlerCommon = require("./gestureHandlerCommon");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const pinchHandlerName = 'PinchGestureHandler';
/**
 * @deprecated PinchGestureHandler will be removed in the future version of Gesture Handler. Use `Gesture.Pinch()` instead.
 */

exports.pinchHandlerName = pinchHandlerName;

/**
 * @deprecated PinchGestureHandler will be removed in the future version of Gesture Handler. Use `Gesture.Pinch()` instead.
 */
// eslint-disable-next-line @typescript-eslint/no-redeclare -- backward compatibility; see description on the top of gestureHandlerCommon.ts file
const PinchGestureHandler = (0, _createHandler.default)({
  name: pinchHandlerName,
  allowedProps: _gestureHandlerCommon.baseGestureHandlerProps,
  config: {}
});
exports.PinchGestureHandler = PinchGestureHandler;
//# sourceMappingURL=PinchGestureHandler.js.map