/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ILogger {
  info: (message: any, ...optionalParams: any[]) => void;
  warn: (message: any, ...optionalParams: any[]) => void;
  error: (message: any, ...optionalParams: any[]) => void;
}

export const Logger: ILogger = {
  info(message: any, ...optionalParams: any[]): void {
    console.info(message, ...optionalParams);
  },

  warn(message: any, ...optionalParams: any[]): void {
    console.warn(message, ...optionalParams);
  },

  error(message: any, ...optionalParams: any[]): void {
    console.error(message, ...optionalParams);
  },
};
