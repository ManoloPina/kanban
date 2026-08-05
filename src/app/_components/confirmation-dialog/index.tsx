'use client';

import React from 'react';
import { cva } from 'class-variance-authority';
//Components
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTrigger,
  AlertDialogTitle,
  AlertDialogHeader,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/app/_components/ui/alert-dialog';

interface Props extends React.ComponentProps<typeof AlertDialog> {
  title?: string;
  description?: string;
  children?: React.ReactNode;
  type?: 'success' | 'error' | 'continue';
  confirmLabel?: React.ReactNode;
  cancelLabel?: React.ReactNode;
  loading?: boolean;
  onConfirm?: () => void;
}

const titleVariants = cva('text-lg font-bold', {
  variants: {
    type: {
      success: `text-success`,
      error: `text-destructive`,
      continue: `text-white`,
    },
  },
  defaultVariants: { type: 'continue' },
});

function ConfirmationDialog({
  children,
  title,
  description,
  type = 'continue',
  confirmLabel,
  cancelLabel,
  loading,
  onConfirm,
  ...props
}: Props) {
  return (
    <AlertDialog {...props}>
      {children && <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>}

      <AlertDialogContent>
        <AlertDialogHeader>
          {title && (
            <AlertDialogTitle className={titleVariants({ type })}>
              {title}
            </AlertDialogTitle>
          )}
          {description && (
            <AlertDialogDescription>{description}</AlertDialogDescription>
          )}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>
            {cancelLabel ?? 'Cancel'}
          </AlertDialogCancel>
          <AlertDialogAction
            disabled={loading}
            onClick={(e) => {
              e.preventDefault();
              onConfirm?.();
            }}
          >
            {confirmLabel ?? 'Confirm'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default React.memo(ConfirmationDialog);
