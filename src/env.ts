import * as dotenv from 'dotenv';

dotenv.config();

export const gcpConfig = {
  // gs:// は不要
  bucketName: process.env.bucketName,
};
