
import { OnlineStatus } from '@/components/ui/OnlineStatus'

interface StatusIndicatorProps {
  online: boolean
}

export function StatusIndicator({ online }: Readonly<StatusIndicatorProps>) {
  return (
    <div className="alert">
      {online ? (
        <OnlineStatus 
          text=" Online" 
          backgroundColor="bg-green-500" 
          textColor="text-green-500" 
        />
      ) : (
        <OnlineStatus 
          text=" Offline" 
          backgroundColor="bg-red-500" 
          textColor="text-red-500" 
        />
      )}
    </div>
  )
}