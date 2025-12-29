import { differenceInDays, parseISO, subDays, format } from 'date-fns';
import type { LogEntry } from '../context/AppContext';

export interface CycleStats {
    averageLength: number;
    lastPeriodStart: Date | null;
    predictedNextPeriod: Date | null;
    cycleHistory: number[];
}

export const analyzeCycles = (logs: Record<string, LogEntry>, defaultCycleLength: number = 28): CycleStats => {
    // 1. Identify Period Starts
    const periodStarts: Date[] = [];

    // We iterate logs to find starts
    // But to find "Starts", it's easier to look at chronological order or check gaps.
    // Let's sort Oldest -> Newest for easy loop
    const chronoDates = Object.keys(logs).sort(); // default string sort works for yyyy-mm-dd

    chronoDates.forEach(dateKey => {
        const log = logs[dateKey];
        if (log.flow) {
            // Check if yesterday had a flow
            const yesterday = subDays(parseISO(dateKey), 1);
            const yesterdayKey = format(yesterday, 'yyyy-MM-dd');

            if (!logs[yesterdayKey]?.flow) {
                // This is a start of a period (or a break in logging)
                periodStarts.push(parseISO(dateKey));
            }
        }
    });

    // 2. Calculate Cycle Lengths
    const cycleLengths: number[] = [];
    // Cycle length is diff between Start N and Start N+1
    for (let i = 0; i < periodStarts.length - 1; i++) {
        const startCurrent = periodStarts[i];
        const startNext = periodStarts[i + 1];
        const diff = differenceInDays(startNext, startCurrent);

        // Filter out unreasonable cycles (e.g. missed logging for months)
        if (diff > 15 && diff < 100) {
            cycleLengths.push(diff);
        }
    }

    // 3. Calculate Average (Last 3)
    let averageLength = defaultCycleLength;
    const history = cycleLengths.slice(-3); // Last 3 cycles
    if (history.length > 0) {
        const sum = history.reduce((a, b) => a + b, 0);
        averageLength = Math.round(sum / history.length);
    }

    const lastPeriodStart = periodStarts.length > 0 ? periodStarts[periodStarts.length - 1] : null;

    return {
        averageLength,
        lastPeriodStart,
        predictedNextPeriod: null, // can calculate in UI
        cycleHistory: cycleLengths
    };
};
