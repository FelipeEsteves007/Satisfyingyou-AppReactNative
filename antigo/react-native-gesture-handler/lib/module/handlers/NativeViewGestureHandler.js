import createHandler from './createHandler';
import { baseGestureHandlerProps } from './gestureHandlerCommon';
export const nativeViewGestureHandlerProps = ['shouldActivateOnStart', 'disallowInterruption'];
export const nativeViewProps = [...baseGestureHandlerProps, ...nativeViewGestureHandlerProps];
export const nativeViewHandlerName = 'NativeViewGestureHandler';
/**
 * @deprecated NativeViewGestureHandler will be removed in the future version of Gesture Handler. Use `Gesture.Native()` instead.
 */

/**
 * @deprecated NativeViewGestureHandler will be removed in the future version of Gesture Handler. Use `Gesture.Native()` instead.
 */
// eslint-disable-next-line @typescript-eslint/no-redeclare -- backward compatibility; see description on the top of gestureHandlerCommon.ts file
export const NativeViewGestureHandler = createHandler({
  name: nativeViewHandlerName,
  allowedProps: nativeViewProps,
  config: {}
});
//# sourceMappingURL=NativeViewGestureHandler.js.map