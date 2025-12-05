import { ImmigrationDetention } from './remandAndSentencingApi/remandAndSentencingClientTypes'
import { components } from './remandAndSentencingApi'

export type AppearanceOutcome = components['schemas']['CourtAppearanceOutcome']

type SessionImmigrationDetention = ImmigrationDetention & {
  complete?: boolean
  delete?: boolean
}

export default SessionImmigrationDetention
