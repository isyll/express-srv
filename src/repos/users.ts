import { eq } from 'drizzle-orm'
import { serial, pgTable, text } from 'drizzle-orm/pg-core'
import { db } from '.'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  username: text('username').notNull().unique(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
})

export const selectUserSchema = createSelectSchema(users)
export const insertUserSchema = createInsertSchema(users, {
  password: z
    .string()
    .min(5)
    .regex(/^[a-zA-Z0-9]+$/)
    .max(32),
  email: z.string().email(),
})

export type User = z.infer<typeof selectUserSchema>
export type NewUser = z.infer<typeof insertUserSchema>

export const getUsers = async () =>
  await db
    .select({
      id: users.id,
      name: users.name,
      username: users.username,
      email: users.email,
    })
    .from(users)

export const createUser = async (newUser: NewUser) => {
  return await db.insert(users).values(newUser).returning({
    id: users.id,
    name: users.name,
    username: users.username,
    email: users.email,
  })
}

export const updateUser = async (id: number, updatedUser: User) =>
  await db.update(users).set(updatedUser).where(eq(users.id, id)).returning({
    id: users.id,
    name: users.name,
    username: users.username,
    email: users.email,
  })
