'use client';
import React from 'react';
import { api } from '@/trpc/react';
import { useBoardDialog } from '@/hooks';
//Components
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/app/_components/ui/dialog';
import ViewTaskPlaceholder from '@/app/_components/placeholder/view-task-placeholder';
import BoardForm from '@/app/_components/board-dialog/board-form';
//Types
import { ActionTypes } from '@/constants';

interface Props extends React.ComponentProps<typeof Dialog> {
  asChild?: boolean;
  children?: React.ReactNode;
}

function BoardDialog({ children, asChild, ...dialogProps }: Props) {
  const { mode, boardId, isOpen, closeBoardDialog } = useBoardDialog();
  const isControlled = !children;
  const open = isControlled ? isOpen : dialogProps.open;
  const onOpenChnage = isControlled
    ? (open: boolean) => {
        if (!open) void closeBoardDialog();
      }
    : dialogProps.onOpenChange;

  const { data: board, isLoading } = (() =>
    api.board.getBoardById.useQuery(boardId, {
      enabled: !!boardId,
    }))();

  return (
    <Dialog {...dialogProps} open={open} onOpenChange={onOpenChnage}>
      {children && <DialogTrigger asChild={asChild}>{children}</DialogTrigger>}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {mode === `${ActionTypes.Create}` ? 'Add new Board' : 'Edit Board'}
          </DialogTitle>
        </DialogHeader>
        {isLoading ? <ViewTaskPlaceholder /> : <BoardForm board={board} />}
      </DialogContent>
    </Dialog>
  );
}

export default React.memo(BoardDialog);
