'use client';

import React, { useState } from 'react';

import { cn } from '@/lib/utils';

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogHeader,
} from '@/app/_components/ui/dialog';
import { Checkbox } from '@/app/_components/ui/checkbox';

import { Label } from '@/app/_components/ui/label';
import { EllipsisVertical } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/app/_components/ui/dropdown-menu';
import EditTask from '@/app/_components/task-dialog/edit-task';
import ViewTask from '@/app/_components/task-dialog/view-task';

import { type ITask } from '@/model/board';

interface Props extends ITask {
  children: React.ReactNode;
  boardId: string;
}

function TaskDialog({ children, boardId, ...task }: Props) {
  return (
    <Dialog>
      <DialogTrigger className="text-left">{children}</DialogTrigger>
      <DialogContent className="bg-accent">
        <DialogHeader>
          <div className="flex w-full flex-row justify-between gap-2">
            <DialogTitle className="leading-[28px]">{task.title}</DialogTitle>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <EllipsisVertical className="h-5 w-auto" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="p-2">
                <DropdownMenuItem>Edit Task</DropdownMenuItem>
                <DropdownMenuItem className="text-red-500">
                  Delete Task
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          {task?.description && (
            <DialogDescription>{task?.description}</DialogDescription>
          )}
        </DialogHeader>

        <ViewTask boardId={boardId} {...task} />
      </DialogContent>
    </Dialog>
  );
}

export default React.memo(TaskDialog);
