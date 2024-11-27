import * as newrelic from 'newrelic';

export class Logger {
  static info(message: string, attributes?: object) {
    console.log(message);
    newrelic.recordLogEvent('info', {
      message,
      ...attributes
    });
  }

  static error(message: string | Error, attributes?: object) {
    const errorMessage = message instanceof Error ? message.message : message;
    const errorStack = message instanceof Error ? message.stack : undefined;

    console.error(message);
    newrelic.recordLogEvent('error', {
      message: errorMessage,
      stack: errorStack,
      ...attributes
    });

    if (message instanceof Error) {
      newrelic.noticeError(message, attributes);
    }
  }

  static warn(message: string, attributes?: object) {
    console.warn(message);
    newrelic.recordLogEvent('warning', {
      message,
      ...attributes
    });
  }

  static debug(message: string, attributes?: object) {
    console.debug(message);
    newrelic.recordLogEvent('debug', {
      message,
      ...attributes
    });
  }
} 