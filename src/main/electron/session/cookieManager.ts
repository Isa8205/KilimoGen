// cookieManager.js
import { AppDataSource } from '@/main/database/src/data-source';
import { Session } from '@/main/database/src/entities/Session';
import { session } from 'electron';

const COOKIE_NAME = 'session_token';
const COOKIE_URL = 'https://codversetech.co.ke'; // must match what you use in cookie setup

async function setSessionCookie(token: any) {
  await session.defaultSession.cookies.set({
    url: COOKIE_URL,
    name: COOKIE_NAME,
    value: token,
    path: '/',
    sameSite: 'strict',
    secure: true,
    httpOnly: true,
    expirationDate: Math.floor(Date.now() / 1000) + (3600 * 24) // 1 day from now
  });
}

async function getSessionCookie(): Promise<string | null> {
  const cookies = await session.defaultSession.cookies.get({ name: COOKIE_NAME });
  return cookies.length > 0 ? cookies[0].value : null;
}

async function clearSessionCookie() {
    await session.defaultSession.cookies.remove(COOKIE_URL, COOKIE_NAME);
}

export {
  setSessionCookie,
  getSessionCookie,
  clearSessionCookie
};
