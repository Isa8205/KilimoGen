declare module "jsonwebtoken" {
  interface JwtPayload {
    userId: string;
    username: string;
    role: "admin" | "user"; // You can make this more specific
  }

  interface JwtToken extends JwtPayload {
    exp: number; // expiration time
    iat: number; // issued at time
  }
}

export {};
