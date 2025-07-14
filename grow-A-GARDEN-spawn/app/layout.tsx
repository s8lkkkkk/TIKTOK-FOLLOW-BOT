import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { Quicksand } from "next/font/google"
import { cn } from "@/lib/utils"

const quicksand = Quicksand({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
})

export const metadata: Metadata = {
  title: "v0 App",
  description: "Created with v0",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      {/* Removed bg-background class here */}
      <body className={cn(quicksand.className, "text-foreground")}>{children}</body>
    </html>
  )
}
