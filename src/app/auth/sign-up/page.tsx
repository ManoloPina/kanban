import Link from 'next/link';

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/app/_components/ui/card';
import SignInProvider from '@/app/_components/sign-in-provider';
import Logo from '@/app/_components/logo';
import { Button } from '@/app/_components/ui/button';
import { Separator } from '@/app/_components/ui/separator';
import SignUpForm from '@/app/_components/sign-up-form';

export default async function SignUp() {
  return (
    <div className="bg-background flex h-full min-h-screen w-full p-6">
      <div className="flex w-full items-center justify-center">
        <div className="flex w-full flex-col items-center gap-6">
          <Logo />
          <Card className="w-full max-w-md">
            <CardHeader className="flex w-full flex-col gap-4">
              <CardTitle className="w-full text-center">
                Create Account
              </CardTitle>
              <SignInProvider />
            </CardHeader>
            <CardContent>
              <div>
                <Separator className="mb-4" />
                <SignUpForm />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
              <Link href="/auth/sign-in">
                <Button variant="link" className="text-foreground">
                  Already have an account?
                  <span className="text-primary">Sing-in</span>
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
