"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import {
  Copy,
  Sparkles,
  FileText,
  Calendar,
  Clock,
  User,
  Share2,
} from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { formatDate, formatDuration } from "@/lib/helpers";
import { toast } from "sonner";
import { SummaryModalProps } from "../types/summary";

export default function Component({ episode, summary }: SummaryModalProps) {
  const [activeTab, setActiveTab] = useState<
    "brief-summary" | "longer-summary"
  >("brief-summary");

  const handleCopy = () => {
    const textToCopy =
      activeTab === "brief-summary"
        ? summary?.shortSummary
        : summary?.longSummary;

    if (!textToCopy) return;

    navigator.clipboard.writeText(textToCopy);
    toast.success("Copied to clipboard");
  };

  const handleShare = (activeTab: string) => {
    const url = window.location.href.split("#")[0];
    const shareUrl = `${url}#${activeTab}`;
    navigator.clipboard.writeText(shareUrl);
    toast.success("Shareable link copied");
  };

  const audioRef = useRef<HTMLAudioElement>(null);

  const handleJumpToTime = (time: string) => {
    const [mins, secs] = time.split(":").map(Number);
    const seconds = mins * 60 + secs;
    if (audioRef.current) {
      audioRef.current.currentTime = seconds;
      audioRef.current.play();
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-xl md:text-3xl font-bold bg-clip-text text-black">
          Podcast summary for {episode.podcast.title_original}
        </h1>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Image and Audio Display Section */}
        <Card className="lg:sticky lg:top-6 h-fit">
          <CardContent className="space-y-4">
            <div className="relative aspect-[4/3] bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border-2 border-dashed border-gray-200 overflow-hidden group hover:border-purple-300 transition-colors">
              <div className="absolute inset-0 flex items-center justify-center">
                <Image
                  src={episode.podcast.image}
                  alt={episode.podcast.title_original}
                  width={500}
                  height={400}
                  className="max-w-full max-h-full object-cover rounded-lg"
                />
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <User className="h-4 w-4" />
                <span> {episode.podcast.publisher_original}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{formatDuration(episode.audio_length_sec)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(episode.pub_date_ms)}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <audio controls className="w-full">
                <source src={episode.audio} type="audio/mpeg" />
              </audio>
            </div>
          </CardContent>
        </Card>

        {/* Content tab Section */}
        <div className="space-y-4 md:space-y-6">
          <Tabs
            defaultValue="brief-summary"
            value={activeTab}
            onValueChange={(value) => setActiveTab(value as typeof activeTab)}
            className="w-full bg-[#4B6043]"
          >
            <TabsList className="grid w-full grid-cols-3 h-auto p-1">
              <TabsTrigger
                value="brief-summary"
                className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 p-2 sm:p-3 text-xs sm:text-sm"
              >
                <FileText className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Summary (short)</span>
                <span className="sm:hidden">Short</span>
              </TabsTrigger>
              <TabsTrigger
                value="longer-summary"
                className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 p-2 sm:p-3 text-xs sm:text-sm"
              >
                <Sparkles className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Summary (long)</span>
                <span className="sm:hidden">Long</span>
              </TabsTrigger>
              <TabsTrigger
                value="timestamp"
                className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 p-2 sm:p-3 text-xs sm:text-sm"
              >
                <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-orange-500" />
                <span className="hidden sm:inline">Key Moments</span>
                <span className="sm:hidden">Moments</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="brief-summary" className="mt-4">
              <Card>
                <CardHeader className="pb-3 p-4 md:p-6">
                  <div className="flex justify-end">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleCopy}
                        className="h-8 w-8 sm:h-10 sm:w-auto sm:px-3"
                      >
                        <Copy className="h-3 w-3 sm:h-4 sm:w-4" />
                        <span className="hidden sm:inline ml-2">Copy</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleShare(activeTab)}
                        className="h-8 w-8 sm:h-10 sm:w-auto sm:px-3"
                      >
                        <Share2 className="h-3 w-3 sm:h-4 sm:w-4" />
                        <span className="hidden sm:inline ml-2">Share</span>
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4 md:p-6 pt-0">
                  <Textarea
                    value={summary?.shortSummary}
                    readOnly
                    className="min-h-[250px] md:min-h-[300px] resize-none border-0 p-0 focus-visible:ring-0 text-sm md:text-base"
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="longer-summary" className="mt-4">
              <Card>
                <CardHeader className="pb-3 p-4 md:p-6">
                  <div className="flex justify-end">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleCopy}
                        className="h-8 w-8 sm:h-10 sm:w-auto sm:px-3"
                      >
                        <Copy className="h-3 w-3 sm:h-4 sm:w-4" />
                        <span className="hidden sm:inline ml-2">Copy</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleShare(activeTab)}
                        className="h-8 w-8 sm:h-10 sm:w-auto sm:px-3"
                      >
                        <Share2 className="h-3 w-3 sm:h-4 sm:w-4" />
                        <span className="hidden sm:inline ml-2">Share</span>
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4 md:p-6 pt-0">
                  <div className="prose prose-sm md:prose-base max-w-none">
                    <p className="text-gray-700 leading-relaxed text-sm md:text-base">
                      {summary?.longSummary}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="timestamp" className="mt-4">
              <Card>
                <CardHeader className="pb-3 p-4 md:p-6">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base md:text-lg">
                      Key Moments
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-4 md:p-6 pt-0">
                  <div className="space-y-3">
                    {summary?.keyMoments?.map((item, index) => (
                      <div
                        key={index}
                        className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                      >
                        <Badge
                          variant="outline"
                          className="font-mono text-xs w-fit"
                        >
                          {item.time}
                        </Badge>
                        <span className="text-gray-700 flex-1 text-sm md:text-base">
                          {item.topic}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
