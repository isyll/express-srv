// **** Variables **** //

import { createUser, getUsers, insertUserSchema, User } from '@/repos/users'
import { ZodError } from 'zod'

export const USER_NOT_FOUND_ERR = 'User not found'

// **** Functions **** //

/**
 * Get all users.
 */
async function getAll(): Promise<User[]> {
  return (await getUsers()) as User[]
}

/**
 * Add one user.
 */
async function addOne(user: unknown): Promise<User | string> {
  try {
    const userData = insertUserSchema.parse(user)
    const res = await createUser(userData as User)
    return res[0] as User
  } catch (e) {
    return e.message
  }
}

// **** Export default **** //

export default {
  getAll,
  addOne,
} as const
