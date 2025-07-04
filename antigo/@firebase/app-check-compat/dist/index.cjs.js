'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var firebase = require('@firebase/app-compat');
var component = require('@firebase/component');
var appCheck = require('@firebase/app-check');
var util = require('@firebase/util');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var firebase__default = /*#__PURE__*/_interopDefaultLegacy(firebase);

const name = "@firebase/app-check-compat";
const version = "0.3.25";

/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const ERRORS = {
    ["use-before-activation" /* AppCheckError.USE_BEFORE_ACTIVATION */]: 'App Check is being used before activate() is called for FirebaseApp {$appName}. ' +
        'Call activate() before instantiating other Firebase services.'
};
const ERROR_FACTORY = new util.ErrorFactory('appCheck', 'AppCheck', ERRORS);

/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class AppCheckService {
    constructor(app) {
        this.app = app;
    }
    activate(siteKeyOrProvider, isTokenAutoRefreshEnabled) {
        let provider;
        if (typeof siteKeyOrProvider === 'string') {
            provider = new appCheck.ReCaptchaV3Provider(siteKeyOrProvider);
        }
        else if (siteKeyOrProvider instanceof appCheck.ReCaptchaEnterpriseProvider ||
            siteKeyOrProvider instanceof appCheck.ReCaptchaV3Provider ||
            siteKeyOrProvider instanceof appCheck.CustomProvider) {
            provider = siteKeyOrProvider;
        }
        else {
            provider = new appCheck.CustomProvider({ getToken: siteKeyOrProvider.getToken });
        }
        this._delegate = appCheck.initializeAppCheck(this.app, {
            provider,
            isTokenAutoRefreshEnabled
        });
    }
    setTokenAutoRefreshEnabled(isTokenAutoRefreshEnabled) {
        if (!this._delegate) {
            throw ERROR_FACTORY.create("use-before-activation" /* AppCheckError.USE_BEFORE_ACTIVATION */, {
                appName: this.app.name
            });
        }
        appCheck.setTokenAutoRefreshEnabled(this._delegate, isTokenAutoRefreshEnabled);
    }
    getToken(forceRefresh) {
        if (!this._delegate) {
            throw ERROR_FACTORY.create("use-before-activation" /* AppCheckError.USE_BEFORE_ACTIVATION */, {
                appName: this.app.name
            });
        }
        return appCheck.getToken(this._delegate, forceRefresh);
    }
    onTokenChanged(onNextOrObserver, onError, onCompletion) {
        if (!this._delegate) {
            throw ERROR_FACTORY.create("use-before-activation" /* AppCheckError.USE_BEFORE_ACTIVATION */, {
                appName: this.app.name
            });
        }
        return appCheck.onTokenChanged(this._delegate, 
        /**
         * Exp onTokenChanged() will handle both overloads but we need
         * to specify one to not confuse TypeScript.
         */
        onNextOrObserver, onError, onCompletion);
    }
}

/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const factory = (container) => {
    // Dependencies
    const app = container.getProvider('app-compat').getImmediate();
    return new AppCheckService(app);
};
function registerAppCheck() {
    firebase__default["default"].INTERNAL.registerComponent(new component.Component('appCheck-compat', factory, "PUBLIC" /* ComponentType.PUBLIC */).setServiceProps({
        ReCaptchaEnterpriseProvider: appCheck.ReCaptchaEnterpriseProvider,
        ReCaptchaV3Provider: appCheck.ReCaptchaV3Provider,
        CustomProvider: appCheck.CustomProvider
    }));
}
registerAppCheck();
firebase__default["default"].registerVersion(name, version);

exports.registerAppCheck = registerAppCheck;
//# sourceMappingURL=index.cjs.js.map
