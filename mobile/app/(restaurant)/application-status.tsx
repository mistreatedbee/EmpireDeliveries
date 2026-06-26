import React from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator, Linking } from 'react-native';
import { router } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Clock, CheckCircle2, XCircle, Phone } from 'lucide-react-native';
import { applicationsService } from '@/services/admin.service';
import { Colors } from '@/constants/colors';
import { formatDate } from '@/utils/formatters';

const STATUS_META: Record<string, { label: string; color: string; bg: string; Icon: typeof Clock }> = {
  pending: { label: 'Under Review', color: '#E65100', bg: '#FFF3E0', Icon: Clock },
  approved: { label: 'Approved', color: Colors.empire.success, bg: '#E8F5E9', Icon: CheckCircle2 },
  rejected: { label: 'Rejected', color: Colors.empire.error, bg: '#FFEBEE', Icon: XCircle },
};

export default function RestaurantApplicationStatus() {
  const { data, isLoading } = useQuery({
    queryKey: ['applications', 'me'],
    queryFn: applicationsService.getMyApplication,
  });

  const app = data?.restaurantApplication;
  const meta = STATUS_META[app?.status ?? 'pending'];

  return (
    <View style={{ flex: 1, backgroundColor: Colors.surface[100] }}>
      <View style={{ backgroundColor: Colors.empire.black, paddingHorizontal: 20, paddingTop: 56, paddingBottom: 20, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <Pressable onPress={() => router.back()} style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center' }}>
          <ArrowLeft size={18} color="#fff" />
        </Pressable>
        <Text style={{ color: '#fff', fontSize: 18, fontWeight: '900' }}>Application Status</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 60 }}>
        {isLoading ? (
          <ActivityIndicator color={Colors.gold[500]} style={{ marginTop: 40 }} />
        ) : !app ? (
          <View style={{ backgroundColor: '#fff', borderRadius: 20, padding: 32, alignItems: 'center', borderWidth: 1, borderColor: Colors.surface[200] }}>
            <Text style={{ color: '#888', fontSize: 15, textAlign: 'center' }}>No restaurant application found on your account.</Text>
          </View>
        ) : (
          <>
            <View style={{ backgroundColor: '#fff', borderRadius: 20, padding: 20, borderWidth: 1, borderColor: Colors.surface[200], alignItems: 'center', marginBottom: 16 }}>
              <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: meta.bg, alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
                <meta.Icon size={30} color={meta.color} />
              </View>
              <Text style={{ fontWeight: '900', fontSize: 18, color: Colors.empire.black, marginBottom: 4 }}>{meta.label}</Text>
              {app.tradingName && (
                <Text style={{ color: '#888', fontSize: 13, marginBottom: 8 }}>{app.tradingName}</Text>
              )}
              <Text style={{ color: '#aaa', fontSize: 12 }}>Submitted {formatDate(app.submittedAt)}</Text>
            </View>

            {app.status === 'pending' && (
              <View style={{ backgroundColor: '#fff', borderRadius: 18, padding: 18, borderWidth: 1, borderColor: Colors.surface[200], marginBottom: 16 }}>
                <Text style={{ color: '#666', fontSize: 14, lineHeight: 21 }}>
                  Our team is reviewing your application. This typically takes 24–48 hours. You'll receive a push notification as soon as a decision is made.
                </Text>
              </View>
            )}

            {app.status === 'rejected' && (
              <View style={{ backgroundColor: '#FFEBEE', borderRadius: 18, padding: 18, marginBottom: 16 }}>
                <Text style={{ color: Colors.empire.error, fontWeight: '800', fontSize: 13, marginBottom: 6 }}>Reason for rejection</Text>
                <Text style={{ color: '#7a1f1f', fontSize: 14, lineHeight: 21 }}>
                  {app.rejectionReason || 'No reason was provided. Please contact support for more details.'}
                </Text>
              </View>
            )}

            {app.status === 'rejected' && (
              <Pressable
                onPress={() => router.push('/(auth)/restaurant-signup/step-1' as any)}
                style={{ backgroundColor: Colors.gold[500], borderRadius: 16, paddingVertical: 16, alignItems: 'center', marginBottom: 12 }}
              >
                <Text style={{ color: Colors.empire.black, fontWeight: '800', fontSize: 15 }}>Resubmit Application</Text>
              </Pressable>
            )}

            <Pressable
              onPress={() => Linking.openURL('tel:+27100000000')}
              style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, backgroundColor: '#fff', borderRadius: 14, paddingVertical: 14, borderWidth: 1, borderColor: Colors.surface[200] }}
            >
              <Phone size={16} color={Colors.gold[500]} />
              <Text style={{ color: Colors.empire.black, fontWeight: '700', fontSize: 14 }}>Contact Support</Text>
            </Pressable>
          </>
        )}
      </ScrollView>
    </View>
  );
}
