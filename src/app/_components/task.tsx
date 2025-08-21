'use client';

import { memo } from 'react';
import { Card, CardHeader, CardTitle } from '@/app/_components/ui/card';

import type { ITask } from '@/model/board';

type Props = ITask;

function Task({ title, subtasks }: Props) {
  return (
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
  );
}

export default memo(Task);
