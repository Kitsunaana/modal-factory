import { useMemo, useRef, useState, type ReactNode, type RefObject } from "react";
import { createStrictContext, useStrictContext } from "../../shared/lib/react";

type SidebarContextProps = {
  nodeRef: RefObject<HTMLDivElement | null>
  isExpanded: boolean

  onCollapse: () => void
  onExpand: () => void
  onToggle: () => void
}

const SidebarContext = createStrictContext<SidebarContextProps>()

export const useSidebarContext = () => useStrictContext(SidebarContext)

export const SidebarProvider = (props: { children: ReactNode }) => {
  const [isExpanded, setIsExpanded] = useState(false)

  const nodeRef = useRef<HTMLDivElement | null>(null)

  const onToggle = () => setIsExpanded((prev) => !prev)

  const onCollapse = () => setIsExpanded(false)
  const onExpand = () => setIsExpanded(true)

  const value = useMemo(
    (): SidebarContextProps => ({
      nodeRef,
      isExpanded,
      onCollapse,
      onToggle,
      onExpand,
    }),
    [isExpanded]
  )

  return <SidebarContext value={value} {...props} />
}