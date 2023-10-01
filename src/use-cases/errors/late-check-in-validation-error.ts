export class LateCheckInValidationError extends Error {
  constructor() {
    super('Late check in validation error')
    this.name = 'LateCheckInValidationError'
  }
}
