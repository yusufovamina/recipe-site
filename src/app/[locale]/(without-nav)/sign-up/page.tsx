"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn } from "next-auth/react";
import { FormEvent, useState } from "react";
import { Link, useRouter } from "../../../i18n/navigation";
import { useLocale } from "next-intl";
import { useTranslations } from "next-intl";
import LanguageSwitcher from "@/app/components/LanguageSwitcher";

export default function SignUpPage() {
  const t = useTranslations("SignUpPage");
  const router = useRouter();
  const locale = useLocale();
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  async function handleSignUp(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      // After successful registration, redirect to sign-in page with locale
      router.push(`/${locale}/sign-in`);
    } catch (error: any) {
      console.error("Registration error:", error);
      setError(error.message || t("registrationError"));
    } finally {
      setIsLoading(false);
    }
  }

  async function handleGoogleSignIn() {
    setError("");
    setIsLoading(true);

    try {
      await signIn("google", {
        callbackUrl: `/${locale}/home`,
      });
    } catch (error) {
      console.error("Google sign-in error:", error);
      setError(t("googleSignInError"));
      setIsLoading(false);
    }
  }

  async function handleGitHubSignIn() {
    setError("");
    setIsLoading(true);

    try {
      await signIn("github", {
        callbackUrl: `/${locale}/home`,
      });
    } catch (error) {
      console.error("GitHub sign-in error:", error);
      setError(t("githubSignInError"));
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 dark:from-gray-900 dark:via-gray-800 dark:to-gray-950">
      <div className="w-full max-w-md p-8 space-y-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl relative overflow-hidden">
        <div className="absolute -top-4 -left-4 w-16 h-16 bg-orange-500/20 rounded-full blur-md"></div>
        <div className="relative z-10">
          <div className="flex justify-end mb-6">
            <LanguageSwitcher />
          </div>
          <h1 className="text-4xl font-bold mb-8 text-center text-gray-800 dark:text-gray-100 animate-fade-in">
            {t("title")}
          </h1>

          <form onSubmit={handleSignUp} className="space-y-6">
            <div>
              <Label htmlFor="name" className="text-gray-700 dark:text-gray-300 font-medium">
                {t("nameLabel")}
              </Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder={t("namePlaceholder")}
                required
                disabled={isLoading}
                className="w-full mt-2 p-3 rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-gray-200 dark:placeholder-gray-400 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 transition-all duration-300"
              />
            </div>

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
              className="w-full py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-300 transform hover:scale-105 shadow-md disabled:opacity-50"
            >
              {isLoading ? t("registering") : t("registerButton")}
            </Button>

            <div className="text-center text-sm text-gray-600 dark:text-gray-400">
              {t("alreadyHaveAccount")}{" "}
              <Link
                href="/sign-in"
                className="font-medium text-orange-600 hover:text-orange-500 dark:text-orange-400 dark:hover:text-orange-300"
              >
                {t("signInLink")}
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}