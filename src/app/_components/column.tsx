'use client';
import { getRandomColor } from '@/lib/utils';

import Task from '@/app/_components/task';
import TaskDialog from '@/app/_components/task-dialog';

import type { IColumn } from '@/model/board';

type Props = IColumn;

export default function Column({ name = '', tasks, boardId }: Props) {
  return (
    <div className="flex w-[280px] flex-col gap-6">
      <div className="flex flex-row gap-3">
        <div
          className="bg-muted-foreground size-4 rounded-full"
          style={{ backgroundColor: getRandomColor() }}
        />
        <p className="text-muted-foreground text-xs font-bold">{name}</p>
      </div>
      <ul className="flex flex-col gap-5">
        {tasks.map((task) => (
          <TaskDialog key={task.id} boardId={boardId} {...task}>
            <Task {...task} />
          </TaskDialog>
        ))}
      </ul>
    </div>
  );
}
