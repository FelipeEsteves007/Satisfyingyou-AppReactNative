"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SHEET_FIT_TO_CONTENTS = exports.SHEET_DIMMED_ALWAYS = exports.SHEET_COMPAT_MEDIUM = exports.SHEET_COMPAT_LARGE = exports.SHEET_COMPAT_ALL = void 0;
exports.assertDetentsArrayIsSorted = assertDetentsArrayIsSorted;
exports.resolveSheetAllowedDetents = resolveSheetAllowedDetents;
exports.resolveSheetInitialDetentIndex = resolveSheetInitialDetentIndex;
exports.resolveSheetLargestUndimmedDetent = resolveSheetLargestUndimmedDetent;
var _reactNative = require("react-native");
// This value must be kept in sync with native side.
const SHEET_FIT_TO_CONTENTS = exports.SHEET_FIT_TO_CONTENTS = [-1];
const SHEET_COMPAT_LARGE = exports.SHEET_COMPAT_LARGE = [1.0];
const SHEET_COMPAT_MEDIUM = exports.SHEET_COMPAT_MEDIUM = [0.5];
const SHEET_COMPAT_ALL = exports.SHEET_COMPAT_ALL = [0.5, 1.0];
const SHEET_DIMMED_ALWAYS = exports.SHEET_DIMMED_ALWAYS = -1;
function assertDetentsArrayIsSorted(array) {
  for (let i = 1; i < array.length; i++) {
    if (array[i - 1] > array[i]) {
      throw new Error('[RNScreens] The detent array is not sorted in ascending order!');
    }
  }
}

// These exist to transform old 'legacy' values used by the formsheet API to the new API shape.
// We can get rid of it, once we get rid of support for legacy values: 'large', 'medium', 'all'.
function resolveSheetAllowedDetents(allowedDetentsCompat) {
  if (Array.isArray(allowedDetentsCompat)) {
    if (_reactNative.Platform.OS === 'android' && allowedDetentsCompat.length > 3) {
      if (__DEV__) {
        console.warn('[RNScreens] Sheets API on Android do accept only up to 3 values. Any surplus value are ignored.');
      }
      allowedDetentsCompat = allowedDetentsCompat.slice(0, 3);
    }
    if (__DEV__) {
      assertDetentsArrayIsSorted(allowedDetentsCompat);
    }
    return allowedDetentsCompat;
  } else if (allowedDetentsCompat === 'fitToContents') {
    return SHEET_FIT_TO_CONTENTS;
  } else if (allowedDetentsCompat === 'large') {
    return SHEET_COMPAT_LARGE;
  } else if (allowedDetentsCompat === 'medium') {
    return SHEET_COMPAT_MEDIUM;
  } else if (allowedDetentsCompat === 'all') {
    return SHEET_COMPAT_ALL;
  } else {
    // Safe default, only large detent is allowed.
    return SHEET_COMPAT_LARGE;
  }
}
function resolveSheetLargestUndimmedDetent(lud, lastDetentIndex) {
  if (typeof lud === 'number') {
    if (!isIndexInClosedRange(lud, SHEET_DIMMED_ALWAYS, lastDetentIndex)) {
      if (__DEV__) {
        throw new Error("[RNScreens] Provided value of 'sheetLargestUndimmedDetentIndex' prop is out of bounds of 'sheetAllowedDetents' array.");
      }
      // Return default in production
      return SHEET_DIMMED_ALWAYS;
    }
    return lud;
  } else if (lud === 'last') {
    return lastDetentIndex;
  } else if (lud === 'none' || lud === 'all') {
    return SHEET_DIMMED_ALWAYS;
  } else if (lud === 'large') {
    return 1;
  } else if (lud === 'medium') {
    return 0;
  } else {
    // Safe default, every detent is dimmed
    return SHEET_DIMMED_ALWAYS;
  }
}
function resolveSheetInitialDetentIndex(index, lastDetentIndex) {
  if (index === 'last') {
    index = lastDetentIndex;
  } else if (index == null) {
    // Intentional check for undefined & null ^
    index = 0;
  }
  if (!isIndexInClosedRange(index, 0, lastDetentIndex)) {
    if (__DEV__) {
      throw new Error("[RNScreens] Provided value of 'sheetInitialDetentIndex' prop is out of bounds of 'sheetAllowedDetents' array.");
    }
    // Return default in production
    return 0;
  }
  return index;
}
function isIndexInClosedRange(value, lowerBound, upperBound) {
  return Number.isInteger(value) && value >= lowerBound && value <= upperBound;
}
//# sourceMappingURL=sheet.js.map