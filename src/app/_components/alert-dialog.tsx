'use client';
import React from 'react';

import {
  AlertDialog as _AlertDialog,
  AlertDialogAction,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTrigger,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogTitle,
} from '@/app/_components/ui/alert-dialog';

interface Props extends React.ComponentProps<typeof _AlertDialog> {
  title: string;
  description: string;
  children?: React.ReactNode;
  asChild?: boolean;
  onCancel?: () => void;
  onContinue?: () => void;
  cancelLabel?: string;
  continueLabel?: string;
}

function AlertDialog({
  title,
  description,
  children,
  asChild,
  onCancel,
  cancelLabel = 'Cancel',
  onContinue,
  continueLabel = 'Continue',
  ...props
}: Props) {
  return (
    <_AlertDialog {...props}>
      {children && (
        <AlertDialogTrigger asChild={asChild}>{children}</AlertDialogTrigger>
      )}
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={() => {
              if (onCancel) onCancel();
            }}
          >
            {cancelLabel}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              if (onContinue) onContinue();
            }}
          >
            {continueLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </_AlertDialog>
  );
}

export default React.memo(AlertDialog);
