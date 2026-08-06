export enum Role {
  /** @deprecated This will be removed in a future release. Use COURT_CASES instead. */
  IMMIGRATION_DETENTION_ADMIN = 'ROLE_IMMIGRATION_DETENTION_ADMIN',
  /** @deprecated This will be removed in a future release. Use COURT_CASES instead. */
  IMMIGRATION_DETENTION_USER = 'ROLE_IMMIGRATION_DETENTION_USER',
  COURT_CASES = 'ROLE_COURT_CASES',
  RELEASE_DATES_CALCULATOR = 'ROLE_RELEASE_DATES_CALCULATOR',
}

export const Roles = {
  getAuthority(role: Role): string {
    return role
  },

  getRole(role: Role): string {
    return role.replace(/^ROLE_/, '')
  },

  values(): Role[] {
    return Object.values(Role) as Role[]
  },
}
