// lib/supabase/mock.ts

/**
 * A robust Mock Supabase Client that handles common chaining methods 
 * and returns empty results instead of making network requests.
 */
export const createMockClient = () => {
  const handler = (): any => {
    const result: any = Promise.resolve({ data: [], error: null, count: 0 })

    // Common Supabase Query Builder methods
    const methods = [
      'select', 'insert', 'update', 'delete', 'upsert', 'match', 
      'filter', 'eq', 'neq', 'gt', 'lt', 'gte', 'lte', 
      'like', 'ilike', 'is', 'in', 'contains', 'containedBy', 
      'rangeAdjacent', 'rangeOverlaps', 'rangeWithin', 'indexBy', 
      'order', 'limit', 'range', 'abortSignal', 'single', 
      'maybeSingle', 'csv', 'url', 'headers'
    ]

    methods.forEach((m) => {
      result[m] = handler
    })

    return result
  }

  const mock: any = new Proxy({}, {
    get: (target, prop): any => {
      if (typeof prop === 'symbol') return (target as any)[prop]

      if (prop === 'auth') {
        return {
          getUser: async () => ({ data: { user: null }, error: null }),
          getSession: async () => ({ data: { session: null }, error: null }),
          onAuthStateChange: () => ({ 
            data: { 
              subscription: { 
                unsubscribe: () => {} 
              } 
            } 
          }),
          signInWithPassword: async () => ({ data: { user: null, session: null }, error: null }),
          signUp: async () => ({ data: { user: null, session: null }, error: null }),
          signOut: async () => ({ error: null }),
        }
      }

      if (prop === 'from') return handler
      if (prop === 'rpc') return handler
      
      // If the property is a method, return a handler
      return handler
    }
  })

  return mock
}
