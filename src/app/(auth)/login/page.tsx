import React from 'react';

import LoginForm from '@/components/auth/login-form';

export default function LoginPage() {
  return (
    <div className="min-h-screen">
      <div className="flex min-h-screen">
        {/* Left side with image and overlay */}
        <div className="relative hidden bg-primary/50 lg:flex lg:w-1/2">
          <div className="absolute inset-0 bg-primary/50">
            <div className="flex h-full flex-col justify-center space-y-8 px-12 text-white"></div>
          </div>

          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                backgroundSize: '30px 30px',
              }}
            />
          </div>
        </div>

        {/* Right side with login form */}
        <div className="w-full lg:w-1/2">
          <div className="flex min-h-screen items-center justify-center p-8">
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
}
