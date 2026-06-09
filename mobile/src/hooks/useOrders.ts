import { useQuery } from '@tanstack/react-query';
import { orderService } from '@/services/order.service';
import { queryKeys } from '@/constants/queryKeys';
import { OrderPollingIntervals } from '@/constants/config';
import { OrderStatus } from '@/types/order.types';

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
  return useQuery({
    queryKey: queryKeys.orders.tracking(id),
    queryFn: () => orderService.getTracking(id),
    enabled: !!id,
    staleTime: 0,
    refetchInterval: (query) => {
      const status = query.state.data?.status as OrderStatus | undefined;
      if (!status) return 10_000;
      const interval = OrderPollingIntervals[status];
      return interval ?? false;
    },
  });
}
