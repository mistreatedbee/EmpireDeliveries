import { Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import api from '@/services/api';

export interface PickedFile {
  uri: string;
  name: string;
  mimeType: string;
}

function pickFromCamera(): Promise<PickedFile | null> {
  return new Promise((resolve) => {
    ImagePicker.requestCameraPermissionsAsync()
      .then(({ status }) => {
        if (status !== 'granted') {
          resolve(null);
          return;
        }
        return ImagePicker.launchCameraAsync({ allowsEditing: true, quality: 0.8, aspect: [4, 3] });
      })
      .then((result) => {
        if (!result || result.canceled || !result.assets?.[0]) {
          resolve(null);
          return;
        }
        const asset = result.assets[0];
        resolve({ uri: asset.uri, name: asset.fileName ?? 'photo.jpg', mimeType: asset.mimeType ?? 'image/jpeg' });
      })
      .catch(() => resolve(null));
  });
}

function pickFromLibrary(): Promise<PickedFile | null> {
  return new Promise((resolve) => {
    ImagePicker.requestMediaLibraryPermissionsAsync()
      .then(({ status }) => {
        if (status !== 'granted') {
          resolve(null);
          return;
        }
        return ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          quality: 0.8,
          aspect: [4, 3],
        });
      })
      .then((result) => {
        if (!result || result.canceled || !result.assets?.[0]) {
          resolve(null);
          return;
        }
        const asset = result.assets[0];
        resolve({ uri: asset.uri, name: asset.fileName ?? 'photo.jpg', mimeType: asset.mimeType ?? 'image/jpeg' });
      })
      .catch(() => resolve(null));
  });
}

async function pickDocumentFile(): Promise<PickedFile | null> {
  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
      copyToCacheDirectory: true,
    });
    if (result.canceled || !result.assets?.[0]) return null;
    const asset = result.assets[0];
    return { uri: asset.uri, name: asset.name, mimeType: asset.mimeType ?? 'application/pdf' };
  } catch {
    return null;
  }
}

export function pickDocumentOrImage(): Promise<PickedFile | null> {
  return new Promise((resolve) => {
    Alert.alert('Upload Document', 'How would you like to add this document?', [
      { text: 'Take Photo', onPress: () => pickFromCamera().then(resolve) },
      { text: 'Choose Photo', onPress: () => pickFromLibrary().then(resolve) },
      { text: 'Choose PDF / Word File', onPress: () => pickDocumentFile().then(resolve) },
      { text: 'Cancel', style: 'cancel', onPress: () => resolve(null) },
    ]);
  });
}

export async function uploadFile(file: PickedFile, folder: string): Promise<string> {
  const formData = new FormData();
  formData.append('file', { uri: file.uri, name: file.name, type: file.mimeType } as any);
  formData.append('folder', folder);

  const res = await api.post('/uploads', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  const url = (res as any)?.url ?? (res as any)?.data?.url ?? '';
  if (!url) throw new Error('Upload failed — no URL returned');
  return url as string;
}
