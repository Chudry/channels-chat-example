/**
 * Extends redux-logger.
 * @see https://github.com/LogRocket/redux-logger#usage
 */
import { createLogger } from 'redux-logger'

export const AppLogger = createLogger({
  diff: true,
  duration: true,
})
