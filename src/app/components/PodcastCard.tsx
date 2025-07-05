import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { getHtmlPreview } from "@/lib/helpers";
import { PodcastCardProps } from "../types/podcast";

export function PodcastCard({
  episode,
  onSummarize,
  isLoading,
}: PodcastCardProps) {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex-shrink-0">
        <img
          src={episode.image}
          alt={episode.title_original}
          className="w-full h-48 object-cover rounded-md"
        />
        <CardTitle className="text-lg line-clamp-2">
          {episode.title_original}
        </CardTitle>
        <p className="text-sm text-gray-600">
          Published by: {episode.podcast.publisher_original}
        </p>
      </CardHeader>

      <div className="flex-grow flex flex-col">
        <CardContent className="flex-grow">
          <div className="h-[72px] overflow-hidden mb-1">
            {" "}
            <p className="text-sm">
              {getHtmlPreview(episode.description_original, 100)}
            </p>
          </div>
        </CardContent>

        <div className="p-4 pt-0">
          {" "}
          <Button
            onClick={() => onSummarize(episode)}
            disabled={isLoading}
            className="w-full bg-[#4B6043]"
          >
            {isLoading ? "Summarizing..." : "Summarize"}
          </Button>
        </div>
      </div>
    </Card>
  );
}
