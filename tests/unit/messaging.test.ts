import { describe, it, expect } from 'vitest';
import { MessageTypes, isValidMessageType } from '../../src/shared/messaging.js';

describe('MessageTypes', () => {
  it('has all required message types defined', () => {
    const required = [
      'GET_ALL',
      'GET_CONFIG',
      'GET_URLS',
      'SET_ROLE',
      'TOGGLE_EXTENSION',
      'TOGGLE_FEATURE',
      'CHANGE_FEATURE_MODE',
      'RESET_CONFIG',
      'ADD_URL',
      'DELETE_URL',
      'TOGGLE_URL',
      'OPEN_SIDE_PANEL',
      'CONFIG_CHANGED',
      'PAGE_CONTEXT',
      'GET_PAGE_CONTEXT',
      'TAB_ACTION',
      'TAB_ACTION_RESULT',
      'BATCH_UPLOAD_ACTION',
      'BATCH_DELETE_ACTION',
      'PROXY_FETCH',
    ];
    for (const t of required) {
      expect(MessageTypes[t as keyof typeof MessageTypes]).toBe(t);
    }
  });

  it('all values are non-empty strings', () => {
    for (const val of Object.values(MessageTypes)) {
      expect(typeof val).toBe('string');
      expect(val.length).toBeGreaterThan(0);
    }
  });
});

describe('isValidMessageType', () => {
  it('returns true for valid message types', () => {
    expect(isValidMessageType('GET_ALL')).toBe(true);
    expect(isValidMessageType('SET_ROLE')).toBe(true);
    expect(isValidMessageType('PROXY_FETCH')).toBe(true);
  });

  it('returns false for invalid message types', () => {
    expect(isValidMessageType('INVALID_TYPE')).toBe(false);
    expect(isValidMessageType('')).toBe(false);
    expect(isValidMessageType('get_all')).toBe(false);
  });

  it('returns false for null and undefined', () => {
    expect(isValidMessageType(null as any)).toBe(false);
    expect(isValidMessageType(undefined as any)).toBe(false);
  });
});

describe('sendMessage (interface)', () => {
  it('sendMessage function type signature is correct', async () => {
    const { sendMessage } = await import('../../src/shared/messaging.js');
    expect(typeof sendMessage).toBe('function');
  });
});
