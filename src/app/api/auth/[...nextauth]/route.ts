import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
  secret: process.env.NEXTAUTH_SECRET || "your-secret-key-here", // Используем переменную окружения или дефолтное значение
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Здесь должна быть логика проверки учетных данных
        // Это пример, замените на реальную проверку (например, с базой данных)
        if (credentials?.email === "user@example.com" && credentials?.password === "password123") {
          return { id: "1", name: "Test User", email: "user@example.com" };
        }
        return null; // Возвращаем null, если учетные данные неверные
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  pages: {
    signIn: "/sign-in", // Кастомная страница логина
  },
  callbacks: {
    async redirect({ url, baseUrl }: { url: string; baseUrl: string }) {
      // Перенаправляем на /home после успешного входа
      return url.startsWith(baseUrl) ? "/home" : baseUrl + "/home";
    },
  },
};

export const { handlers, signIn, signOut, auth } = NextAuth(authOptions);