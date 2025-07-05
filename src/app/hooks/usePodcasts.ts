import { useQuery, useMutation } from "@tanstack/react-query";
import { fetchPodcasts, summarizeEpisode } from "../services/podcastService";

export const usePodcasts = () => {
  return useQuery({
    queryKey: ["podcasts"],
    queryFn: fetchPodcasts,
  });
};

export const useSummarizeEpisode = () => {
  return useMutation({
    mutationFn: summarizeEpisode,
  });
};
