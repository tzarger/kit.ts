/* eslint-disable no-param-reassign */

// ----------------------
// IMPORTS

import * as React from 'react';

import { Route, Redirect as ReactRouterRedirect, RouteComponentProps } from 'react-router-dom';

import { Context } from 'koa';

// ----------------------

interface RenderProps extends RouteComponentProps<any> {
  staticContext: Context;
}

// <Status code="xxx"> component.  Updates the context router's context, which
// can be used by the server handler to respond to the status on the server.
class Status extends React.PureComponent<StatusProps, {}> {
  static defaultProps = {
    children: null,
  }

  render() {
    const { code, children } = this.props;
    return (
      <Route render={({ staticContext }: RenderProps) => {
        if (staticContext) {
          staticContext.status = code;
        }
        return children;
      }} />
    );
  }
}

interface StatusProps {
  code: number;
  children?: React.ReactNode;
}

// <NotFound> component.  If this renders on the server in development mode,
// it will attempt to proxyify the request to the upstream `webpack-dev-server`.
// In production, it will issue a hard 404 and render.  In the browser, it will
// simply render.
export class NotFound extends React.Component<NotFoundProps, {}> {
  static defaultProps = {
    children: null,
  }

  render() {
    const { children } = this.props;

    return (
      <Status code={404}>
        {children}
      </Status>
    );
  }
}

interface NotFoundProps {
  children?: React.ReactNode;
}

// <Redirect> component. Mirrors React Router's component by the same name,
// except it sets a 301/302 status code for setting server-side HTTP headers.
export class Redirect extends React.PureComponent<RedirectProps, {}> {

  static defaultProps = {
    from: null,
    push: false,
    permanent: false,
  }

  render() {
    const { to, from, push, permanent } = this.props;
    const code = permanent ? 301 : 302;
    return (
      <Status code={code}>
        <ReactRouterRedirect to={to} from={from} push={push} />
      </Status>
    );
  }
}

interface RedirectProps {
  to: string | object;
  from?: string;
  push?: boolean;
  permanent?: boolean;
}
