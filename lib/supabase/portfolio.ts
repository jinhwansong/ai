import { supabase } from '../supabase';

export type PortfolioPerformance = {
  label: string;
  value: string;
  delta: string;
};

export type PortfolioHolding = {
  name: string;
  ratio: string;
  change: string;
};

export type PortfolioData = {
  performance: PortfolioPerformance[];
  holdings: PortfolioHolding[];
};

export async function getLatestPortfolioFromSupabase(): Promise<PortfolioData | null> {
  const [performanceRes, holdingsRes] = await Promise.all([
    supabase
      .from('portfolio_performance')
      .select('label, value, delta')
      .order('updated_at', { ascending: false })
      .limit(3),
    supabase
      .from('portfolio_holdings')
      .select('name, ratio, change')
      .order('updated_at', { ascending: false })
      .limit(4),
  ]);

  if (performanceRes.error || holdingsRes.error) {
    console.error('Failed to fetch portfolio data from Supabase', performanceRes.error || holdingsRes.error);
    throw performanceRes.error || holdingsRes.error;
  }

  if (!performanceRes.data || performanceRes.data.length === 0) {
    return null;
  }

  return {
    performance: performanceRes.data,
    holdings: holdingsRes.data || [],
  };
}

export async function savePortfolioToSupabase(data: PortfolioData) {
  const { performance, holdings } = data;

  const [perfError, holdingsError] = await Promise.all([
    supabase.from('portfolio_performance').insert(performance),
    supabase.from('portfolio_holdings').insert(holdings),
  ]);

  if (perfError.error || holdingsError.error) {
    console.error('Failed to save portfolio data to Supabase', perfError.error || holdingsError.error);
    throw perfError.error || holdingsError.error;
  }
}

