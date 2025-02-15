import { Toaster } from 'react-hot-toast'
import Header from '@/app/_components/header'
import Footer from '@/app/_components/footer'
import '@/app/globals.css'
import type { Metadata } from 'next'
import AuthProvider from '@/app/_components/auth_provider'
import { getServerSession } from "next-auth/next"
import { options } from '@/app/_libs/nextAuth_options'
import { twMerge } from 'tailwind-merge'
import ThemeContextProvider from '@/app/_context/theme-context'
// import { Inter } from 'next/font/google'

// const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    template: '%s | Card Game',
    default: 'Title',
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
    <html lang="en" className={twMerge("scroll-smooth", typeof window !== "undefined" && localStorage.getItem("darkMode") === "true" ? "dark": "light")}>
      <ThemeContextProvider>
        <AuthProvider session={session}>
          {/* <body className={`${inter.className} antialiased`}> */}
          <body>

            <div className="w-full bg-white dark:bg-zinc-900">
              <div className="flex flex-col h-screen lg:ml-64 xl:ml-72">
                <header className="fixed top-0 z-20 lg:flex lg:fixed lg:inset-0 lg:w-64 xl:w-72">
                  <Header/>
                </header>

                <main className="z-0 block h-[calc(100dvh-56px-56px)] w-full my-[calc(56px+4px)] px-4 overflow-y-scroll sm:px-6 lg:px-8">
                  {children}
                </main>

                <footer className="fixed z-30 w-full h-14 bottom-0 lg:-ml-64 xl:-ml-72 bg-white dark:bg-zinc-900">
                  <Footer />
                </footer>
              </div>
              <Toaster position="bottom-right" />
            </div>

          </body>
        </AuthProvider>
      </ThemeContextProvider>
    </html>
  )
}
