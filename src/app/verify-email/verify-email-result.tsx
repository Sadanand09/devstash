"use client";

import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { CheckCircle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export function VerifyEmailResult({
  status,
  message,
}: {
  status: "success" | "error";
  message: string;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Email Verification</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {status === "success" ? (
            <CheckCircle className="mx-auto h-10 w-10 text-green-500" />
          ) : (
            <XCircle className="mx-auto h-10 w-10 text-destructive" />
          )}
          <p className="text-center text-muted-foreground">{message}</p>
          <Link
            href="/sign-in"
            className={cn(buttonVariants({ variant: "default" }), "w-full")}
          >
            {status === "success" ? "Sign In" : "Back to Sign In"}
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
