type SessionImmigrationDetention = {
  id?: string
  recordType?: string
  documentDate?: string
  homeOfficeRefNo?: string
} & {
  complete?: boolean
  delete?: boolean
}

export default SessionImmigrationDetention
