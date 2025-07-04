import React from 'react';
import { isNewWebImplementationEnabled } from './EnableNewWebImplementation';
import { Gestures, HammerGestures } from './web/Gestures';
import InteractionManager from './web/tools/InteractionManager';
import NodeManager from './web/tools/NodeManager';
import * as HammerNodeManager from './web_hammer/NodeManager';
import { GestureHandlerWebDelegate } from './web/tools/GestureHandlerWebDelegate'; // init method is called inside attachGestureHandler function. However, this function may
// fail when received view is not valid HTML element. On the other hand, dropGestureHandler
// will be called even if attach failed, which will result in crash.
//
// We use this flag to check whether or not dropGestureHandler should be called.

let shouldPreventDrop = false;
export default {
  handleSetJSResponder(tag, blockNativeResponder) {
    console.warn('handleSetJSResponder: ', tag, blockNativeResponder);
  },

  handleClearJSResponder() {
    console.warn('handleClearJSResponder: ');
  },

  createGestureHandler(handlerName, handlerTag, config) {
    if (isNewWebImplementationEnabled()) {
      if (!(handlerName in Gestures)) {
        throw new Error(`react-native-gesture-handler: ${handlerName} is not supported on web.`);
      }

      const GestureClass = Gestures[handlerName];
      NodeManager.createGestureHandler(handlerTag, new GestureClass(new GestureHandlerWebDelegate()));
      InteractionManager.instance.configureInteractions(NodeManager.getHandler(handlerTag), config);
    } else {
      if (!(handlerName in HammerGestures)) {
        throw new Error(`react-native-gesture-handler: ${handlerName} is not supported on web.`);
      } // @ts-ignore If it doesn't exist, the error is thrown
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment


      const GestureClass = HammerGestures[handlerName]; // eslint-disable-next-line @typescript-eslint/no-unsafe-call

      HammerNodeManager.createGestureHandler(handlerTag, new GestureClass());
    }

    this.updateGestureHandler(handlerTag, config);
  },

  attachGestureHandler(handlerTag, // eslint-disable-next-line @typescript-eslint/no-explicit-any
  newView, _actionType, propsRef) {
    if (!(newView instanceof Element || newView instanceof React.Component)) {
      shouldPreventDrop = true;
      const handler = isNewWebImplementationEnabled() ? NodeManager.getHandler(handlerTag) : HammerNodeManager.getHandler(handlerTag);
      const handlerName = handler.constructor.name;
      throw new Error(`${handlerName} with tag ${handlerTag} received child that is not valid HTML element.`);
    }

    if (isNewWebImplementationEnabled()) {
      // @ts-ignore Types should be HTMLElement or React.Component
      NodeManager.getHandler(handlerTag).init(newView, propsRef);
    } else {
      // @ts-ignore Types should be HTMLElement or React.Component
      HammerNodeManager.getHandler(handlerTag).setView(newView, propsRef);
    }
  },

  updateGestureHandler(handlerTag, newConfig) {
    if (isNewWebImplementationEnabled()) {
      NodeManager.getHandler(handlerTag).updateGestureConfig(newConfig);
      InteractionManager.instance.configureInteractions(NodeManager.getHandler(handlerTag), newConfig);
    } else {
      HammerNodeManager.getHandler(handlerTag).updateGestureConfig(newConfig);
    }
  },

  getGestureHandlerNode(handlerTag) {
    if (isNewWebImplementationEnabled()) {
      return NodeManager.getHandler(handlerTag);
    } else {
      return HammerNodeManager.getHandler(handlerTag);
    }
  },

  dropGestureHandler(handlerTag) {
    if (shouldPreventDrop) {
      return;
    }

    if (isNewWebImplementationEnabled()) {
      NodeManager.dropGestureHandler(handlerTag);
    } else {
      HammerNodeManager.dropGestureHandler(handlerTag);
    }
  },

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  flushOperations() {}

};
//# sourceMappingURL=RNGestureHandlerModule.web.js.map