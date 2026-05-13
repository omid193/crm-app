// app/signup/page.tsx

import SignupForm from "@/components/SignupForm";


export default function SignupPage() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md p-6">
        <h1 className="text-2xl font-bold text-center mb-6">
          ساخت حساب کاربری
        </h1>
        <SignupForm />
      </div>
    </main>
  );
}
