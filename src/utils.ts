function safeParseJSON(str: string) {
    try {
        return JSON.parse(str)
    } catch (e) {
        return undefined
    }
}

function isObject(value: unknown): value is Record<string, unknown> {
    return value === Object(value) && !Array.isArray(value)
}

export function matchFilter(obj: unknown, filter: unknown): boolean {
    if (isObject(obj) && isObject(filter)) {
        return Object.keys(filter).every((key) => {
            if (!(key in obj)) {
                return false
            }

            return matchFilter(obj[key], filter[key])
        })
    }

    if (Array.isArray(obj) && Array.isArray(filter)) {
        return filter.every((el, index) => matchFilter(obj[index], el))
    }

    return obj === filter
}

export function isMathchingMessage(message: string, filter: string | Record<string, unknown> | unknown[]): boolean {
    if (typeof filter === 'string') {
        return message.includes(filter)
    }

    const messageObject = safeParseJSON(message)
    if (messageObject === undefined) {
        return false
    }

    return matchFilter(messageObject, filter)
}