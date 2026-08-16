'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { api } from '@/trpc/react';
import { toast } from 'sonner';
import { useSearchParams } from 'next/navigation';

import Logo from '@/app/_components/logo';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '@/app/_components/ui/card';
import { Separator } from '@/app/_components/ui/separator';
import { Button } from '@/app/_components/ui/button';
import { LoaderCircle } from 'lucide-react';

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/app/_components/ui/alert';

const startedTokens = new Set<string>();

export default function VerifyEmail() {
  const searchParams = useSearchParams();
  const token = useMemo(() => searchParams.get('token'), [searchParams]);
  const verifyEmailMutation = api.auth.verifyEmail.useMutation({
    onSuccess: () => {
      toast.success('Email successfully verified');
    },
    onError: (err) => {
      toast.error(err.message ?? 'Was not possible to verify this e-mail');
    },
  });

  const { isPending: isVerifying, isSuccess, isError } = verifyEmailMutation;

  useEffect(() => {
    if (!token) return;
    if (startedTokens.has(token)) return;
    startedTokens.add(token);
    verifyEmailMutation.mutate(
      { token },
      {
        onError: () => {
          startedTokens.delete(token);
        },
      },
    );
  }, [token]);

  return (
    <div className="bg-background flex h-full min-h-screen w-full p-6">
      <div className="flex w-full items-center justify-center">
        <div className="flex w-full flex-col items-center gap-6">
          <Logo />
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Verify e-mail account</CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <Separator className="mb-4" />

                {isVerifying ? (
                  <div className="flex justify-center py-4">
                    <LoaderCircle className="animate-spin" size={32} />
                  </div>
                ) : isSuccess ? (
                  <Alert>
                    <AlertTitle>Email verified successfully!</AlertTitle>
                    <AlertDescription>
                      Your email has been verified. You can now sign in.
                    </AlertDescription>
                  </Alert>
                ) : isError ? (
                  <Alert variant="destructive">
                    <AlertTitle>Verification failed</AlertTitle>
                    <AlertDescription>
                      {verifyEmailMutation.error?.message}
                    </AlertDescription>
                  </Alert>
                ) : (
                  <p className="text-muted-foreground mb-4 text-center">
                    Validating your verification link...
                  </p>
                )}

                <Button
                  size="lg"
                  className="mt-4 w-full"
                  disabled={!token || isVerifying || isSuccess}
                  onClick={() => token && verifyEmailMutation.mutate({ token })}
                >
                  Confirm email address
                </Button>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
              <Link href="/auth/sign-in">
                <Button variant="link" className="text-foreground">
                  Go to Sign-in
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
