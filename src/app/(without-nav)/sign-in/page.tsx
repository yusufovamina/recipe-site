import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { signIn } from "../../../../auth";

export default function SignInPage() {
  async function handleSignIn(formData: FormData) {
    "use server";

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    await signIn("credentials", {
      email,
      password,
      redirectTo: "/home",
    });
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 border rounded-lg shadow-md bg-white">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Log In</h1>
        <form action={handleSignIn} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" placeholder="Enter your email" required />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" placeholder="Enter your password" required />
          </div>
          <Button type="submit" className="w-full bg-black text-white hover:bg-gray-800">
            Log In
          </Button>
        </form>
        <form
          action={async () => {
            "use server";
            await signIn("google", { redirectTo: "/home" });
          }}
          className="mt-4 flex justify-center"
        >
          <Button type="submit" className="w-full max-w-xs bg-black text-white hover:bg-gray-800">
            Log In with Google
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-600">
          Don’t have an account?{" "}
          <Link href="/sign-up" className="text-blue-500 hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}