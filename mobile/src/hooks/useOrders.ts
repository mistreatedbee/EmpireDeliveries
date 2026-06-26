import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import EventSource from 'react-native-sse';
import { orderService } from '@/services/order.service';
import { queryKeys } from '@/constants/queryKeys';
import { TrackingUpdate } from '@/types/order.types';
import { Config } from '@/constants/config';
import { useAuthStore } from '@/stores/authStore';

export function useOrders(status?: string) {
  return useQuery({
    queryKey: queryKeys.orders.list(status),
    queryFn: () => orderService.getList(status),
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

  useEffect(() => {
    if (!id || !token) return;
    setIsLoading(true);

    const es = new EventSource(
      `${Config.API_BASE_URL}/orders/${id}/tracking/stream`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    es.addEventListener('message', (e) => {
      if (e.data) {
        try {
          setData(JSON.parse(e.data) as TrackingUpdate);
        } catch { /* ignore malformed frames */ }
        setIsLoading(false);
      }
    });

    es.addEventListener('error', () => {
      setIsLoading(false);
    });

    return () => es.close();
  }, [id, token]);

  return { data, isLoading };
}
