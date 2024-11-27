// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import * as express from "express";
import * as newrelic from 'newrelic';
import { Logger } from '../utils/logger';

const REQUEST_TIMEOUT_IN_MILLISECONDS: number = parseInt(process.env.REQUEST_TIMEOUT_IN_MILLISECONDS) || 120000;

export function RequestTimeoutHandler(req: express.Request, res: express.Response, next: (err?: any) => void): any {
  req.setTimeout(REQUEST_TIMEOUT_IN_MILLISECONDS, (): void => {
    Logger.error('Request timeout', {
      url: req.url,
      method: req.method,
      timeout: REQUEST_TIMEOUT_IN_MILLISECONDS,
      component: 'RequestTimeoutHandler'
    });
    
    res.sendStatus(408);
  });

  next();
}
