"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createNativeWrapper;

var React = _interopRequireWildcard(require("react"));

var _NativeViewGestureHandler = require("./NativeViewGestureHandler");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

/*
 * This array should consist of:
 *   - All keys in propTypes from NativeGestureHandler
 *     (and all keys in GestureHandlerPropTypes)
 *   - 'onGestureHandlerEvent'
 *   - 'onGestureHandlerStateChange'
 */
const NATIVE_WRAPPER_PROPS_FILTER = [..._NativeViewGestureHandler.nativeViewProps, 'onGestureHandlerEvent', 'onGestureHandlerStateChange'];

function createNativeWrapper(Component, config = {}) {
  var _Component$render;

  const ComponentWrapper = /*#__PURE__*/React.forwardRef((props, ref) => {
    // Filter out props that should be passed to gesture handler wrapper
    const {
      gestureHandlerProps,
      childProps
    } = Object.keys(props).reduce((res, key) => {
      // TS being overly protective with it's types, see https://github.com/microsoft/TypeScript/issues/26255#issuecomment-458013731 for more info
      const allowedKeys = NATIVE_WRAPPER_PROPS_FILTER;

      if (allowedKeys.includes(key)) {
        // @ts-ignore FIXME(TS)
        res.gestureHandlerProps[key] = props[key];
      } else {
        // @ts-ignore FIXME(TS)
        res.childProps[key] = props[key];
      }

      return res;
    }, {
      gestureHandlerProps: { ...config
      },
      // Watch out not to modify config
      childProps: {
        enabled: props.enabled,
        hitSlop: props.hitSlop,
        testID: props.testID
      }
    });

    const _ref = (0, React.useRef)(null);

    const _gestureHandlerRef = (0, React.useRef)(null);

    (0, React.useImperativeHandle)(ref, // @ts-ignore TODO(TS) decide how nulls work in this context
    () => {
      const node = _gestureHandlerRef.current; // Add handlerTag for relations config

      if (_ref.current && node) {
        // @ts-ignore FIXME(TS) think about createHandler return type
        _ref.current.handlerTag = node.handlerTag;
        return _ref.current;
      }

      return null;
    }, [_ref, _gestureHandlerRef]);
    return /*#__PURE__*/React.createElement(_NativeViewGestureHandler.NativeViewGestureHandler, _extends({}, gestureHandlerProps, {
      // @ts-ignore TODO(TS)
      ref: _gestureHandlerRef
    }), /*#__PURE__*/React.createElement(Component, _extends({}, childProps, {
      ref: _ref
    })));
  }); // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment

  ComponentWrapper.displayName = (Component === null || Component === void 0 ? void 0 : Component.displayName) || ( // @ts-ignore if render doesn't exist it will return undefined and go further
  Component === null || Component === void 0 ? void 0 : (_Component$render = Component.render) === null || _Component$render === void 0 ? void 0 : _Component$render.name) || typeof Component === 'string' && Component || 'ComponentWrapper';
  return ComponentWrapper;
}
//# sourceMappingURL=createNativeWrapper.js.map