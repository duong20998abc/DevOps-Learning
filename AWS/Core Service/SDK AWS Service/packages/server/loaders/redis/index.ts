import { createClient } from 'redis';
import env from '../../configs/env';
export const RedisClient = createClient({ url: 'redis://127.0.0.1:6379' });

export const connectRedis =async ()=> {
  await RedisClient.on('error', (err) =>
    console.log('Redis Client Error', err)
  );
  await RedisClient.connect();
  console.log("redis connected");
}

export const setCached =  async (key: string, value: any) => {
  await RedisClient.set(key,value);
}

export const getCahed = async (key: string) => {
  let dataCached = await RedisClient.hGetAll(key);
  let result = JSON.stringify(dataCached);
  return result
}