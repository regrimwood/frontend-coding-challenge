export default function Main({ children }: { children: React.ReactNode }) {
  return (
    <main className="w-full min-h-screen pt-36 md:pt-64 pb-16 md:pb-36 px-5 md:px-10 bg-black bg-gradient-to-br from-neonBlue from-10% via-violet via-30% to-black to-50%">
      {children}
    </main>
  );
}
