import HttpStatusCodes from './HttpStatusCodes'

/**
 * Error with status code and message.
 */
export class RouteError extends Error {
  public status: HttpStatusCodes

  public constructor(status: HttpStatusCodes, message: string) {
    super(message)
    this.status = status
  }
}

/**
 * If unicity validation fails.
 */
export class ConflictErr extends RouteError {
  constructor(paramName: string) {
    super(HttpStatusCodes.CONFLICT, paramName)
  }
}
