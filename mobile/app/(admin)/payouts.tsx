import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator, Alert } from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Banknote, CheckCircle, XCircle } from 'lucide-react-native';
import { adminService, WithdrawalRequest } from '@/services/admin.service';
import { Colors } from '@/constants/colors';
import { getUserErrorMessage } from '@/utils/errorHandler';

const FILTERS = ['pending', 'approved', 'rejected', 'all'] as const;

function PayoutCard({
  item,
  onApprove,
  onReject,
  loading,
}: {
  item: WithdrawalRequest;
  onApprove: () => void;
  onReject: () => void;
  loading: boolean;
}) {
  const isPending = item.status === 'pending';
  return (
    <View style={{ backgroundColor: Colors.empire.charcoal, borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: isPending ? Colors.gold[500] + '55' : '#2a2a2a' }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
        <View>
          <Text style={{ color: '#fff', fontWeight: '800', fontSize: 18 }}>R{item.amount.toFixed(2)}</Text>
          <Text style={{ color: '#888', fontSize: 12, marginTop: 2 }}>
            {item.entityType === 'restaurant' ? item.businessName : item.requesterName}
          </Text>
        </View>
        <View style={{ backgroundColor: item.entityType === 'driver' ? Colors.gold[500] + '22' : '#4ade8022', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 }}>
          <Text style={{ color: item.entityType === 'driver' ? Colors.gold[500] : '#4ade80', fontWeight: '700', fontSize: 11, textTransform: 'uppercase' }}>
            {item.entityType}
          </Text>
        </View>
      </View>

      <Text style={{ color: '#666', fontSize: 12, marginBottom: 4 }}>{item.requesterEmail}</Text>
      {item.bankAccountNo && (
        <Text style={{ color: '#888', fontSize: 12, marginBottom: 8 }}>
          {item.bankName} · {item.bankAccountNo} · {item.bankHolderName}
        </Text>
      )}
      <Text style={{ color: '#555', fontSize: 11 }}>
        Requested {new Date(item.createdAt).toLocaleString('en-ZA')} · {item.status}
      </Text>

      {isPending && (
        <View style={{ flexDirection: 'row', gap: 8, marginTop: 12 }}>
          <Pressable
            onPress={onApprove}
            disabled={loading}
            style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: '#4ade8022', borderRadius: 10, paddingVertical: 12, borderWidth: 1, borderColor: '#4ade8044' }}
          >
            <CheckCircle size={16} color="#4ade80" />
            <Text style={{ color: '#4ade80', fontWeight: '700' }}>Approve payout</Text>
          </Pressable>
          <Pressable
            onPress={onReject}
            disabled={loading}
            style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: '#ef444422', borderRadius: 10, paddingVertical: 12, borderWidth: 1, borderColor: '#ef444444' }}
          >
            <XCircle size={16} color="#ef4444" />
            <Text style={{ color: '#ef4444', fontWeight: '700' }}>Reject</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

export default function AdminPayoutsScreen() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>('pending');
  const queryClient = useQueryClient();

  const { data: withdrawals = [], isLoading } = useQuery({
    queryKey: ['admin', 'withdrawals', filter],
    queryFn: () => adminService.getWithdrawals({
      status: filter === 'all' ? 'all' : filter,
      entityType: 'all',
    }),
    refetchInterval: 15000,
  });

  const approveMutation = useMutation({
    mutationFn: (id: string) => adminService.approveWithdrawal(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin'] });
    },
    onError: (err) => Alert.alert('Error', getUserErrorMessage(err, 'Could not approve payout.')),
  });

  const rejectMutation = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) => adminService.rejectWithdrawal(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin'] });
    },
    onError: (err) => Alert.alert('Error', getUserErrorMessage(err, 'Could not reject payout.')),
  });

  const handleReject = (item: WithdrawalRequest) => {
    Alert.prompt(
      'Reject withdrawal',
      'Reason (optional). Funds will be returned to their wallet.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Reject', style: 'destructive', onPress: (reason) => rejectMutation.mutate({ id: item.id, reason }) },
      ],
      'plain-text',
    );
  };

  const mutating = approveMutation.isPending || rejectMutation.isPending;

  return (
    <View style={{ flex: 1, backgroundColor: Colors.empire.black }}>
      <View style={{ paddingTop: 56, paddingHorizontal: 24, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: Colors.empire.charcoal }}>
        <Text style={{ color: '#888', fontSize: 12, fontWeight: '700', letterSpacing: 2 }}>ADMIN PORTAL</Text>
        <Text style={{ color: '#fff', fontSize: 24, fontWeight: '900', marginTop: 2 }}>Payouts</Text>
        <Text style={{ color: '#666', fontSize: 13, marginTop: 4 }}>Driver & restaurant withdrawal requests</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 14 }}>
          {FILTERS.map((f) => (
            <Pressable
              key={f}
              onPress={() => setFilter(f)}
              style={{
                marginRight: 8,
                paddingHorizontal: 14,
                paddingVertical: 8,
                borderRadius: 20,
                backgroundColor: filter === f ? Colors.gold[500] : Colors.empire.charcoal,
                borderWidth: 1,
                borderColor: filter === f ? Colors.gold[500] : '#2a2a2a',
              }}
            >
              <Text style={{ color: filter === f ? Colors.empire.black : '#888', fontWeight: '700', fontSize: 12, textTransform: 'capitalize' }}>
                {f}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      {isLoading ? (
        <ActivityIndicator color={Colors.gold[500]} style={{ marginTop: 40 }} />
      ) : withdrawals.length === 0 ? (
        <View style={{ alignItems: 'center', marginTop: 60, paddingHorizontal: 32 }}>
          <Banknote size={40} color="#444" />
          <Text style={{ color: '#888', marginTop: 12, textAlign: 'center' }}>No {filter === 'all' ? '' : filter} withdrawal requests</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
          {withdrawals.map((item) => (
            <PayoutCard
              key={item.id}
              item={item}
              loading={mutating}
              onApprove={() => approveMutation.mutate(item.id)}
              onReject={() => handleReject(item)}
            />
          ))}
        </ScrollView>
      )}
    </View>
  );
}
