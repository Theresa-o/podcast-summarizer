"use client";

import { useState } from "react";
import { PodcastCard } from "@/components/PodcastCard";
import { useRouter } from "next/navigation";
import { usePodcasts, useSummarizeEpisode } from "./hooks/usePodcasts";
import { Episode } from "./types/podcast";

const Home = () => {
  const [loadingEpisodeId, setLoadingEpisodeId] = useState<string | null>(null);

  const router = useRouter();

  const { data: episodes, isLoading, isError } = usePodcasts();
  const { mutateAsync: summarize } = useSummarizeEpisode();

  const handleSummarize = async (episode: Episode) => {
    setLoadingEpisodeId(episode.id);

    try {
      await summarize(episode);
      router.push(`/summary/${episode.id}`);
    } catch (error) {
      console.error("Error summarizing episode:", error);
    } finally {
      setLoadingEpisodeId(null);
    }
  };
  return (
    <div className="container mx-auto px-4 py-8 bg-background">
      <div>
        <h1 className="text-3xl font-bold mb-8 flex items-center justify-center ">
          Podcast Summarizer
        </h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-full flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900" />
          </div>
        ) : isError ? (
          <div className="col-span-full text-center text-red-500">
            Something went wrong while loading episodes.
          </div>
        ) : episodes && episodes.length > 0 ? (
          episodes.map((episode: any) => (
            <PodcastCard
              key={episode.id}
              episode={episode}
              onSummarize={handleSummarize}
              isLoading={loadingEpisodeId === episode.id}
            />
          ))
        ) : (
          <div className="col-span-full text-center text-gray-500">
            No episodes available.
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
