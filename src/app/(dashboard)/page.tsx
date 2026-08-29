import { auth } from '@/server/auth';
import { api, HydrateClient } from '@/trpc/server';
import { redirect } from 'next/navigation';
import { BoardDialogTrigger } from '@/app/_components/board-dialog/board-dialog-trigger';
import { ActionTypes } from '@/constants';
import { Plus } from 'lucide-react';

export default async function Home() {
  const session = await auth();

  if (!session?.user) redirect('/auth/sign-in');

  await api.board.getBoards.prefetch();

  const boards = await api.board.getBoards();

  if (!boards || boards.length === 0) {
    await api.board.createDemo();
  } else {
    redirect(`/board/${boards[0]?.id}`);
  }

  return (
    <HydrateClient>
      <main
        className="bg-background flex h-full flex-row items-center
          justify-center p-6"
      >
        <div className="flex max-w-xl flex-col items-center gap-8">
          <p className="text-muted-foreground text-center text-xl font-bold">
            There are no boards created.
          </p>
          <BoardDialogTrigger
            mode={ActionTypes.Create}
            size="lg"
            className="w-fit rounded-full"
          >
            <Plus /> Create New Board
          </BoardDialogTrigger>
        </div>
      </main>
    </HydrateClient>
  );
}
