import { v } from 'convex/values'
import { mutation, query } from './_generated/server'
import { auth } from './auth'

export const saveProject = mutation({
  args: {
    name: v.string(),
    overlayIds: v.array(v.string()),
    positions: v.array(v.number()),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx)
    if (!userId) {
      throw new Error('Not authenticated')
    }

    const projectId = await ctx.db.insert('projects', {
      name: args.name,
      overlayIds: args.overlayIds,
      positions: args.positions,
      createdAt: Date.now(),
      userId,
    })

    return projectId
  },
})

export const getUserProjects = query({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx)
    if (!userId) {
      return []
    }

    const projects = await ctx.db
      .query('projects')
      .withIndex('by_user', (q) => q.eq('userId', userId))
      .order('desc')
      .collect()

    return projects
  },
})

export const getProject = query({
  args: { id: v.id('projects') },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx)
    if (!userId) {
      return null
    }

    const project = await ctx.db.get(args.id)
    if (!project || project.userId !== userId) {
      return null
    }

    return project
  },
})

export const deleteProject = mutation({
  args: { id: v.id('projects') },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx)
    if (!userId) {
      throw new Error('Not authenticated')
    }

    const project = await ctx.db.get(args.id)
    if (!project || project.userId !== userId) {
      throw new Error('Project not found')
    }

    await ctx.db.delete(args.id)
  },
})

export const updateProject = mutation({
  args: {
    id: v.id('projects'),
    name: v.string(),
    overlayIds: v.array(v.string()),
    positions: v.array(v.number()),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx)
    if (!userId) {
      throw new Error('Not authenticated')
    }

    const project = await ctx.db.get(args.id)
    if (!project || project.userId !== userId) {
      throw new Error('Project not found')
    }

    await ctx.db.patch(args.id, {
      name: args.name,
      overlayIds: args.overlayIds,
      positions: args.positions,
    })
  },
})
