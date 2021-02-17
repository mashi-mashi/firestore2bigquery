import * as functions from 'firebase-functions';
import {gcpConfig} from './env';
import {BigQueryImporter} from './service/bigqueryImpoter';
import {FirestoreExpoter} from './service/firestoreExpoter';

const bucketName = gcpConfig.bucketName;

export const firestoreTobigquery = {
  export: functions
    .region('asia-northeast1')
    .runWith({memory: '512MB'})
    .pubsub.topic('export-firestore-backup')
    .onPublish(FirestoreExpoter.execute),
  import: functions
    .region('asia-northeast1')
    .runWith({memory: '512MB'})
    .storage.bucket(`${bucketName}`)
    .object()
    .onFinalize(BigQueryImporter.execute),
};
