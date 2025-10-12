import { useCallback, useEffect, useMemo, useRef, useState, type ComponentType, type CSSProperties, type ReactNode, type RefObject } from "react"
import { Sidebar } from "./widgets/sidebar"
import { Button } from "./shared/ui/kit/button"
import { director } from "./shared/lib/modal"
import { combine, Modal, toBrand } from "@modal-factory/core"
import { createTanstackStoreAdapter } from "@modal-factory/adapters-tanstack-store"
import { Transition, type TransitionStatus } from "react-transition-group"
import { createRoute, eventBus, useEvent } from "./shared/lib/event-emitter"
import { SidebarProvider, useSidebarContext } from "./widgets/sidebar/_provider"
import { mergeRefs } from "react-merge-refs"
import { overlayForModal } from "./shared/lib/modal/overlay"

const container: Record<string, Array<ReactNode>> = {
  profile: []
}

const modalContainer = (WrappedComponent: ComponentType) => {
  const lastIndex = container.profile.length - 1
  container.profile = container.profile.concat(<WrappedComponent key={lastIndex} />)

  return function ContainerWrapper() {
    return null
  }
}

const LoginModal = modalContainer(() => {
  return (
    <div>Login Modal</div>
  )
})

export const firstTestModal = director.base("first-test")
  .builder.use(({ context, next }) => {
    overlayForModal.createNewStack(context.type)

    const openWithBackdrop = (paylaod: Modal.payloadWithBrand<typeof context>) => {
      context.open(paylaod)
      
      overlayForModal.addFnToStack(context.type, ({}) => {
        console.log("Я хочу чтобы появилось какое-то сообщение при клике на оверлей")

        context.close()
      })
    }

    const closeWithBackdrop = () => {
      overlayForModal.clearStackByName(context.type)
      context.close()
    }

    return next({
      ctx: {
        closeWithBackdrop,
        openWithBackdrop
      }
    })
  })
  .builder.use(({ context, next }) => {
    const handleClose = () => {
      context.close()
    }

    const handleOpen = (payload: Modal.payloadWithBrand<typeof context>) => {
      context.open(payload)
    }

    return next({
      ctx: {
        handleOpen,
        handleClose,
      }
    })
  })

const duration = 300;

const defaultStyle = {
  transition: `${duration}ms`,
  opacity: 0,
}

const transitionStyles: Record<TransitionStatus, CSSProperties> = {
  entering: { opacity: 1 },
  entered: { opacity: 1 },
  exited: { opacity: 0 },
  exiting: { opacity: 0 },
  unmounted: {}
};

const modalDefaultStyle = (rightValue: number): CSSProperties => ({
  transition: `${duration}ms`,
  opacity: 0,
  // top: "0px"
  top: "200px",
  right: `${rightValue}px`
})

const topToBottomModalTransitionStyles: Record<TransitionStatus, CSSProperties> = {
  entering: {
    opacity: 1,
    top: "200px"
  },
  entered: {
    opacity: 1,
    top: "200px"
  },
  exited: {
    opacity: 0,
  },
  exiting: {
    opacity: 0,
    top: "400px"
  },
  unmounted: {}
};

const fromRightModalTransitionStyles: Record<TransitionStatus, (...args: any) => CSSProperties> = {
  entering: (rightValue) => ({
    opacity: 1,
    top: "200px",
    right: `${rightValue}px`
  }),
  entered: (rightValue) => ({
    opacity: 1,
    top: "200px",
    right: `${rightValue}px`
  }),
  exited: () => ({
    opacity: 0,
  }),
  exiting: () => ({
    opacity: 0,
  }),
  unmounted: () => ({})
};

const getWidth = (node: Element) => node.getBoundingClientRect().width

const useOpenProfileModal = () => {
  const { nodeRef } = useSidebarContext()
  const isOpen = firstTestModal.useIsOpen()

  const modalNodeRef = useRef<HTMLDivElement | null>(null)
  const [rightShift, setRightShift] = useState({
    start: 0,
    end: 0
  })

  useEffect(() => {
    if (nodeRef.current && modalNodeRef.current) {
      const rootWidth = getWidth(document.documentElement)
      const modalWidth = getWidth(modalNodeRef.current)
      const sidebarWidth = getWidth(nodeRef.current)

      const endRightShift = (rootWidth / 2) - (modalWidth / 2)
      const startRightShift = endRightShift - sidebarWidth

      setRightShift({
        start: startRightShift,
        end: endRightShift,
      })
    }
  }, [isOpen])

  const computeStyles = useCallback(
    (state: TransitionStatus) => ({
      ...modalDefaultStyle(rightShift.start),
      ...fromRightModalTransitionStyles[state](rightShift.end)
    }),
    [
      rightShift.start,
      rightShift.end,
    ]
  )

  return {
    computeStyles,
    modalNodeRef,
    rightShift,
    isOpen,
  }
}

export const UiModal = ({ onClose, isOpen, nodeRef, getTransitionStyles }: {
  onClose: () => void
  isOpen: boolean
  nodeRef: RefObject<HTMLDivElement | null>
  getTransitionStyles: (state: TransitionStatus) => CSSProperties
}) => {
  return (
    <Transition
      in={isOpen}
      mountOnEnter
      unmountOnExit
      nodeRef={nodeRef}
      timeout={duration}
    >
      {(state) => (
        <div
          ref={nodeRef}
          style={getTransitionStyles(state)}
          className="z-80 absolute bg-white max-w-[550px] max-h-[300px] h-full w-full shadow-xl rounded-xl p-4"
        >
          <Button onClick={onClose}>Закрыть</Button>
        </div>
      )}
    </Transition>
  )
}

const Overlay = ({ isShow, onClick }: {
  isShow: boolean
  onClick: () => void
}) => {
  const nodeRef = useRef<HTMLDivElement | null>(null)

  return (
    <Transition
      in={isShow}
      mountOnEnter
      unmountOnExit
      nodeRef={nodeRef}
      timeout={duration}
    >
      {(state) => (
        <div
          ref={nodeRef}
          onClick={onClick}
          className="z-40 absolute h-screen w-screen bg-gray-700/50 top-0 right-0"
          style={{
            ...defaultStyle,
            ...transitionStyles[state]
          }}
        >

        </div>
      )}
    </Transition>  
  )
}

const OverlayManager = () => {
  const overlays = overlayForModal.store.useStore((store) => store.stackV2)
  
  return (
    <>
      {Array.from(overlays.keys()).map((key) => {
        const callbacks = overlays.get(key)!

        const handleClick = () => {
          const firstCallback = callbacks[0]
          firstCallback?.({

          } as any)
        }

        return (
          <Overlay
            key={key}
            onClick={handleClick}
            isShow={callbacks.length > 0}
          />
        )
      })}
    </>
  )
}

export const App = () => {
  const { isOpen, modalNodeRef, computeStyles } = useOpenProfileModal()

  // const isShowBackdrop = overlayForModal.useIsOpen()

  return (
    <div className="w-screen h-screen overflow-hidden">
      <Sidebar />

      <UiModal
        isOpen={isOpen}
        nodeRef={modalNodeRef}
        getTransitionStyles={computeStyles}
        onClose={firstTestModal.closeWithBackdrop}
      />

      <OverlayManager />
      {/* <Overlay isShow={isShowBackdrop} /> */}

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <Button onClick={() => firstTestModal.openWithBackdrop(toBrand.payload({}))}>Открыть модалку</Button>      
      </div>
    </div>
  )
}