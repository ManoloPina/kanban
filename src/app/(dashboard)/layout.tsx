import { auth } from '@/server/auth';
import { redirect } from 'next/navigation';
import { SidebarProvider, SidebarTrigger } from '@/app/_components/ui/sidebar';
import AppSidebar from '@/app/_components/app-sidebar';
import DashboardHeader from '../_components/dashboard-header';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect('/auth/sign-in');
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="bg-background w-full">
        <DashboardHeader />
        {children}
        <SidebarTrigger className="absolute bottom-2 ml-2" />
      </main>
    </SidebarProvider>
  );
}
