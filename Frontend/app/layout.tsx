import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "@/app/globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import Sidebar from "@/components/sidebar"
import Header from "@/components/header"
import BettingSlipProvider from "@/context/betting-slip-context"
import AuthProvider from "@/context/auth-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "FootballX - Live Football Betting",
  description: "Live football betting platform with real-time odds and matches.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
          <AuthProvider>
            <BettingSlipProvider>
              <div className="flex h-screen overflow-hidden">
                <Sidebar />
                <div className="flex flex-col flex-1 overflow-hidden">
                  <Header />
                  <div className="flex flex-1 overflow-hidden">
                    <main className="flex-1 overflow-y-auto bg-black">{children}</main>
                  </div>
                </div>
              </div>
            </BettingSlipProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

import './globals.css'