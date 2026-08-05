'use client';
import { api } from '@/trpc/react';

import Column from '@/app/_components/column';
import { LoaderCircle } from 'lucide-react';

export default function BoardClient({ id }: { id: string }) {
  const {
    data: board,
    isLoading,
    isFetching,
  } = api.board.getBoardById.useQuery(id);

  if (isLoading || !board || isFetching) {
    return (
      <div className="flex h-full items-center justify-center">
        <LoaderCircle className="size-10 animate-spin" />
      </div>
    );
  }
  return (
    <div className="flex w-full flex-row gap-6">
      {board.columns.map((column) => (
        <Column key={column.id} {...column} boardId={id} />
      ))}
    </div>
  );
}
