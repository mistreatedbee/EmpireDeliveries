import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, Linking } from 'react-native';
import { router } from 'expo-router';
import { ArrowLeft, Phone, Mail, ChevronDown, ChevronUp } from 'lucide-react-native';
import { Colors } from '@/constants/colors';

const CONTACT = [
  { Icon: Phone, label: 'Call Support', value: '+27 10 000 0000', url: 'tel:+27100000000' },
  { Icon: Mail, label: 'Email Support', value: 'support@empiredeliveries.co.za', url: 'mailto:support@empiredeliveries.co.za' },
];

const FAQ: Array<{ q: string; a: string }> = [
  {
    q: 'How are payouts calculated?',
    a: 'You earn a base delivery fee per order plus distance bonuses. Your wallet updates after each completed delivery. Payouts to your bank account are processed within 2–3 business days.',
  },
  {
    q: 'What do I do if a customer is unreachable?',
    a: 'Wait at the delivery address for at least 5 minutes, attempt to call the customer through the app, then contact driver support. Do not leave the order unattended.',
  },
  {
    q: 'How do I report an incident or accident?',
    a: 'Call our support line immediately. We will guide you through the incident report process and connect you with the relevant parties.',
  },
  {
    q: 'Why was my withdrawal declined?',
    a: 'Withdrawals require at least R50 balance. Ensure your bank account details are correct in your profile. If details are correct and the issue persists, contact support.',
  },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <Pressable
      onPress={() => setOpen((v) => !v)}
      style={{ borderBottomWidth: 1, borderBottomColor: Colors.surface[100] }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 18, paddingVertical: 16, gap: 10 }}>
        <Text style={{ flex: 1, fontWeight: '700', color: Colors.empire.black, fontSize: 14 }}>{q}</Text>
        {open ? <ChevronUp size={16} color="#aaa" /> : <ChevronDown size={16} color="#aaa" />}
      </View>
      {open && (
        <Text style={{ paddingHorizontal: 18, paddingBottom: 16, color: '#666', fontSize: 13, lineHeight: 20 }}>{a}</Text>
      )}
    </Pressable>
  );
}

export default function DriverSupport() {
  return (
    <View style={{ flex: 1, backgroundColor: Colors.empire.black }}>
      {/* Header */}
      <View style={{ paddingHorizontal: 20, paddingTop: 56, paddingBottom: 20, flexDirection: 'row', alignItems: 'center', gap: 14 }}>
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <ArrowLeft size={22} color="#fff" />
        </Pressable>
        <Text style={{ color: '#fff', fontSize: 20, fontWeight: '900', flex: 1 }}>Support</Text>
      </View>

      <ScrollView
        style={{ flex: 1, backgroundColor: Colors.surface[100], borderTopLeftRadius: 28, borderTopRightRadius: 28 }}
        contentContainerStyle={{ padding: 24, paddingBottom: 60 }}
        showsVerticalScrollIndicator={false}
      >
        <Text style={{ color: Colors.empire.black, fontSize: 15, lineHeight: 22, marginBottom: 24 }}>
          Our driver support team is available <Text style={{ fontWeight: '700' }}>7 days a week, 7am–10pm</Text>. Reach us via call or email below.
        </Text>

        {/* Contact cards */}
        <Text style={{ fontWeight: '800', color: Colors.empire.black, fontSize: 13, letterSpacing: 1, marginBottom: 12, opacity: 0.5 }}>CONTACT US</Text>
        <View style={{ backgroundColor: '#fff', borderRadius: 18, borderWidth: 1, borderColor: Colors.surface[200], overflow: 'hidden', marginBottom: 32 }}>
          {CONTACT.map(({ Icon, label, value, url }, i, arr) => (
            <Pressable
              key={label}
              onPress={() => Linking.openURL(url)}
              style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 18, paddingVertical: 16, borderBottomWidth: i < arr.length - 1 ? 1 : 0, borderBottomColor: Colors.surface[100], gap: 14 }}
            >
              <View style={{ width: 38, height: 38, borderRadius: 12, backgroundColor: Colors.surface[100], alignItems: 'center', justifyContent: 'center' }}>
                <Icon size={18} color={Colors.empire.black} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontWeight: '700', color: Colors.empire.black, fontSize: 14 }}>{label}</Text>
                <Text style={{ color: Colors.gold[500], fontSize: 13, marginTop: 2 }}>{value}</Text>
              </View>
            </Pressable>
          ))}
        </View>

        {/* FAQ */}
        <Text style={{ fontWeight: '800', color: Colors.empire.black, fontSize: 13, letterSpacing: 1, marginBottom: 12, opacity: 0.5 }}>FAQ</Text>
        <View style={{ backgroundColor: '#fff', borderRadius: 18, borderWidth: 1, borderColor: Colors.surface[200], overflow: 'hidden' }}>
          {FAQ.map((item) => (
            <FaqItem key={item.q} {...item} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
