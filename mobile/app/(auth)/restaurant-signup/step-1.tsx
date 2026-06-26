import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, KeyboardAvoidingView, Platform, TextInput } from 'react-native';
import { router } from 'expo-router';
import { ArrowLeft, ChevronDown } from 'lucide-react-native';
import { Input, Button } from '@/components/empire';
import { authService } from '@/services/auth.service';
import { useAuthStore } from '@/stores/authStore';
import { useUIStore } from '@/stores/uiStore';
import { isValidEmail, isValidSAPhone, normalizeSAPhone } from '@/utils/validators';
import { T, Fonts } from '@/constants/colors';
import { AppError } from '@/types/api.types';

const CUISINES = [
  'South African',
  'Fast Food',
  'Pizza',
  'Burgers',
  'Sushi',
  'Indian',
  'Chinese',
  'Healthy',
  'Bakery',
  'Other',
] as const;

function StepHeader({ current, total, title }: { current: number; total: number; title: string }) {
  return (
    <View style={{ paddingHorizontal: 24, paddingTop: 56, paddingBottom: 20 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <ArrowLeft size={22} color={T.text} />
        </Pressable>
        <View style={{ flex: 1, flexDirection: 'row', gap: 4 }}>
          {Array.from({ length: total }).map((_, i) => (
            <View
              key={i}
              style={{ flex: 1, height: 3, borderRadius: 2, backgroundColor: i < current ? T.gold : T.border }}
            />
          ))}
        </View>
        <Text style={{ fontFamily: Fonts.bodyBold, color: T.textTer, fontSize: 12 }}>
          {current}/{total}
        </Text>
      </View>
      <Text style={{ fontFamily: Fonts.headingExtra, color: T.text, fontSize: 24 }}>{title}</Text>
    </View>
  );
}

export default function RestaurantStep1() {
  const { user } = useAuthStore();
  const { showToast } = useUIStore();
  const isLoggedIn = !!user;

  const [tradingName, setTradingName] = useState('');
  const [cuisineType, setCuisineType] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [showCuisineDropdown, setShowCuisineDropdown] = useState(false);
  const [loading, setLoading] = useState(false);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!tradingName.trim()) e.tradingName = 'Trading name is required';
    if (!cuisineType) e.cuisineType = 'Please select a cuisine type';
    if (!description.trim()) e.description = 'Description is required';
    if (!address.trim()) e.address = 'Physical address is required';
    if (!isLoggedIn) {
      if (!firstName.trim()) e.firstName = 'First name is required';
      if (!lastName.trim()) e.lastName = 'Last name is required';
      if (!isValidEmail(email)) e.email = 'Please enter a valid email address';
      if (!isValidSAPhone(phone)) e.phone = 'Please enter a valid South African phone number';
      if (password.length < 8) e.password = 'Password must be at least 8 characters';
      if (password !== confirm) e.confirm = 'Passwords do not match';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const businessParams = () => ({
    tradingName: tradingName.trim(),
    cuisineType,
    description: description.trim(),
    address: address.trim(),
  });

  const handleNext = async () => {
    if (!validate()) return;

    if (isLoggedIn) {
      router.push({ pathname: '/(auth)/restaurant-signup/step-2', params: businessParams() });
      return;
    }

    setLoading(true);
    try {
      await authService.register({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim().toLowerCase(),
        phone: normalizeSAPhone(phone),
        password,
      });
      router.push({
        pathname: '/(auth)/otp',
        params: {
          email: email.trim().toLowerCase(),
          phone: normalizeSAPhone(phone),
          purpose: 'registration',
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          role: 'restaurant',
          nextRoute: '/(auth)/restaurant-signup/step-2',
          ...businessParams(),
        },
      });
    } catch (error: any) {
      const appError = error as AppError;
      if (appError.message === 'User already exists') {
        showToast('An account with this email already exists. Please log in instead.', 'error');
        router.push('/(auth)/login');
      } else if (appError.field) {
        setErrors((e) => ({ ...e, [appError.field!]: appError.message }));
      } else {
        showToast(appError.message ?? 'Something went wrong', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: T.bg }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StepHeader current={1} total={4} title="Restaurant Details" />
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 60 }}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={{ fontFamily: Fonts.body, color: T.textSec, fontSize: 14, marginBottom: 24 }}>
          Tell us about your restaurant or store.
        </Text>

        <Input
          label="Trading Name"
          value={tradingName}
          onChangeText={setTradingName}
          placeholder="e.g. Empire Burgers"
          autoCapitalize="words"
          error={errors.tradingName}
        />

        <View style={{ marginBottom: 16 }}>
          <Text style={{ fontFamily: Fonts.bodyBold, color: T.textTer, fontSize: 12, marginBottom: 6, letterSpacing: 0.5 }}>
            CUISINE TYPE
          </Text>
          <Pressable
            onPress={() => setShowCuisineDropdown((v) => !v)}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              borderWidth: 1.5,
              borderColor: errors.cuisineType ? T.danger : T.border,
              borderRadius: 12,
              backgroundColor: T.surface2,
              paddingHorizontal: 14,
              paddingVertical: 13,
            }}
          >
            <Text style={{ flex: 1, fontFamily: Fonts.body, color: cuisineType ? T.text : T.textTer, fontSize: 15 }}>
              {cuisineType || 'Select cuisine type'}
            </Text>
            <ChevronDown size={18} color={T.textTer} />
          </Pressable>
          {errors.cuisineType && (
            <Text style={{ fontFamily: Fonts.body, color: T.danger, fontSize: 12, marginTop: 4 }}>{errors.cuisineType}</Text>
          )}
          {showCuisineDropdown && (
            <View
              style={{
                backgroundColor: T.surface,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: T.border,
                marginTop: 4,
                overflow: 'hidden',
              }}
            >
              {CUISINES.map((c) => (
                <Pressable
                  key={c}
                  onPress={() => {
                    setCuisineType(c);
                    setShowCuisineDropdown(false);
                  }}
                  style={{
                    paddingHorizontal: 16,
                    paddingVertical: 13,
                    borderBottomWidth: 1,
                    borderBottomColor: T.border,
                    backgroundColor: cuisineType === c ? T.goldBg : 'transparent',
                  }}
                >
                  <Text
                    style={{
                      fontFamily: cuisineType === c ? Fonts.bodyBold : Fonts.body,
                      color: cuisineType === c ? T.goldDeep : T.textSec,
                      fontSize: 14,
                    }}
                  >
                    {c}
                  </Text>
                </Pressable>
              ))}
            </View>
          )}
        </View>

        <View style={{ marginBottom: 16 }}>
          <Text style={{ fontFamily: Fonts.bodyBold, color: T.textTer, fontSize: 12, marginBottom: 6, letterSpacing: 0.5 }}>
            DESCRIPTION
          </Text>
          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder="Brief description of your restaurant and what makes it special..."
            placeholderTextColor={T.textTer}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            style={{
              borderWidth: 1.5,
              borderColor: errors.description ? T.danger : T.border,
              borderRadius: 12,
              backgroundColor: T.surface2,
              paddingHorizontal: 14,
              paddingVertical: 12,
              fontFamily: Fonts.body,
              color: T.text,
              fontSize: 15,
              minHeight: 100,
            }}
          />
          {errors.description && (
            <Text style={{ fontFamily: Fonts.body, color: T.danger, fontSize: 12, marginTop: 4 }}>{errors.description}</Text>
          )}
        </View>

        <Input
          label="Physical Address"
          value={address}
          onChangeText={setAddress}
          placeholder="e.g. 12 Main Road, Sandton, Johannesburg"
          autoCapitalize="words"
          error={errors.address}
        />

        {!isLoggedIn && (
          <>
            <View style={{ height: 1, backgroundColor: T.border, marginVertical: 20 }} />
            <Text style={{ fontFamily: Fonts.body, color: T.textSec, fontSize: 14, marginBottom: 16 }}>
              Create your owner account
            </Text>

            <View style={{ flexDirection: 'row', gap: 12 }}>
              <View style={{ flex: 1 }}>
                <Input
                  label="First Name"
                  value={firstName}
                  onChangeText={setFirstName}
                  autoCapitalize="words"
                  error={errors.firstName}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Input
                  label="Last Name"
                  value={lastName}
                  onChangeText={setLastName}
                  autoCapitalize="words"
                  error={errors.lastName}
                />
              </View>
            </View>

            <Input
              label="Email Address"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholder="you@example.com"
              error={errors.email}
            />

            <Input
              label="Phone Number"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              placeholder="+27 8X XXX XXXX"
              error={errors.phone}
            />

            <Input
              label="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              placeholder="Min. 8 characters"
              error={errors.password}
              rightIcon={
                <Text style={{ fontFamily: Fonts.bodySemibold, color: T.gold, fontSize: 13 }}>
                  {showPassword ? 'Hide' : 'Show'}
                </Text>
              }
              onRightIconPress={() => setShowPassword((p) => !p)}
            />

            <Input
              label="Confirm Password"
              value={confirm}
              onChangeText={setConfirm}
              secureTextEntry
              placeholder="Repeat password"
              error={errors.confirm}
            />
          </>
        )}

        <View style={{ marginTop: 8 }}>
          <Button onPress={handleNext} loading={loading} size="lg">
            Next
          </Button>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
