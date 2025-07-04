import * as React from 'react';
type State = {
    portals: Array<{
        key: number;
        children: React.ReactNode;
    }>;
};
/**
 * Portal host is the component which actually renders all Portals.
 */
export default class PortalManager extends React.PureComponent<{}, State> {
    state: State;
    mount: (key: number, children: React.ReactNode) => void;
    update: (key: number, children: React.ReactNode) => void;
    unmount: (key: number) => void;
    render(): React.JSX.Element[];
}
export {};
//# sourceMappingURL=PortalManager.d.ts.map