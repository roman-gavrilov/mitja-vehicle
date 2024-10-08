import Sidebar from '@/app/components/dashboard/sidebar';

export default async function DashboardLayout({ children }) {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const response = await fetch(`${baseUrl}/api/auth/user`, {
    cache: 'no-store', // Prevent caching if the user data changes frequently
  });

  const { fullName } = await response.json();

  return (
    <div className="flex flex-col md:flex-row bg-gray-100">
      <Sidebar fullname={fullName} />
      <main className="flex-1 min-h-screen overflow-y-auto p-4 md:p-6">
        <div className="container mx-auto max-w-full md:max-w-[800px] text-mainText">
          {children}
        </div>
      </main>
    </div>
  );
}