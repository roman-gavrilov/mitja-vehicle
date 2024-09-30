import Sidebar from '../components/dashboard/sidebar';

export default function DashboardLayout({ children }) {
  return (
    <div className="flex bg-gray-100">
      <Sidebar />
      <main className="flex-1 min-h-screen overflow-y-auto p-6">
        <div className="container max-w-[800px] mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}