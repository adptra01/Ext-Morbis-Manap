import type { Role, ExtensionConfig, CustomUrl } from './types';

export const MessageTypes = {
  GET_ALL: 'GET_ALL',
  GET_CONFIG: 'GET_CONFIG',
  GET_URLS: 'GET_URLS',
  SET_ROLE: 'SET_ROLE',
  TOGGLE_EXTENSION: 'TOGGLE_EXTENSION',
  TOGGLE_FEATURE: 'TOGGLE_FEATURE',
  CHANGE_FEATURE_MODE: 'CHANGE_FEATURE_MODE',
  RESET_CONFIG: 'RESET_CONFIG',
  ADD_URL: 'ADD_URL',
  DELETE_URL: 'DELETE_URL',
  TOGGLE_URL: 'TOGGLE_URL',
  OPEN_SIDE_PANEL: 'OPEN_SIDE_PANEL',
  CONFIG_CHANGED: 'CONFIG_CHANGED',

  // --- Batch feature actions (content script ↔ side panel via background proxy) ---
  PAGE_CONTEXT: 'PAGE_CONTEXT',
  GET_PAGE_CONTEXT: 'GET_PAGE_CONTEXT',
  TAB_ACTION: 'TAB_ACTION',
  TAB_ACTION_RESULT: 'TAB_ACTION_RESULT',
  BATCH_UPLOAD_ACTION: 'BATCH_UPLOAD_ACTION',
  BATCH_DELETE_ACTION: 'BATCH_DELETE_ACTION',
  PROXY_FETCH: 'PROXY_FETCH',
} as const;

export type MessageType = (typeof MessageTypes)[keyof typeof MessageTypes];

type RequestMap = {
  GET_ALL: { type: 'GET_ALL' };
  GET_CONFIG: { type: 'GET_CONFIG' };
  GET_URLS: { type: 'GET_URLS' };
  SET_ROLE: { type: 'SET_ROLE'; role: Role };
  TOGGLE_EXTENSION: { type: 'TOGGLE_EXTENSION'; enabled: boolean };
  TOGGLE_FEATURE: { type: 'TOGGLE_FEATURE'; key: string; enabled: boolean };
  CHANGE_FEATURE_MODE: { type: 'CHANGE_FEATURE_MODE'; key: string; mode: string };
  RESET_CONFIG: { type: 'RESET_CONFIG' };
  ADD_URL: { type: 'ADD_URL'; url: string };
  DELETE_URL: { type: 'DELETE_URL'; id: string };
  TOGGLE_URL: { type: 'TOGGLE_URL'; id: string; enabled: boolean };
  OPEN_SIDE_PANEL: { type: 'OPEN_SIDE_PANEL' };
  CONFIG_CHANGED: { type: 'CONFIG_CHANGED' };

  // Content script → Background: notify page state
  PAGE_CONTEXT: { type: 'PAGE_CONTEXT'; feature: string; data: Record<string, unknown> };

  // Side panel → Background: get current tab context
  GET_PAGE_CONTEXT: { type: 'GET_PAGE_CONTEXT' };

  // Side panel → Background → Content script: execute action
  TAB_ACTION: { type: 'TAB_ACTION'; action: string; payload: unknown };

  // Content script → Background → Side panel: action result
  TAB_ACTION_RESULT: { type: 'TAB_ACTION_RESULT'; action: string; data: unknown };

  // Proxy fetch (side panel → background: fetch HTML from hospital server)
  PROXY_FETCH: { type: 'PROXY_FETCH'; url: string; method: string; data: Record<string, string> };

  // Batch actions
  BATCH_UPLOAD_ACTION: { type: 'BATCH_UPLOAD_ACTION'; payload: unknown };
  BATCH_DELETE_ACTION: { type: 'BATCH_DELETE_ACTION'; payload: unknown };
};

type ResponseMap = {
  GET_ALL: { config: ExtensionConfig; urls: CustomUrl[]; defaultConfig: ExtensionConfig };
  GET_CONFIG: { config: ExtensionConfig };
  GET_URLS: { urls: CustomUrl[] };
  SET_ROLE: { success: true };
  TOGGLE_EXTENSION: { success: true };
  TOGGLE_FEATURE: { success: true };
  CHANGE_FEATURE_MODE: { success: true };
  RESET_CONFIG: { success: true };
  ADD_URL: { success: true };
  DELETE_URL: { success: true };
  TOGGLE_URL: { success: true };
  OPEN_SIDE_PANEL: { success: true };
  CONFIG_CHANGED: { success: true };

  PAGE_CONTEXT: { success: true };
  GET_PAGE_CONTEXT: { context: { feature: string; data: Record<string, unknown> } | null };
  TAB_ACTION: { success: true };
  TAB_ACTION_RESULT: { success: true };
  BATCH_UPLOAD_ACTION: { success: true };
  BATCH_DELETE_ACTION: { success: true };
  PROXY_FETCH: { success: boolean; html?: string; error?: string };
};

export function sendMessage<T extends MessageType>(
  message: RequestMap[T],
): Promise<ResponseMap[T]> {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(message, (response) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve(response as ResponseMap[T]);
      }
    });
  });
}

export type MessageHandler = (
  message: { type: string },
  sender: chrome.runtime.MessageSender,
  sendResponse: (response?: unknown) => void,
) => boolean | void;

export function isValidMessageType(type: string): type is MessageType {
  return Object.values(MessageTypes).includes(type as MessageType);
}
