import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, TrendingUp, TrendingDown, ArrowDownToLine, ArrowUpFromLine, Clock } from "lucide-react";

interface Transaction {
  id: string;
  bet_amount: number;
  cashout_multiplier: number | null;
  crashed: boolean;
  profit: number;
  created_at: string;
}

const Transactions = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loadingTx, setLoadingTx] = useState(true);
  const [filter, setFilter] = useState<"all" | "wins" | "losses">("all");

  useEffect(() => {
    if (!loading && !user) navigate("/auth");
  }, [user, loading, navigate]);

  useEffect(() => {
    if (!user) return;
    const fetchTransactions = async () => {
      const { data } = await supabase
        .from("bet_history")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(100);
      if (data) setTransactions(data);
      setLoadingTx(false);
    };
    fetchTransactions();
  }, [user]);

  const filtered = transactions.filter(tx => {
    if (filter === "wins") return !tx.crashed && tx.cashout_multiplier;
    if (filter === "losses") return tx.crashed;
    return true;
  });

  const totalDeposited = 0; // Will be populated when M-Pesa transactions table is added
  const totalWagered = transactions.reduce((s, t) => s + Number(t.bet_amount), 0);
  const totalProfit = transactions.reduce((s, t) => s + Number(t.profit), 0);
  const totalWins = transactions.filter(t => !t.crashed && t.cashout_multiplier).length;
  const totalLosses = transactions.filter(t => t.crashed).length;

  if (loading || !user) return null;

  return (
    <div className="min-h-screen bg-background">
      <header className="flex items-center gap-3 px-4 py-3 border-b border-border bg-card/80">
        <button
          onClick={() => navigate("/profile")}
          className="w-8 h-8 rounded-full bg-secondary border border-border flex items-center justify-center hover:bg-secondary/80 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-foreground" />
        </button>
        <Clock className="w-5 h-5 text-primary" />
        <h1 className="text-sm font-bold text-foreground">Transaction History</h1>
      </header>

      <div className="max-w-lg mx-auto p-4 space-y-4">
        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-card border border-border rounded-xl p-3 text-center">
            <p className="text-[10px] text-muted-foreground uppercase">Wagered</p>
            <p className="font-mono text-sm font-bold text-foreground">KES {totalWagered.toLocaleString()}</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-3 text-center">
            <div className="flex items-center justify-center gap-1">
              <TrendingUp className="w-3 h-3 text-gaming-green" />
              <p className="text-[10px] text-muted-foreground uppercase">Wins</p>
            </div>
            <p className="font-mono text-sm font-bold text-gaming-green">{totalWins}</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-3 text-center">
            <div className="flex items-center justify-center gap-1">
              <TrendingDown className="w-3 h-3 text-destructive" />
              <p className="text-[10px] text-muted-foreground uppercase">Losses</p>
            </div>
            <p className="font-mono text-sm font-bold text-destructive">{totalLosses}</p>
          </div>
        </div>

        {/* Net P&L */}
        <div className="bg-card border border-border rounded-xl p-4 text-center">
          <p className="text-[10px] text-muted-foreground uppercase mb-1">Net Profit / Loss</p>
          <p className={`font-mono text-2xl font-bold ${totalProfit >= 0 ? "text-gaming-green" : "text-destructive"}`}>
            {totalProfit >= 0 ? "+" : ""}KES {totalProfit.toLocaleString()}
          </p>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2">
          {(["all", "wins", "losses"] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`flex-1 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors ${
                filter === f
                  ? "bg-primary/20 text-primary border border-primary/30"
                  : "bg-secondary text-muted-foreground border border-border hover:bg-secondary/80"
              }`}
            >
              {f === "all" ? "All" : f === "wins" ? "Wins" : "Losses"}
            </button>
          ))}
        </div>

        {/* Transaction List */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-border">
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
              Bet History ({filtered.length})
            </h3>
          </div>
          {loadingTx ? (
            <div className="p-8 text-center text-sm text-muted-foreground">Loading...</div>
          ) : filtered.length === 0 ? (
            <div className="p-8 text-center text-sm text-muted-foreground">
              {filter === "all" ? "No transactions yet" : `No ${filter} found`}
            </div>
          ) : (
            <div className="divide-y divide-border/30 max-h-[500px] overflow-y-auto">
              {filtered.map(tx => (
                <div
                  key={tx.id}
                  className={`px-4 py-3 flex items-center justify-between ${
                    tx.crashed ? "bg-destructive/5" : "bg-gaming-green/5"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      tx.crashed
                        ? "bg-destructive/10 border border-destructive/30"
                        : "bg-gaming-green/10 border border-gaming-green/30"
                    }`}>
                      {tx.crashed ? (
                        <TrendingDown className="w-3.5 h-3.5 text-destructive" />
                      ) : (
                        <TrendingUp className="w-3.5 h-3.5 text-gaming-green" />
                      )}
                    </div>
                    <div>
                      <p className="font-mono text-sm font-semibold text-foreground">
                        KES {Number(tx.bet_amount).toLocaleString()}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        {new Date(tx.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    {tx.crashed ? (
                      <span className="text-destructive font-mono text-sm font-semibold">Crashed</span>
                    ) : (
                      <span className="text-gaming-green font-mono text-sm font-semibold">
                        {tx.cashout_multiplier ? Number(tx.cashout_multiplier).toFixed(2) : "—"}x
                      </span>
                    )}
                    <p className={`text-[10px] font-mono ${
                      Number(tx.profit) >= 0 ? "text-gaming-green" : "text-destructive"
                    }`}>
                      {Number(tx.profit) >= 0 ? "+" : ""}KES {Number(tx.profit).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Transactions;
