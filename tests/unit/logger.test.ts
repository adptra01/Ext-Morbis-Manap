import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createLogger } from '../../src/shared/logger.js';

describe('createLogger', () => {
  beforeEach(() => {
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('creates a logger with log, warn, error methods', () => {
    const logger = createLogger('Test');
    expect(logger).toHaveProperty('log');
    expect(logger).toHaveProperty('warn');
    expect(logger).toHaveProperty('error');
    expect(typeof logger.log).toBe('function');
    expect(typeof logger.warn).toBe('function');
    expect(typeof logger.error).toBe('function');
  });

  it('log prefixes messages with module name', () => {
    const logger = createLogger('Background');
    logger.log('started');
    expect(console.log).toHaveBeenCalledWith('[MORBIS Ext] [Background]', 'started');
  });

  it('warn prefixes messages', () => {
    const logger = createLogger('Popup');
    logger.warn('deprecated');
    expect(console.warn).toHaveBeenCalledWith('[MORBIS Ext] [Popup]', 'deprecated');
  });

  it('error prefixes messages', () => {
    const logger = createLogger('Core');
    logger.error('failed', new Error('test'));
    expect(console.error).toHaveBeenCalledWith('[MORBIS Ext] [Core]', 'failed', expect.any(Error));
  });

  it('handles multiple arguments', () => {
    const logger = createLogger('Multi');
    logger.log('a', 'b', 'c');
    expect(console.log).toHaveBeenCalledWith('[MORBIS Ext] [Multi]', 'a', 'b', 'c');
  });

  it('handles empty name', () => {
    const logger = createLogger('');
    logger.log('test');
    expect(console.log).toHaveBeenCalledWith('[MORBIS Ext] []', 'test');
  });
});
