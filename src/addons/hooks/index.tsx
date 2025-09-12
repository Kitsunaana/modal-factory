import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { createNoopStoreAdapter } from "../../adapters/noop/adapter";
import { createDirector, Modal } from "../../kernel/modal-factory/implementation";

export const addLocalStateMiddleware = ({ context, next }: Modal.params) => {
  const useLocalModalState = () => {
    const [isOpen, setIsOpen] = useState(false)
    const [payload, setPayload] = useState<Modal.payloadWithBrand<typeof context> | undefined>({
      __internal_name: "payload",
    })

    const onClose = () => {
      setPayload(undefined)
      setIsOpen(false)
    }
    
    const onOpen = (payload: Modal.payloadWithBrand<typeof context>) => {
      setPayload(payload)
      setIsOpen(true)
    }

    return {
      isOpen,
      payload,
      onClose,
      onOpen,
    }
  }

  return next({
    ctx: {
      useLocalModalState,
    }
  })
}

export const addContextStoreMiddleware = ({ context, next }: Modal.params) => {
  const defaultState = {
    payload: undefined,
    isOpen: false,
  }

  type Brand = Modal.payloadWithBrand<typeof context>

  type ModalStoreContextProps = {
    isOpen: boolean
    payload: Brand | undefined
    onOpen: (payload: Brand) => void
    onClose: () => void
  }

  const ModalStoreContext = createContext<ModalStoreContextProps | null>(null)

  const useModalStore = () => {
    const context = useContext(ModalStoreContext)
    if (context === null) throw new Error("Context not implemented")

    return context as ModalStoreContextProps
  }

  const ModalStoreProvider = ({ children }: { children: ReactNode }) => {
    const [state, setState] = useState<typeof defaultState>(defaultState)

    const onClose = () => setState(defaultState)
    
    const onOpen = (payload: Brand) => {
      setState({
        payload: payload as unknown as typeof defaultState["payload"],
        isOpen: true,
      })
    }

    const cachedContextValue: ModalStoreContextProps = useMemo(
      () => ({
        isOpen: state.isOpen,
        payload: state.payload,
        onClose,
        onOpen,
      }),
      [state]
    )
    
    return (
      <ModalStoreContext value={cachedContextValue}>
        {children}
      </ModalStoreContext>
    )
  }

  const result = next({
    ctx: {
      ModalStoreProvider,
      useModalStore,
    }
  })

  return result
}

const testDirector = createDirector({
  createStore: createNoopStoreAdapter,
  variants: {
    base: [],
    hooks: [addLocalStateMiddleware, addContextStoreMiddleware]
  } as const
})

const login = testDirector.hooks("login")
  .withParams<{ username: string }>()

