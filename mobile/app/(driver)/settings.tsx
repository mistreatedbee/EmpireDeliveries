import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, Switch } from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ArrowLeft, Bell, Volume2, Moon } from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import Constants from 'expo-constants';

const SETTINGS_KEY = 'driver_settings';
const DEFAULTS = { pushEnabled: true, deliverySound: true, nightMode: false };
type Settings = typeof DEFAULTS;

export default function DriverSettings() {
  const [settings, setSettings] = useState<Settings>(DEFAULTS);

  useEffect(() => {
    AsyncStorage.getItem(SETTINGS_KEY).then((v) => {
      if (v) setSettings({ ...DEFAULTS, ...JSON.parse(v) });
    });
  }, []);

  const persist = (next: Settings) => {
    setSettings(next);
    void AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(next));
  };

  const toggle = (key: keyof Settings) => persist({ ...settings, [key]: !settings[key] });

  const ITEMS: Array<{ key: keyof Settings; Icon: typeof Bell; label: string; desc: string }> = [
    { key: 'pushEnabled', Icon: Bell, label: 'Push Notifications', desc: 'Order alerts and status updates' },
    { key: 'deliverySound', Icon: Volume2, label: 'New Delivery Sound', desc: 'Audio alert for incoming requests' },
    { key: 'nightMode', Icon: Moon, label: 'Night Mode Reminder', desc: 'Reminder to lower brightness at night' },
  ];

  const version = Constants.expoConfig?.version ?? '1.0.0';

  return (
    <View style={{ flex: 1, backgroundColor: Colors.empire.black }}>
      {/* Header */}
      <View style={{ paddingHorizontal: 20, paddingTop: 56, paddingBottom: 20, flexDirection: 'row', alignItems: 'center', gap: 14 }}>
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <ArrowLeft size={22} color="#fff" />
        </Pressable>
        <Text style={{ color: '#fff', fontSize: 20, fontWeight: '900', flex: 1 }}>Settings</Text>
      </View>

      <ScrollView
        style={{ flex: 1, backgroundColor: Colors.surface[100], borderTopLeftRadius: 28, borderTopRightRadius: 28 }}
        contentContainerStyle={{ padding: 24, paddingBottom: 60 }}
        showsVerticalScrollIndicator={false}
      >
        <Text style={{ fontWeight: '800', color: Colors.empire.black, fontSize: 13, letterSpacing: 1, marginBottom: 12, opacity: 0.5 }}>PREFERENCES</Text>

        <View style={{ backgroundColor: '#fff', borderRadius: 18, borderWidth: 1, borderColor: Colors.surface[200], overflow: 'hidden', marginBottom: 32 }}>
          {ITEMS.map(({ key, Icon, label, desc }, i, arr) => (
            <View
              key={key}
              style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 18, paddingVertical: 16, borderBottomWidth: i < arr.length - 1 ? 1 : 0, borderBottomColor: Colors.surface[100], gap: 14 }}
            >
              <View style={{ width: 38, height: 38, borderRadius: 12, backgroundColor: Colors.surface[100], alignItems: 'center', justifyContent: 'center' }}>
                <Icon size={18} color={Colors.empire.black} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontWeight: '700', color: Colors.empire.black, fontSize: 14 }}>{label}</Text>
                <Text style={{ color: '#aaa', fontSize: 12, marginTop: 2 }}>{desc}</Text>
              </View>
              <Switch
                value={settings[key]}
                onValueChange={() => toggle(key)}
                trackColor={{ false: Colors.surface[200], true: Colors.gold[500] }}
                thumbColor="#fff"
              />
            </View>
          ))}
        </View>

        <Text style={{ textAlign: 'center', color: '#bbb', fontSize: 12 }}>Empire Deliveries v{version}</Text>
      </ScrollView>
    </View>
  );
}
