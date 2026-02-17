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
    { id: '1', title: 'Apple Earnings Report', date: 'Feb 15', time: '4:30 PM EST', company: 'AAPL', sector: 'Technology', relevance: 'high' },
    { id: '2', title: 'FOMC Meeting Minutes', date: 'Feb 18', time: '2:00 PM EST', sector: 'Economy', relevance: 'high' },
    { id: '3', title: 'Tesla Investor Day', date: 'Feb 20', time: '10:00 AM EST', company: 'TSLA', sector: 'Automotive', relevance: 'medium' },
  ];

  readonly calendarEvents: CalendarEvent[] = [
    { id: '1', title: 'Apple Q1 Earnings Report', date: '2026-02-15', time: '4:30 PM EST', company: 'AAPL', sector: 'Technology', relevance: 'high', type: 'earnings' },
    { id: '2', title: 'FOMC Meeting Minutes Release', date: '2026-02-18', time: '2:00 PM EST', sector: 'Economy', relevance: 'high', type: 'economic' },
    { id: '3', title: 'Tesla Investor Day', date: '2026-02-20', time: '10:00 AM EST', company: 'TSLA', sector: 'Automotive', relevance: 'medium', type: 'conference' },
    { id: '4', title: 'Microsoft Dividend Payment', date: '2026-02-22', time: '9:00 AM EST', company: 'MSFT', sector: 'Technology', relevance: 'low', type: 'dividend' },
    { id: '5', title: 'Consumer Price Index Release', date: '2026-02-25', time: '8:30 AM EST', sector: 'Economy', relevance: 'high', type: 'economic' },
    { id: '6', title: 'Amazon Q1 Earnings Report', date: '2026-02-27', time: '4:00 PM EST', company: 'AMZN', sector: 'Technology', relevance: 'high', type: 'earnings' },
    { id: '7', title: 'JPMorgan Banking Conference', date: '2026-02-28', time: '9:00 AM EST', company: 'JPM', sector: 'Finance', relevance: 'medium', type: 'conference' },
    { id: '8', title: 'GDP Growth Report Q4', date: '2026-02-05', time: '8:30 AM EST', sector: 'Economy', relevance: 'high', type: 'economic' },
    { id: '9', title: 'Nvidia Earnings Call', date: '2026-02-10', time: '5:00 PM EST', company: 'NVDA', sector: 'Technology', relevance: 'high', type: 'earnings' },
    { id: '10', title: 'Exxon Q1 Earnings', date: '2026-02-12', time: '7:00 AM EST', company: 'XOM', sector: 'Energy', relevance: 'medium', type: 'earnings' },
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
    { id: '1', title: 'Federal Reserve Announces Rate Hike', date: 'Historical: March 2024', newsHeadline: 'Fed raises interest rates by 25 basis points, signals more hikes ahead', context: 'Inflation remains above target at 3.2%. Employment numbers strong. Consumer spending steady.', sector: 'Banking', difficulty: 'Beginner' },
    { id: '2', title: 'Major Tech Company Earnings Miss', date: 'Historical: January 2024', newsHeadline: 'Tech giant reports 15% revenue decline, lays off 10,000 employees', context: 'Advertising revenue down amid economic uncertainty. Cloud growth slowing. Competition intensifying.', sector: 'Technology', difficulty: 'Intermediate' },
    { id: '3', title: 'Oil Production Cut Announced', date: 'Historical: November 2023', newsHeadline: 'OPEC+ agrees to cut production by 2 million barrels per day', context: 'Global demand recovering post-pandemic. Geopolitical tensions rising. Inventories at 5-year lows.', sector: 'Energy', difficulty: 'Advanced' },
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
