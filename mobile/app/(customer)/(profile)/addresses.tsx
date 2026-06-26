import React from 'react';
import { View, Text, FlatList, Pressable, ActivityIndicator, Alert } from 'react-native';
import { router } from 'expo-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Home, Briefcase, MapPin } from 'lucide-react-native';
import { ScreenWrapper } from '@/components/layout/ScreenWrapper';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { userService, BackendAddress } from '@/services/user.service';
import { queryKeys } from '@/constants/queryKeys';
import { useUIStore } from '@/stores/uiStore';
import { T } from '@/constants/colors';

const LABEL_ICON: Record<string, React.ComponentType<{ size: number; color: string }>> = {
  home: Home,
  work: Briefcase,
  other: MapPin,
};

function AddressCard({
  address,
  onDelete,
  onSetDefault,
}: {
  address: BackendAddress;
  onDelete: () => void;
  onSetDefault?: () => void;
}) {
  const parts = [address.street, address.suburb, address.city, address.province].filter(Boolean);
  const IconComp = LABEL_ICON[address.label] ?? MapPin;

  return (
    <View style={{ backgroundColor: T.bg, borderRadius: 12, padding: 16, marginBottom: 10, borderWidth: 1, borderColor: T.border }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <View style={{ width: 40, height: 40, borderRadius: 10, backgroundColor: T.surface, alignItems: 'center', justifyContent: 'center' }}>
          <IconComp size={18} color={T.textSec} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ fontWeight: '800', fontSize: 15, color: T.text, textTransform: 'capitalize' }}>{address.label}</Text>
          <Text style={{ color: T.textSec, fontSize: 13, marginTop: 2 }} numberOfLines={2}>{parts.join(', ')}</Text>
          {address.isDefault && (
            <View style={{ marginTop: 4, backgroundColor: T.surface2, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 2, alignSelf: 'flex-start' }}>
              <Text style={{ color: T.textSec, fontSize: 11, fontWeight: '700' }}>Default</Text>
            </View>
          )}
          {!address.isDefault && onSetDefault && (
            <Pressable onPress={onSetDefault} style={{ marginTop: 6, alignSelf: 'flex-start' }}>
              <Text style={{ color: T.action, fontSize: 12, fontWeight: '700' }}>Set as default</Text>
            </Pressable>
          )}
        </View>
        <Pressable
          onPress={() =>
            Alert.alert('Delete Address', 'Remove this address?', [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Delete', style: 'destructive', onPress: onDelete },
            ])
          }
          style={{ padding: 8 }}
        >
          <Text style={{ color: T.danger, fontSize: 13, fontWeight: '600' }}>Delete</Text>
        </Pressable>
      </View>
    </View>
  );
}

export default function AddressesScreen() {
  const queryClient = useQueryClient();
  const { showToast } = useUIStore();

  const { data: addresses = [], isLoading } = useQuery({
    queryKey: queryKeys.user.addresses,
    queryFn: () => userService.getAddresses(),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => userService.deleteAddress(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.user.addresses });
      showToast('Address removed', 'success');
    },
    onError: () => showToast('Failed to remove address', 'error'),
  });

  const setDefaultMutation = useMutation({
    mutationFn: (id: string) => userService.setDefaultAddress(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.user.addresses });
      showToast('Default address updated', 'success');
    },
    onError: () => showToast('Failed to update default address', 'error'),
  });

  if (isLoading) {
    return (
      <ScreenWrapper bg="white">
        <Header title="Saved Addresses" />
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size="large" color={T.action} />
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper bg="white">
      <Header title="Saved Addresses" />
      {addresses.length === 0 ? (
        <EmptyState
          title="No saved addresses"
          subtitle="Save addresses for faster checkout"
          actionLabel="Add Address"
          onAction={() => router.push('/(customer)/(profile)/add-address')}
        />
      ) : (
        <FlatList
          data={addresses}
          keyExtractor={(a) => a.id}
          renderItem={({ item }) => (
            <AddressCard
              address={item}
              onDelete={() => deleteMutation.mutate(item.id)}
              onSetDefault={() => setDefaultMutation.mutate(item.id)}
            />
          )}
          contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
          ListFooterComponent={
            <Button variant="primary" size="md" onPress={() => router.push('/(customer)/(profile)/add-address')}>
              + Add New Address
            </Button>
          }
        />
      )}
    </ScreenWrapper>
  );
}
