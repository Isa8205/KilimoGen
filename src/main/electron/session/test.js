// auth.js (or part of your main process entry)

const { createSession } = require('./sessionStore');
const { setSessionCookie } = require('./cookieManager');
const { v4: uuidv4 } = require('uuid'); // `npm install uuid`

async function login(username, password) {
  // 👇 Replace this with real auth logic
  if (username === 'admin' && password === 'password') {
    const token = uuidv4();
    const user = {
      username: 'admin',
      role: 'admin'
    };
    createSession(token, user);
    await setSessionCookie(token);
    return { success: true };
  }

  return { success: false, error: 'Invalid credentials' };
}


// --------------------------------------------------------------------

// main.js or ipcHandlers.js
const { ipcMain } = require('electron');
const { getSessionCookie } = require('./cookieManager');
const { getSession } = require('./sessionStore');

function requireRole(role, handler) {
  return async (event, ...args) => {
    const token = await getSessionCookie();
    const session = getSession(token);

    if (!session || session.role !== role) {
      throw new Error(`Access denied. Requires role: ${role}`);
    }

    return handler(event, ...args);
  };
}

// Example usage
ipcMain.handle('secure:get-farmers', requireRole('admin', async (event) => {
  // return data only admins should see
  return [{ name: 'Farmer Joe' }, { name: 'Farmer Sue' }];
}));

// --------------------------------------------------------------------
