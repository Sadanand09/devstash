import { verifyToken } from "@/lib/tokens";
import { VerifyEmailResult } from "./verify-email-result";

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  if (!token) {
    return (
      <VerifyEmailResult
        status="error"
        message="Missing verification token."
      />
    );
  }

  const result = await verifyToken(token);

  if (result.error) {
    return <VerifyEmailResult status="error" message={result.error} />;
  }

  return (
    <VerifyEmailResult
      status="success"
      message="Your email has been verified. You can now sign in."
    />
  );
}
