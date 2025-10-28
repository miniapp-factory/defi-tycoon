"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";

type Allocation = {
  eth: number;
  btc: number;
  stable: number;
};

type AssetValues = {
  eth: number;
  btc: number;
  stable: number;
};

export function Simulation() {
  const [allocation, setAllocation] = useState<Allocation>({
    eth: 33.33,
    btc: 33.33,
    stable: 33.34,
  });

  const [values, setValues] = useState<AssetValues>({
    eth: 0,
    btc: 0,
    stable: 0,
  });

  const [round, setRound] = useState(0);
  const [history, setHistory] = useState<AssetValues[]>([]);
  const [finalResult, setFinalResult] = useState<number | null>(null);

  const totalInitial = 1000;

  const startSimulation = () => {
    // Validate allocation sum
    const sum = allocation.eth + allocation.btc + allocation.stable;
    if (Math.abs(sum - 100) > 0.01) {
      alert("Allocation percentages must sum to 100%");
      return;
    }

    // Initialize asset values based on allocation
    const initValues: AssetValues = {
      eth: (allocation.eth / 100) * totalInitial,
      btc: (allocation.btc / 100) * totalInitial,
      stable: (allocation.stable / 100) * totalInitial,
    };
    setValues(initValues);
    setHistory([]);
    setRound(1);
    setFinalResult(null);
  };

  const simulateRound = () => {
    setValues((prev) => {
      const newValues: AssetValues = {
        eth: prev.eth * (1 + randomFactor()),
        btc: prev.btc * (1 + randomFactor()),
        stable: prev.stable * (1 + randomFactor()),
      };
      setHistory((h) => [...h, newValues]);
      if (round >= 3) {
        const total = newValues.eth + newValues.btc + newValues.stable;
        setFinalResult(total - totalInitial);
      } else {
        setRound((r) => r + 1);
      }
      return newValues;
    });
  };

  const randomFactor = () => Math.random() * 0.2 - 0.1; // -10% to +10%

  const reset = () => {
    setAllocation({ eth: 33.33, btc: 33.33, stable: 33.34 });
    setValues({ eth: 0, btc: 0, stable: 0 });
    setRound(0);
    setHistory([]);
    setFinalResult(null);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <h2 className="text-xl font-semibold">Crypto Portfolio Simulator</h2>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-2">
          <div>
            <label className="block text-sm font-medium mb-1">ETH %</label>
            <Input
              type="number"
              step="0.01"
              value={allocation.eth}
              onChange={(e) =>
                setAllocation((a) => ({ ...a, eth: parseFloat(e.target.value) }))
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">BTC %</label>
            <Input
              type="number"
              step="0.01"
              value={allocation.btc}
              onChange={(e) =>
                setAllocation((a) => ({ ...a, btc: parseFloat(e.target.value) }))
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Stablecoins %</label>
            <Input
              type="number"
              step="0.01"
              value={allocation.stable}
              onChange={(e) =>
                setAllocation((a) => ({ ...a, stable: parseFloat(e.target.value) }))
              }
            />
          </div>
        </div>

        {round > 0 && (
          <div>
            <h3 className="font-medium mb-2">Round {round} Results</h3>
            <ul className="list-disc pl-5">
              <li>ETH: ${values.eth.toFixed(2)}</li>
              <li>BTC: ${values.btc.toFixed(2)}</li>
              <li>Stablecoins: ${values.stable.toFixed(2)}</li>
            </ul>
          </div>
        )}

        {finalResult !== null && (
          <div className="mt-4">
            <h3 className="font-medium mb-2">Final Result</h3>
            <p>
              Total Portfolio Value: ${(values.eth + values.btc + values.stable).toFixed(2)}
            </p>
            <p
              className={
                finalResult >= 0 ? "text-green-600" : "text-red-600"
              }
            >
              Profit/Loss: {finalResult.toFixed(2)}
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button onClick={reset}>Reset</Button>
        {round === 0 ? (
          <Button onClick={startSimulation}>Start Simulation</Button>
        ) : round < 3 ? (
          <Button onClick={simulateRound}>Simulate Next Round</Button>
        ) : (
          <Button disabled>Simulation Complete</Button>
        )}
      </CardFooter>
    </Card>
  );
}
