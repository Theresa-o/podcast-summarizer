import { Episode } from "../types/podcast";

export const fetchPodcasts = async (): Promise<Episode[]> => {
  const response = await fetch("/api/podcasts");

  if (!response.ok) {
    throw new Error("Failed to fetch podcasts.");
  }

  const data = await response.json();
  return data.results || [];
};

export const summarizeEpisode = async (episode: Episode) => {
  const response = await fetch("/api/summarize", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      episodeId: episode.id,
      title: episode.title_original,
      title_highlighted: episode.title_highlighted,
      description: episode.description_original,
      description_highlighted: episode.description_highlighted,
      image: episode.image,
      audio: episode.audio,
      audio_length_sec: episode.audio_length_sec,
      publisher: episode.podcast?.publisher_original,
      link: episode.link,
      listennotes_url: episode.listennotes_url,
      pub_date_ms: episode.pub_date_ms,
      podcast: episode.podcast,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to summarize episode.");
  }

  return await response.json();
};
