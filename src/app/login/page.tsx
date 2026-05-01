import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/login-form";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Sign in",
  robots: { index: false, follow: false },
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  return (
    <main className="container flex min-h-[calc(100vh-4rem)] items-center justify-center py-16">
      <Card className="w-full max-w-md">
        <CardContent className="space-y-6 p-7">
          <div>
            <h1 className="font-display text-2xl font-bold tracking-tight">Sign in</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Magic link to your work email. Staff only — customers use the self-serve portal.
            </p>
          </div>
          <LoginForm redirectTo={next ?? "/admin"} />
        </CardContent>
      </Card>
    </main>
  );
}
