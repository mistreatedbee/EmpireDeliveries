import React from 'react';
import { View, Text, Pressable, Linking } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { ShieldOff, Phone, LogOut } from 'lucide-react-native';
import { useAuthStore } from '@/stores/authStore';
import { T, Fonts, Shadows } from '@/constants/colors';

export default function SuspendedScreen() {
  const { reason } = useLocalSearchParams<{ reason?: string }>();
  const { clearAuth } = useAuthStore();

  const handleSignOut = async () => {
    await clearAuth();
    router.replace('/(auth)/login');
  };

  return (
    <View style={{ flex: 1, backgroundColor: T.bg, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 }}>
      <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: T.dangerBg, alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
        <ShieldOff size={40} color={T.danger} />
      </View>

      <Text style={{ fontFamily: Fonts.headingExtra, color: T.text, fontSize: 26, textAlign: 'center', marginBottom: 12 }}>
        Account Suspended
      </Text>
      <Text style={{ fontFamily: Fonts.body, color: T.textSec, fontSize: 15, textAlign: 'center', lineHeight: 24, marginBottom: reason ? 16 : 40 }}>
        Your account has been suspended. Please contact our support team for assistance.
      </Text>

      {!!reason && (
        <View style={{ backgroundColor: T.dangerBg, borderRadius: 12, padding: 14, marginBottom: 32, width: '100%', borderWidth: 1, borderColor: T.danger }}>
          <Text style={{ fontFamily: Fonts.bodyBold, color: T.danger, fontSize: 12, marginBottom: 4 }}>REASON</Text>
          <Text style={{ fontFamily: Fonts.body, color: T.textSec, fontSize: 13, lineHeight: 20 }}>{reason}</Text>
        </View>
      )}

      <Pressable
        onPress={() => Linking.openURL('tel:+27100000000')}
        style={{ flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: T.surface, borderRadius: 14, paddingHorizontal: 20, paddingVertical: 14, marginBottom: 14, borderWidth: 1, borderColor: T.border, width: '100%', justifyContent: 'center', ...Shadows.sm }}
      >
        <Phone size={18} color={T.gold} />
        <Text style={{ fontFamily: Fonts.bodyBold, color: T.text, fontSize: 15 }}>Contact Support</Text>
      </Pressable>

      <Pressable
        onPress={handleSignOut}
        style={{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 12 }}
      >
        <LogOut size={16} color={T.textTer} />
        <Text style={{ fontFamily: Fonts.bodySemibold, color: T.textTer }}>Sign Out</Text>
      </Pressable>
    </View>
  );
}
