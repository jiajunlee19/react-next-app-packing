import { Toaster } from 'react-hot-toast'
import Header from '@/app/_components/header'
import '@/app/globals.css'
import type { Metadata } from 'next'
import AuthProvider from '@/app/_components/auth_provider'
import { getServerSession } from "next-auth/next"
import { options } from '@/app/_libs/nextAuth_options'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    template: '%s | Template App',
    default: 'Template App',
  },
  description: 'Developed by jiajunlee',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

    const session = await getServerSession(options);
    // console.log(session?.user)

  return (
    <html lang="en" className={typeof window !== "undefined" && localStorage.getItem("darkMode") === "true" ? "dark": "light"}>
      <AuthProvider session={session}>
        <body className={`${inter.className} antialiased`}>

          <div className="w-full bg-white dark:bg-zinc-900">
            <div className="flex flex-col h-screen lg:ml-72 xl:ml-80">
              <header className="contents z-30 lg:flex lg:fixed lg:inset-0 lg:w-72 xl:w-80 lg:pointer-events-auto">
                <Header/>
              </header>

              <main className="block h-[calc(100vh-56px-56px)] w-full mt-14 mb-14 px-4 overflow-auto sm:px-6 lg:px-8">
                {children}
              </main>

              <footer className="fixed z-30 w-full h-14 bottom-0 lg:-ml-72 xl:-ml-80 bg-white dark:bg-zinc-900">
                <div className="flex flex-col h-14 items-center justify-between border-t border-zinc-900/50 dark:border-white/50 sm:flex-row sm:gap-2">
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 sm:m-4">© Copyright 2023. All rights reserved.</p>
                  <div className="flex gap-2 items-center sm:m-4">
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 whitespace-nowrap">Developed by jiajunlee</p>
                    <button className="hover:bg-zinc-900/50 dark:hover:bg-white/50">
                      <a href="https://github.com/jiajunlee19" target="_blank" rel="noopener noreferrer">
                        <span className="sr-only">Follow us on GitHub</span>
                        <svg viewBox="0 0 20 20" aria-hidden="true" className="h-5 w-5 fill-zinc-700 dark:fill-white">
                          <path fillRule="evenodd" clipRule="evenodd" d="M10 1.667c-4.605 0-8.334 3.823-8.334 8.544 0 3.78 2.385 6.974 5.698 8.106.417.075.573-.182.573-.406 0-.203-.011-.875-.011-1.592-2.093.397-2.635-.522-2.802-1.002-.094-.246-.5-1.005-.854-1.207-.291-.16-.708-.556-.01-.567.656-.01 1.124.62 1.281.876.75 1.292 1.948.93 2.427.705.073-.555.291-.93.531-1.143-1.854-.213-3.791-.95-3.791-4.218 0-.929.322-1.698.854-2.296-.083-.214-.375-1.09.083-2.265 0 0 .698-.224 2.292.876a7.576 7.576 0 0 1 2.083-.288c.709 0 1.417.096 2.084.288 1.593-1.11 2.291-.875 2.291-.875.459 1.174.167 2.05.084 2.263.53.599.854 1.357.854 2.297 0 3.278-1.948 4.005-3.802 4.219.302.266.563.78.563 1.58 0 1.143-.011 2.061-.011 2.35 0 .224.156.491.573.405a8.365 8.365 0 0 0 4.11-3.116 8.707 8.707 0 0 0 1.567-4.99c0-4.721-3.73-8.545-8.334-8.545Z"/>
                        </svg>
                      </a>
                    </button>
                  </div>
                </div>
              </footer>
            </div>
            <Toaster position="bottom-right" />
        </div>

        </body>
      </AuthProvider>
    </html>
  )
}
