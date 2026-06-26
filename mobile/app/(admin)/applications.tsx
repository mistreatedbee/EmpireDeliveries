import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator, Alert, Modal } from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CheckCircle, XCircle, ChevronRight, Car, Building2, CreditCard, X } from 'lucide-react-native';
import { adminService, Application } from '@/services/admin.service';
import { Colors } from '@/constants/colors';

const TABS: Array<'pending' | 'approved' | 'rejected'> = ['pending', 'approved', 'rejected'];
const TAB_COLORS = { pending: '#f97316', approved: '#4ade80', rejected: '#ef4444' };

function DetailRow({ label, value }: { label: string; value?: string | number }) {
  if (!value) return null;
  return (
    <View style={{ flexDirection: 'row', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#1e1e1e' }}>
      <Text style={{ color: '#888', fontSize: 13, width: 120 }}>{label}</Text>
      <Text style={{ color: '#fff', fontSize: 13, fontWeight: '600', flex: 1 }}>{String(value)}</Text>
    </View>
  );
}

function ApplicationDetail({ app, onClose, onApprove, onReject, loading }: {
  app: Application;
  onClose: () => void;
  onApprove: () => void;
  onReject: () => void;
  loading: boolean;
}) {
  return (
    <View style={{ flex: 1, backgroundColor: Colors.empire.black }}>
      <View style={{ paddingTop: 56, paddingHorizontal: 24, paddingBottom: 20, flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: Colors.empire.charcoal }}>
        <Pressable onPress={onClose} hitSlop={8} style={{ marginRight: 16 }}>
          <X size={22} color="#fff" />
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text style={{ color: '#fff', fontWeight: '900', fontSize: 18 }}>{app.firstName} {app.lastName}</Text>
          <Text style={{ color: '#888', fontSize: 12 }}>{app.applicationType.toUpperCase()} APPLICATION</Text>
        </View>
        <View style={{ backgroundColor: TAB_COLORS[app.status] + '22', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 }}>
          <Text style={{ color: TAB_COLORS[app.status], fontWeight: '700', fontSize: 11, textTransform: 'uppercase' }}>{app.status}</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 40 }}>
        <Text style={{ color: Colors.gold[500], fontWeight: '800', fontSize: 11, letterSpacing: 1.5, marginBottom: 10 }}>APPLICANT</Text>
        <View style={{ backgroundColor: Colors.empire.charcoal, borderRadius: 14, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#2a2a2a' }}>
          <DetailRow label="Email" value={app.email} />
          <DetailRow label="Phone" value={app.phone} />
          <DetailRow label="Submitted" value={new Date(app.submittedAt).toLocaleDateString('en-ZA')} />
          {app.rejectionReason && <DetailRow label="Rejection Reason" value={app.rejectionReason} />}
        </View>

        {app.applicationType === 'driver' && (
          <>
            <Text style={{ color: Colors.gold[500], fontWeight: '800', fontSize: 11, letterSpacing: 1.5, marginBottom: 10, marginTop: 8 }}>VEHICLE</Text>
            <View style={{ backgroundColor: Colors.empire.charcoal, borderRadius: 14, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#2a2a2a' }}>
              <DetailRow label="Type" value={app.vehicleType} />
              <DetailRow label="Make" value={app.vehicleMake} />
              <DetailRow label="Model" value={app.vehicleModel} />
              <DetailRow label="Year" value={app.vehicleYear} />
              <DetailRow label="Reg Number" value={app.vehicleReg} />
              <DetailRow label="ID Number" value={app.idNumber} />
              <DetailRow label="Date of Birth" value={app.dateOfBirth} />
            </View>
          </>
        )}

        {app.applicationType === 'restaurant' && (
          <>
            <Text style={{ color: Colors.gold[500], fontWeight: '800', fontSize: 11, letterSpacing: 1.5, marginBottom: 10, marginTop: 8 }}>BUSINESS</Text>
            <View style={{ backgroundColor: Colors.empire.charcoal, borderRadius: 14, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#2a2a2a' }}>
              <DetailRow label="Trading Name" value={app.tradingName} />
              <DetailRow label="Business Reg" value={app.businessRegNo} />
              <DetailRow label="Cuisine" value={app.cuisineType} />
              <DetailRow label="Address" value={app.address} />
              <DetailRow label="City" value={app.city} />
            </View>
          </>
        )}

        <Text style={{ color: Colors.gold[500], fontWeight: '800', fontSize: 11, letterSpacing: 1.5, marginBottom: 10, marginTop: 8 }}>BANKING</Text>
        <View style={{ backgroundColor: Colors.empire.charcoal, borderRadius: 14, padding: 16, marginBottom: 24, borderWidth: 1, borderColor: '#2a2a2a' }}>
          <DetailRow label="Bank" value={app.bankName} />
          <DetailRow label="Account No" value={app.bankAccountNo ? '•••• ' + app.bankAccountNo.slice(-4) : undefined} />
          <DetailRow label="Holder" value={app.bankHolder} />
        </View>

        {app.status === 'pending' && (
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <Pressable
              onPress={onApprove}
              disabled={loading}
              style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#4ade8022', borderRadius: 14, paddingVertical: 14, borderWidth: 1, borderColor: '#4ade8055', opacity: loading ? 0.6 : 1 }}
            >
              <CheckCircle size={18} color="#4ade80" />
              <Text style={{ color: '#4ade80', fontWeight: '800', fontSize: 15 }}>Approve</Text>
            </Pressable>
            <Pressable
              onPress={onReject}
              disabled={loading}
              style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#ef444422', borderRadius: 14, paddingVertical: 14, borderWidth: 1, borderColor: '#ef444455', opacity: loading ? 0.6 : 1 }}
            >
              <XCircle size={18} color="#ef4444" />
              <Text style={{ color: '#ef4444', fontWeight: '800', fontSize: 15 }}>Reject</Text>
            </Pressable>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

export default function ApplicationsScreen() {
  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const [selected, setSelected] = useState<Application | null>(null);
  const queryClient = useQueryClient();

  const { data: applications, isLoading } = useQuery({
    queryKey: ['admin', 'applications', activeTab],
    queryFn: () => adminService.getApplications({ status: activeTab }),
    refetchInterval: activeTab === 'pending' ? 15000 : undefined,
  });

  const approveMutation = useMutation({
    mutationFn: ({ id, type }: { id: string; type: 'driver' | 'restaurant' }) =>
      adminService.approveApplication(id, type),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin'] });
      setSelected(null);
    },
    onError: (err: any) => Alert.alert('Error', err.message || 'Approval failed'),
  });

  const rejectMutation = useMutation({
    mutationFn: ({ id, type, reason }: { id: string; type: 'driver' | 'restaurant'; reason?: string }) =>
      adminService.rejectApplication(id, type, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin'] });
      setSelected(null);
    },
    onError: (err: any) => Alert.alert('Error', err.message || 'Rejection failed'),
  });

  const handleReject = (app: Application) => {
    Alert.prompt(
      'Reject Application',
      `Reason for rejecting ${app.firstName}'s application (optional):`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Reject', style: 'destructive', onPress: (reason?: string) => rejectMutation.mutate({ id: app.id, type: app.applicationType, reason }) },
      ],
      'plain-text',
    );
  };

  const mutating = approveMutation.isPending || rejectMutation.isPending;

  if (selected) {
    return (
      <Modal animationType="slide" presentationStyle="fullScreen">
        <ApplicationDetail
          app={selected}
          onClose={() => setSelected(null)}
          onApprove={() => approveMutation.mutate({ id: selected.id, type: selected.applicationType })}
          onReject={() => handleReject(selected)}
          loading={mutating}
        />
      </Modal>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: Colors.empire.black }}>
      <View style={{ paddingTop: 56, paddingHorizontal: 24, paddingBottom: 0, borderBottomWidth: 1, borderBottomColor: Colors.empire.charcoal }}>
        <Text style={{ color: '#888', fontSize: 12, fontWeight: '700', letterSpacing: 2 }}>ADMIN PORTAL</Text>
        <Text style={{ color: '#fff', fontSize: 24, fontWeight: '900', marginTop: 2, marginBottom: 16 }}>Applications</Text>

        <View style={{ flexDirection: 'row', gap: 0 }}>
          {TABS.map((tab) => (
            <Pressable
              key={tab}
              onPress={() => setActiveTab(tab)}
              style={{ flex: 1, paddingBottom: 12, alignItems: 'center', borderBottomWidth: 2, borderBottomColor: activeTab === tab ? TAB_COLORS[tab] : 'transparent' }}
            >
              <Text style={{ color: activeTab === tab ? TAB_COLORS[tab] : '#666', fontWeight: '700', fontSize: 13, textTransform: 'capitalize' }}>{tab}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      {isLoading ? (
        <ActivityIndicator color={Colors.gold[500]} style={{ marginTop: 60 }} />
      ) : !applications?.length ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ color: '#555', fontSize: 14 }}>No {activeTab} applications</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
          {applications.map((app) => (
            <Pressable
              key={app.id}
              onPress={() => setSelected(app)}
              style={{ backgroundColor: Colors.empire.charcoal, borderRadius: 14, padding: 16, marginBottom: 10, borderWidth: 1, borderColor: '#2a2a2a', flexDirection: 'row', alignItems: 'center' }}
            >
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <Text style={{ color: '#fff', fontWeight: '700', fontSize: 15 }}>{app.firstName} {app.lastName}</Text>
                  <View style={{ backgroundColor: app.applicationType === 'driver' ? Colors.gold[500] + '22' : '#4ade8022', borderRadius: 6, paddingHorizontal: 7, paddingVertical: 2 }}>
                    <Text style={{ color: app.applicationType === 'driver' ? Colors.gold[500] : '#4ade80', fontWeight: '700', fontSize: 10, textTransform: 'uppercase' }}>
                      {app.applicationType}
                    </Text>
                  </View>
                </View>
                <Text style={{ color: '#888', fontSize: 12 }}>{app.email}</Text>
                <Text style={{ color: '#555', fontSize: 11, marginTop: 2 }}>
                  {new Date(app.submittedAt).toLocaleDateString('en-ZA')}
                </Text>
              </View>
              {app.status === 'pending' && (
                <View style={{ flexDirection: 'row', gap: 6, marginRight: 8 }}>
                  <Pressable
                    onPress={() => approveMutation.mutate({ id: app.id, type: app.applicationType })}
                    disabled={mutating}
                    hitSlop={4}
                    style={{ backgroundColor: '#4ade8022', borderRadius: 8, padding: 6 }}
                  >
                    <CheckCircle size={16} color="#4ade80" />
                  </Pressable>
                  <Pressable
                    onPress={() => handleReject(app)}
                    disabled={mutating}
                    hitSlop={4}
                    style={{ backgroundColor: '#ef444422', borderRadius: 8, padding: 6 }}
                  >
                    <XCircle size={16} color="#ef4444" />
                  </Pressable>
                </View>
              )}
              <ChevronRight size={16} color="#444" />
            </Pressable>
          ))}
        </ScrollView>
      )}
    </View>
  );
}
