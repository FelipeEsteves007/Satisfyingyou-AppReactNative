function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

import * as React from 'react';
import { ScrollView as RNScrollView, Switch as RNSwitch, TextInput as RNTextInput, DrawerLayoutAndroid as RNDrawerLayoutAndroid, FlatList as RNFlatList, RefreshControl as RNRefreshControl } from 'react-native';
import createNativeWrapper from '../handlers/createNativeWrapper';
import { nativeViewProps } from '../handlers/NativeViewGestureHandler';
import { toArray } from '../utils';
export const RefreshControl = createNativeWrapper(RNRefreshControl, {
  disallowInterruption: true,
  shouldCancelWhenOutside: false
}); // eslint-disable-next-line @typescript-eslint/no-redeclare

const GHScrollView = createNativeWrapper(RNScrollView, {
  disallowInterruption: true,
  shouldCancelWhenOutside: false
});
export const ScrollView = /*#__PURE__*/React.forwardRef((props, ref) => {
  const refreshControlGestureRef = React.useRef(null);
  const {
    refreshControl,
    waitFor,
    ...rest
  } = props;
  return /*#__PURE__*/React.createElement(GHScrollView, _extends({}, rest, {
    // @ts-ignore `ref` exists on `GHScrollView`
    ref: ref,
    waitFor: [...toArray(waitFor !== null && waitFor !== void 0 ? waitFor : []), refreshControlGestureRef] // @ts-ignore we don't pass `refreshing` prop as we only want to override the ref
    ,
    refreshControl: refreshControl ? /*#__PURE__*/React.cloneElement(refreshControl, {
      // @ts-ignore for reasons unknown to me, `ref` doesn't exist on the type inferred by TS
      ref: refreshControlGestureRef
    }) : undefined
  }));
}); // Backward type compatibility with https://github.com/software-mansion/react-native-gesture-handler/blob/db78d3ca7d48e8ba57482d3fe9b0a15aa79d9932/react-native-gesture-handler.d.ts#L440-L457
// include methods of wrapped components by creating an intersection type with the RN component instead of duplicating them.
// eslint-disable-next-line @typescript-eslint/no-redeclare

export const Switch = createNativeWrapper(RNSwitch, {
  shouldCancelWhenOutside: false,
  shouldActivateOnStart: true,
  disallowInterruption: true
}); // eslint-disable-next-line @typescript-eslint/no-redeclare

export const TextInput = createNativeWrapper(RNTextInput); // eslint-disable-next-line @typescript-eslint/no-redeclare

export const DrawerLayoutAndroid = createNativeWrapper(RNDrawerLayoutAndroid, {
  disallowInterruption: true
}); // eslint-disable-next-line @typescript-eslint/no-redeclare

export const FlatList = /*#__PURE__*/React.forwardRef((props, ref) => {
  const refreshControlGestureRef = React.useRef(null);
  const {
    waitFor,
    refreshControl,
    ...rest
  } = props;
  const flatListProps = {};
  const scrollViewProps = {};

  for (const [propName, value] of Object.entries(rest)) {
    // https://github.com/microsoft/TypeScript/issues/26255
    if (nativeViewProps.includes(propName)) {
      // @ts-ignore - this function cannot have generic type so we have to ignore this error
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      scrollViewProps[propName] = value;
    } else {
      // @ts-ignore - this function cannot have generic type so we have to ignore this error
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      flatListProps[propName] = value;
    }
  }

  return (
    /*#__PURE__*/
    // @ts-ignore - this function cannot have generic type so we have to ignore this error
    React.createElement(RNFlatList, _extends({
      ref: ref
    }, flatListProps, {
      renderScrollComponent: scrollProps => /*#__PURE__*/React.createElement(ScrollView, _extends({}, scrollProps, scrollViewProps, {
        waitFor: [...toArray(waitFor !== null && waitFor !== void 0 ? waitFor : []), refreshControlGestureRef]
      })) // @ts-ignore we don't pass `refreshing` prop as we only want to override the ref
      ,
      refreshControl: refreshControl ? /*#__PURE__*/React.cloneElement(refreshControl, {
        // @ts-ignore for reasons unknown to me, `ref` doesn't exist on the type inferred by TS
        ref: refreshControlGestureRef
      }) : undefined
    }))
  );
}); // eslint-disable-next-line @typescript-eslint/no-redeclare
//# sourceMappingURL=GestureComponents.js.map