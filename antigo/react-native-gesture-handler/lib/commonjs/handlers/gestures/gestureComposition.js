"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ExclusiveGesture = exports.SimultaneousGesture = exports.ComposedGesture = void 0;

var _gesture = require("./gesture");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function extendRelation(currentRelation, extendWith) {
  if (currentRelation === undefined) {
    return [...extendWith];
  } else {
    return [...currentRelation, ...extendWith];
  }
}

class ComposedGesture extends _gesture.Gesture {
  constructor(...gestures) {
    super();

    _defineProperty(this, "gestures", []);

    _defineProperty(this, "simultaneousGestures", []);

    _defineProperty(this, "requireGesturesToFail", []);

    this.gestures = gestures;
  }

  prepareSingleGesture(gesture, simultaneousGestures, requireGesturesToFail) {
    if (gesture instanceof _gesture.BaseGesture) {
      const newConfig = { ...gesture.config
      }; // No need to extend `blocksHandlers` here, because it's not changed in composition.
      // The same effect is achieved by reversing the order of 2 gestures in `Exclusive`

      newConfig.simultaneousWith = extendRelation(newConfig.simultaneousWith, simultaneousGestures);
      newConfig.requireToFail = extendRelation(newConfig.requireToFail, requireGesturesToFail);
      gesture.config = newConfig;
    } else if (gesture instanceof ComposedGesture) {
      gesture.simultaneousGestures = simultaneousGestures;
      gesture.requireGesturesToFail = requireGesturesToFail;
      gesture.prepare();
    }
  }

  prepare() {
    for (const gesture of this.gestures) {
      this.prepareSingleGesture(gesture, this.simultaneousGestures, this.requireGesturesToFail);
    }
  }

  initialize() {
    for (const gesture of this.gestures) {
      gesture.initialize();
    }
  }

  toGestureArray() {
    return this.gestures.flatMap(gesture => gesture.toGestureArray());
  }

}

exports.ComposedGesture = ComposedGesture;

class SimultaneousGesture extends ComposedGesture {
  prepare() {
    // This piece of magic works something like this:
    // for every gesture in the array
    const simultaneousArrays = this.gestures.map(gesture => // we take the array it's in
    this.gestures // and make a copy without it
    .filter(x => x !== gesture) // then we flatmap the result to get list of raw (not composed) gestures
    // this way we don't make the gestures simultaneous with themselves, which is
    // important when the gesture is `ExclusiveGesture` - we don't want to make
    // exclusive gestures simultaneous
    .flatMap(x => x.toGestureArray()));

    for (let i = 0; i < this.gestures.length; i++) {
      this.prepareSingleGesture(this.gestures[i], simultaneousArrays[i], this.requireGesturesToFail);
    }
  }

}

exports.SimultaneousGesture = SimultaneousGesture;

class ExclusiveGesture extends ComposedGesture {
  prepare() {
    // Transforms the array of gestures into array of grouped raw (not composed) gestures
    // i.e. [gesture1, gesture2, ComposedGesture(gesture3, gesture4)] -> [[gesture1], [gesture2], [gesture3, gesture4]]
    const gestureArrays = this.gestures.map(gesture => gesture.toGestureArray());
    let requireToFail = [];

    for (let i = 0; i < this.gestures.length; i++) {
      this.prepareSingleGesture(this.gestures[i], this.simultaneousGestures, this.requireGesturesToFail.concat(requireToFail)); // Every group gets to wait for all groups before it

      requireToFail = requireToFail.concat(gestureArrays[i]);
    }
  }

}

exports.ExclusiveGesture = ExclusiveGesture;
//# sourceMappingURL=gestureComposition.js.map