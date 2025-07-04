'use strict';

var firebase = require('@firebase/app-compat');
var component = require('@firebase/component');
var remoteConfig = require('@firebase/remote-config');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var firebase__default = /*#__PURE__*/_interopDefaultLegacy(firebase);

/**
 * @license
 * Copyright 2020 Google LLC
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
class RemoteConfigCompatImpl {
    constructor(app, _delegate) {
        this.app = app;
        this._delegate = _delegate;
    }
    get defaultConfig() {
        return this._delegate.defaultConfig;
    }
    set defaultConfig(value) {
        this._delegate.defaultConfig = value;
    }
    get fetchTimeMillis() {
        return this._delegate.fetchTimeMillis;
    }
    get lastFetchStatus() {
        return this._delegate.lastFetchStatus;
    }
    get settings() {
        return this._delegate.settings;
    }
    set settings(value) {
        this._delegate.settings = value;
    }
    activate() {
        return remoteConfig.activate(this._delegate);
    }
    ensureInitialized() {
        return remoteConfig.ensureInitialized(this._delegate);
    }
    /**
     * @throws a {@link ErrorCode.FETCH_CLIENT_TIMEOUT} if the request takes longer than
     * {@link Settings.fetchTimeoutInSeconds} or
     * {@link DEFAULT_FETCH_TIMEOUT_SECONDS}.
     */
    fetch() {
        return remoteConfig.fetchConfig(this._delegate);
    }
    fetchAndActivate() {
        return remoteConfig.fetchAndActivate(this._delegate);
    }
    getAll() {
        return remoteConfig.getAll(this._delegate);
    }
    getBoolean(key) {
        return remoteConfig.getBoolean(this._delegate, key);
    }
    getNumber(key) {
        return remoteConfig.getNumber(this._delegate, key);
    }
    getString(key) {
        return remoteConfig.getString(this._delegate, key);
    }
    getValue(key) {
        return remoteConfig.getValue(this._delegate, key);
    }
    // Based on packages/firestore/src/util/log.ts but not static because we need per-instance levels
    // to differentiate 2p and 3p use-cases.
    setLogLevel(logLevel) {
        remoteConfig.setLogLevel(this._delegate, logLevel);
    }
}

const name = "@firebase/remote-config-compat";
const version = "0.2.17";

/**
 * @license
 * Copyright 2020 Google LLC
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
function registerRemoteConfigCompat(firebaseInstance) {
    firebaseInstance.INTERNAL.registerComponent(new component.Component('remoteConfig-compat', remoteConfigFactory, "PUBLIC" /* ComponentType.PUBLIC */)
        .setMultipleInstances(true)
        .setServiceProps({ isSupported: remoteConfig.isSupported }));
    firebaseInstance.registerVersion(name, version);
}
function remoteConfigFactory(container, { instanceIdentifier: namespace }) {
    const app = container.getProvider('app-compat').getImmediate();
    // The following call will always succeed because rc `import {...} from '@firebase/remote-config'`
    const remoteConfig = container.getProvider('remote-config').getImmediate({
        identifier: namespace
    });
    return new RemoteConfigCompatImpl(app, remoteConfig);
}
registerRemoteConfigCompat(firebase__default["default"]);
//# sourceMappingURL=index.cjs.js.map
