import * as React from 'react';
import { Text, TextStyle, StyleProp } from 'react-native';
export type Props = React.ComponentProps<typeof Text> & {
    style?: StyleProp<TextStyle>;
    children: React.ReactNode;
};
/**
 * @deprecated Deprecated in v5.x - use `<Text variant="headlineSmall" />` instead.
 * Typography component for showing a headline.
 *
 * <div class="screenshots">
 *   <img src="screenshots/headline.png" />
 * </div>
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { Headline } from 'react-native-paper';
 *
 * const MyComponent = () => (
 *   <Headline>Headline</Headline>
 * );
 *
 * export default MyComponent;
 * ```
 */
declare const Headline: (props: Props) => React.JSX.Element;
export default Headline;
//# sourceMappingURL=Headline.d.ts.map