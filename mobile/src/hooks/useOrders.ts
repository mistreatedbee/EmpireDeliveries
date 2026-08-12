import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import EventSource from 'react-native-sse';
import { orderService } from '@/services/order.service';
import { queryKeys } from '@/constants/queryKeys';
import { TrackingUpdate } from '@/types/order.types';
import { normalizeTrackingUpdate } from '@/utils/normalizeOrder';
import { Config } from '@/constants/config';
import { OrderPollingIntervals } from '@/constants/config';
import { useAuthStore } from '@/stores/authStore';

export function useOrders(status?: string) {
  return useQuery({
    queryKey: queryKeys.orders.list(status),
    queryFn: () => orderService.getList(status),
    refetchInterval: status?.includes('placed') || status?.includes('confirmed') ? 15000 : false,
  });
}

export function useOrderDetail(id: string) {
  return useQuery({
    queryKey: queryKeys.orders.detail(id),
    queryFn: () => orderService.getById(id),
    enabled: !!id,
  });
}

export function useOrderTracking(id: string) {
  const token = useAuthStore((s) => s.token);
  const [data, setData] = useState<TrackingUpdate | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (!id || !token) return;
    setIsLoading(true);
    setIsError(false);
    let fallbackTimer: ReturnType<typeof setInterval> | null = null;

    const es = new EventSource(
      `${Config.API_BASE_URL}/orders/${id}/tracking/stream`,
      {
        headers: { Authorization: `Bearer ${token}` },
        lineEndingCharacter: '\n',
      }
    );

    const pollOnce = () => {
      void orderService.getTracking(id).then((tracking) => {
        setData(tracking);
        setIsLoading(false);
        if (tracking.status === 'delivered' || tracking.status === 'cancelled') {
          if (fallbackTimer) clearInterval(fallbackTimer);
        }
      }).catch(() => null);
    };

    pollOnce();
    const livePoll = setInterval(pollOnce, 6000);

    es.addEventListener('message', (e) => {
      if (e.data) {
        try {
          setData(normalizeTrackingUpdate(JSON.parse(e.data) as Record<string, unknown>, id));
        } catch { /* ignore malformed frames */ }
        setIsLoading(false);
      }
    });

    es.addEventListener('error', () => {
      setIsLoading(false);
      setIsError(true);
      pollOnce();
      if (!fallbackTimer) {
        fallbackTimer = setInterval(pollOnce, OrderPollingIntervals.on_way ?? 8000);
      }
    });

    return () => {
      es.close();
      clearInterval(livePoll);
      if (fallbackTimer) clearInterval(fallbackTimer);
    };
  }, [id, token]);

  return { data, isLoading, isError };
}
