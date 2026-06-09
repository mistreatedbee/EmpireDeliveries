import React, { useState } from 'react';
import { View, Text, Pressable, Image, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

const SLIDES = [
  { title: 'Order Any Food', subtitle: 'From your favourite restaurants.', image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg' },
  { title: 'Live Driver Tracking', subtitle: 'Watch your order move in real-time.', image: 'https://images.pexels.com/photos/3807517/pexels-photo-3807517.jpeg' },
  { title: 'Fast & Secure', subtitle: 'Tap. Pay. Receive.', image: 'https://images.pexels.com/photos/4050315/pexels-photo-4050315.jpeg' },
];

export default function Onboarding() {
  const [index, setIndex] = useState(0);
  const router = useRouter();
  const slide = SLIDES[index];

    return (
      <View className="flex-1 p-6 justify-center bg-white">
        <Text className="text-2xl font-bold mb-3">Welcome to Empire Deliveries</Text>
        <Text className="mb-4">Fast deliveries in your area. Sign up or login to get started.</Text>
        <Pressable className="bg-yellow-400 py-3 rounded-md w-full items-center" onPress={() => router.push('/customer/auth')}>
          <Text className="text-white font-bold">Get Started</Text>
        </Pressable>
      </View>
    );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A0A' },
  image: { width: '100%', height: '60%', opacity: 0.9 },
  content: { flex: 1, padding: 20, alignItems: 'center' },
  title: { color: '#fff', fontSize: 24, fontWeight: '900' },
  subtitle: { color: '#ddd', marginTop: 8, textAlign: 'center' },
  dot: { width: 8, height: 8, borderRadius: 8, backgroundColor: '#444', margin: 6 },
  dotActive: { backgroundColor: '#D4AF37' },
  button: { backgroundColor: '#D4AF37', padding: 12, borderRadius: 10 },
  buttonText: { fontWeight: '700' }
});
