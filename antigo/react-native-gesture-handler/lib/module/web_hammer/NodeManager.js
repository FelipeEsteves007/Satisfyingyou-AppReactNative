export const gestures = {};
export function getHandler(tag) {
  if (tag in gestures) {
    return gestures[tag];
  }

  throw new Error(`No handler for tag ${tag}`);
}
export function createGestureHandler(handlerTag, handler) {
  if (handlerTag in gestures) {
    throw new Error(`Handler with tag ${handlerTag} already exists`);
  }

  gestures[handlerTag] = handler; // @ts-ignore no types for web handlers yet

  gestures[handlerTag].handlerTag = handlerTag;
}
export function dropGestureHandler(handlerTag) {
  // Since React 18, there are cases where componentWillUnmount gets called twice in a row
  // so skip this if the tag was already removed.
  if (!(handlerTag in gestures)) {
    return;
  }

  getHandler(handlerTag).destroy(); // eslint-disable-next-line @typescript-eslint/no-dynamic-delete

  delete gestures[handlerTag];
}
export function getNodes() {
  return { ...gestures
  };
}
//# sourceMappingURL=NodeManager.js.map