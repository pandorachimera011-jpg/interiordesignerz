const BettingRules = () => {
  return (
    <div className="bg-card border border-border rounded-xl p-4 space-y-3">
      <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">How to Play</h3>
      <ul className="space-y-2 text-xs text-muted-foreground leading-relaxed">
        <li className="flex gap-2">
          <span className="text-primary font-bold shrink-0">1.</span>
          <span>Enter your bet amount and click <strong className="text-foreground">Place Bet</strong> before or during a round.</span>
        </li>
        <li className="flex gap-2">
          <span className="text-primary font-bold shrink-0">2.</span>
          <span>The multiplier starts at 1.00× and rises. Click <strong className="text-foreground">Cash Out</strong> before it crashes to win.</span>
        </li>
        <li className="flex gap-2">
          <span className="text-primary font-bold shrink-0">3.</span>
          <span>If you don't cash out before the crash, you lose your bet.</span>
        </li>
        <li className="flex gap-2">
          <span className="text-primary font-bold shrink-0">4.</span>
          <span>Use <strong className="text-foreground">Auto Cash Out</strong> to automatically cash out at a target multiplier.</span>
        </li>
        <li className="flex gap-2">
          <span className="text-primary font-bold shrink-0">5.</span>
          <span>Bets placed during a round are queued and activate in the next round.</span>
        </li>
      </ul>
    </div>
  );
};

export default BettingRules;
