import { getSessionCookie } from "@/main/electron/session/cookieManager";
import { getSession } from "@/main/electron/session/sessinStore";

function requireRole(role: string, handler: any) {
  return async (event: any, ...args: any) => {
    const token = await getSessionCookie();
    const session = getSession(token);

    if (!session || session.role !== role) {
      throw new Error(`Access denied. Requires role: ${role}`);
    }

    return handler(event, ...args);
  };
}