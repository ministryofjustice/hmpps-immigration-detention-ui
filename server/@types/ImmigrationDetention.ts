import { ImmigrationDetention } from './remandAndSentencingApi/remandAndSentencingClientTypes'

type SessionImmigrationDetention = ImmigrationDetention & {
  complete?: boolean
  delete?: boolean
}

export default SessionImmigrationDetention
