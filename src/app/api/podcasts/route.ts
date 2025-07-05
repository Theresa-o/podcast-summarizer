import { NextResponse } from "next/server";
import { fetchPodcastEpisodes } from "@/lib/listen-notes";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || "technology";

    const data = await fetchPodcastEpisodes(query);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch podcasts" },
      { status: 500 }
    );
  }
}
