import { api, HydrateClient } from '@/trpc/server';

import BoardClient from '@/app/_components/board-client';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function Board({ params }: Props) {
  const { id } = await params;
  await api.board.getBoardById.prefetch(id);

  return (
    <HydrateClient>
      <section className="h-full p-6">
        <BoardClient id={id} />
      </section>
    </HydrateClient>
  );
}
