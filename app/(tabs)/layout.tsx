import TabBar from '@/components/tab-bar';
import Header from "@/components/user-header";

export default function TabLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
        <div className="relative min-h-screen pb-[64px]">
            {/* <Header /> */}
            <main className="w-full mx-auto max-w-screen-md">
                {children}
            <TabBar />
            </main>
        </div>
        </>
    );
}