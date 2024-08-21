import HttpStatusCodes from '@src/common/HttpStatusCodes'
import UserService from '@src/services/UserService'
import { Request, Response } from 'express'

// **** Functions **** //

/**
 * Get all users.
 */
async function getAll(_: Request, res: Response) {
  const users = await UserService.getAll()
  return res.status(HttpStatusCodes.OK).json({ data: users })
}

async function addOne(req: Request, res: Response) {
  const result = await UserService.addOne(req.body)
  if (typeof result === 'string') {
    return res
      .status(HttpStatusCodes.BAD_REQUEST)
      .json({ error: JSON.parse(result) })
  }
  return res.status(HttpStatusCodes.CREATED).json({ result })
}

// **** Export default **** //

export default {
  getAll,
  addOne,
} as const
