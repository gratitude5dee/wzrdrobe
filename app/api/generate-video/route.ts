import { fal } from "@fal-ai/client"

if (!process.env.FAL_KEY) {
  throw new Error("FAL_KEY environment variable is not set")
}

fal.config({
  credentials: process.env.FAL_KEY,
})

export async function POST(request: Request) {
  try {
    const { imageUrl, prompt } = await request.json()

    if (!imageUrl || !prompt) {
      return new Response(JSON.stringify({ error: "Image URL and prompt are required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      })
    }

    try {
      const result = await fal.subscribe("fal-ai/luma-dream-machine/image-to-video", {
        input: {
          image_url: imageUrl,
          prompt: prompt,
          aspect_ratio: "16:9",
        },
        logs: true,
        onQueueUpdate: (update) => {
          if (update.status === "IN_PROGRESS") {
            console.log(
              "Queue update:",
              update.logs.map((log) => log.message),
            )
          }
        },
      })

      if (!result?.data?.video?.url) {
        throw new Error("No video URL in response")
      }

      return new Response(
        JSON.stringify({
          videoUrl: result.data.video.url,
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        },
      )
    } catch (error) {
      console.error("Fal.ai API error:", error)
      return new Response(
        JSON.stringify({
          error: `Failed to generate video: ${error instanceof Error ? error.message : "Unknown error"}`,
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        },
      )
    }
  } catch (error) {
    console.error("Server error:", error)
    return new Response(
      JSON.stringify({
        error: `Internal server error: ${error instanceof Error ? error.message : "Unknown error"}`,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    )
  }
}
