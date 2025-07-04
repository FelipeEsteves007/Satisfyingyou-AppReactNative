"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GestureHandlerWebDelegate = void 0;

var _findNodeHandle = _interopRequireDefault(require("../../findNodeHandle"));

var _PointerEventManager = _interopRequireDefault(require("./PointerEventManager"));

var _State = require("../../State");

var _utils = require("../utils");

var _gestureHandlerCommon = require("../../handlers/gestureHandlerCommon");

var _KeyboardEventManager = _interopRequireDefault(require("./KeyboardEventManager"));

var _WheelEventManager = _interopRequireDefault(require("./WheelEventManager"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class GestureHandlerWebDelegate {
  constructor() {
    _defineProperty(this, "isInitialized", false);

    _defineProperty(this, "_view", void 0);

    _defineProperty(this, "gestureHandler", void 0);

    _defineProperty(this, "eventManagers", []);

    _defineProperty(this, "defaultViewStyles", {
      userSelect: '',
      touchAction: ''
    });
  }

  init(viewRef, handler) {
    if (!viewRef) {
      throw new Error(`Cannot find HTML Element for handler ${handler.handlerTag}`);
    }

    this.isInitialized = true;
    this.gestureHandler = handler;
    this.view = (0, _findNodeHandle.default)(viewRef);
    this.defaultViewStyles = {
      userSelect: this.view.style.userSelect,
      touchAction: this.view.style.touchAction
    };
    const config = handler.config;
    this.setUserSelect(config.enabled);
    this.setTouchAction(config.enabled);
    this.setContextMenu(config.enabled);
    this.eventManagers.push(new _PointerEventManager.default(this.view));
    this.eventManagers.push(new _KeyboardEventManager.default(this.view));
    this.eventManagers.push(new _WheelEventManager.default(this.view));
    this.eventManagers.forEach(manager => this.gestureHandler.attachEventManager(manager));
  }

  isPointerInBounds({
    x,
    y
  }) {
    return (0, _utils.isPointerInBounds)(this.view, {
      x,
      y
    });
  }

  measureView() {
    const rect = this.view.getBoundingClientRect();
    return {
      pageX: rect.left,
      pageY: rect.top,
      width: rect.width,
      height: rect.height
    };
  }

  reset() {
    this.eventManagers.forEach(manager => manager.resetManager());
  }

  tryResetCursor() {
    const config = this.gestureHandler.config;

    if (config.activeCursor && config.activeCursor !== 'auto' && this.gestureHandler.state === _State.State.ACTIVE) {
      this.view.style.cursor = 'auto';
    }
  }

  shouldDisableContextMenu(config) {
    return config.enableContextMenu === undefined && this.gestureHandler.isButtonInConfig(_gestureHandlerCommon.MouseButton.RIGHT) || config.enableContextMenu === false;
  }

  addContextMenuListeners(config) {
    if (this.shouldDisableContextMenu(config)) {
      this.view.addEventListener('contextmenu', this.disableContextMenu);
    } else if (config.enableContextMenu) {
      this.view.addEventListener('contextmenu', this.enableContextMenu);
    }
  }

  removeContextMenuListeners(config) {
    if (this.shouldDisableContextMenu(config)) {
      this.view.removeEventListener('contextmenu', this.disableContextMenu);
    } else if (config.enableContextMenu) {
      this.view.removeEventListener('contextmenu', this.enableContextMenu);
    }
  }

  disableContextMenu(e) {
    e.preventDefault();
  }

  enableContextMenu(e) {
    e.stopPropagation();
  }

  setUserSelect(isHandlerEnabled) {
    const {
      userSelect
    } = this.gestureHandler.config;
    this.view.style['userSelect'] = isHandlerEnabled ? userSelect !== null && userSelect !== void 0 ? userSelect : 'none' : this.defaultViewStyles.userSelect;
    this.view.style['webkitUserSelect'] = isHandlerEnabled ? userSelect !== null && userSelect !== void 0 ? userSelect : 'none' : this.defaultViewStyles.userSelect;
  }

  setTouchAction(isHandlerEnabled) {
    const {
      touchAction
    } = this.gestureHandler.config;
    this.view.style['touchAction'] = isHandlerEnabled ? touchAction !== null && touchAction !== void 0 ? touchAction : 'none' : this.defaultViewStyles.touchAction; // @ts-ignore This one disables default events on Safari

    this.view.style['WebkitTouchCallout'] = isHandlerEnabled ? touchAction !== null && touchAction !== void 0 ? touchAction : 'none' : this.defaultViewStyles.touchAction;
  }

  setContextMenu(isHandlerEnabled) {
    const config = this.gestureHandler.config;

    if (isHandlerEnabled) {
      this.addContextMenuListeners(config);
    } else {
      this.removeContextMenuListeners(config);
    }
  }

  onEnabledChange(enabled) {
    if (!this.isInitialized) {
      return;
    }

    this.setUserSelect(enabled);
    this.setTouchAction(enabled);
    this.setContextMenu(enabled);

    if (enabled) {
      this.eventManagers.forEach(manager => {
        // It may look like managers will be registered twice when handler is mounted for the first time.
        // However, `init` method is called AFTER `updateGestureConfig` - it means that delegate has not
        // been initialized yet, so this code won't be executed.
        //
        // Also, because we use defined functions, not lambdas, they will not be registered multiple times.
        manager.registerListeners();
      });
    } else {
      this.eventManagers.forEach(manager => {
        manager.unregisterListeners();
      });
    }
  }

  onBegin() {// no-op for now
  }

  onActivate() {
    const config = this.gestureHandler.config;

    if ((!this.view.style.cursor || this.view.style.cursor === 'auto') && config.activeCursor) {
      this.view.style.cursor = config.activeCursor;
    }
  }

  onEnd() {
    this.tryResetCursor();
  }

  onCancel() {
    this.tryResetCursor();
  }

  onFail() {
    this.tryResetCursor();
  }

  destroy(config) {
    this.removeContextMenuListeners(config);
    this.eventManagers.forEach(manager => {
      manager.unregisterListeners();
    });
  }

  get view() {
    return this._view;
  }

  set view(value) {
    this._view = value;
  }

}

exports.GestureHandlerWebDelegate = GestureHandlerWebDelegate;
//# sourceMappingURL=GestureHandlerWebDelegate.js.map