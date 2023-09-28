const express = require('express');
import s3Controller from './s3.controller'

const router = express.Router();

router
    .route('/')
    .get(s3Controller.getBucket);

router
    .route('/all')
    .get(s3Controller.getBuckets)

export default router;