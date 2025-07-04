'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var firebase = require('@firebase/app-compat');
var firestore = require('@firebase/firestore');
var util = require('@firebase/util');
var component = require('@firebase/component');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var firebase__default = /*#__PURE__*/_interopDefaultLegacy(firebase);

const name = "@firebase/firestore-compat";
const version = "0.3.51";

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
function validateSetOptions(methodName, options) {
    if (options === undefined) {
        return {
            merge: false
        };
    }
    if (options.mergeFields !== undefined && options.merge !== undefined) {
        throw new firestore.FirestoreError('invalid-argument', `Invalid options passed to function ${methodName}(): You cannot ` +
            'specify both "merge" and "mergeFields".');
    }
    return options;
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
/** Helper function to assert Uint8Array is available at runtime. */
function assertUint8ArrayAvailable() {
    if (typeof Uint8Array === 'undefined') {
        throw new firestore.FirestoreError('unimplemented', 'Uint8Arrays are not available in this environment.');
    }
}
/** Helper function to assert Base64 functions are available at runtime. */
function assertBase64Available() {
    if (!firestore._isBase64Available()) {
        throw new firestore.FirestoreError('unimplemented', 'Blobs are unavailable in Firestore in this environment.');
    }
}
/** Immutable class holding a blob (binary data) */
class Blob {
    constructor(_delegate) {
        this._delegate = _delegate;
    }
    static fromBase64String(base64) {
        assertBase64Available();
        return new Blob(firestore.Bytes.fromBase64String(base64));
    }
    static fromUint8Array(array) {
        assertUint8ArrayAvailable();
        return new Blob(firestore.Bytes.fromUint8Array(array));
    }
    toBase64() {
        assertBase64Available();
        return this._delegate.toBase64();
    }
    toUint8Array() {
        assertUint8ArrayAvailable();
        return this._delegate.toUint8Array();
    }
    isEqual(other) {
        return this._delegate.isEqual(other._delegate);
    }
    toString() {
        return 'Blob(base64: ' + this.toBase64() + ')';
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
function isPartialObserver(obj) {
    return implementsAnyMethods(obj, ['next', 'error', 'complete']);
}
/**
 * Returns true if obj is an object and contains at least one of the specified
 * methods.
 */
function implementsAnyMethods(obj, methods) {
    if (typeof obj !== 'object' || obj === null) {
        return false;
    }
    const object = obj;
    for (const method of methods) {
        if (method in object && typeof object[method] === 'function') {
            return true;
        }
    }
    return false;
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
 * The persistence provider included with the full Firestore SDK.
 */
class IndexedDbPersistenceProvider {
    enableIndexedDbPersistence(firestore$1, forceOwnership) {
        return firestore.enableIndexedDbPersistence(firestore$1._delegate, { forceOwnership });
    }
    enableMultiTabIndexedDbPersistence(firestore$1) {
        return firestore.enableMultiTabIndexedDbPersistence(firestore$1._delegate);
    }
    clearIndexedDbPersistence(firestore$1) {
        return firestore.clearIndexedDbPersistence(firestore$1._delegate);
    }
}
/**
 * Compat class for Firestore. Exposes Firestore Legacy API, but delegates
 * to the functional API of firestore-exp.
 */
class Firestore {
    constructor(databaseIdOrApp, _delegate, _persistenceProvider) {
        this._delegate = _delegate;
        this._persistenceProvider = _persistenceProvider;
        this.INTERNAL = {
            delete: () => this.terminate()
        };
        if (!(databaseIdOrApp instanceof firestore._DatabaseId)) {
            this._appCompat = databaseIdOrApp;
        }
    }
    get _databaseId() {
        return this._delegate._databaseId;
    }
    settings(settingsLiteral) {
        const currentSettings = this._delegate._getSettings();
        if (!settingsLiteral.merge &&
            currentSettings.host !== settingsLiteral.host) {
            firestore._logWarn('You are overriding the original host. If you did not intend ' +
                'to override your settings, use {merge: true}.');
        }
        if (settingsLiteral.merge) {
            settingsLiteral = Object.assign(Object.assign({}, currentSettings), settingsLiteral);
            // Remove the property from the settings once the merge is completed
            delete settingsLiteral.merge;
        }
        this._delegate._setSettings(settingsLiteral);
    }
    useEmulator(host, port, options = {}) {
        firestore.connectFirestoreEmulator(this._delegate, host, port, options);
    }
    enableNetwork() {
        return firestore.enableNetwork(this._delegate);
    }
    disableNetwork() {
        return firestore.disableNetwork(this._delegate);
    }
    enablePersistence(settings) {
        let synchronizeTabs = false;
        let experimentalForceOwningTab = false;
        if (settings) {
            synchronizeTabs = !!settings.synchronizeTabs;
            experimentalForceOwningTab = !!settings.experimentalForceOwningTab;
            firestore._validateIsNotUsedTogether('synchronizeTabs', synchronizeTabs, 'experimentalForceOwningTab', experimentalForceOwningTab);
        }
        return synchronizeTabs
            ? this._persistenceProvider.enableMultiTabIndexedDbPersistence(this)
            : this._persistenceProvider.enableIndexedDbPersistence(this, experimentalForceOwningTab);
    }
    clearPersistence() {
        return this._persistenceProvider.clearIndexedDbPersistence(this);
    }
    terminate() {
        if (this._appCompat) {
            this._appCompat._removeServiceInstance('firestore-compat');
            this._appCompat._removeServiceInstance('firestore');
        }
        return this._delegate._delete();
    }
    waitForPendingWrites() {
        return firestore.waitForPendingWrites(this._delegate);
    }
    onSnapshotsInSync(arg) {
        return firestore.onSnapshotsInSync(this._delegate, arg);
    }
    get app() {
        if (!this._appCompat) {
            throw new firestore.FirestoreError('failed-precondition', "Firestore was not initialized using the Firebase SDK. 'app' is " +
                'not available');
        }
        return this._appCompat;
    }
    collection(pathString) {
        try {
            return new CollectionReference(this, firestore.collection(this._delegate, pathString));
        }
        catch (e) {
            throw replaceFunctionName(e, 'collection()', 'Firestore.collection()');
        }
    }
    doc(pathString) {
        try {
            return new DocumentReference(this, firestore.doc(this._delegate, pathString));
        }
        catch (e) {
            throw replaceFunctionName(e, 'doc()', 'Firestore.doc()');
        }
    }
    collectionGroup(collectionId) {
        try {
            return new Query(this, firestore.collectionGroup(this._delegate, collectionId));
        }
        catch (e) {
            throw replaceFunctionName(e, 'collectionGroup()', 'Firestore.collectionGroup()');
        }
    }
    runTransaction(updateFunction) {
        return firestore.runTransaction(this._delegate, transaction => updateFunction(new Transaction(this, transaction)));
    }
    batch() {
        firestore.ensureFirestoreConfigured(this._delegate);
        return new WriteBatch(new firestore.WriteBatch(this._delegate, mutations => firestore.executeWrite(this._delegate, mutations)));
    }
    loadBundle(bundleData) {
        return firestore.loadBundle(this._delegate, bundleData);
    }
    namedQuery(name) {
        return firestore.namedQuery(this._delegate, name).then(expQuery => {
            if (!expQuery) {
                return null;
            }
            return new Query(this, 
            // We can pass `expQuery` here directly since named queries don't have a UserDataConverter.
            // Otherwise, we would have to create a new ExpQuery and pass the old UserDataConverter.
            expQuery);
        });
    }
}
class UserDataWriter extends firestore.AbstractUserDataWriter {
    constructor(firestore) {
        super();
        this.firestore = firestore;
    }
    convertBytes(bytes) {
        return new Blob(new firestore.Bytes(bytes));
    }
    convertReference(name) {
        const key = this.convertDocumentKey(name, this.firestore._databaseId);
        return DocumentReference.forKey(key, this.firestore, /* converter= */ null);
    }
}
function setLogLevel(level) {
    firestore.setLogLevel(level);
}
/**
 * A reference to a transaction.
 */
class Transaction {
    constructor(_firestore, _delegate) {
        this._firestore = _firestore;
        this._delegate = _delegate;
        this._userDataWriter = new UserDataWriter(_firestore);
    }
    get(documentRef) {
        const ref = castReference(documentRef);
        return this._delegate
            .get(ref)
            .then(result => new DocumentSnapshot(this._firestore, new firestore.DocumentSnapshot(this._firestore._delegate, this._userDataWriter, result._key, result._document, result.metadata, ref.converter)));
    }
    set(documentRef, data, options) {
        const ref = castReference(documentRef);
        if (options) {
            validateSetOptions('Transaction.set', options);
            this._delegate.set(ref, data, options);
        }
        else {
            this._delegate.set(ref, data);
        }
        return this;
    }
    update(documentRef, dataOrField, value, ...moreFieldsAndValues) {
        const ref = castReference(documentRef);
        if (arguments.length === 2) {
            this._delegate.update(ref, dataOrField);
        }
        else {
            this._delegate.update(ref, dataOrField, value, ...moreFieldsAndValues);
        }
        return this;
    }
    delete(documentRef) {
        const ref = castReference(documentRef);
        this._delegate.delete(ref);
        return this;
    }
}
class WriteBatch {
    constructor(_delegate) {
        this._delegate = _delegate;
    }
    set(documentRef, data, options) {
        const ref = castReference(documentRef);
        if (options) {
            validateSetOptions('WriteBatch.set', options);
            this._delegate.set(ref, data, options);
        }
        else {
            this._delegate.set(ref, data);
        }
        return this;
    }
    update(documentRef, dataOrField, value, ...moreFieldsAndValues) {
        const ref = castReference(documentRef);
        if (arguments.length === 2) {
            this._delegate.update(ref, dataOrField);
        }
        else {
            this._delegate.update(ref, dataOrField, value, ...moreFieldsAndValues);
        }
        return this;
    }
    delete(documentRef) {
        const ref = castReference(documentRef);
        this._delegate.delete(ref);
        return this;
    }
    commit() {
        return this._delegate.commit();
    }
}
/**
 * Wraps a `PublicFirestoreDataConverter` translating the types from the
 * experimental SDK into corresponding types from the Classic SDK before passing
 * them to the wrapped converter.
 */
class FirestoreDataConverter {
    constructor(_firestore, _userDataWriter, _delegate) {
        this._firestore = _firestore;
        this._userDataWriter = _userDataWriter;
        this._delegate = _delegate;
    }
    fromFirestore(snapshot, options) {
        const expSnapshot = new firestore.QueryDocumentSnapshot(this._firestore._delegate, this._userDataWriter, snapshot._key, snapshot._document, snapshot.metadata, 
        /* converter= */ null);
        return this._delegate.fromFirestore(new QueryDocumentSnapshot(this._firestore, expSnapshot), options !== null && options !== void 0 ? options : {});
    }
    toFirestore(modelObject, options) {
        if (!options) {
            return this._delegate.toFirestore(modelObject);
        }
        else {
            return this._delegate.toFirestore(modelObject, options);
        }
    }
    // Use the same instance of `FirestoreDataConverter` for the given instances
    // of `Firestore` and `PublicFirestoreDataConverter` so that isEqual() will
    // compare equal for two objects created with the same converter instance.
    static getInstance(firestore, converter) {
        const converterMapByFirestore = FirestoreDataConverter.INSTANCES;
        let untypedConverterByConverter = converterMapByFirestore.get(firestore);
        if (!untypedConverterByConverter) {
            untypedConverterByConverter = new WeakMap();
            converterMapByFirestore.set(firestore, untypedConverterByConverter);
        }
        let instance = untypedConverterByConverter.get(converter);
        if (!instance) {
            instance = new FirestoreDataConverter(firestore, new UserDataWriter(firestore), converter);
            untypedConverterByConverter.set(converter, instance);
        }
        return instance;
    }
}
FirestoreDataConverter.INSTANCES = new WeakMap();
/**
 * A reference to a particular document in a collection in the database.
 */
class DocumentReference {
    constructor(firestore, _delegate) {
        this.firestore = firestore;
        this._delegate = _delegate;
        this._userDataWriter = new UserDataWriter(firestore);
    }
    static forPath(path, firestore$1, converter) {
        if (path.length % 2 !== 0) {
            throw new firestore.FirestoreError('invalid-argument', 'Invalid document reference. Document ' +
                'references must have an even number of segments, but ' +
                `${path.canonicalString()} has ${path.length}`);
        }
        return new DocumentReference(firestore$1, new firestore.DocumentReference(firestore$1._delegate, converter, new firestore._DocumentKey(path)));
    }
    static forKey(key, firestore$1, converter) {
        return new DocumentReference(firestore$1, new firestore.DocumentReference(firestore$1._delegate, converter, key));
    }
    get id() {
        return this._delegate.id;
    }
    get parent() {
        return new CollectionReference(this.firestore, this._delegate.parent);
    }
    get path() {
        return this._delegate.path;
    }
    collection(pathString) {
        try {
            return new CollectionReference(this.firestore, firestore.collection(this._delegate, pathString));
        }
        catch (e) {
            throw replaceFunctionName(e, 'collection()', 'DocumentReference.collection()');
        }
    }
    isEqual(other) {
        other = util.getModularInstance(other);
        if (!(other instanceof firestore.DocumentReference)) {
            return false;
        }
        return firestore.refEqual(this._delegate, other);
    }
    set(value, options) {
        options = validateSetOptions('DocumentReference.set', options);
        try {
            if (options) {
                return firestore.setDoc(this._delegate, value, options);
            }
            else {
                return firestore.setDoc(this._delegate, value);
            }
        }
        catch (e) {
            throw replaceFunctionName(e, 'setDoc()', 'DocumentReference.set()');
        }
    }
    update(fieldOrUpdateData, value, ...moreFieldsAndValues) {
        try {
            if (arguments.length === 1) {
                return firestore.updateDoc(this._delegate, fieldOrUpdateData);
            }
            else {
                return firestore.updateDoc(this._delegate, fieldOrUpdateData, value, ...moreFieldsAndValues);
            }
        }
        catch (e) {
            throw replaceFunctionName(e, 'updateDoc()', 'DocumentReference.update()');
        }
    }
    delete() {
        return firestore.deleteDoc(this._delegate);
    }
    onSnapshot(...args) {
        const options = extractSnapshotOptions(args);
        const observer = wrapObserver(args, result => new DocumentSnapshot(this.firestore, new firestore.DocumentSnapshot(this.firestore._delegate, this._userDataWriter, result._key, result._document, result.metadata, this._delegate.converter)));
        return firestore.onSnapshot(this._delegate, options, observer);
    }
    get(options) {
        let snap;
        if ((options === null || options === void 0 ? void 0 : options.source) === 'cache') {
            snap = firestore.getDocFromCache(this._delegate);
        }
        else if ((options === null || options === void 0 ? void 0 : options.source) === 'server') {
            snap = firestore.getDocFromServer(this._delegate);
        }
        else {
            snap = firestore.getDoc(this._delegate);
        }
        return snap.then(result => new DocumentSnapshot(this.firestore, new firestore.DocumentSnapshot(this.firestore._delegate, this._userDataWriter, result._key, result._document, result.metadata, this._delegate.converter)));
    }
    withConverter(converter) {
        return new DocumentReference(this.firestore, converter
            ? this._delegate.withConverter(FirestoreDataConverter.getInstance(this.firestore, converter))
            : this._delegate.withConverter(null));
    }
}
/**
 * Replaces the function name in an error thrown by the firestore-exp API
 * with the function names used in the classic API.
 */
function replaceFunctionName(e, original, updated) {
    e.message = e.message.replace(original, updated);
    return e;
}
/**
 * Iterates the list of arguments from an `onSnapshot` call and returns the
 * first argument that may be an `SnapshotListenOptions` object. Returns an
 * empty object if none is found.
 */
function extractSnapshotOptions(args) {
    for (const arg of args) {
        if (typeof arg === 'object' && !isPartialObserver(arg)) {
            return arg;
        }
    }
    return {};
}
/**
 * Creates an observer that can be passed to the firestore-exp SDK. The
 * observer converts all observed values into the format expected by the classic
 * SDK.
 *
 * @param args - The list of arguments from an `onSnapshot` call.
 * @param wrapper - The function that converts the firestore-exp type into the
 * type used by this shim.
 */
function wrapObserver(args, wrapper) {
    var _a, _b;
    let userObserver;
    if (isPartialObserver(args[0])) {
        userObserver = args[0];
    }
    else if (isPartialObserver(args[1])) {
        userObserver = args[1];
    }
    else if (typeof args[0] === 'function') {
        userObserver = {
            next: args[0],
            error: args[1],
            complete: args[2]
        };
    }
    else {
        userObserver = {
            next: args[1],
            error: args[2],
            complete: args[3]
        };
    }
    return {
        next: val => {
            if (userObserver.next) {
                userObserver.next(wrapper(val));
            }
        },
        error: (_a = userObserver.error) === null || _a === void 0 ? void 0 : _a.bind(userObserver),
        complete: (_b = userObserver.complete) === null || _b === void 0 ? void 0 : _b.bind(userObserver)
    };
}
class DocumentSnapshot {
    constructor(_firestore, _delegate) {
        this._firestore = _firestore;
        this._delegate = _delegate;
    }
    get ref() {
        return new DocumentReference(this._firestore, this._delegate.ref);
    }
    get id() {
        return this._delegate.id;
    }
    get metadata() {
        return this._delegate.metadata;
    }
    get exists() {
        return this._delegate.exists();
    }
    data(options) {
        return this._delegate.data(options);
    }
    get(fieldPath, options
    // We are using `any` here to avoid an explicit cast by our users.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ) {
        return this._delegate.get(fieldPath, options);
    }
    isEqual(other) {
        return firestore.snapshotEqual(this._delegate, other._delegate);
    }
}
class QueryDocumentSnapshot extends DocumentSnapshot {
    data(options) {
        const data = this._delegate.data(options);
        if (this._delegate._converter) {
            // Undefined is a possible valid value from converter.
            return data;
        }
        else {
            firestore._debugAssert(data !== undefined, 'Document in a QueryDocumentSnapshot should exist');
            return data;
        }
    }
}
class Query {
    constructor(firestore, _delegate) {
        this.firestore = firestore;
        this._delegate = _delegate;
        this._userDataWriter = new UserDataWriter(firestore);
    }
    where(fieldPath, opStr, value) {
        try {
            // The "as string" cast is a little bit of a hack. `where` accepts the
            // FieldPath Compat type as input, but is not typed as such in order to
            // not expose this via our public typings file.
            return new Query(this.firestore, firestore.query(this._delegate, firestore.where(fieldPath, opStr, value)));
        }
        catch (e) {
            throw replaceFunctionName(e, /(orderBy|where)\(\)/, 'Query.$1()');
        }
    }
    orderBy(fieldPath, directionStr) {
        try {
            // The "as string" cast is a little bit of a hack. `orderBy` accepts the
            // FieldPath Compat type as input, but is not typed as such in order to
            // not expose this via our public typings file.
            return new Query(this.firestore, firestore.query(this._delegate, firestore.orderBy(fieldPath, directionStr)));
        }
        catch (e) {
            throw replaceFunctionName(e, /(orderBy|where)\(\)/, 'Query.$1()');
        }
    }
    limit(n) {
        try {
            return new Query(this.firestore, firestore.query(this._delegate, firestore.limit(n)));
        }
        catch (e) {
            throw replaceFunctionName(e, 'limit()', 'Query.limit()');
        }
    }
    limitToLast(n) {
        try {
            return new Query(this.firestore, firestore.query(this._delegate, firestore.limitToLast(n)));
        }
        catch (e) {
            throw replaceFunctionName(e, 'limitToLast()', 'Query.limitToLast()');
        }
    }
    startAt(...args) {
        try {
            return new Query(this.firestore, firestore.query(this._delegate, firestore.startAt(...args)));
        }
        catch (e) {
            throw replaceFunctionName(e, 'startAt()', 'Query.startAt()');
        }
    }
    startAfter(...args) {
        try {
            return new Query(this.firestore, firestore.query(this._delegate, firestore.startAfter(...args)));
        }
        catch (e) {
            throw replaceFunctionName(e, 'startAfter()', 'Query.startAfter()');
        }
    }
    endBefore(...args) {
        try {
            return new Query(this.firestore, firestore.query(this._delegate, firestore.endBefore(...args)));
        }
        catch (e) {
            throw replaceFunctionName(e, 'endBefore()', 'Query.endBefore()');
        }
    }
    endAt(...args) {
        try {
            return new Query(this.firestore, firestore.query(this._delegate, firestore.endAt(...args)));
        }
        catch (e) {
            throw replaceFunctionName(e, 'endAt()', 'Query.endAt()');
        }
    }
    isEqual(other) {
        return firestore.queryEqual(this._delegate, other._delegate);
    }
    get(options) {
        let query;
        if ((options === null || options === void 0 ? void 0 : options.source) === 'cache') {
            query = firestore.getDocsFromCache(this._delegate);
        }
        else if ((options === null || options === void 0 ? void 0 : options.source) === 'server') {
            query = firestore.getDocsFromServer(this._delegate);
        }
        else {
            query = firestore.getDocs(this._delegate);
        }
        return query.then(result => new QuerySnapshot(this.firestore, new firestore.QuerySnapshot(this.firestore._delegate, this._userDataWriter, this._delegate, result._snapshot)));
    }
    onSnapshot(...args) {
        const options = extractSnapshotOptions(args);
        const observer = wrapObserver(args, snap => new QuerySnapshot(this.firestore, new firestore.QuerySnapshot(this.firestore._delegate, this._userDataWriter, this._delegate, snap._snapshot)));
        return firestore.onSnapshot(this._delegate, options, observer);
    }
    withConverter(converter) {
        return new Query(this.firestore, converter
            ? this._delegate.withConverter(FirestoreDataConverter.getInstance(this.firestore, converter))
            : this._delegate.withConverter(null));
    }
}
class DocumentChange {
    constructor(_firestore, _delegate) {
        this._firestore = _firestore;
        this._delegate = _delegate;
    }
    get type() {
        return this._delegate.type;
    }
    get doc() {
        return new QueryDocumentSnapshot(this._firestore, this._delegate.doc);
    }
    get oldIndex() {
        return this._delegate.oldIndex;
    }
    get newIndex() {
        return this._delegate.newIndex;
    }
}
class QuerySnapshot {
    constructor(_firestore, _delegate) {
        this._firestore = _firestore;
        this._delegate = _delegate;
    }
    get query() {
        return new Query(this._firestore, this._delegate.query);
    }
    get metadata() {
        return this._delegate.metadata;
    }
    get size() {
        return this._delegate.size;
    }
    get empty() {
        return this._delegate.empty;
    }
    get docs() {
        return this._delegate.docs.map(doc => new QueryDocumentSnapshot(this._firestore, doc));
    }
    docChanges(options) {
        return this._delegate
            .docChanges(options)
            .map(docChange => new DocumentChange(this._firestore, docChange));
    }
    forEach(callback, thisArg) {
        this._delegate.forEach(snapshot => {
            callback.call(thisArg, new QueryDocumentSnapshot(this._firestore, snapshot));
        });
    }
    isEqual(other) {
        return firestore.snapshotEqual(this._delegate, other._delegate);
    }
}
class CollectionReference extends Query {
    constructor(firestore, _delegate) {
        super(firestore, _delegate);
        this.firestore = firestore;
        this._delegate = _delegate;
    }
    get id() {
        return this._delegate.id;
    }
    get path() {
        return this._delegate.path;
    }
    get parent() {
        const docRef = this._delegate.parent;
        return docRef ? new DocumentReference(this.firestore, docRef) : null;
    }
    doc(documentPath) {
        try {
            if (documentPath === undefined) {
                // Call `doc` without `documentPath` if `documentPath` is `undefined`
                // as `doc` validates the number of arguments to prevent users from
                // accidentally passing `undefined`.
                return new DocumentReference(this.firestore, firestore.doc(this._delegate));
            }
            else {
                return new DocumentReference(this.firestore, firestore.doc(this._delegate, documentPath));
            }
        }
        catch (e) {
            throw replaceFunctionName(e, 'doc()', 'CollectionReference.doc()');
        }
    }
    add(data) {
        return firestore.addDoc(this._delegate, data).then(docRef => new DocumentReference(this.firestore, docRef));
    }
    isEqual(other) {
        return firestore.refEqual(this._delegate, other._delegate);
    }
    withConverter(converter) {
        return new CollectionReference(this.firestore, converter
            ? this._delegate.withConverter(FirestoreDataConverter.getInstance(this.firestore, converter))
            : this._delegate.withConverter(null));
    }
}
function castReference(documentRef) {
    return firestore._cast(documentRef, firestore.DocumentReference);
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
// The objects that are a part of this API are exposed to third-parties as
// compiled javascript so we want to flag our private members with a leading
// underscore to discourage their use.
/**
 * A `FieldPath` refers to a field in a document. The path may consist of a
 * single field name (referring to a top-level field in the document), or a list
 * of field names (referring to a nested field in the document).
 */
class FieldPath {
    /**
     * Creates a FieldPath from the provided field names. If more than one field
     * name is provided, the path will point to a nested field in a document.
     *
     * @param fieldNames - A list of field names.
     */
    constructor(...fieldNames) {
        this._delegate = new firestore.FieldPath(...fieldNames);
    }
    static documentId() {
        /**
         * Internal Note: The backend doesn't technically support querying by
         * document ID. Instead it queries by the entire document name (full path
         * included), but in the cases we currently support documentId(), the net
         * effect is the same.
         */
        return new FieldPath(firestore._FieldPath.keyField().canonicalString());
    }
    isEqual(other) {
        other = util.getModularInstance(other);
        if (!(other instanceof firestore.FieldPath)) {
            return false;
        }
        return this._delegate._internalPath.isEqual(other._internalPath);
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
class FieldValue {
    static serverTimestamp() {
        const delegate = firestore.serverTimestamp();
        delegate._methodName = 'FieldValue.serverTimestamp';
        return new FieldValue(delegate);
    }
    static delete() {
        const delegate = firestore.deleteField();
        delegate._methodName = 'FieldValue.delete';
        return new FieldValue(delegate);
    }
    static arrayUnion(...elements) {
        const delegate = firestore.arrayUnion(...elements);
        delegate._methodName = 'FieldValue.arrayUnion';
        return new FieldValue(delegate);
    }
    static arrayRemove(...elements) {
        const delegate = firestore.arrayRemove(...elements);
        delegate._methodName = 'FieldValue.arrayRemove';
        return new FieldValue(delegate);
    }
    static increment(n) {
        const delegate = firestore.increment(n);
        delegate._methodName = 'FieldValue.increment';
        return new FieldValue(delegate);
    }
    constructor(_delegate) {
        this._delegate = _delegate;
    }
    isEqual(other) {
        return this._delegate.isEqual(other._delegate);
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
const firestoreNamespace = {
    Firestore,
    GeoPoint: firestore.GeoPoint,
    Timestamp: firestore.Timestamp,
    Blob,
    Transaction,
    WriteBatch,
    DocumentReference,
    DocumentSnapshot,
    Query,
    QueryDocumentSnapshot,
    QuerySnapshot,
    CollectionReference,
    FieldPath,
    FieldValue,
    setLogLevel,
    CACHE_SIZE_UNLIMITED: firestore.CACHE_SIZE_UNLIMITED
};
/**
 * Configures Firestore as part of the Firebase SDK by calling registerComponent.
 *
 * @param firebase - The FirebaseNamespace to register Firestore with
 * @param firestoreFactory - A factory function that returns a new Firestore
 *    instance.
 */
function configureForFirebase(firebase, firestoreFactory) {
    firebase.INTERNAL.registerComponent(new component.Component('firestore-compat', container => {
        const app = container.getProvider('app-compat').getImmediate();
        const firestoreExp = container.getProvider('firestore').getImmediate();
        return firestoreFactory(app, firestoreExp);
    }, 'PUBLIC').setServiceProps(Object.assign({}, firestoreNamespace)));
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
 * Registers the main Firestore Node build with the components framework.
 * Persistence can be enabled via `firebase.firestore().enablePersistence()`.
 */
function registerFirestore(instance) {
    configureForFirebase(instance, (app, firestoreExp) => new Firestore(app, firestoreExp, new IndexedDbPersistenceProvider()));
    instance.registerVersion(name, version, 'node');
}
registerFirestore(firebase__default["default"]);

exports.registerFirestore = registerFirestore;
//# sourceMappingURL=index.node.cjs.js.map
