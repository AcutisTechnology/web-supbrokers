import { BrokerBottomNav } from '@/features/landing/broker-home/components/broker-bottom-nav';

export default async function CorretorLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ corretor: string }>;
}) {
  const { corretor } = await params;

  return (
    <>
      {/* Espaço para a bottom nav (apenas mobile/tablet). */}
      <div className="pb-[calc(env(safe-area-inset-bottom)+4.25rem)] lg:pb-0">
        {children}
      </div>
      <BrokerBottomNav slug={corretor} />
    </>
  );
}
