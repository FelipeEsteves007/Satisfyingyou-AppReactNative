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

declare function getBaseUrlFromRequest(
  req: http$IncomingMessage<tls$TLSSocket> | http$IncomingMessage<net$Socket>
): null | undefined | URL;
export default getBaseUrlFromRequest;
