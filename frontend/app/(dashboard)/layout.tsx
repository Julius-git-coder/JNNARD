import { Sidebar } from './_components/sidebar';
import { Header } from './_components/header';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <Sidebar />
            <div className="md:pl-64 flex flex-col min-h-screen transition-all duration-300 ease-in-out">
                <Header />
                <main className="flex-1 p-6 lg:p-8 space-y-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
