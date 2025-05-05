import { AppDataSource } from "@/main/database/src/data-source";
import { Session } from "@/main/database/src/entities/Session";
import { json } from "stream/consumers";

// sessionStore.js
const sessions = new Map(); // token -> user data

async function createSession(token: any, data: any) {
  try {
  sessions.set(token, data);
  const sessionRepository = AppDataSource.getRepository(Session)
  const session = new Session
  session.id = token
  session.data = JSON.stringify(data)
  await sessionRepository.save(session)
} catch (err) {
  console.log("error creating session: ", err)
}
}

function getSession(token: any) {
  return sessions.get(token);
}

function destroySession(token: any) {
  sessions.delete(token);
}

export {
  createSession,
  getSession,
  destroySession
};
