import { useMemo, useState, type FormEvent, type ReactNode } from "react";
import {
  Activity,
  ArrowDownRight,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Bell,
  Bookmark,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  CircleDollarSign,
  CircleHelp,
  Download,
  ExternalLink,
  Eye,
  Filter,
  Info,
  Landmark,
  LayoutDashboard,
  LineChart,
  LockKeyhole,
  MoreHorizontal,
  PieChart,
  Plus,
  Search,
  Settings2,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Star,
  Target,
  TrendingDown,
  TrendingUp,
  Wallet,
  X,
} from "lucide-react";

type Page = "overview" | "etfs" | "etf-detail" | "compare" | "wheel" | "portfolio" | "watchlist";
type Period = "1M" | "6M" | "1Y" | "3Y" | "5Y";

type ETF = {
  symbol: string;
  name: string;
  group: string;
  strategy: string;
  yield: number;
  fee: number;
  return1y: number;
  return3y: number;
  erosion: number;
  rating: number;
  analyst: string;
  aum: string;
  frequency: string;
  nav: string;
  description: string;
  color: string;
  risk: string;
  inception: string;
  holdings: { symbol: string; name: string; weight: number }[];
};

type Stock = {
  symbol: string;
  name: string;
  price: number;
  change: number;
  rating: string;
  score: number;
  value: string;
  stability: string;
  dividend: number;
  sector: string;
  color: string;
};

type Position = {
  id: string;
  symbol: string;
  name: string;
  descriptor: string;
  allocation: number;
  estimatedYield: number;
  source: "ETF" | "Options" | "Cash" | "Stock";
  color: string;
};

const funds: ETF[] = [
  {
    symbol: "JEPI",
    name: "JPMorgan Equity Premium Income ETF",
    group: "Option income",
    strategy: "Covered calls + low-volatility U.S. equities",
    yield: 7.18,
    fee: 0.35,
    return1y: 10.42,
    return3y: 9.21,
    erosion: 0.42,
    rating: 4.3,
    analyst: "Silver  /  Above average",
    aum: "$39.8B",
    frequency: "Monthly",
    nav: "$57.84",
    description: "A lower-volatility large-cap portfolio paired with equity-linked notes designed to generate monthly income.",
    color: "#547b68",
    risk: "Moderate",
    inception: "May 2020",
    holdings: [
      { symbol: "NVIDIA", name: "NVIDIA Corp.", weight: 1.82 },
      { symbol: "MA", name: "Mastercard Inc.", weight: 1.69 },
      { symbol: "AMZN", name: "Amazon.com Inc.", weight: 1.63 },
      { symbol: "ABBV", name: "AbbVie Inc.", weight: 1.60 },
      { symbol: "MSFT", name: "Microsoft Corp.", weight: 1.56 },
    ],
  },
  {
    symbol: "SCHD",
    name: "Schwab U.S. Dividend Equity ETF",
    group: "Dividend growth",
    strategy: "Quality-screened dividend growers",
    yield: 3.71,
    fee: 0.06,
    return1y: 14.86,
    return3y: 11.72,
    erosion: 0.12,
    rating: 4.6,
    analyst: "Gold  /  Above average",
    aum: "$66.2B",
    frequency: "Quarterly",
    nav: "$28.43",
    description: "Established U.S. dividend payers selected for quality, cash flow, and a consistent record of distributions.",
    color: "#729180",
    risk: "Moderate",
    inception: "Oct 2011",
    holdings: [
      { symbol: "ABBV", name: "AbbVie Inc.", weight: 4.44 },
      { symbol: "HD", name: "The Home Depot Inc.", weight: 4.21 },
      { symbol: "KO", name: "The Coca-Cola Co.", weight: 4.13 },
      { symbol: "CVX", name: "Chevron Corp.", weight: 4.08 },
      { symbol: "AMGN", name: "Amgen Inc.", weight: 4.02 },
    ],
  },
  {
    symbol: "JEPQ",
    name: "JPMorgan Nasdaq Equity Premium Income ETF",
    group: "Option income",
    strategy: "Nasdaq-100 + equity-linked notes",
    yield: 9.64,
    fee: 0.35,
    return1y: 18.31,
    return3y: 17.46,
    erosion: 1.18,
    rating: 4.2,
    analyst: "Silver  /  Above average",
    aum: "$19.1B",
    frequency: "Monthly",
    nav: "$54.12",
    description: "Nasdaq-100 exposure with an options overlay that exchanges some upside participation for monthly income.",
    color: "#ba9c68",
    risk: "Moderate-high",
    inception: "May 2022",
    holdings: [
      { symbol: "NVDA", name: "NVIDIA Corp.", weight: 7.40 },
      { symbol: "AAPL", name: "Apple Inc.", weight: 7.10 },
      { symbol: "MSFT", name: "Microsoft Corp.", weight: 6.70 },
      { symbol: "AMZN", name: "Amazon.com Inc.", weight: 5.10 },
      { symbol: "AVGO", name: "Broadcom Inc.", weight: 4.60 },
    ],
  },
  {
    symbol: "DIVO",
    name: "Amplify CWP Enhanced Dividend Income ETF",
    group: "Option income",
    strategy: "Dividend stocks + selective covered calls",
    yield: 4.88,
    fee: 0.56,
    return1y: 15.23,
    return3y: 12.05,
    erosion: 0.28,
    rating: 4.1,
    analyst: "Bronze  /  Average",
    aum: "$4.6B",
    frequency: "Monthly",
    nav: "$40.06",
    description: "A concentrated portfolio of dividend growers with opportunistic, single-stock call writing.",
    color: "#9385aa",
    risk: "Moderate",
    inception: "Dec 2016",
    holdings: [
      { symbol: "AVGO", name: "Broadcom Inc.", weight: 5.14 },
      { symbol: "JPM", name: "JPMorgan Chase & Co.", weight: 5.04 },
      { symbol: "V", name: "Visa Inc.", weight: 4.90 },
      { symbol: "MSFT", name: "Microsoft Corp.", weight: 4.72 },
      { symbol: "AAPL", name: "Apple Inc.", weight: 4.56 },
    ],
  },
  {
    symbol: "VIG",
    name: "Vanguard Dividend Appreciation ETF",
    group: "Dividend growth",
    strategy: "U.S. companies with rising dividends",
    yield: 1.78,
    fee: 0.05,
    return1y: 16.08,
    return3y: 12.54,
    erosion: 0.08,
    rating: 4.5,
    analyst: "Gold  /  Above average",
    aum: "$91.4B",
    frequency: "Quarterly",
    nav: "$204.71",
    description: "A broad portfolio of profitable companies with a decade-plus history of dividend growth.",
    color: "#7e99a0",
    risk: "Moderate",
    inception: "Apr 2006",
    holdings: [
      { symbol: "AVGO", name: "Broadcom Inc.", weight: 4.12 },
      { symbol: "MSFT", name: "Microsoft Corp.", weight: 4.00 },
      { symbol: "JPM", name: "JPMorgan Chase & Co.", weight: 3.58 },
      { symbol: "XOM", name: "Exxon Mobil Corp.", weight: 3.36 },
      { symbol: "LLY", name: "Eli Lilly & Co.", weight: 3.12 },
    ],
  },
  {
    symbol: "VOO",
    name: "Vanguard S&P 500 ETF",
    group: "Broad market",
    strategy: "Market-cap weighted S&P 500 index",
    yield: 1.28,
    fee: 0.03,
    return1y: 18.42,
    return3y: 13.68,
    erosion: 0.04,
    rating: 4.7,
    analyst: "Gold  /  Above average",
    aum: "$598B",
    frequency: "Quarterly",
    nav: "$563.28",
    description: "Low-cost exposure to large U.S. companies that make up the S&P 500 Index.",
    color: "#778f91",
    risk: "Moderate-high",
    inception: "Sep 2010",
    holdings: [
      { symbol: "MSFT", name: "Microsoft Corp.", weight: 6.10 },
      { symbol: "NVDA", name: "NVIDIA Corp.", weight: 5.90 },
      { symbol: "AAPL", name: "Apple Inc.", weight: 5.80 },
      { symbol: "AMZN", name: "Amazon.com Inc.", weight: 3.90 },
      { symbol: "META", name: "Meta Platforms Inc.", weight: 2.60 },
    ],
  },
  {
    symbol: "SPYI",
    name: "NEOS S&P 500 High Income ETF",
    group: "Option income",
    strategy: "S&P 500 + index option spreads",
    yield: 11.26,
    fee: 0.68,
    return1y: 13.72,
    return3y: 12.44,
    erosion: 0.74,
    rating: 3.9,
    analyst: "Bronze  /  Average",
    aum: "$5.8B",
    frequency: "Monthly",
    nav: "$50.22",
    description: "A tax-aware options income approach built around S&P 500 exposure and index option spreads.",
    color: "#7d8cac",
    risk: "Moderate-high",
    inception: "Aug 2022",
    holdings: [
      { symbol: "VOO", name: "Vanguard S&P 500 ETF", weight: 48.20 },
      { symbol: "SPY", name: "SPDR S&P 500 ETF Trust", weight: 45.40 },
      { symbol: "BIL", name: "SPDR Bloomberg 1-3 Month T-Bill ETF", weight: 3.10 },
      { symbol: "CASH", name: "Cash & equivalents", weight: 2.30 },
    ],
  },
  {
    symbol: "QYLD",
    name: "Global X Nasdaq 100 Covered Call ETF",
    group: "Option income",
    strategy: "Nasdaq-100 buy-write index strategy",
    yield: 12.08,
    fee: 0.60,
    return1y: 9.46,
    return3y: 6.14,
    erosion: 2.64,
    rating: 3.2,
    analyst: "Neutral  /  Below average",
    aum: "$8.1B",
    frequency: "Monthly",
    nav: "$17.31",
    description: "A systematic at-the-money call-writing strategy that prioritizes distributions and caps much of the upside.",
    color: "#bf8a76",
    risk: "Moderate-high",
    inception: "Dec 2013",
    holdings: [
      { symbol: "NVDA", name: "NVIDIA Corp.", weight: 8.20 },
      { symbol: "AAPL", name: "Apple Inc.", weight: 7.40 },
      { symbol: "MSFT", name: "Microsoft Corp.", weight: 6.80 },
      { symbol: "AMZN", name: "Amazon.com Inc.", weight: 5.40 },
      { symbol: "META", name: "Meta Platforms Inc.", weight: 4.60 },
    ],
  },
];

const stocks: Stock[] = [
  { symbol: "MSFT", name: "Microsoft", price: 478.12, change: 0.84, rating: "Strong buy", score: 94, value: "Fair value", stability: "Very high", dividend: 0.72, sector: "Technology", color: "#668d9a" },
  { symbol: "JPM", name: "JPMorgan Chase", price: 286.74, change: 0.38, rating: "Buy", score: 91, value: "8% undervalued", stability: "High", dividend: 2.11, sector: "Financials", color: "#688a79" },
  { symbol: "AAPL", name: "Apple Inc.", price: 212.49, change: -0.26, rating: "Buy", score: 89, value: "Fair value", stability: "Very high", dividend: 0.48, sector: "Technology", color: "#73848d" },
  { symbol: "KO", name: "Coca-Cola", price: 62.18, change: 0.56, rating: "Buy", score: 88, value: "6% undervalued", stability: "Very high", dividend: 2.93, sector: "Consumer staples", color: "#ad7978" },
  { symbol: "V", name: "Visa Inc.", price: 346.55, change: 0.41, rating: "Strong buy", score: 92, value: "5% undervalued", stability: "Very high", dividend: 0.73, sector: "Financials", color: "#6b80a5" },
  { symbol: "GOOGL", name: "Alphabet", price: 176.84, change: 0.99, rating: "Buy", score: 90, value: "12% undervalued", stability: "High", dividend: 0.46, sector: "Communication", color: "#8f82a3" },
  { symbol: "XOM", name: "Exxon Mobil", price: 108.67, change: -0.14, rating: "Buy", score: 86, value: "Fair value", stability: "High", dividend: 3.42, sector: "Energy", color: "#b59a68" },
];

const periods: Period[] = ["1M", "6M", "1Y", "3Y", "5Y"];
const chartData: Record<Period, number[]> = {
  "1M": [30, 34, 31, 42, 40, 49, 44, 56, 53, 62, 60, 67, 64, 75, 72, 78, 73, 84, 81, 88, 85, 93],
  "6M": [22, 30, 27, 35, 32, 47, 40, 49, 45, 54, 48, 61, 57, 66, 60, 73, 69, 79, 73, 86, 84, 94],
  "1Y": [18, 23, 20, 29, 25, 36, 30, 43, 41, 38, 51, 47, 59, 54, 68, 64, 74, 70, 83, 79, 88, 95],
  "3Y": [12, 18, 16, 21, 20, 32, 29, 35, 33, 42, 38, 51, 46, 56, 53, 65, 60, 72, 69, 81, 76, 94],
  "5Y": [8, 14, 12, 20, 18, 28, 25, 32, 29, 39, 35, 48, 44, 53, 49, 63, 58, 69, 67, 80, 76, 94],
};

const initialPositions: Position[] = [
  { id: "schd", symbol: "SCHD", name: "Schwab U.S. Dividend Equity ETF", descriptor: "Dividend growth  /  Quarterly", allocation: 32, estimatedYield: 3.71, source: "ETF", color: "#254e3d" },
  { id: "jepi", symbol: "JEPI", name: "JPMorgan Equity Premium Income ETF", descriptor: "Option income  /  Monthly", allocation: 28, estimatedYield: 7.18, source: "ETF", color: "#789681" },
  { id: "wheel", symbol: "Wheel reserve", name: "Cash-secured put reserve", descriptor: "Options income  /  Flexible", allocation: 35, estimatedYield: 9.5, source: "Options", color: "#b8c8ad" },
  { id: "cash", symbol: "Cash", name: "Treasury & cash buffer", descriptor: "Liquidity  /  Monthly", allocation: 5, estimatedYield: 4.2, source: "Cash", color: "#e4e8dc" },
];

function money(value: number, digits = 2) {
  return value.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: digits, maximumFractionDigits: digits });
}

function pathFor(values: number[], width = 820, height = 250) {
  const left = 3;
  const right = width - 3;
  const top = 10;
  const bottom = height - 13;
  const path = values.map((value, index) => {
    const x = left + (index / (values.length - 1)) * (right - left);
    const y = bottom - (value / 100) * (bottom - top);
    return `${index === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
  }).join(" ");
  return { path, area: `${path} L ${right} ${bottom} L ${left} ${bottom} Z` };
}

function PerformanceChart({ period, comparison = false, id = "performance" }: { period: Period; comparison?: boolean; id?: string }) {
  const main = pathFor(chartData[period]);
  const compareValues = chartData[period].map((value, index) => Math.max(6, Math.min(92, value * 0.78 + Math.sin(index * 1.31) * 11 + 8)));
  const compare = pathFor(compareValues);
  return (
    <svg className={`performance-chart ${comparison ? "is-comparison" : ""}`} viewBox="0 0 820 250" role="img" aria-label={`${period} portfolio performance chart`} preserveAspectRatio="none">
      <defs>
        <linearGradient id={`fill-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4c836a" stopOpacity=".23" />
          <stop offset="100%" stopColor="#4c836a" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[34, 88, 142, 196].map((y) => <line key={y} x1="0" y1={y} x2="820" y2={y} className="chart-gridline" />)}
      <path d={main.area} fill={`url(#fill-${id})`} className="chart-area" />
      {comparison && <path d={compare.path} className="chart-secondary-line" />}
      <path d={main.path} className="chart-primary-line" />
      <circle cx="817" cy="27" r="4.5" className="chart-end-dot" />
    </svg>
  );
}

function ETFComparisonChart({ period, compared }: { period: Period; compared: ETF[] }) {
  const colors = ["#47785b", "#b59965", "#7d8cac"];
  const lines = compared.map((fund, index) => {
    const returnRate = period === "1Y" ? fund.return1y : period === "3Y" || period === "5Y" ? fund.return3y : fund.return1y * .68;
    const values = chartData[period].map((value, point) => Math.max(7, Math.min(96, value * (.68 + returnRate / 55) + Math.sin(point * 1.18 + index * 1.7) * (3 + index * 1.4) - index * 6)));
    return { ...pathFor(values), color: colors[index] };
  });
  return <svg className="performance-chart compare-series-chart" viewBox="0 0 820 250" role="img" aria-label={`ETF total return comparison for ${compared.map((fund) => fund.symbol).join(", ")}`} preserveAspectRatio="none">
    {[34, 88, 142, 196].map((y) => <line key={y} x1="0" y1={y} x2="820" y2={y} className="chart-gridline" />)}
    {lines.map((line, index) => <g key={compared[index].symbol}><path d={line.path} className="comparison-series-line" style={{ stroke: line.color, animationDelay: `${index * .14}s` }} /><circle cx="817" cy={Number(line.path.trim().split(" ").at(-1)) || 20} r="3.6" style={{ fill: line.color }} className="comparison-series-dot" /></g>)}
  </svg>;
}

function MiniSparkline({ positive = true, color }: { positive?: boolean; color?: string }) {
  const values = positive ? [12, 16, 13, 21, 18, 26, 24, 32, 30, 37, 36, 45] : [36, 33, 35, 29, 32, 25, 28, 22, 24, 18, 20, 14];
  const graph = pathFor(values, 128, 48);
  return <svg className="mini-sparkline" viewBox="0 0 128 48" aria-hidden="true"><path d={graph.path} style={{ stroke: color || (positive ? "#719782" : "#cc8c7b") }} /></svg>;
}

function BrandMark() {
  return <span className="brand-mark" aria-hidden="true"><span /><span /><span /><span /></span>;
}

function Sidebar({ page, onNavigate, watchCount }: { page: Page; onNavigate: (page: Page) => void; watchCount: number }) {
  const nav: { page: Page; label: string; icon: ReactNode }[] = [
    { page: "overview", label: "Overview", icon: <LayoutDashboard /> },
    { page: "etfs", label: "ETF research", icon: <LineChart /> },
    { page: "wheel", label: "Options wheel", icon: <CircleDollarSign /> },
    { page: "portfolio", label: "Portfolio builder", icon: <PieChart /> },
    { page: "watchlist", label: "Watchlist", icon: <Bookmark /> },
  ];
  const selectedPage: Page = page === "etf-detail" || page === "compare" ? "etfs" : page;
  return (
    <aside className="sidebar">
      <button className="brand-lockup" onClick={() => onNavigate("overview")} aria-label="Meridian home">
        <BrandMark /><span className="brand-word">meridian</span><span className="brand-period">.</span>
      </button>
      <div className="workspace-caption">PERSONAL INVESTING</div>
      <nav className="primary-nav" aria-label="Main navigation">
        {nav.map((item) => (
          <button key={item.page} aria-label={item.label} onClick={() => onNavigate(item.page)} className={`nav-item ${selectedPage === item.page ? "active" : ""}`}>
            <span className="nav-icon">{item.icon}</span><span className="nav-label">{item.label}</span>
            {item.page === "watchlist" && <span className="nav-count">{watchCount}</span>}
          </button>
        ))}
      </nav>
      <div className="sidebar-rule" />
      <div className="sidebar-section-label">YOUR TOOLKIT</div>
      <button aria-label="Fund comparison" className={`nav-item ${page === "compare" ? "active" : ""}`} onClick={() => onNavigate("compare")}>
        <span className="nav-icon"><SlidersHorizontal /></span><span className="nav-label">Fund comparison</span>
      </button>
      <div className="sidebar-bottom">
        <div className="sidebar-guide">
          <div className="guide-glow"><Sparkles size={15} /></div>
          <div className="guide-copy"><strong>Your investing plan</strong><span>One thoughtful step at a time.</span></div>
          <div className="guide-meter"><span /></div>
          <button onClick={() => onNavigate("portfolio")}>Continue building <ArrowRight size={13} /></button>
        </div>
        <div className="sidebar-disclosure"><LockKeyhole size={12} /> Private workspace <span> / </span> US markets</div>
        <button className="profile-switch" onClick={() => onNavigate("portfolio")}>
          <span className="avatar">AD</span><span className="profile-copy"><strong>Alex Davis</strong><span>Individual account</span></span><MoreHorizontal size={17} />
        </button>
      </div>
    </aside>
  );
}

function Topbar({ page, fundsSearch, setFundsSearch, onNavigate, onFundSelect, onStockSelect }: {
  page: Page;
  fundsSearch: string;
  setFundsSearch: (value: string) => void;
  onNavigate: (page: Page) => void;
  onFundSelect: (fund: ETF) => void;
  onStockSelect: (stock: Stock) => void;
}) {
  const [focused, setFocused] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const title: Record<Page, string> = {
    overview: "Overview", etfs: "ETF research", "etf-detail": "Fund profile", compare: "Fund comparison",
    wheel: "Options wheel", portfolio: "Portfolio builder", watchlist: "Watchlist",
  };
  const matches = useMemo(() => {
    if (!fundsSearch.trim()) return [];
    const term = fundsSearch.toLowerCase();
    return [
      ...funds.filter((fund) => `${fund.symbol} ${fund.name}`.toLowerCase().includes(term)).slice(0, 3).map((fund) => ({ type: "ETF", ticker: fund.symbol, label: fund.name, data: fund })),
      ...stocks.filter((stock) => `${stock.symbol} ${stock.name}`.toLowerCase().includes(term)).slice(0, 2).map((stock) => ({ type: "STOCK", ticker: stock.symbol, label: stock.name, data: stock })),
    ];
  }, [fundsSearch]);

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const term = fundsSearch.trim().toLowerCase();
    if (!term) return;
    const fund = funds.find((item) => item.symbol.toLowerCase() === term || item.name.toLowerCase().includes(term));
    if (fund) onFundSelect(fund);
    else {
      const stock = stocks.find((item) => item.symbol.toLowerCase() === term || item.name.toLowerCase().includes(term));
      if (stock) onStockSelect(stock);
      else onNavigate("etfs");
    }
    setFocused(false);
  }

  return (
    <header className="topbar">
      <div className="crumbs"><span>Workspace</span><ChevronRight size={14} /><strong>{title[page]}</strong></div>
      <div className="topbar-actions">
        <span className="market-indicator"><i /> US markets <span className="market-open">Open</span></span>
        <form className="global-search" onSubmit={submitSearch}>
          <Search size={16} />
          <input value={fundsSearch} onChange={(event) => setFundsSearch(event.target.value)} onFocus={() => setFocused(true)} onBlur={() => window.setTimeout(() => setFocused(false), 140)} placeholder="Search funds, stocks..." aria-label="Search funds and stocks" />
          <kbd>Ctrl K</kbd>
          {focused && fundsSearch && <div className="search-popover">
            {matches.length ? matches.map((match) => <button type="button" key={`${match.type}-${match.ticker}`} onMouseDown={(event) => event.preventDefault()} onClick={() => { if (match.type === "ETF") onFundSelect(match.data as ETF); else onStockSelect(match.data as Stock); setFocused(false); }}>
              <span className={`search-result-mark ${match.type === "STOCK" ? "stock" : ""}`}>{match.ticker.slice(0, 1)}</span><span><strong>{match.ticker}</strong><small>{match.label}</small></span><em>{match.type}</em>
            </button>) : <div className="search-empty">No matching funds or stocks. Press enter to explore ETFs.</div>}
          </div>}
        </form>
        <div className="top-action-wrap">
          <button className={`top-icon-button ${notificationsOpen ? "selected" : ""}`} aria-label="Notifications" onClick={() => setNotificationsOpen(!notificationsOpen)}><Bell size={18} /><i /></button>
          {notificationsOpen && <div className="notification-popover"><strong>You're all caught up</strong><p>Your next distribution watch is JEPI on June 18.</p><button onClick={() => { onNavigate("watchlist"); setNotificationsOpen(false); }}>View watchlist <ArrowRight size={13} /></button></div>}
        </div>
        <button className="top-icon-button help-button" aria-label="Help"><CircleHelp size={18} /></button>
      </div>
    </header>
  );
}

function PageHeading({ eyebrow, title, description, action }: { eyebrow?: string; title: ReactNode; description?: string; action?: ReactNode }) {
  return <div className="page-heading"><div>{eyebrow && <div className="eyebrow">{eyebrow}</div>}<h1>{title}</h1>{description && <p>{description}</p>}</div>{action && <div className="page-heading-action">{action}</div>}</div>;
}

function PeriodSelector({ value, onChange, light = false }: { value: Period; onChange: (period: Period) => void; light?: boolean }) {
  return <div className={`period-selector ${light ? "period-light" : ""}`}>{periods.map((period) => <button key={period} className={period === value ? "active" : ""} onClick={() => onChange(period)}>{period}</button>)}</div>;
}

function OverviewPage({ onNavigate, onFundSelect, onStockSelect, income }: { onNavigate: (page: Page) => void; onFundSelect: (fund: ETF) => void; onStockSelect: (stock: Stock) => void; income: number }) {
  const [period, setPeriod] = useState<Period>("1Y");
  return (
    <div className="page-content overview-page">
      <PageHeading eyebrow="MONDAY, JUNE 16   /   YOUR INVESTING DESK" title={<>A more intentional way<br className="desktop-break" /> to grow your portfolio.</>} description="Research income. Understand risk. Build a plan that feels like yours." action={<button className="button button-dark" onClick={() => onNavigate("portfolio")}>Open portfolio builder <ArrowRight size={16} /></button>} />

      <section className="overview-main-grid">
        <article className="surface performance-panel">
          <div className="performance-topline">
            <div><div className="section-overline"><span className="status-dot" /> PORTFOLIO VALUE <button className="plain-icon" aria-label="Portfolio value information"><Info size={13} /></button></div><div className="portfolio-value">$248,620<span>.84</span> <span className="value-change"><ArrowUpRight size={15} /> $12,480.36 <small>(5.28%)</small></span></div></div>
            <button className="icon-quiet" aria-label="More performance options"><MoreHorizontal size={19} /></button>
          </div>
          <div className="chart-subtitle"><span>Portfolio performance</span><span>vs. S&P 500</span></div>
          <div className="performance-chart-wrap"><PerformanceChart period={period} comparison id="overview" /></div>
          <div className="chart-axis"><span>Jun 16, 2024</span><span>Sep 16</span><span>Dec 16</span><span>Mar 16</span><span>Today</span></div>
          <div className="performance-footer"><div className="chart-legend"><span><i className="legend-primary" /> Your portfolio</span><span><i className="legend-secondary" /> S&amp;P 500</span></div><PeriodSelector value={period} onChange={setPeriod} /></div>
        </article>

        <aside className="overview-rail">
          <article className="income-summary surface">
            <div className="section-overline">INCOME AT A GLANCE <button className="plain-icon" aria-label="Income information"><Info size={13} /></button></div>
            <div className="income-total">{money(income, 0)}<span>/mo</span></div>
            <div className="income-summary-caption">Estimated income in your plan</div>
            <div className="income-trend"><span><ArrowUpRight size={14} /> 8.6%</span> vs. last 12 months</div>
            <div className="income-mini-bars" aria-label="Income by month">
              {[48, 56, 51, 66, 61, 76, 69, 83, 78, 92, 84, 100].map((height, index) => <span key={index} style={{ height: `${height}%` }} className={index === 11 ? "current" : ""} />)}
            </div>
            <div className="income-months"><span>JUL</span><span>SEP</span><span>NOV</span><span>JAN</span><span>MAR</span><span>JUN</span></div>
            <button className="text-link" onClick={() => onNavigate("portfolio")}>Explore income plan <ArrowRight size={14} /></button>
          </article>
          <article className="next-dates surface">
            <div className="rail-head"><div><div className="section-overline">UP NEXT</div><h3>Distribution dates</h3></div><button className="quiet-text-button" onClick={() => onNavigate("watchlist")}>See all</button></div>
            <div className="date-row"><div className="date-number"><span>JUN</span><strong>18</strong></div><div className="date-copy"><strong>JEPI ex-dividend</strong><span>Est. $0.36 / share</span></div><span className="date-tag">2 days</span></div>
            <div className="date-row"><div className="date-number"><span>JUN</span><strong>20</strong></div><div className="date-copy"><strong>DIVO ex-dividend</strong><span>Est. $0.16 / share</span></div><span className="date-tag">4 days</span></div>
            <div className="date-row"><div className="date-number"><span>JUN</span><strong>25</strong></div><div className="date-copy"><strong>SCHD record date</strong><span>Quarterly distribution</span></div><span className="date-tag muted">9 days</span></div>
          </article>
        </aside>
      </section>

      <section className="dashboard-lower-grid">
        <article className="surface research-shortlist">
          <div className="section-heading-line"><div><div className="section-overline">RESEARCH SHORTLIST</div><h2>Funds worth a closer look</h2><p>Curated across income, growth, and option strategies.</p></div><button className="quiet-text-button" onClick={() => onNavigate("etfs")}>Explore all funds <ArrowRight size={14} /></button></div>
          <div className="shortlist-table">
            <div className="shortlist-head"><span>FUND</span><span>YIELD</span><span>1Y RETURN</span><span>VIEW</span></div>
            {[funds[0], funds[1], funds[2]].map((fund) => <button className="shortlist-row" key={fund.symbol} onClick={() => onFundSelect(fund)}>
              <span className="fund-name-cell"><i style={{ background: fund.color }}>{fund.symbol.slice(0, 1)}</i><span><strong>{fund.symbol}</strong><small>{fund.group}</small></span></span>
              <strong className="yield-number">{fund.yield.toFixed(2)}%</strong><span className={`shortlist-return ${fund.return1y > 0 ? "positive-number" : "negative-number"}`}><span>+{fund.return1y.toFixed(1)}%</span><MiniSparkline color={fund.color} /></span><span className="row-arrow"><ArrowUpRight size={16} /></span>
            </button>)}
          </div>
        </article>
        <article className="surface wheel-teaser">
          <div className="wheel-teaser-top"><div><div className="section-overline">WHEEL STRATEGY SCANNER</div><h2>Quality first.<br />Premium second.</h2></div><div className="teaser-icon"><Activity size={19} /></div></div>
          <p>Explore put contracts on companies you'd be comfortable owning, filtered by risk, rating, and return on collateral.</p>
          <div className="teaser-stock-list">{stocks.slice(0, 3).map((stock) => <button key={stock.symbol} onClick={() => onStockSelect(stock)}><span className="stock-monogram" style={{ background: stock.color }}>{stock.symbol[0]}</span><span><strong>{stock.symbol}</strong><small>{stock.rating}  /  {stock.value}</small></span><span className="teaser-score">{stock.score}<small>/100</small></span><ArrowRight size={14} /></button>)}</div>
          <button className="text-link" onClick={() => onNavigate("wheel")}>Open wheel strategy scanner <ArrowRight size={14} /></button>
        </article>
      </section>

      <div className="insight-strip"><span className="insight-symbol"><Sparkles size={15} /></span><p><strong>A useful reminder</strong> High distribution yield isn't the same as total return. Compare fund payouts with NAV health and price performance before making a decision.</p><button onClick={() => onNavigate("etfs")}>Review ETF health <ArrowRight size={14} /></button></div>
      <div className="sample-disclaimer">Illustrative sample data for educational purposes. Not investment advice.</div>
    </div>
  );
}

function ETFExplorer({ onFundSelect, savedFunds, onToggleSaved, compareIds, onToggleCompare, onCompare }: {
  onFundSelect: (fund: ETF) => void; savedFunds: string[]; onToggleSaved: (symbol: string) => void; compareIds: string[]; onToggleCompare: (symbol: string) => void; onCompare: () => void;
}) {
  const [query, setQuery] = useState("");
  const [strategy, setStrategy] = useState("All strategies");
  const [minYield, setMinYield] = useState("0");
  const [maxFee, setMaxFee] = useState("0.75");
  const [monthlyOnly, setMonthlyOnly] = useState(false);
  const [healthyOnly, setHealthyOnly] = useState(false);
  const [sort, setSort] = useState("yield");
  const visibleFunds = useMemo(() => funds.filter((fund) => {
    const term = query.toLowerCase().trim();
    return (!term || `${fund.symbol} ${fund.name} ${fund.strategy}`.toLowerCase().includes(term))
      && (strategy === "All strategies" || fund.group === strategy)
      && fund.yield >= Number(minYield)
      && fund.fee <= Number(maxFee)
      && (!monthlyOnly || fund.frequency === "Monthly")
      && (!healthyOnly || fund.erosion < 1);
  }).sort((a, b) => sort === "yield" ? b.yield - a.yield : sort === "return" ? b.return1y - a.return1y : a.fee - b.fee), [query, strategy, minYield, maxFee, monthlyOnly, healthyOnly, sort]);
  const reset = () => { setQuery(""); setStrategy("All strategies"); setMinYield("0"); setMaxFee("0.75"); setMonthlyOnly(false); setHealthyOnly(false); };
  return (
    <div className="page-content explorer-page">
      <PageHeading eyebrow="ETF RESEARCH  /  UNITED STATES" title="Find funds that fit your plan." description="Look beyond the headline yield. Compare income, total return, NAV behavior, holdings, and the strategy underneath." action={<button className="button button-dark" onClick={onCompare}><SlidersHorizontal size={16} /> Compare funds{compareIds.length > 0 ? `  /  ${compareIds.length}` : ""}</button>} />
      <div className="explorer-layout">
        <aside className="filter-rail surface">
          <div className="filter-rail-heading"><span><SlidersHorizontal size={16} /> Refine funds</span><button onClick={reset}>Reset</button></div>
          <label className="field-label" htmlFor="fund-search">Fund or strategy</label>
          <div className="field-with-icon"><Search size={15} /><input id="fund-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Try JEPI or covered calls" /></div>
          <div className="filter-divider" />
          <div className="filter-group"><label className="field-label" htmlFor="fund-strategy">Strategy</label><div className="select-wrap"><select id="fund-strategy" value={strategy} onChange={(event) => setStrategy(event.target.value)}><option>All strategies</option><option>Option income</option><option>Dividend growth</option><option>Broad market</option></select><ChevronDown size={14} /></div></div>
          <div className="filter-group"><div className="label-with-value"><label className="field-label" htmlFor="min-yield">Minimum distribution yield</label><strong>{Number(minYield).toFixed(0)}%+</strong></div><input className="range-input" id="min-yield" type="range" min="0" max="12" step="1" value={minYield} onChange={(event) => setMinYield(event.target.value)} /><div className="range-captions"><span>Any</span><span>12%+</span></div></div>
          <div className="filter-group"><label className="field-label" htmlFor="max-fee">Maximum expense ratio</label><div className="select-wrap"><select id="max-fee" value={maxFee} onChange={(event) => setMaxFee(event.target.value)}><option value="0.75">Up to 0.75%</option><option value="0.35">Up to 0.35%</option><option value="0.15">Up to 0.15%</option><option value="0.07">Up to 0.07%</option><option value="1">Any fee</option></select><ChevronDown size={14} /></div></div>
          <div className="filter-divider" />
          <label className="check-control"><input type="checkbox" checked={monthlyOnly} onChange={(event) => setMonthlyOnly(event.target.checked)} /><span className="custom-check"><Check size={12} /></span><span>Monthly distributions</span></label>
          <label className="check-control"><input type="checkbox" checked={healthyOnly} onChange={(event) => setHealthyOnly(event.target.checked)} /><span className="custom-check"><Check size={12} /></span><span>Lower NAV erosion <small>Under 1% annually</small></span></label>
          <div className="filter-note"><Info size={14} /><span>Screening criteria are a starting point, not a recommendation. Distribution rates can change.</span></div>
        </aside>
        <section className="results-section">
          <div className="results-toolbar"><div><strong>{visibleFunds.length} funds</strong><span> meet your filters</span>{compareIds.length > 0 && <em>{compareIds.length} selected to compare</em>}</div><label className="sort-control"><span>Sort by</span><select value={sort} onChange={(event) => setSort(event.target.value)}><option value="yield">Distribution yield</option><option value="return">1-year return</option><option value="fee">Lowest fee</option></select><ChevronDown size={13} /></label></div>
          <div className="table-shell surface">
            <div className="table-scroll"><table className="fund-table"><thead><tr><th className="fund-th">FUND / STRATEGY</th><th>DISTRIBUTION<br />YIELD <Info size={12} /></th><th>1Y TOTAL<br />RETURN <Info size={12} /></th><th>EXPENSE<br />RATIO</th><th>NAV HEALTH</th><th>ANALYST<br />VIEW</th><th aria-label="Actions" /></tr></thead>
              <tbody>{visibleFunds.map((fund) => <tr className="fund-result-row" key={fund.symbol} onClick={() => onFundSelect(fund)}>
                <td><div className="fund-result-name"><span className="fund-monogram" style={{ background: fund.color }}>{fund.symbol.slice(0, 1)}</span><span><strong>{fund.symbol}</strong><small>{fund.group} <b> / </b> {fund.name}</small></span></div></td>
                <td><strong className="table-primary-value">{fund.yield.toFixed(2)}%</strong><small className="table-muted">{fund.frequency}</small></td>
                <td><strong className="positive-number">+{fund.return1y.toFixed(2)}%</strong><small className="table-muted">1 year, annualized</small></td>
                <td><strong>{fund.fee.toFixed(2)}%</strong><small className="table-muted">annual fee</small></td>
                <td><span className={`health-label ${fund.erosion > 1 ? "health-watch" : ""}`}><i />{fund.erosion < 0.5 ? "Resilient" : fund.erosion < 1 ? "Monitor" : "Elevated"}</span><small className="table-muted">{fund.erosion.toFixed(2)}% erosion</small></td>
                <td><span className="analyst-stars"><Star size={12} fill="currentColor" /> {fund.rating.toFixed(1)}</span><small className="table-muted">{fund.analyst.split("  /  ")[0]}</small></td>
                <td><div className="row-actions"><button className={`small-icon-action ${savedFunds.includes(fund.symbol) ? "saved" : ""}`} title={savedFunds.includes(fund.symbol) ? "Remove from watchlist" : "Add to watchlist"} onClick={(event) => { event.stopPropagation(); onToggleSaved(fund.symbol); }}><Bookmark size={15} fill={savedFunds.includes(fund.symbol) ? "currentColor" : "none"} /></button><button className={`small-icon-action ${compareIds.includes(fund.symbol) ? "saved" : ""}`} title="Select to compare" onClick={(event) => { event.stopPropagation(); onToggleCompare(fund.symbol); }}><Plus size={16} /></button></div></td>
              </tr>)}</tbody>
            </table>
            {visibleFunds.length === 0 && <div className="no-results"><Search size={20} /><strong>No funds match these filters</strong><span>Try easing a yield, fee, or NAV health filter.</span><button className="button button-outline" onClick={reset}>Clear filters</button></div>}
            </div>
            <div className="table-footnote"><Info size={13} /> Yield reflects recent distribution rates and is not guaranteed. Sample data shown for product demonstration.</div>
          </div>
          <div className="result-bottom-note"><span><ShieldCheck size={16} /> Research with context</span><p>See the distribution history, NAV behavior, fund holdings, and methodology before adding a fund to your plan.</p></div>
        </section>
      </div>
    </div>
  );
}

function RatingStars({ value }: { value: number }) {
  return <span className="rating-stars" aria-label={`${value} out of 5 stars`}>{[1, 2, 3, 4, 5].map((index) => <Star key={index} size={13} fill={index <= Math.round(value) ? "currentColor" : "none"} />)}</span>;
}

function DistributionBars() {
  const values = [52, 44, 68, 56, 64, 48, 74, 62, 80, 58, 92, 76];
  return <div className="distribution-bars">{values.map((height, index) => <div className="distribution-bar-item" key={index}><div className="bar-payout" style={{ height: `${height}%` }} /><span>{["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"][index]}</span></div>)}</div>;
}

function ETFDetail({ fund, onBack, onToggleSaved, saved, onAddToPortfolio, onCompare }: { fund: ETF; onBack: () => void; onToggleSaved: () => void; saved: boolean; onAddToPortfolio: () => void; onCompare: () => void }) {
  const [period, setPeriod] = useState<Period>("1Y");
  const [tab, setTab] = useState("Overview");
  return (
    <div className="page-content detail-page">
      <button className="back-link" onClick={onBack}><ArrowLeft size={15} /> Back to ETF research</button>
      <div className="fund-profile-heading">
        <div className="fund-profile-title"><span className="profile-fund-mark" style={{ background: fund.color }}>{fund.symbol.slice(0, 1)}</span><div><div className="eyebrow">U.S. ETF PROFILE <span> / </span> UPDATED JUNE 16</div><h1>{fund.symbol}<span className="fund-full-name">{fund.name}</span></h1><p>{fund.description}</p><div className="fund-tags"><span>{fund.group}</span><span>{fund.frequency} distributions</span><span>{fund.risk} risk</span></div></div></div>
        <div className="profile-actions"><button className={`button button-outline ${saved ? "button-saved" : ""}`} onClick={onToggleSaved}><Bookmark size={15} fill={saved ? "currentColor" : "none"} /> {saved ? "Saved" : "Save fund"}</button><button className="button button-dark" onClick={onAddToPortfolio}><Plus size={16} /> Add to portfolio</button><button className="icon-button-outline" onClick={onCompare} aria-label="Compare fund"><SlidersHorizontal size={17} /></button></div>
      </div>
      <div className="fund-stats-strip surface">
        <div><span>Distribution yield <Info size={12} /></span><strong className="stat-yield">{fund.yield.toFixed(2)}%</strong><small>Trailing 12 month</small></div>
        <div><span>1-year total return</span><strong className="positive-number">+{fund.return1y.toFixed(2)}%</strong><small>Market price  /  annualized</small></div>
        <div><span>Expense ratio</span><strong>{fund.fee.toFixed(2)}%</strong><small>Annual operating fee</small></div>
        <div><span>NAV erosion <Info size={12} /></span><strong className={fund.erosion > 1 ? "negative-number" : "positive-number"}>{fund.erosion.toFixed(2)}%</strong><small>Price return vs. total return</small></div>
        <div><span>Assets under management</span><strong>{fund.aum}</strong><small>Fund size</small></div>
      </div>
      <section className="detail-performance-layout">
        <article className="surface detail-chart-panel">
          <div className="detail-panel-top"><div><div className="section-overline">GROWTH OF $10,000</div><h2>Performance &amp; NAV health</h2></div><PeriodSelector value={period} onChange={setPeriod} /></div>
          <div className="detail-chart-legend"><span><i className="legend-primary" /> Total return</span><span><i className="legend-secondary" /> NAV / price return</span></div>
          <div className="performance-chart-wrap detail-chart-wrap"><PerformanceChart period={period} comparison id={`detail-${fund.symbol}`} /></div>
          <div className="chart-axis"><span>Jun 2020</span><span>2021</span><span>2022</span><span>2023</span><span>Today</span></div>
        </article>
        <aside className="surface fund-quality-panel">
          <div className="section-overline">INDEPENDENT PERSPECTIVE <Info size={13} /></div>
          <div className="quality-rating"><RatingStars value={fund.rating} /><span>{fund.rating.toFixed(1)}<small>/5</small></span></div>
          <strong className="quality-label">{fund.analyst}</strong><p>Analyst view considers process, people, performance, and price. Use it as one input, not a buy or sell signal.</p>
          <div className="quality-divider" />
          <div className="quality-risk"><span>Distribution consistency</span><strong><span className="quality-dot" /> {fund.frequency === "Monthly" ? "Monthly  /  variable" : "Quarterly  /  variable"}</strong></div>
          <div className="quality-risk"><span>Inception date</span><strong>{fund.inception}</strong></div>
          <button className="text-link" onClick={() => setTab("Methodology")}>Understand the strategy <ArrowRight size={14} /></button>
        </aside>
      </section>
      <nav className="detail-tabs" aria-label="Fund research sections">{["Overview", "Distributions", "Holdings", "Methodology"].map((item) => <button key={item} className={tab === item ? "active" : ""} onClick={() => setTab(item)}>{item}</button>)}</nav>
      {tab === "Overview" && <section className="detail-content-grid">
        <article className="surface detail-content-panel"><div className="section-heading-line"><div><div className="section-overline">INCOME PROFILE</div><h2>What your distributions can tell you</h2></div><button className="quiet-text-button" onClick={() => setTab("Distributions")}>Full history <ArrowRight size={13} /></button></div><div className="distribution-overview"><div><span>Most recent distribution</span><strong>{fund.frequency === "Monthly" ? "$0.36" : "$0.62"}<small>/share</small></strong><em>Recent payout  /  variable</em></div><div className="distribution-annual"><span>Distribution cadence</span><strong>{fund.frequency}</strong><em>May change over time</em></div></div><DistributionBars /><div className="small-chart-caption"><span>Monthly distributions can fluctuate.</span><button onClick={() => setTab("Distributions")}>View ex-dividend dates <ArrowRight size={13} /></button></div></article>
        <article className="surface detail-content-panel holdings-preview"><div className="section-heading-line"><div><div className="section-overline">TOP POSITIONS</div><h2>What's inside the fund</h2></div><button className="quiet-text-button" onClick={() => setTab("Holdings")}>All holdings <ArrowRight size={13} /></button></div>{fund.holdings.slice(0, 4).map((holding, index) => <div className="holding-row" key={holding.symbol}><span className="holding-index">0{index + 1}</span><span className="holding-name"><strong>{holding.symbol}</strong><small>{holding.name}</small></span><div className="weight-track"><i style={{ width: `${Math.min(100, holding.weight * 10)}%` }} /></div><strong className="holding-weight">{holding.weight.toFixed(2)}%</strong></div>)}<div className="holdings-disclaimer"><Info size={12} /> Holdings and weights shown as illustrative snapshot data.</div></article>
        <article className="surface methodology-summary"><span className="method-icon"><Settings2 size={17} /></span><div><div className="section-overline">HOW IT WORKS</div><h2>{fund.group === "Option income" ? "A rules-based options overlay" : "A quality-first selection process"}</h2><p>{fund.strategy}. Understand what the fund owns, how its income is generated, and what trade-offs may come with the approach.</p><button className="text-link" onClick={() => setTab("Methodology")}>Read the fund methodology <ArrowRight size={13} /></button></div><div className="method-balance"><span>Potential income</span><i /><span>Upside participation</span></div></article>
        <article className="surface key-considerations"><div className="section-overline">BEFORE YOU INVEST</div><h2>Questions to ask</h2><ul><li><CheckCircle2 size={14} /> Is the payout supported by fund earnings, option premiums, or return of capital?</li><li><CheckCircle2 size={14} /> Has NAV held up across a full market cycle?</li><li><CheckCircle2 size={14} /> Does this fund duplicate companies you already own?</li></ul><button className="quiet-text-button" onClick={onCompare}>Compare against another fund <ArrowRight size={13} /></button></article>
      </section>}
      {tab === "Distributions" && <section className="detail-content-grid distribution-tab-content">
        <article className="surface detail-content-panel distribution-full-panel"><div className="section-heading-line"><div><div className="section-overline">DISTRIBUTION HISTORY</div><h2>Income can vary month to month</h2><p>Look at the full pattern rather than annualizing one recent payment.</p></div><button className="button button-outline"><Download size={14} /> Export history</button></div><DistributionBars /><div className="distribution-table-wrap"><table className="data-table"><thead><tr><th>EX-DIVIDEND DATE</th><th>RECORD DATE</th><th>PAY DATE</th><th>AMOUNT / SHARE</th><th>CHANGE</th></tr></thead><tbody>{[
          ["May 1, 2025", "May 1, 2025", "May 5, 2025", "$0.35", "-4.1%"], ["Apr 1, 2025", "Apr 1, 2025", "Apr 4, 2025", "$0.37", "+2.8%"], ["Mar 3, 2025", "Mar 3, 2025", "Mar 6, 2025", "$0.36", "+5.9%"], ["Feb 3, 2025", "Feb 3, 2025", "Feb 6, 2025", "$0.34", "-8.1%"], ["Jan 2, 2025", "Jan 2, 2025", "Jan 6, 2025", "$0.37", "+2.7%"],
        ].map((row, rowIndex) => <tr key={rowIndex}>{row.map((cell, index) => <td className={index === 3 ? "table-primary-value" : ""} key={`${rowIndex}-${index}`}>{cell}</td>)}</tr>)}</tbody></table></div><div className="table-footnote"><Info size={13} /> Payout history shown for interface illustration; verify official fund sponsor data before investing.</div></article>
        <article className="surface distribution-context"><div className="section-overline">A NOTE ON YIELD</div><div className="context-number">{fund.yield.toFixed(2)}<span>%</span></div><h3>Trailing distribution rate</h3><p>This annualizes recent distributions against the current share price. It is not a forecast of future income or total return.</p><div className="context-divider" /><span className="ex-date-badge"><CalendarDays size={15} /> Next estimated ex-date  /  Jun 18</span><div className="context-warning"><Info size={14} /> A fund may distribute dividends, option premium, capital gains, or return of capital. Tax treatment varies.</div></article>
      </section>}
      {tab === "Holdings" && <section className="surface full-holdings-panel"><div className="section-heading-line"><div><div className="section-overline">PORTFOLIO COMPOSITION</div><h2>Underlying holdings</h2><p>Review concentration, sector exposure, and overlap with the rest of your portfolio.</p></div><div className="as-of-label">Illustrative snapshot <ChevronDown size={14} /></div></div><div className="distribution-table-wrap"><table className="data-table holdings-table"><thead><tr><th>#</th><th>HOLDING</th><th>SECTOR</th><th>WEIGHT</th><th>PORTFOLIO SHARE</th></tr></thead><tbody>{fund.holdings.concat([{ symbol: "CASH", name: "Cash & equivalents", weight: Math.max(0.6, 100 - fund.holdings.reduce((total, item) => total + item.weight, 0)) }]).map((holding, index) => <tr key={holding.symbol}><td className="table-muted">{String(index + 1).padStart(2, "0")}</td><td><strong>{holding.symbol}</strong><small className="table-muted block">{holding.name}</small></td><td>{index < 2 ? "Information technology" : index === 4 ? "Health care" : "Financials"}</td><td><strong>{holding.weight.toFixed(2)}%</strong></td><td><div className="weight-track wide"><i style={{ width: `${Math.min(100, holding.weight * 9)}%` }} /></div></td></tr>)}</tbody></table></div><div className="holdings-disclaimer"><Info size={12} /> Top positions only. Holdings can change. Data is illustrative and not real-time.</div></section>}
      {tab === "Methodology" && <section className="methodology-detail-grid"><article className="surface methodology-story"><div className="section-overline">THE INVESTMENT APPROACH</div><h2>{fund.strategy}</h2><p>{fund.description}</p><p>Before choosing this fund, understand how the strategy is implemented, what the fund can hold, and what it gives up in exchange for its target outcome. The stated distribution rate does not represent guaranteed income.</p><div className="strategy-flow"><div><span>01</span><strong>Portfolio universe</strong><small>Eligible U.S. listed securities</small></div><ArrowRight size={16} /><div><span>02</span><strong>Fund construction</strong><small>Rules and manager discretion</small></div><ArrowRight size={16} /><div><span>03</span><strong>Investor outcome</strong><small>Income, risk, and total return</small></div></div></article><article className="surface tradeoff-panel"><div className="section-overline">TRADE-OFFS TO UNDERSTAND</div><h2>Potential benefit, possible cost</h2><div className="tradeoff-row"><span className="tradeoff-icon positive"><TrendingUp size={16} /></span><div><strong>Potential income stream</strong><p>Regular distributions may help support cash-flow goals.</p></div></div><div className="tradeoff-row"><span className="tradeoff-icon caution"><TrendingDown size={16} /></span><div><strong>Upside can be limited</strong><p>Option strategies may lag in a strong rising market.</p></div></div><div className="tradeoff-row"><span className="tradeoff-icon caution"><Activity size={16} /></span><div><strong>Distributions can fluctuate</strong><p>Payouts, tax character, and NAV may change over time.</p></div></div><button className="button button-outline" onClick={() => onCompare}>Compare fund trade-offs <ArrowRight size={14} /></button></article></section>}
      <div className="sample-disclaimer">Fund profile is a research aid using illustrative sample data. Confirm all current fund details with the sponsor.</div>
    </div>
  );
}

type Contract = { expiry: string; dte: number; strike: number; bid: number; delta: number; roc: number; assignment: number; iv: number; openInterest: number };

function buildContracts(stock: Stock, strategy: "put" | "call", dte = 35): Contract[] {
  const step = stock.price > 250 ? 5 : stock.price > 100 ? 2.5 : 2.5;
  const offsets = strategy === "put" ? [0.065, 0.05, 0.035, 0.02] : [0.02, 0.035, 0.05, 0.065];
  const premiums = strategy === "put" ? [0.85, 1.08, 1.58, 2.28] : [1.12, 1.73, 2.42, 3.35];
  const deltas = [0.09, 0.13, 0.18, 0.25];
  return offsets.map((offset, index) => {
    const raw = stock.price * (strategy === "put" ? 1 - offset : 1 + offset);
    const strike = Math.round(raw / step) * step;
    const bid = premiums[index] * (stock.price / 212.49) ** 0.45;
    const roc = (bid / strike) * (365 / dte) * 100;
    const expiry = dte > 45 ? "Aug 15" : dte < 30 ? "Jun 20" : "Jul 18";
    return { expiry, dte, strike, bid, delta: deltas[index], roc, assignment: Math.round(deltas[index] * 100), iv: 23 + index * 1.9, openInterest: [842, 1260, 924, 608][index] };
  });
}

function OptionsWheel({ selectedStock, setSelectedStock, strategy, setStrategy, savedStocks, onToggleSavedStock, onOpenTrade }: {
  selectedStock: Stock; setSelectedStock: (stock: Stock) => void; strategy: "put" | "call"; setStrategy: (strategy: "put" | "call") => void; savedStocks: string[]; onToggleSavedStock: (symbol: string) => void; onOpenTrade: (contract: Contract, strategy: "put" | "call") => void;
}) {
  const [stockQuery, setStockQuery] = useState("");
  const [maxAssignment, setMaxAssignment] = useState("22");
  const [minRoc, setMinRoc] = useState("4");
  const [dteWindow, setDteWindow] = useState("30-45 days");
  const [qualityOnly, setQualityOnly] = useState(true);
  const selectedDte = dteWindow === "21-35 days" ? 28 : dteWindow === "45-60 days" ? 52 : 35;
  const contracts = useMemo(() => buildContracts(selectedStock, strategy, selectedDte).filter((contract) => contract.assignment <= Number(maxAssignment) && contract.roc >= Number(minRoc)), [selectedStock, strategy, selectedDte, maxAssignment, minRoc]);
  const filteredStocks = stocks.filter((stock) => !stockQuery || `${stock.symbol} ${stock.name}`.toLowerCase().includes(stockQuery.toLowerCase())).filter((stock) => !qualityOnly || Number(stock.score) >= 86);
  const activeStock = selectedStock;
  return (
    <div className="page-content wheel-page">
      <PageHeading eyebrow="OPTIONS  /  U.S. EQUITIES ONLY" title="A smarter way to wheel." description="Start with a company you'd be happy to own. Then compare the premium against the capital, time, and assignment risk involved." action={<button className="button button-outline" onClick={() => onToggleSavedStock(activeStock.symbol)}><Bookmark size={15} fill={savedStocks.includes(activeStock.symbol) ? "currentColor" : "none"} /> {savedStocks.includes(activeStock.symbol) ? "Saved stock" : "Save stock"}</button>} />
      <div className="wheel-stepper"><div className="stepper-item active"><span>01</span><div><strong>Pick a quality stock</strong><small>Own it happily at the strike</small></div></div><i /><div className="stepper-item active"><span>02</span><div><strong>Set your guardrails</strong><small>Capital, time, and risk</small></div></div><i /><div className="stepper-item active"><span>03</span><div><strong>Compare contracts</strong><small>ROC and assignment odds</small></div></div><i /><div className="stepper-item"><span>04</span><div><strong>Plan the next move</strong><small>Roll, assign, or repeat</small></div></div></div>
      <div className="wheel-strategy-bar"><div className="strategy-switch" role="tablist" aria-label="Wheel strategy type"><button role="tab" aria-selected={strategy === "put"} className={strategy === "put" ? "active" : ""} onClick={() => setStrategy("put")}><ArrowDownRight size={15} /> Cash-secured put</button><button role="tab" aria-selected={strategy === "call"} className={strategy === "call" ? "active" : ""} onClick={() => setStrategy("call")}><ArrowUpRight size={15} /> Covered call</button></div><span className="strategy-capital-note"><LockKeyhole size={13} /> 1 options contract typically represents 100 shares</span><button className="quiet-text-button strategy-help"><CircleHelp size={14} /> How the wheel works</button></div>

      <section className="wheel-setup surface">
        <div className="stock-picker-column"><div className="section-overline">1  /  CHOOSE YOUR UNDERLYING</div><div className="field-with-icon stock-search"><Search size={15} /><input value={stockQuery} onChange={(event) => setStockQuery(event.target.value)} placeholder="Search quality U.S. stocks" aria-label="Search stocks" /><button aria-label="Stock filters"><Filter size={14} /></button></div><label className="check-control quality-filter"><input type="checkbox" checked={qualityOnly} onChange={(event) => setQualityOnly(event.target.checked)} /><span className="custom-check"><Check size={12} /></span><span>Quality &amp; stability screened</span><Info size={13} /></label><div className="candidate-list">{filteredStocks.slice(0, 5).map((stock) => <button key={stock.symbol} className={`candidate-row ${stock.symbol === selectedStock.symbol ? "active" : ""}`} onClick={() => setSelectedStock(stock)}><span className="stock-monogram" style={{ background: stock.color }}>{stock.symbol.slice(0, 1)}</span><span className="candidate-name"><strong>{stock.symbol}</strong><small>{stock.name}</small></span><span className="candidate-score">{stock.score}<small>/100</small></span></button>)}{filteredStocks.length === 0 && <div className="candidate-empty">No stocks match. Clear search or quality filter.</div>}</div></div>
        <div className="underlying-column"><div className="section-overline">UNDERLYING SNAPSHOT <span className="data-timestamp"><i /> Illustrative</span></div><div className="underlying-stock-title"><span className="stock-monogram stock-monogram-large" style={{ background: activeStock.color }}>{activeStock.symbol.slice(0, 1)}</span><div><strong>{activeStock.symbol}</strong><small>{activeStock.name}  /  {activeStock.sector}</small></div><button className="plain-icon" aria-label="Open stock research"><ExternalLink size={14} /></button></div><div className="underlying-price">{money(activeStock.price)} <span className={activeStock.change >= 0 ? "positive-number" : "negative-number"}>{activeStock.change >= 0 ? "+" : ""}{activeStock.change.toFixed(2)}% today</span></div><div className="underlying-rating"><span><Star size={13} fill="currentColor" /> {activeStock.rating}</span><span><ShieldCheck size={14} /> Stability {activeStock.stability.toLowerCase()}</span></div><div className="stock-quality-stats"><div><span>Valuation</span><strong>{activeStock.value}</strong></div><div><span>Dividend yield</span><strong>{activeStock.dividend.toFixed(2)}%</strong></div><div><span>Quality score</span><strong>{activeStock.score}<small>/100</small></strong></div></div><div className="underlying-note"><CheckCircle2 size={14} /><span>{activeStock.symbol} screens well on business quality and balance-sheet stability. Valuation is only one input.</span></div></div>
        <div className="guardrails-column"><div className="section-overline">2  /  SET YOUR GUARDRAILS</div><label className="field-label" htmlFor="wheel-expiry">Expiration window</label><div className="select-wrap"><select id="wheel-expiry" value={dteWindow} onChange={(event) => setDteWindow(event.target.value)}><option>21-35 days</option><option>30-45 days</option><option>45-60 days</option></select><ChevronDown size={14} /></div><div className="guardrail-slider"><div className="label-with-value"><label htmlFor="min-roc">Minimum annualized ROC</label><strong>{minRoc}%</strong></div><input id="min-roc" className="range-input" type="range" min="0" max="25" step="1" value={minRoc} onChange={(event) => setMinRoc(event.target.value)} /><div className="range-captions"><span>Lower income</span><span>Higher threshold</span></div></div><div className="guardrail-slider"><div className="label-with-value"><label htmlFor="max-assignment">Max. estimated assignment probability</label><strong>{maxAssignment}%</strong></div><input id="max-assignment" className="range-input risk-slider" type="range" min="5" max="40" step="1" value={maxAssignment} onChange={(event) => setMaxAssignment(event.target.value)} /><div className="range-captions"><span>Lower risk</span><span>More premium</span></div></div><div className="collateral-note"><Wallet size={14} /><span>Estimated collateral for 1 contract: <strong>{money((contracts[0]?.strike ?? activeStock.price * 0.95) * 100, 0)}</strong></span></div></div>
      </section>

      <section className="chain-section">
        <div className="chain-heading"><div><div className="section-overline">3  /  OPTIONS CHAIN</div><h2>{strategy === "put" ? "Cash-secured put" : "Covered call"} contracts <span> /  {activeStock.symbol}</span></h2><p>{strategy === "put" ? "Potential entry points below today's share price. Cash is reserved if shares are assigned." : "Potential exit points above your cost basis. Shares are held while the call is open."}</p></div><div className="chain-expiry"><CalendarDays size={14} /><span>Showing expirations</span><strong>{dteWindow}</strong><ChevronDown size={13} /></div></div>
        <div className="chain-table-wrap surface"><div className="chain-table-scroll"><table className="data-table chain-table"><thead><tr><th>EXPIRATION<br />DTE</th><th>STRIKE <small>{strategy === "put" ? "Put" : "Call"}</small></th><th>BID / ASK<br /><small>Premium</small></th><th>DELTA<br /><Info size={12} /></th><th>ANNUALIZED ROC<br /><Info size={12} /></th><th>ASSIGNMENT<br /><Info size={12} /></th><th>OPEN INTEREST</th><th /></tr></thead><tbody>{contracts.map((contract, index) => <tr key={`${contract.strike}-${index}`} className={index === 1 ? "recommended-contract" : ""}><td><strong>{contract.expiry}</strong><small>{contract.dte} days</small></td><td><strong>{money(contract.strike)}</strong><small>{((contract.strike / activeStock.price - 1) * 100).toFixed(1)}% {contract.strike < activeStock.price ? "below" : "above"} spot</small></td><td><strong>{money(contract.bid)}</strong><small>{money(contract.bid - 0.08)} / {money(contract.bid + 0.08)}</small></td><td><strong>{contract.delta.toFixed(2)}</strong><small>~{contract.assignment}% prob.</small></td><td><strong className="roc-value">{contract.roc.toFixed(1)}%</strong><small>Annualized*  /  before fees</small></td><td><span className={`risk-meter ${contract.assignment > 20 ? "risk-medium" : ""}`}><i style={{ width: `${contract.assignment * 2.8}%` }} /></span><small>{contract.assignment}% est. probability</small></td><td><strong>{contract.openInterest.toLocaleString()}</strong><small>{contract.iv.toFixed(1)}% IV</small></td><td><button className="button button-small button-dark" onClick={() => onOpenTrade(contract, strategy)}>Review <ArrowRight size={13} /></button></td></tr>)}</tbody></table>
          {contracts.length === 0 && <div className="no-results"><SlidersHorizontal size={19} /><strong>No contracts meet your guardrails</strong><span>Adjust your ROC or assignment filters to see more candidates.</span><button className="button button-outline" onClick={() => { setMinRoc("0"); setMaxAssignment("35"); }}>Broaden filters</button></div>}</div><div className="table-footnote"><Info size={13} /> *Annualized return on collateral is a simplified estimate. Premiums, implied volatility, liquidity, assignment likelihood, taxes, and early exercise can change actual outcomes. Sample option-chain data is illustrative.</div></div>
      </section>
      <section className="wheel-insight-row"><div className="wheel-risk-callout"><span><ShieldCheck size={17} /></span><div><strong>Assignment is part of the strategy, not a surprise.</strong><p>For a cash-secured put, be prepared to buy 100 shares per contract at the strike. For a covered call, be comfortable selling your shares at that price.</p></div><button className="text-link">Read the wheel guide <ArrowRight size={13} /></button></div><div className="wheel-explainer"><span className="explainer-line" /><p><strong>Premium is not the whole return.</strong> Compare your annualized ROC with the stock's valuation, downside exposure, and the opportunity cost of cash.</p></div></section>
      <div className="sample-disclaimer">U.S. listed equity options only. Ratings, valuation signals, and chain metrics are illustrative. Not investment advice.</div>
    </div>
  );
}

function buildAllocationGradient(positions: Position[]) {
  const palette = ["#244d3d", "#789783", "#b8c8ad", "#e5e9df", "#b89267", "#7d8cac"];
  let current = 0;
  const slices = positions.map((position, index) => {
    const start = current;
    current += Math.max(0, position.allocation);
    return `${position.color || palette[index % palette.length]} ${start}% ${current}%`;
  });
  if (current < 100) slices.push(`#edf0e9 ${current}% 100%`);
  return `conic-gradient(${slices.join(", ")})`;
}

function PortfolioBuilder({ positions, onRemove, onNavigate, capital, setCapital, risk, setRisk, objective, setObjective, onAdd }: {
  positions: Position[]; onRemove: (id: string) => void; onNavigate: (page: Page) => void; capital: number; setCapital: (value: number) => void; risk: string; setRisk: (value: string) => void; objective: string; setObjective: (value: string) => void; onAdd: () => void;
}) {
  const totalAllocation = positions.reduce((total, position) => total + position.allocation, 0);
  const monthlyIncome = positions.reduce((total, position) => total + capital * (position.allocation / 100) * (position.estimatedYield / 100) / 12, 0);
  const annualIncome = monthlyIncome * 12;
  const [reinvest, setReinvest] = useState(false);
  const [view, setView] = useState("Plan overview");
  const [targetIncome, setTargetIncome] = useState("650");
  return (
    <div className="page-content portfolio-page">
      <PageHeading eyebrow="PORTFOLIO BUILDER  /  YOUR PLAN, YOUR CALL" title="Build a portfolio with a point of view." description="Shape a mix of ETF income and options strategies around your capital, comfort with risk, and real-life goals." action={<button className="button button-outline" onClick={() => window.print()}><Download size={15} /> Export plan</button>} />
      <div className="builder-tabs">{["Plan overview", "Income projection", "Risk & overlap"].map((tab) => <button key={tab} className={view === tab ? "active" : ""} onClick={() => setView(tab)}>{tab}</button>)}</div>
      {view === "Plan overview" && <>
        <section className="builder-top-grid">
          <article className="surface plan-controls">
            <div className="section-overline">YOUR INVESTING BRIEF</div><h2>Start with what matters to you.</h2><p>These inputs shape the plan preview. Nothing is placed or traded.</p>
            <div className="builder-input-row"><div><label className="field-label" htmlFor="capital-input">Starting capital</label><div className="currency-input"><span>$</span><input id="capital-input" inputMode="numeric" value={capital.toLocaleString("en-US")} onChange={(event) => setCapital(Number(event.target.value.replace(/[^0-9]/g, "")) || 0)} /><span>USD</span></div></div><div><label className="field-label" htmlFor="target-income">Monthly income goal</label><div className="currency-input"><span>$</span><input id="target-income" inputMode="numeric" value={targetIncome} onChange={(event) => setTargetIncome(event.target.value.replace(/[^0-9]/g, ""))} /><span>/ mo</span></div></div></div>
            <div className="builder-field"><div className="field-label">Primary objective</div><div className="segmented-control">{["Income", "Balanced", "Growth"].map((item) => <button key={item} className={objective === item ? "active" : ""} onClick={() => setObjective(item)}>{item}</button>)}</div></div>
            <div className="builder-field"><div className="label-with-value"><span className="field-label">Comfort with volatility</span><strong>{risk}</strong></div><div className="segmented-control risk-segments">{["Conservative", "Balanced", "Growth"].map((item) => <button key={item} className={risk === item ? "active" : ""} onClick={() => setRisk(item)}>{item}</button>)}</div><div className="risk-spectrum"><span>Lower volatility</span><i><b style={{ left: risk === "Conservative" ? "17%" : risk === "Balanced" ? "50%" : "84%" }} /></i><span>Higher volatility</span></div></div>
            <label className="check-control reinvest-option"><input type="checkbox" checked={reinvest} onChange={(event) => setReinvest(event.target.checked)} /><span className="custom-check"><Check size={12} /></span><span>Reinvest distributions automatically</span><Info size={13} /></label>
          </article>
          <article className="surface plan-summary">
            <div className="plan-summary-top"><div><div className="section-overline">YOUR CURRENT DRAFT</div><h2>{objective === "Income" ? "Monthly income priority" : objective === "Growth" ? "Long-term growth focus" : "A balanced income mix"}</h2><p>A starting point based on your selected goals.</p></div><button className="icon-quiet" aria-label="Plan options"><MoreHorizontal size={18} /></button></div>
            <div className="allocation-visual"><div className="allocation-donut" style={{ background: buildAllocationGradient(positions) }}><div><span>EST. MONTHLY</span><strong>{money(monthlyIncome, 0)}</strong><small>{money(annualIncome, 0)} annualized</small></div></div><div className="allocation-legend">{positions.map((position) => <div key={position.id}><i style={{ background: position.color }} /><span>{position.symbol}</span><strong>{position.allocation}%</strong></div>)}</div></div>
            <div className="plan-summary-bottom"><div><span>Target income</span><strong>{money(Number(targetIncome) || 0, 0)}<small>/mo</small></strong></div><div className="target-progress"><i style={{ width: `${Math.min(100, (monthlyIncome / Math.max(1, Number(targetIncome))) * 100)}%` }} /><span>{Math.min(100, Math.round((monthlyIncome / Math.max(1, Number(targetIncome))) * 100))}% of target</span></div></div>
            <div className="plan-note"><Sparkles size={14} /><span>Current draft estimates approximately <strong>{money(monthlyIncome, 0)}/month</strong> before taxes. Income is variable and not guaranteed.</span></div>
          </article>
        </section>
        <section className="positions-section surface"><div className="positions-section-header"><div><div className="section-overline">PORTFOLIO LINEUP</div><h2>Your draft positions <span>{positions.length}</span></h2><p>Adjust allocations as you research. Unallocated capital stays as cash.</p></div><button className="button button-dark" onClick={onAdd}><Plus size={15} /> Add an investment</button></div>
          <div className="position-table-head"><span>INVESTMENT</span><span>ROLE IN PLAN</span><span>ALLOCATION</span><span>EST. INCOME</span><span /></div>
          {positions.map((position) => <div className="position-row" key={position.id}><span className="position-identity"><i style={{ background: position.color }}>{position.symbol === "Cash" ? <Landmark size={15} /> : position.source === "Options" ? <Activity size={15} /> : position.symbol.slice(0, 1)}</i><span><strong>{position.symbol}</strong><small>{position.name}</small></span></span><span className="position-role"><strong>{position.source}</strong><small>{position.descriptor}</small></span><span className="position-allocation"><strong>{position.allocation}%</strong><div><i style={{ width: `${position.allocation * 2.5}%`, background: position.color }} /></div><small>{money(capital * position.allocation / 100, 0)}</small></span><span className="position-income"><strong>{money(capital * position.allocation / 100 * position.estimatedYield / 100 / 12, 0)}<small>/mo</small></strong><small>{position.estimatedYield.toFixed(2)}% planning rate</small></span><button className="small-icon-action remove-position" onClick={() => onRemove(position.id)} aria-label={`Remove ${position.symbol}`}><X size={16} /></button></div>)}
          <div className="positions-total"><span>{100 - totalAllocation > 0 ? `${100 - totalAllocation}% unallocated cash` : "Fully allocated"}</span><strong>{money(capital, 0)} total capital</strong></div>
        </section>
        <div className="builder-bottom-grid"><article className="builder-guidance"><span><Target size={16} /></span><div><strong>Does this mix feel right?</strong><p>A useful plan balances what you hope to earn with what you can tolerate losing. Consider concentration, taxes, liquidity, and time horizon.</p></div><button onClick={() => onNavigate("etfs")}>Continue researching <ArrowRight size={14} /></button></article><article className="risk-meter-card surface"><div className="section-overline">PORTFOLIO RISK CHECK</div><h3>{risk === "Growth" ? "Higher income, wider swings." : risk === "Conservative" ? "Steadier by design." : "Income with room to grow."}</h3><div className="risk-range"><span>Lower</span><i><b style={{ left: risk === "Conservative" ? "22%" : risk === "Balanced" ? "52%" : "81%" }} /></i><span>Higher</span></div><p>Options-based income can cap gains and cannot prevent losses when markets fall.</p></article></div>
      </>}
      {view === "Income projection" && <section className="projection-grid"><article className="surface projection-main"><div className="section-overline">INCOME PROJECTION  /  ILLUSTRATIVE</div><h2>What the current mix could generate</h2><p>Estimates use planning rates, not guaranteed distributions or contract premiums.</p><div className="projection-total"><span>Estimated annual income</span><strong>{money(annualIncome, 0)}</strong><small>about {money(monthlyIncome, 0)} per month, before taxes</small></div><div className="projection-chart">{[0.66, 0.72, 0.68, 0.79, 0.77, 0.84, 0.82, 0.91, 0.86, 0.96, 0.93, 1].map((value, index) => <div key={index}><i style={{ height: `${value * 100}%` }} /><span>{["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"][index]}</span></div>)}</div><div className="projection-legend"><span><i /> Estimated monthly income</span><span>Distribution timing varies</span></div></article><article className="surface projection-breakdown"><div className="section-overline">BY PORTFOLIO ROLE</div><h2>Where income comes from</h2>{positions.map((position) => <div className="projection-source" key={position.id}><span><i style={{ background: position.color }} />{position.symbol}</span><strong>{money(capital * position.allocation / 100 * position.estimatedYield / 100, 0)}<small>/yr</small></strong><small>{position.estimatedYield.toFixed(2)}% assumption</small></div>)}<div className="context-warning"><Info size={14} /> Option premiums depend on market conditions and are not a fixed yield.</div></article></section>}
      {view === "Risk & overlap" && <section className="risk-overlap-grid"><article className="surface overlap-main"><div className="section-overline">CONCENTRATION CHECK</div><h2>Look through the fund labels.</h2><p>Different ETFs can own many of the same U.S. companies. Review underlying holdings as a portfolio.</p>{["Information technology", "Financials", "Health care", "Consumer staples", "Other sectors"].map((sector, index) => <div className="sector-row" key={sector}><span>{sector}</span><div><i style={{ width: `${[31, 19, 16, 12, 22][index]}%` }} /></div><strong>{[31, 19, 16, 12, 22][index]}%</strong></div>)}<div className="holdings-disclaimer"><Info size={12} /> Illustrative sector mix derived from sample positions, not live constituent data.</div></article><article className="surface risk-observations"><div className="section-overline">THINGS TO REVIEW</div><h2>Three useful checks</h2><div><span>01</span><p><strong>Income concentration</strong> A small group of option-income funds can be exposed to the same mega-cap stocks.</p></div><div><span>02</span><p><strong>Drawdown tolerance</strong> Distributions do not remove market risk or protect principal.</p></div><div><span>03</span><p><strong>Tax treatment</strong> ETF payouts and option premium can be taxed differently in a taxable account.</p></div><button className="text-link" onClick={() => onNavigate("etfs")}>Review fund holdings <ArrowRight size={14} /></button></article></section>}
      <div className="sample-disclaimer">Portfolio projections are illustrative, simplified, and not investment advice. No orders are placed by this planning tool.</div>
    </div>
  );
}

function ComparePage({ ids, setIds, onBackToExplore }: { ids: string[]; setIds: (ids: string[]) => void; onBackToExplore: () => void }) {
  const compareFunds = ids.map((id) => funds.find((fund) => fund.symbol === id)).filter((fund): fund is ETF => Boolean(fund)).slice(0, 3);
  const [period, setPeriod] = useState<Period>("3Y");
  const remove = (symbol: string) => setIds(ids.filter((id) => id !== symbol));
  return (
    <div className="page-content compare-page">
      <button className="back-link" onClick={onBackToExplore}><ArrowLeft size={15} /> Back to ETF research</button>
      <PageHeading eyebrow="SIDE-BY-SIDE RESEARCH" title="Compare what matters." description="Distribution yield is only one part of an ETF. Put its cost, strategy, NAV health, and performance in the same frame." action={<button className="button button-outline" onClick={onBackToExplore}><Plus size={15} /> Add another fund</button>} />
      {compareFunds.length >= 2 && <>
        <section className="compare-hero surface"><div className="compare-heading"><div><div className="section-overline">TOTAL RETURN  /  REINVESTED DISTRIBUTIONS</div><h2>Performance over time</h2><p>Growth of $10,000, shown on a common scale.</p></div><PeriodSelector value={period} onChange={setPeriod} /></div><div className="compare-chart"><ETFComparisonChart period={period} compared={compareFunds} /></div><div className="chart-axis"><span>Jun 2022</span><span>2023</span><span>2024</span><span>2025</span><span>Today</span></div><div className="compare-legend">{compareFunds.map((fund, index) => <span key={fund.symbol}><i style={{ background: ["#47785b", "#b59965", "#7d8cac"][index] }} />{fund.symbol}</span>)}</div></section>
        <section className="compare-table-panel surface"><div className="compare-table-title"><div><div className="section-overline">FUND-BY-FUND</div><h2>Same questions. Different answers.</h2></div><span><Eye size={14} /> Illustrative sample data</span></div><div className="compare-table-scroll"><table className="compare-table"><thead><tr><th>RESEARCH METRIC</th>{compareFunds.map((fund) => <th key={fund.symbol}><span className="compare-fund-heading"><i style={{ background: fund.color }}>{fund.symbol.slice(0, 1)}</i><span><strong>{fund.symbol}</strong><small>{fund.group}</small></span><button onClick={() => remove(fund.symbol)} aria-label={`Remove ${fund.symbol}`}><X size={14} /></button></span></th>)}{compareFunds.length < 3 && <th><button className="compare-add-placeholder" onClick={onBackToExplore}><Plus size={15} /> Add fund</button></th>}</tr></thead><tbody>{[
          { label: "Distribution yield", key: "yield", format: (fund: ETF) => `${fund.yield.toFixed(2)}%`, note: "Variable; not guaranteed" },
          { label: "1-year total return", key: "return1y", format: (fund: ETF) => `+${fund.return1y.toFixed(2)}%`, note: "Includes reinvested distributions" },
          { label: "3-year annualized return", key: "return3y", format: (fund: ETF) => `+${fund.return3y.toFixed(2)}%`, note: "Through latest sample period" },
          { label: "Expense ratio", key: "fee", format: (fund: ETF) => `${fund.fee.toFixed(2)}%`, note: "Annual fund operating cost" },
          { label: "NAV erosion", key: "erosion", format: (fund: ETF) => `${fund.erosion.toFixed(2)}%`, note: "Price return vs total return" },
          { label: "Distribution cadence", key: "frequency", format: (fund: ETF) => fund.frequency, note: "Payments can vary" },
          { label: "Methodology", key: "strategy", format: (fund: ETF) => fund.strategy, note: "Read prospectus for details" },
          { label: "Analyst perspective", key: "analyst", format: (fund: ETF) => `${fund.rating.toFixed(1)} / 5  /  ${fund.analyst.split("  /  ")[0]}`, note: "One input, not a recommendation" },
        ].map((metric) => <tr key={metric.key}><th scope="row"><strong>{metric.label}</strong><small>{metric.note}</small></th>{compareFunds.map((fund) => <td key={fund.symbol}><strong>{metric.format(fund)}</strong>{metric.key === "yield" && <small>Trailing distribution rate</small>}{metric.key === "erosion" && <span className={`health-label ${fund.erosion > 1 ? "health-watch" : ""}`}><i />{fund.erosion < 0.5 ? "Resilient" : fund.erosion < 1 ? "Monitor" : "Elevated"}</span>}</td>)}{compareFunds.length < 3 && <td className="empty-compare-cell">-</td>}</tr>)}</tbody></table></div><div className="compare-bottom-note"><Sparkles size={15} /><p><strong>Context matters.</strong> A higher yield may come with lower upside participation, more variable distributions, or more NAV pressure. Compare the strategy before comparing the headline number.</p></div></section>
      </>}
      {compareFunds.length < 2 && <div className="empty-compare surface"><SlidersHorizontal size={22} /><h2>Choose at least two funds to compare.</h2><p>Select funds from ETF research to compare performance, distributions, costs, holdings, and strategy.</p><button className="button button-dark" onClick={onBackToExplore}>Browse ETF research <ArrowRight size={15} /></button></div>}
      <div className="sample-disclaimer">Illustrative sample data for educational research only. Past performance does not predict future results.</div>
    </div>
  );
}

function WatchlistPage({ savedFunds, onToggleFund, savedStocks, onToggleStock, onFundSelect, onStockSelect, onNavigate }: {
  savedFunds: string[]; onToggleFund: (symbol: string) => void; savedStocks: string[]; onToggleStock: (symbol: string) => void; onFundSelect: (fund: ETF) => void; onStockSelect: (stock: Stock) => void; onNavigate: (page: Page) => void;
}) {
  const [tab, setTab] = useState("All saved");
  const savedETFData = funds.filter((fund) => savedFunds.includes(fund.symbol));
  const savedStockData = stocks.filter((stock) => savedStocks.includes(stock.symbol));
  const showFunds = tab !== "Stocks";
  const showStocks = tab !== "ETFs";
  return (
    <div className="page-content watchlist-page">
      <PageHeading eyebrow="YOUR RESEARCH QUEUE" title="Keep the interesting ones close." description="A working list for funds and companies you want to understand better. Saving something is not a recommendation to buy it." action={<button className="button button-dark" onClick={() => onNavigate("etfs")}><Plus size={15} /> Find more ideas</button>} />
      <div className="watchlist-tabs">{["All saved", "ETFs", "Stocks"].map((item) => <button key={item} className={tab === item ? "active" : ""} onClick={() => setTab(item)}>{item}<span>{item === "ETFs" ? savedETFData.length : item === "Stocks" ? savedStockData.length : savedETFData.length + savedStockData.length}</span></button>)}</div>
      {showFunds && <section className="watchlist-group"><div className="watchlist-group-title"><div><div className="section-overline">FUND RESEARCH</div><h2>ETFs to revisit</h2></div><span>{savedETFData.length} funds</span></div>{savedETFData.length ? <div className="watchlist-items">{savedETFData.map((fund) => <article className="watchlist-item surface" key={fund.symbol}><button className="watchlist-main" onClick={() => onFundSelect(fund)}><span className="fund-monogram" style={{ background: fund.color }}>{fund.symbol.slice(0, 1)}</span><span><strong>{fund.symbol}</strong><small>{fund.name}</small></span><ArrowRight size={15} /></button><div className="watchlist-metric"><span>Distribution yield</span><strong>{fund.yield.toFixed(2)}%</strong></div><div className="watchlist-metric"><span>NAV health</span><strong className={fund.erosion > 1 ? "negative-number" : "positive-number"}>{fund.erosion < 0.5 ? "Resilient" : fund.erosion < 1 ? "Monitor" : "Elevated"}</strong></div><div className="watchlist-metric"><span>Next review</span><strong>Review distributions</strong></div><button className="small-icon-action saved" onClick={() => onToggleFund(fund.symbol)} aria-label={`Remove ${fund.symbol} from watchlist`}><Bookmark size={15} fill="currentColor" /></button></article>)}</div> : <div className="watchlist-empty"><Bookmark size={18} /><p>No funds saved yet. Save a fund from ETF research to keep it here.</p><button onClick={() => onNavigate("etfs")}>Explore ETFs <ArrowRight size={14} /></button></div>}</section>}
      {showStocks && <section className="watchlist-group"><div className="watchlist-group-title"><div><div className="section-overline">WHEEL STRATEGY RESEARCH</div><h2>Companies on your radar</h2></div><span>{savedStockData.length} stocks</span></div>{savedStockData.length ? <div className="watchlist-items">{savedStockData.map((stock) => <article className="watchlist-item surface" key={stock.symbol}><button className="watchlist-main" onClick={() => onStockSelect(stock)}><span className="stock-monogram" style={{ background: stock.color }}>{stock.symbol.slice(0, 1)}</span><span><strong>{stock.symbol}</strong><small>{stock.name}  /  {stock.sector}</small></span><ArrowRight size={15} /></button><div className="watchlist-metric"><span>Share price</span><strong>{money(stock.price)}</strong></div><div className="watchlist-metric"><span>Analyst view</span><strong className="positive-number">{stock.rating}</strong></div><div className="watchlist-metric"><span>Value lens</span><strong>{stock.value}</strong></div><button className="small-icon-action saved" onClick={() => onToggleStock(stock.symbol)} aria-label={`Remove ${stock.symbol} from watchlist`}><Bookmark size={15} fill="currentColor" /></button></article>)}</div> : <div className="watchlist-empty"><Bookmark size={18} /><p>No companies saved yet. Save a quality stock from the options wheel scanner.</p><button onClick={() => onNavigate("wheel")}>Explore wheel stocks <ArrowRight size={14} /></button></div>}</section>}
      <div className="watchlist-note"><Info size={14} /><span>A watchlist is a research tool, not an instruction to buy or sell. Review current prices and fund documents before investing.</span></div>
    </div>
  );
}

function TradeReviewModal({ stock, contract, strategy, onClose, onAdd }: { stock: Stock; contract: Contract; strategy: "put" | "call"; onClose: () => void; onAdd: () => void }) {
  const collateral = strategy === "put" ? contract.strike * 100 : stock.price * 100;
  const income = contract.bid * 100;
  return <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><section className="trade-modal" role="dialog" aria-modal="true" aria-labelledby="trade-modal-title"><button className="modal-close" onClick={onClose} aria-label="Close review"><X size={18} /></button><div className="modal-eyebrow"><span><ShieldCheck size={14} /></span> CONTRACT REVIEW  /  NOT A TRADE</div><h2 id="trade-modal-title">Review the full picture.</h2><p className="modal-intro">Add this idea to your portfolio plan for further research. No brokerage order will be placed.</p><div className="trade-ticket-title"><span className="stock-monogram" style={{ background: stock.color }}>{stock.symbol[0]}</span><span><strong>{stock.symbol} {contract.expiry} {money(contract.strike)} {strategy.toUpperCase()}</strong><small>{contract.dte} DTE  /  1 contract  /  {contract.delta.toFixed(2)} delta</small></span></div><div className="trade-metrics"><div><span>Premium estimate</span><strong>{money(income, 0)}</strong></div><div><span>Capital required</span><strong>{money(collateral, 0)}</strong></div><div><span>Annualized ROC*</span><strong className="roc-value">{contract.roc.toFixed(1)}%</strong></div><div><span>Assignment estimate</span><strong>{contract.assignment}%</strong></div></div><div className="modal-risk-note"><Info size={15} /><p>{strategy === "put" ? `If assigned, you may need to buy 100 shares of ${stock.symbol} at ${money(contract.strike)} per share, even if the market price has fallen.` : `If assigned, you may need to sell 100 shares of ${stock.symbol} at ${money(contract.strike)}, even if the market price has risen.`} Option buyers can exercise early.</p></div><div className="modal-actions"><button className="button button-outline" onClick={onClose}>Keep researching</button><button className="button button-dark" onClick={onAdd}><Plus size={15} /> Add idea to my plan</button></div><div className="modal-disclaimer">*Simplified estimate before fees and taxes. Option premiums and assignment probabilities are estimates, not guarantees.</div></section></div>;
}

function AddInvestmentModal({ onClose, onAdd }: { onClose: () => void; onAdd: (fund: ETF) => void }) {
  const [query, setQuery] = useState("");
  const matches = funds.filter((fund) => !query || `${fund.symbol} ${fund.name}`.toLowerCase().includes(query.toLowerCase()));
  return <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><section className="trade-modal add-investment-modal" role="dialog" aria-modal="true" aria-labelledby="add-modal-title"><button className="modal-close" onClick={onClose} aria-label="Close add investment"><X size={18} /></button><div className="modal-eyebrow"><span><Plus size={14} /></span> PORTFOLIO BUILDER</div><h2 id="add-modal-title">Add an investment.</h2><p className="modal-intro">Choose a fund to add to your planning mix. This won't place an order.</p><div className="field-with-icon add-search"><Search size={15} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search U.S. ETFs" aria-label="Search U.S. ETFs" /></div><div className="add-fund-options">{matches.map((fund) => <button key={fund.symbol} onClick={() => onAdd(fund)}><span className="fund-monogram" style={{ background: fund.color }}>{fund.symbol[0]}</span><span><strong>{fund.symbol}</strong><small>{fund.name}</small></span><span className="add-option-yield">{fund.yield.toFixed(1)}%<small>yield</small></span><Plus size={15} /></button>)}{matches.length === 0 && <div className="candidate-empty">No matching ETFs found.</div>}</div><div className="modal-disclaimer">Sample fund data is illustrative. Review current prospectus and distribution history before investing.</div></section></div>;
}

function App() {
  const [page, setPage] = useState<Page>("overview");
  const [selectedFund, setSelectedFund] = useState<ETF>(funds[0]);
  const [selectedStock, setSelectedStock] = useState<Stock>(stocks[2]);
  const [wheelStrategy, setWheelStrategy] = useState<"put" | "call">("put");
  const [globalSearch, setGlobalSearch] = useState("");
  const [savedFunds, setSavedFunds] = useState(["JEPI", "SCHD"]);
  const [savedStocks, setSavedStocks] = useState(["MSFT", "JPM"]);
  const [compareIds, setCompareIds] = useState<string[]>(["JEPI", "SCHD"]);
  const [positions, setPositions] = useState<Position[]>(initialPositions);
  const [capital, setCapital] = useState(100000);
  const [risk, setRisk] = useState("Balanced");
  const [objective, setObjective] = useState("Balanced");
  const [reviewContract, setReviewContract] = useState<{ contract: Contract; strategy: "put" | "call" } | null>(null);
  const [addInvestmentOpen, setAddInvestmentOpen] = useState(false);

  const monthlyIncome = positions.reduce((total, position) => total + capital * (position.allocation / 100) * (position.estimatedYield / 100) / 12, 0);
  const toggleSavedFund = (symbol: string) => setSavedFunds((current) => current.includes(symbol) ? current.filter((item) => item !== symbol) : [...current, symbol]);
  const toggleSavedStock = (symbol: string) => setSavedStocks((current) => current.includes(symbol) ? current.filter((item) => item !== symbol) : [...current, symbol]);
  const toggleCompare = (symbol: string) => setCompareIds((current) => current.includes(symbol) ? current.filter((item) => item !== symbol) : current.length < 3 ? [...current, symbol] : current);
  const goToFund = (fund: ETF) => { setSelectedFund(fund); setPage("etf-detail"); setGlobalSearch(""); };
  const goToStock = (stock: Stock) => { setSelectedStock(stock); setPage("wheel"); setGlobalSearch(""); };
  const openCompare = () => {
    if (compareIds.length < 2) setCompareIds(["JEPI", "SCHD"]);
    setPage("compare");
  };
  const addFundPosition = (fund: ETF) => {
    setPositions((current) => {
      if (current.some((position) => position.symbol === fund.symbol)) return current;
      const wheelPosition = current.find((position) => position.source === "Options");
      const cashReserve = Math.min(10, current.find((position) => position.symbol === "Cash")?.allocation ?? 0);
      const wheelReserve = Math.min(5, wheelPosition?.allocation ?? 0);
      const unallocated = Math.max(0, 100 - current.reduce((total, position) => total + position.allocation, 0));
      const allocation = cashReserve || wheelReserve || unallocated;
      const updated = current.map((position) => {
        if (position.symbol === "Cash" && cashReserve) return { ...position, allocation: position.allocation - cashReserve };
        if (!cashReserve && wheelReserve && position.id === wheelPosition?.id) return { ...position, allocation: position.allocation - wheelReserve };
        return position;
      });
      return [...updated, { id: `${fund.symbol.toLowerCase()}-${Date.now()}`, symbol: fund.symbol, name: fund.name, descriptor: `${fund.group}  /  ${fund.frequency}`, allocation, estimatedYield: fund.yield, source: "ETF", color: fund.color }];
    });
    setAddInvestmentOpen(false);
    setPage("portfolio");
  };
  const addWheelPosition = (contract: Contract, strategy: "put" | "call") => {
    const label = `${selectedStock.symbol} ${strategy === "put" ? "put" : "call"}`;
    setPositions((current) => {
      if (current.some((position) => position.symbol === label)) return current;
      const wheelReserve = current.find((position) => position.symbol === "Wheel reserve");
      const cashReserve = current.find((position) => position.symbol === "Cash");
      const wheelAllocation = Math.min(5, wheelReserve?.allocation ?? 0);
      const cashAllocation = Math.min(5, cashReserve?.allocation ?? 0);
      const unallocated = Math.max(0, 100 - current.reduce((total, position) => total + position.allocation, 0));
      const allocation = wheelAllocation || cashAllocation || unallocated;
      const updated = current.map((position) => {
        if (position.id === wheelReserve?.id && wheelAllocation) return { ...position, allocation: position.allocation - wheelAllocation };
        if (!wheelAllocation && position.id === cashReserve?.id && cashAllocation) return { ...position, allocation: position.allocation - cashAllocation };
        return position;
      });
      return [...updated, {
        id: `${selectedStock.symbol.toLowerCase()}-${Date.now()}`, symbol: label, name: `${selectedStock.name}  /  ${money(contract.strike)} ${strategy}`, descriptor: `${contract.expiry}  /  ${contract.dte} DTE  /  planning idea`, allocation, estimatedYield: contract.roc, source: "Options", color: selectedStock.color,
      }];
    });
    setReviewContract(null);
    setPage("portfolio");
  };
  const removePosition = (id: string) => setPositions((current) => {
    const removed = current.find((position) => position.id === id);
    const remaining = current.filter((position) => position.id !== id);
    if (removed && removed.symbol !== "Cash") {
      const cash = remaining.find((position) => position.symbol === "Cash");
      if (cash) return remaining.map((position) => position.symbol === "Cash" ? { ...position, allocation: position.allocation + removed.allocation } : position);
    }
    return remaining;
  });

  return (
    <div className="app-shell">
      <Sidebar page={page} onNavigate={setPage} watchCount={savedFunds.length + savedStocks.length} />
      <div className="main-stage">
        <Topbar page={page} fundsSearch={globalSearch} setFundsSearch={setGlobalSearch} onNavigate={setPage} onFundSelect={goToFund} onStockSelect={goToStock} />
        <main>
          {page === "overview" && <OverviewPage onNavigate={setPage} onFundSelect={goToFund} onStockSelect={goToStock} income={monthlyIncome} />}
          {page === "etfs" && <ETFExplorer onFundSelect={goToFund} savedFunds={savedFunds} onToggleSaved={toggleSavedFund} compareIds={compareIds} onToggleCompare={toggleCompare} onCompare={openCompare} />}
          {page === "etf-detail" && <ETFDetail fund={selectedFund} onBack={() => setPage("etfs")} onToggleSaved={() => toggleSavedFund(selectedFund.symbol)} saved={savedFunds.includes(selectedFund.symbol)} onAddToPortfolio={() => addFundPosition(selectedFund)} onCompare={openCompare} />}
          {page === "compare" && <ComparePage ids={compareIds} setIds={setCompareIds} onBackToExplore={() => setPage("etfs")} />}
          {page === "wheel" && <OptionsWheel selectedStock={selectedStock} setSelectedStock={setSelectedStock} strategy={wheelStrategy} setStrategy={setWheelStrategy} savedStocks={savedStocks} onToggleSavedStock={toggleSavedStock} onOpenTrade={(contract, strategy) => setReviewContract({ contract, strategy })} />}
          {page === "portfolio" && <PortfolioBuilder positions={positions} onRemove={removePosition} onNavigate={setPage} capital={capital} setCapital={setCapital} risk={risk} setRisk={setRisk} objective={objective} setObjective={setObjective} onAdd={() => setAddInvestmentOpen(true)} />}
          {page === "watchlist" && <WatchlistPage savedFunds={savedFunds} onToggleFund={toggleSavedFund} savedStocks={savedStocks} onToggleStock={toggleSavedStock} onFundSelect={goToFund} onStockSelect={goToStock} onNavigate={setPage} />}
        </main>
        <footer className="app-footer"><span>MERIDIAN <i> / </i> A CLEARER VIEW OF YOUR INVESTMENTS</span><span>Educational interface  /  Illustrative data  /  Not investment advice</span></footer>
      </div>
      {reviewContract && <TradeReviewModal stock={selectedStock} contract={reviewContract.contract} strategy={reviewContract.strategy} onClose={() => setReviewContract(null)} onAdd={() => addWheelPosition(reviewContract.contract, reviewContract.strategy)} />}
      {addInvestmentOpen && <AddInvestmentModal onClose={() => setAddInvestmentOpen(false)} onAdd={addFundPosition} />}
    </div>
  );
}

export default App;