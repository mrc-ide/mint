interface ErrorInterval {
    plus: number;
    minus: number;
}

export function getErrorInterval(low: number, mean: number, high: number): ErrorInterval {
    return {
      plus: Math.max(high, low, mean) - mean,
      minus: mean - Math.min(high, low, mean)
    };
}
