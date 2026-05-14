import SigninForm from "@/components/SigninForm";

export default function signinPage() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md p-6">
        <h1>login</h1>
        <SigninForm />
      </div>
    </main>
  );
}
