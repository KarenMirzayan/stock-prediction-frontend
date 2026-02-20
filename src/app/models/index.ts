export type Forecast = 'growth' | 'decline' | 'stagnation';
export type Direction = 'bullish' | 'bearish' | 'neutral' | 'mixed' | 'volatile';
export type Sentiment = 'positive' | 'negative' | 'neutral';
export type MarketState = 'bullish' | 'bearish' | 'stagnation';
export type Relevance = 'high' | 'medium' | 'low';
export type EventType = 'earnings' | 'economic' | 'dividend' | 'conference';

export interface CompanyPrediction {
  ticker: string;
  direction: Direction;
  rationale?: string;
  timeHorizon?: string;
  confidence?: number;
  evidence?: string[];
}

export interface NewsItem {
  id: number;
  headline: string;
  publishedAt: string;
  publishedAtExact: string;
  companies: CompanyPrediction[];
  tags: string[];
  summary: string;
  sentiment: Sentiment;
  sentimentScore: number;
}

export interface NewsDetail extends NewsItem {
  fullText: string;
  analyticalExplanation: string;
  predictions: PredictionDetail[];
}

export interface PredictionDetail {
  scope: string;
  direction: string;
  timeHorizon: string;
  confidence: number;
  rationale: string;
  targets: string[];
  evidence: string[];
}

export interface NewsPage {
  content: NewsItem[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
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

export interface Company {
  id: number;
  ticker: string;
  name: string;
  exchange?: string;
  logoUrl?: string;
  websiteUrl?: string;
  marketCap?: number; // in millions
  country?: string;   // country code
  sectors: string[];
}

export interface CompanyDetail extends Company {
  countryName?: string;
  description?: string;
  ipoDate?: string;
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

export interface Quiz {
  id: string;
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  questions: QuizQuestion[];
  completed: boolean;
  score?: number;
  totalQuestions: number;
}

export interface SimulationScenario {
  id: string;
  title: string;
  date: string;
  period: string;
  newsHeadline: string;
  newsContent: string;
  context: string;
  sector: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  actualResult: string;
  completed: boolean;
  similarityScore?: number;
  feedback?: string;
}

export interface SimulationApiScenario {
  id: string;
  title: string;
  date: string;
  period: string;
  newsHeadline: string;
  newsContent: string;
  context: string;
  sector: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

export interface SimulationSubmitResult {
  similarityScore: number;
  feedback: string;
  ourPrediction: string;
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
