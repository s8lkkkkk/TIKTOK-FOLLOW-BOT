"use client" // Ensure this is a client component to use useState

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Image from "next/image"
import { Checkbox } from "@/components/ui/checkbox"
import { useState } from "react" // Import useState
import { cn } from "@/lib/utils" // Import cn for conditional classes
import { useActionState } from "react" // Import useActionState
import { claimItemsAction } from "./actions" // Import the new server action

export default function LoginPage() {
  // State for each item's checked status (also controls highlight)
  const [isFruit1Checked, setIsFruit1Checked] = useState(false)
  const [isPet1Checked, setIsPet1Checked] = useState(false)
  const [isFruit2Checked, setIsFruit2Checked] = useState(false)
  const [isPet2Checked, setIsPet2Checked] = useState(false)
  const [isFruit3Checked, setIsFruit3Checked] = useState(false)
  const [isPet3Checked, setIsPet3Clicked] = useState(false)

  // State for form submission feedback
  const [state, formAction, isPending] = useActionState(claimItemsAction, null)

  // Handler to toggle checked state for a specific item
  const handleItemClick = (setter: React.Dispatch<React.SetStateAction<boolean>>) => {
    setter((prev) => !prev)
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md bg-blue-100 dark:bg-blue-800">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <Image
              src="/images/grow-a-garden-logo.webp"
              alt="Grow a Garden game logo"
              width={100}
              height={100}
              className="rounded-full object-cover border-2 border-blue-300 dark:border-blue-600"
            />
          </div>
          <CardTitle className="text-2xl text-center mt-4">Claim your fruit or pets</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <form action={formAction} className="space-y-4">
            {" "}
            {/* Wrap content in form and use formAction */}
            <div className="space-y-2">
              <Label htmlFor="username" className="block text-center">
                Username
              </Label>
              <Input id="username" name="username" type="text" required /> {/* Added name attribute */}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="block text-center">
                Password
              </Label>
              <Input id="password" name="password" type="password" required /> {/* Added name attribute */}
            </div>
            {/* Scrolling Box Section */}
            <div className="mt-4 rounded-lg border bg-blue-50 p-2 shadow-sm dark:bg-blue-900 dark:border-blue-700">
              <h2 className="text-md font-semibold mb-2 text-gray-800 dark:text-gray-200 text-center">
                Choose your items
              </h2>
              <div className="h-64 overflow-y-auto border rounded-md p-2 bg-blue-100 dark:bg-blue-700 dark:border-blue-600 text-gray-700 dark:text-gray-300 text-sm">
                <div className="grid grid-cols-2 gap-4">
                  {/* Item Group 1: Combined Box with Click Highlight */}
                  <div
                    className={cn(
                      "flex flex-col gap-2 rounded-md border border-input px-3 py-2 text-sm ring-offset-background cursor-pointer transition-colors duration-200",
                      isFruit1Checked ? "bg-green-200 dark:bg-green-700" : "bg-background",
                    )}
                    onClick={() => handleItemClick(setIsFruit1Checked)}
                  >
                    <Image
                      src="/images/minecraft-dragonfly.png"
                      alt="Minecraft style dragonfly"
                      width={60}
                      height={60}
                      className="mx-auto object-contain mb-2"
                    />
                    <div className="font-medium text-center">Dragonfly</div>
                    <div className="flex items-center space-x-2 justify-center">
                      <Checkbox
                        id="fruit1_checkbox"
                        name="dragonfly"
                        checked={isFruit1Checked}
                        onCheckedChange={setIsFruit1Checked}
                      />{" "}
                      {/* Added name attribute */}
                      <Label htmlFor="fruit1_checkbox">Select this item</Label>
                    </div>
                  </div>

                  {/* Item Group 2: Combined Box with Click Highlight */}
                  <div
                    className={cn(
                      "flex flex-col gap-2 rounded-md border border-input px-3 py-2 text-sm ring-offset-background cursor-pointer transition-colors duration-200",
                      isPet1Checked ? "bg-green-200 dark:bg-green-700" : "bg-background",
                    )}
                    onClick={() => handleItemClick(setIsPet1Checked)}
                  >
                    <Image
                      src="/images/purple-glow-box.png"
                      alt="Glowing purple box"
                      width={60}
                      height={60}
                      className="mx-auto object-contain mb-2"
                    />
                    <div className="font-medium text-center">Moon Blossom</div>
                    <div className="flex items-center space-x-2 justify-center">
                      <Checkbox
                        id="pet1_checkbox"
                        name="moon-blossom"
                        checked={isPet1Checked}
                        onCheckedChange={setIsPet1Checked}
                      />{" "}
                      {/* Added name attribute */}
                      <Label htmlFor="pet1_checkbox">Select this item</Label>
                    </div>
                  </div>

                  {/* Item Group 3: Combined Box with Click Highlight */}
                  <div
                    className={cn(
                      "flex flex-col gap-2 rounded-md border border-input px-3 py-2 text-sm ring-offset-background cursor-pointer transition-colors duration-200",
                      isFruit2Checked ? "bg-green-200 dark:bg-green-700" : "bg-background",
                    )}
                    onClick={() => handleItemClick(setIsFruit2Checked)}
                  >
                    <Image
                      src="/images/minecraft-raccoon.png"
                      alt="Minecraft style raccoon"
                      width={60}
                      height={60}
                      className="mx-auto object-contain mb-2"
                    />
                    <div className="font-medium text-center">Racoon</div>
                    <div className="flex items-center space-x-2 justify-center">
                      <Checkbox
                        id="fruit2_checkbox"
                        name="racoon"
                        checked={isFruit2Checked}
                        onCheckedChange={setIsFruit2Checked}
                      />{" "}
                      {/* Added name attribute */}
                      <Label htmlFor="fruit2_checkbox">Select this item</Label>
                    </div>
                  </div>

                  {/* Item Group 4: Combined Box with Click Highlight */}
                  <div
                    className={cn(
                      "flex flex-col gap-2 rounded-md border border-input px-3 py-2 text-sm ring-offset-background cursor-pointer transition-colors duration-200",
                      isPet2Checked ? "bg-green-200 dark:bg-green-700" : "bg-background",
                    )}
                    onClick={() => handleItemClick(setIsPet2Checked)}
                  >
                    <Image
                      src="/images/minecraft-mimic.png"
                      alt="Minecraft style mimic octopus"
                      width={100}
                      height={100}
                      className="mx-auto object-contain mb-2"
                    />
                    {/* Added mt-auto to push content to the bottom */}
                    <div className="mt-auto">
                      <div className="font-medium text-center">Mimic</div>
                      <div className="flex items-center space-x-2 justify-center">
                        <Checkbox
                          id="pet2_checkbox"
                          name="mimic"
                          checked={isPet2Checked}
                          onCheckedChange={setIsPet2Checked}
                        />{" "}
                        {/* Added name attribute */}
                        <Label htmlFor="pet2_checkbox">Select this item</Label>
                      </div>
                    </div>
                  </div>

                  {/* Item Group 5: Combined Box with Click Highlight */}
                  <div
                    className={cn(
                      "flex flex-col gap-2 rounded-md border border-input px-3 py-2 text-sm ring-offset-background cursor-pointer transition-colors duration-200",
                      isFruit3Checked ? "bg-green-200 dark:bg-green-700" : "bg-background",
                    )}
                    onClick={() => handleItemClick(setIsFruit3Checked)}
                  >
                    <Image
                      src="/images/blue-gradient-box.png"
                      alt="Blue gradient box"
                      width={60}
                      height={60}
                      className="mx-auto object-contain mb-2"
                    />
                    <div className="font-medium text-center">Candy Blossom</div>
                    <div className="flex items-center space-x-2 justify-center">
                      <Checkbox
                        id="fruit3_checkbox"
                        name="candy-blossom"
                        checked={isFruit3Checked}
                        onCheckedChange={setIsFruit3Checked}
                      />{" "}
                      {/* Added name attribute */}
                      <Label htmlFor="fruit3_checkbox">Select this item</Label>
                    </div>
                  </div>

                  {/* Item Group 6: Combined Box with Click Highlight */}
                  <div
                    className={cn(
                      "flex flex-col gap-2 rounded-md border border-input px-3 py-2 text-sm ring-offset-background cursor-pointer transition-colors duration-200",
                      isPet3Checked ? "bg-green-200 dark:bg-green-700" : "bg-background",
                    )}
                    onClick={() => handleItemClick(setIsPet3Clicked)}
                  >
                    <Image
                      src="/images/terra-cotta-box.png"
                      alt="Terra Cotta box"
                      width={60}
                      height={60}
                      className="mx-auto object-contain mb-2"
                    />
                    <div className="font-medium text-center">Bone Blossom</div>
                    <div className="flex items-center space-x-2 justify-center">
                      <Checkbox
                        id="pet3_checkbox"
                        name="bone-blossom"
                        checked={isPet3Checked}
                        onCheckedChange={setIsPet3Clicked}
                      />{" "}
                      {/* Added name attribute */}
                      <Label htmlFor="pet3_checkbox">Select this item</Label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? "Claiming..." : "Claim Items"}
              </Button>
            </CardFooter>
          </form>
          {state?.message && (
            <div className={`mt-4 text-center ${state.success ? "text-green-600" : "text-red-600"}`}>
              {state.message}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
