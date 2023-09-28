import { Credentials } from "google-auth-library";
import { RedisClient } from "../loaders/redis";
import { SessionInformation } from "../interfaces";
import { ROLES } from "../../lib";

export async function getSession(sessionId: string) {
  const session = await RedisClient.get(sessionId || "");
  return session ? (JSON.parse(session) as SessionInformation) : null;
}

export async function invalidateSession(sessionId: string) {
  await RedisClient.del(sessionId);
}

export async function createSession(
  origin: string,
  roles: ROLES,
  email: string,
  authGoogleId: string,
  userId: string,
  exTime: number,
  token?: Credentials | null
) {
  const sessionId = `${origin}_${userId}`;
  const session = {
    sessionId,
    roles,
    email,
    valid: true,
    userId,
    authGoogleId,
    token: token ? token : null,
  };
  await RedisClient.set(authGoogleId, JSON.stringify(session), {
    EX: exTime,
  });
  return session;
}
