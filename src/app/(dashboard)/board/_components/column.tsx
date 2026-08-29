'use client';
import { useEffect, useState } from 'react';
import { getRandomColor } from '@/lib/utils';
import { useQueryState } from 'nuqs';

import Task from '@/app/(dashboard)/board/_components/task';
import TaskDialog from '@/app/_components/task-dialog';

import type { IColumn } from '@/model/board';
import { ActionTypes } from '@/constants';
import { Button } from '@/app/_components/ui/button';
import { Trash2 } from 'lucide-react';
import ConfirmationDialog from '@/app/_components/confirmation-dialog';
import { api } from '@/trpc/react';
import { toast } from 'sonner';

type Props = IColumn;

export default function Column({ name = '', tasks, boardId, id }: Props) {
  const utils = api.useUtils();
  const [openDeleteColumnDialog, setOpenDeleteDialog] = useState(false);
  const { mutate: deleteColumn, isPending: isDeletingColumn } =
    api.column.deleteColumn.useMutation({
      onSuccess: async (column) => {
        toast.info(`Board ${column?.name} was removed with success`);
        await utils.board.getBoardById.invalidate(boardId);
        setOpenDeleteDialog(false);
      },
      onError: (err) => {
        toast.error(
          `Was not possible to remove this column: ${err?.message || 'Unknown error'}`,
        );
      },
    });

  const [taskId, setTaskid] = useQueryState('task-id');
  const [actionType, setActionType] = useQueryState('action-type');
  const [color, setColor] = useState('');

  useEffect(() => {
    setColor(getRandomColor());
  }, []);

  return (
    <div className="flex w-70 flex-col gap-6">
      <div className="group flex min-h-10 w-full flex-row items-center gap-3">
        <div
          className="bg-muted-foreground size-4 rounded-full"
          style={{ backgroundColor: color }}
        />
        <p className="text-muted-foreground text-xs font-bold">{name}</p>
        <ConfirmationDialog
          open={openDeleteColumnDialog}
          onOpenChange={setOpenDeleteDialog}
          title="Delete Column"
          loading={isDeletingColumn}
          onConfirm={() => deleteColumn({ id })}
          description="Do you want to remove this column?"
        >
          <Button
            variant="ghost"
            className="ml-auto hidden cursor-pointer group-hover:flex"
          >
            <Trash2 />
          </Button>
        </ConfirmationDialog>
      </div>
      <ul className="flex flex-col gap-5">
        {tasks.map((task) => (
          <TaskDialog
            mode={actionType}
            setMode={setActionType}
            onOpenChange={async (open) => {
              if (open && task) {
                await setTaskid(task.id);
                await setActionType(`${ActionTypes.View}`);
              }
              if (!open) {
                await setTaskid(null);
                await setActionType(null);
              }
            }}
            task={task}
            key={task.id}
            boardId={boardId}
            {...task}
          >
            <Task task={task} />
          </TaskDialog>
        ))}
      </ul>
    </div>
  );
}
