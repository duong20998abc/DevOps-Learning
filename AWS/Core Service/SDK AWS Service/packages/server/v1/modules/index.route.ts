
import express from 'express';
const router = express.Router();
import ec2Route from './ec2/ec2.route';
import s3Route from './s3/s3.route';

const routes = [
    {
        path: '/ec2',
        route: ec2Route,
    },
    {
        path: '/s3',
        route: s3Route,
    },
];

routes.forEach((route) => {
    router.use(route.path, route.route);
});

export default router;



