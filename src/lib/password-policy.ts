export const PASSWORD_POLICY_MESSAGE =
  'Haslo musi miec minimum 10 znakow i zawierac mala litere, wielka litere, cyfre oraz znak specjalny.'

export function getPasswordPolicyError(password: string) {
  if (
    password.length < 10 ||
    !/[a-z]/.test(password) ||
    !/[A-Z]/.test(password) ||
    !/[0-9]/.test(password) ||
    !/[^A-Za-z0-9]/.test(password)
  ) {
    return PASSWORD_POLICY_MESSAGE
  }

  return null
}
