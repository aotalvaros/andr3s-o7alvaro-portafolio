
import { OnlineStatus } from '@/components/ui/OnlineStatus'
interface StatusIndicatorProps {
  online: boolean,
  isTextVisible?: boolean,
}

export function StatusIndicator({ online, isTextVisible = true }: Readonly<StatusIndicatorProps>) {
  return (
    <div className="alert">
      {online ? (
        <OnlineStatus 
          text={ isTextVisible ? " Online" : ""}
          backgroundColor="bg-green-500" 
          textColor="text-green-500" 
        />
      ) : (
        <OnlineStatus 
          text={ isTextVisible ? " Offline" : ""}
          backgroundColor="bg-red-500" 
          textColor="text-red-500" 
        />
      )}
    </div>
  )
}