import * as React from 'react';
import type { PortalMethods } from './PortalHost';
type Props = {
    manager: PortalMethods;
    children: React.ReactNode;
};
export default class PortalConsumer extends React.Component<Props> {
    componentDidMount(): void;
    componentDidUpdate(): void;
    componentWillUnmount(): void;
    private key;
    private checkManager;
    render(): null;
}
export {};
//# sourceMappingURL=PortalConsumer.d.ts.map