import { isMathchingMessage, matchFilter } from "../utils"

describe('matchFilter', () => {
    it('should match primitives', () => {
        expect(matchFilter(0, 0)).toBe(true)
        expect(matchFilter(null, null)).toBe(true)
        expect(matchFilter('1', '1')).toBe(true)
        expect(matchFilter(false, false)).toBe(true)
        expect(matchFilter(undefined, undefined)).toBe(true)

        expect(matchFilter(0, 1)).toBe(false)
        expect(matchFilter(null, undefined)).toBe(false)
        expect(matchFilter(1, '1')).toBe(false)
        expect(matchFilter(false, null)).toBe(false)
        expect(matchFilter(0, undefined)).toBe(false)
    })

    it('should match objects', () => {
        expect(matchFilter({ a: 1 }, { a: 1 })).toBe(true)
        expect(matchFilter({ a: 1, b: 2 }, { a: 1 })).toBe(true)
        expect(matchFilter({ a: { b: { c: 1 } } }, { a: { b: { c: 1 } } })).toBe(true)
        expect(matchFilter({ a: { b: [1, 2, 3] } }, { a: { b: [1, 2, 3] } })).toBe(true)
        expect(matchFilter({ a: { b: [1, 2, 3] } }, { a: { b: [1, 2] } })).toBe(true)
        
        expect(matchFilter({ a: 1 }, { a: '1' })).toBe(false)
        expect(matchFilter({ a: 1 }, { a: 1, b: 2 })).toBe(false)
        expect(matchFilter({ a: { b: { c: 1 } } }, { a: 1 })).toBe(false)
    })

    it('should match lists', () => {
        expect(matchFilter([1, 2, 3], [1, 2, 3])).toBe(true)
        expect(matchFilter([1, 2, 3], [1, 2])).toBe(true)
        expect(matchFilter([{ a: 1 }, 2, 3], [{ a: 1 }, 2, 3])).toBe(true)
        expect(matchFilter([{ a: 1, b: 2 }, 2, 3], [{ a: 1 }, 2, 3])).toBe(true)
        
        expect(matchFilter([1, 2, 3], [1, 3, 2])).toBe(false)
        expect(matchFilter([{ a: 1 }, 2, 3], [{ a: 2 }, 2, 3])).toBe(false)
        expect(matchFilter([{ a: 1 }, 2, 3], [{ a: 1, b: 2 }, 2, 3])).toBe(false)
        expect(matchFilter([{ b: 1 }, 2, 3], [{ a: 1 }, 2, 3])).toBe(false)
    })
})

describe('isMathchingMessage', () => {
    it('should match message with string filter', () => {
        expect(isMathchingMessage('abcd', 'bc')).toBe(true)
        expect(isMathchingMessage('abcd', 'de')).toBe(false)
    })

    it('should match json message with object filter', () => {
        expect(isMathchingMessage(JSON.stringify({ a: 1, b: 1 }), { a: 1 })).toBe(true)
        expect(isMathchingMessage(JSON.stringify({ a: 1, b: 1 }), { a: 2 })).toBe(false)
    })

    it('should match json message with list filter', () => {
        expect(isMathchingMessage(JSON.stringify([1, 2, 3]), [1, 2])).toBe(true)
        expect(isMathchingMessage(JSON.stringify([1, 2, 3]), [1, 3, 2])).toBe(false)
    })

    it('should not match string message with not string filter', () => {
        expect(isMathchingMessage("1, 2, 3", { a: 1 })).toBe(false)
        expect(isMathchingMessage(({ a: 1 }).toString(), { a: 1 })).toBe(false)
        expect(isMathchingMessage("1, 2, 3", [1])).toBe(false)
    })
})