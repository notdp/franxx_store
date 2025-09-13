type Level = 'debug' | 'info' | 'warn' | 'error'

const NS = '[FRX]'

function enabled(level: Level) {
  // default: debug enabled only in non-prod; info/warn/error always allowed
  const env = process.env.NODE_ENV
  if (level === 'debug') return env !== 'production' && process.env.FRX_DEBUG !== '0'
  return true
}

function out(level: Level, scope: string, ...args: any[]) {
  if (!enabled(level)) return
  const tag = `${NS}[${scope}]`
  switch (level) {
    case 'debug':
      // eslint-disable-next-line no-console
      console.log(tag, ...args)
      break
    case 'info':
      // eslint-disable-next-line no-console
      console.log(tag, ...args)
      break
    case 'warn':
      // eslint-disable-next-line no-console
      console.warn(tag, ...args)
      break
    case 'error':
      // eslint-disable-next-line no-console
      console.error(tag, ...args)
      break
  }
}

export const log = {
  debug: (scope: string, ...args: any[]) => out('debug', scope, ...args),
  info: (scope: string, ...args: any[]) => out('info', scope, ...args),
  warn: (scope: string, ...args: any[]) => out('warn', scope, ...args),
  error: (scope: string, ...args: any[]) => out('error', scope, ...args),
}

