import './globals.css';

export const metadata = {
  title: 'GPT5 Trello POC',
  description: 'Internal POC with AI integration',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full bg-slate-50">
      <body className="min-h-full text-slate-900 antialiased">
        <div className="flex flex-col min-h-screen">
          <header className="sticky top-0 z-20 border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
            <div className="mx-auto max-w-6xl px-4 py-3 flex items-center gap-3">
              <div className="size-6 rounded bg-brand-500" />
              <span className="font-semibold">GPT5 Boards</span>
            </div>
          </header>
          <main className="flex-1 mx-auto max-w-6xl w-full px-4 py-6">{children}</main>
        </div>
      </body>
    </html>
  );
}
