"use client" // Ensure this is a client component to use useState
import { Button } from "@/components/ui/button"
import type React from "react"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Image from "next/image"
import { Checkbox } from "@/components/ui/checkbox"
import { useState, useEffect, useRef } from "react" // Import useState, useEffect, useRef
import { useActionState } from "react" // Import useActionState
import { cn } from "@/lib/utils" // Import cn for conditional classes
import { claimItemsAction } from "./actions" // Import the new server action

export default function LoginPage() {
  // State for each item's checked status (also controls highlight)
  const [isFruit1Checked, setIsFruit1Checked] = useState(false)
  const [isPet1Checked, setIsPet1Checked] = useState(false)
  const [isFruit2Checked, setIsFruit2Checked] = useState(false)
  const [isPet2Checked, setIsPet2Checked] = useState(false)
  const [isFruit3Checked, setIsFruit3Checked] = useState(false)
  const [isPet3Checked, setIsPet3Clicked] = useState(false)

  // Form submission state using useActionState
  const [formState, formAction, isPending] = useActionState(claimItemsAction, null)

  // State to control what content is displayed (form, loading, success, error)
  const [displayPhase, setDisplayPhase] = useState<"form" | "server-pending" | "client-loading" | "success" | "error">(
    "form",
  )
  // State for the progress bar
  const [progress, setProgress] = useState(0)

  // Refs for managing client-side timers
  const clientLoadingTimerRef = useRef<NodeJS.Timeout | null>(null)
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const errorTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Total client-side loading time (18 seconds to make total 20s with 2s server delay)
  const TOTAL_CLIENT_LOADING_TIME_MS = 18000

  // Cleanup timers on component unmount
  useEffect(() => {
    return () => {
      if (errorTimeoutRef.current) clearTimeout(errorTimeoutRef.current)
      if (clientLoadingTimerRef.current) clearTimeout(clientLoadingTimerRef.current)
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current)
    }
  }, [])

  // Effect to manage display phases based on server action state
  useEffect(() => {
    // Clear all timers when dependencies change to prevent stale timers
    if (errorTimeoutRef.current) clearTimeout(errorTimeoutRef.current)
    if (clientLoadingTimerRef.current) clearTimeout(clientLoadingTimerRef.current)
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current)

    if (isPending) {
      if (displayPhase !== "server-pending") {
        // Only update if different
        setDisplayPhase("server-pending")
        setProgress(0)
      }
    } else if (formState) {
      if (formState.success) {
        // Only transition to client-loading if not already in client-loading or success
        if (displayPhase !== "client-loading" && displayPhase !== "success") {
          setDisplayPhase("client-loading")
          setProgress(0)

          const intervalStep = TOTAL_CLIENT_LOADING_TIME_MS / 100
          progressIntervalRef.current = setInterval(() => {
            setProgress((prev) => {
              const next = prev + 1
              if (next >= 100) {
                if (progressIntervalRef.current) clearInterval(progressIntervalRef.current)
                return 100
              }
              return next
            })
          }, intervalStep)

          clientLoadingTimerRef.current = setTimeout(() => {
            // This is async, but adding a guard here too for robustness
            if (displayPhase !== "success") {
              setDisplayPhase("success")
              if (progressIntervalRef.current) clearInterval(progressIntervalRef.current)
              setProgress(100)
            }
          }, TOTAL_CLIENT_LOADING_TIME_MS)
        }
      } else {
        // formState.success is false (error)
        if (displayPhase !== "error") {
          // Only update if different
          setDisplayPhase("error")
          // Set timeout to revert to form after 3 seconds
          errorTimeoutRef.current = setTimeout(() => {
            // This is async, but adding a guard here too for robustness
            if (displayPhase !== "form") {
              setDisplayPhase("form")
            }
          }, 3000)
        }
      }
    } else {
      // If not pending and no formState (initial load or after error timeout)
      if (displayPhase !== "form") {
        setDisplayPhase("form")
      }
    }
  }, [isPending, formState, displayPhase]) // Added displayPhase to dependencies

  // Handler to toggle checked state for a specific item
  const handleItemClick = (setter: React.Dispatch<React.SetStateAction<boolean>>) => {
    setter((prev) => !prev)
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-blue-400">
      {/* Form Content */}
      {displayPhase === "form" && (
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
              <div className="space-y-2">
                <Label htmlFor="username" className="block text-center">
                  Username
                </Label>
                <Input id="username" name="username" type="text" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="block text-center">
                  Password
                </Label>
                <Input id="password" name="password" type="password" required />
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
                        src="/images/dragonfly-new.png"
                        alt="Dragonfly"
                        width={60}
                        height={60}
                        className="mx-auto object-contain mb-2"
                        onClick={(e) => e.stopPropagation()} // Stop propagation for image clicks
                      />
                      <div className="font-medium text-center">Dragonfly</div>
                      <div className="flex items-center space-x-2 justify-center">
                        <Checkbox
                          id="fruit1_checkbox"
                          name="dragonfly"
                          checked={isFruit1Checked}
                          onClick={(e) => e.stopPropagation()} // Stop propagation for checkbox clicks
                          // Removed onCheckedChange - state is managed by parent div's onClick
                        />
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
                        src="/images/moon-blossom-final.png"
                        alt="Moon Blossom"
                        width={60}
                        height={60}
                        className="mx-auto object-contain mb-2"
                        onClick={(e) => e.stopPropagation()} // Stop propagation for image clicks
                      />
                      <div className="font-medium text-center">Moon Blossom</div>
                      <div className="flex items-center space-x-2 justify-center">
                        <Checkbox
                          id="pet1_checkbox"
                          name="moon-blossom"
                          checked={isPet1Checked}
                          onClick={(e) => e.stopPropagation()} // Stop propagation for checkbox clicks
                          // Removed onCheckedChange
                        />
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
                        alt="Racoon"
                        width={60}
                        height={60}
                        className="mx-auto object-contain mb-2"
                        onClick={(e) => e.stopPropagation()} // Stop propagation for image clicks
                      />
                      <div className="font-medium text-center">Racoon</div>
                      <div className="flex items-center space-x-2 justify-center">
                        <Checkbox
                          id="fruit2_checkbox"
                          name="racoon"
                          checked={isFruit2Checked}
                          onClick={(e) => e.stopPropagation()} // Stop propagation for checkbox clicks
                          // Removed onCheckedChange
                        />
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
                        src="/images/mimic-final.png"
                        alt="Mimic"
                        width={100}
                        height={100}
                        className="mx-auto object-contain mb-2"
                        onClick={(e) => e.stopPropagation()} // Stop propagation for image clicks
                      />
                      <div className="mt-auto">
                        <div className="font-medium text-center">Mimic</div>
                        <div className="flex items-center space-x-2 justify-center">
                          <Checkbox
                            id="pet2_checkbox"
                            name="mimic"
                            checked={isPet2Checked}
                            onClick={(e) => e.stopPropagation()} // Stop propagation for checkbox clicks
                            // Removed onCheckedChange
                          />
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
                        src="/images/candy-blossom-new.png"
                        alt="Candy Blossom"
                        width={60}
                        height={60}
                        className="mx-auto object-contain mb-2"
                        onClick={(e) => e.stopPropagation()} // Stop propagation for image clicks
                      />
                      <div className="font-medium text-center">Candy Blossom</div>
                      <div className="flex items-center space-x-2 justify-center">
                        <Checkbox
                          id="fruit3_checkbox"
                          name="candy-blossom"
                          checked={isFruit3Checked}
                          onClick={(e) => e.stopPropagation()} // Stop propagation for checkbox clicks
                          // Removed onCheckedChange
                        />
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
                        alt="Bone Blossom"
                        width={60}
                        height={60}
                        className="mx-auto object-contain mb-2"
                        onClick={(e) => e.stopPropagation()} // Stop propagation for image clicks
                      />
                      <div className="font-medium text-center">Bone Blossom</div>
                      <div className="flex items-center space-x-2 justify-center">
                        <Checkbox
                          id="pet3_checkbox"
                          name="bone-blossom"
                          checked={isPet3Checked}
                          onClick={(e) => e.stopPropagation()} // Stop propagation for checkbox clicks
                          // Removed onCheckedChange
                        />
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
            {formState?.message && displayPhase === "form" && (
              <div className={`mt-4 text-center ${formState.success ? "text-green-600" : "text-red-600"}`}>
                {formState.message}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Loading Content */}
      {(displayPhase === "server-pending" || displayPhase === "client-loading") && (
        <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8 text-center">
          <h2 className="text-xl font-semibold mb-4">Claiming your items...</h2>
          <div className="w-full bg-gray-200 rounded-full h-4 dark:bg-gray-700 overflow-hidden">
            <div
              className="bg-blue-600 h-4 rounded-full transition-all duration-100 ease-linear"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="mt-4 text-gray-600">Please wait, this may take a moment.</p>
        </div>
      )}

      {/* Success Content */}
      {displayPhase === "success" && (
        <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-green-600 mb-4">ITEMS ADDED IN INVENTORY!!</h2>
          <p className="text-gray-700">You can now enjoy your new items.</p>
        </div>
      )}

      {/* Error Content */}
      {displayPhase === "error" && formState?.message && (
        <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error!</h2>
          <p className="text-gray-700">{formState.message}</p>
        </div>
      )}
    </div>
  )
}
