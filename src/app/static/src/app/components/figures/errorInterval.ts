interface ErrorInterval {
    plus: number;
    minus: number;
}

export function getErrorInterval(low: number, mean: number, high: number): ErrorInterval {
    return {
      plus: high - mean,
      minus: mean - low
    };
}
