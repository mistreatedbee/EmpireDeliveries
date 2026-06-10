import React, { useState } from 'react';
import { View, Text, Switch } from 'react-native';
import { ScreenWrapper } from '@/components/layout/ScreenWrapper';
import { Header } from '@/components/layout/Header';
import { T } from '@/constants/colors';

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
    <ScreenWrapper bg="white">
      <Header title="Settings" />
      <View style={{ margin: 16 }}>
        <View style={{ backgroundColor: T.bg, borderRadius: 12, overflow: 'hidden', borderWidth: 1, borderColor: T.border }}>
          {settings.map((s, i) => (
            <View key={s.label} style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: i < settings.length - 1 ? 1 : 0, borderBottomColor: T.border, gap: 12 }}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontWeight: '700', fontSize: 15, color: T.text }}>{s.label}</Text>
                <Text style={{ fontSize: 12, color: T.textSec, marginTop: 1 }}>{s.subtitle}</Text>
              </View>
              <Switch
                value={s.value}
                onValueChange={s.onChange}
                trackColor={{ false: T.border, true: T.action }}
                thumbColor="#FFFFFF"
              />
            </View>
          ))}
        </View>

        <Text style={{ color: T.textTer, fontSize: 13, textAlign: 'center', marginTop: 32, lineHeight: 20 }}>
          App version 1.0.0{'\n'}
          © 2025 Empire Deliveries (Pty) Ltd
        </Text>
      </View>
    </ScreenWrapper>
  );
}
