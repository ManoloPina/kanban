'use client';
import React, { useState } from 'react';
import { useQueryState } from 'nuqs';
import { api } from '@/trpc/react';
import { toast } from 'sonner';

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogHeader,
} from '@/app/_components/ui/dialog';
import { EllipsisVertical } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/app/_components/ui/dropdown-menu';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import ViewTask from '@/app/_components/task-dialog/view-task';
import TaskForm from '@/app/_components/task-dialog/task-form';
import AlertDialog from '@/app/_components/alert-dialog';
import ViewTaskPlaceholder from '@/app/_components/placeholder/view-task-placeholder';

import { type ITask } from '@/model/board';

import { ActionTypes } from '@/constants';

interface Props extends React.ComponentProps<typeof Dialog> {
  children: React.ReactNode;
  boardId: string;
  task?: ITask;
  mode: string | null;
  setMode?: (type: ActionTypes) => Promise<URLSearchParams>;
}

function TaskDialog({
  children,
  boardId,
  task,
  mode,
  setMode,
  ...dialogProps
}: Props) {
  const utils = api.useUtils();
  const { mutate: deleteTask } = api.task.deleteTask.useMutation({
    onSuccess: async (data) => {
      await utils.board.getBoardById.invalidate(boardId);
      toast.success(`The task "${data.task?.title}" was deleted with success.`);
    },
  });

  const [taskId] = useQueryState('task-id');
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const handleDeleteTask = () => {
    if (task) deleteTask(task.id);
  };

  return (
    <>
      <Dialog
        onOpenChange={(open) => {
          if (dialogProps?.onOpenChange) {
            dialogProps.onOpenChange(open);
          }
        }}
        defaultOpen={taskId === task?.id}
      >
        <DialogTrigger asChild className="text-left">
          {children}
        </DialogTrigger>
        <DialogContent
          className="bg-accent min-h-[200px]"
          showCloseButton={false}
        >
          <DialogHeader>
            <div
              className="grid grid-cols-[1fr_min-content] justify-between gap-2"
            >
              {!!(
                mode === `${ActionTypes.Create}` ||
                mode === `${ActionTypes.Edit}`
              ) ? (
                <DialogTitle className="col-start-1 col-end-2 leading-[28px]">
                  {mode === `${ActionTypes.Create}`
                    ? 'Create Task'
                    : 'Edit Task'}
                </DialogTitle>
              ) : (
                <DialogTitle
                  asChild
                  className="col-start-1 col-end-2 leading-[28px]"
                >
                  <VisuallyHidden>Task Dialog</VisuallyHidden>
                </DialogTitle>
              )}
              {task?.title && (
                <span className="col-start-1 col-end-2">{task?.title}</span>
              )}

              <DropdownMenu>
                <DropdownMenuTrigger className="col-start-2 col-end-2">
                  <EllipsisVertical className="h-5 w-auto" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="p-2">
                  <DropdownMenuItem
                    onClick={async () => {
                      if (mode === `${ActionTypes.View}` && setMode) {
                        await setMode(ActionTypes.Edit);
                      } else {
                        if (setMode) await setMode(ActionTypes.View);
                      }
                    }}
                  >
                    {mode === `${ActionTypes.View}` ? 'Edit Task' : 'View Task'}
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    className="text-red-500"
                    onClick={() => setOpenDeleteDialog((open) => !open)}
                  >
                    Delete Task
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            {task?.description && (
              <DialogDescription>{task?.description}</DialogDescription>
            )}
          </DialogHeader>

          {mode === `${ActionTypes.View}` && task && (
            <ViewTask boardId={boardId} {...task} />
          )}
          {!!(
            mode === `${ActionTypes.Edit}` || mode === `${ActionTypes.Create}`
          ) && <TaskForm mode={mode} boardId={boardId} task={task} />}
        </DialogContent>
      </Dialog>
      <AlertDialog
        title="Delete Task"
        open={openDeleteDialog}
        onContinue={handleDeleteTask}
        onOpenChange={(open) => setOpenDeleteDialog(open)}
        description="Are you sure to delete this task permanetily"
      />
    </>
  );
}

export default React.memo(TaskDialog);
