// utils/performance.ts
export const trackPerformance = () => {
    if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
        // Core Web Vitals
        const observer = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                console.log(`[Equity Performance] ${entry.name}: ${entry.duration.toFixed(2)}ms`);

                // Send to analytics
                fetch('/api/performance', {
                    method: 'POST',
                    body: JSON.stringify({
                        metric: entry.name,
                        value: entry.duration,
                        timestamp: new Date().toISOString(),
                        userAgent: navigator.userAgent,
                    }),
                });
            }
        });

        observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] });
    }
};