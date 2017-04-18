/* eslint-disable react/no-danger */

// Component to render the full HTML response in React

// ----------------------
// IMPORTS
import React from 'react';
import {HelmetData} from 'react-helmet';

// ----------------------

export interface HtmlProps {
  head: HelmetData;
  html: string;
  state: any;
  scripts: string[];
  chunkManifest: object;
  css: string;
}

const Html = ({ head, html, state, scripts, chunkManifest, css }: HtmlProps) => (
  <html lang="en" prefix="og: http://ogp.me/ns#">
    <head>
      <meta charSet="utf-8" />
      <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      <meta httpEquiv="Content-Language" content="en" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      {head.meta.toComponent()}
      <link rel="stylesheet" href={css} />
      {head.title.toComponent()}
      <script
        dangerouslySetInnerHTML={{
          __html: `window.webpackManifest = ${JSON.stringify(chunkManifest)}`,
        }} />
    </head>
    <body>
      <div
        id="main"
        dangerouslySetInnerHTML={{ __html: html }} />
      <script
        dangerouslySetInnerHTML={{
          __html: `window.__STATE__ = ${JSON.stringify(state)}`,
        }} />
      {scripts.map(src => <script key={src} defer src={src} />)}
    </body>
  </html>
);

export default Html;
