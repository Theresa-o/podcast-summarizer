import { NextRequest, NextResponse } from "next/server";
import { generateSummary } from "@/lib/gemini";
import clientPromise from "@/lib/mongodb";

export async function POST(request: Request) {
  try {
    const {
      episodeId,
      title,
      description,
      image,
      publisher,
      audio,
      audio_length_sec,
      link,
      listennotes_url,
      description_highlighted,
      title_highlighted,
      pub_date_ms,
      podcast,
    } = await request.json();

    const client = await clientPromise;
    const db = client.db("podcast-summary");
    const summariesCollection = db.collection("summaries");

    // Check if summary already exists
    const existingSummary = await summariesCollection.findOne({ episodeId });
    if (existingSummary) {
      return NextResponse.json({
        summary: existingSummary.summary,
        fromCache: true,
        episodeDetails: existingSummary.episodeDetails || null,
      });
    }

    // Generate new summary
    const { shortSummary, longSummary, keyMoments, raw } =
      await generateSummary(description, title, audio_length_sec);

    // Save to database with episode details
    const summaryDoc = {
      episodeId,
      episodeTitle: title_highlighted,
      summary: {
        shortSummary,
        longSummary,
        keyMoments,
        raw,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
      episodeDetails: {
        title,
        title_highlighted,
        description,
        description_highlighted,
        image,
        thumbnail: podcast?.thumbnail || image,
        publisher,
        audio,
        audio_length_sec,
        link,
        listennotes_url,
        pub_date_ms,
        podcast: {
          id: podcast?.id,
          title_original: podcast?.title_original,
          title_highlighted: podcast?.title_highlighted,
          publisher_original: podcast?.publisher_original,
          publisher_highlighted: podcast?.publisher_highlighted,
          image: podcast?.image,
          thumbnail: podcast?.thumbnail,
          genre_ids: podcast?.genre_ids,
          listennotes_url: podcast?.listennotes_url,
        },
      },
    };

    await summariesCollection.insertOne(summaryDoc);

    return NextResponse.json({
      summary: summaryDoc.summary,
      fromCache: false,
      episodeDetails: summaryDoc.episodeDetails,
    });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { error: error.message || "Failed to generate summary" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const episodeId = searchParams.get("episodeId");
    const client = await clientPromise;
    const db = client.db("podcast-summary");
    const summariesCollection = db.collection("summaries");

    const summary = await summariesCollection.findOne({ episodeId });

    if (!summary) {
      return NextResponse.json({ error: "Summary not found" }, { status: 404 });
    }
    return NextResponse.json({
      summary: summary.summary,
      fromCache: true,
      createdAt: summary.createdAt,
      episodeDetails: summary.episodeDetails || null,
    });
  } catch (error) {
    console.error("Error in GET request", error);

    return NextResponse.json(
      { error: "Failed to fetch summary" },
      { status: 500 }
    );
  }
}
