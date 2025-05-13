'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function AuthError() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  const errorMessages: { [key: string]: string } = {
    default: 'An error occurred during authentication.',
    configuration: 'There is a problem with the server configuration.',
    accessdenied: 'You do not have permission to sign in.',
    verification: 'The verification link was invalid or has expired.',
    signin: 'Try signing in with a different account.',
    oauthsignin: 'Try signing in with a different account.',
    oauthcallback: 'Try signing in with a different account.',
    oauthcreateaccount: 'Try signing in with a different account.',
    emailcreateaccount: 'Try signing in with a different account.',
    callback: 'Try signing in with a different account.',
    oauthaccountnotlinked: 'To confirm your identity, sign in with the same account you used originally.',
    emailsignin: 'Check your email inbox.',
    credentialssignin: 'Sign in failed. Check the details you provided are correct.',
    sessionrequired: 'Please sign in to access this page.',
  };

  const errorMessage = error ? errorMessages[error.toLowerCase()] || errorMessages.default : errorMessages.default;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-gray-100">
            Authentication Error
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            {errorMessage}
          </p>
        </div>
        <div className="mt-8 space-y-6">
          <div className="flex items-center justify-center">
            <Link
              href="/sign-in"
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150 ease-in-out"
            >
              Return to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 