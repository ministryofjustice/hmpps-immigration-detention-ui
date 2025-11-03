import ImmigrationDetentionHORefModel from './immigrationDetentionHORefNoModel'

describe('🧩 ImmigrationDetentionHORefModel', () => {
  let model: ImmigrationDetentionHORefModel

  beforeEach(() => {
    model = new ImmigrationDetentionHORefModel('A1234BC', '1', {
      createdAt: '2025-11-03T08:06:37.123Z',
      recordDate: '2022-06-22',
      source: 'DPS',
      immigrationDetentionRecordType: 'DEPORTATION_ORDER',
      homeOfficeReferenceNumber: 'B1234567',
      immigrationDetentionUuid: '123',
      prisonerId: 'A1234',
    })
  })

  describe('isValidCode', () => {
    it('valid codes should pass', () => {
      const validCodes = [
        'N1105951',
        'W1997262',
        '16224684',
        'J1988030',
        'A1950918',
        'L1452169/003',
        'F3002497/003',
        'B1985105/002',
        'S1836257',
        'A1481944',
        'R1128204',
        'M1711111',
        'S1840126',
        'S1840293',
        'A1876986',
        '14909391',
        '01YE1141924',
      ]

      validCodes.forEach(code => {
        expect(model.validateHORefNumber(code)).toBe(true)
      })
    })

    it('invalid codes should fail', () => {
      const invalidCodes = [
        'A1876986 ', // trailing space
        ' 16224684', // leading space
        'A1876986@', // invalid character
        'M1711_111', // underscore
        'F3002497#003', // hash
      ]

      invalidCodes.forEach(code => {
        expect(model.validateHORefNumber(code)).toBe(false)
      })
    })

    it('invalid codes should fail (too short or too long)', () => {
      const invalidCodes = [
        'A19509', // too short (6 chars)
        'W199726211111111', // too long (16 chars)
      ]

      invalidCodes.forEach(code => {
        expect(model.validateHORefNumber(code)).toBe(false)
      })
    })
  })
})
