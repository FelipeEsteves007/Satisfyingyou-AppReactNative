import React from 'react';
import { TouchableNativeFeedback, TouchableWithoutFeedback, ScrollView, FlatList, Switch, TextInput, DrawerLayoutAndroid, View } from 'react-native';
declare const _default: {
    readonly TouchableHighlight: React.ForwardRefExoticComponent<import("react-native").TouchableHighlightProps & React.RefAttributes<View>>;
    readonly TouchableNativeFeedback: typeof TouchableNativeFeedback;
    readonly TouchableOpacity: React.ForwardRefExoticComponent<import("react-native").TouchableOpacityProps & React.RefAttributes<View>>;
    readonly TouchableWithoutFeedback: typeof TouchableWithoutFeedback;
    readonly ScrollView: typeof ScrollView;
    readonly FlatList: typeof FlatList;
    readonly Switch: typeof Switch;
    readonly TextInput: typeof TextInput;
    readonly DrawerLayoutAndroid: typeof DrawerLayoutAndroid;
    readonly NativeViewGestureHandler: typeof View;
    readonly TapGestureHandler: typeof View;
    readonly ForceTouchGestureHandler: typeof View;
    readonly LongPressGestureHandler: typeof View;
    readonly PinchGestureHandler: typeof View;
    readonly RotationGestureHandler: typeof View;
    readonly FlingGestureHandler: typeof View;
    readonly RawButton: ({ enabled, ...rest }: any) => React.JSX.Element;
    readonly BaseButton: ({ enabled, ...rest }: any) => React.JSX.Element;
    readonly RectButton: ({ enabled, ...rest }: any) => React.JSX.Element;
    readonly BorderlessButton: typeof TouchableNativeFeedback;
    readonly PanGestureHandler: typeof View;
    readonly attachGestureHandler: () => void;
    readonly createGestureHandler: () => void;
    readonly dropGestureHandler: () => void;
    readonly updateGestureHandler: () => void;
    readonly flushOperations: () => void;
    readonly install: () => void;
    readonly Directions: {
        readonly RIGHT: 1;
        readonly LEFT: 2;
        readonly UP: 4;
        readonly DOWN: 8;
    };
    readonly State: {
        readonly UNDETERMINED: 0;
        readonly FAILED: 1;
        readonly BEGAN: 2;
        readonly CANCELLED: 3;
        readonly ACTIVE: 4;
        readonly END: 5;
    };
};
export default _default;
