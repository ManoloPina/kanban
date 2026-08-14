'use client';
import { useState, useActionState } from 'react';
import { api } from '@/trpc/react';
import { useParams, useRouter } from 'next/navigation';
import { useQueryState } from 'nuqs';
import { toast } from 'sonner';
import { useBoardDialog } from '@/hooks';
//Components
import { EllipsisVertical, LogOut } from 'lucide-react';
import { Button } from '@/app/_components/ui/button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/app/_components/ui/dropdown-menu';
import TaskDialog from '@/app/_components/task-dialog';
import { Skeleton } from '@/app/_components/ui/skeleton';
import ConfirmationDialog from './confirmation-dialog';
//Types
import { ActionTypes } from '@/constants';

import { logoutAction } from '@/actions/auth';

export default function DashboardHeader({}) {
  const utils = api.useUtils();
  const params = useParams<{ id: string }>();
  const boardId: string = params.id;
  const router = useRouter();
  const { openEditBoardDialog } = useBoardDialog();

  const [actionType, setActionType] = useQueryState('action-type');
  const [openBoardRemovel, setOpenBoardRemoval] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [state, formAction, isLoggingOut] = useActionState(logoutAction, null);

  const { data: board, isFetching } = api.board.getBoardById.useQuery(boardId, {
    enabled: !!boardId,
  });

  const { mutate: deleteBoard, isPending: isPedingBoardDelete } =
    api.board.deleteBoard.useMutation({
      onSuccess: async () => {
        setOpenBoardRemoval(false);
        await Promise.all([
          utils.board.getBoards.invalidate(),
          utils.board.getBoardById.invalidate(boardId),
        ]);
        toast.success(`Board "${board?.name}" deleted`);
        router.push('/');
      },
      onError: (err) =>
        toast.error(err.message ?? 'Could not delete the board'),
    });

  const handleOpenDialog = async (open: boolean) =>
    setActionType(ActionTypes.Create);

  return (
    <>
      <div
        className="bg-sidebar border-b-sidebar-ring grid h-[92px] w-full
          grid-cols-[1fr_repeat(2,max-content)] items-center gap-4 border px-6"
      >
        {isFetching ? (
          <Skeleton className="bg-foreground/20 h-4 w-2/4 rounded-md" />
        ) : (
          <p className="font-jakarta text-xl font-bold">{board?.name}</p>
        )}

        <TaskDialog
          onOpenChange={handleOpenDialog}
          mode={actionType}
          boardId={boardId}
        >
          <Button
            size="lg"
            className="font-jakarta rounded-full text-sm font-bold"
            disabled={!board}
          >
            +Add New Task
          </Button>
        </TaskDialog>

        <DropdownMenu
          onOpenChange={(open) => {
            if (!isLoggingOut) setDropdownOpen(open);
          }}
          open={isLoggingOut ? true : dropdownOpen}
        >
          <DropdownMenuTrigger>
            <EllipsisVertical className="h-5 w-auto" />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="min-w-[200px] p-4">
            <DropdownMenuItem
              className="cursor-pointer hover:!text-white/80"
              onSelect={async (e) => {
                e.preventDefault();
                setDropdownOpen(false);
                await openEditBoardDialog(boardId);
              }}
            >
              Edit Board
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer hover:!text-white/80"
              onSelect={(e) => {
                e.preventDefault();
                setDropdownOpen(false);
                setOpenBoardRemoval(true);
              }}
            >
              Delete Board
            </DropdownMenuItem>
            <DropdownMenuItem asChild disabled={isLoggingOut}>
              <form action={formAction}>
                <button
                  type="submit"
                  disabled={isLoggingOut}
                  className="group flex w-full cursor-pointer items-center gap-2
                    hover:text-white/80"
                >
                  <LogOut
                    className="size-4 text-white group-hover:text-white/80"
                  />
                  {isLoggingOut ? 'Logging out...' : 'Logout'}
                </button>
              </form>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <ConfirmationDialog
        type="error"
        open={openBoardRemovel}
        title="Delete this board?"
        loading={isPedingBoardDelete}
        onOpenChange={setOpenBoardRemoval}
        onConfirm={() => deleteBoard(boardId)}
        description={`This action will permanently delete the "${
          board?.name ?? 'board'
        }" board and all of its columns and tasks. This action cannot be reversed.`}
      />
    </>
  );
}
