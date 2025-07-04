"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _State = require("../../State");

var _constants = require("../constants");

var _interfaces = require("../interfaces");

var _GestureHandler = _interopRequireDefault(require("./GestureHandler"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const DEFAULT_MIN_POINTERS = 1;
const DEFAULT_MAX_POINTERS = 10;
const DEFAULT_MIN_DIST_SQ = _constants.DEFAULT_TOUCH_SLOP * _constants.DEFAULT_TOUCH_SLOP;

class PanGestureHandler extends _GestureHandler.default {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "customActivationProperties", ['activeOffsetXStart', 'activeOffsetXEnd', 'failOffsetXStart', 'failOffsetXEnd', 'activeOffsetYStart', 'activeOffsetYEnd', 'failOffsetYStart', 'failOffsetYEnd', 'minVelocityX', 'minVelocityY', 'minVelocity']);

    _defineProperty(this, "velocityX", 0);

    _defineProperty(this, "velocityY", 0);

    _defineProperty(this, "minDistSq", DEFAULT_MIN_DIST_SQ);

    _defineProperty(this, "activeOffsetXStart", -Number.MAX_SAFE_INTEGER);

    _defineProperty(this, "activeOffsetXEnd", Number.MIN_SAFE_INTEGER);

    _defineProperty(this, "failOffsetXStart", Number.MIN_SAFE_INTEGER);

    _defineProperty(this, "failOffsetXEnd", Number.MAX_SAFE_INTEGER);

    _defineProperty(this, "activeOffsetYStart", Number.MAX_SAFE_INTEGER);

    _defineProperty(this, "activeOffsetYEnd", Number.MIN_SAFE_INTEGER);

    _defineProperty(this, "failOffsetYStart", Number.MIN_SAFE_INTEGER);

    _defineProperty(this, "failOffsetYEnd", Number.MAX_SAFE_INTEGER);

    _defineProperty(this, "minVelocityX", Number.MAX_SAFE_INTEGER);

    _defineProperty(this, "minVelocityY", Number.MAX_SAFE_INTEGER);

    _defineProperty(this, "minVelocitySq", Number.MAX_SAFE_INTEGER);

    _defineProperty(this, "minPointers", DEFAULT_MIN_POINTERS);

    _defineProperty(this, "maxPointers", DEFAULT_MAX_POINTERS);

    _defineProperty(this, "startX", 0);

    _defineProperty(this, "startY", 0);

    _defineProperty(this, "offsetX", 0);

    _defineProperty(this, "offsetY", 0);

    _defineProperty(this, "lastX", 0);

    _defineProperty(this, "lastY", 0);

    _defineProperty(this, "stylusData", void 0);

    _defineProperty(this, "activateAfterLongPress", 0);

    _defineProperty(this, "activationTimeout", 0);

    _defineProperty(this, "enableTrackpadTwoFingerGesture", false);

    _defineProperty(this, "endWheelTimeout", 0);

    _defineProperty(this, "wheelDevice", _interfaces.WheelDevice.UNDETERMINED);
  }

  updateGestureConfig({
    enabled = true,
    ...props
  }) {
    this.resetConfig();
    super.updateGestureConfig({
      enabled: enabled,
      ...props
    });
    this.checkCustomActivationCriteria(this.customActivationProperties);

    if (this.config.minDist !== undefined) {
      this.minDistSq = this.config.minDist * this.config.minDist;
    } else if (this.hasCustomActivationCriteria) {
      this.minDistSq = Number.MAX_SAFE_INTEGER;
    }

    if (this.config.minPointers !== undefined) {
      this.minPointers = this.config.minPointers;
    }

    if (this.config.maxPointers !== undefined) {
      this.maxPointers = this.config.maxPointers;
    }

    if (this.config.minVelocity !== undefined) {
      this.minVelocityX = this.config.minVelocity;
      this.minVelocityY = this.config.minVelocity;
    }

    if (this.config.minVelocityX !== undefined) {
      this.minVelocityX = this.config.minVelocityX;
    }

    if (this.config.minVelocityY !== undefined) {
      this.minVelocityY = this.config.minVelocityY;
    }

    if (this.config.activateAfterLongPress !== undefined) {
      this.activateAfterLongPress = this.config.activateAfterLongPress;
    }

    if (this.config.activeOffsetXStart !== undefined) {
      this.activeOffsetXStart = this.config.activeOffsetXStart;

      if (this.config.activeOffsetXEnd === undefined) {
        this.activeOffsetXEnd = Number.MAX_SAFE_INTEGER;
      }
    }

    if (this.config.activeOffsetXEnd !== undefined) {
      this.activeOffsetXEnd = this.config.activeOffsetXEnd;

      if (this.config.activeOffsetXStart === undefined) {
        this.activeOffsetXStart = Number.MIN_SAFE_INTEGER;
      }
    }

    if (this.config.failOffsetXStart !== undefined) {
      this.failOffsetXStart = this.config.failOffsetXStart;

      if (this.config.failOffsetXEnd === undefined) {
        this.failOffsetXEnd = Number.MAX_SAFE_INTEGER;
      }
    }

    if (this.config.failOffsetXEnd !== undefined) {
      this.failOffsetXEnd = this.config.failOffsetXEnd;

      if (this.config.failOffsetXStart === undefined) {
        this.failOffsetXStart = Number.MIN_SAFE_INTEGER;
      }
    }

    if (this.config.activeOffsetYStart !== undefined) {
      this.activeOffsetYStart = this.config.activeOffsetYStart;

      if (this.config.activeOffsetYEnd === undefined) {
        this.activeOffsetYEnd = Number.MAX_SAFE_INTEGER;
      }
    }

    if (this.config.activeOffsetYEnd !== undefined) {
      this.activeOffsetYEnd = this.config.activeOffsetYEnd;

      if (this.config.activeOffsetYStart === undefined) {
        this.activeOffsetYStart = Number.MIN_SAFE_INTEGER;
      }
    }

    if (this.config.failOffsetYStart !== undefined) {
      this.failOffsetYStart = this.config.failOffsetYStart;

      if (this.config.failOffsetYEnd === undefined) {
        this.failOffsetYEnd = Number.MAX_SAFE_INTEGER;
      }
    }

    if (this.config.failOffsetYEnd !== undefined) {
      this.failOffsetYEnd = this.config.failOffsetYEnd;

      if (this.config.failOffsetYStart === undefined) {
        this.failOffsetYStart = Number.MIN_SAFE_INTEGER;
      }
    }

    if (this.config.enableTrackpadTwoFingerGesture !== undefined) {
      this.enableTrackpadTwoFingerGesture = this.config.enableTrackpadTwoFingerGesture;
    }
  }

  resetConfig() {
    super.resetConfig();
    this.activeOffsetXStart = -Number.MAX_SAFE_INTEGER;
    this.activeOffsetXEnd = Number.MIN_SAFE_INTEGER;
    this.failOffsetXStart = Number.MIN_SAFE_INTEGER;
    this.failOffsetXEnd = Number.MAX_SAFE_INTEGER;
    this.activeOffsetYStart = Number.MAX_SAFE_INTEGER;
    this.activeOffsetYEnd = Number.MIN_SAFE_INTEGER;
    this.failOffsetYStart = Number.MIN_SAFE_INTEGER;
    this.failOffsetYEnd = Number.MAX_SAFE_INTEGER;
    this.minVelocityX = Number.MAX_SAFE_INTEGER;
    this.minVelocityY = Number.MAX_SAFE_INTEGER;
    this.minVelocitySq = Number.MAX_SAFE_INTEGER;
    this.minDistSq = DEFAULT_MIN_DIST_SQ;
    this.minPointers = DEFAULT_MIN_POINTERS;
    this.maxPointers = DEFAULT_MAX_POINTERS;
    this.activateAfterLongPress = 0;
  }

  transformNativeEvent() {
    const translationX = this.getTranslationX();
    const translationY = this.getTranslationY();
    return { ...super.transformNativeEvent(),
      translationX: isNaN(translationX) ? 0 : translationX,
      translationY: isNaN(translationY) ? 0 : translationY,
      velocityX: this.velocityX,
      velocityY: this.velocityY,
      stylusData: this.stylusData
    };
  }

  getTranslationX() {
    return this.lastX - this.startX + this.offsetX;
  }

  getTranslationY() {
    return this.lastY - this.startY + this.offsetY;
  }

  clearActivationTimeout() {
    clearTimeout(this.activationTimeout);
  } // Events Handling


  onPointerDown(event) {
    if (!this.isButtonInConfig(event.button)) {
      return;
    }

    this.tracker.addToTracker(event);
    this.stylusData = event.stylusData;
    super.onPointerDown(event);
    const lastCoords = this.tracker.getAbsoluteCoordsAverage();
    this.lastX = lastCoords.x;
    this.lastY = lastCoords.y;
    this.startX = this.lastX;
    this.startY = this.lastY;
    this.tryBegin(event);
    this.checkBegan();
    this.tryToSendTouchEvent(event);
  }

  onPointerAdd(event) {
    this.tracker.addToTracker(event);
    super.onPointerAdd(event);
    this.tryBegin(event);
    this.offsetX += this.lastX - this.startX;
    this.offsetY += this.lastY - this.startY;
    const lastCoords = this.tracker.getAbsoluteCoordsAverage();
    this.lastX = lastCoords.x;
    this.lastY = lastCoords.y;
    this.startX = this.lastX;
    this.startY = this.lastY;

    if (this.tracker.trackedPointersCount > this.maxPointers) {
      if (this.state === _State.State.ACTIVE) {
        this.cancel();
      } else {
        this.fail();
      }
    } else {
      this.checkBegan();
    }
  }

  onPointerUp(event) {
    this.stylusData = event.stylusData;
    super.onPointerUp(event);

    if (this.state === _State.State.ACTIVE) {
      const lastCoords = this.tracker.getAbsoluteCoordsAverage();
      this.lastX = lastCoords.x;
      this.lastY = lastCoords.y;
    }

    this.tracker.removeFromTracker(event.pointerId);

    if (this.tracker.trackedPointersCount === 0) {
      this.clearActivationTimeout();
    }

    if (this.state === _State.State.ACTIVE) {
      this.end();
    } else {
      this.resetProgress();
      this.fail();
    }
  }

  onPointerRemove(event) {
    super.onPointerRemove(event);
    this.tracker.removeFromTracker(event.pointerId);
    this.offsetX += this.lastX - this.startX;
    this.offsetY += this.lastY - this.startY;
    const lastCoords = this.tracker.getAbsoluteCoordsAverage();
    this.lastX = lastCoords.x;
    this.lastY = lastCoords.y;
    this.startX = this.lastX;
    this.startY = this.lastY;

    if (!(this.state === _State.State.ACTIVE && this.tracker.trackedPointersCount < this.minPointers)) {
      this.checkBegan();
    }
  }

  onPointerMove(event) {
    this.tracker.track(event);
    this.stylusData = event.stylusData;
    const lastCoords = this.tracker.getAbsoluteCoordsAverage();
    this.lastX = lastCoords.x;
    this.lastY = lastCoords.y;
    const velocity = this.tracker.getVelocity(event.pointerId);
    this.velocityX = velocity.x;
    this.velocityY = velocity.y;
    this.checkBegan();
    super.onPointerMove(event);
  }

  onPointerOutOfBounds(event) {
    if (this.shouldCancelWhenOutside) {
      return;
    }

    this.tracker.track(event);
    this.stylusData = event.stylusData;
    const lastCoords = this.tracker.getAbsoluteCoordsAverage();
    this.lastX = lastCoords.x;
    this.lastY = lastCoords.y;
    const velocity = this.tracker.getVelocity(event.pointerId);
    this.velocityX = velocity.x;
    this.velocityY = velocity.y;
    this.checkBegan();

    if (this.state === _State.State.ACTIVE) {
      super.onPointerOutOfBounds(event);
    }
  }

  scheduleWheelEnd(event) {
    clearTimeout(this.endWheelTimeout);
    this.endWheelTimeout = setTimeout(() => {
      if (this.state === _State.State.ACTIVE) {
        this.end();
        this.tracker.removeFromTracker(event.pointerId);
        this.state = _State.State.UNDETERMINED;
      }

      this.wheelDevice = _interfaces.WheelDevice.UNDETERMINED;
    }, 30);
  }

  onWheel(event) {
    if (this.wheelDevice === _interfaces.WheelDevice.MOUSE || !this.enableTrackpadTwoFingerGesture) {
      return;
    }

    if (this.state === _State.State.UNDETERMINED) {
      this.wheelDevice = event.wheelDeltaY % 120 !== 0 ? _interfaces.WheelDevice.TOUCHPAD : _interfaces.WheelDevice.MOUSE;

      if (this.wheelDevice === _interfaces.WheelDevice.MOUSE) {
        this.scheduleWheelEnd(event);
        return;
      }

      this.tracker.addToTracker(event);
      const lastCoords = this.tracker.getAbsoluteCoordsAverage();
      this.lastX = lastCoords.x;
      this.lastY = lastCoords.y;
      this.startX = this.lastX;
      this.startY = this.lastY;
      this.begin();
      this.activate();
    }

    this.tracker.track(event);
    const lastCoords = this.tracker.getAbsoluteCoordsAverage();
    this.lastX = lastCoords.x;
    this.lastY = lastCoords.y;
    const velocity = this.tracker.getVelocity(event.pointerId);
    this.velocityX = velocity.x;
    this.velocityY = velocity.y;
    this.tryToSendMoveEvent(false, event);
    this.scheduleWheelEnd(event);
  }

  shouldActivate() {
    const dx = this.getTranslationX();

    if (this.activeOffsetXStart !== Number.MAX_SAFE_INTEGER && dx < this.activeOffsetXStart) {
      return true;
    }

    if (this.activeOffsetXEnd !== Number.MIN_SAFE_INTEGER && dx > this.activeOffsetXEnd) {
      return true;
    }

    const dy = this.getTranslationY();

    if (this.activeOffsetYStart !== Number.MAX_SAFE_INTEGER && dy < this.activeOffsetYStart) {
      return true;
    }

    if (this.activeOffsetYEnd !== Number.MIN_SAFE_INTEGER && dy > this.activeOffsetYEnd) {
      return true;
    }

    const distanceSq = dx * dx + dy * dy;

    if (this.minDistSq !== Number.MAX_SAFE_INTEGER && distanceSq >= this.minDistSq) {
      return true;
    }

    const vx = this.velocityX;

    if (this.minVelocityX !== Number.MAX_SAFE_INTEGER && (this.minVelocityX < 0 && vx <= this.minVelocityX || this.minVelocityX >= 0 && this.minVelocityX <= vx)) {
      return true;
    }

    const vy = this.velocityY;

    if (this.minVelocityY !== Number.MAX_SAFE_INTEGER && (this.minVelocityY < 0 && vy <= this.minVelocityY || this.minVelocityY >= 0 && this.minVelocityY <= vy)) {
      return true;
    }

    const velocitySq = vx * vx + vy * vy;
    return this.minVelocitySq !== Number.MAX_SAFE_INTEGER && velocitySq >= this.minVelocitySq;
  }

  shouldFail() {
    const dx = this.getTranslationX();
    const dy = this.getTranslationY();
    const distanceSq = dx * dx + dy * dy;

    if (this.activateAfterLongPress > 0 && distanceSq > DEFAULT_MIN_DIST_SQ) {
      this.clearActivationTimeout();
      return true;
    }

    if (this.failOffsetXStart !== Number.MIN_SAFE_INTEGER && dx < this.failOffsetXStart) {
      return true;
    }

    if (this.failOffsetXEnd !== Number.MAX_SAFE_INTEGER && dx > this.failOffsetXEnd) {
      return true;
    }

    if (this.failOffsetYStart !== Number.MIN_SAFE_INTEGER && dy < this.failOffsetYStart) {
      return true;
    }

    return this.failOffsetYEnd !== Number.MAX_SAFE_INTEGER && dy > this.failOffsetYEnd;
  }

  tryBegin(event) {
    if (this.state === _State.State.UNDETERMINED && this.tracker.trackedPointersCount >= this.minPointers) {
      this.resetProgress();
      this.offsetX = 0;
      this.offsetY = 0;
      this.velocityX = 0;
      this.velocityY = 0;
      this.begin();

      if (this.activateAfterLongPress > 0) {
        this.activationTimeout = setTimeout(() => {
          this.activate();
        }, this.activateAfterLongPress);
      }
    } else {
      const velocity = this.tracker.getVelocity(event.pointerId);
      this.velocityX = velocity.x;
      this.velocityY = velocity.y;
    }
  }

  checkBegan() {
    if (this.state === _State.State.BEGAN) {
      if (this.shouldFail()) {
        this.fail();
      } else if (this.shouldActivate()) {
        this.activate();
      }
    }
  }

  activate(force = false) {
    if (this.state !== _State.State.ACTIVE) {
      this.resetProgress();
    }

    super.activate(force);
  }

  onCancel() {
    this.clearActivationTimeout();
  }

  onReset() {
    this.clearActivationTimeout();
  }

  resetProgress() {
    if (this.state === _State.State.ACTIVE) {
      return;
    }

    this.startX = this.lastX;
    this.startY = this.lastY;
  }

}

exports.default = PanGestureHandler;
//# sourceMappingURL=PanGestureHandler.js.map