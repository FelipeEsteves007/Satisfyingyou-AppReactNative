import * as React from 'react';
export type Props = {
    /**
     * Function to execute on selection change.
     */
    onValueChange: (value: string) => void;
    /**
     * Value of the currently selected radio button.
     */
    value: string;
    /**
     * React elements containing radio buttons.
     */
    children: React.ReactNode;
};
export type RadioButtonContextType = {
    value: string;
    onValueChange: (item: string) => void;
};
export declare const RadioButtonContext: React.Context<RadioButtonContextType>;
/**
 * Radio button group allows to control a group of radio buttons.
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { View } from 'react-native';
 * import { RadioButton, Text } from 'react-native-paper';
 *
 * const MyComponent = () => {
 *   const [value, setValue] = React.useState('first');
 *
 *   return (
 *     <RadioButton.Group onValueChange={newValue => setValue(newValue)} value={value}>
 *       <View>
 *         <Text>First</Text>
 *         <RadioButton value="first" />
 *       </View>
 *       <View>
 *         <Text>Second</Text>
 *         <RadioButton value="second" />
 *       </View>
 *     </RadioButton.Group>
 *   );
 * };
 *
 * export default MyComponent;
 *```
 */
declare const RadioButtonGroup: {
    ({ value, onValueChange, children }: Props): React.JSX.Element;
    displayName: string;
};
export default RadioButtonGroup;
export { RadioButtonGroup };
//# sourceMappingURL=RadioButtonGroup.d.ts.map