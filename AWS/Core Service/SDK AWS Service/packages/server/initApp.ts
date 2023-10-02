import expressLoader from './loaders/express';
import env from './configs/env';
import { errorConverter, errorHandler } from './middlewares/handleError';
import express from 'express';
import routes from './v1/modules/index.route';

const initApp = () => {
    const app = expressLoader();
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    // app.use('/resources', express.static(path.join(__dirname, './upload/resources')))
    // handle error
    app.use(errorConverter);
    app.use(errorHandler);
    if (env.node === 'production') {
    }

    // v1 api routes
    app.use('/v1', routes);
    app.listen(env.app.port, async () => {
        console.log(`server is running at http://localhost:${env.app.port}`);
    });
}

export default initApp;
