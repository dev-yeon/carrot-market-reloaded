import TabBar from '@/components/tab-bar';

export default function TabLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="relative min-h-screen pb-[64px]">
            <main className="w-full mx-auto max-w-screen-md">
                {children}
            </main>
            <TabBar />
        </div>
    );
}