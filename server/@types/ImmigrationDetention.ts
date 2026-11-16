import { ImmigrationDetention } from './remandAndSentencingApi'

type SessionImmigrationDetention = ImmigrationDetention & {
  complete?: boolean
  delete?: boolean
}

export default SessionImmigrationDetention
