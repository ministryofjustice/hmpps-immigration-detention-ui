type SessionImmigrationDetention = {
  id?: string
  recordType?: string
  documentDate?: string
  homeOfficeRefNo?: string
  noLongerOfInterestReason?: string
  noLongerOfInterestOtherComment?: string
  noLongerOfInterestConfirmedDate?: string
} & {
  complete?: boolean
  delete?: boolean
}

export default SessionImmigrationDetention
