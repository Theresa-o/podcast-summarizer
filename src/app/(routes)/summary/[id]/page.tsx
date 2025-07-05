"use client";

import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import SummaryModal from "@/app/components/SummaryModal";
import { useEpisodeSummary } from "@/app/hooks/useEpisodeSummary";

const SummaryPage = () => {
  const params = useParams();
  const router = useRouter();
  const episodeId = params.id as string;

  const { data, isLoading, isError, error } = useEpisodeSummary(episodeId);

  const episode = data?.episode;
  const summaryData = data?.summaryData;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto" />
          <p className="text-gray-600">Loading summary...</p>
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4 max-w-md">
          <div className="text-red-500 text-lg font-semibold">Error</div>
          <p className="text-gray-600">
            {" "}
            {(error as Error)?.message || "Something went wrong."}
          </p>
          <Button onClick={() => router.push("/")} className="mt-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  if (!episode || !summaryData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-gray-600">No data available</p>
          <Button onClick={() => router.push("/")} className="mt-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back to homepage */}
      <div className="container mx-auto px-4 py-4">
        <Button
          variant="ghost"
          onClick={() => router.push("/")}
          className="mb-4 hover:bg-[#4B6043] hover:text-white"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Podcasts
        </Button>
      </div>

      {/* Summary details page */}
      <SummaryModal
        episode={episode}
        summary={summaryData.summary}
        isFromCache={summaryData.fromCache}
      />
    </div>
  );
};

export default SummaryPage;
