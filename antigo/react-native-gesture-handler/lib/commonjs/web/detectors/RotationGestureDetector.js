"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _interfaces = require("../interfaces");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class RotationGestureDetector {
  constructor(callbacks) {
    _defineProperty(this, "onRotationBegin", void 0);

    _defineProperty(this, "onRotation", void 0);

    _defineProperty(this, "onRotationEnd", void 0);

    _defineProperty(this, "currentTime", 0);

    _defineProperty(this, "previousTime", 0);

    _defineProperty(this, "previousAngle", 0);

    _defineProperty(this, "_rotation", 0);

    _defineProperty(this, "_anchorX", 0);

    _defineProperty(this, "_anchorY", 0);

    _defineProperty(this, "isInProgress", false);

    _defineProperty(this, "keyPointers", [NaN, NaN]);

    this.onRotationBegin = callbacks.onRotationBegin;
    this.onRotation = callbacks.onRotation;
    this.onRotationEnd = callbacks.onRotationEnd;
  }

  updateCurrent(event, tracker) {
    this.previousTime = this.currentTime;
    this.currentTime = event.time;
    const [firstPointerID, secondPointerID] = this.keyPointers;
    const firstPointerCoords = tracker.getLastAbsoluteCoords(firstPointerID);
    const secondPointerCoords = tracker.getLastAbsoluteCoords(secondPointerID);
    const vectorX = secondPointerCoords.x - firstPointerCoords.x;
    const vectorY = secondPointerCoords.y - firstPointerCoords.y;
    this._anchorX = (firstPointerCoords.x + secondPointerCoords.x) / 2;
    this._anchorY = (firstPointerCoords.y + secondPointerCoords.y) / 2; // Angle diff should be positive when rotating in clockwise direction

    const angle = -Math.atan2(vectorY, vectorX);
    this._rotation = Number.isNaN(this.previousAngle) ? 0 : this.previousAngle - angle;
    this.previousAngle = angle;

    if (this.rotation > Math.PI) {
      this._rotation -= Math.PI;
    } else if (this.rotation < -Math.PI) {
      this._rotation += Math.PI;
    }

    if (this.rotation > Math.PI / 2) {
      this._rotation -= Math.PI;
    } else if (this.rotation < -Math.PI / 2) {
      this._rotation += Math.PI;
    }
  }

  finish() {
    if (!this.isInProgress) {
      return;
    }

    this.isInProgress = false;
    this.keyPointers = [NaN, NaN];
    this.onRotationEnd(this);
  }

  setKeyPointers(tracker) {
    if (this.keyPointers[0] && this.keyPointers[1]) {
      return;
    }

    const pointerIDs = tracker.trackedPointers.keys();
    this.keyPointers[0] = pointerIDs.next().value;
    this.keyPointers[1] = pointerIDs.next().value;
  }

  onTouchEvent(event, tracker) {
    switch (event.eventType) {
      case _interfaces.EventTypes.DOWN:
        this.isInProgress = false;
        break;

      case _interfaces.EventTypes.ADDITIONAL_POINTER_DOWN:
        if (this.isInProgress) {
          break;
        }

        this.isInProgress = true;
        this.previousTime = event.time;
        this.previousAngle = NaN;
        this.setKeyPointers(tracker);
        this.updateCurrent(event, tracker);
        this.onRotationBegin(this);
        break;

      case _interfaces.EventTypes.MOVE:
        if (!this.isInProgress) {
          break;
        }

        this.updateCurrent(event, tracker);
        this.onRotation(this);
        break;

      case _interfaces.EventTypes.ADDITIONAL_POINTER_UP:
        if (!this.isInProgress) {
          break;
        }

        if (this.keyPointers.indexOf(event.pointerId) >= 0) {
          this.finish();
        }

        break;

      case _interfaces.EventTypes.UP:
        if (this.isInProgress) {
          this.finish();
        }

        break;
    }

    return true;
  }

  reset() {
    this.keyPointers = [NaN, NaN];
    this.isInProgress = false;
  }

  get anchorX() {
    return this._anchorX;
  }

  get anchorY() {
    return this._anchorY;
  }

  get rotation() {
    return this._rotation;
  }

  get timeDelta() {
    return this.currentTime + this.previousTime;
  }

}

exports.default = RotationGestureDetector;
//# sourceMappingURL=RotationGestureDetector.js.map