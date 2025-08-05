'use client';
import { useActionState, useEffect } from 'react';
import { registerUser } from '@/actions/auth';
import { toast } from 'sonner';
import { redirect } from 'next/navigation';

import { Label } from '@/app/_components/ui/label';
import { Input } from '@/app/_components/ui/input';
import { Button } from '@/app/_components/ui/button';
import { LoaderCircle } from 'lucide-react';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/app/_components/ui/alert';

import { type RegisterFormState } from '@/model/auth';
import { cn } from '@/lib/utils';

const initialState = { errors: {} as Record<string, string[]>, success: false };

export default function SignUpForm({}) {
  const [state, formAction, isPending] = useActionState<
    RegisterFormState,
    FormData
  >(registerUser, initialState);

  useEffect(() => {
    if (state.success) {
      toast.success('User has been registered', {
        description: 'Verify your email to procede',
        action: {
          label: 'Login',
          onClick: () => redirect('/auth/sign-in'),
        },
        position: 'top-center',
        duration: 4000,
      });
    }
  }, [state]);

  if (state.success) {
    return (
      <Alert variant="default">
        <AlertTitle>Email verification</AlertTitle>
        <AlertDescription>
          You need to verify your e-mail before login
        </AlertDescription>
      </Alert>
    );
  }
  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label
          className={cn(
            'font-semibold',
            state.errors.name && 'text-destructive',
          )}
        >
          Fullname
        </Label>
        <Input
          type="text"
          name="name"
          placeholder="Your Full Name"
          className={cn(!!state.errors.name && '!border-destructive')}
          aria-invalid={!!state.errors.name}
        />
        {state.errors.name && (
          <span className="text-xs text-red-500">{state.errors.name[0]}</span>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <Label
          className={cn(
            'font-semibold',
            !!state.errors.email && 'text-destructive',
          )}
        >
          Email
        </Label>
        <Input
          className={cn(!!state.errors.email && '!border-destructive')}
          type="email"
          name="email"
          placeholder="example@email.com"
          aria-invalid={!!state.errors.email}
        />
        {state.errors.email && (
          <span className="text-xs text-red-500">{state.errors.email[0]}</span>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <Label
          className={cn(
            'font-semibold',
            state.errors.password && 'text-destructive',
          )}
        >
          Password
        </Label>
        <Input
          placeholder="Password"
          type="password"
          name="password"
          aria-invalid={!!state.errors.password}
          className={cn(state.errors.password && '!border-destructive')}
        />
        {state.errors.password && (
          <span className="text-xs text-red-500">
            {state.errors.password[0]}
          </span>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <Label
          className={cn(
            'font-semibold',
            state.errors.confirm && 'text-destructive',
          )}
        >
          Confirm your password
        </Label>
        <Input
          placeholder="Password"
          type="password"
          name="confirm"
          aria-invalid={!!state.errors.password}
          className={cn(!!state.errors.confirm && '!border-destructive')}
        />
      </div>
      <Button type="submit" className="w-full">
        {isPending ? (
          <LoaderCircle className="animate-spin text-current" />
        ) : (
          'Sign-up'
        )}
      </Button>
    </form>
  );
}
