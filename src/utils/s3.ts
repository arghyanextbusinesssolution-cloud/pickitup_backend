import * as AWS from 'aws-sdk';
import { logger } from './logger';

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
});

export const uploadFile = async (bucketName: string, key: string, body: any) => {
    try {
        const params = {
            Bucket: bucketName,
            Key: key,
            Body: body,
        };
        const result = await s3.upload(params).promise();
        return result.Location;
    } catch (error) {
        logger.error(error, 'S3 upload error');
        throw error;
    }
};

export const deleteFile = async (bucketName: string, key: string) => {
    try {
        const params = {
            Bucket: bucketName,
            Key: key,
        };
        await s3.deleteObject(params).promise();
    } catch (error) {
        logger.error(error, 'S3 delete error');
        throw error;
    }
};
