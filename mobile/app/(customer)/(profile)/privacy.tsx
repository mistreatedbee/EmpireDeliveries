import React from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { router } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { ScreenWrapper } from '@/components/layout/ScreenWrapper';
import { T } from '@/constants/colors';

const SECTIONS = [
  {
    title: '1. Information We Collect',
    body: 'We collect information you provide when creating an account (name, email, phone number), delivery addresses, order history, payment method details (processed securely by our payment partners), and location data when you use the app to track deliveries or find nearby restaurants.',
  },
  {
    title: '2. How We Use Your Information',
    body: 'We use your information to process and deliver orders, send order status updates and push notifications, improve the app experience, provide customer support, and comply with legal obligations. We do not sell your personal information to third parties.',
  },
  {
    title: '3. Sharing Your Information',
    body: 'We share necessary information with restaurants (your name and order details), drivers (your name, phone number, and delivery address), and payment processors (PayFast, Ozow, Peach Payments) solely to fulfil your orders. All partners are contractually bound to protect your data.',
  },
  {
    title: '4. Location Data',
    body: 'Location access is requested when you browse restaurants, track your delivery, or when you are active as a driver. We do not collect background location data outside of active deliveries. You can revoke location permissions at any time in your device settings.',
  },
  {
    title: '5. Data Retention',
    body: 'We retain your account data for as long as your account is active. Order history is retained for 7 years for tax and accounting purposes. You may request deletion of your account and personal data by contacting support@empiredeliveries.co.za.',
  },
  {
    title: '6. Security',
    body: 'We use industry-standard encryption (TLS) for all data in transit. Passwords are hashed using bcrypt and are never stored in plain text. Payment card details are never stored on Empire Deliveries servers — they are handled directly by our certified payment partners.',
  },
  {
    title: '7. Your Rights',
    body: 'Under the Protection of Personal Information Act (POPIA), you have the right to access, correct, or delete your personal information. To exercise these rights, contact us at support@empiredeliveries.co.za.',
  },
  {
    title: '8. Contact',
    body: 'Empire Deliveries (Pty) Ltd\nEmail: support@empiredeliveries.co.za\nPhone: +27 10 000 0000\n\nLast updated: June 2026',
  },
];

export default function PrivacyPolicy() {
  return (
    <ScreenWrapper bg="white">
      {/* Header */}
      <View style={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 16, flexDirection: 'row', alignItems: 'center', gap: 14, borderBottomWidth: 1, borderBottomColor: T.border }}>
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <ArrowLeft size={22} color={T.text} />
        </Pressable>
        <Text style={{ color: T.text, fontSize: 20, fontWeight: '900', flex: 1 }}>Privacy Policy</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 60 }} showsVerticalScrollIndicator={false}>
        <Text style={{ color: T.textSec, fontSize: 13, lineHeight: 20, marginBottom: 24 }}>
          This Privacy Policy explains how Empire Deliveries collects, uses, and protects your personal information when you use our app.
        </Text>

        {SECTIONS.map((section) => (
          <View key={section.title} style={{ marginBottom: 22 }}>
            <Text style={{ fontWeight: '800', color: T.text, fontSize: 15, marginBottom: 8 }}>{section.title}</Text>
            <Text style={{ color: T.textSec, fontSize: 13, lineHeight: 21 }}>{section.body}</Text>
          </View>
        ))}
      </ScrollView>
    </ScreenWrapper>
  );
}
