import type { NextAuthConfig } from "next-auth";

export const authConfig: NextAuthConfig = {
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  providers: [],
  callbacks: {
    authorized({ auth, request }) {
      const isAuthenticated = !!auth?.user;
      const { pathname } = request.nextUrl;

      if (pathname.startsWith("/dashboard") && !isAuthenticated) return false;
      return true;
    },
  },
};
