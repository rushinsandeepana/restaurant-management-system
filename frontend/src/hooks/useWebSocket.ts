import { useEffect, useRef, useState } from 'react'

/**
 * Placeholder hook for STOMP/WebSocket integration (kitchen display, live orders).
 */
export function useWebSocket(_topic: string) {
  const [connected, setConnected] = useState(false)
  const clientRef = useRef<unknown>(null)

  useEffect(() => {
    // Connect via @stomp/stompjs when order module is implemented
    setConnected(false)
    return () => {
      clientRef.current = null
    }
  }, [])

  return { connected, client: clientRef }
}
