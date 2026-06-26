import React, { useState, useEffect } from 'react';
import { View, Text, Switch } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScreenWrapper } from '@/components/layout/ScreenWrapper';
import { Header } from '@/components/layout/Header';
import { T } from '@/constants/colors';

const SETTINGS_KEY = 'empire_settings';

export default function SettingsScreen() {
  const [pushEnabled, setPushEnabled] = useState(true);
  const [promoEmails, setPromoEmails] = useState(false);
  const [orderUpdates, setOrderUpdates] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem(SETTINGS_KEY).then((raw) => {
      if (!raw) return;
      try {
        const saved = JSON.parse(raw);
        if (typeof saved.pushEnabled === 'boolean') setPushEnabled(saved.pushEnabled);
        if (typeof saved.promoEmails === 'boolean') setPromoEmails(saved.promoEmails);
        if (typeof saved.orderUpdates === 'boolean') setOrderUpdates(saved.orderUpdates);
      } catch {}
    });
  }, []);

  const persist = (next: { pushEnabled: boolean; promoEmails: boolean; orderUpdates: boolean }) => {
    AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(next));
  };

  const settings = [
    {
      label: 'Push Notifications',
      subtitle: 'Order updates and alerts',
      value: pushEnabled,
      onChange: (v: boolean) => {
        setPushEnabled(v);
        persist({ pushEnabled: v, promoEmails, orderUpdates });
      },
    },
    {
      label: 'Order Updates',
      subtitle: 'Real-time delivery notifications',
      value: orderUpdates,
      onChange: (v: boolean) => {
        setOrderUpdates(v);
        persist({ pushEnabled, promoEmails, orderUpdates: v });
      },
    },
    {
      label: 'Promotional Emails',
      subtitle: 'Deals and offers',
      value: promoEmails,
      onChange: (v: boolean) => {
        setPromoEmails(v);
        persist({ pushEnabled, promoEmails: v, orderUpdates });
      },
    },
  ];

  return (
    <ScreenWrapper bg="white">
      <Header title="Settings" />
      <View style={{ margin: 16 }}>
        <View style={{ backgroundColor: T.bg, borderRadius: 12, overflow: 'hidden', borderWidth: 1, borderColor: T.border }}>
          {settings.map((s, i) => (
            <View
              key={s.label}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: 16,
                paddingVertical: 14,
                borderBottomWidth: i < settings.length - 1 ? 1 : 0,
                borderBottomColor: T.border,
                gap: 12,
              }}
            >
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
