import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Image,
} from 'react-native';
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

interface DocSlot {
  key: 'idDocument' | 'driversLicense' | 'vehicleRegistration';
  label: string;
  hint: string;
}

const DOC_SLOTS: DocSlot[] = [
  { key: 'idDocument', label: 'ID Document', hint: 'South African ID or passport' },
  { key: 'driversLicense', label: "Driver's License", hint: 'Front side clearly visible' },
  { key: 'vehicleRegistration', label: 'Vehicle Registration', hint: 'Current registration disc or paper' },
];

export default function DriverStep4() {
  const params = useLocalSearchParams<Record<string, string>>();
  const { token } = useAuthStore();
  const { showToast } = useUIStore();

  const [docs, setDocs] = useState<Record<string, { localUri: string; mimeType: string; remoteUrl: string } | null>>({
    idDocument: null,
    driversLicense: null,
    vehicleRegistration: null,
  });
  const [uploading, setUploading] = useState<Record<string, boolean>>({
    idDocument: false,
    driversLicense: false,
    vehicleRegistration: false,
  });

  const allUploaded = DOC_SLOTS.every((s) => docs[s.key]?.remoteUrl);

  const pickAndUpload = async (key: string) => {
    const picked = await pickDocumentOrImage();
    if (!picked) return;

    setUploading((u) => ({ ...u, [key]: true }));
    try {
      const remoteUrl = await uploadFile(picked, 'driver-documents');
      setDocs((d) => ({ ...d, [key]: { localUri: picked.uri, mimeType: picked.mimeType, remoteUrl } }));
    } catch {
      showToast('Failed to upload document. Please try again.', 'error');
    } finally {
      setUploading((u) => ({ ...u, [key]: false }));
    }
  };

  const submitMutation = useMutation({
    mutationFn: () => {
      if (!token) throw new Error('Session expired. Please log in again.');
      return applicationsService.submitDriverApplication({
        idNumber: params.idNumber,
        vehicleType: params.vehicleType,
        vehicleMake: params.vehicleMake,
        vehicleModel: params.vehicleModel,
        vehicleYear: params.vehicleYear,
        vehicleReg: params.vehicleReg,
        bankName: params.bankName,
        bankAccountNo: params.bankAccountNo,
        bankHolder: params.bankHolder,
        ...(docs.idDocument?.remoteUrl ? { idDocumentUrl: docs.idDocument.remoteUrl } : {}),
        ...(docs.driversLicense?.remoteUrl ? { driversLicenseUrl: docs.driversLicense.remoteUrl } : {}),
        ...(docs.vehicleRegistration?.remoteUrl
          ? { vehicleRegistrationUrl: docs.vehicleRegistration.remoteUrl }
          : {}),
      });
    },
    onSuccess: () => router.replace('/(auth)/pending-approval'),
    onError: (error: any) => showToast(error.message ?? 'Submission failed. Please try again.', 'error'),
  });

  const handleSubmit = () => {
    if (!allUploaded) {
      showToast('Please upload all required documents before submitting.', 'error');
      return;
    }
    if (!token) {
      showToast('Session expired. Please verify your phone number first.', 'error');
      router.back();
      return;
    }
    submitMutation.mutate();
  };

  return (
    <View style={{ flex: 1, backgroundColor: T.bg }}>
      <StepHeader current={4} total={4} title="Document Upload" />
      <ScrollView contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 80 }}>
        <Text style={{ fontFamily: Fonts.body, color: T.textSec, fontSize: 14, marginBottom: 28 }}>
          Upload a clear photo or PDF of each required document to complete your application.
        </Text>

        {DOC_SLOTS.map(({ key, label, hint }) => {
          const doc = docs[key];
          const isUploading = uploading[key];

          return (
            <Pressable
              key={key}
              onPress={() => !isUploading && pickAndUpload(key)}
              style={{
                backgroundColor: T.surface,
                borderRadius: 16,
                borderWidth: 1.5,
                borderColor: doc?.remoteUrl ? T.success : T.border,
                marginBottom: 16,
                overflow: 'hidden',
                ...Shadows.sm,
              }}
            >
              {doc?.localUri ? (
                <View>
                  {doc.mimeType.startsWith('image/') ? (
                    <Image
                      source={{ uri: doc.localUri }}
                      style={{ width: '100%', height: 140, resizeMode: 'cover' }}
                    />
                  ) : (
                    <View style={{ width: '100%', height: 80, backgroundColor: T.surface2, alignItems: 'center', justifyContent: 'center' }}>
                      <FileText size={28} color={T.textTer} />
                    </View>
                  )}
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      padding: 12,
                      gap: 8,
                    }}
                  >
                    {isUploading ? (
                      <>
                        <ActivityIndicator size="small" color={T.gold} />
                        <Text style={{ fontFamily: Fonts.bodySemibold, color: T.gold, fontSize: 13 }}>
                          Uploading…
                        </Text>
                      </>
                    ) : (
                      <>
                        <CheckCircle size={18} color={T.success} />
                        <View style={{ flex: 1 }}>
                          <Text style={{ fontFamily: Fonts.bodyBold, color: T.text, fontSize: 14 }}>{label}</Text>
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
                    {isUploading ? (
                      <ActivityIndicator size="small" color={T.gold} />
                    ) : (
                      <Upload size={22} color={T.textTer} />
                    )}
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontFamily: Fonts.bodyBold, color: T.text, fontSize: 15 }}>{label}</Text>
                    <Text style={{ fontFamily: Fonts.body, color: T.textSec, fontSize: 12, marginTop: 2 }}>{hint}</Text>
                  </View>
                  <Text style={{ fontFamily: Fonts.bodyBold, color: T.gold, fontSize: 13 }}>Upload</Text>
                </View>
              )}
            </Pressable>
          );
        })}

        {!allUploaded && (
          <Text style={{ fontFamily: Fonts.body, color: T.textTer, fontSize: 12, textAlign: 'center', marginBottom: 16 }}>
            All 3 documents must be uploaded before submitting.
          </Text>
        )}

        <Button
          onPress={handleSubmit}
          loading={submitMutation.isPending}
          disabled={!allUploaded}
          size="lg"
          style={{ marginTop: 8 }}
        >
          Submit Application
        </Button>
      </ScrollView>
    </View>
  );
}
