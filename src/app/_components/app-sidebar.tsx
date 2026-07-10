'use client';
import React from 'react';
import { api } from '../../trpc/react';
import { useQueryState } from 'nuqs';
import { useBoardDialog } from '@/hooks';
//Components
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from '@/app/_components/ui/sidebar';
import { Table2 } from 'lucide-react';
import Logo from '@/app/_components/logo';
import BoardDialog from '@/app/_components/board-dialog';
import Link from 'next/link';

function AppSidebar() {
  const { openCreateBoardDialog, isOpen, closeBoardDialog } = useBoardDialog();
  const { data: boards } = api.board.getBoards.useQuery();

  return (
    <Sidebar className="border-r-sidebar-ring">
      <SidebarHeader className="p-8">
        <Logo className="h-auto w-[152]" />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup className="px-0">
          <div className="flex flex-col gap-5">
            <p className="font-jakarta pl-8 text-sm font-bold">
              All Boards ({boards?.length ?? 0})
            </p>
            <ul className="pr-6">
              {boards?.map((board) => (
                <li key={board.id}>
                  <Link
                    href={`/board/${board.id}`}
                    className="font-jakarta hover:bg-primary flex cursor-pointer
                      flex-row items-center gap-4 rounded-r-full py-3 pl-8
                      text-sm font-bold"
                  >
                    <Table2 size={16} /> {board.name}
                  </Link>
                </li>
              ))}
              <BoardDialog
                asChild
                open={isOpen}
                onOpenChange={(open) => {
                  if (open) {
                    void openCreateBoardDialog();
                  } else {
                    void closeBoardDialog();
                  }
                }}
              >
                <li
                  className="font-jakarta hover:bg-primary flex cursor-pointer
                    flex-row items-center gap-4 rounded-r-full py-3 pl-8 text-sm
                    font-bold"
                >
                  <Table2 size={16} />+ Create New Board
                </li>
              </BoardDialog>
            </ul>
          </div>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}

export default React.memo(AppSidebar);
