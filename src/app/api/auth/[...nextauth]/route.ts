import NextAuth, { NextAuthOptions, User } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

// Cognito will be configured as a custom OAuth provider below. It expects the
// following env vars: COGNITO_CLIENT_ID, COGNITO_CLIENT_SECRET, COGNITO_ISSUER
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
    // Cognito (OIDC) provider
    ...(process.env.COGNITO_CLIENT_ID && process.env.COGNITO_ISSUER
      ? [
          // cognitoProvider is declared separately for clearer typing/runtime behavior
          (function () {
            type Profile = {
              sub?: string | number;
              name?: string;
              preferred_username?: string;
              email?: string;
            };
            const cognitoProvider: unknown = {
              id: "cognito",
              name: "Cognito",
              type: "oauth",
              version: "2.0",
              scope: "openid profile email",
              params: { grant_type: "authorization_code" },
              authorization: `${process.env.COGNITO_ISSUER}/oauth2/authorize?response_type=code`,
              token: `${process.env.COGNITO_ISSUER}/oauth2/token`,
              userinfo: `${process.env.COGNITO_ISSUER}/oauth2/userInfo`,
              clientId: process.env.COGNITO_CLIENT_ID,
              clientSecret: process.env.COGNITO_CLIENT_SECRET,
              profile(profile: Profile) {
                const id = profile.sub !== undefined ? String(profile.sub) : undefined;
                const name = profile.name ?? profile.preferred_username;
                const email = profile.email;
                return {
                  id: id ?? undefined,
                  name: name as string | undefined,
                  email: email as string | undefined,
                  image: null,
                };
              },
            };
            return cognitoProvider as unknown as never;
          })(),
        ]
      : []),
    // Optional: enable a simple credentials provider for local testing by setting ALLOW_CREDENTIALS=1
    ...(process.env.ALLOW_CREDENTIALS === "1"
      ? [
          CredentialsProvider({
            name: "Credentials",
            credentials: {
              email: { label: "Email", type: "text" },
              password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
              const email = credentials?.email;
              const pass = credentials?.password;
              const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "admin@example.com";
              const ADMIN_PASS = process.env.ADMIN_PASS ?? "password";
              if (email === ADMIN_EMAIL && pass === ADMIN_PASS) {
                const user: User = { id: "local-admin", name: "Admin", email };
                return user;
              }
              return null;
            },
          }),
        ]
      : []),
  ],
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,
};

export const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
