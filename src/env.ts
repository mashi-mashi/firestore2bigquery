import * as dotenv from 'dotenv';

dotenv.config();

export const gcpConfig = {
  projectId: process.env.projectId,
  // gs:// は不要
  bucketName: process.env.bucketName,
};
