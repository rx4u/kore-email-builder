/**
 * Performance Utilities
 * 
 * Provides helpers for optimizing React component performance including
 * memoization utilities, performance monitoring, and optimization patterns.
 * 
 * Part of Phase 1: Performance Optimization
 */

import React from 'react';

/**
 * Performance monitoring configuration
 */
export interface PerformanceConfig {
  enableMemoization: boolean;
  maxRenderTime: number; // ms
  warnOnSlowRender: boolean;
  enableProfiling: boolean;
}

/**
 * Default performance configuration
 */
export const DEFAULT_PERFORMANCE_CONFIG: PerformanceConfig = {
  enableMemoization: true,
  maxRenderTime: 16, // 60fps threshold
  warnOnSlowRender: process.env.NODE_ENV === 'development',
  enableProfiling: process.env.NODE_ENV === 'development',
};

/**
 * Performance metrics for monitoring
 */
export interface PerformanceMetrics {
  renderTime: number;
  componentName: string;
  timestamp: number;
  propsChanged?: string[];
}

/**
 * Performance monitor class for tracking render times
 */
class PerformanceMonitor {
  private metrics: PerformanceMetrics[] = [];
  private maxMetrics = 100; // Keep last 100 metrics
  private config: PerformanceConfig;

  constructor(config: PerformanceConfig = DEFAULT_PERFORMANCE_CONFIG) {
    this.config = config;
  }

  /**
   * Record a component render
   */
  recordRender(
    componentName: string,
    renderTime: number,
    propsChanged?: string[]
  ): void {
    if (!this.config.enableProfiling) return;

    const metric: PerformanceMetrics = {
      componentName,
      renderTime,
      timestamp: performance.now(),
      propsChanged,
    };

    this.metrics.push(metric);

    // Keep only last N metrics
    if (this.metrics.length > this.maxMetrics) {
      this.metrics.shift();
    }

    // Warn if render is slow
    if (
      this.config.warnOnSlowRender &&
      renderTime > this.config.maxRenderTime
    ) {
      console.warn(
        `⚠️ Slow render detected: ${componentName} took ${renderTime.toFixed(2)}ms`,
        propsChanged ? `Props changed: ${propsChanged.join(', ')}` : ''
      );
    }
  }

  /**
   * Get metrics for a specific component
   */
  getMetrics(componentName?: string): PerformanceMetrics[] {
    if (!componentName) return this.metrics;
    return this.metrics.filter((m) => m.componentName === componentName);
  }

  /**
   * Get average render time for a component
   */
  getAverageRenderTime(componentName: string): number {
    const metrics = this.getMetrics(componentName);
    if (metrics.length === 0) return 0;

    const total = metrics.reduce((sum, m) => sum + m.renderTime, 0);
    return total / metrics.length;
  }

  /**
   * Clear all metrics
   */
  clear(): void {
    this.metrics = [];
  }

  /**
   * Generate performance report
   */
  generateReport(): string {
    const componentStats = new Map<string, { count: number; total: number; max: number }>();

    this.metrics.forEach((metric) => {
      const stats = componentStats.get(metric.componentName) || {
        count: 0,
        total: 0,
        max: 0,
      };

      stats.count++;
      stats.total += metric.renderTime;
      stats.max = Math.max(stats.max, metric.renderTime);

      componentStats.set(metric.componentName, stats);
    });

    let report = '📊 Performance Report\n\n';
    report += 'Component | Renders | Avg Time | Max Time\n';
    report += '----------|---------|----------|----------\n';

    Array.from(componentStats.entries())
      .sort((a, b) => b[1].total - a[1].total) // Sort by total time
      .forEach(([name, stats]) => {
        const avg = (stats.total / stats.count).toFixed(2);
        const max = stats.max.toFixed(2);
        report += `${name} | ${stats.count} | ${avg}ms | ${max}ms\n`;
      });

    return report;
  }
}

/**
 * Global performance monitor instance
 */
export const performanceMonitor = new PerformanceMonitor();

/**
 * HOC for measuring component render performance
 */
export function withPerformanceTracking<P extends object>(
  Component: React.ComponentType<P>,
  componentName?: string
): React.ComponentType<P> {
  const name = componentName || Component.displayName || Component.name || 'Unknown';

  return React.memo((props: P) => {
    const startTime = performance.now();

    React.useEffect(() => {
      const renderTime = performance.now() - startTime;
      performanceMonitor.recordRender(name, renderTime);
    });

    return <Component {...props} />;
  });
}

/**
 * Custom equality function for complex objects
 * Performs shallow comparison of object properties
 */
export function shallowEqual<T extends Record<string, any>>(
  objA: T,
  objB: T
): boolean {
  if (objA === objB) return true;
  if (!objA || !objB) return false;

  const keysA = Object.keys(objA);
  const keysB = Object.keys(objB);

  if (keysA.length !== keysB.length) return false;

  for (const key of keysA) {
    if (objA[key] !== objB[key]) return false;
  }

  return true;
}

/**
 * Deep comparison for nested objects (use sparingly)
 */
export function deepEqual(objA: any, objB: any): boolean {
  if (objA === objB) return true;
  if (!objA || !objB) return false;
  if (typeof objA !== 'object' || typeof objB !== 'object') return false;

  const keysA = Object.keys(objA);
  const keysB = Object.keys(objB);

  if (keysA.length !== keysB.length) return false;

  for (const key of keysA) {
    if (!keysB.includes(key)) return false;
    if (!deepEqual(objA[key], objB[key])) return false;
  }

  return true;
}

/**
 * Debounce function for performance optimization
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function (this: any, ...args: Parameters<T>) {
    const context = this;

    if (timeout) clearTimeout(timeout);

    timeout = setTimeout(() => {
      func.apply(context, args);
    }, wait);
  };
}

/**
 * Throttle function for performance optimization
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean = false;

  return function (this: any, ...args: Parameters<T>) {
    const context = this;

    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}

/**
 * Utility to batch state updates
 */
export function batchUpdates<T>(
  updates: Array<() => void>,
  callback?: () => void
): void {
  // In React 18+, updates are automatically batched
  // This function provides a consistent API
  updates.forEach((update) => update());
  if (callback) callback();
}

/**
 * Check if props have changed (for debugging)
 */
export function getChangedProps<P extends Record<string, any>>(
  prevProps: P,
  nextProps: P
): string[] {
  const changed: string[] = [];

  const allKeys = new Set([
    ...Object.keys(prevProps),
    ...Object.keys(nextProps),
  ]);

  allKeys.forEach((key) => {
    if (prevProps[key] !== nextProps[key]) {
      changed.push(key);
    }
  });

  return changed;
}

/**
 * Memoization helper for expensive calculations
 */
export function memoize<T extends (...args: any[]) => any>(
  func: T,
  resolver?: (...args: Parameters<T>) => string
): T {
  const cache = new Map<string, ReturnType<T>>();

  return ((...args: Parameters<T>) => {
    const key = resolver ? resolver(...args) : JSON.stringify(args);

    if (cache.has(key)) {
      return cache.get(key)!;
    }

    const result = func(...args);
    cache.set(key, result);

    // Limit cache size
    if (cache.size > 100) {
      const firstKey = cache.keys().next().value;
      cache.delete(firstKey);
    }

    return result;
  }) as T;
}

/**
 * Performance optimization tips logged to console (dev only)
 */
export function logPerformanceTips(): void {
  if (process.env.NODE_ENV !== 'development') return;

  console.groupCollapsed('⚡ Performance Optimization Tips');
  console.log('1. Use React.memo() for components that render often with same props');
  console.log('2. Use useMemo() for expensive calculations');
  console.log('3. Use useCallback() for functions passed to child components');
  console.log('4. Avoid inline object/array creation in JSX');
  console.log('5. Use key prop correctly in lists');
  console.log('6. Lazy load components with React.lazy()');
  console.log('7. Debounce/throttle expensive operations');
  console.groupEnd();
}
