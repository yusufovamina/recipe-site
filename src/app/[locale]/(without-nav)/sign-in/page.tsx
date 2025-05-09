"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTranslations } from "next-intl";
import { signIn } from "next-auth/react";
import { FormEvent, useState } from "react";
import { Link, useRouter } from "../../../i18n/navigation";
import LocaleSwitcher from "../../../../components/LocaleSwitcher";

export default function SignInPage() {
  const t = useTranslations("SignInPage");
  const router = useRouter();
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  async function handleSignIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        console.error("Sign-in error:", result.error);
        setError(
          result.error === "CredentialsSignin"
            ? t("invalidCredentials")
            : t("unexpectedError")
        );
      } else if (result?.url) {
        router.push("/home");
      } else {
        setError(t("unexpectedError"));
      }
    } catch (error) {
      console.error("Client-side error:", error);
      setError(t("unexpectedError"));
    } finally {
      setIsLoading(false);
    }
  }

  async function handleGoogleSignIn() {
    setError("");
    setIsLoading(true);

    try {
      const result = await signIn("google", {
        redirect: false,
        callbackUrl: "/home",
      });

      if (result?.error) {
        console.error("Google sign-in error:", result.error);
        setError(t("googleSignInError"));
      } else if (result?.url) {
        router.push("/home");
      } else {
        setError(t("unexpectedError"));
      }
    } catch (error) {
      console.error("Client-side Google error:", error);
      setError(t("googleSignInError"));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 dark:from-gray-900 dark:via-gray-800 dark:to-gray-950">
      <div className="relative w-full max-w-md p-8 backdrop-blur-md bg-white/30 dark:bg-gray-800/30 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl transform transition-all duration-300 hover:shadow-lg">
        <div className="absolute -top-4 -left-4 w-16 h-16 bg-orange-500/20 rounded-full blur-md"></div>
        <div className="relative z-10">
          <div className="flex justify-center mb-6">
            <LocaleSwitcher />
          </div>
          <h1 className="text-4xl font-bold mb-8 text-center text-gray-800 dark:text-gray-100 animate-fade-in">
            {t("title")}
          </h1>

          <form onSubmit={handleSignIn} className="space-y-6">
            <div>
              <Label htmlFor="email" className="text-gray-700 dark:text-gray-300 font-medium">
                {t("emailLabel")}
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder={t("emailPlaceholder")}
                required
                disabled={isLoading}
                className="w-full mt-2 p-3 rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-gray-200 dark:placeholder-gray-400 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 transition-all duration-300"
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-gray-700 dark:text-gray-300 font-medium">
                {t("passwordLabel")}
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder={t("passwordPlaceholder")}
                required
                disabled={isLoading}
                className="w-full mt-2 p-3 rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-gray-200 dark:placeholder-gray-400 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 transition-all duration-300"
              />
            </div>

            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 mt-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-300 transform hover:scale-105 shadow-md disabled:opacity-50"
            >
              {isLoading ? t("loggingIn") : t("loginButton")}
            </Button>
          </form>

          <Button
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full mt-4 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-lg hover:from-gray-700 hover:to-gray-800 transition-all duration-300 transform hover:scale-105 shadow-md disabled:opacity-50"
          >
            {isLoading ? t("loggingIn") : t("loginWithGoogle")}
          </Button>

          <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
            {t("registerPrompt")}{" "}
            <Link
              href="/sign-up"
              className="text-orange-500 hover:text-orange-600 font-medium transition-colors duration-300"
            >
              {t("registerLink")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}