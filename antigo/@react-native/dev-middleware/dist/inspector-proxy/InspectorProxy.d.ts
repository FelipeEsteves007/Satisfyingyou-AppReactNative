/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *
 * @format
 * @oncall react_native
 */

import type { EventReporter } from "../types/EventReporter";
import type { Experiments } from "../types/Experiments";
import type { Logger } from "../types/Logger";
import type { CreateCustomMessageHandlerFn } from "./CustomMessageHandler";
import type { PageDescription } from "./types";
import type { IncomingMessage, ServerResponse } from "http";
import WS from "ws";
export type GetPageDescriptionsConfig = {
  requestorRelativeBaseUrl: URL;
  logNoPagesForConnectedDevice?: boolean;
};
export interface InspectorProxyQueries {
  /**
   * Returns list of page descriptions ordered by device connection order, then
   * page addition order.
   */
  getPageDescriptions(
    config: GetPageDescriptionsConfig
  ): Array<PageDescription>;
}
/**
 * Main Inspector Proxy class that connects JavaScript VM inside Android/iOS apps and JS debugger.
 */
declare class InspectorProxy implements InspectorProxyQueries {
  constructor(
    projectRoot: string,
    serverBaseUrl: string,
    eventReporter: null | undefined | EventReporter,
    experiments: Experiments,
    logger?: Logger,
    customMessageHandler: null | undefined | CreateCustomMessageHandlerFn
  );
  getPageDescriptions(
    $$PARAM_0$$: GetPageDescriptionsConfig
  ): Array<PageDescription>;
  processRequest(
    request: IncomingMessage,
    response: ServerResponse,
    next: ($$PARAM_0$$: null | undefined | Error) => unknown
  ): void;
  createWebSocketListeners(): { [path: string]: WS.Server };
}
export default InspectorProxy;
