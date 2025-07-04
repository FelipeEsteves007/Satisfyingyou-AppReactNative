import * as React from 'react';
import { Component } from 'react';
import { GestureEvent, HandlerStateChangeEvent } from '../../handlers/gestureHandlerCommon';
import type { NativeViewGestureHandlerPayload } from '../../handlers/GestureHandlerEventPayload';
import type { GenericTouchableProps } from './GenericTouchableProps';
/**
 * Each touchable is a states' machine which preforms transitions.
 * On very beginning (and on the very end or recognition) touchable is
 * UNDETERMINED. Then it moves to BEGAN. If touchable recognizes that finger
 * travel outside it transits to special MOVED_OUTSIDE state. Gesture recognition
 * finishes in UNDETERMINED state.
 */
export declare const TOUCHABLE_STATE: {
    readonly UNDETERMINED: 0;
    readonly BEGAN: 1;
    readonly MOVED_OUTSIDE: 2;
};
type TouchableState = (typeof TOUCHABLE_STATE)[keyof typeof TOUCHABLE_STATE];
interface InternalProps {
    onStateChange?: (oldState: TouchableState, newState: TouchableState) => void;
}
type Timeout = ReturnType<typeof setTimeout> | null | undefined;
/**
 * GenericTouchable is not intented to be used as it is.
 * Should be treated as a source for the rest of touchables
 */
export default class GenericTouchable extends Component<GenericTouchableProps & InternalProps> {
    static defaultProps: {
        delayLongPress: number;
        extraButtonProps: {
            rippleColor: string;
            exclusive: boolean;
        };
    };
    pressInTimeout: Timeout;
    pressOutTimeout: Timeout;
    longPressTimeout: Timeout;
    longPressDetected: boolean;
    pointerInside: boolean;
    STATE: TouchableState;
    handlePressIn(): void;
    handleMoveOutside(): void;
    handleGoToUndetermined(): void;
    componentDidMount(): void;
    reset(): void;
    moveToState(newState: TouchableState): void;
    onGestureEvent: ({ nativeEvent: { pointerInside }, }: GestureEvent<NativeViewGestureHandlerPayload>) => void;
    onHandlerStateChange: ({ nativeEvent, }: HandlerStateChangeEvent<NativeViewGestureHandlerPayload>) => void;
    onLongPressDetected: () => void;
    componentWillUnmount(): void;
    onMoveIn(): void;
    onMoveOut(): void;
    render(): React.JSX.Element;
}
export {};
