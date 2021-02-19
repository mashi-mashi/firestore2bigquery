import {BigQuery} from '@google-cloud/bigquery';
import {bigquery_v2} from 'googleapis';
import Schema$JobConfigurationLoad = bigquery_v2.Schema$JobConfigurationLoad;

export class BigQueryImporter {
  public static execute = async (object: {bucket?: string; name?: string}) => {
    const {name, bucket} = object;

    if (!name || !bucket) {
      return;
    }

    // 正規表現でFirestoreドキュメントのエクスポートが終わった時に作成されるmetadataかどうかチェック
    const matched = name.match(/all_namespaces_kind_(.+)\.export_metadata/);
    if (!matched) {
      console.log('not firestore backup finalized event');
      return false;
    }

    const collectionName = matched[1];

    const bigquery = new BigQuery();
    const configuration: Schema$JobConfigurationLoad = {
      destinationTable: {
        datasetId: `firestore`,
        tableId: `${collectionName}`,
      },
      sourceFormat: 'DATASTORE_BACKUP',
      sourceUris: [`gs://${object.bucket}/${name}`],
      writeDisposition: 'WRITE_TRUNCATE',
    };

    await bigquery.createJob({
      configuration: {load: configuration},
    });
    return Promise.resolve('success');
  };
}
