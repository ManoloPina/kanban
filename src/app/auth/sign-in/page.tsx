'use client';

import { redirect } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/app/_components/ui/card';
import { Button } from '@/app/_components/ui/button';
import { Separator } from '@/app/_components/ui/separator';
import { Input } from '@/app/_components/ui/input';
import ThemeSwitcher from '@/app/_components/theme-switcher';
import Logo from '@/app/_components/logo';
import SignInProvider from '@/app/_components/sign-in-provider';
import Link from 'next/link';
import {
  FormControl,
  FormItem,
  FormLabel,
  Form,
  FormField,
  FormMessage,
} from '@/app/_components/ui/form';

import { loginSchema, type LoginReq } from '@/model/auth';
import { toast } from 'sonner';

export default function SignIn() {
  const { data: session } = useSession();
  if (session?.user) redirect('/');
  const form = useForm<LoginReq>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: LoginReq) => {
    if (loginSchema.safeParse(values)) {
      const { email, password } = values;
      const res = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });
      console.log({ res });
      if (res?.error)
        toast.error('Invalid credentials', {
          position: 'top-center',
          description: res.error || 'Erro desconhecido',
        });

      if (res?.ok) redirect('/');
    }
  };

  return (
    <div className="bg-background flex h-full min-h-screen w-full p-6">
      <div className="flex w-full items-center justify-center">
        <div className="flex w-full flex-col items-center gap-6">
          <Logo />
          <Card className="w-full max-w-md">
            <CardHeader>
              <div className="flex flex-col items-center">
                <CardTitle className="text-2xl">Welcome Back</CardTitle>
                <span className="text-foreground">
                  Enter with your account to continue
                </span>
              </div>
              <SignInProvider />
            </CardHeader>
            <CardContent>
              <div>
                <Separator className="mb-4" />
                <Form {...form}>
                  <form
                    className="flex flex-col gap-4"
                    onSubmit={form.handleSubmit(onSubmit)}
                  >
                    <FormField
                      name="email"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="example@email.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      name="password"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="Password"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full">
                      Sign-in
                    </Button>
                  </form>
                </Form>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
              <Link href="/auth/sign-up">
                <Button variant="link" className="text-foreground">
                  Doesn&apos;t have an account yet?{' '}
                  <span className="text-primary">Sing-up</span>
                </Button>
              </Link>
              <ThemeSwitcher />
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
