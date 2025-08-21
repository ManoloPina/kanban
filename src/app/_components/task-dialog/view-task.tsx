import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { api } from '@/trpc/react';
import { toast } from 'sonner';

import { Label } from '@/app/_components/ui/label';
import { Checkbox } from '@/app/_components/ui/checkbox';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectGroup,
  SelectValue,
  SelectItem,
} from '@/app/_components/ui/select';

import type { ITask } from '@/model/board';
import { type subtasks } from '@/server/db/schema';

interface Props extends ITask {
  boardId: string;
}

function ViewTask({ boardId, ...task }: Props) {
  const utils = api.useUtils();

  const { data: columns } = api.column.getColumnsByBoardId.useQuery(boardId);

  const { mutate: updateSubtask, isPending: isPendingSubtaskUpdate } =
    api.subtask.updateSubtask.useMutation({
      onSuccess: async (data) => {
        toast(`Subtask updated`, {
          description: `The subtask "${data.subtask?.title}" was updated to ${data.subtask?.done ? 'Done' : 'Undone'}`,
        });
        await utils.board.getBoardById.invalidate(boardId);
      },
    });

  const { mutate: updateTask, isPending: isPendingUpdateTask } =
    api.task.updateTask.useMutation({
      onSuccess: async (data) => {
        toast.success(`Task updated`, {
          description: `The status of task: "${data.task?.title}" was changed.`,
        });
        await utils.board.getBoardById.invalidate(boardId);
      },
    });

  const [selectedColumn, setSelectedColumn] = useState(task.columnId);

  const handleCheckChange = (
    subtask: typeof subtasks.$inferSelect,
    checked: boolean,
  ) => {
    updateSubtask({ ...subtask, done: checked });
  };

  const handleColumnChange = (columnId: string) => {
    setSelectedColumn(columnId);
    updateTask({ ...task, columnId });
  };

  return (
    <div className="flex flex-col gap-6">
      {task?.subtasks && task.subtasks.length > 0 && (
        <ul className="flex flex-col gap-2">
          {task.subtasks.map((subtask) => (
            <li key={subtask.id}>
              <Label
                className={cn(
                  `font-jakarta bg-background text-muted-foreground
                  hover:bg-primary/20 flex cursor-pointer flex-row items-center
                  gap-4 rounded-sm p-3 text-xs font-bold hover:text-white`,
                  isPendingSubtaskUpdate && 'opacity-[0.5]',
                )}
              >
                <Checkbox
                  disabled={isPendingSubtaskUpdate}
                  onCheckedChange={(checked) =>
                    handleCheckChange(subtask, !!checked)
                  }
                  checked={!!subtask.done}
                />
                <span className={cn(!!subtask.done && 'line-through')}>
                  {subtask.title}
                </span>
              </Label>
            </li>
          ))}
        </ul>
      )}
      <div className="flex flex-col gap-2">
        <h3 className="text-sm">Current Status</h3>
        <Select
          value={selectedColumn}
          disabled={isPendingUpdateTask}
          onValueChange={handleColumnChange}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {columns?.map((column) => (
                <SelectItem key={column.id} value={column.id}>
                  {column.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

export default React.memo(ViewTask);
