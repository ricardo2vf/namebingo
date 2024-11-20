import BingoCard from '@/components/bingo-card';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-pink-50 p-4 md:p-8">
      <div className="mx-auto max-w-6xl">
        <BingoCard />
      </div>
    </main>
  );
}