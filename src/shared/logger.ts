export function createLogger(name: string) {
  const prefix = `[MORBIS Ext] [${name}]`;
  return {
    log: (...args: unknown[]) => console.log(prefix, ...args),
    warn: (...args: unknown[]) => console.warn(prefix, ...args),
    error: (...args: unknown[]) => console.error(prefix, ...args),
  };
}

export type Logger = ReturnType<typeof createLogger>;
