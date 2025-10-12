import { director } from "../modal"

type StackFn = (params: {
  applyAllRules: () => void
  closeBackdrop: () => void
  removeFnFromStack: () => void
}) => void

const sliceItemByIndex = <T,>(array: T[], index: number) => {
  if (index === -1) return array

  const prev = array.slice(0, index)
  const next = array.slice(index + 1)

  return prev.concat(next)
}

type NonUndefined<V> = V extends undefined ? never : V

const defaultTo = <T>(value: T, defaultValue: NonUndefined<T>) => value ?? defaultValue

const toDefaultStack = <T extends unknown>(value: T[]) => defaultTo(value, [] as T[])

export const overlayForModal = director.base("overlay")
  .builder.use(({ next }) => {
    const recordStack: Record<string, StackFn[]> = {}

    return next({
      store: {
        recordStack
      }
    })
  })
  .builder.use(({ context, next }) => {
    const recordStack = context.store.state.recordStack

    const innerRemoveFnFromStack = (index: number, name: string) => {
      context.store.setState(({ recordStack, ...other }) => ({
        stack: sliceItemByIndex(toDefaultStack(recordStack[name]), index),
        ...other,
      }))
    }

    const createNewStack = (name: string) => {
      recordStack[name] = toDefaultStack(recordStack[name])
    }

    const clearStackByName = (name: string) => {
      recordStack[name] = []
    }

    const addFnToStack = (name: string, callback: StackFn) => {
      context.store.setState(({ recordStack, ...other }) => {
        const addedNewCallback = toDefaultStack(recordStack[name]).concat(callback)

        return {
          ...other,
          recordStack: {
            ...recordStack,
            [name]: addedNewCallback
          }
        }
      })

      const foundIndex = context.store.state.stack.findIndex((candidate) => candidate === callback)

      return () => innerRemoveFnFromStack(foundIndex)
    }

    const overlayOnClick = () => {
      const stack = context.store.state.stack
      const lastIndex = stack.length - 1
      const lastCallback = stack[lastIndex]

      const removeFnFromStack = () => innerRemoveFnFromStack(lastIndex)
      
      const closeBackdrop = () => {
        overlayForModal.close()
        removeFnFromStack()
      }

      const applyAllRules = () => {
        removeFnFromStack()
        closeBackdrop()
      }

      if (lastCallback !== undefined) {
        lastCallback({
          removeFnFromStack,
          applyAllRules,
          closeBackdrop,
        })
      }
    }

    return next({
      ctx: {
        clearStackByName,
        createNewStack,
        overlayOnClick,
        addFnToStack,
      }
    })
  })