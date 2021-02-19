import {firestore_v1beta2, google} from 'googleapis';
import {Logger} from '../common/logger';
import {gcpConfig} from '../env';
import Firestore = firestore_v1beta2.Firestore;

const logger = Logger.create('export ');

export class FirestoreExpoter {
  static execute = async (message: {json?: {collectionIds: string[]}}) => {
    const exportCollections = message.json?.collectionIds;

    if (!exportCollections || !exportCollections.length) {
      return;
    }

    const {bucketName} = gcpConfig;

    if (!bucketName) {
      logger.error('require params.');
      return;
    }

    try {
      logger.log(`start export firestore colletions. collectionIds=${exportCollections}`);

      const auth = await google.auth.getClient({
        scopes: ['https://www.googleapis.com/auth/datastore', 'https://www.googleapis.com/auth/cloud-platform'],
      });

      const firestore = new Firestore({});
      const result = await firestore.projects.databases.exportDocuments({
        auth,
        requestBody: {
          collectionIds: exportCollections,
          outputUriPrefix: `gs://${bucketName}`,
        },
      });
      logger.log('export finieshd.', result);

      return Promise.resolve('success');
    } catch (e) {
      logger.error('Failed to create firestore backup.', e);
      return Promise.reject(e);
    }
  };
}
