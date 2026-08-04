import { auth } from '@/server/auth';
import { api, HydrateClient } from '@/trpc/server';
import { redirect } from 'next/navigation';
import { Button } from '@/app/_components/ui/button';

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
        className="bg-background flex h-[calc(100vh-92px)] flex-row items-center
          justify-center p-6"
      >
        <div className="flex max-w-xl flex-col items-center gap-8">
          <p className="text-muted-foreground text-center text-xl font-bold">
            There are no boards created.
          </p>
          <Button size="lg" className="w-fit rounded-full">
            + Add New Column
          </Button>
        </div>
      </main>
    </HydrateClient>
  );
}
