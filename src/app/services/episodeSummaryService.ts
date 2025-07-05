import { getEpisodeDetails } from "@/lib/listen-notes";
import { SummaryData } from "../types/summary";
import { Episode } from "../types/podcast";

export async function fetchEpisodeSummary(episodeId: string): Promise<{
  summaryData: SummaryData;
  episode: Episode;
}> {
  const res = await fetch(`/api/summarize?episodeId=${episodeId}`);

  if (!res.ok) {
    if (res.status === 404) {
      throw new Error("Summary not found.");
    }
    throw new Error("Failed to fetch summary.");
  }

  const data = await res.json();
  const { summary, fromCache, createdAt, episodeDetails } = data;

  const summaryData: SummaryData = { summary, fromCache, createdAt };

  if (episodeDetails) {
    const episode: Episode = {
      id: episodeId,
      title_original: episodeDetails.title_original,
      description_original: episodeDetails.description_highlighted,
      image: episodeDetails.image,
      audio: episodeDetails.audio,
      audio_length_sec: episodeDetails.audio_length_sec,
      link: episodeDetails.link,
      listennotes_url: episodeDetails.listennotes_url,
      pub_date_ms: episodeDetails.pub_date_ms,
      podcast: {
        id: episodeDetails.podcast.id,
        title_original: episodeDetails.podcast.title_original,
        publisher_original: episodeDetails.podcast.publisher_original,
        image: episodeDetails.podcast.image,
        thumbnail: episodeDetails.podcast.thumbnail,
        genre_ids: episodeDetails.podcast.genre_ids,
        listennotes_url: episodeDetails.podcast.listennotes_url,
      },
    };

    return { summaryData, episode };
  }

  const fallback = await getEpisodeDetails(episodeId);

  const episode: Episode = {
    id: episodeId,
    title_original: fallback.title_original,
    description_original: fallback.description_highlighted,
    image: fallback.image,
    audio: fallback.audio,
    audio_length_sec: fallback.audio_length_sec,
    link: fallback.link,
    listennotes_url: fallback.listennotes_url,
    pub_date_ms: fallback.pub_date_ms,
    podcast: {
      id: fallback.podcast.id,
      title_original: fallback.podcast.title_original,
      publisher_original: fallback.podcast.publisher_original,
      image: fallback.podcast.image,
      thumbnail: fallback.podcast.thumbnail,
      genre_ids: fallback.podcast.genre_ids,
      listennotes_url: fallback.podcast.listennotes_url,
    },
  };

  return { summaryData, episode };
}
