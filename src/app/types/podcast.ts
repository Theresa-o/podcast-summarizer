export interface Episode {
  audio: string;
  audio_length_sec: number;
  rss?: string;
  description_highlighted?: string;
  description_original: string;
  explicit_content?: boolean;
  guid_from_rss?: string;
  id: string;
  image: string;
  itunes_id?: number;
  link: string;
  listennotes_url: string;
  podcast: {
    genre_ids: number[];
    id: string;
    image: string;
    listen_score?: string;
    listen_score_global_rank?: string;
    listennotes_url: string;
    publisher_highlighted?: string;
    publisher_original: string;
    thumbnail: string;
    title_highlighted?: string;
    title_original: string;
  };
  pub_date_ms: number;
  thumbnail?: string;
  title_highlighted?: string;
  title_original: string;
}

export interface PodcastCardProps {
  episode: Episode;
  onSummarize: (episode: Episode) => void;
  isLoading: boolean;
}
