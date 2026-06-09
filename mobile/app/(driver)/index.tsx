import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, Image, Switch } from 'react-native';
import { router } from 'expo-router';
import { useAuthStore } from '@/stores/authStore';
import { Colors } from '@/constants/colors';

const DELIVERY_REQUEST = {
  restaurant: 'KFC Sandton City',
  items: '1 order • 2 items',
  distance: '3.2 km',
  payout: 'R45',
  eta: '18 min',
};

const RECENT = [
  { name: "Nando's Rosebank", time: '14:22', earn: 'R38', rating: '5.0' },
  { name: 'Steers Midrand', time: '12:08', earn: 'R42', rating: '4.8' },
  { name: 'McDonald\'s Fourways', time: '10:45', earn: 'R35', rating: '5.0' },
];

export default function DriverDashboard() {
  const { user } = useAuthStore();
  const [online, setOnline] = useState(false);
  const [hasRequest, setHasRequest] = useState(false);

  return (
    <View style={{ flex: 1, backgroundColor: Colors.surface[100] }}>
      {/* Header */}
      <View style={{ backgroundColor: Colors.empire.black, paddingHorizontal: 20, paddingTop: 56, paddingBottom: 16 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View>
            <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12 }}>Welcome back,</Text>
            <Text style={{ color: '#fff', fontSize: 18, fontWeight: '900' }}>{user?.firstName ?? 'Driver'}</Text>
          </View>
          <View style={{ width: 44, height: 44, borderRadius: 14, backgroundColor: Colors.empire.charcoal, borderWidth: 2, borderColor: Colors.gold[500], alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontSize: 20 }}>🚴</Text>
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        {/* Online Toggle */}
        <View style={{ borderRadius: 24, padding: 20, backgroundColor: online ? Colors.empire.success : '#9E9E9E', marginBottom: 16 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View>
              <Text style={{ color: '#fff', fontSize: 18, fontWeight: '900' }}>{online ? "You're Online" : "You're Offline"}</Text>
              <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13, marginTop: 2 }}>
                {online ? 'Ready to receive deliveries' : 'Toggle to start earning'}
              </Text>
            </View>
            <Switch
              value={online}
              onValueChange={(v) => { setOnline(v); if (v) setHasRequest(true); else setHasRequest(false); }}
              trackColor={{ false: 'rgba(0,0,0,0.2)', true: 'rgba(255,255,255,0.3)' }}
              thumbColor="#fff"
            />
          </View>
          {online && (
            <View style={{ flexDirection: 'row', gap: 12, marginTop: 16 }}>
              {[{ label: 'Today', value: 'R480' }, { label: 'Deliveries', value: '6' }, { label: 'Acceptance', value: '94%' }].map(s => (
                <View key={s.label} style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 16, padding: 12, alignItems: 'center' }}>
                  <Text style={{ color: '#fff', fontWeight: '900', fontSize: 18 }}>{s.value}</Text>
                  <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 11, marginTop: 2 }}>{s.label}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Delivery Request */}
        {online && hasRequest && (
          <View style={{ backgroundColor: '#fff', borderRadius: 24, borderWidth: 2, borderColor: Colors.gold[500], marginBottom: 16, overflow: 'hidden' }}>
            <View style={{ padding: 16 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <View style={{ backgroundColor: Colors.gold[500], paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20 }}>
                  <Text style={{ color: Colors.empire.black, fontWeight: '800', fontSize: 12 }}>New Request</Text>
                </View>
                <Text style={{ color: Colors.empire.error, fontWeight: '700', fontSize: 13 }}>Expires in 0:28</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                <View style={{ width: 48, height: 48, borderRadius: 14, backgroundColor: Colors.surface[200], alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{ fontSize: 24 }}>🍗</Text>
                </View>
                <View>
                  <Text style={{ fontWeight: '700', color: Colors.empire.black, fontSize: 15 }}>{DELIVERY_REQUEST.restaurant}</Text>
                  <Text style={{ color: '#888', fontSize: 12, marginTop: 2 }}>{DELIVERY_REQUEST.items}</Text>
                </View>
              </View>
              <View style={{ flexDirection: 'row', gap: 8, marginBottom: 16 }}>
                {[{ label: 'Distance', value: DELIVERY_REQUEST.distance }, { label: 'Payout', value: DELIVERY_REQUEST.payout }, { label: 'ETA', value: DELIVERY_REQUEST.eta }].map(s => (
                  <View key={s.label} style={{ flex: 1, backgroundColor: Colors.surface[100], borderRadius: 14, padding: 10, alignItems: 'center' }}>
                    <Text style={{ fontWeight: '800', color: Colors.empire.black, fontSize: 14 }}>{s.value}</Text>
                    <Text style={{ color: '#aaa', fontSize: 11, marginTop: 2 }}>{s.label}</Text>
                  </View>
                ))}
              </View>
              <View style={{ flexDirection: 'row', gap: 10 }}>
                <Pressable onPress={() => setHasRequest(false)} style={{ flex: 1, paddingVertical: 14, borderRadius: 16, borderWidth: 2, borderColor: Colors.surface[300], alignItems: 'center' }}>
                  <Text style={{ color: '#888', fontWeight: '700' }}>Decline</Text>
                </Pressable>
                <Pressable onPress={() => router.push('/(driver)/delivery')} style={{ flex: 1, paddingVertical: 14, borderRadius: 16, backgroundColor: Colors.empire.success, alignItems: 'center' }}>
                  <Text style={{ color: '#fff', fontWeight: '800' }}>Accept</Text>
                </Pressable>
              </View>
            </View>
            <View style={{ height: 4, backgroundColor: Colors.surface[200] }}>
              <View style={{ width: '60%', height: '100%', backgroundColor: Colors.gold[500] }} />
            </View>
          </View>
        )}

        {/* Map Placeholder */}
        <View style={{ borderRadius: 24, overflow: 'hidden', height: 160, marginBottom: 20, backgroundColor: Colors.surface[200], alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: 48 }}>🗺️</Text>
          <Text style={{ color: '#999', marginTop: 8, fontWeight: '600' }}>Sandton, JHB</Text>
        </View>

        {/* Recent Deliveries */}
        <Text style={{ fontWeight: '800', color: Colors.empire.black, fontSize: 16, marginBottom: 12 }}>Recent Deliveries</Text>
        {RECENT.map((d) => (
          <View key={d.name} style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 16, padding: 12, marginBottom: 8, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, elevation: 1 }}>
            <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: Colors.surface[100], alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
              <Text style={{ fontSize: 20 }}>🚴</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontWeight: '700', fontSize: 13, color: Colors.empire.black }}>{d.name}</Text>
              <Text style={{ color: '#aaa', fontSize: 12, marginTop: 2 }}>{d.time} · ★ {d.rating}</Text>
            </View>
            <Text style={{ fontWeight: '800', color: Colors.empire.success, fontSize: 14 }}>{d.earn}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
