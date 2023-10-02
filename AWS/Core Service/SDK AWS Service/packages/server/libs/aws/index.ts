import * as awsClient from 'aws-sdk';
import { AWSConfig } from '../../interfaces/aws/awsConfig.interface';

export const s3Client = (awsConfig: AWSConfig) => {
    let s3 = new awsClient.S3({
        accessKeyId: awsConfig.accessKeyId,
        secretAccessKey: awsConfig.secretAccessKey,
        region: awsConfig.region
    });
    return s3;
}