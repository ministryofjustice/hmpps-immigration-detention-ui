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
      courtAppearanceUuid: '123',
    })
  })

  describe('validateHomeOffenceReference', () => {
    it('valid codes should pass', () => {
      const validCodes = [
        '12345', // to show 5 digit code works
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
        model.hoRefNumberForm.hoRefNumber = code
        expect(model.validateHomeOffenceReference()).toEqual([])
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
        model.hoRefNumberForm.hoRefNumber = code
        expect(model.validateHomeOffenceReference().length).toBeGreaterThan(0)
      })
    })

    it('invalid codes should fail (too short or too long)', () => {
      const invalidCodes = [
        'A195', // too short (4 chars)
        'W1997262111111111', // too long (17 chars)
      ]

      invalidCodes.forEach(code => {
        model.hoRefNumberForm.hoRefNumber = code
        expect(model.validateHomeOffenceReference().length).toBeGreaterThan(0)
      })
    })
  })

  describe('validateImmigrationBail', () => {
    it('valid codes should pass', () => {
      const validCodes = ['12345', '1234567890', '123-456', '123456789012345678', '1-2-3-4-5', '0000000']

      validCodes.forEach(code => {
        model.hoRefNumberForm.hoRefNumber = code
        expect(model.validateImmigrationBail()).toEqual([])
      })
    })

    it('empty or undefined values should pass', () => {
      const emptyValues = ['', undefined]

      emptyValues.forEach(code => {
        model.hoRefNumberForm.hoRefNumber = code
        expect(model.validateImmigrationBail()).toEqual([])
      })
    })

    it('invalid codes should fail', () => {
      const invalidCodes = [
        'A1876986', // letters
        '123 456', // space
        '123@456', // invalid character
        '123_456', // underscore
        '123/456', // forward slash
      ]

      invalidCodes.forEach(code => {
        model.hoRefNumberForm.hoRefNumber = code
        expect(model.validateImmigrationBail().length).toBeGreaterThan(0)
      })
    })
  })
})
