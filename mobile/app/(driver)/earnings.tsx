import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { driverService } from '@/services/driver.service';
import { BarChart } from '@/components/ui/BarChart';
import { Colors } from '@/constants/colors';

type Period = 'today' | 'week' | 'month';

const DAY_FULL: Record<string, string> = {
  Sun: 'Sunday', Mon: 'Monday', Tue: 'Tuesday', Wed: 'Wednesday',
  Thu: 'Thursday', Fri: 'Friday', Sat: 'Saturday',
};

function formatHours(h: number): string {
  const hrs = Math.floor(h);
  const mins = Math.round((h - hrs) * 60);
  if (hrs === 0) return `${mins}m`;
  if (mins === 0) return `${hrs}h`;
  return `${hrs}h ${mins}m`;
}

export default function DriverEarnings() {
  const [period, setPeriod] = useState<Period>('week');

  const { data: earnings, isLoading: earningsLoading } = useQuery({
    queryKey: ['driver', 'earnings', period],
    queryFn: () => driverService.getEarnings(period),
  });

  const { data: breakdown, isLoading: breakdownLoading } = useQuery({
    queryKey: ['driver', 'earnings', 'breakdown'],
    queryFn: driverService.getEarningsBreakdown,
  });

  return (
    <View style={{ flex: 1, backgroundColor: Colors.surface[100] }}>
      <View style={{ backgroundColor: Colors.empire.black, paddingHorizontal: 20, paddingTop: 56, paddingBottom: 20 }}>
        <Text style={{ color: '#fff', fontSize: 22, fontWeight: '900' }}>Earnings</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        {/* Period selector */}
        <View style={{ flexDirection: 'row', backgroundColor: Colors.surface[200], borderRadius: 16, padding: 4, marginBottom: 20 }}>
          {(['today', 'week', 'month'] as Period[]).map((p) => (
            <Pressable
              key={p}
              onPress={() => setPeriod(p)}
              style={{
                flex: 1,
                paddingVertical: 10,
                borderRadius: 12,
                backgroundColor: period === p ? '#fff' : 'transparent',
                alignItems: 'center',
                shadowColor: period === p ? '#000' : 'transparent',
                shadowOpacity: 0.06,
                shadowRadius: 4,
                elevation: period === p ? 2 : 0,
              }}
            >
              <Text style={{ fontWeight: '700', fontSize: 13, textTransform: 'capitalize', color: period === p ? Colors.empire.black : '#999' }}>{p}</Text>
            </Pressable>
          ))}
        </View>

        {/* Summary card */}
        <View style={{ borderRadius: 24, padding: 20, backgroundColor: Colors.empire.black, marginBottom: 16 }}>
          <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 11, textTransform: 'uppercase', letterSpacing: 1 }}>Total Earnings</Text>
          {earningsLoading ? (
            <ActivityIndicator color={Colors.gold[500]} style={{ marginTop: 8 }} />
          ) : (
            <>
              <Text style={{ color: '#fff', fontSize: 40, fontWeight: '900', marginTop: 4 }}>
                R{(earnings?.totalEarnings ?? 0).toFixed(0)}
              </Text>
              <View style={{ flexDirection: 'row', gap: 32, marginTop: 16 }}>
                {[
                  { label: 'Trips', value: String(earnings?.tripCount ?? 0) },
                  { label: 'Hours', value: formatHours(earnings?.hoursWorked ?? 0) },
                ].map((s) => (
                  <View key={s.label}>
                    <Text style={{ color: Colors.gold[500], fontWeight: '900', fontSize: 22 }}>{s.value}</Text>
                    <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12, marginTop: 2 }}>{s.label}</Text>
                  </View>
                ))}
              </View>
            </>
          )}
        </View>

        {/* Daily breakdown */}
        <View style={{ backgroundColor: '#fff', borderRadius: 24, padding: 16, borderWidth: 1, borderColor: Colors.surface[200] }}>
          <Text style={{ fontWeight: '800', color: Colors.empire.black, fontSize: 15, marginBottom: 4 }}>This Week</Text>
          {breakdownLoading ? (
            <ActivityIndicator color={Colors.gold[500]} style={{ marginVertical: 16 }} />
          ) : (
            <>
              {(breakdown?.length ?? 0) > 0 && (
                <BarChart
                  data={(breakdown ?? []).map((r) => ({ label: r.day, value: r.earnings }))}
                  barColor={Colors.gold[500]}
                  height={160}
                  formatValue={(v) => `R${v.toFixed(0)}`}
                />
              )}
              <View style={{ marginTop: 8 }}>
                {(breakdown ?? []).map((row, i) => (
                  <View
                    key={row.day}
                    style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: i < (breakdown?.length ?? 0) - 1 ? 1 : 0, borderBottomColor: Colors.surface[100] }}
                  >
                    <Text style={{ color: '#555', fontSize: 14, flex: 1 }}>{DAY_FULL[row.day] ?? row.day}</Text>
                    <Text style={{ color: '#aaa', fontSize: 12, marginRight: 16 }}>{row.trips} trip{row.trips !== 1 ? 's' : ''}</Text>
                    <Text style={{ fontWeight: '800', fontSize: 14, color: Colors.empire.black }}>R{row.earnings.toFixed(0)}</Text>
                  </View>
                ))}
              </View>
              {(!breakdown || breakdown.every((r) => r.trips === 0)) && (
                <Text style={{ color: '#bbb', textAlign: 'center', fontSize: 13, paddingVertical: 8 }}>No deliveries this week yet</Text>
              )}
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
