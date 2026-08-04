'use client';
import { api } from '@/trpc/react';
import { useParams, useRouter } from 'next/navigation';
import { useQueryState } from 'nuqs';
import { toast } from 'sonner';

import { EllipsisVertical } from 'lucide-react';
import { Button } from '@/app/_components/ui/button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/app/_components/ui/dropdown-menu';
import TaskDialog from '@/app/_components/task-dialog';
import { Skeleton } from '@/app/_components/ui/skeleton';
import confirmationDialog from './confirmation-dialog';
//Types
import { ActionTypes } from '@/constants';
import ConfirmationDialog from './confirmation-dialog';
import { useState } from 'react';

export default function DashboardHeader({}) {
  const utils = api.useUtils();
  const params = useParams<{ id: string }>();
  const boardId: string = params.id;
  const router = useRouter();

  const [actionType, setActionType] = useQueryState('action-type');
  const [openBoardRemovel, setOpenBoardRemoval] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

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

        <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
          <DropdownMenuTrigger>
            <EllipsisVertical className="h-5 w-auto" />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="p-4">
            <DropdownMenuItem>Edit Board</DropdownMenuItem>
            <DropdownMenuItem
              onSelect={(e) => {
                e.preventDefault();
                setDropdownOpen(false);
                setOpenBoardRemoval(true);
              }}
              className="text-red-500"
            >
              Delete Board
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
