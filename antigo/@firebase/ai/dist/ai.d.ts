/**
 * The Firebase AI Web SDK.
 *
 * @packageDocumentation
 */

import { AppCheckTokenResult } from '@firebase/app-check-interop-types';
import { FirebaseApp } from '@firebase/app';
import { FirebaseAuthTokenData } from '@firebase/auth-interop-types';
import { FirebaseError } from '@firebase/util';

/**
 * An instance of the Firebase AI SDK.
 *
 * Do not create this instance directly. Instead, use {@link getAI | getAI()}.
 *
 * @public
 */
export declare interface AI {
    /**
     * The {@link @firebase/app#FirebaseApp} this {@link AI} instance is associated with.
     */
    app: FirebaseApp;
    /**
     * A {@link Backend} instance that specifies the configuration for the target backend,
     * either the Gemini Developer API (using {@link GoogleAIBackend}) or the
     * Vertex AI Gemini API (using {@link VertexAIBackend}).
     */
    backend: Backend;
    /**
     * @deprecated use `AI.backend.location` instead.
     *
     * The location configured for this AI service instance, relevant for Vertex AI backends.
     */
    location: string;
}

/**
 * Error class for the Firebase AI SDK.
 *
 * @public
 */
export declare class AIError extends FirebaseError {
    readonly code: AIErrorCode;
    readonly customErrorData?: CustomErrorData | undefined;
    /**
     * Constructs a new instance of the `AIError` class.
     *
     * @param code - The error code from {@link AIErrorCode}.
     * @param message - A human-readable message describing the error.
     * @param customErrorData - Optional error data.
     */
    constructor(code: AIErrorCode, message: string, customErrorData?: CustomErrorData | undefined);
}

/**
 * Standardized error codes that {@link AIError} can have.
 *
 * @public
 */
declare const enum AIErrorCode {
    /** A generic error occurred. */
    ERROR = "error",
    /** An error occurred in a request. */
    REQUEST_ERROR = "request-error",
    /** An error occurred in a response. */
    RESPONSE_ERROR = "response-error",
    /** An error occurred while performing a fetch. */
    FETCH_ERROR = "fetch-error",
    /** An error associated with a Content object.  */
    INVALID_CONTENT = "invalid-content",
    /** An error due to the Firebase API not being enabled in the Console. */
    API_NOT_ENABLED = "api-not-enabled",
    /** An error due to invalid Schema input.  */
    INVALID_SCHEMA = "invalid-schema",
    /** An error occurred due to a missing Firebase API key. */
    NO_API_KEY = "no-api-key",
    /** An error occured due to a missing Firebase app ID. */
    NO_APP_ID = "no-app-id",
    /** An error occurred due to a model name not being specified during initialization. */
    NO_MODEL = "no-model",
    /** An error occurred due to a missing project ID. */
    NO_PROJECT_ID = "no-project-id",
    /** An error occurred while parsing. */
    PARSE_FAILED = "parse-failed",
    /** An error occured due an attempt to use an unsupported feature. */
    UNSUPPORTED = "unsupported"
}
export { AIErrorCode }
export { AIErrorCode as VertexAIErrorCode }

/**
 * Base class for Firebase AI model APIs.
 *
 * Instances of this class are associated with a specific Firebase AI {@link Backend}
 * and provide methods for interacting with the configured generative model.
 *
 * @public
 */
export declare abstract class AIModel {
    /**
     * The fully qualified model resource name to use for generating images
     * (for example, `publishers/google/models/imagen-3.0-generate-002`).
     */
    readonly model: string;
    /**
     * @internal
     */
    protected _apiSettings: ApiSettings;
    /**
     * Constructs a new instance of the {@link AIModel} class.
     *
     * This constructor should only be called from subclasses that provide
     * a model API.
     *
     * @param ai - an {@link AI} instance.
     * @param modelName - The name of the model being used. It can be in one of the following formats:
     * - `my-model` (short name, will resolve to `publishers/google/models/my-model`)
     * - `models/my-model` (will resolve to `publishers/google/models/my-model`)
     * - `publishers/my-publisher/models/my-model` (fully qualified model name)
     *
     * @throws If the `apiKey` or `projectId` fields are missing in your
     * Firebase config.
     *
     * @internal
     */
    protected constructor(ai: AI, modelName: string);
    /**
     * Normalizes the given model name to a fully qualified model resource name.
     *
     * @param modelName - The model name to normalize.
     * @returns The fully qualified model resource name.
     *
     * @internal
     */
    static normalizeModelName(modelName: string, backendType: BackendType): string;
    /**
     * @internal
     */
    private static normalizeGoogleAIModelName;
    /**
     * @internal
     */
    private static normalizeVertexAIModelName;
}

/**
 * Options for initializing the AI service using {@link getAI | getAI()}.
 * This allows specifying which backend to use (Vertex AI Gemini API or Gemini Developer API)
 * and configuring its specific options (like location for Vertex AI).
 *
 * @public
 */
export declare interface AIOptions {
    /**
     * The backend configuration to use for the AI service instance.
     */
    backend: Backend;
}

declare interface ApiSettings {
    apiKey: string;
    project: string;
    appId: string;
    automaticDataCollectionEnabled?: boolean;
    /**
     * @deprecated Use `backend.location` instead.
     */
    location: string;
    backend: Backend;
    getAuthToken?: () => Promise<FirebaseAuthTokenData | null>;
    getAppCheckToken?: () => Promise<AppCheckTokenResult>;
}

/**
 * Schema class for "array" types.
 * The `items` param should refer to the type of item that can be a member
 * of the array.
 * @public
 */
export declare class ArraySchema extends Schema {
    items: TypedSchema;
    constructor(schemaParams: SchemaParams, items: TypedSchema);
    /**
     * @internal
     */
    toJSON(): SchemaRequest;
}

/**
 * Abstract base class representing the configuration for an AI service backend.
 * This class should not be instantiated directly. Use its subclasses; {@link GoogleAIBackend} for
 * the Gemini Developer API (via {@link https://ai.google/ | Google AI}), and
 * {@link VertexAIBackend} for the Vertex AI Gemini API.
 *
 * @public
 */
export declare abstract class Backend {
    /**
     * Specifies the backend type.
     */
    readonly backendType: BackendType;
    /**
     * Protected constructor for use by subclasses.
     * @param type - The backend type.
     */
    protected constructor(type: BackendType);
}

/**
 * An enum-like object containing constants that represent the supported backends
 * for the Firebase AI SDK.
 * This determines which backend service (Vertex AI Gemini API or Gemini Developer API)
 * the SDK will communicate with.
 *
 * These values are assigned to the `backendType` property within the specific backend
 * configuration objects ({@link GoogleAIBackend} or {@link VertexAIBackend}) to identify
 * which service to target.
 *
 * @public
 */
export declare const BackendType: {
    /**
     * Identifies the backend service for the Vertex AI Gemini API provided through Google Cloud.
     * Use this constant when creating a {@link VertexAIBackend} configuration.
     */
    readonly VERTEX_AI: "VERTEX_AI";
    /**
     * Identifies the backend service for the Gemini Developer API ({@link https://ai.google/ | Google AI}).
     * Use this constant when creating a {@link GoogleAIBackend} configuration.
     */
    readonly GOOGLE_AI: "GOOGLE_AI";
};

/**
 * Type alias representing valid backend types.
 * It can be either `'VERTEX_AI'` or `'GOOGLE_AI'`.
 *
 * @public
 */
export declare type BackendType = (typeof BackendType)[keyof typeof BackendType];

/**
 * Base parameters for a number of methods.
 * @public
 */
export declare interface BaseParams {
    safetySettings?: SafetySetting[];
    generationConfig?: GenerationConfig;
}

/**
 * Reason that a prompt was blocked.
 * @public
 */
export declare enum BlockReason {
    /**
     * Content was blocked by safety settings.
     */
    SAFETY = "SAFETY",
    /**
     * Content was blocked, but the reason is uncategorized.
     */
    OTHER = "OTHER",
    /**
     * Content was blocked because it contained terms from the terminology blocklist.
     */
    BLOCKLIST = "BLOCKLIST",
    /**
     * Content was blocked due to prohibited content.
     */
    PROHIBITED_CONTENT = "PROHIBITED_CONTENT"
}

/**
 * Schema class for "boolean" types.
 * @public
 */
export declare class BooleanSchema extends Schema {
    constructor(schemaParams?: SchemaParams);
}

/**
 * ChatSession class that enables sending chat messages and stores
 * history of sent and received messages so far.
 *
 * @public
 */
export declare class ChatSession {
    model: string;
    params?: StartChatParams | undefined;
    requestOptions?: RequestOptions | undefined;
    private _apiSettings;
    private _history;
    private _sendPromise;
    constructor(apiSettings: ApiSettings, model: string, params?: StartChatParams | undefined, requestOptions?: RequestOptions | undefined);
    /**
     * Gets the chat history so far. Blocked prompts are not added to history.
     * Neither blocked candidates nor the prompts that generated them are added
     * to history.
     */
    getHistory(): Promise<Content[]>;
    /**
     * Sends a chat message and receives a non-streaming
     * {@link GenerateContentResult}
     */
    sendMessage(request: string | Array<string | Part>): Promise<GenerateContentResult>;
    /**
     * Sends a chat message and receives the response as a
     * {@link GenerateContentStreamResult} containing an iterable stream
     * and a response promise.
     */
    sendMessageStream(request: string | Array<string | Part>): Promise<GenerateContentStreamResult>;
}

/**
 * A single citation.
 * @public
 */
export declare interface Citation {
    startIndex?: number;
    endIndex?: number;
    uri?: string;
    license?: string;
    /**
     * The title of the cited source, if available.
     *
     * This property is only supported in the Vertex AI Gemini API ({@link VertexAIBackend}).
     */
    title?: string;
    /**
     * The publication date of the cited source, if available.
     *
     * This property is only supported in the Vertex AI Gemini API ({@link VertexAIBackend}).
     */
    publicationDate?: Date_2;
}

/**
 * Citation metadata that may be found on a {@link GenerateContentCandidate}.
 * @public
 */
export declare interface CitationMetadata {
    citations: Citation[];
}

/**
 * Content type for both prompts and response candidates.
 * @public
 */
export declare interface Content {
    role: Role;
    parts: Part[];
}

/**
 * Params for calling {@link GenerativeModel.countTokens}
 * @public
 */
export declare interface CountTokensRequest {
    contents: Content[];
    /**
     * Instructions that direct the model to behave a certain way.
     */
    systemInstruction?: string | Part | Content;
    /**
     * {@link Tool} configuration.
     */
    tools?: Tool[];
    /**
     * Configuration options that control how the model generates a response.
     */
    generationConfig?: GenerationConfig;
}

/**
 * Response from calling {@link GenerativeModel.countTokens}.
 * @public
 */
export declare interface CountTokensResponse {
    /**
     * The total number of tokens counted across all instances from the request.
     */
    totalTokens: number;
    /**
     * The total number of billable characters counted across all instances
     * from the request.
     *
     * This property is only supported when using the Vertex AI Gemini API ({@link VertexAIBackend}).
     * When using the Gemini Developer API ({@link GoogleAIBackend}), this property is not supported and will default to 0.
     */
    totalBillableCharacters?: number;
    /**
     * The breakdown, by modality, of how many tokens are consumed by the prompt.
     */
    promptTokensDetails?: ModalityTokenCount[];
}

/**
 * Details object that contains data originating from a bad HTTP response.
 *
 * @public
 */
export declare interface CustomErrorData {
    /** HTTP status code of the error response. */
    status?: number;
    /** HTTP status text of the error response. */
    statusText?: string;
    /** Response from a {@link GenerateContentRequest} */
    response?: GenerateContentResponse;
    /** Optional additional details about the error. */
    errorDetails?: ErrorDetails[];
}

/**
 * Protobuf google.type.Date
 * @public
 */
declare interface Date_2 {
    year: number;
    month: number;
    day: number;
}
export { Date_2 as Date }

/**
 * Response object wrapped with helper methods.
 *
 * @public
 */
export declare interface EnhancedGenerateContentResponse extends GenerateContentResponse {
    /**
     * Returns the text string from the response, if available.
     * Throws if the prompt or candidate was blocked.
     */
    text: () => string;
    /**
     * Aggregates and returns all {@link InlineDataPart}s from the {@link GenerateContentResponse}'s
     * first candidate.
     *
     * @returns An array of {@link InlineDataPart}s containing data from the response, if available.
     *
     * @throws If the prompt or candidate was blocked.
     */
    inlineDataParts: () => InlineDataPart[] | undefined;
    functionCalls: () => FunctionCall[] | undefined;
}

/**
 * Details object that may be included in an error response.
 *
 * @public
 */
export declare interface ErrorDetails {
    '@type'?: string;
    /** The reason for the error. */
    reason?: string;
    /** The domain where the error occurred. */
    domain?: string;
    /** Additional metadata about the error. */
    metadata?: Record<string, unknown>;
    /** Any other relevant information about the error. */
    [key: string]: unknown;
}

/**
 * Data pointing to a file uploaded on Google Cloud Storage.
 * @public
 */
export declare interface FileData {
    mimeType: string;
    fileUri: string;
}

/**
 * Content part interface if the part represents {@link FileData}
 * @public
 */
export declare interface FileDataPart {
    text?: never;
    inlineData?: never;
    functionCall?: never;
    functionResponse?: never;
    fileData: FileData;
}

/**
 * Reason that a candidate finished.
 * @public
 */
export declare enum FinishReason {
    /**
     * Natural stop point of the model or provided stop sequence.
     */
    STOP = "STOP",
    /**
     * The maximum number of tokens as specified in the request was reached.
     */
    MAX_TOKENS = "MAX_TOKENS",
    /**
     * The candidate content was flagged for safety reasons.
     */
    SAFETY = "SAFETY",
    /**
     * The candidate content was flagged for recitation reasons.
     */
    RECITATION = "RECITATION",
    /**
     * Unknown reason.
     */
    OTHER = "OTHER",
    /**
     * The candidate content contained forbidden terms.
     */
    BLOCKLIST = "BLOCKLIST",
    /**
     * The candidate content potentially contained prohibited content.
     */
    PROHIBITED_CONTENT = "PROHIBITED_CONTENT",
    /**
     * The candidate content potentially contained Sensitive Personally Identifiable Information (SPII).
     */
    SPII = "SPII",
    /**
     * The function call generated by the model was invalid.
     */
    MALFORMED_FUNCTION_CALL = "MALFORMED_FUNCTION_CALL"
}

/**
 * A predicted {@link FunctionCall} returned from the model
 * that contains a string representing the {@link FunctionDeclaration.name}
 * and a structured JSON object containing the parameters and their values.
 * @public
 */
export declare interface FunctionCall {
    name: string;
    args: object;
}

/**
 * @public
 */
export declare interface FunctionCallingConfig {
    mode?: FunctionCallingMode;
    allowedFunctionNames?: string[];
}

/**
 * @public
 */
export declare enum FunctionCallingMode {
    /**
     * Default model behavior; model decides to predict either a function call
     * or a natural language response.
     */
    AUTO = "AUTO",
    /**
     * Model is constrained to always predicting a function call only.
     * If `allowed_function_names` is set, the predicted function call will be
     * limited to any one of `allowed_function_names`, else the predicted
     * function call will be any one of the provided `function_declarations`.
     */
    ANY = "ANY",
    /**
     * Model will not predict any function call. Model behavior is same as when
     * not passing any function declarations.
     */
    NONE = "NONE"
}

/**
 * Content part interface if the part represents a {@link FunctionCall}.
 * @public
 */
export declare interface FunctionCallPart {
    text?: never;
    inlineData?: never;
    functionCall: FunctionCall;
    functionResponse?: never;
}

/**
 * Structured representation of a function declaration as defined by the
 * {@link https://spec.openapis.org/oas/v3.0.3 | OpenAPI 3.0 specification}.
 * Included
 * in this declaration are the function name and parameters. This
 * `FunctionDeclaration` is a representation of a block of code that can be used
 * as a Tool by the model and executed by the client.
 * @public
 */
export declare interface FunctionDeclaration {
    /**
     * The name of the function to call. Must start with a letter or an
     * underscore. Must be a-z, A-Z, 0-9, or contain underscores and dashes, with
     * a max length of 64.
     */
    name: string;
    /**
     * Description and purpose of the function. Model uses it to decide
     * how and whether to call the function.
     */
    description: string;
    /**
     * Optional. Describes the parameters to this function in JSON Schema Object
     * format. Reflects the Open API 3.03 Parameter Object. Parameter names are
     * case-sensitive. For a function with no parameters, this can be left unset.
     */
    parameters?: ObjectSchemaInterface;
}

/**
 * A `FunctionDeclarationsTool` is a piece of code that enables the system to
 * interact with external systems to perform an action, or set of actions,
 * outside of knowledge and scope of the model.
 * @public
 */
export declare interface FunctionDeclarationsTool {
    /**
     * Optional. One or more function declarations
     * to be passed to the model along with the current user query. Model may
     * decide to call a subset of these functions by populating
     * {@link FunctionCall} in the response. User should
     * provide a {@link FunctionResponse} for each
     * function call in the next turn. Based on the function responses, the model will
     * generate the final response back to the user. Maximum 64 function
     * declarations can be provided.
     */
    functionDeclarations?: FunctionDeclaration[];
}

/**
 * The result output from a {@link FunctionCall} that contains a string
 * representing the {@link FunctionDeclaration.name}
 * and a structured JSON object containing any output
 * from the function is used as context to the model.
 * This should contain the result of a {@link FunctionCall}
 * made based on model prediction.
 * @public
 */
export declare interface FunctionResponse {
    name: string;
    response: object;
}

/**
 * Content part interface if the part represents {@link FunctionResponse}.
 * @public
 */
export declare interface FunctionResponsePart {
    text?: never;
    inlineData?: never;
    functionCall?: never;
    functionResponse: FunctionResponse;
}

/**
 * A candidate returned as part of a {@link GenerateContentResponse}.
 * @public
 */
export declare interface GenerateContentCandidate {
    index: number;
    content: Content;
    finishReason?: FinishReason;
    finishMessage?: string;
    safetyRatings?: SafetyRating[];
    citationMetadata?: CitationMetadata;
    groundingMetadata?: GroundingMetadata;
}

/**
 * Request sent through {@link GenerativeModel.generateContent}
 * @public
 */
export declare interface GenerateContentRequest extends BaseParams {
    contents: Content[];
    tools?: Tool[];
    toolConfig?: ToolConfig;
    systemInstruction?: string | Part | Content;
}

/**
 * Individual response from {@link GenerativeModel.generateContent} and
 * {@link GenerativeModel.generateContentStream}.
 * `generateContentStream()` will return one in each chunk until
 * the stream is done.
 * @public
 */
export declare interface GenerateContentResponse {
    candidates?: GenerateContentCandidate[];
    promptFeedback?: PromptFeedback;
    usageMetadata?: UsageMetadata;
}

/**
 * Result object returned from {@link GenerativeModel.generateContent} call.
 *
 * @public
 */
export declare interface GenerateContentResult {
    response: EnhancedGenerateContentResponse;
}

/**
 * Result object returned from {@link GenerativeModel.generateContentStream} call.
 * Iterate over `stream` to get chunks as they come in and/or
 * use the `response` promise to get the aggregated response when
 * the stream is done.
 *
 * @public
 */
export declare interface GenerateContentStreamResult {
    stream: AsyncGenerator<EnhancedGenerateContentResponse>;
    response: Promise<EnhancedGenerateContentResponse>;
}

/**
 * Config options for content-related requests
 * @public
 */
export declare interface GenerationConfig {
    candidateCount?: number;
    stopSequences?: string[];
    maxOutputTokens?: number;
    temperature?: number;
    topP?: number;
    topK?: number;
    presencePenalty?: number;
    frequencyPenalty?: number;
    /**
     * Output response MIME type of the generated candidate text.
     * Supported MIME types are `text/plain` (default, text output),
     * `application/json` (JSON response in the candidates), and
     * `text/x.enum`.
     */
    responseMimeType?: string;
    /**
     * Output response schema of the generated candidate text. This
     * value can be a class generated with a {@link Schema} static method
     * like `Schema.string()` or `Schema.object()` or it can be a plain
     * JS object matching the {@link SchemaRequest} interface.
     * <br/>Note: This only applies when the specified `responseMIMEType` supports a schema; currently
     * this is limited to `application/json` and `text/x.enum`.
     */
    responseSchema?: TypedSchema | SchemaRequest;
    /**
     * Generation modalities to be returned in generation responses.
     *
     * @remarks
     *  - Multimodal response generation is only supported by some Gemini models and versions; see {@link https://firebase.google.com/docs/vertex-ai/models | model versions}.
     *  - Only image generation (`ResponseModality.IMAGE`) is supported.
     *
     * @beta
     */
    responseModalities?: ResponseModality[];
}

/**
 * Interface for sending an image.
 * @public
 */
export declare interface GenerativeContentBlob {
    mimeType: string;
    /**
     * Image as a base64 string.
     */
    data: string;
}

/**
 * Class for generative model APIs.
 * @public
 */
export declare class GenerativeModel extends AIModel {
    generationConfig: GenerationConfig;
    safetySettings: SafetySetting[];
    requestOptions?: RequestOptions;
    tools?: Tool[];
    toolConfig?: ToolConfig;
    systemInstruction?: Content;
    constructor(ai: AI, modelParams: ModelParams, requestOptions?: RequestOptions);
    /**
     * Makes a single non-streaming call to the model
     * and returns an object containing a single {@link GenerateContentResponse}.
     */
    generateContent(request: GenerateContentRequest | string | Array<string | Part>): Promise<GenerateContentResult>;
    /**
     * Makes a single streaming call to the model
     * and returns an object containing an iterable stream that iterates
     * over all chunks in the streaming response as well as
     * a promise that returns the final aggregated response.
     */
    generateContentStream(request: GenerateContentRequest | string | Array<string | Part>): Promise<GenerateContentStreamResult>;
    /**
     * Gets a new {@link ChatSession} instance which can be used for
     * multi-turn chats.
     */
    startChat(startChatParams?: StartChatParams): ChatSession;
    /**
     * Counts the tokens in the provided request.
     */
    countTokens(request: CountTokensRequest | string | Array<string | Part>): Promise<CountTokensResponse>;
}

/**
 * Returns the default {@link AI} instance that is associated with the provided
 * {@link @firebase/app#FirebaseApp}. If no instance exists, initializes a new instance with the
 * default settings.
 *
 * @example
 * ```javascript
 * const ai = getAI(app);
 * ```
 *
 * @example
 * ```javascript
 * // Get an AI instance configured to use the Gemini Developer API (via Google AI).
 * const ai = getAI(app, { backend: new GoogleAIBackend() });
 * ```
 *
 * @example
 * ```javascript
 * // Get an AI instance configured to use the Vertex AI Gemini API.
 * const ai = getAI(app, { backend: new VertexAIBackend() });
 * ```
 *
 * @param app - The {@link @firebase/app#FirebaseApp} to use.
 * @param options - {@link AIOptions} that configure the AI instance.
 * @returns The default {@link AI} instance for the given {@link @firebase/app#FirebaseApp}.
 *
 * @public
 */
export declare function getAI(app?: FirebaseApp, options?: AIOptions): AI;

/**
 * Returns a {@link GenerativeModel} class with methods for inference
 * and other functionality.
 *
 * @public
 */
export declare function getGenerativeModel(ai: AI, modelParams: ModelParams, requestOptions?: RequestOptions): GenerativeModel;

/**
 * Returns an {@link ImagenModel} class with methods for using Imagen.
 *
 * Only Imagen 3 models (named `imagen-3.0-*`) are supported.
 *
 * @param ai - An {@link AI} instance.
 * @param modelParams - Parameters to use when making Imagen requests.
 * @param requestOptions - Additional options to use when making requests.
 *
 * @throws If the `apiKey` or `projectId` fields are missing in your
 * Firebase config.
 *
 * @beta
 */
export declare function getImagenModel(ai: AI, modelParams: ImagenModelParams, requestOptions?: RequestOptions): ImagenModel;

/**
 * @deprecated Use the new {@link getAI | getAI()} instead. The Vertex AI in Firebase SDK has been
 * replaced with the Firebase AI SDK to accommodate the evolving set of supported features and
 * services. For migration details, see the {@link https://firebase.google.com/docs/vertex-ai/migrate-to-latest-sdk | migration guide}.
 *
 * Returns a {@link VertexAI} instance for the given app, configured to use the
 * Vertex AI Gemini API. This instance will be
 * configured to use the Vertex AI Gemini API.
 *
 * @param app - The {@link @firebase/app#FirebaseApp} to use.
 * @param options - Options to configure the Vertex AI instance, including the location.
 *
 * @public
 */
export declare function getVertexAI(app?: FirebaseApp, options?: VertexAIOptions): VertexAI;

/**
 * Configuration class for the Gemini Developer API.
 *
 * Use this with {@link AIOptions} when initializing the AI service via
 * {@link getAI | getAI()} to specify the Gemini Developer API as the backend.
 *
 * @public
 */
export declare class GoogleAIBackend extends Backend {
    /**
     * Creates a configuration object for the Gemini Developer API backend.
     */
    constructor();
}

/**
 * @internal
 */
export declare interface GoogleAICitationMetadata {
    citationSources: Citation[];
}

/**
 * @internal
 */
export declare interface GoogleAICountTokensRequest {
    generateContentRequest: {
        model: string;
        contents: Content[];
        systemInstruction?: string | Part | Content;
        tools?: Tool[];
        generationConfig?: GenerationConfig;
    };
}

/**
 * @internal
 */
export declare interface GoogleAIGenerateContentCandidate {
    index: number;
    content: Content;
    finishReason?: FinishReason;
    finishMessage?: string;
    safetyRatings?: SafetyRating[];
    citationMetadata?: GoogleAICitationMetadata;
    groundingMetadata?: GroundingMetadata;
}

/**
 * @internal
 */
export declare interface GoogleAIGenerateContentResponse {
    candidates?: GoogleAIGenerateContentCandidate[];
    promptFeedback?: PromptFeedback;
    usageMetadata?: UsageMetadata;
}

/**
 * @deprecated
 * @public
 */
export declare interface GroundingAttribution {
    segment: Segment;
    confidenceScore?: number;
    web?: WebAttribution;
    retrievedContext?: RetrievedContextAttribution;
}

/**
 * Metadata returned to client when grounding is enabled.
 * @public
 */
export declare interface GroundingMetadata {
    webSearchQueries?: string[];
    retrievalQueries?: string[];
    /**
     * @deprecated
     */
    groundingAttributions: GroundingAttribution[];
}

/**
 * This property is not supported in the Gemini Developer API ({@link GoogleAIBackend}).
 *
 * @public
 */
export declare enum HarmBlockMethod {
    /**
     * The harm block method uses both probability and severity scores.
     */
    SEVERITY = "SEVERITY",
    /**
     * The harm block method uses the probability score.
     */
    PROBABILITY = "PROBABILITY"
}

/**
 * Threshold above which a prompt or candidate will be blocked.
 * @public
 */
export declare enum HarmBlockThreshold {
    /**
     * Content with `NEGLIGIBLE` will be allowed.
     */
    BLOCK_LOW_AND_ABOVE = "BLOCK_LOW_AND_ABOVE",
    /**
     * Content with `NEGLIGIBLE` and `LOW` will be allowed.
     */
    BLOCK_MEDIUM_AND_ABOVE = "BLOCK_MEDIUM_AND_ABOVE",
    /**
     * Content with `NEGLIGIBLE`, `LOW`, and `MEDIUM` will be allowed.
     */
    BLOCK_ONLY_HIGH = "BLOCK_ONLY_HIGH",
    /**
     * All content will be allowed.
     */
    BLOCK_NONE = "BLOCK_NONE"
}

/**
 * Harm categories that would cause prompts or candidates to be blocked.
 * @public
 */
export declare enum HarmCategory {
    HARM_CATEGORY_HATE_SPEECH = "HARM_CATEGORY_HATE_SPEECH",
    HARM_CATEGORY_SEXUALLY_EXPLICIT = "HARM_CATEGORY_SEXUALLY_EXPLICIT",
    HARM_CATEGORY_HARASSMENT = "HARM_CATEGORY_HARASSMENT",
    HARM_CATEGORY_DANGEROUS_CONTENT = "HARM_CATEGORY_DANGEROUS_CONTENT"
}

/**
 * Probability that a prompt or candidate matches a harm category.
 * @public
 */
export declare enum HarmProbability {
    /**
     * Content has a negligible chance of being unsafe.
     */
    NEGLIGIBLE = "NEGLIGIBLE",
    /**
     * Content has a low chance of being unsafe.
     */
    LOW = "LOW",
    /**
     * Content has a medium chance of being unsafe.
     */
    MEDIUM = "MEDIUM",
    /**
     * Content has a high chance of being unsafe.
     */
    HIGH = "HIGH"
}

/**
 * Harm severity levels.
 * @public
 */
export declare enum HarmSeverity {
    /**
     * Negligible level of harm severity.
     */
    HARM_SEVERITY_NEGLIGIBLE = "HARM_SEVERITY_NEGLIGIBLE",
    /**
     * Low level of harm severity.
     */
    HARM_SEVERITY_LOW = "HARM_SEVERITY_LOW",
    /**
     * Medium level of harm severity.
     */
    HARM_SEVERITY_MEDIUM = "HARM_SEVERITY_MEDIUM",
    /**
     * High level of harm severity.
     */
    HARM_SEVERITY_HIGH = "HARM_SEVERITY_HIGH",
    /**
     * Harm severity is not supported.
     *
     * @remarks
     * The GoogleAI backend does not support `HarmSeverity`, so this value is used as a fallback.
     */
    HARM_SEVERITY_UNSUPPORTED = "HARM_SEVERITY_UNSUPPORTED"
}

/**
 * Aspect ratios for Imagen images.
 *
 * To specify an aspect ratio for generated images, set the `aspectRatio` property in your
 * {@link ImagenGenerationConfig}.
 *
 * See the the {@link http://firebase.google.com/docs/vertex-ai/generate-images | documentation }
 * for more details and examples of the supported aspect ratios.
 *
 * @beta
 */
export declare enum ImagenAspectRatio {
    /**
     * Square (1:1) aspect ratio.
     */
    SQUARE = "1:1",
    /**
     * Landscape (3:4) aspect ratio.
     */
    LANDSCAPE_3x4 = "3:4",
    /**
     * Portrait (4:3) aspect ratio.
     */
    PORTRAIT_4x3 = "4:3",
    /**
     * Landscape (16:9) aspect ratio.
     */
    LANDSCAPE_16x9 = "16:9",
    /**
     * Portrait (9:16) aspect ratio.
     */
    PORTRAIT_9x16 = "9:16"
}

/**
 * An image generated by Imagen, stored in a Cloud Storage for Firebase bucket.
 *
 * This feature is not available yet.
 */
export declare interface ImagenGCSImage {
    /**
     * The MIME type of the image; either `"image/png"` or `"image/jpeg"`.
     *
     * To request a different format, set the `imageFormat` property in your {@link ImagenGenerationConfig}.
     */
    mimeType: string;
    /**
     * The URI of the file stored in a Cloud Storage for Firebase bucket.
     *
     * @example `"gs://bucket-name/path/sample_0.jpg"`.
     */
    gcsURI: string;
}

/**
 * Configuration options for generating images with Imagen.
 *
 * See the {@link http://firebase.google.com/docs/vertex-ai/generate-images-imagen | documentation} for
 * more details.
 *
 * @beta
 */
export declare interface ImagenGenerationConfig {
    /**
     * A description of what should be omitted from the generated images.
     *
     * Support for negative prompts depends on the Imagen model.
     *
     * See the {@link http://firebase.google.com/docs/vertex-ai/model-parameters#imagen | documentation} for more details.
     *
     * This is no longer supported in the Gemini Developer API ({@link GoogleAIBackend}) in versions
     * greater than `imagen-3.0-generate-002`.
     */
    negativePrompt?: string;
    /**
     * The number of images to generate. The default value is 1.
     *
     * The number of sample images that may be generated in each request depends on the model
     * (typically up to 4); see the <a href="http://firebase.google.com/docs/vertex-ai/model-parameters#imagen">sampleCount</a>
     * documentation for more details.
     */
    numberOfImages?: number;
    /**
     * The aspect ratio of the generated images. The default value is square 1:1.
     * Supported aspect ratios depend on the Imagen model, see {@link ImagenAspectRatio}
     * for more details.
     */
    aspectRatio?: ImagenAspectRatio;
    /**
     * The image format of the generated images. The default is PNG.
     *
     * See {@link ImagenImageFormat} for more details.
     */
    imageFormat?: ImagenImageFormat;
    /**
     * Whether to add an invisible watermark to generated images.
     *
     * If set to `true`, an invisible SynthID watermark is embedded in generated images to indicate
     * that they are AI generated. If set to `false`, watermarking will be disabled.
     *
     * For Imagen 3 models, the default value is `true`; see the <a href="http://firebase.google.com/docs/vertex-ai/model-parameters#imagen">addWatermark</a>
     * documentation for more details.
     *
     * When using the Gemini Developer API ({@link GoogleAIBackend}), this will default to true,
     * and cannot be turned off.
     */
    addWatermark?: boolean;
}

/**
 * The response from a request to generate images with Imagen.
 *
 * @beta
 */
export declare interface ImagenGenerationResponse<T extends ImagenInlineImage | ImagenGCSImage> {
    /**
     * The images generated by Imagen.
     *
     * The number of images generated may be fewer than the number requested if one or more were
     * filtered out; see `filteredReason`.
     */
    images: T[];
    /**
     * The reason that images were filtered out. This property will only be defined if one
     * or more images were filtered.
     *
     * Images may be filtered out due to the {@link ImagenSafetyFilterLevel},
     * {@link ImagenPersonFilterLevel}, or filtering included in the model.
     * The filter levels may be adjusted in your {@link ImagenSafetySettings}.
     *
     * See the {@link https://cloud.google.com/vertex-ai/generative-ai/docs/image/responsible-ai-imagen | Responsible AI and usage guidelines for Imagen}
     * for more details.
     */
    filteredReason?: string;
}

/**
 * @license
 * Copyright 2025 Google LLC
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
 * Defines the image format for images generated by Imagen.
 *
 * Use this class to specify the desired format (JPEG or PNG) and compression quality
 * for images generated by Imagen. This is typically included as part of
 * {@link ImagenModelParams}.
 *
 * @example
 * ```javascript
 * const imagenModelParams = {
 *   // ... other ImagenModelParams
 *   imageFormat: ImagenImageFormat.jpeg(75) // JPEG with a compression level of 75.
 * }
 * ```
 *
 * @beta
 */
export declare class ImagenImageFormat {
    /**
     * The MIME type.
     */
    mimeType: string;
    /**
     * The level of compression (a number between 0 and 100).
     */
    compressionQuality?: number;
    private constructor();
    /**
     * Creates an {@link ImagenImageFormat} for a JPEG image.
     *
     * @param compressionQuality - The level of compression (a number between 0 and 100).
     * @returns An {@link ImagenImageFormat} object for a JPEG image.
     *
     * @beta
     */
    static jpeg(compressionQuality?: number): ImagenImageFormat;
    /**
     * Creates an {@link ImagenImageFormat} for a PNG image.
     *
     * @returns An {@link ImagenImageFormat} object for a PNG image.
     *
     * @beta
     */
    static png(): ImagenImageFormat;
}

/**
 * @license
 * Copyright 2025 Google LLC
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
 * An image generated by Imagen, represented as inline data.
 *
 * @beta
 */
export declare interface ImagenInlineImage {
    /**
     * The MIME type of the image; either `"image/png"` or `"image/jpeg"`.
     *
     * To request a different format, set the `imageFormat` property in your {@link ImagenGenerationConfig}.
     */
    mimeType: string;
    /**
     * The base64-encoded image data.
     */
    bytesBase64Encoded: string;
}

/**
 * Class for Imagen model APIs.
 *
 * This class provides methods for generating images using the Imagen model.
 *
 * @example
 * ```javascript
 * const imagen = new ImagenModel(
 *   ai,
 *   {
 *     model: 'imagen-3.0-generate-002'
 *   }
 * );
 *
 * const response = await imagen.generateImages('A photo of a cat');
 * if (response.images.length > 0) {
 *   console.log(response.images[0].bytesBase64Encoded);
 * }
 * ```
 *
 * @beta
 */
export declare class ImagenModel extends AIModel {
    requestOptions?: RequestOptions | undefined;
    /**
     * The Imagen generation configuration.
     */
    generationConfig?: ImagenGenerationConfig;
    /**
     * Safety settings for filtering inappropriate content.
     */
    safetySettings?: ImagenSafetySettings;
    /**
     * Constructs a new instance of the {@link ImagenModel} class.
     *
     * @param ai - an {@link AI} instance.
     * @param modelParams - Parameters to use when making requests to Imagen.
     * @param requestOptions - Additional options to use when making requests.
     *
     * @throws If the `apiKey` or `projectId` fields are missing in your
     * Firebase config.
     */
    constructor(ai: AI, modelParams: ImagenModelParams, requestOptions?: RequestOptions | undefined);
    /**
     * Generates images using the Imagen model and returns them as
     * base64-encoded strings.
     *
     * @param prompt - A text prompt describing the image(s) to generate.
     * @returns A promise that resolves to an {@link ImagenGenerationResponse}
     * object containing the generated images.
     *
     * @throws If the request to generate images fails. This happens if the
     * prompt is blocked.
     *
     * @remarks
     * If the prompt was not blocked, but one or more of the generated images were filtered, the
     * returned object will have a `filteredReason` property.
     * If all images are filtered, the `images` array will be empty.
     *
     * @beta
     */
    generateImages(prompt: string): Promise<ImagenGenerationResponse<ImagenInlineImage>>;
    /**
     * Generates images to Cloud Storage for Firebase using the Imagen model.
     *
     * @internal This method is temporarily internal.
     *
     * @param prompt - A text prompt describing the image(s) to generate.
     * @param gcsURI - The URI of file stored in a Cloud Storage for Firebase bucket.
     * This should be a directory. For example, `gs://my-bucket/my-directory/`.
     * @returns A promise that resolves to an {@link ImagenGenerationResponse}
     * object containing the URLs of the generated images.
     *
     * @throws If the request fails to generate images fails. This happens if
     * the prompt is blocked.
     *
     * @remarks
     * If the prompt was not blocked, but one or more of the generated images were filtered, the
     * returned object will have a `filteredReason` property.
     * If all images are filtered, the `images` array will be empty.
     */
    generateImagesGCS(prompt: string, gcsURI: string): Promise<ImagenGenerationResponse<ImagenGCSImage>>;
}

/**
 * Parameters for configuring an {@link ImagenModel}.
 *
 * @beta
 */
export declare interface ImagenModelParams {
    /**
     * The Imagen model to use for generating images.
     * For example: `imagen-3.0-generate-002`.
     *
     * Only Imagen 3 models (named `imagen-3.0-*`) are supported.
     *
     * See {@link https://firebase.google.com/docs/vertex-ai/models | model versions}
     * for a full list of supported Imagen 3 models.
     */
    model: string;
    /**
     * Configuration options for generating images with Imagen.
     */
    generationConfig?: ImagenGenerationConfig;
    /**
     * Safety settings for filtering potentially inappropriate content.
     */
    safetySettings?: ImagenSafetySettings;
}

/**
 * A filter level controlling whether generation of images containing people or faces is allowed.
 *
 * See the <a href="http://firebase.google.com/docs/vertex-ai/generate-images">personGeneration</a>
 * documentation for more details.
 *
 * @beta
 */
export declare enum ImagenPersonFilterLevel {
    /**
     * Disallow generation of images containing people or faces; images of people are filtered out.
     */
    BLOCK_ALL = "dont_allow",
    /**
     * Allow generation of images containing adults only; images of children are filtered out.
     *
     * Generation of images containing people or faces may require your use case to be
     * reviewed and approved by Cloud support; see the {@link https://cloud.google.com/vertex-ai/generative-ai/docs/image/responsible-ai-imagen#person-face-gen | Responsible AI and usage guidelines}
     * for more details.
     */
    ALLOW_ADULT = "allow_adult",
    /**
     * Allow generation of images containing adults only; images of children are filtered out.
     *
     * Generation of images containing people or faces may require your use case to be
     * reviewed and approved by Cloud support; see the {@link https://cloud.google.com/vertex-ai/generative-ai/docs/image/responsible-ai-imagen#person-face-gen | Responsible AI and usage guidelines}
     * for more details.
     */
    ALLOW_ALL = "allow_all"
}

/**
 * A filter level controlling how aggressively to filter sensitive content.
 *
 * Text prompts provided as inputs and images (generated or uploaded) through Imagen on Vertex AI
 * are assessed against a list of safety filters, which include 'harmful categories' (for example,
 * `violence`, `sexual`, `derogatory`, and `toxic`). This filter level controls how aggressively to
 * filter out potentially harmful content from responses. See the {@link http://firebase.google.com/docs/vertex-ai/generate-images | documentation }
 * and the {@link https://cloud.google.com/vertex-ai/generative-ai/docs/image/responsible-ai-imagen#safety-filters | Responsible AI and usage guidelines}
 * for more details.
 *
 * @beta
 */
export declare enum ImagenSafetyFilterLevel {
    /**
     * The most aggressive filtering level; most strict blocking.
     */
    BLOCK_LOW_AND_ABOVE = "block_low_and_above",
    /**
     * Blocks some sensitive prompts and responses.
     */
    BLOCK_MEDIUM_AND_ABOVE = "block_medium_and_above",
    /**
     * Blocks few sensitive prompts and responses.
     */
    BLOCK_ONLY_HIGH = "block_only_high",
    /**
     * The least aggressive filtering level; blocks very few sensitive prompts and responses.
     *
     * Access to this feature is restricted and may require your case to be reviewed and approved by
     * Cloud support.
     */
    BLOCK_NONE = "block_none"
}

/**
 * Settings for controlling the aggressiveness of filtering out sensitive content.
 *
 * See the {@link http://firebase.google.com/docs/vertex-ai/generate-images | documentation }
 * for more details.
 *
 * @beta
 */
export declare interface ImagenSafetySettings {
    /**
     * A filter level controlling how aggressive to filter out sensitive content from generated
     * images.
     */
    safetyFilterLevel?: ImagenSafetyFilterLevel;
    /**
     * A filter level controlling whether generation of images containing people or faces is allowed.
     */
    personFilterLevel?: ImagenPersonFilterLevel;
}

/**
 * Content part interface if the part represents an image.
 * @public
 */
export declare interface InlineDataPart {
    text?: never;
    inlineData: GenerativeContentBlob;
    functionCall?: never;
    functionResponse?: never;
    /**
     * Applicable if `inlineData` is a video.
     */
    videoMetadata?: VideoMetadata;
}

/**
 * Schema class for "integer" types.
 * @public
 */
export declare class IntegerSchema extends Schema {
    constructor(schemaParams?: SchemaParams);
}

/**
 * Content part modality.
 * @public
 */
export declare enum Modality {
    /**
     * Unspecified modality.
     */
    MODALITY_UNSPECIFIED = "MODALITY_UNSPECIFIED",
    /**
     * Plain text.
     */
    TEXT = "TEXT",
    /**
     * Image.
     */
    IMAGE = "IMAGE",
    /**
     * Video.
     */
    VIDEO = "VIDEO",
    /**
     * Audio.
     */
    AUDIO = "AUDIO",
    /**
     * Document (for example, PDF).
     */
    DOCUMENT = "DOCUMENT"
}

/**
 * Represents token counting info for a single modality.
 *
 * @public
 */
export declare interface ModalityTokenCount {
    /** The modality associated with this token count. */
    modality: Modality;
    /** The number of tokens counted. */
    tokenCount: number;
}

/**
 * Params passed to {@link getGenerativeModel}.
 * @public
 */
export declare interface ModelParams extends BaseParams {
    model: string;
    tools?: Tool[];
    toolConfig?: ToolConfig;
    systemInstruction?: string | Part | Content;
}

/**
 * Schema class for "number" types.
 * @public
 */
export declare class NumberSchema extends Schema {
    constructor(schemaParams?: SchemaParams);
}

/**
 * Schema class for "object" types.
 * The `properties` param must be a map of `Schema` objects.
 * @public
 */
export declare class ObjectSchema extends Schema {
    properties: {
        [k: string]: TypedSchema;
    };
    optionalProperties: string[];
    constructor(schemaParams: SchemaParams, properties: {
        [k: string]: TypedSchema;
    }, optionalProperties?: string[]);
    /**
     * @internal
     */
    toJSON(): SchemaRequest;
}

/**
 * Interface for {@link ObjectSchema} class.
 * @public
 */
export declare interface ObjectSchemaInterface extends SchemaInterface {
    type: SchemaType.OBJECT;
    optionalProperties?: string[];
}

/**
 * Content part - includes text, image/video, or function call/response
 * part types.
 * @public
 */
export declare type Part = TextPart | InlineDataPart | FunctionCallPart | FunctionResponsePart | FileDataPart;

/**
 * Possible roles.
 * @public
 */
export declare const POSSIBLE_ROLES: readonly ["user", "model", "function", "system"];

/**
 * If the prompt was blocked, this will be populated with `blockReason` and
 * the relevant `safetyRatings`.
 * @public
 */
export declare interface PromptFeedback {
    blockReason?: BlockReason;
    safetyRatings: SafetyRating[];
    /**
     * A human-readable description of the `blockReason`.
     *
     * This property is only supported in the Vertex AI Gemini API ({@link VertexAIBackend}).
     */
    blockReasonMessage?: string;
}

/**
 * Params passed to {@link getGenerativeModel}.
 * @public
 */
export declare interface RequestOptions {
    /**
     * Request timeout in milliseconds. Defaults to 180 seconds (180000ms).
     */
    timeout?: number;
    /**
     * Base url for endpoint. Defaults to https://firebasevertexai.googleapis.com
     */
    baseUrl?: string;
}

/**
 * Generation modalities to be returned in generation responses.
 *
 * @beta
 */
export declare const ResponseModality: {
    /**
     * Text.
     * @beta
     */
    readonly TEXT: "TEXT";
    /**
     * Image.
     * @beta
     */
    readonly IMAGE: "IMAGE";
};

/**
 * Generation modalities to be returned in generation responses.
 *
 * @beta
 */
export declare type ResponseModality = (typeof ResponseModality)[keyof typeof ResponseModality];

/**
 * @public
 */
export declare interface RetrievedContextAttribution {
    uri: string;
    title: string;
}

/**
 * @license
 * Copyright 2024 Google LLC
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
 * Role is the producer of the content.
 * @public
 */
export declare type Role = (typeof POSSIBLE_ROLES)[number];

/**
 * A safety rating associated with a {@link GenerateContentCandidate}
 * @public
 */
export declare interface SafetyRating {
    category: HarmCategory;
    probability: HarmProbability;
    /**
     * The harm severity level.
     *
     * This property is only supported when using the Vertex AI Gemini API ({@link VertexAIBackend}).
     * When using the Gemini Developer API ({@link GoogleAIBackend}), this property is not supported and will default to `HarmSeverity.UNSUPPORTED`.
     */
    severity: HarmSeverity;
    /**
     * The probability score of the harm category.
     *
     * This property is only supported when using the Vertex AI Gemini API ({@link VertexAIBackend}).
     * When using the Gemini Developer API ({@link GoogleAIBackend}), this property is not supported and will default to 0.
     */
    probabilityScore: number;
    /**
     * The severity score of the harm category.
     *
     * This property is only supported when using the Vertex AI Gemini API ({@link VertexAIBackend}).
     * When using the Gemini Developer API ({@link GoogleAIBackend}), this property is not supported and will default to 0.
     */
    severityScore: number;
    blocked: boolean;
}

/**
 * Safety setting that can be sent as part of request parameters.
 * @public
 */
export declare interface SafetySetting {
    category: HarmCategory;
    threshold: HarmBlockThreshold;
    /**
     * The harm block method.
     *
     * This property is only supported in the Vertex AI Gemini API ({@link VertexAIBackend}).
     * When using the Gemini Developer API ({@link GoogleAIBackend}), an {@link AIError} will be
     * thrown if this property is defined.
     */
    method?: HarmBlockMethod;
}

/**
 * Parent class encompassing all Schema types, with static methods that
 * allow building specific Schema types. This class can be converted with
 * `JSON.stringify()` into a JSON string accepted by Vertex AI REST endpoints.
 * (This string conversion is automatically done when calling SDK methods.)
 * @public
 */
export declare abstract class Schema implements SchemaInterface {
    /**
     * Optional. The type of the property. {@link
     * SchemaType}.
     */
    type: SchemaType;
    /** Optional. The format of the property.
     * Supported formats:<br/>
     * <ul>
     *  <li>for NUMBER type: "float", "double"</li>
     *  <li>for INTEGER type: "int32", "int64"</li>
     *  <li>for STRING type: "email", "byte", etc</li>
     * </ul>
     */
    format?: string;
    /** Optional. The description of the property. */
    description?: string;
    /** Optional. Whether the property is nullable. Defaults to false. */
    nullable: boolean;
    /** Optional. The example of the property. */
    example?: unknown;
    /**
     * Allows user to add other schema properties that have not yet
     * been officially added to the SDK.
     */
    [key: string]: unknown;
    constructor(schemaParams: SchemaInterface);
    /**
     * Defines how this Schema should be serialized as JSON.
     * See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify#tojson_behavior
     * @internal
     */
    toJSON(): SchemaRequest;
    static array(arrayParams: SchemaParams & {
        items: Schema;
    }): ArraySchema;
    static object(objectParams: SchemaParams & {
        properties: {
            [k: string]: Schema;
        };
        optionalProperties?: string[];
    }): ObjectSchema;
    static string(stringParams?: SchemaParams): StringSchema;
    static enumString(stringParams: SchemaParams & {
        enum: string[];
    }): StringSchema;
    static integer(integerParams?: SchemaParams): IntegerSchema;
    static number(numberParams?: SchemaParams): NumberSchema;
    static boolean(booleanParams?: SchemaParams): BooleanSchema;
}

/**
 * Interface for {@link Schema} class.
 * @public
 */
export declare interface SchemaInterface extends SchemaShared<SchemaInterface> {
    /**
     * The type of the property. {@link
     * SchemaType}.
     */
    type: SchemaType;
}

/**
 * Params passed to {@link Schema} static methods to create specific
 * {@link Schema} classes.
 * @public
 */
export declare interface SchemaParams extends SchemaShared<SchemaInterface> {
}

/**
 * Final format for {@link Schema} params passed to backend requests.
 * @public
 */
export declare interface SchemaRequest extends SchemaShared<SchemaRequest> {
    /**
     * The type of the property. {@link
     * SchemaType}.
     */
    type: SchemaType;
    /** Optional. Array of required property. */
    required?: string[];
}

/**
 * Basic {@link Schema} properties shared across several Schema-related
 * types.
 * @public
 */
export declare interface SchemaShared<T> {
    /** Optional. The format of the property.
     * When using the Gemini Developer API ({@link GoogleAIBackend}), this must be either `'enum'` or
     * `'date-time'`, otherwise requests will fail.
     */
    format?: string;
    /** Optional. The description of the property. */
    description?: string;
    /** Optional. The items of the property. */
    items?: T;
    /** Optional. Map of `Schema` objects. */
    properties?: {
        [k: string]: T;
    };
    /** Optional. The enum of the property. */
    enum?: string[];
    /** Optional. The example of the property. */
    example?: unknown;
    /** Optional. Whether the property is nullable. */
    nullable?: boolean;
    [key: string]: unknown;
}

/**
 * @license
 * Copyright 2024 Google LLC
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
 * Contains the list of OpenAPI data types
 * as defined by the
 * {@link https://swagger.io/docs/specification/data-models/data-types/ | OpenAPI specification}
 * @public
 */
export declare enum SchemaType {
    /** String type. */
    STRING = "string",
    /** Number type. */
    NUMBER = "number",
    /** Integer type. */
    INTEGER = "integer",
    /** Boolean type. */
    BOOLEAN = "boolean",
    /** Array type. */
    ARRAY = "array",
    /** Object type. */
    OBJECT = "object"
}

/**
 * @public
 */
export declare interface Segment {
    partIndex: number;
    startIndex: number;
    endIndex: number;
}

/**
 * Params for {@link GenerativeModel.startChat}.
 * @public
 */
export declare interface StartChatParams extends BaseParams {
    history?: Content[];
    tools?: Tool[];
    toolConfig?: ToolConfig;
    systemInstruction?: string | Part | Content;
}

/**
 * Schema class for "string" types. Can be used with or without
 * enum values.
 * @public
 */
export declare class StringSchema extends Schema {
    enum?: string[];
    constructor(schemaParams?: SchemaParams, enumValues?: string[]);
    /**
     * @internal
     */
    toJSON(): SchemaRequest;
}

/**
 * Content part interface if the part represents a text string.
 * @public
 */
export declare interface TextPart {
    text: string;
    inlineData?: never;
    functionCall?: never;
    functionResponse?: never;
}

/**
 * Defines a tool that model can call to access external knowledge.
 * @public
 */
export declare type Tool = FunctionDeclarationsTool;

/**
 * Tool config. This config is shared for all tools provided in the request.
 * @public
 */
export declare interface ToolConfig {
    functionCallingConfig?: FunctionCallingConfig;
}

/**
 * A type that includes all specific Schema types.
 * @public
 */
export declare type TypedSchema = IntegerSchema | NumberSchema | StringSchema | BooleanSchema | ObjectSchema | ArraySchema;

/**
 * Usage metadata about a {@link GenerateContentResponse}.
 *
 * @public
 */
export declare interface UsageMetadata {
    promptTokenCount: number;
    candidatesTokenCount: number;
    totalTokenCount: number;
    promptTokensDetails?: ModalityTokenCount[];
    candidatesTokensDetails?: ModalityTokenCount[];
}

/**
 * @deprecated Use the new {@link AI | AI} instead. The Vertex AI in Firebase SDK has been
 * replaced with the Firebase AI SDK to accommodate the evolving set of supported features and
 * services. For migration details, see the {@link https://firebase.google.com/docs/vertex-ai/migrate-to-latest-sdk | migration guide}.
 *
 * An instance of the Firebase AI SDK.
 *
 * @public
 */
export declare type VertexAI = AI;

/**
 * Configuration class for the Vertex AI Gemini API.
 *
 * Use this with {@link AIOptions} when initializing the AI service via
 * {@link getAI | getAI()} to specify the Vertex AI Gemini API as the backend.
 *
 * @public
 */
export declare class VertexAIBackend extends Backend {
    /**
     * The region identifier.
     * See {@link https://firebase.google.com/docs/vertex-ai/locations#available-locations | Vertex AI locations}
     * for a list of supported locations.
     */
    readonly location: string;
    /**
     * Creates a configuration object for the Vertex AI backend.
     *
     * @param location - The region identifier, defaulting to `us-central1`;
     * see {@link https://firebase.google.com/docs/vertex-ai/locations#available-locations | Vertex AI locations}
     * for a list of supported locations.
     */
    constructor(location?: string);
}

/**
 * @deprecated Use the new {@link AIError} instead. The Vertex AI in Firebase SDK has been
 * replaced with the Firebase AI SDK to accommodate the evolving set of supported features and
 * services. For migration details, see the {@link https://firebase.google.com/docs/vertex-ai/migrate-to-latest-sdk | migration guide}.
 *
 * Error class for the Firebase AI SDK.
 *
 * @public
 */
export declare const VertexAIError: typeof AIError;

/**
 * @deprecated Use the new {@link AIModel} instead. The Vertex AI in Firebase SDK has been
 * replaced with the Firebase AI SDK to accommodate the evolving set of supported features and
 * services. For migration details, see the {@link https://firebase.google.com/docs/vertex-ai/migrate-to-latest-sdk | migration guide}.
 *
 * Base class for Firebase AI model APIs.
 *
 * @public
 */
export declare const VertexAIModel: typeof AIModel;

/**
 * Options when initializing the Firebase AI SDK.
 *
 * @public
 */
export declare interface VertexAIOptions {
    location?: string;
}

/**
 * Describes the input video content.
 * @public
 */
export declare interface VideoMetadata {
    /**
     * The start offset of the video in
     * protobuf {@link https://cloud.google.com/ruby/docs/reference/google-cloud-workflows-v1/latest/Google-Protobuf-Duration#json-mapping | Duration} format.
     */
    startOffset: string;
    /**
     * The end offset of the video in
     * protobuf {@link https://cloud.google.com/ruby/docs/reference/google-cloud-workflows-v1/latest/Google-Protobuf-Duration#json-mapping | Duration} format.
     */
    endOffset: string;
}

/**
 * @public
 */
export declare interface WebAttribution {
    uri: string;
    title: string;
}

export { }
