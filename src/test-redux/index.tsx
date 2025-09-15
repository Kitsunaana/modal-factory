import { createContext, useContext, useMemo, useRef, useState, type Dispatch, type ReactNode, type RefObject, type SetStateAction } from "react"
import { createTanstackStoreAdapter } from "../adapters"
import { addContextStoreMiddleware, addLocalStateMiddleware } from "../addons/hooks"
import { UiModal } from "../hz/ui/modal"
import { createDirector } from "../kernel/modal-factory/implementation"

const director = createDirector({
  createStore: createTanstackStoreAdapter,
  variants: {
    base: [],
    hooks: [addLocalStateMiddleware, addContextStoreMiddleware]
  } as const
})

const loginModal = director
  .base("loginV2")
  .withParams<{ anyValue: "terminator" }>()

const newModal = director.hooks("newModal").withParams<{ value: number }>()
const newModalV2 = director.hooks("newModalV2").withParams<{ value: number }>()

export function TestNewModal() {
  const { isOpen, payload, onClose, onOpen } = newModalV2.useModalStore()
  
  newModalV2.open({ value: 123 })

  return (
    <div>
      {String(isOpen)}
      {payload?.value}

      <button onClick={() => onOpen({ __internal_name: "payload", value: 678 })}>Открыть новую модалку</button>

      <button onClick={onClose}>Закрыть новую модалку</button>
    </div>
  )
}

type SidebarContextProps = {
  isExpanded: boolean
  nodeRef: RefObject<HTMLDivElement | null>
  onCollapse: () => void
  onExpand: () => void
}

const SidebarContext = createContext<SidebarContextProps | null>(null)

export const useSidebarContext = () => {
  const context = useContext(SidebarContext)
  if (context === null) throw new Error("Context is not implemented")
  return context
}

export const SidebarProvider = ({ children }: { children: ReactNode }) => {
  const [isExpanded, setIsExpanded] = useState(false)

  const onExpand = () => setIsExpanded(true)
  const onCollapse = () => setIsExpanded(false)

  const nodeRef = useRef<HTMLDivElement | null>(null)


  const sidebarContextValue = useMemo(
    () => ({
      nodeRef,
      onExpand,
      onCollapse,
      isExpanded,
    }),
    [isExpanded]
  )

  return (
    <SidebarContext value={sidebarContextValue}>
      {children}
    </SidebarContext>
  )
}

export function TestReduxAdapter() {
  const newModalState = newModal.useLocalModalState()

  const { nodeRef, isExpanded, onExpand, onCollapse } = useSidebarContext()

  return (
    <div style={{ height: "100vh" }}>
      
      <UiModal
        isOpen={newModalState.isOpen}
        onClose={newModalState.onClose}
      />

      <button
        onClick={onExpand}
        style={{
          height: "40px",
          width: "40px",
        }}
      />

      <div
        ref={nodeRef}
        style={{
          width: "200px",
          height: "100%",
          backgroundColor: "blue",
          position: "absolute",
          top: "0px",
          transition: "all .3s",
          left: isExpanded ? "0px" : "-200px"
        }}
      >
        <button
          onClick={onCollapse}
          style={{
            height: "40px",
            width: "40px",
          }}
        />

        <button
          onClick={() => {
            onCollapse()
            
            newModalState.onOpen({ __internal_name: "payload", value: 2314 })
          }}
          style={{
            width: "100%",
            height: "40px"
          }}
        >
          Профиль
        </button>
      </div>
    </div>
  )
}