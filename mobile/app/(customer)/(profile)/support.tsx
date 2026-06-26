import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, Linking } from 'react-native';
import { router } from 'expo-router';
import { ArrowLeft, Phone, Mail, ChevronDown, ChevronUp } from 'lucide-react-native';
import { ScreenWrapper } from '@/components/layout/ScreenWrapper';
import { T } from '@/constants/colors';

const CONTACT = [
  { Icon: Phone, label: 'Call Support', value: '+27 10 000 0000', url: 'tel:+27100000000' },
  { Icon: Mail, label: 'Email Support', value: 'support@empiredeliveries.co.za', url: 'mailto:support@empiredeliveries.co.za' },
];

const FAQ: Array<{ q: string; a: string }> = [
  {
    q: 'Where is my order?',
    a: 'Once your order is picked up by a driver you can track it in real time from the Orders tab. The driver\'s location updates every few seconds.',
  },
  {
    q: 'How do I cancel an order?',
    a: 'You can cancel an order from the Orders tab as long as it has not yet been picked up by a driver. Tap the order and select "Cancel Order". Once a driver has picked it up, cancellation is no longer available.',
  },
  {
    q: 'How are refunds handled?',
    a: 'Refunds for cancelled orders paid via card or Ozow are processed within 3–5 business days back to your original payment method. Wallet payments are refunded immediately to your Empire Wallet.',
  },
  {
    q: 'My order arrived wrong or missing items — what do I do?',
    a: 'Please contact us within 24 hours of delivery via the email or phone number above. Include your order number and a description of the issue. We\'ll resolve it as quickly as possible.',
  },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <Pressable
      onPress={() => setOpen((v) => !v)}
      style={{ borderBottomWidth: 1, borderBottomColor: T.border }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 16, gap: 10 }}>
        <Text style={{ flex: 1, fontWeight: '700', color: T.text, fontSize: 14 }}>{q}</Text>
        {open ? <ChevronUp size={16} color={T.textTer} /> : <ChevronDown size={16} color={T.textTer} />}
      </View>
      {open && (
        <Text style={{ paddingHorizontal: 16, paddingBottom: 16, color: T.textSec, fontSize: 13, lineHeight: 20 }}>{a}</Text>
      )}
    </Pressable>
  );
}

export default function CustomerSupport() {
  return (
    <ScreenWrapper bg="white">
      {/* Header */}
      <View style={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 16, flexDirection: 'row', alignItems: 'center', gap: 14, borderBottomWidth: 1, borderBottomColor: T.border }}>
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <ArrowLeft size={22} color={T.text} />
        </Pressable>
        <Text style={{ color: T.text, fontSize: 20, fontWeight: '900', flex: 1 }}>Help & Support</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 60 }} showsVerticalScrollIndicator={false}>
        <Text style={{ color: T.textSec, fontSize: 14, lineHeight: 22, marginBottom: 24 }}>
          Our support team is available <Text style={{ fontWeight: '700', color: T.text }}>7 days a week, 7am–10pm</Text>. Reach us via call or email below.
        </Text>

        {/* Contact cards */}
        <Text style={{ fontWeight: '800', color: T.text, fontSize: 12, letterSpacing: 1, marginBottom: 10, opacity: 0.5 }}>CONTACT US</Text>
        <View style={{ backgroundColor: T.bg, borderRadius: 14, borderWidth: 1, borderColor: T.border, overflow: 'hidden', marginBottom: 28 }}>
          {CONTACT.map(({ Icon, label, value, url }, i, arr) => (
            <Pressable
              key={label}
              onPress={() => Linking.openURL(url)}
              style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 16, borderBottomWidth: i < arr.length - 1 ? 1 : 0, borderBottomColor: T.border, gap: 14 }}
            >
              <View style={{ width: 38, height: 38, borderRadius: 10, backgroundColor: T.surface, alignItems: 'center', justifyContent: 'center' }}>
                <Icon size={18} color={T.textSec} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontWeight: '700', color: T.text, fontSize: 14 }}>{label}</Text>
                <Text style={{ color: T.action, fontSize: 13, marginTop: 2 }}>{value}</Text>
              </View>
            </Pressable>
          ))}
        </View>

        {/* FAQ */}
        <Text style={{ fontWeight: '800', color: T.text, fontSize: 12, letterSpacing: 1, marginBottom: 10, opacity: 0.5 }}>FAQ</Text>
        <View style={{ backgroundColor: T.bg, borderRadius: 14, borderWidth: 1, borderColor: T.border, overflow: 'hidden' }}>
          {FAQ.map((item) => (
            <FaqItem key={item.q} {...item} />
          ))}
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}
