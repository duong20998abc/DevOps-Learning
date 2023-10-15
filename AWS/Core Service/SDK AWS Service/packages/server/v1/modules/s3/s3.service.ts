


// Import required AWS SDK clients and commands for Node.js.
import { s3Client } from "../../../libs/aws";
import { AWSConfig } from "../../../interfaces/aws/awsConfig.interface";


const getBucket = async (awsConfig: AWSConfig, params: any) => {

};

const getBuckets = async (awsConfig: AWSConfig) => {
   return await s3Client(awsConfig).listBuckets().promise();
};

const createBucket = async (awsConfig: AWSConfig, params: any) => {

};


const putObjectToBucket = async (awsConfig: AWSConfig, params: any) => {

}

export default {
    getBucket,
    getBuckets,
    createBucket,
    putObjectToBucket
}
