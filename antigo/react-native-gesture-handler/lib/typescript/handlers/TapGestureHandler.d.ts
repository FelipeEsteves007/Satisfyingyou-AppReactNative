/// <reference types="react" />
import type { TapGestureHandlerEventPayload } from './GestureHandlerEventPayload';
import { BaseGestureHandlerProps } from './gestureHandlerCommon';
export declare const tapGestureHandlerProps: readonly ["maxDurationMs", "maxDelayMs", "numberOfTaps", "maxDeltaX", "maxDeltaY", "maxDist", "minPointers"];
export interface TapGestureConfig {
    /**
     * Minimum number of pointers (fingers) required to be placed before the
     * handler activates. Should be a positive integer.
     * The default value is 1.
     */
    minPointers?: number;
    /**
     * Maximum time, expressed in milliseconds, that defines how fast a finger
     * must be released after a touch. The default value is 500.
     */
    maxDurationMs?: number;
    /**
     * Maximum time, expressed in milliseconds, that can pass before the next tap
     * if many taps are required. The default value is 500.
     */
    maxDelayMs?: number;
    /**
     * Number of tap gestures required to activate the handler. The default value
     * is 1.
     */
    numberOfTaps?: number;
    /**
     * Maximum distance, expressed in points, that defines how far the finger is
     * allowed to travel along the X axis during a tap gesture. If the finger
     * travels further than the defined distance along the X axis and the handler
     * hasn't yet activated, it will fail to recognize the gesture.
     */
    maxDeltaX?: number;
    /**
     * Maximum distance, expressed in points, that defines how far the finger is
     * allowed to travel along the Y axis during a tap gesture. If the finger
     * travels further than the defined distance along the Y axis and the handler
     * hasn't yet activated, it will fail to recognize the gesture.
     */
    maxDeltaY?: number;
    /**
     * Maximum distance, expressed in points, that defines how far the finger is
     * allowed to travel during a tap gesture. If the finger travels further than
     * the defined distance and the handler hasn't yet
     * activated, it will fail to recognize the gesture.
     */
    maxDist?: number;
}
/**
 * @deprecated TapGestureHandler will be removed in the future version of Gesture Handler. Use `Gesture.Tap()` instead.
 */
export interface TapGestureHandlerProps extends BaseGestureHandlerProps<TapGestureHandlerEventPayload>, TapGestureConfig {
}
export declare const tapHandlerName = "TapGestureHandler";
/**
 * @deprecated TapGestureHandler will be removed in the future version of Gesture Handler. Use `Gesture.Tap()` instead.
 */
export type TapGestureHandler = typeof TapGestureHandler;
/**
 * @deprecated TapGestureHandler will be removed in the future version of Gesture Handler. Use `Gesture.Tap()` instead.
 */
export declare const TapGestureHandler: import("react").ComponentType<TapGestureHandlerProps & import("react").RefAttributes<any>>;
