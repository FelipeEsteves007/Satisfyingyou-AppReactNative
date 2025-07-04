"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
class NodeManager {
  static getHandler(tag) {
    if (tag in this.gestures) {
      return this.gestures[tag];
    }

    throw new Error(`No handler for tag ${tag}`);
  }

  static createGestureHandler(handlerTag, handler) {
    if (handlerTag in this.gestures) {
      throw new Error(`Handler with tag ${handlerTag} already exists. Please ensure that no Gesture instance is used across multiple GestureDetectors.`);
    }

    this.gestures[handlerTag] = handler;
    this.gestures[handlerTag].handlerTag = handlerTag;
  }

  static dropGestureHandler(handlerTag) {
    if (!(handlerTag in this.gestures)) {
      return;
    }

    this.gestures[handlerTag].onDestroy(); // eslint-disable-next-line @typescript-eslint/no-dynamic-delete

    delete this.gestures[handlerTag];
  }

  static get nodes() {
    return { ...this.gestures
    };
  }

}

exports.default = NodeManager;

_defineProperty(NodeManager, "gestures", {});
//# sourceMappingURL=NodeManager.js.map