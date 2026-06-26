import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, TextInput, ActivityIndicator, Alert } from 'react-native';
import { router } from 'expo-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, FileText, Trash2, Plus } from 'lucide-react-native';
import { driverService, DriverDocument } from '@/services/driver.service';
import { Colors } from '@/constants/colors';

const DOC_TYPES = ["Driver's Licence", 'ID Document', 'Vehicle Licence Disc', 'PDP Certificate', 'Insurance Certificate'];

const STATUS_COLOR: Record<string, string> = {
  pending: Colors.empire.warning,
  approved: Colors.empire.success,
  rejected: Colors.empire.error,
};

function StatusBadge({ status }: { status: string }) {
  return (
    <View style={{ backgroundColor: STATUS_COLOR[status] ?? '#999', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 }}>
      <Text style={{ color: '#fff', fontSize: 11, fontWeight: '700', textTransform: 'capitalize' }}>{status}</Text>
    </View>
  );
}

export default function DriverDocuments() {
  const queryClient = useQueryClient();
  const [addMode, setAddMode] = useState(false);
  const [form, setForm] = useState({ type: '', referenceNo: '', expiryDate: '' });
  const [error, setError] = useState('');

  const { data: docs = [], isLoading } = useQuery({
    queryKey: ['driver', 'documents'],
    queryFn: driverService.getDocuments,
  });

  const addMutation = useMutation({
    mutationFn: () => driverService.addDocument(form),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['driver', 'documents'] });
      setAddMode(false);
      setForm({ type: '', referenceNo: '', expiryDate: '' });
      setError('');
    },
    onError: (err: { message?: string }) => setError(err.message ?? 'Failed to add document.'),
  });

  const deleteMutation = useMutation({
    mutationFn: (docId: string) => driverService.deleteDocument(docId),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ['driver', 'documents'] }),
  });

  const handleAdd = () => {
    if (!form.type) { setError('Please select a document type.'); return; }
    if (!form.referenceNo.trim()) { setError('Reference number is required.'); return; }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(form.expiryDate)) { setError('Expiry date must be YYYY-MM-DD.'); return; }
    setError('');
    addMutation.mutate();
  };

  const confirmDelete = (doc: DriverDocument) => {
    Alert.alert('Remove Document', `Remove ${doc.type}?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: () => deleteMutation.mutate(doc.id) },
    ]);
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.empire.black }}>
      {/* Header */}
      <View style={{ paddingHorizontal: 20, paddingTop: 56, paddingBottom: 20, flexDirection: 'row', alignItems: 'center', gap: 14 }}>
        <Pressable onPress={() => addMode ? setAddMode(false) : router.back()} hitSlop={8}>
          <ArrowLeft size={22} color="#fff" />
        </Pressable>
        <Text style={{ color: '#fff', fontSize: 20, fontWeight: '900', flex: 1 }}>
          {addMode ? 'Add Document' : 'My Documents'}
        </Text>
        {!addMode && (
          <Pressable onPress={() => { setAddMode(true); setError(''); }} hitSlop={8}>
            <Plus size={22} color={Colors.gold[500]} />
          </Pressable>
        )}
      </View>

      <ScrollView
        style={{ flex: 1, backgroundColor: Colors.surface[100], borderTopLeftRadius: 28, borderTopRightRadius: 28 }}
        contentContainerStyle={{ padding: 24, paddingBottom: 60 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* ── ADD FORM ── */}
        {addMode && (
          <View>
            <Text style={{ fontWeight: '800', color: Colors.empire.black, fontSize: 13, letterSpacing: 1, marginBottom: 12, opacity: 0.5 }}>DOCUMENT TYPE</Text>
            <View style={{ backgroundColor: '#fff', borderRadius: 18, borderWidth: 1, borderColor: Colors.surface[200], overflow: 'hidden', marginBottom: 20 }}>
              {DOC_TYPES.map((t, i, arr) => (
                <Pressable
                  key={t}
                  onPress={() => setForm((f) => ({ ...f, type: t }))}
                  style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 18, paddingVertical: 14, borderBottomWidth: i < arr.length - 1 ? 1 : 0, borderBottomColor: Colors.surface[100], gap: 12 }}
                >
                  <View style={{ width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: form.type === t ? Colors.gold[500] : '#ccc', alignItems: 'center', justifyContent: 'center' }}>
                    {form.type === t && <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.gold[500] }} />}
                  </View>
                  <Text style={{ fontWeight: form.type === t ? '700' : '500', color: Colors.empire.black, fontSize: 14 }}>{t}</Text>
                </Pressable>
              ))}
            </View>

            <Text style={{ fontWeight: '800', color: Colors.empire.black, fontSize: 13, letterSpacing: 1, marginBottom: 10, opacity: 0.5 }}>DETAILS</Text>
            <View style={{ gap: 12, marginBottom: 20 }}>
              {[
                { label: 'Reference / Licence Number', key: 'referenceNo' as const, placeholder: 'e.g. 123456789', keyboard: 'default' as const },
                { label: 'Expiry Date', key: 'expiryDate' as const, placeholder: 'YYYY-MM-DD', keyboard: 'default' as const },
              ].map(({ label, key, placeholder, keyboard }) => (
                <View key={key}>
                  <Text style={{ fontWeight: '700', color: Colors.empire.black, marginBottom: 6, fontSize: 13 }}>{label}</Text>
                  <TextInput
                    value={form[key]}
                    onChangeText={(v) => { setForm((f) => ({ ...f, [key]: v })); setError(''); }}
                    placeholder={placeholder}
                    placeholderTextColor="#bbb"
                    keyboardType={keyboard}
                    autoCapitalize="none"
                    style={{ backgroundColor: '#fff', borderRadius: 14, borderWidth: 1, borderColor: Colors.surface[200], paddingHorizontal: 14, paddingVertical: 12, fontSize: 14, color: Colors.empire.black }}
                  />
                </View>
              ))}
            </View>

            {error ? <Text style={{ color: Colors.empire.error, fontSize: 13, marginBottom: 12 }}>{error}</Text> : null}

            <Pressable
              onPress={handleAdd}
              disabled={addMutation.isPending}
              style={{ backgroundColor: Colors.gold[500], borderRadius: 16, paddingVertical: 16, alignItems: 'center' }}
            >
              {addMutation.isPending
                ? <ActivityIndicator color={Colors.empire.black} />
                : <Text style={{ color: Colors.empire.black, fontWeight: '900', fontSize: 16 }}>Add Document</Text>}
            </Pressable>
          </View>
        )}

        {/* ── LIST VIEW ── */}
        {!addMode && (
          <View>
            {isLoading && (
              <View style={{ alignItems: 'center', marginTop: 40 }}>
                <ActivityIndicator color={Colors.gold[500]} />
              </View>
            )}

            {!isLoading && (docs as DriverDocument[]).length === 0 && (
              <View style={{ alignItems: 'center', marginTop: 48 }}>
                <FileText size={48} color="#ccc" />
                <Text style={{ fontWeight: '800', color: Colors.empire.black, fontSize: 16, marginTop: 16 }}>No documents yet</Text>
                <Text style={{ color: '#aaa', fontSize: 13, marginTop: 6, textAlign: 'center' }}>
                  Add your compliance documents to get verified.
                </Text>
                <Pressable
                  onPress={() => setAddMode(true)}
                  style={{ marginTop: 20, backgroundColor: Colors.gold[500], borderRadius: 14, paddingVertical: 12, paddingHorizontal: 28 }}
                >
                  <Text style={{ color: Colors.empire.black, fontWeight: '800' }}>Add Document</Text>
                </Pressable>
              </View>
            )}

            {!isLoading && (docs as DriverDocument[]).map((doc) => (
              <View
                key={doc.id}
                style={{ backgroundColor: '#fff', borderRadius: 18, borderWidth: 1, borderColor: Colors.surface[200], padding: 16, marginBottom: 12 }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 6 }}>
                  <Text style={{ fontWeight: '800', color: Colors.empire.black, fontSize: 15, flex: 1, marginRight: 8 }}>{doc.type}</Text>
                  <StatusBadge status={doc.status} />
                </View>
                <Text style={{ color: '#888', fontSize: 13, marginBottom: 2 }}>Ref: {doc.referenceNo}</Text>
                <Text style={{ color: '#aaa', fontSize: 12, marginBottom: 10 }}>
                  Expires: {new Date(doc.expiryDate).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' })}
                </Text>
                <Pressable
                  onPress={() => confirmDelete(doc)}
                  disabled={deleteMutation.isPending}
                  style={{ flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-end' }}
                >
                  <Trash2 size={14} color={Colors.empire.error} />
                  <Text style={{ color: Colors.empire.error, fontSize: 12, fontWeight: '700' }}>Remove</Text>
                </Pressable>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
