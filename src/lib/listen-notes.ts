const BASE_URL = "https://listen-api.listennotes.com/api/v2";
const API_KEY = process.env.NEXT_PUBLIC_LISTEN_NOTES_API_KEY;

export async function fetchPodcastEpisodes(query = "technology", limit = 20) {
  const response = await fetch(
    `${BASE_URL}/search?q=${query}&type=episode&limit=${limit}`,
    {
      headers: {
        "X-ListenAPI-Key": API_KEY!,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch episodes");
  }

  return response.json();
}

export async function getEpisodeDetails(episodeId: string) {
  const response = await fetch(`${BASE_URL}/episodes/${episodeId}`, {
    headers: {
      "X-ListenAPI-Key": API_KEY!,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch episode details");
  }

  return response.json();
}
