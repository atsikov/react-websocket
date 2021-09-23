import { createContext, FunctionComponent, useCallback, useContext, useMemo, useState } from "react";

type MessagesCache = Partial<Record<string, string[]>>
type Connections = Partial<Record<string, WebSocket>>

interface WebSocketContextValue {
    messages: MessagesCache
    connections: Connections
    openConnection: (idOrUrl: string, url?: string) => WebSocket
}

const DEFAULT_CONTEXT_VALUE: WebSocketContextValue = {
    connections: {},
    messages: {},
    openConnection: () => {
        throw new Error('Not implemented')
    },
}

const WebSocketContext = createContext<WebSocketContextValue>(DEFAULT_CONTEXT_VALUE)

export const useWebSocketContext = () => useContext(WebSocketContext)

export const ReactWebSocketProvider: FunctionComponent = ({ children }) => {
    const [messages, setMessages] = useState<MessagesCache>({})
    const [connections, setConnections] = useState<Connections>({})

    const openConnection = useCallback((id: string, url?: string) => {
        const connection = new WebSocket(id ?? url)

        const onMessage = ({ data }: MessageEvent) => {
            setMessages((messages) => {
                const copy = { ...messages }
                copy[id] ??= []
                copy[id]!.push(data)

                return copy
            })
        }
        connection.addEventListener('message', onMessage)

        setConnections(value => ({
            ...value,
            id: connection,
        }))

        return connection
    }, [])

    const contextValue = useMemo(() => ({
        messages,
        connections,
        openConnection,
    }), [
        messages,
        connections,
        openConnection,
    ])

    return <WebSocketContext.Provider value={contextValue}>{children}</WebSocketContext.Provider>
}