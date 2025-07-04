import React, { PropsWithChildren } from 'react';
import { BaseGestureHandlerProps } from './gestureHandlerCommon';
import type { ForceTouchGestureHandlerEventPayload } from './GestureHandlerEventPayload';
export declare const forceTouchGestureHandlerProps: readonly ["minForce", "maxForce", "feedbackOnActivation"];
declare class ForceTouchFallback extends React.Component<PropsWithChildren<unknown>> {
    static forceTouchAvailable: boolean;
    componentDidMount(): void;
    render(): React.ReactNode;
}
export interface ForceTouchGestureConfig {
    /**
     *
     * A minimal pressure that is required before handler can activate. Should be a
     * value from range `[0.0, 1.0]`. Default is `0.2`.
     */
    minForce?: number;
    /**
     * A maximal pressure that could be applied for handler. If the pressure is
     * greater, handler fails. Should be a value from range `[0.0, 1.0]`.
     */
    maxForce?: number;
    /**
     * Boolean value defining if haptic feedback has to be performed on
     * activation.
     */
    feedbackOnActivation?: boolean;
}
/**
 * @deprecated ForceTouchGestureHandler will be removed in the future version of Gesture Handler. Use `Gesture.ForceTouch()` instead.
 */
export interface ForceTouchGestureHandlerProps extends BaseGestureHandlerProps<ForceTouchGestureHandlerEventPayload>, ForceTouchGestureConfig {
}
/**
 * @deprecated ForceTouchGestureHandler will be removed in the future version of Gesture Handler. Use `Gesture.ForceTouch()` instead.
 */
export type ForceTouchGestureHandler = typeof ForceTouchGestureHandler & {
    forceTouchAvailable: boolean;
};
export declare const forceTouchHandlerName = "ForceTouchGestureHandler";
/**
 * @deprecated ForceTouchGestureHandler will be removed in the future version of Gesture Handler. Use `Gesture.ForceTouch()` instead.
 */
export declare const ForceTouchGestureHandler: typeof ForceTouchFallback | React.ComponentType<ForceTouchGestureHandlerProps & React.RefAttributes<any>>;
export {};
