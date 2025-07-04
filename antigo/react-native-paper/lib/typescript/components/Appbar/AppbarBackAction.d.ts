import * as React from 'react';
import type { Animated, GestureResponderEvent, StyleProp, View, ViewStyle } from 'react-native';
import type { $Omit } from './../../types';
import AppbarAction from './AppbarAction';
export type Props = $Omit<React.ComponentPropsWithoutRef<typeof AppbarAction>, 'icon'> & {
    /**
     *  Custom color for back icon.
     */
    color?: string;
    /**
     * Optional icon size.
     */
    size?: number;
    /**
     * Whether the button is disabled. A disabled button is greyed out and `onPress` is not called on touch.
     */
    disabled?: boolean;
    /**
     * Accessibility label for the button. This is read by the screen reader when the user taps the button.
     */
    accessibilityLabel?: string;
    /**
     * Function to execute on press.
     */
    onPress?: (e: GestureResponderEvent) => void;
    style?: Animated.WithAnimatedValue<StyleProp<ViewStyle>>;
    ref?: React.RefObject<View>;
};
/**
 * A component used to display a back button in the appbar.
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { Appbar } from 'react-native-paper';
 *
 * const MyComponent = () => (
 *     <Appbar.Header>
 *       <Appbar.BackAction onPress={() => {}} />
 *     </Appbar.Header>
 * );
 *
 * export default MyComponent;
 * ```
 */
declare const AppbarBackAction: import("../../utils/forwardRef").ForwardRefComponent<View, Props>;
export default AppbarBackAction;
export { AppbarBackAction };
//# sourceMappingURL=AppbarBackAction.d.ts.map