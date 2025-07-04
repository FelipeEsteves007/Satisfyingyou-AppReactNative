function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

export default class InteractionManager {
  // Private becaues of singleton
  // eslint-disable-next-line no-useless-constructor, @typescript-eslint/no-empty-function
  constructor() {
    _defineProperty(this, "waitForRelations", new Map());

    _defineProperty(this, "simultaneousRelations", new Map());

    _defineProperty(this, "blocksHandlersRelations", new Map());
  }

  configureInteractions(handler, config) {
    this.dropRelationsForHandlerWithTag(handler.handlerTag);

    if (config.waitFor) {
      const waitFor = [];
      config.waitFor.forEach(otherHandler => {
        // New API reference
        if (typeof otherHandler === 'number') {
          waitFor.push(otherHandler);
        } else {
          // Old API reference
          waitFor.push(otherHandler.handlerTag);
        }
      });
      this.waitForRelations.set(handler.handlerTag, waitFor);
    }

    if (config.simultaneousHandlers) {
      const simultaneousHandlers = [];
      config.simultaneousHandlers.forEach(otherHandler => {
        if (typeof otherHandler === 'number') {
          simultaneousHandlers.push(otherHandler);
        } else {
          simultaneousHandlers.push(otherHandler.handlerTag);
        }
      });
      this.simultaneousRelations.set(handler.handlerTag, simultaneousHandlers);
    }

    if (config.blocksHandlers) {
      const blocksHandlers = [];
      config.blocksHandlers.forEach(otherHandler => {
        if (typeof otherHandler === 'number') {
          blocksHandlers.push(otherHandler);
        } else {
          blocksHandlers.push(otherHandler.handlerTag);
        }
      });
      this.blocksHandlersRelations.set(handler.handlerTag, blocksHandlers);
    }
  }

  shouldWaitForHandlerFailure(handler, otherHandler) {
    const waitFor = this.waitForRelations.get(handler.handlerTag);
    return (waitFor === null || waitFor === void 0 ? void 0 : waitFor.find(tag => {
      return tag === otherHandler.handlerTag;
    })) !== undefined;
  }

  shouldRecognizeSimultaneously(handler, otherHandler) {
    const simultaneousHandlers = this.simultaneousRelations.get(handler.handlerTag);
    return (simultaneousHandlers === null || simultaneousHandlers === void 0 ? void 0 : simultaneousHandlers.find(tag => {
      return tag === otherHandler.handlerTag;
    })) !== undefined;
  }

  shouldRequireHandlerToWaitForFailure(handler, otherHandler) {
    const waitFor = this.blocksHandlersRelations.get(handler.handlerTag);
    return (waitFor === null || waitFor === void 0 ? void 0 : waitFor.find(tag => {
      return tag === otherHandler.handlerTag;
    })) !== undefined;
  }

  shouldHandlerBeCancelledBy(_handler, otherHandler) {
    var _otherHandler$isButto;

    // We check constructor name instead of using `instanceof` in order do avoid circular dependencies
    const isNativeHandler = otherHandler.constructor.name === 'NativeViewGestureHandler';
    const isActive = otherHandler.active;
    const isButton = ((_otherHandler$isButto = otherHandler.isButton) === null || _otherHandler$isButto === void 0 ? void 0 : _otherHandler$isButto.call(otherHandler)) === true;
    return isNativeHandler && isActive && !isButton;
  }

  dropRelationsForHandlerWithTag(handlerTag) {
    this.waitForRelations.delete(handlerTag);
    this.simultaneousRelations.delete(handlerTag);
    this.blocksHandlersRelations.delete(handlerTag);
  }

  reset() {
    this.waitForRelations.clear();
    this.simultaneousRelations.clear();
    this.blocksHandlersRelations.clear();
  }

  static get instance() {
    if (!this._instance) {
      this._instance = new InteractionManager();
    }

    return this._instance;
  }

}

_defineProperty(InteractionManager, "_instance", void 0);
//# sourceMappingURL=InteractionManager.js.map