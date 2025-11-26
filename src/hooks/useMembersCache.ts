import { useCallback, useEffect, useReducer } from 'react';
import { client } from '@/libs/Orpc';

type Member = {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string;
  phone: string | null;
  dateOfBirth: Date | null;
  photoUrl: string | null;
  lastAccessedAt: Date | null;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  create_organization_enabled?: boolean;
  membershipType?: 'free' | 'free_trial' | 'monthly' | 'annual';
  amountDue?: string;
  nextPayment?: Date;
};

type CacheEntry = {
  data: Member[];
  timestamp: number;
  organizationId: string;
};

type CacheState = {
  members: Member[];
  loading: boolean;
  error: string | null;
};

type CacheAction
  = | { type: 'RESET' }
    | { type: 'LOADING_START' }
    | { type: 'LOADING_END' }
    | { type: 'SET_MEMBERS'; payload: Member[] }
    | { type: 'SET_ERROR'; payload: string };

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
let cacheStore: CacheEntry | null = null;
const revalidateCallbacks: Array<() => void> = [];

function cacheReducer(state: CacheState, action: CacheAction): CacheState {
  switch (action.type) {
    case 'RESET':
      return { members: [], loading: false, error: null };
    case 'LOADING_START':
      return { ...state, loading: true, error: null };
    case 'LOADING_END':
      return { ...state, loading: false };
    case 'SET_MEMBERS':
      return { ...state, members: action.payload, loading: false, error: null };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
}

/**
 * Custom hook for intelligent members caching with automatic invalidation.
 * Caches members data and revalidates when organization changes or data mutations occur.
 */
export const useMembersCache = (organizationId: string | undefined) => {
  const [state, dispatch] = useReducer(cacheReducer, {
    members: [],
    loading: true,
    error: null,
  });

  const isCacheValid = useCallback((cache: CacheEntry | null): boolean => {
    if (!cache || !organizationId) {
      return false;
    }
    // Cache is invalid if organization changed or if duration exceeded
    if (cache.organizationId !== organizationId) {
      return false;
    }
    const now = Date.now();
    return (now - cache.timestamp) < CACHE_DURATION;
  }, [organizationId]);

  const fetchMembers = useCallback(async () => {
    try {
      dispatch({ type: 'LOADING_START' });

      // Check if we have a valid cache
      if (isCacheValid(cacheStore)) {
        console.info('[Members Cache] Using cached data for organization:', {
          organizationId,
          cacheAge: Date.now() - (cacheStore?.timestamp || 0),
        });
        dispatch({ type: 'SET_MEMBERS', payload: cacheStore!.data });
        return;
      }

      console.info('[Members Cache] Fetching fresh members data for organization:', organizationId);

      const membersData = await client.members.list();
      const detailedMembers = (membersData.members || []) as Member[];

      // Update cache
      cacheStore = {
        data: detailedMembers,
        timestamp: Date.now(),
        organizationId: organizationId || '',
      };

      console.info('[Members Cache] Members data fetched and cached:', {
        count: detailedMembers.length,
        organizationId,
      });

      dispatch({ type: 'SET_MEMBERS', payload: detailedMembers });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch members';

      console.error('[Members Cache] Error fetching members:', {
        error: errorMessage,
        organizationId,
      });

      // If we have cached data and the fetch fails, use the cached data
      if (cacheStore && isCacheValid(cacheStore)) {
        console.warn('[Members Cache] Using stale cache as fallback after fetch error');
        dispatch({ type: 'SET_MEMBERS', payload: cacheStore.data });
      } else {
        dispatch({ type: 'SET_ERROR', payload: errorMessage });
      }
    }
  }, [organizationId, isCacheValid]);

  // Revalidate cache on demand
  const revalidate = useCallback(async () => {
    console.info('[Members Cache] Manual revalidation triggered');
    cacheStore = null; // Clear cache to force fresh fetch
    await fetchMembers();
  }, [fetchMembers]);

  // Reset state when organization is cleared, or fetch members when it changes
  useEffect(() => {
    if (!organizationId) {
      dispatch({ type: 'RESET' });
      return;
    }

    fetchMembers();
  }, [organizationId, fetchMembers]);

  return {
    members: state.members,
    loading: state.loading,
    error: state.error,
    revalidate,
  };
};

/**
 * Invalidate members cache globally (call this when members are created, updated, or deleted)
 */
export const invalidateMembersCache = () => {
  console.info('[Members Cache] Global cache invalidation triggered');
  cacheStore = null;
  revalidateCallbacks.forEach(callback => callback());
};
