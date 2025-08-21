'use client';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from '@/app/_components/ui/sidebar';
import { Table2 } from 'lucide-react';
import Logo from '@/app/_components/logo';
import { api } from '../../trpc/react';

export default function AppSidebar() {
  const { data: boards, isLoading, isPending } = api.board.getBoards.useQuery();
  return (
    <Sidebar className="border-r-sidebar-ring">
      <SidebarHeader className="p-8">
        <Logo className="h-auto w-[152]" />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup className="px-0">
          <div className="flex flex-col gap-5">
            <p className="font-jakarta pl-8 text-sm font-bold">
              All Boards (0)
            </p>
            <ul className="pr-6">
              {boards?.map((board) => (
                <li
                  key={board.id}
                  className="font-jakarta hover:bg-primary flex cursor-pointer
                    flex-row items-center gap-4 rounded-r-full py-3 pl-8 text-sm
                    font-bold"
                >
                  <Table2 size={16} /> {board.name}
                </li>
              ))}
              <li
                className="font-jakarta hover:bg-primary flex flex-row
                  items-center gap-4 rounded-r-full py-3 pl-8 text-sm font-bold"
              >
                <Table2 size={16} />+ Create New Board
              </li>
            </ul>
          </div>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}
