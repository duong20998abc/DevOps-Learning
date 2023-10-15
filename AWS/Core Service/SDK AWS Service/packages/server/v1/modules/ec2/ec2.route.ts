const express = require('express');
import userController from './ec2.controller'

const router = express.Router();

router
    .route('/')
    .post(userController.createEc2Instance);

export default router;