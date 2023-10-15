import ec2Controller from "./ec2/ec2.controller"
import s3Controller from "./s3/s3.controller";

const appController = {
    ec2Controller: ec2Controller,
    s3Controller: s3Controller
}

export default appController;