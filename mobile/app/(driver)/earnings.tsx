import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { Colors } from '@/constants/colors';

type Period = 'today' | 'week' | 'month';

const DATA: Record<Period, { earn: string; trips: number; hrs: string }> = {
  today:  { earn: 'R480',    trips: 6,   hrs: '5h 20m' },
  week:   { earn: 'R2,840',  trips: 38,  hrs: '34h 10m' },
  month:  { earn: 'R11,200', trips: 152, hrs: '136h' },
};

const DAILY = [
  { day: 'Monday',    trips: 6, earn: 'R485' },
  { day: 'Tuesday',   trips: 5, earn: 'R390' },
  { day: 'Wednesday', trips: 8, earn: 'R620' },
  { day: 'Thursday',  trips: 4, earn: 'R310' },
  { day: 'Friday',    trips: 9, earn: 'R720' },
  { day: 'Saturday',  trips: 6, earn: 'R460' },
];

export default function DriverEarnings() {
  const [period, setPeriod] = useState<Period>('week');
  const d = DATA[period];

  return (
    <View style={{ flex: 1, backgroundColor: Colors.surface[100] }}>
      <View style={{ backgroundColor: Colors.empire.black, paddingHorizontal: 20, paddingTop: 56, paddingBottom: 20 }}>
        <Text style={{ color: '#fff', fontSize: 22, fontWeight: '900' }}>Earnings</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        {/* Period selector */}
        <View style={{ flexDirection: 'row', backgroundColor: Colors.surface[200], borderRadius: 16, padding: 4, marginBottom: 20 }}>
          {(['today', 'week', 'month'] as Period[]).map(p => (
            <Pressable
              key={p}
              onPress={() => setPeriod(p)}
              style={{ flex: 1, paddingVertical: 10, borderRadius: 12, backgroundColor: period === p ? '#fff' : 'transparent', alignItems: 'center',
                shadowColor: period === p ? '#000' : 'transparent', shadowOpacity: 0.06, shadowRadius: 4, elevation: period === p ? 2 : 0 }}
            >
              <Text style={{ fontWeight: '700', fontSize: 13, textTransform: 'capitalize', color: period === p ? Colors.empire.black : '#999' }}>{p}</Text>
            </Pressable>
          ))}
        </View>

        {/* Summary card */}
        <View style={{ borderRadius: 24, padding: 20, backgroundColor: Colors.empire.black, marginBottom: 16 }}>
          <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 11, textTransform: 'uppercase', letterSpacing: 1 }}>Total Earnings</Text>
          <Text style={{ color: '#fff', fontSize: 40, fontWeight: '900', marginTop: 4 }}>{d.earn}</Text>
          <View style={{ flexDirection: 'row', gap: 32, marginTop: 16 }}>
            {[{ label: 'Trips', value: d.trips.toString() }, { label: 'Hours', value: d.hrs }].map(s => (
              <View key={s.label}>
                <Text style={{ color: Colors.gold[500], fontWeight: '900', fontSize: 22 }}>{s.value}</Text>
                <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12, marginTop: 2 }}>{s.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Daily breakdown */}
        <View style={{ backgroundColor: '#fff', borderRadius: 24, padding: 16, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 }}>
          <Text style={{ fontWeight: '800', color: Colors.empire.black, fontSize: 15, marginBottom: 12 }}>Daily Breakdown</Text>
          {DAILY.map((row, i) => (
            <View key={row.day} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: i < DAILY.length - 1 ? 1 : 0, borderBottomColor: Colors.surface[100] }}>
              <Text style={{ color: '#555', fontSize: 14, flex: 1 }}>{row.day}</Text>
              <Text style={{ color: '#aaa', fontSize: 12, marginRight: 16 }}>{row.trips} trips</Text>
              <Text style={{ fontWeight: '800', fontSize: 14, color: Colors.empire.black }}>{row.earn}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
