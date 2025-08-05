'use client';
import { memo } from 'react';
import { signIn } from 'next-auth/react';

import { Button } from './ui/button';
import Image from 'next/image';

function SignInProvider() {
  return (
    <div className="flex flex-col gap-4">
      <Button
        size="lg"
        variant="outline"
        onClick={() => signIn('github', { callbackUrl: '/' })}
      >
        <Image
          width={18}
          height={18}
          alt="Github Sign-in"
          src="/github-icon.svg"
        />
        Sign-in with Github
      </Button>
    </div>
  );
}

export default memo(SignInProvider);
