import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'
import { authTables } from '@convex-dev/auth/server'

export default defineSchema({
  ...authTables,
  projects: defineTable({
    name: v.string(),
    overlayIds: v.array(v.string()),
    positions: v.array(v.number()),
    createdAt: v.number(),
    userId: v.string(),
  }).index('by_user', ['userId']),
})
