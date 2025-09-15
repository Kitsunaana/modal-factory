import React, { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { Transition, type TransitionStatus } from "react-transition-group";
import { useSidebarContext } from "../../test-redux";

export const Portal = ({ children }: { children: ReactNode }) => {
  return createPortal(children, document.querySelector("#modals")!)
}

const duration = 300

const defaultStyle = ({ rightShift }: { rightShift: number }): CSSProperties => ({
  transition: `${duration}ms`,
  opacity: 0,
  backgroundColor: "red",
  padding: "16px",
  borderRadius: "8px",
  position: "absolute",
  minWidth: "400px",
  height: "200px",
  // transform: "translateX(-50%)",
  right: `${rightShift}px`,
  // left: "50%",
  // top: "0px"
  top: "200px",
})

const transitionStyles = (): Record<TransitionStatus, CSSProperties> => ({
  entering: {
    opacity: 1,
    // top: "200px",
    right: "50%",
    transform: "translateX(50%)",
  },
  entered: {
    opacity: 1,
    right: "50%",
    transform: "translateX(50%)",
    // top: "200px",
  },
  exiting: {
    opacity: 0,
    // top: "300px"
    right: "50%",
    transform: "translateX(50%)",
  },
  exited: {
    opacity: 0
  },
  unmounted: {}
})

const getWidth = (node: Element) => node.getBoundingClientRect().width

export const UiModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean
  onClose: () => void
}) => {
  const [rightShift, setRightShift] = useState(0)

  const nodeRef = useRef<HTMLDivElement | null>(null)

  const sidebarContext = useSidebarContext()

  useEffect(() => {
    const sidebarNode = sidebarContext.nodeRef.current
    const dialogNode = nodeRef.current

    if (!sidebarNode || !dialogNode) return

    const rootCenterX = getWidth(document.documentElement) / 2
    const dialogWidth = getWidth(dialogNode)
    const centerDialogWidth = getWidth(dialogNode) / 2

    const computedX = rootCenterX - dialogWidth + centerDialogWidth - getWidth(sidebarNode)
    
    setRightShift(computedX)
  }, [isOpen])

  const asasd = React.createElement("div", {
    style: {
      height: "100px"
    }
  })

  console.log(asasd)

  return (
    <Portal>
      <Transition
        in={isOpen}
        nodeRef={nodeRef}
        timeout={duration}
        mountOnEnter
        unmountOnExit
      >
        {(state) => (
          <div
            ref={nodeRef}
            style={{
              ...defaultStyle({ rightShift }),
              ...transitionStyles()[state]
            }}
          >
            asd

            <button onClick={onClose}>Закрыть</button>
          </div>
        )}
      </Transition>
    </Portal>
  )
}