export function coreHello(): string {
  return "Hello from core!";
}

export * from "./modal-factory"
export * from "./noop-store"
export * from "./shared/utils"

export * from "./modal-factory/types"
export * from "./noop-store/types"
export * from "./shared/types"