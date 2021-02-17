import cors from 'cors';
import express from 'express';
import * as functions from 'firebase-functions';
import {apiV1} from './api/v1';
import {middleware, verifyFirebaseAuth} from './common/middleware';

const Api = express();
Api.use(cors());
Api.use(verifyFirebaseAuth);
Api.use(middleware);
Api.use('/v1', apiV1);

export const api = functions.https.onRequest(Api);
