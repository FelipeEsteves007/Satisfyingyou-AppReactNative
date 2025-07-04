'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var app = require('@firebase/app');
var util = require('@firebase/util');
var component = require('@firebase/component');

/**
 * @license
 * Copyright 2017 Google LLC
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
const LONG_TYPE = 'type.googleapis.com/google.protobuf.Int64Value';
const UNSIGNED_LONG_TYPE = 'type.googleapis.com/google.protobuf.UInt64Value';
function mapValues(
// { [k: string]: unknown } is no longer a wildcard assignment target after typescript 3.5
// eslint-disable-next-line @typescript-eslint/no-explicit-any
o, f) {
    const result = {};
    for (const key in o) {
        if (o.hasOwnProperty(key)) {
            result[key] = f(o[key]);
        }
    }
    return result;
}
/**
 * Takes data and encodes it in a JSON-friendly way, such that types such as
 * Date are preserved.
 * @internal
 * @param data - Data to encode.
 */
function encode(data) {
    if (data == null) {
        return null;
    }
    if (data instanceof Number) {
        data = data.valueOf();
    }
    if (typeof data === 'number' && isFinite(data)) {
        // Any number in JS is safe to put directly in JSON and parse as a double
        // without any loss of precision.
        return data;
    }
    if (data === true || data === false) {
        return data;
    }
    if (Object.prototype.toString.call(data) === '[object String]') {
        return data;
    }
    if (data instanceof Date) {
        return data.toISOString();
    }
    if (Array.isArray(data)) {
        return data.map(x => encode(x));
    }
    if (typeof data === 'function' || typeof data === 'object') {
        return mapValues(data, x => encode(x));
    }
    // If we got this far, the data is not encodable.
    throw new Error('Data cannot be encoded in JSON: ' + data);
}
/**
 * Takes data that's been encoded in a JSON-friendly form and returns a form
 * with richer datatypes, such as Dates, etc.
 * @internal
 * @param json - JSON to convert.
 */
function decode(json) {
    if (json == null) {
        return json;
    }
    if (json['@type']) {
        switch (json['@type']) {
            case LONG_TYPE:
            // Fall through and handle this the same as unsigned.
            case UNSIGNED_LONG_TYPE: {
                // Technically, this could work return a valid number for malformed
                // data if there was a number followed by garbage. But it's just not
                // worth all the extra code to detect that case.
                const value = Number(json['value']);
                if (isNaN(value)) {
                    throw new Error('Data cannot be decoded from JSON: ' + json);
                }
                return value;
            }
            default: {
                throw new Error('Data cannot be decoded from JSON: ' + json);
            }
        }
    }
    if (Array.isArray(json)) {
        return json.map(x => decode(x));
    }
    if (typeof json === 'function' || typeof json === 'object') {
        return mapValues(json, x => decode(x));
    }
    // Anything else is safe to return.
    return json;
}

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
/**
 * Type constant for Firebase Functions.
 */
const FUNCTIONS_TYPE = 'functions';

/**
 * @license
 * Copyright 2017 Google LLC
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
/**
 * Standard error codes for different ways a request can fail, as defined by:
 * https://github.com/googleapis/googleapis/blob/master/google/rpc/code.proto
 *
 * This map is used primarily to convert from a backend error code string to
 * a client SDK error code string, and make sure it's in the supported set.
 */
const errorCodeMap = {
    OK: 'ok',
    CANCELLED: 'cancelled',
    UNKNOWN: 'unknown',
    INVALID_ARGUMENT: 'invalid-argument',
    DEADLINE_EXCEEDED: 'deadline-exceeded',
    NOT_FOUND: 'not-found',
    ALREADY_EXISTS: 'already-exists',
    PERMISSION_DENIED: 'permission-denied',
    UNAUTHENTICATED: 'unauthenticated',
    RESOURCE_EXHAUSTED: 'resource-exhausted',
    FAILED_PRECONDITION: 'failed-precondition',
    ABORTED: 'aborted',
    OUT_OF_RANGE: 'out-of-range',
    UNIMPLEMENTED: 'unimplemented',
    INTERNAL: 'internal',
    UNAVAILABLE: 'unavailable',
    DATA_LOSS: 'data-loss'
};
/**
 * An error returned by the Firebase Functions client SDK.
 *
 * See {@link FunctionsErrorCode} for full documentation of codes.
 *
 * @public
 */
class FunctionsError extends util.FirebaseError {
    /**
     * Constructs a new instance of the `FunctionsError` class.
     */
    constructor(
    /**
     * A standard error code that will be returned to the client. This also
     * determines the HTTP status code of the response, as defined in code.proto.
     */
    code, message, 
    /**
     * Additional details to be converted to JSON and included in the error response.
     */
    details) {
        super(`${FUNCTIONS_TYPE}/${code}`, message || '');
        this.details = details;
        // Since the FirebaseError constructor sets the prototype of `this` to FirebaseError.prototype,
        // we also have to do it in all subclasses to allow for correct `instanceof` checks.
        Object.setPrototypeOf(this, FunctionsError.prototype);
    }
}
/**
 * Takes an HTTP status code and returns the corresponding ErrorCode.
 * This is the standard HTTP status code -> error mapping defined in:
 * https://github.com/googleapis/googleapis/blob/master/google/rpc/code.proto
 *
 * @param status An HTTP status code.
 * @return The corresponding ErrorCode, or ErrorCode.UNKNOWN if none.
 */
function codeForHTTPStatus(status) {
    // Make sure any successful status is OK.
    if (status >= 200 && status < 300) {
        return 'ok';
    }
    switch (status) {
        case 0:
            // This can happen if the server returns 500.
            return 'internal';
        case 400:
            return 'invalid-argument';
        case 401:
            return 'unauthenticated';
        case 403:
            return 'permission-denied';
        case 404:
            return 'not-found';
        case 409:
            return 'aborted';
        case 429:
            return 'resource-exhausted';
        case 499:
            return 'cancelled';
        case 500:
            return 'internal';
        case 501:
            return 'unimplemented';
        case 503:
            return 'unavailable';
        case 504:
            return 'deadline-exceeded';
    }
    return 'unknown';
}
/**
 * Takes an HTTP response and returns the corresponding Error, if any.
 */
function _errorForResponse(status, bodyJSON) {
    let code = codeForHTTPStatus(status);
    // Start with reasonable defaults from the status code.
    let description = code;
    let details = undefined;
    // Then look through the body for explicit details.
    try {
        const errorJSON = bodyJSON && bodyJSON.error;
        if (errorJSON) {
            const status = errorJSON.status;
            if (typeof status === 'string') {
                if (!errorCodeMap[status]) {
                    // They must've included an unknown error code in the body.
                    return new FunctionsError('internal', 'internal');
                }
                code = errorCodeMap[status];
                // TODO(klimt): Add better default descriptions for error enums.
                // The default description needs to be updated for the new code.
                description = status;
            }
            const message = errorJSON.message;
            if (typeof message === 'string') {
                description = message;
            }
            details = errorJSON.details;
            if (details !== undefined) {
                details = decode(details);
            }
        }
    }
    catch (e) {
        // If we couldn't parse explicit error data, that's fine.
    }
    if (code === 'ok') {
        // Technically, there's an edge case where a developer could explicitly
        // return an error code of OK, and we will treat it as success, but that
        // seems reasonable.
        return null;
    }
    return new FunctionsError(code, description, details);
}

/**
 * @license
 * Copyright 2017 Google LLC
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
/**
 * Helper class to get metadata that should be included with a function call.
 * @internal
 */
class ContextProvider {
    constructor(app$1, authProvider, messagingProvider, appCheckProvider) {
        this.app = app$1;
        this.auth = null;
        this.messaging = null;
        this.appCheck = null;
        this.serverAppAppCheckToken = null;
        if (app._isFirebaseServerApp(app$1) && app$1.settings.appCheckToken) {
            this.serverAppAppCheckToken = app$1.settings.appCheckToken;
        }
        this.auth = authProvider.getImmediate({ optional: true });
        this.messaging = messagingProvider.getImmediate({
            optional: true
        });
        if (!this.auth) {
            authProvider.get().then(auth => (this.auth = auth), () => {
                /* get() never rejects */
            });
        }
        if (!this.messaging) {
            messagingProvider.get().then(messaging => (this.messaging = messaging), () => {
                /* get() never rejects */
            });
        }
        if (!this.appCheck) {
            appCheckProvider === null || appCheckProvider === void 0 ? void 0 : appCheckProvider.get().then(appCheck => (this.appCheck = appCheck), () => {
                /* get() never rejects */
            });
        }
    }
    async getAuthToken() {
        if (!this.auth) {
            return undefined;
        }
        try {
            const token = await this.auth.getToken();
            return token === null || token === void 0 ? void 0 : token.accessToken;
        }
        catch (e) {
            // If there's any error when trying to get the auth token, leave it off.
            return undefined;
        }
    }
    async getMessagingToken() {
        if (!this.messaging ||
            !('Notification' in self) ||
            Notification.permission !== 'granted') {
            return undefined;
        }
        try {
            return await this.messaging.getToken();
        }
        catch (e) {
            // We don't warn on this, because it usually means messaging isn't set up.
            // console.warn('Failed to retrieve instance id token.', e);
            // If there's any error when trying to get the token, leave it off.
            return undefined;
        }
    }
    async getAppCheckToken(limitedUseAppCheckTokens) {
        if (this.serverAppAppCheckToken) {
            return this.serverAppAppCheckToken;
        }
        if (this.appCheck) {
            const result = limitedUseAppCheckTokens
                ? await this.appCheck.getLimitedUseToken()
                : await this.appCheck.getToken();
            if (result.error) {
                // Do not send the App Check header to the functions endpoint if
                // there was an error from the App Check exchange endpoint. The App
                // Check SDK will already have logged the error to console.
                return null;
            }
            return result.token;
        }
        return null;
    }
    async getContext(limitedUseAppCheckTokens) {
        const authToken = await this.getAuthToken();
        const messagingToken = await this.getMessagingToken();
        const appCheckToken = await this.getAppCheckToken(limitedUseAppCheckTokens);
        return { authToken, messagingToken, appCheckToken };
    }
}

/**
 * @license
 * Copyright 2017 Google LLC
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
const DEFAULT_REGION = 'us-central1';
const responseLineRE = /^data: (.*?)(?:\n|$)/;
/**
 * Returns a Promise that will be rejected after the given duration.
 * The error will be of type FunctionsError.
 *
 * @param millis Number of milliseconds to wait before rejecting.
 */
function failAfter(millis) {
    // Node timers and browser timers are fundamentally incompatible, but we
    // don't care about the value here
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let timer = null;
    return {
        promise: new Promise((_, reject) => {
            timer = setTimeout(() => {
                reject(new FunctionsError('deadline-exceeded', 'deadline-exceeded'));
            }, millis);
        }),
        cancel: () => {
            if (timer) {
                clearTimeout(timer);
            }
        }
    };
}
/**
 * The main class for the Firebase Functions SDK.
 * @internal
 */
class FunctionsService {
    /**
     * Creates a new Functions service for the given app.
     * @param app - The FirebaseApp to use.
     */
    constructor(app, authProvider, messagingProvider, appCheckProvider, regionOrCustomDomain = DEFAULT_REGION, fetchImpl = (...args) => fetch(...args)) {
        this.app = app;
        this.fetchImpl = fetchImpl;
        this.emulatorOrigin = null;
        this.contextProvider = new ContextProvider(app, authProvider, messagingProvider, appCheckProvider);
        // Cancels all ongoing requests when resolved.
        this.cancelAllRequests = new Promise(resolve => {
            this.deleteService = () => {
                return Promise.resolve(resolve());
            };
        });
        // Resolve the region or custom domain overload by attempting to parse it.
        try {
            const url = new URL(regionOrCustomDomain);
            this.customDomain =
                url.origin + (url.pathname === '/' ? '' : url.pathname);
            this.region = DEFAULT_REGION;
        }
        catch (e) {
            this.customDomain = null;
            this.region = regionOrCustomDomain;
        }
    }
    _delete() {
        return this.deleteService();
    }
    /**
     * Returns the URL for a callable with the given name.
     * @param name - The name of the callable.
     * @internal
     */
    _url(name) {
        const projectId = this.app.options.projectId;
        if (this.emulatorOrigin !== null) {
            const origin = this.emulatorOrigin;
            return `${origin}/${projectId}/${this.region}/${name}`;
        }
        if (this.customDomain !== null) {
            return `${this.customDomain}/${name}`;
        }
        return `https://${this.region}-${projectId}.cloudfunctions.net/${name}`;
    }
}
/**
 * Modify this instance to communicate with the Cloud Functions emulator.
 *
 * Note: this must be called before this instance has been used to do any operations.
 *
 * @param host The emulator host (ex: localhost)
 * @param port The emulator port (ex: 5001)
 * @public
 */
function connectFunctionsEmulator$1(functionsInstance, host, port) {
    const useSsl = util.isCloudWorkstation(host);
    functionsInstance.emulatorOrigin = `http${useSsl ? 's' : ''}://${host}:${port}`;
    // Workaround to get cookies in Firebase Studio
    if (useSsl) {
        void util.pingServer(functionsInstance.emulatorOrigin);
        util.updateEmulatorBanner('Functions', true);
    }
}
/**
 * Returns a reference to the callable https trigger with the given name.
 * @param name - The name of the trigger.
 * @public
 */
function httpsCallable$1(functionsInstance, name, options) {
    const callable = (data) => {
        return call(functionsInstance, name, data, options || {});
    };
    callable.stream = (data, options) => {
        return stream(functionsInstance, name, data, options);
    };
    return callable;
}
/**
 * Returns a reference to the callable https trigger with the given url.
 * @param url - The url of the trigger.
 * @public
 */
function httpsCallableFromURL$1(functionsInstance, url, options) {
    const callable = (data) => {
        return callAtURL(functionsInstance, url, data, options || {});
    };
    callable.stream = (data, options) => {
        return streamAtURL(functionsInstance, url, data, options || {});
    };
    return callable;
}
/**
 * Does an HTTP POST and returns the completed response.
 * @param url The url to post to.
 * @param body The JSON body of the post.
 * @param headers The HTTP headers to include in the request.
 * @return A Promise that will succeed when the request finishes.
 */
async function postJSON(url, body, headers, fetchImpl) {
    headers['Content-Type'] = 'application/json';
    let response;
    try {
        response = await fetchImpl(url, {
            method: 'POST',
            body: JSON.stringify(body),
            headers
        });
    }
    catch (e) {
        // This could be an unhandled error on the backend, or it could be a
        // network error. There's no way to know, since an unhandled error on the
        // backend will fail to set the proper CORS header, and thus will be
        // treated as a network error by fetch.
        return {
            status: 0,
            json: null
        };
    }
    let json = null;
    try {
        json = await response.json();
    }
    catch (e) {
        // If we fail to parse JSON, it will fail the same as an empty body.
    }
    return {
        status: response.status,
        json
    };
}
/**
 * Creates authorization headers for Firebase Functions requests.
 * @param functionsInstance The Firebase Functions service instance.
 * @param options Options for the callable function, including AppCheck token settings.
 * @return A Promise that resolves a headers map to include in outgoing fetch request.
 */
async function makeAuthHeaders(functionsInstance, options) {
    const headers = {};
    const context = await functionsInstance.contextProvider.getContext(options.limitedUseAppCheckTokens);
    if (context.authToken) {
        headers['Authorization'] = 'Bearer ' + context.authToken;
    }
    if (context.messagingToken) {
        headers['Firebase-Instance-ID-Token'] = context.messagingToken;
    }
    if (context.appCheckToken !== null) {
        headers['X-Firebase-AppCheck'] = context.appCheckToken;
    }
    return headers;
}
/**
 * Calls a callable function asynchronously and returns the result.
 * @param name The name of the callable trigger.
 * @param data The data to pass as params to the function.
 */
function call(functionsInstance, name, data, options) {
    const url = functionsInstance._url(name);
    return callAtURL(functionsInstance, url, data, options);
}
/**
 * Calls a callable function asynchronously and returns the result.
 * @param url The url of the callable trigger.
 * @param data The data to pass as params to the function.
 */
async function callAtURL(functionsInstance, url, data, options) {
    // Encode any special types, such as dates, in the input data.
    data = encode(data);
    const body = { data };
    // Add a header for the authToken.
    const headers = await makeAuthHeaders(functionsInstance, options);
    // Default timeout to 70s, but let the options override it.
    const timeout = options.timeout || 70000;
    const failAfterHandle = failAfter(timeout);
    const response = await Promise.race([
        postJSON(url, body, headers, functionsInstance.fetchImpl),
        failAfterHandle.promise,
        functionsInstance.cancelAllRequests
    ]);
    // Always clear the failAfter timeout
    failAfterHandle.cancel();
    // If service was deleted, interrupted response throws an error.
    if (!response) {
        throw new FunctionsError('cancelled', 'Firebase Functions instance was deleted.');
    }
    // Check for an error status, regardless of http status.
    const error = _errorForResponse(response.status, response.json);
    if (error) {
        throw error;
    }
    if (!response.json) {
        throw new FunctionsError('internal', 'Response is not valid JSON object.');
    }
    let responseData = response.json.data;
    // TODO(klimt): For right now, allow "result" instead of "data", for
    // backwards compatibility.
    if (typeof responseData === 'undefined') {
        responseData = response.json.result;
    }
    if (typeof responseData === 'undefined') {
        // Consider the response malformed.
        throw new FunctionsError('internal', 'Response is missing data field.');
    }
    // Decode any special types, such as dates, in the returned data.
    const decodedData = decode(responseData);
    return { data: decodedData };
}
/**
 * Calls a callable function asynchronously and returns a streaming result.
 * @param name The name of the callable trigger.
 * @param data The data to pass as params to the function.
 * @param options Streaming request options.
 */
function stream(functionsInstance, name, data, options) {
    const url = functionsInstance._url(name);
    return streamAtURL(functionsInstance, url, data, options || {});
}
/**
 * Calls a callable function asynchronously and return a streaming result.
 * @param url The url of the callable trigger.
 * @param data The data to pass as params to the function.
 * @param options Streaming request options.
 */
async function streamAtURL(functionsInstance, url, data, options) {
    var _a;
    // Encode any special types, such as dates, in the input data.
    data = encode(data);
    const body = { data };
    //
    // Add a header for the authToken.
    const headers = await makeAuthHeaders(functionsInstance, options);
    headers['Content-Type'] = 'application/json';
    headers['Accept'] = 'text/event-stream';
    let response;
    try {
        response = await functionsInstance.fetchImpl(url, {
            method: 'POST',
            body: JSON.stringify(body),
            headers,
            signal: options === null || options === void 0 ? void 0 : options.signal
        });
    }
    catch (e) {
        if (e instanceof Error && e.name === 'AbortError') {
            const error = new FunctionsError('cancelled', 'Request was cancelled.');
            return {
                data: Promise.reject(error),
                stream: {
                    [Symbol.asyncIterator]() {
                        return {
                            next() {
                                return Promise.reject(error);
                            }
                        };
                    }
                }
            };
        }
        // This could be an unhandled error on the backend, or it could be a
        // network error. There's no way to know, since an unhandled error on the
        // backend will fail to set the proper CORS header, and thus will be
        // treated as a network error by fetch.
        const error = _errorForResponse(0, null);
        return {
            data: Promise.reject(error),
            // Return an empty async iterator
            stream: {
                [Symbol.asyncIterator]() {
                    return {
                        next() {
                            return Promise.reject(error);
                        }
                    };
                }
            }
        };
    }
    let resultResolver;
    let resultRejecter;
    const resultPromise = new Promise((resolve, reject) => {
        resultResolver = resolve;
        resultRejecter = reject;
    });
    (_a = options === null || options === void 0 ? void 0 : options.signal) === null || _a === void 0 ? void 0 : _a.addEventListener('abort', () => {
        const error = new FunctionsError('cancelled', 'Request was cancelled.');
        resultRejecter(error);
    });
    const reader = response.body.getReader();
    const rstream = createResponseStream(reader, resultResolver, resultRejecter, options === null || options === void 0 ? void 0 : options.signal);
    return {
        stream: {
            [Symbol.asyncIterator]() {
                const rreader = rstream.getReader();
                return {
                    async next() {
                        const { value, done } = await rreader.read();
                        return { value: value, done };
                    },
                    async return() {
                        await rreader.cancel();
                        return { done: true, value: undefined };
                    }
                };
            }
        },
        data: resultPromise
    };
}
/**
 * Creates a ReadableStream that processes a streaming response from a streaming
 * callable function that returns data in server-sent event format.
 *
 * @param reader The underlying reader providing raw response data
 * @param resultResolver Callback to resolve the final result when received
 * @param resultRejecter Callback to reject with an error if encountered
 * @param signal Optional AbortSignal to cancel the stream processing
 * @returns A ReadableStream that emits decoded messages from the response
 *
 * The returned ReadableStream:
 *   1. Emits individual messages when "message" data is received
 *   2. Resolves with the final result when a "result" message is received
 *   3. Rejects with an error if an "error" message is received
 */
function createResponseStream(reader, resultResolver, resultRejecter, signal) {
    const processLine = (line, controller) => {
        const match = line.match(responseLineRE);
        // ignore all other lines (newline, comments, etc.)
        if (!match) {
            return;
        }
        const data = match[1];
        try {
            const jsonData = JSON.parse(data);
            if ('result' in jsonData) {
                resultResolver(decode(jsonData.result));
                return;
            }
            if ('message' in jsonData) {
                controller.enqueue(decode(jsonData.message));
                return;
            }
            if ('error' in jsonData) {
                const error = _errorForResponse(0, jsonData);
                controller.error(error);
                resultRejecter(error);
                return;
            }
        }
        catch (error) {
            if (error instanceof FunctionsError) {
                controller.error(error);
                resultRejecter(error);
                return;
            }
            // ignore other parsing errors
        }
    };
    const decoder = new TextDecoder();
    return new ReadableStream({
        start(controller) {
            let currentText = '';
            return pump();
            async function pump() {
                if (signal === null || signal === void 0 ? void 0 : signal.aborted) {
                    const error = new FunctionsError('cancelled', 'Request was cancelled');
                    controller.error(error);
                    resultRejecter(error);
                    return Promise.resolve();
                }
                try {
                    const { value, done } = await reader.read();
                    if (done) {
                        if (currentText.trim()) {
                            processLine(currentText.trim(), controller);
                        }
                        controller.close();
                        return;
                    }
                    if (signal === null || signal === void 0 ? void 0 : signal.aborted) {
                        const error = new FunctionsError('cancelled', 'Request was cancelled');
                        controller.error(error);
                        resultRejecter(error);
                        await reader.cancel();
                        return;
                    }
                    currentText += decoder.decode(value, { stream: true });
                    const lines = currentText.split('\n');
                    currentText = lines.pop() || '';
                    for (const line of lines) {
                        if (line.trim()) {
                            processLine(line.trim(), controller);
                        }
                    }
                    return pump();
                }
                catch (error) {
                    const functionsError = error instanceof FunctionsError
                        ? error
                        : _errorForResponse(0, null);
                    controller.error(functionsError);
                    resultRejecter(functionsError);
                }
            }
        },
        cancel() {
            return reader.cancel();
        }
    });
}

const name = "@firebase/functions";
const version = "0.12.8";

/**
 * @license
 * Copyright 2019 Google LLC
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
const AUTH_INTERNAL_NAME = 'auth-internal';
const APP_CHECK_INTERNAL_NAME = 'app-check-internal';
const MESSAGING_INTERNAL_NAME = 'messaging-internal';
function registerFunctions(variant) {
    const factory = (container, { instanceIdentifier: regionOrCustomDomain }) => {
        // Dependencies
        const app = container.getProvider('app').getImmediate();
        const authProvider = container.getProvider(AUTH_INTERNAL_NAME);
        const messagingProvider = container.getProvider(MESSAGING_INTERNAL_NAME);
        const appCheckProvider = container.getProvider(APP_CHECK_INTERNAL_NAME);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return new FunctionsService(app, authProvider, messagingProvider, appCheckProvider, regionOrCustomDomain);
    };
    app._registerComponent(new component.Component(FUNCTIONS_TYPE, factory, "PUBLIC" /* ComponentType.PUBLIC */).setMultipleInstances(true));
    app.registerVersion(name, version, variant);
    // BUILD_TARGET will be replaced by values like esm2017, cjs2017, etc during the compilation
    app.registerVersion(name, version, 'cjs2017');
}

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
/**
 * Returns a {@link Functions} instance for the given app.
 * @param app - The {@link @firebase/app#FirebaseApp} to use.
 * @param regionOrCustomDomain - one of:
 *   a) The region the callable functions are located in (ex: us-central1)
 *   b) A custom domain hosting the callable functions (ex: https://mydomain.com)
 * @public
 */
function getFunctions(app$1 = app.getApp(), regionOrCustomDomain = DEFAULT_REGION) {
    // Dependencies
    const functionsProvider = app._getProvider(util.getModularInstance(app$1), FUNCTIONS_TYPE);
    const functionsInstance = functionsProvider.getImmediate({
        identifier: regionOrCustomDomain
    });
    const emulator = util.getDefaultEmulatorHostnameAndPort('functions');
    if (emulator) {
        connectFunctionsEmulator(functionsInstance, ...emulator);
    }
    return functionsInstance;
}
/**
 * Modify this instance to communicate with the Cloud Functions emulator.
 *
 * Note: this must be called before this instance has been used to do any operations.
 *
 * @param host - The emulator host (ex: localhost)
 * @param port - The emulator port (ex: 5001)
 * @public
 */
function connectFunctionsEmulator(functionsInstance, host, port) {
    connectFunctionsEmulator$1(util.getModularInstance(functionsInstance), host, port);
}
/**
 * Returns a reference to the callable HTTPS trigger with the given name.
 * @param name - The name of the trigger.
 * @public
 */
function httpsCallable(functionsInstance, name, options) {
    return httpsCallable$1(util.getModularInstance(functionsInstance), name, options);
}
/**
 * Returns a reference to the callable HTTPS trigger with the specified url.
 * @param url - The url of the trigger.
 * @public
 */
function httpsCallableFromURL(functionsInstance, url, options) {
    return httpsCallableFromURL$1(util.getModularInstance(functionsInstance), url, options);
}

/**
 * Cloud Functions for Firebase
 *
 * @packageDocumentation
 */
registerFunctions();

exports.FunctionsError = FunctionsError;
exports.connectFunctionsEmulator = connectFunctionsEmulator;
exports.getFunctions = getFunctions;
exports.httpsCallable = httpsCallable;
exports.httpsCallableFromURL = httpsCallableFromURL;
//# sourceMappingURL=index.cjs.js.map
