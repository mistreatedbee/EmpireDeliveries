import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, TextInput, ActivityIndicator, Alert } from 'react-native';
import { router } from 'expo-router';
import { useMutation } from '@tanstack/react-query';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react-native';
import { userService } from '@/services/user.service';
import { Colors } from '@/constants/colors';

export default function RestaurantChangePassword() {
  const [form, setForm] = useState({ current: '', next: '', confirm: '' });
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNext, setShowNext] = useState(false);
  const [error, setError] = useState('');

  const update = (k: keyof typeof form) => (v: string) => {
    setForm((f) => ({ ...f, [k]: v }));
    setError('');
  };

  const mutation = useMutation({
    mutationFn: () => userService.changePassword(form.current, form.next),
    onSuccess: () => {
      Alert.alert('Success', 'Password changed successfully.');
      router.back();
    },
    onError: (err: { message?: string }) => {
      const msg = err.message ?? 'Failed to change password.';
      setError(msg);
    },
  });

  const handleSubmit = () => {
    if (!form.current || !form.next || !form.confirm) { setError('All fields are required.'); return; }
    if (form.next.length < 8) { setError('New password must be at least 8 characters.'); return; }
    if (form.next !== form.confirm) { setError('New passwords do not match.'); return; }
    mutation.mutate();
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.empire.black }}>
      <View style={{ paddingHorizontal: 20, paddingTop: 56, paddingBottom: 16, flexDirection: 'row', alignItems: 'center', gap: 14 }}>
        <Pressable onPress={() => router.back()}>
          <ArrowLeft size={22} color="#fff" />
        </Pressable>
        <Text style={{ color: '#fff', fontSize: 20, fontWeight: '900' }}>Change Password</Text>
      </View>

      <ScrollView
        style={{ flex: 1, backgroundColor: Colors.surface[100], borderTopLeftRadius: 24, borderTopRightRadius: 24 }}
        contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {[
          { label: 'Current Password', key: 'current' as const, secure: !showCurrent, toggle: () => setShowCurrent((v) => !v), showToggle: showCurrent },
          { label: 'New Password', key: 'next' as const, secure: !showNext, toggle: () => setShowNext((v) => !v), showToggle: showNext },
          { label: 'Confirm New Password', key: 'confirm' as const, secure: true },
        ].map(({ label, key, secure, toggle, showToggle }) => (
          <View key={key} style={{ marginBottom: 16 }}>
            <Text style={{ fontWeight: '700', color: Colors.empire.black, marginBottom: 6 }}>{label}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 14, borderWidth: 1, borderColor: Colors.surface[200] }}>
              <TextInput
                value={form[key]}
                onChangeText={update(key)}
                secureTextEntry={secure}
                autoCapitalize="none"
                style={{ flex: 1, paddingHorizontal: 14, paddingVertical: 12, fontSize: 14, color: Colors.empire.black }}
              />
              {toggle && (
                <Pressable onPress={toggle} style={{ paddingHorizontal: 14 }}>
                  {showToggle ? <EyeOff size={18} color="#aaa" /> : <Eye size={18} color="#aaa" />}
                </Pressable>
              )}
            </View>
          </View>
        ))}

        {error ? (
          <Text style={{ color: Colors.empire.error, fontSize: 13, marginBottom: 16, marginTop: -4 }}>{error}</Text>
        ) : null}

        <Pressable
          onPress={handleSubmit}
          disabled={mutation.isPending}
          style={{ backgroundColor: Colors.gold[500], borderRadius: 16, paddingVertical: 16, alignItems: 'center', marginTop: 8 }}
        >
          {mutation.isPending
            ? <ActivityIndicator color={Colors.empire.black} />
            : <Text style={{ color: Colors.empire.black, fontWeight: '900', fontSize: 16 }}>Change Password</Text>}
        </Pressable>
      </ScrollView>
    </View>
  );
}
