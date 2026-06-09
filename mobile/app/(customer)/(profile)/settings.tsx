import React, { useState } from 'react';
import { View, Text, Switch } from 'react-native';
import { ScreenWrapper } from '@/components/layout/ScreenWrapper';
import { Header } from '@/components/layout/Header';
import { Colors } from '@/constants/colors';

export default function SettingsScreen() {
  const [pushEnabled, setPushEnabled] = useState(true);
  const [promoEmails, setPromoEmails] = useState(false);
  const [orderUpdates, setOrderUpdates] = useState(true);

  const settings = [
    { label: 'Push Notifications', subtitle: 'Order updates and alerts', value: pushEnabled, onChange: setPushEnabled },
    { label: 'Order Updates', subtitle: 'Real-time delivery notifications', value: orderUpdates, onChange: setOrderUpdates },
    { label: 'Promotional Emails', subtitle: 'Deals and offers', value: promoEmails, onChange: setPromoEmails },
  ];

  return (
    <ScreenWrapper bg="surface">
      <Header title="Settings" />
      <View style={{ margin: 20 }}>
        <View style={{ backgroundColor: '#FFF', borderRadius: 20, overflow: 'hidden' }}>
          {settings.map((s, i) => (
            <View key={s.label} style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: i < settings.length - 1 ? 1 : 0, borderBottomColor: '#F0F0F0', gap: 12 }}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontWeight: '700', fontSize: 15, color: Colors.empire.black }}>{s.label}</Text>
                <Text style={{ fontSize: 12, color: '#888', marginTop: 1 }}>{s.subtitle}</Text>
              </View>
              <Switch
                value={s.value}
                onValueChange={s.onChange}
                trackColor={{ false: '#E8E8E8', true: Colors.gold[500] }}
                thumbColor={s.value ? Colors.empire.black : '#FFFFFF'}
              />
            </View>
          ))}
        </View>

        <Text style={{ color: '#AAA', fontSize: 13, textAlign: 'center', marginTop: 32, lineHeight: 20 }}>
          App version 1.0.0{'\n'}
          © 2025 Empire Deliveries (Pty) Ltd
        </Text>
      </View>
    </ScreenWrapper>
  );
}
