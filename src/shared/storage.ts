import type { ExtensionConfig, CustomUrl } from './types';

const STORAGE_KEY = 'extensionConfig';
const URLS_STORAGE_KEY = 'extensionCustomUrls';

export async function getConfig(): Promise<ExtensionConfig | null> {
  const result = await chrome.storage.sync.get(STORAGE_KEY);
  return result[STORAGE_KEY] ?? null;
}

export async function saveConfig(config: ExtensionConfig): Promise<void> {
  await chrome.storage.sync.set({ [STORAGE_KEY]: config });
}

export async function getUrls(): Promise<CustomUrl[]> {
  const result = await chrome.storage.sync.get(URLS_STORAGE_KEY);
  return result[URLS_STORAGE_KEY] ?? [];
}

export async function saveUrls(urls: CustomUrl[]): Promise<void> {
  await chrome.storage.sync.set({ [URLS_STORAGE_KEY]: urls });
}

export async function getConfigWithFallback(defaultConfig: ExtensionConfig): Promise<ExtensionConfig> {
  const config = await getConfig();
  return config ?? defaultConfig;
}
