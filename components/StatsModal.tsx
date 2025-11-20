
import React from 'react';

interface Stats {
  gamesPlayed: number;
  gamesWon: number;
  longestStreak: number;
  totalScoreDelta: number;
}

interface StatsModalProps {
  stats: Stats;
  onClose: () => void;
  onReset: () => void;
}

const StatsModal: React.FC<StatsModalProps> = ({ stats, onClose, onReset }) => {
  const winRate = stats.gamesPlayed > 0 
    ? Math.round((stats.gamesWon / stats.gamesPlayed) * 100) 
    : 0;
  
  const averageScore = stats.gamesPlayed > 0
    ? (stats.totalScoreDelta / stats.gamesPlayed).toFixed(1)
    : '0';

  const StatCard = ({ title, value, icon, color }: { title: string, value: string | number, icon: string, color: string }) => (
    <div className={`flex flex-col items-center justify-center p-4 rounded-xl shadow-sm border-2 ${color} bg-white`}>
        <span className="text-3xl mb-2">{icon}</span>
        <span className="text-2xl font-bold text-gray-800">{value}</span>
        <span className="text-xs text-gray-500 uppercase font-bold tracking-wider">{title}</span>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[110] flex items-center justify-center p-4 animate-fade">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-slide-up relative">
        <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>

        <h2 className="text-2xl font-bold text-blue-800 mb-6 text-center flex items-center justify-center gap-2">
            <span>📊</span> Your Statistics
        </h2>

        <div className="grid grid-cols-2 gap-4 mb-8">
            <StatCard 
                title="Games Played" 
                value={stats.gamesPlayed} 
                icon="🎮" 
                color="border-blue-100" 
            />
            <StatCard 
                title="Win Rate" 
                value={`${winRate}%`} 
                icon="🏆" 
                color="border-green-100" 
            />
            <StatCard 
                title="Best Streak" 
                value={stats.longestStreak} 
                icon="🔥" 
                color="border-orange-100" 
            />
            <StatCard 
                title="Avg. Pts/Game" 
                value={averageScore} 
                icon="📈" 
                color="border-purple-100" 
            />
        </div>

        <div className="flex flex-col gap-3">
             <button
                onClick={onReset}
                className="text-red-500 text-sm hover:text-red-700 hover:underline transition-colors text-center"
            >
                Reset Statistics
            </button>
            <button
                onClick={onClose}
                className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-md hover:shadow-lg"
            >
                Back to Game
            </button>
        </div>
      </div>
    </div>
  );
};

export default StatsModal;
