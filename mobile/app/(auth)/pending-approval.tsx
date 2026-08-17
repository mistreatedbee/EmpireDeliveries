import React from 'react';
import { View, Text, Pressable, Linking, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { Clock, CheckCircle2, XCircle, Phone, LogOut } from 'lucide-react-native';
import { applicationsService } from '@/services/admin.service';
import { useAuthStore } from '@/stores/authStore';
import { T, Fonts, Shadows } from '@/constants/colors';

const STATUS_META: Record<string, { title: string; body: string; color: string; bg: string; Icon: typeof Clock }> = {
  pending: {
    title: 'Application Under Review',
    body: "Our team is reviewing your application. This typically takes 24–48 hours. You'll receive a push notification as soon as a decision is made.",
    color: T.gold,
    bg: T.goldBg,
    Icon: Clock,
  },
  approved: {
    title: 'Application Approved',
    body: 'Your driver application has been approved. Log out and back in to start delivering.',
    color: T.success,
    bg: '#E8F5E9',
    Icon: CheckCircle2,
  },
  rejected: {
    title: 'Application Not Approved',
    body: '',
    color: T.danger,
    bg: '#FFEBEE',
    Icon: XCircle,
  },
};

export default function PendingApprovalScreen() {
  const { clearAuth } = useAuthStore();

  const { data, isLoading } = useQuery({
    queryKey: ['applications', 'me'],
    queryFn: applicationsService.getMyApplication,
    refetchInterval: 15000,
  });

  const app = data?.driverApplication;
  const status = app?.status ?? 'pending';
  const meta = STATUS_META[status];

  const handleSignOut = async () => {
    await clearAuth();
    router.replace('/(auth)/login');
  };

  return (
    <View style={{ flex: 1, backgroundColor: T.bg, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 }}>
      {isLoading ? (
        <ActivityIndicator color={T.gold} />
      ) : (
        <>
          <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: meta.bg, alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
            <meta.Icon size={40} color={meta.color} />
          </View>

          <Text style={{ fontFamily: Fonts.headingExtra, color: T.text, fontSize: 26, textAlign: 'center', marginBottom: 12 }}>
            {meta.title}
          </Text>

          {status === 'pending' && (
            <Text style={{ fontFamily: Fonts.body, color: T.textSec, fontSize: 15, textAlign: 'center', lineHeight: 24, marginBottom: 40 }}>
              Our team is reviewing your application. This typically takes{' '}
              <Text style={{ fontFamily: Fonts.bodyBold, color: T.gold }}>24–48 hours</Text>.
              {'\n\n'}
              You'll receive a push notification as soon as a decision is made.
            </Text>
          )}

          {status === 'approved' && (
            <Text style={{ fontFamily: Fonts.body, color: T.textSec, fontSize: 15, textAlign: 'center', lineHeight: 24, marginBottom: 40 }}>
              {meta.body}
            </Text>
          )}

          {status === 'rejected' && (
            <View style={{ backgroundColor: '#FFEBEE', borderRadius: 16, padding: 16, marginBottom: 24, width: '100%' }}>
              <Text style={{ fontFamily: Fonts.bodyBold, color: T.danger, fontSize: 13, marginBottom: 6 }}>
                Reason for rejection
              </Text>
              <Text style={{ fontFamily: Fonts.body, color: '#7a1f1f', fontSize: 14, lineHeight: 21 }}>
                {app?.rejectionReason || 'No reason was provided. Please contact support for more details.'}
              </Text>
            </View>
          )}

          {status === 'rejected' && (
            <Pressable
              onPress={() => router.push('/(auth)/driver-signup/step-1' as any)}
              style={{ backgroundColor: T.gold, borderRadius: 14, paddingVertical: 16, alignItems: 'center', width: '100%', marginBottom: 14 }}
            >
              <Text style={{ fontFamily: Fonts.bodyBold, color: T.text, fontSize: 15 }}>Resubmit Application</Text>
            </Pressable>
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
        </>
      )}
    </View>
  );
}
