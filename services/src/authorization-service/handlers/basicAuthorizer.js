'use strict';

import {
    lambdaLogger
} from '../../utils/lambda-logger';
import { generatePolicy } from '../utils/generate-policy';

const logger = lambdaLogger();

export const basicAuthorizer = (event, ctx, cb) => {
  logger.log('Auth event:', event);
  if (event.type !== 'TOKEN') {
    return cb('Unauthorized');
  }
  try {
    const encodedCreds = event.authorizationToken.split(' ')[1];
    const [username, password] = Buffer.from(encodedCreds, 'base64').toString('utf-8').split(':');
    logger.log('username', username);
    logger.log('password', password);
    const userPassword = process.env[username]
    const effect = !userPassword || userPassword !== password ? 'Deny' : 'Allow';
    logger.log('Auth effect', effect);
    const policy = generatePolicy(encodedCreds, event.methodArn, effect);
    logger.log('Auth policy', policy);
    cb(null, policy);
  } catch (e) {
    logger.error('Auth error:', e);
  }
}