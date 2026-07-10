'use client';
import { useEffect, useState } from 'react';
import { getRandomColor } from '@/lib/utils';
import { useQueryState } from 'nuqs';

import Task from '@/app/_components/task';
import TaskDialog from '@/app/_components/task-dialog';

import type { IColumn } from '@/model/board';
import { ActionTypes } from '@/constants';

type Props = IColumn;

export default function Column({ name = '', tasks, boardId }: Props) {
  const [taskId, setTaskid] = useQueryState('task-id');
  const [actionType, setActionType] = useQueryState('action-type');
  const [color, setColor] = useState('');

  useEffect(() => {
    setColor(getRandomColor());
  }, []);

  return (
    <div className="flex w-[280px] flex-col gap-6">
      <div className="flex flex-row gap-3">
        <div
          className="bg-muted-foreground size-4 rounded-full"
          style={{ backgroundColor: color }}
        />
        <p className="text-muted-foreground text-xs font-bold">{name}</p>
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
