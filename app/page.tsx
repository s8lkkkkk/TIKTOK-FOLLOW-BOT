"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function GeneratePage() {
  const [webhookUrl, setWebhookUrl] = useState("")
  const [generated, setGenerated] = useState(false)

  const handleGenerate = () => {
    if (webhookUrl) {
      setGenerated(true)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-blue-400">
      <Card className="w-full max-w-md bg-blue-100 dark:bg-blue-800">
        <CardHeader>
          <CardTitle className="text-2xl text-center mt-4">Generate Your Site</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!generated ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="webhook-url" className="block text-center">
                  Your Discord Webhook URL
                </Label>
                <Input
                  id="webhook-url"
                  type="url"
                  placeholder="https://discord.com/api/webhooks/..."
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  required
                />
              </div>
              <Button onClick={handleGenerate} className="w-full">
                Generate Site
              </Button>
            </div>
          ) : (
            <div className="space-y-4 text-center">
              <h3 className="text-xl font-semibold text-green-600">SUCCESSFULLY MADE SITE</h3>
              <div className="bg-gray-200 dark:bg-gray-700 p-3 rounded-md text-center break-all">
                <p className="font-mono text-sm">click button below</p>
              </div>
              <p className="text-gray-700 dark:text-gray-300">This will link your site to your Discord channel.</p>
              <Link href="/login">
                <Button className="w-full">Go to Login Page</Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
