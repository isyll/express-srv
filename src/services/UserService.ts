// **** Variables **** //

import { ConflictErr } from '@/common/classes'
import UserRepo, { insertUserSchema, User } from '@/repos/users'

// **** Functions **** //

/**
 * Get all users.
 */
async function getAll(): Promise<User[]> {
  return (await UserRepo.getUsers()) as User[]
}

/**
 * Add one user.
 */
async function addOne(user: unknown): Promise<User> {
  const userData = insertUserSchema.parse(user)
  await validateUniqueFields(userData as User)
  const res = await UserRepo.createUser(userData)
  return res[0] as User
}

/**
 * Checks if unique users fields are used.
 */
async function validateUniqueFields(user: User): Promise<void> {
  let result = await UserRepo.getUserByEmail(user.email)
  if (result.length > 0) {
    throw new ConflictErr('email')
  }
  result = await UserRepo.getUserByUsername(user.username)
  if (result.length > 0) {
    throw new ConflictErr('username')
  }
}

// **** Export default **** //

export default {
  getAll,
  addOne,
} as const
