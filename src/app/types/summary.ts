import { Episode } from "./podcast";

export interface GeneratedContent {
  shortSummary: string;
  longSummary: string;
  keyMoments: { time: string; topic: string }[];
}

export interface SummaryModalProps {
  episode: Episode;
  summary: GeneratedContent;
  isFromCache?: boolean;
}

export interface SummaryData {
  summary: GeneratedContent;
  fromCache: boolean;
  createdAt: string;
}
