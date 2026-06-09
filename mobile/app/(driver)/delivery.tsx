import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, Alert } from 'react-native';
import { router } from 'expo-router';
import { Colors } from '@/constants/colors';

type Step = 'pickup' | 'deliver' | 'complete';

const ORDER_ITEMS = ['Zinger Tower Burger x1', '8-Piece Bucket x1'];

export default function ActiveDelivery() {
  const [step, setStep] = useState<Step>('pickup');

  if (step === 'complete') {
    return (
      <View style={{ flex: 1, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', padding: 32 }}>
        <View style={{ width: 96, height: 96, borderRadius: 48, backgroundColor: '#E8F5E9', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
          <Text style={{ fontSize: 52 }}>✅</Text>
        </View>
        <Text style={{ fontSize: 26, fontWeight: '900', color: Colors.empire.black, textAlign: 'center' }}>Delivery Complete!</Text>
        <Text style={{ color: '#888', marginTop: 8, fontSize: 15, textAlign: 'center' }}>
          You earned <Text style={{ fontWeight: '900', color: Colors.empire.success }}>R45</Text> for this delivery
        </Text>
        <Pressable onPress={() => router.replace('/(driver)')} style={{ marginTop: 32, backgroundColor: Colors.gold[500], paddingVertical: 16, paddingHorizontal: 48, borderRadius: 18 }}>
          <Text style={{ color: Colors.empire.black, fontWeight: '900', fontSize: 16 }}>Back to Dashboard</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      {/* Map area */}
      <View style={{ height: 260, backgroundColor: Colors.surface[200], alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
        <Text style={{ fontSize: 64 }}>🗺️</Text>
        <Pressable onPress={() => router.back()} style={{ position: 'absolute', top: 52, left: 16, width: 40, height: 40, backgroundColor: '#fff', borderRadius: 14, alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 8, elevation: 4 }}>
          <Text style={{ fontSize: 18 }}>‹</Text>
        </Pressable>
        <View style={{ position: 'absolute', bottom: 16, alignSelf: 'center', backgroundColor: step === 'pickup' ? Colors.empire.warning : Colors.empire.success, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20 }}>
          <Text style={{ color: '#fff', fontWeight: '800', fontSize: 14 }}>
            {step === 'pickup' ? '🏪 Head to Restaurant' : '🏠 Head to Customer'}
          </Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        {/* Location card */}
        <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surface[100], borderRadius: 24, padding: 16, marginBottom: 16 }}>
          <View style={{ flex: 1 }}>
            <Text style={{ color: '#aaa', fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, fontWeight: '600' }}>
              {step === 'pickup' ? 'Pickup From' : 'Deliver To'}
            </Text>
            <Text style={{ fontWeight: '800', color: Colors.empire.black, fontSize: 16, marginTop: 4 }}>
              {step === 'pickup' ? 'KFC Sandton City' : 'Thabo Nkosi'}
            </Text>
            <Text style={{ color: '#aaa', fontSize: 13, marginTop: 2 }}>
              {step === 'pickup' ? 'Sandton City Mall, Ground Floor' : '14 Rivonia Rd, Sandton, 2196'}
            </Text>
          </View>
          <View style={{ width: 44, height: 44, backgroundColor: Colors.empire.black, borderRadius: 14, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontSize: 20 }}>🧭</Text>
          </View>
        </View>

        {step === 'pickup' ? (
          <View>
            <Text style={{ fontWeight: '800', color: Colors.empire.black, fontSize: 15, marginBottom: 12 }}>Order Items</Text>
            {ORDER_ITEMS.map(item => (
              <View key={item} style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderWidth: 1, borderColor: Colors.surface[200], borderRadius: 16, padding: 14, marginBottom: 8 }}>
                <Text style={{ fontSize: 20, marginRight: 12 }}>⬜</Text>
                <Text style={{ fontWeight: '600', color: Colors.empire.black, fontSize: 14 }}>{item}</Text>
              </View>
            ))}
            <Pressable onPress={() => setStep('deliver')} style={{ backgroundColor: Colors.gold[500], borderRadius: 18, paddingVertical: 18, alignItems: 'center', marginTop: 8 }}>
              <Text style={{ color: Colors.empire.black, fontWeight: '900', fontSize: 16 }}>I've Picked Up the Order</Text>
            </Pressable>
          </View>
        ) : (
          <View>
            {/* Customer card */}
            <View style={{ backgroundColor: '#fff', borderWidth: 1, borderColor: Colors.surface[200], borderRadius: 24, padding: 16, marginBottom: 12 }}>
              <Text style={{ color: '#aaa', fontSize: 12, marginBottom: 6 }}>Customer</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <Text style={{ fontWeight: '800', color: Colors.empire.black, fontSize: 15 }}>Thabo Nkosi</Text>
                <View style={{ flexDirection: 'row', gap: 8 }}>
                  <Pressable onPress={() => Alert.alert('Call', 'Calling customer...')} style={{ width: 40, height: 40, backgroundColor: Colors.surface[100], borderRadius: 12, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ fontSize: 18 }}>📞</Text>
                  </Pressable>
                  <Pressable onPress={() => Alert.alert('Message', 'Messaging customer...')} style={{ width: 40, height: 40, backgroundColor: Colors.empire.black, borderRadius: 12, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ fontSize: 18 }}>💬</Text>
                  </Pressable>
                </View>
              </View>
              <Text style={{ color: '#aaa', fontSize: 12, marginTop: 6 }}>Note: Please ring the doorbell</Text>
            </View>

            {/* Proof of delivery */}
            <Pressable onPress={() => Alert.alert('Camera', 'Camera coming soon.')} style={{ borderWidth: 2, borderStyle: 'dashed', borderColor: Colors.surface[300], borderRadius: 18, paddingVertical: 20, alignItems: 'center', marginBottom: 16 }}>
              <Text style={{ fontSize: 28, marginBottom: 6 }}>📷</Text>
              <Text style={{ color: '#aaa', fontWeight: '600', fontSize: 14 }}>Take Proof of Delivery Photo</Text>
            </Pressable>

            <Pressable onPress={() => setStep('complete')} style={{ backgroundColor: Colors.gold[500], borderRadius: 18, paddingVertical: 18, alignItems: 'center' }}>
              <Text style={{ color: Colors.empire.black, fontWeight: '900', fontSize: 16 }}>Confirm Delivery</Text>
            </Pressable>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
