'use client';
import { api } from '@/trpc/react';
import { useParams } from 'next/navigation';

import { EllipsisVertical } from 'lucide-react';
import { Button } from '@/app/_components/ui/button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/app/_components/ui/dropdown-menu';

export default function DashboardHeader({}) {
  const params = useParams<{ id: string }>();
  const boardId: string = params.id;

  const { data: board } = api.board.getBoardById.useQuery(boardId, {
    enabled: !!boardId,
  });

  return (
    <div
      className="bg-sidebar border-b-sidebar-ring grid h-[92px] w-full
        grid-cols-[1fr_repeat(2,max-content)] items-center gap-4 border px-6"
    >
      <p className="font-jakarta text-xl font-bold">{board?.name}</p>

      <Button
        size="lg"
        className="font-jakarta rounded-full text-sm font-bold"
        disabled={!board}
      >
        +Add New Task
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger>
          <EllipsisVertical className="h-5 w-auto" />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="p-4">
          <DropdownMenuItem>Edit Board</DropdownMenuItem>
          <DropdownMenuItem className="text-red-500">
            Delete Board
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
