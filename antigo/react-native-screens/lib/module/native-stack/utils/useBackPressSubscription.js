import React from 'react';
import { BackHandler } from 'react-native';
/**
 * This hook is an abstraction for keeping back press subscription
 * logic in one place.
 */
export function useBackPressSubscription({
  onBackPress,
  isDisabled
}) {
  const [isActive, setIsActive] = React.useState(false);
  const subscription = React.useRef();
  const clearSubscription = React.useCallback((shouldSetActive = true) => {
    subscription.current?.remove();
    subscription.current = undefined;
    if (shouldSetActive) setIsActive(false);
  }, []);
  const createSubscription = React.useCallback(() => {
    if (!isDisabled) {
      subscription.current?.remove();
      subscription.current = BackHandler.addEventListener('hardwareBackPress', onBackPress);
      setIsActive(true);
    }
  }, [isDisabled, onBackPress]);
  const handleAttached = React.useCallback(() => {
    if (isActive) {
      createSubscription();
    }
  }, [createSubscription, isActive]);
  const handleDetached = React.useCallback(() => {
    clearSubscription(false);
  }, [clearSubscription]);
  React.useEffect(() => {
    if (isDisabled) {
      clearSubscription();
    }
  }, [isDisabled, clearSubscription]);
  return {
    handleAttached,
    handleDetached,
    createSubscription,
    clearSubscription
  };
}
//# sourceMappingURL=useBackPressSubscription.js.map