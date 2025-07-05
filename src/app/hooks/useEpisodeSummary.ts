import { useQuery } from "@tanstack/react-query";
import { fetchEpisodeSummary } from "../services/episodeSummaryService";

export const useEpisodeSummary = (episodeId: string) => {
  return useQuery({
    queryKey: ["episode-summary", episodeId],
    queryFn: () => fetchEpisodeSummary(episodeId),
    enabled: !!episodeId,
    retry: false,
  });
};
