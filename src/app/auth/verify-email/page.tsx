'use client';

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

export default function VerifyEmail() {
  const {
    mutate: verifyEmail,
    isSuccess,
    isPending,
  } = api.auth.verifyEmail.useMutation();
  const searchParams = useSearchParams();

  const handleVerifyEmail = () => {
    const token = searchParams.get('token');
    if (token) verifyEmail({ token });
  };

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

                {isPending ? (
                  <LoaderCircle className="animate-spin" size={32} />
                ) : (
                  <>
                    {isSuccess ? (
                      <Alert>
                        <AlertTitle>Email verified successfully!</AlertTitle>
                        <AlertDescription>
                          Your email has been verified. You can now sign in to
                          your account.
                        </AlertDescription>
                      </Alert>
                    ) : (
                      <p className="text-muted-foreground mb-4 text-center">
                        To complete your registration, please confirm your email
                        address. You must verify your email before you can sign
                        in.
                      </p>
                    )}
                  </>
                )}

                <Button
                  size="lg"
                  className="w-full"
                  onClick={handleVerifyEmail}
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
