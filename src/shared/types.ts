export type ExcludeProperty<Target, ExcludeProperty> = {
  [
    Key in keyof Target as Key extends keyof ExcludeProperty
      ? [Target[Key]] extends [ExcludeProperty[Key]]
        ? never
        : Key
      : Key
  ]: Target[Key]
};

export type Brand<T, N = string> = T & { __internal_name: N }

export type AnyRecord = Record<string, any>

export type RecordsMerge<Old, Add> = Omit<Old, keyof Add> & Add

export type AnyArrowFn = (...args: any[]) => any

export type GetParameters<T extends AnyArrowFn> = Parameters<T>[0]
