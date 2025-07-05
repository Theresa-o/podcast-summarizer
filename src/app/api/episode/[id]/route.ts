import { NextRequest, NextResponse } from "next/server";
import { getEpisodeDetails } from "@/lib/listen-notes";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const episode = await getEpisodeDetails(id);

    return NextResponse.json(episode);
  } catch (error) {
    console.error("Error getting details:", error);

    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(
      { error: "Failed to fetch episode details" },
      { status: 500 }
    );
  }
}
