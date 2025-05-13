import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import { locales, defaultLocale } from "@/app/i18n";

const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET;
if (!NEXTAUTH_SECRET) {
  throw new Error("Please provide NEXTAUTH_SECRET environment variable");
}

export const authOptions = {
  secret: NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // Here should be your actual authentication logic
        // This is just an example, replace with your actual database check
        if (credentials.email === "user@example.com" && credentials.password === "password123") {
          return {
            id: "1",
            name: "Test User",
            email: credentials.email,
          };
        }
        return null;
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID || "",
      clientSecret: process.env.GITHUB_SECRET || "",
    }),
  ],
  pages: {
    signIn: `/${defaultLocale}/sign-in`,
    error: `/${defaultLocale}/sign-in`,
  },
  callbacks: {
    async redirect({ url, baseUrl }) {
      // Handle localized routes
      const defaultPath = `/${defaultLocale}/home`;
      
      // If the URL is relative, prefix it with the base URL
      if (url.startsWith('/')) {
        url = baseUrl + url;
      }

      // If the URL is already on the base URL, just ensure it has a locale
      if (url.startsWith(baseUrl)) {
        const path = url.slice(baseUrl.length);
        if (!locales.some(locale => path.startsWith(`/${locale}/`))) {
          return `${baseUrl}${defaultPath}`;
        }
        return url;
      }

      // Default fallback
      return `${baseUrl}${defaultPath}`;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
};

export const { handlers: { GET, POST }, auth } = NextAuth(authOptions);