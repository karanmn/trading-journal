'use client';

import React, { useState } from 'react';
import { TrendingUp, History, Upload, Wallet, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface Trade {
  id: number;
  account: string;
  date: string;
  asset: string;
  type: 'Buy' | 'Sell';
  price: string;
  pnl: number;
}

export default function TradingJournal() {
  const [activeTab, setActiveTab] = useState<'journal' | 'upload'>('journal');
  const [selectedAccount, setSelectedAccount] = useState<string>('all');

  // Initial records containing both dprime account and VT Markets data
  const [trades, setTrades] = useState<Trade[]>([
    { id: 1, account: 'dprime account', date: '2026-09-02 18:16', asset: 'XAUUSD.s', type: 'Sell', price: '4386.44 → 4371.08', pnl: 15.36 },
    { id: 2, account: 'dprime account', date: '2026-09-02 18:16', asset: 'BTCUST.cfd', type: 'Sell', price: '77163.52 → 76818.70', pnl: 3.45 },
    { id: 3, account: 'VT Markets', date: '2026-09-11 06:06', asset: 'XAUUSD-STD', type: 'Sell', price: '4321.64 → 4319.21', pnl: 2.43 },
    { id: 4, account: 'VT Markets', date: '2026-09-09 16:24', asset: 'XAUUSD-STD', type: 'Buy', price: '4419.66 → 4426.87', pnl: 7.21 },
  ]);

  // Form states for manual or simulated upload entry
  const [newAccount, setNewAccount] = useState('dprime account');
  const [newAsset, setNewAsset] = useState('XAUUSD');
  const [newType, setNewType] = useState<'Buy' | 'Sell'>('Sell');
  const [newPnl, setNewPnl] = useState('');

  const filteredTrades = selectedAccount === 'all' 
    ? trades 
    : trades.filter(t => t.account === selectedAccount);

  const totalPnl = filteredTrades.reduce((acc, curr) => acc + curr.pnl, 0);

  const handleAddTrade = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPnl) return;

    const newTradeEntry: Trade = {
      id: trades.length + 1,
      account: newAccount,
      date: new Date().toISOString().slice(0, 16).replace('T', ' '),
      asset: newAsset,
      type: newType,
      price: 'Manual Entry',
      pnl: parseFloat(newPnl),
    };

    setTrades([newTradeEntry, ...trades]);
    setNewPnl('');
    setActiveTab('journal');
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 pb-24 font-sans">
      {/* Top Header */}
      <header className="border-b border-amber-500/20 bg-slate-900/60 p-4 sticky top-0 z-50 backdrop-blur-md">
        <div className="max-w-md mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-amber-500/10 rounded-xl border border-amber-500/20 text-amber-400">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h1 className="text-base font-bold text-slate-100 tracking-wide">Multi-Account Journal</h1>
          </div>
          <span className="text-[11px] font-semibold px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
            Live Sync
          </span>
        </div>
      </header>

      <div className="max-w-md mx-auto p-4 space-y-4">
        {/* Account Filter Pills */}
        <div className="flex gap-1.5 p-1 bg-slate-900 rounded-2xl border border-slate-800/80 shadow-lg">
          {['all', 'dprime account', 'VT Markets'].map((acc) => (
            <button
              key={acc}
              onClick={() => setSelectedAccount(acc)}
              className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all duration-200 ${
                selectedAccount === acc 
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {acc === 'all' ? 'All Accounts' : acc}
            </button>
          ))}
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-slate-900/70 border border-slate-800/80 p-4 rounded-2xl shadow-xl">
            <span className="text-[11px] font-medium text-slate-400 block mb-1 uppercase tracking-wider">Filtered P&L</span>
            <span className={`text-xl font-black tracking-tight ${totalPnl >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {totalPnl >= 0 ? `+$${totalPnl.toFixed(2)}` : `-$${Math.abs(totalPnl).toFixed(2)}`}
            </span>
          </div>
          <div className="bg-slate-900/70 border border-slate-800/80 p-4 rounded-2xl shadow-xl">
            <span className="text-[11px] font-medium text-slate-400 block mb-1 uppercase tracking-wider">Total Positions</span>
            <span className="text-xl font-black text-slate-100">{filteredTrades.length}</span>
          </div>
        </div>

        {/* Content Navigation Tabs */}
        <div className="flex border-b border-slate-800">
          <button 
            onClick={() => setActiveTab('journal')}
            className={`pb-3 px-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-all ${
              activeTab === 'journal' ? 'border-amber-500 text-amber-400' : 'border-transparent text-slate-400'
            }`}
          >
            Trade Records
          </button>
          <button 
            onClick={() => setActiveTab('upload')}
            className={`pb-3 px-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-all ${
              activeTab === 'upload' ? 'border-amber-500 text-amber-400' : 'border-transparent text-slate-400'
            }`}
          >
            Add / Upload Entry
          </button>
        </div>

        {/* Tab 1: Trade Logs List */}
        {activeTab === 'journal' && (
          <div className="space-y-3">
            {filteredTrades.length === 0 ? (
              <div className="text-center py-12 text-slate-500 text-xs">No records found for this account.</div>
            ) : (
              filteredTrades.map((trade) => (
                <div key={trade.id} className="bg-slate-900/60 border border-slate-800/70 p-3.5 rounded-2xl space-y-2.5 shadow-sm">
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="font-bold text-amber-400/90 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                      {trade.account}
                    </span>
                    <span className="text-slate-500">{trade.date}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-0.5 ${
                        trade.type === 'Buy' ? 'bg-blue-500/15 text-blue-400 border border-blue-500/20' : 'bg-orange-500/15 text-orange-400 border border-orange-500/20'
                      }`}>
                        {trade.type === 'Buy' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                        {trade.type}
                      </span>
                      <span className="font-semibold text-sm text-slate-200">{trade.asset}</span>
                    </div>
                    <span className={`font-bold text-sm ${trade.pnl >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {trade.pnl >= 0 ? `+$${trade.pnl.toFixed(2)}` : `-$${Math.abs(trade.pnl).toFixed(2)}`}
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-400 bg-slate-950/60 p-2 rounded-xl border border-slate-900/80 font-mono">
                    {trade.price}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 2: Upload / Quick Entry Form */}
        {activeTab === 'upload' && (
          <form onSubmit={handleAddTrade} className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl space-y-4 shadow-xl">
            <div>
              <h3 className="font-bold text-sm text-slate-200">Log Trade Details</h3>
              <p className="text-xs text-slate-400 mt-0.5">Quickly append manual transaction outputs or results.</p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1">Select Account</label>
                <select 
                  value={newAccount} 
                  onChange={(e) => setNewAccount(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                >
                  <option value="dprime account">dprime account</option>
                  <option value="VT Markets">VT Markets</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">Asset / Pair</label>
                  <input 
                    type="text" 
                    value={newAsset} 
                    onChange={(e) => setNewAsset(e.target.value)} 
                    placeholder="e.g. XAUUSD"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">Direction</label>
                  <select 
                    value={newType} 
                    onChange={(e) => setNewType(e.target.value as 'Buy' | 'Sell')}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                  >
                    <option value="Sell">Sell</option>
                    <option value="Buy">Buy</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1">Profit / Loss ($)</label>
                <input 
                  type="number" 
                  step="any"
                  value={newPnl} 
                  onChange={(e) => setNewPnl(e.target.value)} 
                  placeholder="e.g. 15.36 or -5.20"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500 font-mono"
                  required
                />
              </div>

              <button 
                type="submit"
                className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-amber-500/10 transition-all mt-2"
              >
                Save Record to Journal
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Mobile Bottom Bar Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-slate-900/90 border-t border-slate-800/80 py-3 px-6 backdrop-blur-md">
        <div className="max-w-md mx-auto flex justify-around text-xs text-slate-400">
          <button 
            onClick={() => setActiveTab('journal')} 
            className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'journal' ? 'text-amber-400 font-bold' : ''}`}
          >
            <History className="w-5 h-5" /> Journal
          </button>
          <button 
            onClick={() => setActiveTab('upload')} 
            className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'upload' ? 'text-amber-400 font-bold' : ''}`}
          >
            <Upload className="w-5 h-5" /> Add Trade
          </button>
        </div>
      </nav>
    </main>
  );
}
