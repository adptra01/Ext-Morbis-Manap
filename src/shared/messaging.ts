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
