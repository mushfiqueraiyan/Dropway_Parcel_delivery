import AdminSidebar from "./admin-sidebar";

export default function AdminDashboardLayout({
  children,
}: LayoutProps<"/admin-dashboard">) {
  return (
    <div className="flex-1 bg-paper-2">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-5 py-8 sm:px-8 md:flex-row md:items-start">
        <AdminSidebar />
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}
