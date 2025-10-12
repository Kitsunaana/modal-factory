import { clsx } from "clsx"
import { SidebarProvider, useSidebarContext } from "./_provider"
import { Button } from "@/shared/ui/kit/button"
import { firstTestModal } from "@/App"
import { overlayForModal } from "@/shared/lib/modal/overlay"

const Sidebar = () => {
  const { isExpanded, onToggle, onCollapse, nodeRef } = useSidebarContext()

  return (
    <div className="h-full">
      <Button className="absolute z-90" onClick={() => {
          if (isExpanded) overlayForModal.close()
          else overlayForModal.open({})
          
          onToggle()
        }}
      />
      
      <div
        ref={nodeRef}
        className={clsx(
          "h-full bg-red-200 z-80 relative duration-300 w-[200px]", 
          isExpanded 
            ? "left-0" 
            : "-left-[200px]"
        )}
      >

        <div className="pt-16">
          <Button onClick={() => {
            firstTestModal.open({})
            onCollapse()
          }}>
            Открыть профиль
            </Button>
        </div>

      </div>
    </div>
  )
}

export { Sidebar }