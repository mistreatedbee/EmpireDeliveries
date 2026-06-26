import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Search, ShieldOff, ShieldCheck, ChevronDown, Users } from 'lucide-react-native';
import { adminService, AdminUser } from '@/services/admin.service';
import { Button, Input, Badge, SkeletonList, EmptyState } from '@/components/empire';
import type { BadgeVariant } from '@/components/empire';
import { useUIStore } from '@/stores/uiStore';
import { Colors } from '@/constants/colors';

const ROLES = ['all', 'customer', 'driver', 'restaurant', 'admin'];

function roleBadgeVariant(role: string): BadgeVariant {
  switch (role) {
    case 'admin': return 'gold';
    case 'driver': return 'info';
    case 'restaurant': return 'warning';
    default: return 'neutral';
  }
}

function statusBadgeVariant(status: string): BadgeVariant {
  switch (status) {
    case 'approved': return 'success';
    case 'suspended': return 'danger';
    case 'pending': return 'warning';
    default: return 'neutral';
  }
}

function UserRow({ user, onSuspend, onReactivate, loading }: {
  user: AdminUser;
  onSuspend: () => void;
  onReactivate: () => void;
  loading: boolean;
}) {
  return (
    <View className="bg-t-surface rounded-2xl p-4 mb-3 border border-t-border">
      <View className="flex-row items-start justify-between mb-2">
        <View className="flex-1 mr-3">
          <Text className="text-t-text text-base" style={{ fontFamily: 'Inter_700Bold' }}>
            {user.firstName} {user.lastName}
          </Text>
          <Text className="text-t-textSec text-xs mt-0.5" style={{ fontFamily: 'Inter_400Regular' }}>
            {user.email}
          </Text>
          {user.phone ? (
            <Text className="text-t-textTer text-xs mt-0.5" style={{ fontFamily: 'Inter_400Regular' }}>
              {user.phone}
            </Text>
          ) : null}
        </View>
        <View className="items-end gap-1">
          <Badge variant={roleBadgeVariant(user.role)}>{user.role}</Badge>
          <Badge variant={statusBadgeVariant(user.approvalStatus)}>{user.approvalStatus}</Badge>
        </View>
      </View>

      <Text className="text-t-textTer text-xs mb-3" style={{ fontFamily: 'Inter_400Regular' }}>
        Joined {new Date(user.createdAt).toLocaleDateString('en-ZA')}
        {user.isVerified ? '  ·  Verified' : '  ·  Unverified'}
      </Text>

      {user.approvalStatus !== 'suspended' ? (
        <Button
          variant="destructive"
          size="sm"
          fullWidth
          onPress={onSuspend}
          loading={loading}
          disabled={loading || user.role === 'admin'}
          leftIcon={<ShieldOff size={14} color="#fff" />}
        >
          {user.role === 'admin' ? 'Cannot Suspend Admin' : 'Suspend Account'}
        </Button>
      ) : (
        <Button
          variant="secondary"
          size="sm"
          fullWidth
          onPress={onReactivate}
          loading={loading}
          disabled={loading}
          leftIcon={<ShieldCheck size={14} color="#1E823B" />}
        >
          Reactivate Account
        </Button>
      )}
    </View>
  );
}

export default function UsersScreen() {
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('all');
  const [page, setPage] = useState(1);
  const [showRolePicker, setShowRolePicker] = useState(false);
  const [suspendReason, setSuspendReason] = useState('');
  const [pendingSuspendId, setPendingSuspendId] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const showToast = useUIStore((s) => s.showToast);

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['admin', 'users', search, role, page],
    queryFn: () => adminService.getUsers({ search: search || undefined, role: role === 'all' ? undefined : role, page }),
    placeholderData: (prev) => prev,
  });

  const suspendMutation = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) => adminService.suspendUser(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      showToast('User suspended successfully', 'success');
      setPendingSuspendId(null);
      setSuspendReason('');
    },
    onError: (err: any) => showToast(err.message || 'Failed to suspend user', 'error'),
  });

  const reactivateMutation = useMutation({
    mutationFn: (id: string) => adminService.reactivateUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      showToast('User reactivated successfully', 'success');
    },
    onError: (err: any) => showToast(err.message || 'Failed to reactivate user', 'error'),
  });

  const handleSuspend = (user: AdminUser) => {
    setPendingSuspendId(user.id);
    setSuspendReason('');
  };

  const confirmSuspend = () => {
    if (!pendingSuspendId) return;
    suspendMutation.mutate({ id: pendingSuspendId, reason: suspendReason.trim() || undefined });
  };

  const mutating = suspendMutation.isPending || reactivateMutation.isPending;
  const users = data?.data ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.ceil(total / 20);

  return (
    <View className="flex-1 bg-t-dark">
      {/* Header */}
      <View className="px-6 pb-4 border-b border-t-border" style={{ paddingTop: 56 }}>
        <Text
          className="text-t-textSec text-xs"
          style={{ fontFamily: 'Inter_700Bold', letterSpacing: 2 }}
        >
          ADMIN PORTAL
        </Text>
        <Text className="text-white text-2xl mt-0.5 mb-4" style={{ fontFamily: 'Inter_900Black' }}>
          Users
        </Text>

        <View className="flex-row gap-3">
          <View className="flex-1">
            <Input
              value={search}
              onChangeText={(v) => { setSearch(v); setPage(1); }}
              placeholder="Search name, email..."
              autoCapitalize="none"
              returnKeyType="search"
              leftIcon={<Search size={16} color="#666" />}
            />
          </View>

          <Pressable
            onPress={() => setShowRolePicker((v) => !v)}
            className="flex-row items-center gap-1.5 bg-t-surface rounded-2xl px-3 border border-t-border"
            style={{ paddingVertical: 10 }}
          >
            <Text
              style={{
                color: role === 'all' ? '#888' : Colors.gold[500],
                fontFamily: 'Inter_700Bold',
                fontSize: 13,
                textTransform: 'capitalize',
              }}
            >
              {role}
            </Text>
            <ChevronDown size={14} color="#666" />
          </Pressable>
        </View>

        {showRolePicker && (
          <View
            className="absolute right-6 bg-t-surface rounded-2xl border border-t-border overflow-hidden"
            style={{ top: 130, zIndex: 100 }}
          >
            {ROLES.map((r, i) => (
              <Pressable
                key={r}
                onPress={() => { setRole(r); setPage(1); setShowRolePicker(false); }}
                className="px-5"
                style={{
                  paddingVertical: 12,
                  borderBottomWidth: i < ROLES.length - 1 ? 1 : 0,
                  borderBottomColor: '#2a2a2a',
                }}
              >
                <Text
                  style={{
                    color: role === r ? Colors.gold[500] : '#ccc',
                    fontFamily: role === r ? 'Inter_700Bold' : 'Inter_400Regular',
                    fontSize: 14,
                    textTransform: 'capitalize',
                  }}
                >
                  {r}
                </Text>
              </Pressable>
            ))}
          </View>
        )}
      </View>

      {/* Inline suspend reason entry */}
      {pendingSuspendId && (
        <View className="mx-4 mt-3 bg-t-surface rounded-2xl p-4 border border-t-border">
          <Text className="text-t-text text-sm mb-2" style={{ fontFamily: 'Inter_700Bold' }}>
            Reason for suspension (optional)
          </Text>
          <Input
            value={suspendReason}
            onChangeText={setSuspendReason}
            placeholder="Enter reason..."
            autoCapitalize="sentences"
          />
          <View className="flex-row gap-3 mt-2">
            <View className="flex-1">
              <Button
                variant="ghost"
                size="sm"
                fullWidth
                onPress={() => { setPendingSuspendId(null); setSuspendReason(''); }}
              >
                Cancel
              </Button>
            </View>
            <View className="flex-1">
              <Button
                variant="destructive"
                size="sm"
                fullWidth
                loading={suspendMutation.isPending}
                onPress={confirmSuspend}
              >
                Confirm Suspend
              </Button>
            </View>
          </View>
        </View>
      )}

      {/* Count row */}
      <View className="px-6 py-2 flex-row items-center justify-between">
        <Text className="text-t-textTer text-xs" style={{ fontFamily: 'Inter_400Regular' }}>
          {total} user{total !== 1 ? 's' : ''}
        </Text>
        {isFetching && !isLoading && (
          <Text className="text-t-textTer text-xs" style={{ fontFamily: 'Inter_400Regular' }}>
            Refreshing…
          </Text>
        )}
      </View>

      {isLoading ? (
        <View className="px-4 mt-2">
          <SkeletonList rows={6} />
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 40 }}>
          {users.length === 0 ? (
            <EmptyState
              icon={<Users size={28} color="#A3A3A3" />}
              title="No users found"
              description="Try adjusting your search or role filter."
              className="py-16"
            />
          ) : (
            users.map((u) => (
              <UserRow
                key={u.id}
                user={u}
                onSuspend={() => handleSuspend(u)}
                onReactivate={() => reactivateMutation.mutate(u.id)}
                loading={mutating}
              />
            ))
          )}

          {totalPages > 1 && (
            <View className="flex-row justify-center items-center gap-3 mt-2">
              <Button
                variant="secondary"
                size="sm"
                onPress={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                ← Prev
              </Button>
              <Text className="text-t-textSec text-sm" style={{ fontFamily: 'Inter_400Regular' }}>
                {page} / {totalPages}
              </Text>
              <Button
                variant="secondary"
                size="sm"
                onPress={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                Next →
              </Button>
            </View>
          )}
        </ScrollView>
      )}
    </View>
  );
}
