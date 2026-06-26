import React from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { ArrowLeft, Award, ShoppingBag, Star, Users, TrendingUp } from 'lucide-react-native';
import { useQuery } from '@tanstack/react-query';
import { ScreenWrapper } from '@/components/layout/ScreenWrapper';
import { useAuthStore } from '@/stores/authStore';
import { userService } from '@/services/user.service';
import { T } from '@/constants/colors';

const GOLD = '#C9A227';

const TIERS = [
  { name: 'Bronze', min: 0, max: 499, color: '#CD7F32' },
  { name: 'Silver', min: 500, max: 1499, color: '#A8A9AD' },
  { name: 'Gold', min: 1500, max: Infinity, color: GOLD },
];

const HOW_TO_EARN = [
  { Icon: ShoppingBag, label: 'Place an order', pts: '1 pt per R10 spent' },
  { Icon: Star, label: 'Rate your first order', pts: '+50 pts bonus' },
  { Icon: Users, label: 'Refer a friend', pts: '+200 pts when they order' },
];

export default function LoyaltyScreen() {
  const { user } = useAuthStore();
  const { data: loyalty, isLoading } = useQuery({
    queryKey: ['user', 'loyalty'],
    queryFn: () => userService.getLoyalty(),
  });

  const points = loyalty?.balance ?? 0;
  const tierName = loyalty?.tier ?? 'Bronze';
  const currentTier = TIERS.find((t) => t.name === tierName) ?? TIERS[0];
  const nextTier = TIERS.find((t) => t.name === loyalty?.nextTier) ?? null;
  const progress = nextTier
    ? Math.min((points - currentTier.min) / (nextTier.min - currentTier.min), 1)
    : 1;

  return (
    <ScreenWrapper bg="white">
      <View style={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 16, flexDirection: 'row', alignItems: 'center', gap: 14, borderBottomWidth: 1, borderBottomColor: T.border }}>
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <ArrowLeft size={22} color={T.text} />
        </Pressable>
        <Text style={{ color: T.text, fontSize: 20, fontWeight: '900', flex: 1 }}>Loyalty & Rewards</Text>
      </View>

      {isLoading ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size="large" color={GOLD} />
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 60 }} showsVerticalScrollIndicator={false}>
          {/* Points card */}
          <View style={{ backgroundColor: '#1C1C1C', borderRadius: 18, padding: 22, marginBottom: 24, borderWidth: 1, borderColor: GOLD }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <View>
                <Text style={{ color: GOLD, fontSize: 11, fontWeight: '700', letterSpacing: 2 }}>EMPIRE REWARDS</Text>
                <Text style={{ color: '#fff', fontSize: 36, fontWeight: '900', marginTop: 4 }}>{points.toLocaleString()} pts</Text>
                <Text style={{ color: '#888', fontSize: 13, marginTop: 2 }}>{currentTier.name} Member</Text>
                {user && <Text style={{ color: '#666', fontSize: 12, marginTop: 2 }}>{user.firstName} {user.lastName}</Text>}
              </View>
              <View style={{ width: 52, height: 52, borderRadius: 26, backgroundColor: '#C9A22722', alignItems: 'center', justifyContent: 'center' }}>
                <Award size={26} color={GOLD} />
              </View>
            </View>
            {nextTier && (
              <View style={{ marginTop: 18 }}>
                <View style={{ backgroundColor: '#0A0A0A', borderRadius: 8, height: 6, overflow: 'hidden' }}>
                  <View style={{ width: `${Math.round(progress * 100)}%`, height: '100%', backgroundColor: GOLD, borderRadius: 8 }} />
                </View>
                <Text style={{ color: '#888', fontSize: 12, marginTop: 6 }}>
                  {loyalty?.pointsToNextTier} pts to {nextTier.name}
                </Text>
              </View>
            )}
            {!nextTier && (
              <Text style={{ color: GOLD, fontSize: 12, marginTop: 10, fontWeight: '700' }}>Maximum tier reached!</Text>
            )}
          </View>

          {/* Tiers */}
          <Text style={{ fontWeight: '800', color: T.text, fontSize: 12, letterSpacing: 1, marginBottom: 12, opacity: 0.5 }}>MEMBERSHIP TIERS</Text>
          <View style={{ backgroundColor: T.bg, borderRadius: 14, borderWidth: 1, borderColor: T.border, overflow: 'hidden', marginBottom: 28 }}>
            {TIERS.map((tier, i, arr) => (
              <View
                key={tier.name}
                style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: i < arr.length - 1 ? 1 : 0, borderBottomColor: T.border, gap: 14 }}
              >
                <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: tier.color + '22', alignItems: 'center', justifyContent: 'center' }}>
                  <Award size={18} color={tier.color} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontWeight: '700', color: T.text, fontSize: 14 }}>{tier.name}</Text>
                  <Text style={{ color: T.textSec, fontSize: 12, marginTop: 1 }}>
                    {tier.max === Infinity ? `${tier.min.toLocaleString()}+ pts` : `${tier.min.toLocaleString()} – ${tier.max.toLocaleString()} pts`}
                  </Text>
                </View>
                {currentTier.name === tier.name && (
                  <View style={{ backgroundColor: tier.color + '22', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 }}>
                    <Text style={{ color: tier.color, fontSize: 11, fontWeight: '700' }}>Current</Text>
                  </View>
                )}
              </View>
            ))}
          </View>

          {/* Recent transactions */}
          {(loyalty?.recentTransactions?.length ?? 0) > 0 && (
            <>
              <Text style={{ fontWeight: '800', color: T.text, fontSize: 12, letterSpacing: 1, marginBottom: 12, opacity: 0.5 }}>RECENT ACTIVITY</Text>
              <View style={{ backgroundColor: T.bg, borderRadius: 14, borderWidth: 1, borderColor: T.border, overflow: 'hidden', marginBottom: 28 }}>
                {loyalty!.recentTransactions.slice(0, 5).map((tx, i, arr) => (
                  <View
                    key={tx.id}
                    style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: i < arr.length - 1 ? 1 : 0, borderBottomColor: T.border, gap: 12 }}
                  >
                    <View style={{ width: 34, height: 34, borderRadius: 10, backgroundColor: tx.points > 0 ? '#4ade8022' : '#ef444422', alignItems: 'center', justifyContent: 'center' }}>
                      <TrendingUp size={16} color={tx.points > 0 ? '#4ade80' : '#ef4444'} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 13, fontWeight: '600', color: T.text }}>{tx.description}</Text>
                      <Text style={{ fontSize: 11, color: T.textTer, marginTop: 1 }}>{new Date(tx.createdAt).toLocaleDateString('en-ZA')}</Text>
                    </View>
                    <Text style={{ fontSize: 14, fontWeight: '800', color: tx.points > 0 ? '#4ade80' : '#ef4444' }}>
                      {tx.points > 0 ? '+' : ''}{tx.points} pts
                    </Text>
                  </View>
                ))}
              </View>
            </>
          )}

          {/* How to earn */}
          <Text style={{ fontWeight: '800', color: T.text, fontSize: 12, letterSpacing: 1, marginBottom: 12, opacity: 0.5 }}>HOW TO EARN POINTS</Text>
          <View style={{ backgroundColor: T.bg, borderRadius: 14, borderWidth: 1, borderColor: T.border, overflow: 'hidden' }}>
            {HOW_TO_EARN.map(({ Icon, label, pts }, i, arr) => (
              <View
                key={label}
                style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: i < arr.length - 1 ? 1 : 0, borderBottomColor: T.border, gap: 14 }}
              >
                <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: T.surface, alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={18} color={T.textSec} />
                </View>
                <Text style={{ flex: 1, fontWeight: '600', color: T.text, fontSize: 14 }}>{label}</Text>
                <Text style={{ fontWeight: '700', color: GOLD, fontSize: 13 }}>{pts}</Text>
              </View>
            ))}
          </View>

          <Text style={{ color: T.textTer, fontSize: 12, textAlign: 'center', marginTop: 24, lineHeight: 18 }}>
            Points are awarded after each completed order.{'\n'}100 pts = R10 off · Redeem at checkout when placing an order.
          </Text>
        </ScrollView>
      )}
    </ScreenWrapper>
  );
}
