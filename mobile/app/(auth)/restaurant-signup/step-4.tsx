import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator, Image } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, CheckCircle, Upload, FileText } from 'lucide-react-native';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@/components/empire';
import { applicationsService } from '@/services/admin.service';
import { useAuthStore } from '@/stores/authStore';
import { useUIStore } from '@/stores/uiStore';
import { T, Fonts, Shadows } from '@/constants/colors';
import { pickDocumentOrImage, uploadFile } from '@/utils/documentUpload';

function StepHeader({ current, total, title }: { current: number; total: number; title: string }) {
  return (
    <View style={{ paddingHorizontal: 24, paddingTop: 56, paddingBottom: 20 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <ArrowLeft size={22} color={T.text} />
        </Pressable>
        <View style={{ flex: 1, flexDirection: 'row', gap: 4 }}>
          {Array.from({ length: total }).map((_, i) => (
            <View
              key={i}
              style={{ flex: 1, height: 3, borderRadius: 2, backgroundColor: i < current ? T.gold : T.border }}
            />
          ))}
        </View>
        <Text style={{ fontFamily: Fonts.bodyBold, color: T.textTer, fontSize: 12 }}>
          {current}/{total}
        </Text>
      </View>
      <Text style={{ fontFamily: Fonts.headingExtra, color: T.text, fontSize: 24 }}>{title}</Text>
    </View>
  );
}

export default function RestaurantStep4() {
  const params = useLocalSearchParams<Record<string, string>>();
  const { token } = useAuthStore();
  const { showToast } = useUIStore();

  const [doc, setDoc] = useState<{ localUri: string; mimeType: string; remoteUrl: string } | null>(null);
  const [uploading, setUploading] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const pickAndUpload = async () => {
    const picked = await pickDocumentOrImage();
    if (!picked) return;

    setUploading(true);
    try {
      const remoteUrl = await uploadFile(picked, 'restaurant-documents');
      setDoc({ localUri: picked.uri, mimeType: picked.mimeType, remoteUrl });
    } catch {
      showToast('Failed to upload document. Please try again.', 'error');
    } finally {
      setUploading(false);
    }
  };

  const submitMutation = useMutation({
    mutationFn: () => {
      if (!token) throw new Error('Session expired. Please log in again.');
      return applicationsService.submitRestaurantApplication({
        tradingName: params.tradingName ?? '',
        businessRegNo: undefined,
        cuisineType: params.cuisineType,
        address: params.address,
        city: undefined,
        description: params.description,
        operatingHours: params.operatingHours,
        minOrder: params.minOrder,
        deliveryFee: params.deliveryFee,
        deliveryRadius: params.deliveryRadius,
        bankName: params.bankName,
        bankAccountNo: params.bankAccountNo,
        bankHolder: params.bankHolder,
        ...(doc?.remoteUrl ? { businessDocUrl: doc.remoteUrl } : {}),
      });
    },
    onSuccess: () => router.replace('/(auth)/pending-approval'),
    onError: (error: any) => showToast(error.message ?? 'Submission failed. Please try again.', 'error'),
  });

  const handleSubmit = () => {
    if (!termsAccepted) {
      showToast('Please accept the terms and conditions to continue.', 'error');
      return;
    }
    if (!token) {
      showToast('Session expired. Please complete OTP verification first.', 'error');
      router.back();
      return;
    }
    submitMutation.mutate();
  };

  return (
    <View style={{ flex: 1, backgroundColor: T.bg }}>
      <StepHeader current={4} total={4} title="Documents & Submit" />
      <ScrollView contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 80 }}>
        <Text style={{ fontFamily: Fonts.body, color: T.textSec, fontSize: 14, marginBottom: 24 }}>
          Upload your business registration certificate (photo or PDF) to complete your application.
        </Text>

        <Pressable
          onPress={() => !uploading && pickAndUpload()}
          style={{
            backgroundColor: T.surface,
            borderRadius: 16,
            borderWidth: 1.5,
            borderColor: doc?.remoteUrl ? T.success : T.border,
            marginBottom: 24,
            overflow: 'hidden',
            ...Shadows.sm,
          }}
        >
          {doc?.localUri ? (
            <View>
              {doc.mimeType.startsWith('image/') ? (
                <Image source={{ uri: doc.localUri }} style={{ width: '100%', height: 140, resizeMode: 'cover' }} />
              ) : (
                <View style={{ width: '100%', height: 80, backgroundColor: T.surface2, alignItems: 'center', justifyContent: 'center' }}>
                  <FileText size={28} color={T.textTer} />
                </View>
              )}
              <View style={{ flexDirection: 'row', alignItems: 'center', padding: 12, gap: 8 }}>
                {uploading ? (
                  <>
                    <ActivityIndicator size="small" color={T.gold} />
                    <Text style={{ fontFamily: Fonts.bodySemibold, color: T.gold, fontSize: 13 }}>Uploading…</Text>
                  </>
                ) : (
                  <>
                    <CheckCircle size={18} color={T.success} />
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontFamily: Fonts.bodyBold, color: T.text, fontSize: 14 }}>Business Registration</Text>
                      <Text style={{ fontFamily: Fonts.body, color: T.success, fontSize: 12, marginTop: 1 }}>Uploaded successfully</Text>
                    </View>
                    <Text style={{ fontFamily: Fonts.bodySemibold, color: T.gold, fontSize: 12 }}>Change</Text>
                  </>
                )}
              </View>
            </View>
          ) : (
            <View style={{ padding: 20, flexDirection: 'row', alignItems: 'center', gap: 16 }}>
              <View
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 12,
                  backgroundColor: T.surface2,
                  borderWidth: 1.5,
                  borderStyle: 'dashed',
                  borderColor: T.border,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {uploading ? <ActivityIndicator size="small" color={T.gold} /> : <Upload size={22} color={T.textTer} />}
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontFamily: Fonts.bodyBold, color: T.text, fontSize: 15 }}>Business Registration</Text>
                <Text style={{ fontFamily: Fonts.body, color: T.textSec, fontSize: 12, marginTop: 2 }}>
                  Certificate or trading license
                </Text>
              </View>
              <Text style={{ fontFamily: Fonts.bodyBold, color: T.gold, fontSize: 13 }}>Upload</Text>
            </View>
          )}
        </Pressable>

        {/* Summary */}
        <View
          style={{
            backgroundColor: T.surface,
            borderRadius: 14,
            borderWidth: 1,
            borderColor: T.border,
            padding: 16,
            marginBottom: 24,
            ...Shadows.sm,
          }}
        >
          <Text style={{ fontFamily: Fonts.bodyBold, color: T.gold, fontSize: 12, letterSpacing: 1, marginBottom: 10 }}>
            APPLICATION SUMMARY
          </Text>
          {[
            { label: 'Trading Name', value: params.tradingName },
            { label: 'Cuisine', value: params.cuisineType },
            { label: 'Address', value: params.address },
            { label: 'Min Order', value: params.minOrder ? `R${params.minOrder}` : undefined },
            { label: 'Delivery Fee', value: params.deliveryFee ? `R${params.deliveryFee}` : undefined },
            { label: 'Delivery Radius', value: params.deliveryRadius ? `${params.deliveryRadius} km` : undefined },
            { label: 'Bank', value: params.bankName },
          ].map(({ label, value }) => (
            <View key={label} style={{ flexDirection: 'row', paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: T.border }}>
              <Text style={{ fontFamily: Fonts.body, color: T.textSec, fontSize: 13, width: 110 }}>{label}</Text>
              <Text style={{ fontFamily: Fonts.bodySemibold, color: T.text, fontSize: 13, flex: 1 }}>{value || '—'}</Text>
            </View>
          ))}
        </View>

        {/* Terms */}
        <Pressable
          onPress={() => setTermsAccepted((v) => !v)}
          style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 28 }}
        >
          <View
            style={{
              width: 22,
              height: 22,
              borderRadius: 6,
              borderWidth: 2,
              borderColor: termsAccepted ? T.gold : T.border,
              backgroundColor: termsAccepted ? T.goldBg : 'transparent',
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: 1,
            }}
          >
            {termsAccepted && <CheckCircle size={14} color={T.goldDeep} />}
          </View>
          <Text style={{ fontFamily: Fonts.body, color: T.textSec, fontSize: 13, lineHeight: 20, flex: 1 }}>
            I agree to the{' '}
            <Text style={{ fontFamily: Fonts.bodyBold, color: T.gold }}>Terms & Conditions</Text>
            {' '}and the{' '}
            <Text style={{ fontFamily: Fonts.bodyBold, color: T.gold }}>Merchant Policy</Text>.
          </Text>
        </Pressable>

        <Button onPress={handleSubmit} loading={submitMutation.isPending} size="lg" style={{ marginTop: 8 }}>
          Submit Application
        </Button>
      </ScrollView>
    </View>
  );
}
