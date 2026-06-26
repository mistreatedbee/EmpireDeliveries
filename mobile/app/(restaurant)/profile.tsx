import React from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator, Alert } from 'react-native';
import { router } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { Store, MapPin, DollarSign, ShoppingBag, LogOut, ChevronRight, Lock, Pencil, BadgeCheck } from 'lucide-react-native';
import { useAuthStore } from '@/stores/authStore';
import { restaurantManagementService } from '@/services/restaurant-management.service';
import { Colors } from '@/constants/colors';

export default function RestaurantProfile() {
  const { user, logout } = useAuthStore();

  const { data: profile, isLoading } = useQuery({
    queryKey: ['restaurant', 'profile'],
    queryFn: restaurantManagementService.getProfile,
  });

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: async () => { await logout(); router.replace('/(auth)/login'); } },
    ]);
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.empire.black }}>
      {/* Header */}
      <View style={{ paddingHorizontal: 24, paddingTop: 60, paddingBottom: 32, alignItems: 'center' }}>
        <View style={{ width: 72, height: 72, borderRadius: 36, backgroundColor: Colors.empire.charcoal, borderWidth: 2, borderColor: Colors.gold[500], alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
          <Store size={34} color={Colors.gold[500]} />
        </View>
        {isLoading ? (
          <ActivityIndicator color={Colors.gold[500]} />
        ) : (
          <>
            <Text style={{ color: '#fff', fontSize: 22, fontWeight: '900', textAlign: 'center' }}>{profile?.name ?? 'My Restaurant'}</Text>
            <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, marginTop: 4 }}>{user?.email ?? ''}</Text>
            <Pressable
              onPress={() => router.push('/(restaurant)/edit-profile')}
              style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 12, backgroundColor: Colors.empire.charcoal, paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, borderWidth: 1, borderColor: '#333' }}
            >
              <Pencil size={13} color={Colors.gold[500]} />
              <Text style={{ color: Colors.gold[500], fontSize: 13, fontWeight: '700' }}>Edit Profile</Text>
            </Pressable>
          </>
        )}
      </View>

      <ScrollView
        style={{ flex: 1, backgroundColor: Colors.surface[100], borderTopLeftRadius: 28, borderTopRightRadius: 28 }}
        contentContainerStyle={{ padding: 24, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Restaurant info */}
        <Text style={{ fontWeight: '800', color: Colors.empire.black, fontSize: 13, letterSpacing: 1, marginBottom: 12, opacity: 0.5 }}>RESTAURANT DETAILS</Text>
        <View style={{ backgroundColor: '#fff', borderRadius: 18, borderWidth: 1, borderColor: Colors.surface[200], marginBottom: 24, overflow: 'hidden' }}>
          {[
            {
              Icon: MapPin,
              label: 'Address',
              value: isLoading ? '—' : (profile?.address ?? 'Not set'),
            },
            {
              Icon: DollarSign,
              label: 'Delivery Fee',
              value: isLoading ? '—' : `R${(profile?.deliveryFee ?? 0).toFixed(2)}`,
            },
            {
              Icon: ShoppingBag,
              label: 'Minimum Order',
              value: isLoading ? '—' : `R${(profile?.minOrder ?? 0).toFixed(2)}`,
            },
          ].map(({ Icon, label, value }, i, arr) => (
            <View
              key={label}
              style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 18, paddingVertical: 16, borderBottomWidth: i < arr.length - 1 ? 1 : 0, borderBottomColor: Colors.surface[100], gap: 14 }}
            >
              <View style={{ width: 38, height: 38, borderRadius: 12, backgroundColor: Colors.surface[100], alignItems: 'center', justifyContent: 'center' }}>
                <Icon size={18} color={Colors.empire.black} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ color: '#aaa', fontSize: 11, fontWeight: '600' }}>{label}</Text>
                <Text style={{ color: Colors.empire.black, fontWeight: '700', fontSize: 14, marginTop: 2 }}>{value}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Account section */}
        <Text style={{ fontWeight: '800', color: Colors.empire.black, fontSize: 13, letterSpacing: 1, marginBottom: 12, opacity: 0.5 }}>ACCOUNT</Text>
        <View style={{ backgroundColor: '#fff', borderRadius: 18, borderWidth: 1, borderColor: Colors.surface[200], marginBottom: 24, overflow: 'hidden' }}>
          <Pressable
            style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 18, paddingVertical: 16, gap: 14, borderBottomWidth: 1, borderBottomColor: Colors.surface[100] }}
            onPress={() => router.push('/(restaurant)/application-status' as any)}
          >
            <View style={{ width: 38, height: 38, borderRadius: 12, backgroundColor: Colors.surface[100], alignItems: 'center', justifyContent: 'center' }}>
              <BadgeCheck size={18} color={Colors.empire.black} />
            </View>
            <Text style={{ flex: 1, fontWeight: '600', color: Colors.empire.black, fontSize: 14 }}>Application Status</Text>
            <ChevronRight size={16} color="#bbb" />
          </Pressable>
          <Pressable
            style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 18, paddingVertical: 16, gap: 14 }}
            onPress={() => router.push('/(restaurant)/change-password')}
          >
            <View style={{ width: 38, height: 38, borderRadius: 12, backgroundColor: Colors.surface[100], alignItems: 'center', justifyContent: 'center' }}>
              <Lock size={18} color={Colors.empire.black} />
            </View>
            <Text style={{ flex: 1, fontWeight: '600', color: Colors.empire.black, fontSize: 14 }}>Change Password</Text>
            <ChevronRight size={16} color="#bbb" />
          </Pressable>
        </View>

        {/* Sign out */}
        <Pressable
          onPress={handleLogout}
          style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFEBEE', borderRadius: 16, paddingVertical: 16, gap: 10 }}
        >
          <LogOut size={18} color={Colors.empire.error} />
          <Text style={{ color: Colors.empire.error, fontWeight: '800', fontSize: 15 }}>Sign Out</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}
