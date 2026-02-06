'use client';

import { useState, useCallback, useMemo, useEffect } from 'react';

interface TokenStats {
  buyVolume?: number;
  sellVolume?: number;
  priceChange?: number;
}

interface Token {
  id: string;
  symbol: string;
  name: string;
  icon?: string;
  decimals: number;
  usdPrice?: number;
  liquidity?: number;
  stats24h?: TokenStats;
}

interface Memecoin {
  symbol: string;
  name: string;
  mint: string;
  icon: string;
  color: string;
}

// Fallback coins if API fails
const FALLBACK_MEMECOINS: Memecoin[] = [
  { symbol: 'BONK', name: 'Bonk', mint: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263', icon: '🐕', color: '#FF6B35' },
  { symbol: 'WIF', name: 'dogwifhat', mint: 'EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm', icon: '🎩', color: '#D4A574' },
  { symbol: 'POPCAT', name: 'Popcat', mint: '7GCihgDB8fe6KNjn2MYtkzZcRjQy3t9GHdC8uHYmW2hr', icon: '🐱', color: '#FF69B4' },
  { symbol: 'MEW', name: 'cat in a dogs world', mint: 'MEW1gQWJ3nEXg2qgERiKu7FAFj79PHvQVREQUzScPP5', icon: '😺', color: '#4169E1' },
  { symbol: 'GIGA', name: 'Gigachad', mint: '63LfDmNb3MQ8mw9MtZ2To9bEA2M71kZUUGq5tiJxcqj9', icon: '💪', color: '#FFD700' },
  { symbol: 'PNUT', name: 'Peanut Squirrel', mint: '2qEHjDLDLbuBgRYvsxhc5D6uDWAivNFZGan56P1tpump', icon: '🥜', color: '#DEB887' },
  { symbol: 'MOODENG', name: 'Moo Deng', mint: 'ED5nyyWEzpPPiWimP8vYm7sD7TD3LAt3Q3gRTWHzPJBY', icon: '🦛', color: '#9370DB' },
  { symbol: 'GOAT', name: 'Goatseus Maximus', mint: 'CzLSujWBLFsSjncfkh59rUFqvafWcY5tzedWJSuypump', icon: '🐐', color: '#32CD32' },
];

const COLORS = ['#FF6B35', '#D4A574', '#FF69B4', '#4169E1', '#FFD700', '#DEB887', '#9370DB', '#32CD32', '#E74C3C', '#3498DB'];
const EMOJIS = ['🚀', '💎', '🔥', '⚡', '🌙', '🎯', '💰', '🎲', '🦄', '🌟'];

const SOL_MINT = 'So11111111111111111111111111111111111111112';

declare global {
  interface Window {
    Jupiter?: {
      init: (config: unknown) => void;
    };
  }
}

export default function Roulette() {
  const [coins, setCoins] = useState<Memecoin[]>(FALLBACK_MEMECOINS);
  const [isLoading, setIsLoading] = useState(true);
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [selectedCoin, setSelectedCoin] = useState<Memecoin | null>(null);
  const [betAmount, setBetAmount] = useState('0.1');
  const [showResult, setShowResult] = useState(false);
  const [jupiterLoaded, setJupiterLoaded] = useState(false);

  // Load Jupiter Plugin
  useEffect(() => {
    if (typeof window !== 'undefined' && !window.Jupiter) {
      const script = document.createElement('script');
      script.src = 'https://plugin.jup.ag/plugin-1.0.13.js';
      script.async = true;
      script.onload = () => setJupiterLoaded(true);
      document.body.appendChild(script);
    } else if (window.Jupiter) {
      setJupiterLoaded(true);
    }
  }, []);

  // Fetch trending tokens from Jupiter
  useEffect(() => {
    async function fetchTrendingTokens() {
      try {
        // Search for trending/popular tokens
        const queries = ['meme', 'dog', 'cat', 'pepe', 'ai'];
        const randomQuery = queries[Math.floor(Math.random() * queries.length)];
        
        const response = await fetch(`https://ultra-api.jup.ag/search?query=${randomQuery}`);
        const data: Token[] = await response.json();
        
        // Filter for tokens with decent liquidity and volume
        const filtered = data
          .filter((t: Token) => 
            t.liquidity && t.liquidity > 10000 && 
            t.stats24h?.buyVolume && t.stats24h.buyVolume > 1000 &&
            t.symbol && t.name
          )
          .slice(0, 8)
          .map((t: Token, i: number): Memecoin => ({
            symbol: t.symbol,
            name: t.name.length > 20 ? t.name.slice(0, 20) + '...' : t.name,
            mint: t.id,
            icon: EMOJIS[i % EMOJIS.length],
            color: COLORS[i % COLORS.length],
          }));

        if (filtered.length >= 4) {
          setCoins(filtered);
        }
      } catch (error) {
        console.log('Using fallback tokens', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchTrendingTokens();
  }, []);

  // Wheel gradient
  const wheelGradient = useMemo(() => {
    const segmentSize = 100 / coins.length;
    const segments = coins.map((coin, i) => {
      const start = i * segmentSize;
      const end = (i + 1) * segmentSize;
      return `${coin.color} ${start}% ${end}%`;
    });
    return `conic-gradient(from 0deg, ${segments.join(', ')})`;
  }, [coins]);

  const spin = useCallback(() => {
    if (isSpinning || coins.length === 0) return;
    
    setIsSpinning(true);
    setShowResult(false);
    setSelectedCoin(null);

    const spins = 5 + Math.random() * 5;
    const randomAngle = Math.random() * 360;
    const totalRotation = rotation + (spins * 360) + randomAngle;
    
    setRotation(totalRotation);

    setTimeout(() => {
      const normalizedAngle = (360 - (totalRotation % 360) + 90) % 360;
      const segmentAngle = 360 / coins.length;
      const coinIndex = Math.floor(normalizedAngle / segmentAngle) % coins.length;
      
      setSelectedCoin(coins[coinIndex]);
      setIsSpinning(false);
      setShowResult(true);
    }, 4000);
  }, [isSpinning, rotation, coins]);

  const apeIn = useCallback(() => {
    if (!selectedCoin) return;
    
    if (!window.Jupiter) {
      alert('Jupiter Plugin not loaded yet!');
      return;
    }

    const lamports = Math.floor(parseFloat(betAmount) * 1e9);
    
    window.Jupiter.init({
      displayMode: 'modal',
      formProps: {
        initialInputMint: SOL_MINT,
        initialOutputMint: selectedCoin.mint,
        initialAmount: lamports.toString(),
      },
      onSuccess: ({ txid }: { txid: string }) => {
        console.log('🎰 WAGMI!', txid);
        setShowResult(false);
      },
    });
  }, [selectedCoin, betAmount]);

  const refreshTokens = useCallback(async () => {
    setIsLoading(true);
    try {
      const queries = ['pump', 'moon', 'doge', 'shib', 'based'];
      const randomQuery = queries[Math.floor(Math.random() * queries.length)];
      
      const response = await fetch(`https://ultra-api.jup.ag/search?query=${randomQuery}`);
      const data: Token[] = await response.json();
      
      const filtered = data
        .filter((t: Token) => 
          t.liquidity && t.liquidity > 10000 && 
          t.stats24h?.buyVolume && t.stats24h.buyVolume > 1000
        )
        .slice(0, 8)
        .map((t: Token, i: number): Memecoin => ({
          symbol: t.symbol,
          name: t.name.length > 20 ? t.name.slice(0, 20) + '...' : t.name,
          mint: t.id,
          icon: EMOJIS[i % EMOJIS.length],
          color: COLORS[i % COLORS.length],
        }));

      if (filtered.length >= 4) {
        setCoins(filtered);
        setRotation(0);
      }
    } catch (error) {
      console.log('Failed to refresh', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-600 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="p-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <span className="text-4xl animate-bounce">🎰</span>
            <div>
              <h1 className="text-3xl font-black bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 bg-clip-text text-transparent">
                MEMECOIN ROULETTE
              </h1>
              <p className="text-gray-500 text-sm">Powered by Jupiter • Live tokens</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={refreshTokens}
              disabled={isLoading || isSpinning}
              className="px-3 py-1 rounded-full text-xs bg-white/10 hover:bg-white/20 transition-all disabled:opacity-50 cursor-pointer"
            >
              🔄 New Tokens
            </button>
            <div className={`px-3 py-1 rounded-full text-xs ${jupiterLoaded ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
              {jupiterLoaded ? '● Ready' : '○ Loading...'}
            </div>
          </div>
        </header>

        <main className="flex flex-col items-center justify-center px-4 py-8 min-h-[80vh]">
          {/* Bet amount */}
          <div className="mb-8 flex items-center gap-4 bg-white/5 rounded-2xl px-6 py-3 backdrop-blur">
            <span className="text-gray-400">🎯 Bet:</span>
            <input
              type="number"
              value={betAmount}
              onChange={(e) => setBetAmount(e.target.value)}
              className="bg-transparent w-20 text-2xl font-bold outline-none text-center"
              min="0.01"
              step="0.1"
            />
            <span className="text-gray-400 font-medium">SOL</span>
          </div>

          {/* Wheel */}
          <div className="relative mb-10">
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 z-20 drop-shadow-[0_0_10px_rgba(255,215,0,0.8)]">
              <div className="w-0 h-0 border-l-[15px] border-r-[15px] border-t-[25px] border-l-transparent border-r-transparent border-t-yellow-400" />
            </div>

            <div 
              className="absolute inset-0 rounded-full blur-xl opacity-50"
              style={{ background: wheelGradient }}
            />

            <div
              className="relative w-72 h-72 sm:w-80 sm:h-80 rounded-full border-4 border-yellow-400/50 shadow-2xl"
              style={{
                background: wheelGradient,
                transform: `rotate(${rotation}deg)`,
                transition: isSpinning ? 'transform 4s cubic-bezier(0.2, 0.8, 0.2, 1)' : 'none',
              }}
            >
              {coins.map((coin, i) => {
                const angle = (i * 360 / coins.length) + (180 / coins.length);
                const radian = (angle - 90) * (Math.PI / 180);
                const x = 50 + 35 * Math.cos(radian);
                const y = 50 + 35 * Math.sin(radian);
                return (
                  <div
                    key={coin.mint}
                    className="absolute text-2xl drop-shadow-lg"
                    style={{ 
                      left: `${x}%`, 
                      top: `${y}%`,
                      transform: `translate(-50%, -50%) rotate(${-rotation}deg)`,
                      transition: isSpinning ? 'transform 4s cubic-bezier(0.2, 0.8, 0.2, 1)' : 'none',
                    }}
                  >
                    {coin.icon}
                  </div>
                );
              })}

              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-gray-900 border-4 border-yellow-400 flex items-center justify-center shadow-inner">
                <span className="text-2xl">{isSpinning ? '🌀' : isLoading ? '⏳' : '🎲'}</span>
              </div>
            </div>
          </div>

          {/* Controls */}
          {!showResult ? (
            <button
              onClick={spin}
              disabled={isSpinning || isLoading}
              className={`
                px-12 py-4 text-xl font-black rounded-full cursor-pointer
                bg-gradient-to-r from-yellow-500 via-orange-500 to-pink-500
                hover:from-yellow-400 hover:via-orange-400 hover:to-pink-400
                transform hover:scale-105 active:scale-95 transition-all duration-200
                disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                shadow-[0_0_30px_rgba(255,165,0,0.5)]
              `}
            >
              {isSpinning ? '🌀 SPINNING...' : isLoading ? '⏳ LOADING...' : '🎲 SPIN TO APE'}
            </button>
          ) : selectedCoin && (
            <div className="text-center space-y-6 animate-[fadeIn_0.5s_ease-out]">
              <div className="text-7xl animate-bounce">{selectedCoin.icon}</div>
              <div>
                <h2 className="text-4xl font-black mb-1">
                  <span style={{ color: selectedCoin.color }}>${selectedCoin.symbol}</span>
                </h2>
                <p className="text-gray-400">{selectedCoin.name}</p>
              </div>
              
              <div className="flex gap-4 justify-center">
                <button
                  onClick={apeIn}
                  className="px-8 py-3 text-lg font-bold rounded-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 transform hover:scale-105 transition-all shadow-lg cursor-pointer"
                >
                  🚀 APE {betAmount} SOL
                </button>
                <button
                  onClick={() => { setShowResult(false); setSelectedCoin(null); }}
                  className="px-8 py-3 text-lg font-bold rounded-full bg-white/10 hover:bg-white/20 transition-all cursor-pointer"
                >
                  🔄 Again
                </button>
              </div>
            </div>
          )}

          {/* Token list */}
          <div className="mt-12 flex flex-wrap justify-center gap-3 max-w-lg">
            {coins.map((coin) => (
              <div 
                key={coin.mint}
                className="flex items-center gap-1 px-3 py-1 rounded-full text-sm"
                style={{ background: `${coin.color}33`, border: `1px solid ${coin.color}55` }}
              >
                <span>{coin.icon}</span>
                <span style={{ color: coin.color }}>{coin.symbol}</span>
              </div>
            ))}
          </div>

          <p className="mt-8 text-gray-600 text-xs text-center max-w-sm">
            ⚠️ Live tokens from Jupiter API. Entertainment only. NFA. DYOR.
          </p>
        </main>
      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
