"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.enableExperimentalWebImplementation = enableExperimentalWebImplementation;
exports.enableLegacyWebImplementation = enableLegacyWebImplementation;
exports.isNewWebImplementationEnabled = isNewWebImplementationEnabled;

var _reactNative = require("react-native");

var _utils = require("./utils");

let useNewWebImplementation = true;
let getWasCalled = false;
/**
 * @deprecated new web implementation is enabled by default. This function will be removed in Gesture Handler 3
 */

function enableExperimentalWebImplementation(_shouldEnable = true) {
  // NO-OP since the new implementation is now the default
  console.warn((0, _utils.tagMessage)('New web implementation is enabled by default. This function will be removed in Gesture Handler 3.'));
}
/**
 * @deprecated legacy implementation is no longer supported. This function will be removed in Gesture Handler 3
 */


function enableLegacyWebImplementation(shouldUseLegacyImplementation = true) {
  console.warn((0, _utils.tagMessage)('Legacy web implementation is deprecated. This function will be removed in Gesture Handler 3.'));

  if (_reactNative.Platform.OS !== 'web' || useNewWebImplementation === !shouldUseLegacyImplementation) {
    return;
  }

  if (getWasCalled) {
    console.error('Some parts of this application have already started using the new gesture handler implementation. No changes will be applied. You can try enabling legacy implementation earlier.');
    return;
  }

  useNewWebImplementation = !shouldUseLegacyImplementation;
}

function isNewWebImplementationEnabled() {
  getWasCalled = true;
  return useNewWebImplementation;
}
//# sourceMappingURL=EnableNewWebImplementation.js.map