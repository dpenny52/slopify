import { useState, useCallback } from 'react'
import { useQuery, useMutation } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { Id } from '../../convex/_generated/dataModel'
import { type GridPosition } from '@/types/grid'

export interface Project {
  _id: Id<'projects'>
  _creationTime: number
  name: string
  overlayIds: string[]
  positions: number[]
  createdAt: number
  userId: string
}

export interface ProjectConfig {
  name: string
  overlayIds: string[]
  positions: GridPosition[]
}

export function useProjects() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const projects = useQuery(api.projects.getUserProjects) ?? []
  const saveProjectMutation = useMutation(api.projects.saveProject)
  const deleteProjectMutation = useMutation(api.projects.deleteProject)
  const updateProjectMutation = useMutation(api.projects.updateProject)

  const saveProject = useCallback(
    async (config: ProjectConfig) => {
      setIsLoading(true)
      setError(null)

      try {
        const id = await saveProjectMutation({
          name: config.name,
          overlayIds: config.overlayIds,
          positions: config.positions,
        })
        return id
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Failed to save project'
        setError(message)
        throw err
      } finally {
        setIsLoading(false)
      }
    },
    [saveProjectMutation]
  )

  const deleteProject = useCallback(
    async (id: Id<'projects'>) => {
      setIsLoading(true)
      setError(null)

      try {
        await deleteProjectMutation({ id })
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Failed to delete project'
        setError(message)
        throw err
      } finally {
        setIsLoading(false)
      }
    },
    [deleteProjectMutation]
  )

  const updateProject = useCallback(
    async (id: Id<'projects'>, config: ProjectConfig) => {
      setIsLoading(true)
      setError(null)

      try {
        await updateProjectMutation({
          id,
          name: config.name,
          overlayIds: config.overlayIds,
          positions: config.positions,
        })
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Failed to update project'
        setError(message)
        throw err
      } finally {
        setIsLoading(false)
      }
    },
    [updateProjectMutation]
  )

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  return {
    projects: projects as Project[],
    isLoading,
    error,
    saveProject,
    deleteProject,
    updateProject,
    clearError,
  }
}
