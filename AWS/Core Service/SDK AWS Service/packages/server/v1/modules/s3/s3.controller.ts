import { catchAsync } from "../../../utils";
import s3Service from './s3.service'
import * as redisCached from "../../../loaders/redis";
import env from "../../../configs/env";
import { AWSConfig } from "../../../interfaces/aws/awsConfig.interface";
import httpStatus from "http-status";
import express, { Request, Response } from 'express';

const getBucket = async (req: Request, res: Response) => {
    res.send("nvhien")
}
const getBuckets = async (req: Request, res: Response) => {
    // Trích xuất thông tin cấu hình từ header
    const awsConfigKey = req.headers[`${env.awsConfigKey}`] as string;
    if (!awsConfigKey) {
        return res.status(400).json({ error: 'Thiếu thông tin cấu hình AWS trong header.' });
    }

    const awsConfig = JSON.parse(awsConfigKey) as AWSConfig;
    let buckets = await s3Service.getBuckets(awsConfig);
    return res.status(200).json(buckets);
}
const createBucket = () => {

}

export default {
    getBucket,
    getBuckets,
    createBucket
};