import React from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator, Alert } from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Users, Truck, Clock, ShoppingBag, CheckCircle, XCircle } from 'lucide-react-native';
import { adminService } from '@/services/admin.service';
import { useAuthStore } from '@/stores/authStore';
import { Colors } from '@/constants/colors';

function StatCard({ icon: Icon, label, value, color }: { icon: any; label: string; value: number | string; color: string }) {
  return (
    <View style={{ flex: 1, backgroundColor: Colors.empire.charcoal, borderRadius: 14, padding: 16, borderWidth: 1, borderColor: '#2a2a2a', minWidth: '47%' }}>
      <Icon size={20} color={color} />
      <Text style={{ color: '#fff', fontSize: 26, fontWeight: '900', marginTop: 10 }}>{value}</Text>
      <Text style={{ color: '#888', fontSize: 12, marginTop: 2 }}>{label}</Text>
    </View>
  );
}

export default function AdminDashboard() {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: () => adminService.getStats(),
    refetchInterval: 30000,
  });

  const { data: pending, isLoading: pendingLoading } = useQuery({
    queryKey: ['admin', 'applications', 'pending'],
    queryFn: () => adminService.getApplications({ status: 'pending' }),
    refetchInterval: 30000,
  });

  const approveMutation = useMutation({
    mutationFn: ({ id, type }: { id: string; type: 'driver' | 'restaurant' }) =>
      adminService.approveApplication(id, type),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin'] });
    },
    onError: (err: any) => Alert.alert('Error', err.message || 'Approval failed'),
  });

  const rejectMutation = useMutation({
    mutationFn: ({ id, type, reason }: { id: string; type: 'driver' | 'restaurant'; reason?: string }) =>
      adminService.rejectApplication(id, type, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin'] });
    },
    onError: (err: any) => Alert.alert('Error', err.message || 'Rejection failed'),
  });

  const handleReject = (id: string, type: 'driver' | 'restaurant', name: string) => {
    Alert.prompt(
      'Reject Application',
      `Provide a reason for rejecting ${name}'s application (optional):`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Reject', style: 'destructive', onPress: (reason?: string) => rejectMutation.mutate({ id, type, reason }) },
      ],
      'plain-text',
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.empire.black }}>
      <View style={{ paddingTop: 56, paddingHorizontal: 24, paddingBottom: 20, borderBottomWidth: 1, borderBottomColor: Colors.empire.charcoal }}>
        <Text style={{ color: '#888', fontSize: 12, fontWeight: '700', letterSpacing: 2 }}>ADMIN PORTAL</Text>
        <Text style={{ color: '#fff', fontSize: 24, fontWeight: '900', marginTop: 2 }}>Dashboard</Text>
        <Text style={{ color: '#666', fontSize: 13, marginTop: 2 }}>
          {user?.firstName} {user?.lastName}
        </Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 40 }}>
        {statsLoading ? (
          <ActivityIndicator color={Colors.gold[500]} style={{ marginTop: 40 }} />
        ) : (
          <>
            <Text style={{ color: '#888', fontSize: 11, fontWeight: '700', letterSpacing: 1.5, marginBottom: 12 }}>PLATFORM OVERVIEW</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 28 }}>
              <StatCard icon={Users} label="Total Users" value={stats?.users.total ?? 0} color={Colors.gold[500]} />
              <StatCard icon={Truck} label="Active Drivers" value={stats?.users.drivers ?? 0} color="#4ade80" />
              <StatCard icon={Clock} label="Pending Approval" value={stats?.users.pendingApproval ?? 0} color="#f97316" />
              <StatCard icon={ShoppingBag} label="Orders Today" value={stats?.orders.today ?? 0} color="#60a5fa" />
            </View>
          </>
        )}

        <Text style={{ color: '#888', fontSize: 11, fontWeight: '700', letterSpacing: 1.5, marginBottom: 12 }}>PENDING APPLICATIONS</Text>

        {pendingLoading ? (
          <ActivityIndicator color={Colors.gold[500]} />
        ) : !pending?.length ? (
          <View style={{ alignItems: 'center', paddingVertical: 32 }}>
            <CheckCircle size={36} color="#4ade80" />
            <Text style={{ color: '#888', fontSize: 14, marginTop: 10 }}>No pending applications</Text>
          </View>
        ) : (
          pending.slice(0, 8).map((app) => (
            <View key={app.id} style={{ backgroundColor: Colors.empire.charcoal, borderRadius: 14, padding: 16, marginBottom: 10, borderWidth: 1, borderColor: '#2a2a2a' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                <View>
                  <Text style={{ color: '#fff', fontWeight: '700', fontSize: 15 }}>{app.firstName} {app.lastName}</Text>
                  <Text style={{ color: '#888', fontSize: 12 }}>{app.email}</Text>
                </View>
                <View style={{ backgroundColor: app.applicationType === 'driver' ? Colors.gold[500] + '22' : '#4ade8022', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 }}>
                  <Text style={{ color: app.applicationType === 'driver' ? Colors.gold[500] : '#4ade80', fontWeight: '700', fontSize: 11, textTransform: 'uppercase' }}>
                    {app.applicationType}
                  </Text>
                </View>
              </View>
              <Text style={{ color: '#666', fontSize: 11, marginBottom: 12 }}>
                Submitted {new Date(app.submittedAt).toLocaleDateString('en-ZA')}
              </Text>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                <Pressable
                  onPress={() => approveMutation.mutate({ id: app.id, type: app.applicationType })}
                  disabled={approveMutation.isPending || rejectMutation.isPending}
                  style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: '#4ade8022', borderRadius: 10, paddingVertical: 10, borderWidth: 1, borderColor: '#4ade8044' }}
                >
                  <CheckCircle size={14} color="#4ade80" />
                  <Text style={{ color: '#4ade80', fontWeight: '700', fontSize: 13 }}>Approve</Text>
                </Pressable>
                <Pressable
                  onPress={() => handleReject(app.id, app.applicationType, `${app.firstName} ${app.lastName}`)}
                  disabled={approveMutation.isPending || rejectMutation.isPending}
                  style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: '#ef444422', borderRadius: 10, paddingVertical: 10, borderWidth: 1, borderColor: '#ef444444' }}
                >
                  <XCircle size={14} color="#ef4444" />
                  <Text style={{ color: '#ef4444', fontWeight: '700', fontSize: 13 }}>Reject</Text>
                </Pressable>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}
