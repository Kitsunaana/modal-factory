import { createContext, useContext, type Context } from "react";

export const createStrictContext = <T>() => createContext<T | null>(null)

export const useStrictContext = <T>(context: Context<T>) => {
  const readContext = useContext(context)
  if (readContext === null) throw new Error("Context is not implemented")

  return readContext
}