export type Forecast = 'growth' | 'decline' | 'stagnation';
export type Sentiment = 'positive' | 'negative' | 'neutral';
export type MarketState = 'bullish' | 'bearish' | 'stagnation';
export type Relevance = 'high' | 'medium' | 'low';
export type EventType = 'earnings' | 'economic' | 'dividend' | 'conference';

export interface CompanyGrowth {
  ticker: string;
  forecast: Forecast;
  change: number;
}

export interface NewsItem {
  id: string;
  headline: string;
  publishedAt: string;
  companies: CompanyGrowth[];
  tags: string[];
  summary: string;
  sentiment: Sentiment;
  sentimentScore: number;
}

export interface NewsDetail extends NewsItem {
  fullText: string;
  analyticalExplanation: string;
}

export interface SectorData {
  name: string;
  marketCap: number;
  sentiment: MarketState;
  change: number;
}

export interface EventItem {
  id: string;
  title: string;
  date: string;
  time: string;
  company?: string;
  sector: string;
  relevance: Relevance;
}

export interface CalendarEvent extends EventItem {
  type: EventType;
}

export interface HeatmapCompany {
  symbol: string;
  name: string;
  sentiment: number;
  change: number;
}

export interface HeatmapSector {
  id: string;
  name: string;
  sentiment: number;
  discussionVolume: number;
  companies: HeatmapCompany[];
  topics: string[];
}

export interface GlossaryTerm {
  term: string;
  definition: string;
  category: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface SimulationScenario {
  id: string;
  title: string;
  date: string;
  newsHeadline: string;
  context: string;
  sector: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

export interface SubscribedCompany {
  symbol: string;
  name: string;
  sector: string;
}

export interface SubscribedSector {
  name: string;
  companies: number;
}

export interface ForecastHistoryItem {
  id: string;
  date: string;
  headline: string;
  forecast: Forecast;
  actualMovement: string;
  accurate: boolean;
  companies: string[];
}

export interface ForecastStats {
  accuracy: number;
  totalForecasts: number;
  growthForecasts: number;
  declineForecasts: number;
  stagnationForecasts: number;
}
