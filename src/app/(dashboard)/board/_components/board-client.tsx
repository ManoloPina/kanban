'use client';
import { api } from '@/trpc/react';

import Column from '@/app/(dashboard)/board/_components/column';
import { LoaderCircle } from 'lucide-react';
import { NewColumnInput } from './new-column-input';

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
    <div className="flex h-fit w-fit flex-row gap-6">
      {board.columns.map((column) => (
        <Column key={column.id} {...column} boardId={id} />
      ))}
      <NewColumnInput boardId={board.id} />
    </div>
  );
}
