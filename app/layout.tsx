import { Toaster } from 'react-hot-toast'
import Header from '@/app/_components/header'
import '@/app/globals.css'
import type { Metadata } from 'next'
import AuthProvider from '@/app/_components/auth_provider'
import { getServerSession } from "next-auth/next"
import { options } from '@/app/_libs/nextAuth_options'
import { GitHubIcon } from '@/app/_components/basic/icons'
// import { Inter } from 'next/font/google'

// const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    template: '%s | Packing App',
    default: 'Packing App',
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
        {/* <body className={`${inter.className} antialiased`}> */}
        <body>

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
                        <GitHubIcon className="h-5 w-5 fill-zinc-700 dark:fill-white" />
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
