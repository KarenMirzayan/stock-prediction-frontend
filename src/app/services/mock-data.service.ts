import { Injectable } from '@angular/core';
import {
  NewsItem, NewsDetail, SectorData, EventItem, CalendarEvent,
  HeatmapSector, GlossaryTerm, Quiz, SimulationScenario,
  SubscribedCompany, SubscribedSector, ForecastHistoryItem, ForecastStats
} from '../models';

@Injectable({ providedIn: 'root' })
export class MockDataService {

  readonly homeNews: NewsItem[] = [
    {
      id: 1,
      headline: 'Federal Reserve Signals Potential Rate Cut in Q2 2026',
      publishedAt: '2 hours ago',
      publishedAtExact: 'February 16, 2026 at 8:30 PM',
      companies: [
        { ticker: 'JPM', direction: 'bullish' },
        { ticker: 'BAC', direction: 'bullish' },
        { ticker: 'GS', direction: 'bullish' },
        { ticker: 'FINANCE:US', direction: 'bullish' },
      ],
      tags: ['Finance', 'Banking', 'United States'],
      summary: 'The Federal Reserve indicated a potential shift in monetary policy, suggesting rate cuts may come sooner than expected as inflation shows signs of cooling.',
      sentiment: 'positive',
      sentimentScore: 45,
    },
    {
      id: 2,
      headline: 'Tech Giants Report Strong Q4 Earnings Amid AI Boom',
      publishedAt: '4 hours ago',
      publishedAtExact: 'February 16, 2026 at 6:30 PM',
      companies: [
        { ticker: 'AAPL', direction: 'bullish' },
        { ticker: 'MSFT', direction: 'bullish' },
        { ticker: 'GOOGL', direction: 'neutral' },
      ],
      tags: ['Technology', 'AI', 'United States'],
      summary: 'Major technology companies exceeded analyst expectations, driven by continued investment in artificial intelligence and cloud services.',
      sentiment: 'positive',
      sentimentScore: 62,
    },
    {
      id: 3,
      headline: 'Oil Prices Surge on OPEC+ Production Cuts',
      publishedAt: '6 hours ago',
      publishedAtExact: 'February 16, 2026 at 4:30 PM',
      companies: [
        { ticker: 'XOM', direction: 'bullish' },
        { ticker: 'CVX', direction: 'bullish' },
        { ticker: 'BP', direction: 'mixed' },
        { ticker: 'ENERGY:SA,AE', direction: 'bullish' },
      ],
      tags: ['Energy', 'Oil & Gas', 'Global'],
      summary: 'Crude oil prices jumped 5% after OPEC+ announced deeper production cuts to support market stability amid global demand concerns.',
      sentiment: 'neutral',
      sentimentScore: 12,
    },
    {
      id: 4,
      headline: 'Retail Sales Decline as Consumer Spending Weakens',
      publishedAt: '8 hours ago',
      publishedAtExact: 'February 16, 2026 at 2:30 PM',
      companies: [
        { ticker: 'WMT', direction: 'bearish' },
        { ticker: 'TGT', direction: 'bearish' },
        { ticker: 'AMZN', direction: 'volatile' },
        { ticker: 'CONSUMER:US', direction: 'bearish' },
      ],
      tags: ['Retail', 'Consumer Discretionary', 'United States'],
      summary: 'U.S. retail sales fell for the second consecutive month, raising concerns about consumer confidence and economic growth outlook.',
      sentiment: 'negative',
      sentimentScore: -28,
    },
  ];

  readonly allNews: NewsItem[] = [
    ...this.homeNews,
    {
      id: 5,
      headline: 'Electric Vehicle Sales Hit Record High in January',
      publishedAt: '10 hours ago',
      publishedAtExact: 'February 16, 2026 at 12:30 PM',
      companies: [
        { ticker: 'TSLA', direction: 'bullish' },
        { ticker: 'RIVN', direction: 'bullish' },
        { ticker: 'F', direction: 'neutral' },
      ],
      tags: ['Automotive', 'Technology', 'Global'],
      summary: 'Global EV sales reached a new monthly record, with Tesla maintaining market leadership while new entrants gain ground.',
      sentiment: 'positive',
      sentimentScore: 38,
    },
    {
      id: 6,
      headline: 'Pharmaceutical Merger Creates Healthcare Giant',
      publishedAt: '12 hours ago',
      publishedAtExact: 'February 16, 2026 at 10:30 AM',
      companies: [
        { ticker: 'PFE', direction: 'neutral' },
        { ticker: 'JNJ', direction: 'bullish' },
        { ticker: 'MRK', direction: 'mixed' },
      ],
      tags: ['Healthcare', 'Pharmaceuticals', 'United States'],
      summary: 'A major pharmaceutical merger has been announced, combining two industry leaders into one of the largest healthcare companies globally.',
      sentiment: 'neutral',
      sentimentScore: 5,
    },
  ];

  readonly newsDetail: NewsDetail = {
    id: 1,
    headline: 'Federal Reserve Signals Potential Rate Cut in Q2 2026',
    publishedAt: '2 hours ago',
    publishedAtExact: 'February 4, 2026 at 2:30 PM EST',
    companies: [
      { ticker: 'JPM', direction: 'bullish' },
      { ticker: 'BAC', direction: 'bullish' },
      { ticker: 'GS', direction: 'bullish' },
    ],
    tags: ['Finance', 'Banking', 'United States'],
    summary: 'The Federal Reserve indicated a potential shift in monetary policy, suggesting rate cuts may come sooner than expected as inflation shows signs of cooling.',
    sentiment: 'positive',
    sentimentScore: 45,
    fullText: `The Federal Reserve signaled on Tuesday that it may begin cutting interest rates as early as the second quarter of 2026, marking a significant shift in monetary policy as inflation continues to moderate toward the central bank's 2% target.

Fed Chair Jerome Powell, speaking after the latest policy meeting, noted that "the Committee believes the risks to achieving its employment and inflation goals are moving into better balance" and that "if the economy evolves broadly as expected, it will likely be appropriate to begin dialing back policy restraint."

The announcement sent ripples through financial markets, with banking stocks rallying on expectations that lower interest rates could stimulate lending activity and reduce deposit costs. JPMorgan Chase (JPM), Bank of America (BAC), and Goldman Sachs (GS) all posted gains of 2-3% in after-hours trading.

Analysts note that the timing of potential rate cuts will depend heavily on continued progress on inflation. January's Consumer Price Index showed year-over-year inflation at 2.4%, down from a peak of 9.1% in mid-2022.

"The Fed is threading a needle here," said Sarah Chen, chief economist at Capital Economics. "They want to ease policy before the economy weakens too much, but they also don't want to declare victory on inflation prematurely."

The move is expected to have broad implications across multiple sectors, particularly for interest-rate-sensitive industries such as real estate, utilities, and consumer durables.`,
    analyticalExplanation: 'The Federal Reserve\'s shift toward a more dovish stance represents a significant inflection point for markets. Lower interest rates typically benefit financial institutions through increased lending activity, while also supporting equity valuations broadly. The banking sector stands to benefit from both improved loan demand and reduced funding costs, though net interest margins may face some compression.',
    predictions: [
      { scope: 'COMPANY', direction: 'BULLISH', timeHorizon: 'SHORT_TERM', confidence: 75, rationale: 'Rate cuts benefit lending activity.', targets: ['JPM'], evidence: ['Fed signaled rate cuts'] },
      { scope: 'COMPANY', direction: 'BULLISH', timeHorizon: 'SHORT_TERM', confidence: 70, rationale: 'Lower rates reduce deposit costs.', targets: ['BAC'], evidence: ['Inflation cooling'] },
      { scope: 'SECTOR', direction: 'BULLISH', timeHorizon: 'MID_TERM', confidence: 65, rationale: 'Broad financial sector uplift expected.', targets: ['FINANCE'], evidence: ['Dovish policy shift'] },
    ],
  };

  readonly relatedNews: NewsItem[] = [
    {
      id: 5,
      headline: 'Banking Sector Rallies on Rate Cut Expectations',
      publishedAt: '3 hours ago',
      publishedAtExact: 'February 16, 2026 at 7:30 PM',
      companies: [
        { ticker: 'JPM', direction: 'bullish' },
        { ticker: 'C', direction: 'bullish' },
        { ticker: 'WFC', direction: 'neutral' },
      ],
      tags: ['Finance', 'Banking', 'United States'],
      summary: 'Major U.S. banks saw significant gains as investors bet on improved profitability from potential rate cuts.',
      sentiment: 'positive',
      sentimentScore: 52,
    },
    {
      id: 6,
      headline: 'Treasury Yields Drop Following Fed Statement',
      publishedAt: '4 hours ago',
      publishedAtExact: 'February 16, 2026 at 6:30 PM',
      companies: [],
      tags: ['Finance', 'Bonds', 'United States'],
      summary: 'U.S. Treasury yields fell sharply across the curve as markets priced in earlier-than-expected rate cuts.',
      sentiment: 'neutral',
      sentimentScore: 8,
    },
  ];

  readonly homeSectors: SectorData[] = [
    { name: 'Technology', marketCap: 15.2, sentiment: 'bullish', change: 2.4 },
    { name: 'Healthcare', marketCap: 7.8, sentiment: 'stagnation', change: 0.2 },
    { name: 'Finance', marketCap: 9.1, sentiment: 'bullish', change: 3.2 },
    { name: 'Energy', marketCap: 5.4, sentiment: 'bearish', change: -1.8 },
    { name: 'Consumer Discretionary', marketCap: 6.2, sentiment: 'bearish', change: -2.1 },
    { name: 'Industrials', marketCap: 4.9, sentiment: 'bullish', change: 0.7 },
    { name: 'Telecommunications', marketCap: 3.1, sentiment: 'stagnation', change: -0.1 },
  ];

  readonly homeEvents: EventItem[] = [
    { id: '1', title: 'FOMC Meeting Minutes', date: 'Feb 18', time: '2:00 PM EST', sector: 'Economy', relevance: 'high' },
    { id: '2', title: 'Tesla Investor Day', date: 'Feb 20', time: '10:00 AM EST', company: 'TSLA', sector: 'Automotive', relevance: 'medium' },
    { id: '3', title: 'Consumer Price Index', date: 'Feb 25', time: '8:30 AM EST', sector: 'Economy', relevance: 'high' },
    { id: '4', title: 'Amazon Q4 Earnings', date: 'Feb 27', time: '4:00 PM EST', company: 'AMZN', sector: 'Technology', relevance: 'high' },
  ];

  readonly calendarEvents: CalendarEvent[] = [
    // Week 1: Feb 2–8
    { id: '1',  title: 'Consumer Confidence Index',     date: '2026-02-03', time: '10:00 AM EST', sector: 'Economy',     relevance: 'medium', type: 'economic' },
    { id: '2',  title: 'Alphabet Q4 Earnings',          date: '2026-02-04', time: '4:30 PM EST',  company: 'GOOGL',      sector: 'Technology', relevance: 'high',   type: 'earnings' },
    { id: '3',  title: 'GDP Growth Report Q4',          date: '2026-02-05', time: '8:30 AM EST',  sector: 'Economy',     relevance: 'high',   type: 'economic' },
    { id: '4',  title: 'Amazon Investor Day',           date: '2026-02-05', time: '1:00 PM EST',  company: 'AMZN',       sector: 'Technology', relevance: 'medium', type: 'conference' },
    { id: '5',  title: 'Non-Farm Payrolls',             date: '2026-02-06', time: '8:30 AM EST',  sector: 'Economy',     relevance: 'high',   type: 'economic' },
    // Week 2: Feb 9–15
    { id: '6',  title: 'Goldman Sachs Tech Conference', date: '2026-02-09', time: '9:00 AM EST',  company: 'GS',         sector: 'Finance',    relevance: 'medium', type: 'conference' },
    { id: '7',  title: 'Apple Quarterly Dividend',      date: '2026-02-10', time: '9:00 AM EST',  company: 'AAPL',       sector: 'Technology', relevance: 'low',    type: 'dividend' },
    { id: '8',  title: 'Nvidia Q4 Earnings Call',       date: '2026-02-10', time: '5:00 PM EST',  company: 'NVDA',       sector: 'Technology', relevance: 'high',   type: 'earnings' },
    { id: '9',  title: 'Microsoft Q4 Earnings',         date: '2026-02-11', time: '4:30 PM EST',  company: 'MSFT',       sector: 'Technology', relevance: 'high',   type: 'earnings' },
    { id: '10', title: 'PPI Data Release',              date: '2026-02-12', time: '8:30 AM EST',  sector: 'Economy',     relevance: 'medium', type: 'economic' },
    { id: '11', title: 'Exxon Q4 Earnings',             date: '2026-02-12', time: '7:00 AM EST',  company: 'XOM',        sector: 'Energy',     relevance: 'medium', type: 'earnings' },
    { id: '12', title: 'Consumer Sentiment UMich',      date: '2026-02-13', time: '10:00 AM EST', sector: 'Economy',     relevance: 'low',    type: 'economic' },
    { id: '13', title: 'Apple Q1 Earnings Report',      date: '2026-02-15', time: '4:30 PM EST',  company: 'AAPL',       sector: 'Technology', relevance: 'high',   type: 'earnings' },
    // Week 3: Feb 16–22 (current week, today = Feb 18)
    { id: '14', title: 'Retail Sales Data',             date: '2026-02-17', time: '8:30 AM EST',  sector: 'Economy',     relevance: 'high',   type: 'economic' },
    { id: '15', title: 'FOMC Meeting Minutes',          date: '2026-02-18', time: '2:00 PM EST',  sector: 'Economy',     relevance: 'high',   type: 'economic' },
    { id: '16', title: 'Goldman Sachs Dividend',        date: '2026-02-18', time: '9:00 AM EST',  company: 'GS',         sector: 'Finance',    relevance: 'low',    type: 'dividend' },
    { id: '17', title: 'Jobless Claims Weekly',         date: '2026-02-19', time: '8:30 AM EST',  sector: 'Economy',     relevance: 'medium', type: 'economic' },
    { id: '18', title: 'Chevron Q4 Earnings',           date: '2026-02-20', time: '7:30 AM EST',  company: 'CVX',        sector: 'Energy',     relevance: 'medium', type: 'earnings' },
    { id: '19', title: 'Tesla Investor Day',            date: '2026-02-20', time: '10:00 AM EST', company: 'TSLA',       sector: 'Automotive', relevance: 'medium', type: 'conference' },
    { id: '20', title: 'Microsoft Dividend Payment',    date: '2026-02-22', time: '9:00 AM EST',  company: 'MSFT',       sector: 'Technology', relevance: 'low',    type: 'dividend' },
    // Week 4: Feb 23–28
    { id: '21', title: 'Home Sales Data',               date: '2026-02-23', time: '10:00 AM EST', sector: 'Economy',     relevance: 'medium', type: 'economic' },
    { id: '22', title: 'Berkshire Annual Report',       date: '2026-02-24', time: '8:00 AM EST',  company: 'BRK.B',      sector: 'Finance',    relevance: 'medium', type: 'conference' },
    { id: '23', title: 'Consumer Price Index',          date: '2026-02-25', time: '8:30 AM EST',  sector: 'Economy',     relevance: 'high',   type: 'economic' },
    { id: '24', title: 'NVIDIA Quarterly Dividend',     date: '2026-02-25', time: '9:00 AM EST',  company: 'NVDA',       sector: 'Technology', relevance: 'low',    type: 'dividend' },
    { id: '25', title: 'GDP Revision Q4 Final',         date: '2026-02-26', time: '8:30 AM EST',  sector: 'Economy',     relevance: 'high',   type: 'economic' },
    { id: '26', title: 'Amazon Q4 Earnings Report',     date: '2026-02-27', time: '4:00 PM EST',  company: 'AMZN',       sector: 'Technology', relevance: 'high',   type: 'earnings' },
    { id: '27', title: 'JPMorgan Healthcare Conf.',     date: '2026-02-28', time: '9:00 AM EST',  company: 'JPM',        sector: 'Finance',    relevance: 'medium', type: 'conference' },
    { id: '28', title: 'Personal Income & Spending',    date: '2026-02-28', time: '8:30 AM EST',  sector: 'Economy',     relevance: 'medium', type: 'economic' },
  ];

  readonly heatmapSectors: HeatmapSector[] = [
    {
      id: 'tech', name: 'Technology', sentiment: 65, discussionVolume: 45000,
      companies: [
        { symbol: 'AAPL', name: 'Apple Inc.', sentiment: 72, change: 2.3 },
        { symbol: 'MSFT', name: 'Microsoft Corp.', sentiment: 68, change: 1.8 },
        { symbol: 'GOOGL', name: 'Alphabet Inc.', sentiment: 55, change: -0.5 },
        { symbol: 'NVDA', name: 'NVIDIA Corp.', sentiment: 78, change: 4.2 },
      ],
      topics: ['AI Development', 'Cloud Computing', 'Earnings Reports', 'Product Launches'],
    },
    {
      id: 'finance', name: 'Finance', sentiment: 42, discussionVolume: 32000,
      companies: [
        { symbol: 'JPM', name: 'JPMorgan Chase', sentiment: 45, change: 0.8 },
        { symbol: 'BAC', name: 'Bank of America', sentiment: 38, change: -1.2 },
        { symbol: 'GS', name: 'Goldman Sachs', sentiment: 52, change: 1.5 },
        { symbol: 'WFC', name: 'Wells Fargo', sentiment: 35, change: -0.9 },
      ],
      topics: ['Interest Rates', 'Loan Growth', 'Regulatory Changes', 'Digital Banking'],
    },
    {
      id: 'energy', name: 'Energy', sentiment: 28, discussionVolume: 28000,
      companies: [
        { symbol: 'XOM', name: 'Exxon Mobil', sentiment: 32, change: -2.1 },
        { symbol: 'CVX', name: 'Chevron', sentiment: 25, change: -2.8 },
        { symbol: 'COP', name: 'ConocoPhillips', sentiment: 30, change: -1.5 },
      ],
      topics: ['Oil Prices', 'OPEC Decisions', 'Renewable Energy', 'Climate Policy'],
    },
    {
      id: 'healthcare', name: 'Healthcare', sentiment: 55, discussionVolume: 22000,
      companies: [
        { symbol: 'JNJ', name: 'Johnson & Johnson', sentiment: 58, change: 0.5 },
        { symbol: 'PFE', name: 'Pfizer', sentiment: 48, change: -0.3 },
        { symbol: 'UNH', name: 'UnitedHealth', sentiment: 62, change: 1.2 },
      ],
      topics: ['Drug Approvals', 'Medicare Policy', 'Biotech Innovation', 'M&A Activity'],
    },
    {
      id: 'consumer', name: 'Consumer', sentiment: 35, discussionVolume: 18000,
      companies: [
        { symbol: 'AMZN', name: 'Amazon', sentiment: 45, change: 1.1 },
        { symbol: 'WMT', name: 'Walmart', sentiment: 32, change: -1.4 },
        { symbol: 'TGT', name: 'Target', sentiment: 28, change: -2.0 },
      ],
      topics: ['Consumer Spending', 'E-commerce Growth', 'Retail Sales', 'Supply Chain'],
    },
    {
      id: 'industrial', name: 'Industrial', sentiment: 48, discussionVolume: 15000,
      companies: [
        { symbol: 'CAT', name: 'Caterpillar', sentiment: 52, change: 0.8 },
        { symbol: 'BA', name: 'Boeing', sentiment: 42, change: -0.5 },
        { symbol: 'GE', name: 'GE Aerospace', sentiment: 55, change: 1.3 },
      ],
      topics: ['Manufacturing Data', 'Infrastructure', 'Global Trade', 'Defense Spending'],
    },
    {
      id: 'telecom', name: 'Telecom', sentiment: 50, discussionVolume: 12000,
      companies: [
        { symbol: 'T', name: 'AT&T', sentiment: 48, change: 0.1 },
        { symbol: 'VZ', name: 'Verizon', sentiment: 51, change: 0.3 },
        { symbol: 'TMUS', name: 'T-Mobile', sentiment: 53, change: 0.5 },
      ],
      topics: ['5G Rollout', 'Subscriber Growth', 'Spectrum Auctions', 'Fiber Expansion'],
    },
  ];

  readonly forecastStats: ForecastStats = {
    accuracy: 78,
    totalForecasts: 1247,
    growthForecasts: 542,
    declineForecasts: 389,
    stagnationForecasts: 316,
  };

  readonly forecastHistory: ForecastHistoryItem[] = [
    { id: '1', date: 'Feb 3, 2026', headline: 'Tech earnings expected to beat estimates', forecast: 'growth', actualMovement: '+3.2%', accurate: true, companies: ['AAPL', 'MSFT'] },
    { id: '2', date: 'Feb 2, 2026', headline: 'Oil prices to stabilize after OPEC meeting', forecast: 'stagnation', actualMovement: '+0.8%', accurate: true, companies: ['XOM', 'CVX'] },
    { id: '3', date: 'Feb 1, 2026', headline: 'Retail sector faces headwinds from weak consumer data', forecast: 'decline', actualMovement: '-2.1%', accurate: true, companies: ['WMT', 'TGT'] },
    { id: '4', date: 'Jan 31, 2026', headline: 'Banking stocks to rise on interest rate expectations', forecast: 'growth', actualMovement: '-0.5%', accurate: false, companies: ['JPM', 'BAC'] },
    { id: '5', date: 'Jan 30, 2026', headline: 'Semiconductor demand outlook remains strong', forecast: 'growth', actualMovement: '+4.7%', accurate: true, companies: ['NVDA', 'AMD'] },
    { id: '6', date: 'Jan 29, 2026', headline: 'Healthcare sector mixed on policy uncertainty', forecast: 'stagnation', actualMovement: '-1.8%', accurate: false, companies: ['JNJ', 'PFE'] },
  ];

  readonly glossaryTerms: GlossaryTerm[] = [
    { term: 'Bull Market', definition: 'A market condition where prices are rising or expected to rise. The term is typically used to refer to the stock market but can apply to anything traded, such as bonds, real estate, currencies, and commodities.', category: 'Market Basics' },
    { term: 'Bear Market', definition: 'A market condition in which prices are falling or expected to fall. It typically describes a condition where securities prices fall 20% or more from recent highs.', category: 'Market Basics' },
    { term: 'P/E Ratio', definition: 'Price-to-Earnings ratio. A valuation metric calculated by dividing the market price per share by earnings per share. It indicates how much investors are willing to pay per dollar of earnings.', category: 'Valuation' },
    { term: 'Market Cap', definition: "Market capitalization. The total market value of a company's outstanding shares, calculated by multiplying the share price by the number of shares outstanding.", category: 'Valuation' },
    { term: 'Dividend', definition: "A distribution of a portion of a company's earnings to its shareholders. Dividends are typically paid quarterly and represent a return on investment for stockholders.", category: 'Income' },
    { term: 'Volatility', definition: 'A statistical measure of the dispersion of returns for a given security or market index. Higher volatility means greater price fluctuations and potentially higher risk.', category: 'Risk' },
    { term: 'Short Selling', definition: "An investment strategy that speculates on the decline of a stock's price. Traders borrow shares to sell at the current price, hoping to buy them back later at a lower price.", category: 'Trading' },
    { term: 'ETF', definition: 'Exchange-Traded Fund. A type of pooled investment security that operates much like a mutual fund but trades on stock exchanges like individual stocks.', category: 'Investment Vehicles' },
  ];

  readonly quizzes: Quiz[] = [
    {
      id: '1', title: 'Market Basics', description: 'Learn the fundamentals of stock markets, including bull and bear markets, trading volume, and market cycles.',
      difficulty: 'Beginner', completed: true, score: 100, totalQuestions: 3,
      questions: [
        { id: '1', question: 'What typically indicates a bull market?', options: ['Prices falling 20% from recent highs', 'Rising or expected rising prices', 'High trading volume', 'Increased market volatility'], correctAnswer: 1, explanation: 'A bull market is characterized by rising prices or expectations of rising prices, typically associated with investor optimism and economic growth.' },
        { id: '2', question: 'A company with a high P/E ratio generally indicates:', options: ['The company is undervalued', 'Investors expect higher future growth', 'The company is paying high dividends', 'The stock price is declining'], correctAnswer: 1, explanation: 'A high P/E ratio typically suggests that investors expect higher earnings growth in the future compared to companies with lower P/E ratios.' },
        { id: '3', question: 'What is the primary purpose of short selling?', options: ['To profit from rising stock prices', 'To earn dividend income', 'To profit from declining stock prices', 'To reduce portfolio volatility'], correctAnswer: 2, explanation: "Short selling is a strategy used to profit from an expected decline in a stock's price by borrowing and selling shares, then buying them back at a lower price." },
      ],
    },
    {
      id: '2', title: 'Valuation Metrics', description: 'Understand key valuation metrics used to analyze stocks, including P/E ratio, market cap, and dividend yield.',
      difficulty: 'Beginner', completed: true, score: 67, totalQuestions: 3,
      questions: [
        { id: '4', question: 'What does market capitalization represent?', options: ['Annual revenue of a company', 'Total value of outstanding shares', 'Net profit margin', 'Total debt of a company'], correctAnswer: 1, explanation: 'Market capitalization is calculated by multiplying the current share price by the total number of outstanding shares, representing the total market value of a company.' },
        { id: '5', question: 'A low P/E ratio compared to industry peers may suggest:', options: ['The stock is overvalued', 'The stock is potentially undervalued', 'High growth expectations', 'The company will go bankrupt'], correctAnswer: 1, explanation: 'A low P/E ratio relative to peers can indicate a stock is undervalued, though it may also reflect lower growth expectations or underlying issues.' },
        { id: '6', question: 'Dividend yield is calculated by dividing:', options: ['Earnings by share price', 'Annual dividend by share price', 'Share price by annual dividend', 'Revenue by number of shares'], correctAnswer: 1, explanation: 'Dividend yield is the annual dividend payment divided by the stock price, expressed as a percentage. It shows the return from dividends alone.' },
      ],
    },
    {
      id: '3', title: 'Trading Strategies', description: 'Explore different trading strategies including day trading, swing trading, and position trading approaches.',
      difficulty: 'Intermediate', completed: false, totalQuestions: 3,
      questions: [
        { id: '7', question: 'What is a stop-loss order?', options: ['An order to buy at a specific price', 'An order to sell when price drops to a set level', 'A limit on daily trades', 'An order that expires at market close'], correctAnswer: 1, explanation: 'A stop-loss order automatically sells a security when it reaches a specified price, limiting potential losses on a position.' },
        { id: '8', question: 'Dollar-cost averaging involves:', options: ['Investing a lump sum at once', 'Investing fixed amounts at regular intervals', 'Only buying when prices drop', 'Trading based on currency fluctuations'], correctAnswer: 1, explanation: 'Dollar-cost averaging means investing a fixed amount regularly regardless of price, which reduces the impact of volatility over time.' },
        { id: '9', question: 'What distinguishes swing trading from day trading?', options: ['Swing trading uses more capital', 'Swing trading holds positions for days to weeks', 'Day trading is less risky', 'Swing trading only involves options'], correctAnswer: 1, explanation: 'Swing trading holds positions for several days to weeks, aiming to capture short-to-medium-term price movements, while day trading closes all positions within the same day.' },
      ],
    },
    {
      id: '4', title: 'Risk Management', description: 'Master essential risk management concepts including diversification, hedging, and portfolio allocation strategies.',
      difficulty: 'Intermediate', completed: false, totalQuestions: 3,
      questions: [
        { id: '10', question: 'What is the primary benefit of portfolio diversification?', options: ['Guaranteeing profits', 'Eliminating all risk', 'Reducing unsystematic risk', 'Maximizing short-term returns'], correctAnswer: 2, explanation: 'Diversification reduces unsystematic (company-specific) risk by spreading investments across different assets, sectors, and geographies.' },
        { id: '11', question: 'What does beta measure in investing?', options: ['A stock\'s dividend growth rate', 'A stock\'s volatility relative to the market', 'The total return of a portfolio', 'A company\'s debt-to-equity ratio'], correctAnswer: 1, explanation: 'Beta measures a stock\'s volatility relative to the overall market. A beta greater than 1 indicates higher volatility than the market.' },
        { id: '12', question: 'What is a hedging strategy?', options: ['Buying only growth stocks', 'Taking an offsetting position to reduce risk', 'Selling all positions before earnings', 'Investing only in bonds'], correctAnswer: 1, explanation: 'Hedging involves taking an offsetting investment position to reduce the risk of adverse price movements in an existing position.' },
      ],
    },
    {
      id: '5', title: 'Technical Analysis', description: 'Dive into technical analysis tools like moving averages, RSI, support and resistance levels.',
      difficulty: 'Advanced', completed: false, totalQuestions: 3,
      questions: [
        { id: '13', question: 'What does a "golden cross" pattern indicate?', options: ['A bearish reversal', 'A bullish signal when short-term MA crosses above long-term MA', 'High trading volume', 'A stock reaching its all-time high'], correctAnswer: 1, explanation: 'A golden cross occurs when a short-term moving average crosses above a long-term moving average, typically seen as a bullish signal.' },
        { id: '14', question: 'An RSI value above 70 generally indicates:', options: ['The asset is oversold', 'The asset is overbought', 'Normal trading conditions', 'Low volatility'], correctAnswer: 1, explanation: 'An RSI (Relative Strength Index) above 70 suggests an asset may be overbought and could be due for a price correction or pullback.' },
        { id: '15', question: 'What is a support level?', options: ['The highest price a stock has reached', 'A price level where buying pressure tends to prevent further decline', 'The average trading price', 'A government-mandated minimum price'], correctAnswer: 1, explanation: 'A support level is a price point where a stock tends to stop falling because buying interest increases, creating a floor for the price.' },
      ],
    },
    {
      id: '6', title: 'Global Markets', description: 'Understand how international markets interact, currency effects, and geopolitical factors influencing investments.',
      difficulty: 'Advanced', completed: false, totalQuestions: 3,
      questions: [
        { id: '16', question: 'How does a strengthening US dollar typically affect US exporters?', options: ['Increases their competitiveness abroad', 'Makes their products more expensive overseas', 'Has no effect on exports', 'Reduces import costs only'], correctAnswer: 1, explanation: 'A stronger US dollar makes American goods more expensive for foreign buyers, potentially reducing demand for US exports and hurting exporter revenues.' },
        { id: '17', question: 'What are emerging markets?', options: ['Markets that only trade technology stocks', 'Economies transitioning toward more advanced financial systems', 'Markets that operate only during certain hours', 'Stock exchanges less than 5 years old'], correctAnswer: 1, explanation: 'Emerging markets are economies in the process of rapid growth and industrialization, offering higher growth potential but also carrying more risk than developed markets.' },
        { id: '18', question: 'What is geopolitical risk in investing?', options: ['Risk from natural disasters only', 'Risk from political events and tensions affecting markets', 'Risk of technology failures', 'Risk from interest rate changes'], correctAnswer: 1, explanation: 'Geopolitical risk refers to the potential for political events, conflicts, or policy changes between nations to negatively impact investment returns.' },
      ],
    },
  ];

  readonly simulationScenarios: SimulationScenario[] = [
    {
      id: '1',
      title: 'Federal Reserve Announces Rate Hike',
      date: '2024-03-20',
      period: 'Q1 2024',
      newsHeadline: 'Fed raises interest rates by 25 basis points, signals more hikes ahead',
      newsContent: 'The Federal Reserve announced a 25-basis-point increase in the federal funds rate, bringing it to 5.50%. Chair Jerome Powell stated that inflation remains "too high" and that the committee is prepared for additional tightening if necessary. The labor market continues to show resilience with unemployment at 3.7%, while core PCE inflation stands at 3.2%, well above the 2% target. Powell emphasized a data-dependent approach, noting that the full effects of previous rate hikes have yet to be felt across the economy.',
      context: 'Inflation remains above target at 3.2%. Employment numbers strong. Consumer spending steady.',
      sector: 'Banking',
      difficulty: 'Beginner',
      actualResult: 'Banking stocks initially dipped 1-2% on the announcement but recovered within a week as markets had largely priced in the hike. JPMorgan and Bank of America reported increased net interest income in the following quarter. The 10-year Treasury yield rose to 4.35%. Regional banks faced continued pressure due to unrealized bond losses. The S&P 500 Financial sector gained 3.1% over the following month as higher rates boosted lending margins.',
      completed: true,
      similarityScore: 74,
      feedback: 'Your prediction closely matches the actual market outcome. You correctly identified the key market movements and their drivers.',
    },
    {
      id: '2',
      title: 'Major Tech Company Earnings Miss',
      date: '2024-01-25',
      period: 'Q1 2024',
      newsHeadline: 'Tech giant reports 15% revenue decline, lays off 10,000 employees',
      newsContent: 'A leading technology company reported Q4 earnings that fell significantly below analyst expectations, with revenue declining 15% year-over-year to $28.4 billion. The company announced plans to lay off approximately 10,000 employees, representing 8% of its global workforce. Digital advertising revenue dropped 22% as major advertisers cut spending amid economic uncertainty. Cloud division growth slowed to 12% from 29% a year earlier. The CEO acknowledged "headwinds across multiple business lines" and outlined a restructuring plan focused on AI integration and operational efficiency.',
      context: 'Advertising revenue down amid economic uncertainty. Cloud growth slowing. Competition intensifying.',
      sector: 'Technology',
      difficulty: 'Intermediate',
      actualResult: 'The stock dropped 12% in after-hours trading immediately following the announcement. The broader Nasdaq index fell 2.3% the next trading day on contagion fears. However, the restructuring was viewed positively by analysts long-term — the stock recovered 8% within three weeks as cost-cutting measures were seen as necessary. Competitor stocks also declined 3-5% initially. The layoffs signaled a broader tech sector correction, with several other companies announcing similar cuts in the following weeks. Cloud spending shifted toward AI-focused infrastructure.',
      completed: true,
      similarityScore: 52,
      feedback: 'You captured some of the key trends but missed certain nuances in the market reaction.',
    },
    {
      id: '3',
      title: 'Oil Production Cut Announced',
      date: '2023-11-30',
      period: 'Q4 2023',
      newsHeadline: 'OPEC+ agrees to cut production by 2 million barrels per day',
      newsContent: 'OPEC+ members reached a landmark agreement to reduce oil production by 2 million barrels per day starting January 2024, the largest cut since the pandemic-era reductions. Saudi Arabia will shoulder the largest share, cutting 1 million bpd, while Russia agreed to a 500,000 bpd reduction. The decision comes as global oil demand shows signs of weakening amid slower economic growth in China and Europe. Current Brent crude prices stand at $78 per barrel. The group cited "market stability" as the primary motivation, though analysts note the cuts aim to support prices above $80 per barrel.',
      context: 'Global demand recovering post-pandemic. Geopolitical tensions rising. Inventories at 5-year lows.',
      sector: 'Energy',
      difficulty: 'Advanced',
      actualResult: 'Brent crude surged 8% to $84.50 within the first week of the announcement. Energy stocks rallied broadly — Exxon Mobil gained 5.2%, Chevron rose 4.8%, and ConocoPhillips jumped 6.1%. However, the rally was short-lived as demand concerns persisted. By February, oil prices had retreated to $79 as China\'s economic recovery disappointed. Gasoline prices in the US rose $0.15/gallon on average. OPEC+ compliance was mixed, with some members exceeding their quotas. The energy sector outperformed the S&P 500 by 2.4% over the subsequent quarter.',
      completed: false,
    },
    {
      id: '4',
      title: 'Semiconductor Export Restrictions',
      date: '2024-06-15',
      period: 'Q2 2024',
      newsHeadline: 'US announces sweeping new chip export controls targeting advanced AI processors',
      newsContent: 'The US Department of Commerce announced expanded export restrictions on advanced semiconductor technology, specifically targeting AI-capable chips with performance above certain thresholds. The new rules restrict sales of cutting-edge GPUs and AI accelerators to several countries, expanding beyond previous China-focused restrictions. Companies like NVIDIA, AMD, and Intel will need special licenses for exports. The restrictions also cover semiconductor manufacturing equipment from US-allied nations. Industry groups estimate the rules could affect $15-20 billion in annual revenue across the sector.',
      context: 'AI chip demand surging globally. Geopolitical tech competition intensifying. Semiconductor supply chains being restructured.',
      sector: 'Technology',
      difficulty: 'Advanced',
      actualResult: 'NVIDIA shares fell 6.8% on the announcement, wiping $120 billion in market cap. AMD declined 4.5% and Intel dropped 3.2%. However, domestic semiconductor companies focused on US manufacturing saw gains — Intel\'s foundry division attracted renewed interest. Within a month, NVIDIA had largely recovered as analysts noted the company was developing compliant alternative chips for restricted markets. The Philadelphia Semiconductor Index (SOX) dropped 4.1% initially but rebounded 7% over six weeks. Long-term, the restrictions accelerated China\'s domestic chip development efforts.',
      completed: false,
    },
    {
      id: '5',
      title: 'Retail Sales Holiday Surge',
      date: '2024-12-26',
      period: 'Q4 2024',
      newsHeadline: 'Holiday retail sales exceed expectations with record $965 billion in spending',
      newsContent: 'The National Retail Federation reported that holiday season retail sales reached a record $965 billion, surpassing forecasts of $920 billion. E-commerce sales grew 14% year-over-year, while in-store traffic increased for the first time in three years. Consumer electronics and apparel led growth categories. Black Friday online sales alone hit $10.8 billion. Major retailers including Amazon, Walmart, and Target reported better-than-expected results. The strong spending was attributed to a resilient labor market, moderating inflation, and heavy promotional activity by retailers.',
      context: 'Consumer confidence rebounding. Inflation cooling to 2.8%. Strong employment data. E-commerce continues gaining share.',
      sector: 'Retail',
      difficulty: 'Beginner',
      actualResult: 'Retail stocks surged in early January — Amazon rose 4.2%, Walmart gained 3.8%, and Target jumped 5.1%. The Consumer Discretionary sector of the S&P 500 outperformed the broader index by 2.8% in the two weeks following the report. However, some analysts warned that the strong spending was driven by deep discounts, pressuring profit margins. Indeed, when Q4 earnings were reported, several retailers showed revenue beats but margin compression of 50-100 basis points. Shopify and other e-commerce enablers saw the strongest sustained gains of 6-8%.',
      completed: false,
    },
    {
      id: '6',
      title: 'Pharmaceutical Breakthrough Approval',
      date: '2024-09-10',
      period: 'Q3 2024',
      newsHeadline: 'FDA grants fast-track approval for groundbreaking Alzheimer\'s treatment',
      newsContent: 'The FDA granted accelerated approval for a novel Alzheimer\'s disease treatment that demonstrated a 35% slowing of cognitive decline in Phase 3 trials involving 1,800 patients. The drug, developed by a major pharmaceutical company, targets amyloid-beta plaques using a new mechanism of action. Annual treatment cost is estimated at $26,000 per patient, lower than competing therapies. The approval was based on 18 months of clinical data showing statistically significant improvements in cognitive and functional assessments. An estimated 6.7 million Americans currently live with Alzheimer\'s disease.',
      context: 'Healthcare innovation accelerating. Aging population driving demand. Insurance coverage debates ongoing.',
      sector: 'Healthcare',
      difficulty: 'Intermediate',
      actualResult: 'The developing company\'s stock soared 18% on the day of approval, adding $45 billion in market cap. Competitor stocks in the Alzheimer\'s space declined 5-8% as market share concerns emerged. The broader healthcare sector (XLV) gained 1.5% on renewed optimism about pharmaceutical innovation. Medicare announced preliminary coverage within 60 days, though with prior authorization requirements. Within three months, 50,000 patients had been prescribed the treatment. Insurance companies\' stocks dipped 1-2% on concerns about the cost burden. The company\'s revenue projections were revised upward by 12% for the following fiscal year.',
      completed: false,
    },
  ];

  readonly subscribedCompanies: SubscribedCompany[] = [
    { symbol: 'AAPL', name: 'Apple Inc.', sector: 'Technology' },
    { symbol: 'MSFT', name: 'Microsoft Corp.', sector: 'Technology' },
    { symbol: 'JPM', name: 'JPMorgan Chase', sector: 'Finance' },
    { symbol: 'TSLA', name: 'Tesla Inc.', sector: 'Automotive' },
  ];

  readonly subscribedSectors: SubscribedSector[] = [
    { name: 'Technology', companies: 156 },
    { name: 'Finance', companies: 89 },
    { name: 'Energy', companies: 45 },
  ];

  readonly filterCompanies = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'JPM', 'BAC', 'GS', 'XOM', 'CVX'];
  readonly filterSectors = ['Technology', 'Finance', 'Energy', 'Healthcare', 'Retail', 'Automotive', 'AI'];
  readonly calendarCompanies = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'JPM', 'NVDA', 'XOM'];
  readonly calendarSectors = ['Technology', 'Finance', 'Energy', 'Economy', 'Automotive', 'Healthcare'];
}
