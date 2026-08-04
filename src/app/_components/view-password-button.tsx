'use client';

import { Eye, EyeClosed } from 'lucide-react';
import { Button } from '@/app/_components/ui/button';
import { cn } from '@/lib/utils';

interface Props {
  className?: string;
  onChange: (e?: React.MouseEvent<HTMLButtonElement>) => void;
  showPassword: boolean;
}

export default function ViewPasswordButton({
  onChange,
  showPassword,
  className = '',
}: Props) {
  return (
    <Button
      className={cn('size-8 rounded-full !p-0 hover:bg-transparent', className)}
      variant="ghost"
      onClick={onChange}
    >
      {showPassword ? (
        <Eye className="text-current" />
      ) : (
        <EyeClosed className="text-current" />
      )}
    </Button>
  );
}
