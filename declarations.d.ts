interface NodeModule {
  hot: {
    accept(path: string, callback: () => void): void;
  }
}

declare const SERVER: boolean;

interface Window {
  __STATE__: any;
  __REDUX_DEVTOOLS_EXTENSION__(): any;
}

declare module 'microseconds' {
  export interface DateObject {
    microseconds: number;
    milliseconds: number;
    seconds: number;
    minutes: number;
    hours: number;
    days: number;
  }

  export function now(): number;
  export function parse(timeStamp: number): DateObject;
  export function since(timeStamp: number): number;
}

declare module 'koa-helmet' {
  import { Middleware } from 'koa';

  export default function(): Middleware;
}

declare module '*.svg' {
  const _: string;
  export default _;
}
