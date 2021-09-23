import { useEffect, useState } from "react";
import { useWebSocketContext } from "./ReactWebSocketProvider";
import { isMathchingMessage } from "./utils";

export function useWebSocket(id: string, filter?: string | Record<string, unknown>) {
    const context = useWebSocketContext()
    const [nextMessageIndex, setNextMessageIndex] = useState(0)
    const [message, setMessage] = useState<string | undefined>(undefined)

    const messages = context.messages[id]
    const numMessages = messages?.length ?? 0

    useEffect(() => {
        if (messages && nextMessageIndex < numMessages) {
            const nextMessage = messages[nextMessageIndex]
            if (filter === undefined || isMathchingMessage(nextMessage, filter)) {
                setMessage(nextMessage)
            }
            setNextMessageIndex(value => value + 1)
        }
    }, [messages, nextMessageIndex])

    return { message }
}
