import TabBar from '@/components/tab-bar';

export default function TabLayOut({ children }: { children: React.ReactNode }) {
    return (
        <div>
            {children}
            <TabBar />
        </div>
    );
}
