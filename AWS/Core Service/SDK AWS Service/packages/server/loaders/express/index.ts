//@ts-nocheck
import express, { Application } from "express";
import cors from "cors";
import morgan from "morgan";
import path from "path";
import env from "../../configs/env";
const App = () => {
  const app: Application = express();
  // set log request
  if (env.node === "development") app.use(morgan("dev"));
  // parse json request body
  app.use(express.json({ limit: "10mb" }));
  app.use(
    express.urlencoded({ limit: "10mb", extended: true, parameterLimit: 1000 })
  );
  const whitelist = env.whiteLists?.split(",") || "";
  const corsOptions = {
    credentials: true,
    origin: (origin: any, callback: any) => {
      if (origin === undefined || whitelist.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`Not allowed by CORS: ${origin}`));
      }
    },
    exposedHeaders: ["content-disposition"],
  };
  app.use(cors(corsOptions));
  // @ts-ignore
  // app.options('*', cors());
  return app;
};
export default App;
