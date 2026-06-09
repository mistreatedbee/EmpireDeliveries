import React, { useRef, useEffect, useState } from 'react';
import { FlatList, View, Text, Dimensions, Image } from 'react-native';
import { Colors } from '@/constants/colors';

const { width } = Dimensions.get('window');
const BANNER_WIDTH = width - 48;

const PROMOS = [
  { id: '1', title: '50% OFF', subtitle: 'First order with code EMPIRE50', bg: Colors.empire.charcoal, emoji: '🎉' },
  { id: '2', title: 'Free Delivery', subtitle: 'On orders above R250 this weekend', bg: '#1A1A2E', emoji: '🚀' },
  { id: '3', title: 'Earn Double', subtitle: 'Double Empire Points every Tuesday', bg: '#0D2B1C', emoji: '🏆' },
];

export function PromoBanner() {
  const [current, setCurrent] = useState(0);
  const ref = useRef<FlatList>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const next = (current + 1) % PROMOS.length;
      ref.current?.scrollToIndex({ index: next, animated: true });
      setCurrent(next);
    }, 3500);
    return () => clearInterval(interval);
  }, [current]);

  return (
    <View style={{ marginBottom: 8 }}>
      <FlatList
        ref={ref}
        data={PROMOS}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        snapToInterval={BANNER_WIDTH + 12}
        decelerationRate="fast"
        onMomentumScrollEnd={(e) => setCurrent(Math.round(e.nativeEvent.contentOffset.x / (BANNER_WIDTH + 12)))}
        renderItem={({ item }) => (
          <View
            style={{
              width: BANNER_WIDTH,
              marginRight: 12,
              height: 120,
              borderRadius: 20,
              backgroundColor: item.bg,
              padding: 20,
              justifyContent: 'center',
              overflow: 'hidden',
            }}
          >
            <Text style={{ position: 'absolute', right: 16, bottom: 8, fontSize: 64, opacity: 0.4 }}>{item.emoji}</Text>
            <Text style={{ color: Colors.gold[500], fontWeight: '900', fontSize: 24, marginBottom: 4 }}>{item.title}</Text>
            <Text style={{ color: '#CCCCCC', fontSize: 14 }}>{item.subtitle}</Text>
          </View>
        )}
      />
      <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 10, gap: 6 }}>
        {PROMOS.map((_, i) => (
          <View key={i} style={{ width: i === current ? 20 : 6, height: 6, borderRadius: 3, backgroundColor: i === current ? Colors.gold[500] : '#D0D0D0' }} />
        ))}
      </View>
    </View>
  );
}
