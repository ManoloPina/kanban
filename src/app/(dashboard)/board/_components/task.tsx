'use client';

import { memo, forwardRef } from 'react';
import { Card, CardHeader, CardTitle } from '@/app/_components/ui/card';

import type { ITask } from '@/model/board';

type Props = {
  task: ITask;
} & React.ComponentPropsWithoutRef<'button'>;

function Task({ task, ...props }: Props, ref: React.Ref<HTMLButtonElement>) {
  const { title, subtasks } = task;
  return (
    <button ref={ref} type="button" className="w-full text-left" {...props}>
      <Card
        className="bg-accent cursor-pointer rounded-lg
          shadow-[0px_4px_6px_2px_rgba(54,78,126,0.1015)]"
      >
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          {subtasks.length > 0 && (
            <p className="text-muted-foreground text-xs font-bold">
              {subtasks.filter((subtask) => !!subtask.done)?.length} of{' '}
              {subtasks.length}
            </p>
          )}
        </CardHeader>
      </Card>
    </button>
  );
}

export default memo(forwardRef(Task));
