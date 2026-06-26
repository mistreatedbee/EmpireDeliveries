import React, { useRef, useState } from 'react';
import { View, Text, FlatList, Dimensions, Pressable } from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { T } from '@/constants/colors';
import { Button } from '@/components/empire';

const { width } = Dimensions.get('window');

const SLIDES = [
  {
    id: '1',
    emoji: '🍔',
    title: 'Food Delivery',
    subtitle: 'Order from hundreds of restaurants and get food delivered to your door in minutes.',
  },
  {
    id: '2',
    emoji: '📍',
    title: 'Live Tracking',
    subtitle: 'Watch your order move in real time on the map. Know exactly when it arrives.',
  },
  {
    id: '3',
    emoji: '⚡',
    title: 'Fast Delivery',
    subtitle: 'Average delivery in under 35 minutes. Because hunger doesn\'t wait.',
  },
  {
    id: '4',
    emoji: '🏆',
    title: 'Earn Rewards',
    subtitle: 'Every order earns you Empire Points. Redeem for discounts, free delivery and more.',
  },
  {
    id: '5',
    emoji: '👑',
    title: 'Get Started',
    subtitle: 'Join thousands of South Africans already ordering with Empire Deliveries.',
    isLast: true,
  },
];

async function complete() {
  await AsyncStorage.setItem('empire_onboarded', 'true');
  router.replace('/(auth)/login');
}

export default function OnboardingScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const goNext = () => {
    if (currentIndex < SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      complete();
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: T.bg }}>
      <FlatList
        ref={flatListRef}
        data={SLIDES}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        onMomentumScrollEnd={(e) => {
          setCurrentIndex(Math.round(e.nativeEvent.contentOffset.x / width));
        }}
        renderItem={({ item }) => (
          <View style={{ width, flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 }}>
            <Text style={{ fontSize: 100, marginBottom: 32 }}>{item.emoji}</Text>
            <Text style={{ color: T.text, fontSize: 32, fontWeight: '900', textAlign: 'center', marginBottom: 16 }}>
              {item.title}
            </Text>
            <Text style={{ color: T.textSec, fontSize: 17, textAlign: 'center', lineHeight: 26 }}>
              {item.subtitle}
            </Text>
          </View>
        )}
      />

      <View style={{ paddingHorizontal: 24, paddingBottom: 48 }}>
        {/* Dot indicators */}
        <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 32, gap: 8 }}>
          {SLIDES.map((_, i) => (
            <View
              key={i}
              style={{
                width: i === currentIndex ? 24 : 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: i === currentIndex ? T.gold : T.border,
              }}
            />
          ))}
        </View>

        <Button variant="primary" size="lg" fullWidth onPress={goNext}>
          {currentIndex === SLIDES.length - 1 ? 'Get Started' : 'Next'}
        </Button>

        {currentIndex < SLIDES.length - 1 && (
          <Pressable onPress={complete} style={{ marginTop: 16, alignItems: 'center' }}>
            <Text style={{ color: T.textTer, fontSize: 15 }}>Skip</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}
