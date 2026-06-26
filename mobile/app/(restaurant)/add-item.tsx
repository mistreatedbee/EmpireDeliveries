import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { router } from 'expo-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Camera, X, Plus, Trash2 } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import api from '@/services/api';
import { restaurantManagementService } from '@/services/restaurant-management.service';
import {
  Button,
  Input,
  Select,
  EmpireSwitch,
  Card,
  CardBody,
} from '@/components/empire';
import { Colors } from '@/constants/colors';

interface AddonDraft {
  name: string;
  price: string;
}

interface AddonGroupDraft {
  name: string;
  required: boolean;
  addons: AddonDraft[];
}

export default function AddMenuItem() {
  const queryClient = useQueryClient();

  // Form fields
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [isAvailable, setIsAvailable] = useState(true);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [addonGroups, setAddonGroups] = useState<AddonGroupDraft[]>([]);

  // Validation errors
  const [nameError, setNameError] = useState('');
  const [priceError, setPriceError] = useState('');
  const [categoryError, setCategoryError] = useState('');

  // Load categories from menu
  const { data: menu } = useQuery({
    queryKey: ['restaurant', 'menu'],
    queryFn: restaurantManagementService.getMenu,
  });

  const categoryOptions = (menu ?? []).map((c) => ({ label: c.name, value: c.id }));

  // Image picker
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Photo library access is needed to add images.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });
    if (result.canceled || !result.assets[0]) return;
    const asset = result.assets[0];
    setImageUri(asset.uri);
    setUploadingImage(true);
    try {
      const filename = asset.uri.split('/').pop() ?? 'image.jpg';
      const ext = filename.split('.').pop() ?? 'jpg';
      const mimeType = `image/${ext === 'jpg' ? 'jpeg' : ext}`;
      const form = new FormData();
      form.append('file', { uri: asset.uri, name: filename, type: mimeType } as unknown as Blob);
      const res = await api.post<never, { data: { url: string } }>('/uploads/image', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setImageUrl(res.data.url);
    } catch {
      // Upload failed — keep local preview, clear remote url
      setImageUrl(undefined);
      Alert.alert('Upload failed', 'Could not upload image. The item will be saved without an image.');
    } finally {
      setUploadingImage(false);
    }
  };

  const removeImage = () => {
    setImageUri(null);
    setImageUrl(undefined);
  };

  // Addon group helpers
  const addAddonGroup = () => {
    setAddonGroups((prev) => [
      ...prev,
      { name: '', required: false, addons: [{ name: '', price: '' }] },
    ]);
  };

  const removeAddonGroup = (gi: number) => {
    setAddonGroups((prev) => prev.filter((_, i) => i !== gi));
  };

  const updateGroupField = (gi: number, field: 'name' | 'required', value: string | boolean) => {
    setAddonGroups((prev) =>
      prev.map((g, i) => (i === gi ? { ...g, [field]: value } : g))
    );
  };

  const addAddon = (gi: number) => {
    setAddonGroups((prev) =>
      prev.map((g, i) => (i === gi ? { ...g, addons: [...g.addons, { name: '', price: '' }] } : g))
    );
  };

  const removeAddon = (gi: number, ai: number) => {
    setAddonGroups((prev) =>
      prev.map((g, i) =>
        i === gi ? { ...g, addons: g.addons.filter((_, j) => j !== ai) } : g
      )
    );
  };

  const updateAddon = (gi: number, ai: number, field: 'name' | 'price', value: string) => {
    setAddonGroups((prev) =>
      prev.map((g, i) =>
        i === gi
          ? { ...g, addons: g.addons.map((a, j) => (j === ai ? { ...a, [field]: value } : a)) }
          : g
      )
    );
  };

  // Submit mutation
  const addMutation = useMutation({
    mutationFn: () => {
      // Build addonGroups payload (filter empty)
      const addonGroupsPayload = addonGroups
        .filter((g) => g.name.trim())
        .map((g) => ({
          name: g.name.trim(),
          required: g.required,
          addons: g.addons
            .filter((a) => a.name.trim())
            .map((a) => ({
              name: a.name.trim(),
              price: parseFloat(a.price) || 0,
            })),
        }));

      return restaurantManagementService.addItem({
        name: name.trim(),
        description: description.trim() || undefined,
        price: parseFloat(price),
        categoryId,
        imageUrl,
        isAvailable,
        // @ts-ignore — extended payload
        addonGroups: addonGroupsPayload.length > 0 ? addonGroupsPayload : undefined,
      });
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['restaurant', 'menu'] });
      Alert.alert('Item added!', undefined, [{ text: 'OK', onPress: () => router.back() }]);
    },
    onError: () => Alert.alert('Error', 'Could not add item. Please try again.'),
  });

  const handleSubmit = () => {
    let valid = true;

    if (!name.trim()) {
      setNameError('Item name is required');
      valid = false;
    } else {
      setNameError('');
    }

    const parsedPrice = parseFloat(price);
    if (!price || isNaN(parsedPrice) || parsedPrice < 0) {
      setPriceError('Enter a valid price');
      valid = false;
    } else {
      setPriceError('');
    }

    if (!categoryId) {
      setCategoryError('Please select a category');
      valid = false;
    } else {
      setCategoryError('');
    }

    if (!valid) return;
    addMutation.mutate();
  };

  const isSubmitting = addMutation.isPending || uploadingImage;

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-t-surface"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Header */}
      <View className="bg-t-dark px-5 pt-14 pb-4 flex-row items-center gap-3">
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <ArrowLeft size={22} color="#fff" />
        </Pressable>
        <Text
          className="text-white text-xl flex-1"
          style={{ fontFamily: 'Inter_900Black' }}
        >
          Add Menu Item
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={{ padding: 20, paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Basic Info */}
        <Card className="mb-4">
          <CardBody className="py-5">
            <Text
              className="text-t-text text-base mb-4"
              style={{ fontFamily: 'Inter_700Bold' }}
            >
              Item Details
            </Text>

            <Input
              label="Item Name"
              placeholder="e.g. Quarter Chicken"
              value={name}
              onChangeText={setName}
              error={nameError}
              autoCapitalize="words"
            />

            <Input
              label="Description"
              placeholder="Brief description of the item"
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
              style={{ minHeight: 72, paddingTop: 10 }}
            />

            <Input
              label="Price (ZAR)"
              placeholder="0.00"
              value={price}
              onChangeText={setPrice}
              keyboardType="numeric"
              error={priceError}
            />

            <Select
              label="Category"
              placeholder="Select a category"
              options={categoryOptions}
              value={categoryId}
              onChange={setCategoryId}
              error={categoryError}
            />

            {/* Available toggle */}
            <View className="flex-row items-center justify-between py-2">
              <Text
                className="text-t-text text-sm"
                style={{ fontFamily: 'Inter_500Medium' }}
              >
                Available for ordering
              </Text>
              <EmpireSwitch
                checked={isAvailable}
                onChange={setIsAvailable}
              />
            </View>
          </CardBody>
        </Card>

        {/* Image Picker */}
        <Card className="mb-4">
          <CardBody className="py-5">
            <Text
              className="text-t-text text-base mb-4"
              style={{ fontFamily: 'Inter_700Bold' }}
            >
              Item Image
            </Text>

            {imageUri ? (
              <View className="relative">
                <Image
                  source={{ uri: imageUri }}
                  className="w-full rounded-xl"
                  style={{ height: 180 }}
                  resizeMode="cover"
                />
                {uploadingImage && (
                  <View className="absolute inset-0 bg-black/50 rounded-xl items-center justify-center">
                    <Text
                      className="text-white text-sm"
                      style={{ fontFamily: 'Inter_500Medium' }}
                    >
                      Uploading…
                    </Text>
                  </View>
                )}
                <TouchableOpacity
                  onPress={removeImage}
                  className="absolute top-2 right-2 bg-t-danger rounded-full w-8 h-8 items-center justify-center"
                >
                  <X size={16} color="#fff" />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                onPress={pickImage}
                className="border-2 border-dashed border-t-border rounded-xl h-36 items-center justify-center gap-2"
                activeOpacity={0.7}
              >
                <Camera size={28} color="#A3A3A3" />
                <Text
                  className="text-t-textTer text-sm"
                  style={{ fontFamily: 'Inter_400Regular' }}
                >
                  Tap to add photo
                </Text>
              </TouchableOpacity>
            )}
          </CardBody>
        </Card>

        {/* Addon Groups */}
        <Card className="mb-6">
          <CardBody className="py-5">
            <View className="flex-row items-center justify-between mb-4">
              <Text
                className="text-t-text text-base"
                style={{ fontFamily: 'Inter_700Bold' }}
              >
                Addon Groups
              </Text>
              <Button
                variant="secondary"
                size="sm"
                leftIcon={<Plus size={14} color="#0A0A0A" />}
                onPress={addAddonGroup}
              >
                Add Group
              </Button>
            </View>

            {addonGroups.length === 0 && (
              <Text
                className="text-t-textTer text-sm text-center py-2"
                style={{ fontFamily: 'Inter_400Regular' }}
              >
                No addon groups yet. Tap "Add Group" to add extras like sauces or sides.
              </Text>
            )}

            {addonGroups.map((group, gi) => (
              <View
                key={gi}
                className="border border-t-border rounded-xl p-4 mb-3"
              >
                {/* Group header */}
                <View className="flex-row items-center gap-2 mb-3">
                  <View className="flex-1">
                    <Input
                      label="Group Name"
                      placeholder="e.g. Choose a sauce"
                      value={group.name}
                      onChangeText={(v) => updateGroupField(gi, 'name', v)}
                    />
                  </View>
                  <TouchableOpacity
                    onPress={() => removeAddonGroup(gi)}
                    className="mb-4 w-9 h-9 rounded-full bg-t-dangerBg items-center justify-center"
                  >
                    <Trash2 size={15} color="#C53030" />
                  </TouchableOpacity>
                </View>

                {/* Required toggle */}
                <View className="flex-row items-center justify-between mb-3">
                  <Text
                    className="text-t-textSec text-sm"
                    style={{ fontFamily: 'Inter_400Regular' }}
                  >
                    Required selection
                  </Text>
                  <EmpireSwitch
                    checked={group.required}
                    onChange={(v) => updateGroupField(gi, 'required', v)}
                  />
                </View>

                {/* Addon rows */}
                <Text
                  className="text-t-textSec text-xs mb-2"
                  style={{ fontFamily: 'Inter_500Medium' }}
                >
                  OPTIONS
                </Text>

                {group.addons.map((addon, ai) => (
                  <View key={ai} className="flex-row items-start gap-2">
                    <View className="flex-1">
                      <Input
                        placeholder="Option name"
                        value={addon.name}
                        onChangeText={(v) => updateAddon(gi, ai, 'name', v)}
                      />
                    </View>
                    <View style={{ width: 90 }}>
                      <Input
                        placeholder="Price"
                        value={addon.price}
                        onChangeText={(v) => updateAddon(gi, ai, 'price', v)}
                        keyboardType="numeric"
                      />
                    </View>
                    {group.addons.length > 1 && (
                      <TouchableOpacity
                        onPress={() => removeAddon(gi, ai)}
                        className="mt-1 w-9 h-9 rounded-full bg-t-surface2 items-center justify-center"
                      >
                        <X size={14} color="#6B6B6B" />
                      </TouchableOpacity>
                    )}
                  </View>
                ))}

                <Button
                  variant="ghost"
                  size="sm"
                  leftIcon={<Plus size={14} color="#C9A227" />}
                  onPress={() => addAddon(gi)}
                  className="self-start mt-1"
                >
                  <Text
                    className="text-t-gold text-sm"
                    style={{ fontFamily: 'Inter_500Medium' }}
                  >
                    Add option
                  </Text>
                </Button>
              </View>
            ))}
          </CardBody>
        </Card>

        {/* Submit */}
        <Button
          variant="primary"
          size="lg"
          fullWidth
          loading={isSubmitting}
          disabled={isSubmitting}
          onPress={handleSubmit}
        >
          Add to Menu
        </Button>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
