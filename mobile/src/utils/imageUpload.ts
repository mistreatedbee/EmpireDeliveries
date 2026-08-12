import * as ImagePicker from 'expo-image-picker';
import { Alert } from 'react-native';
import api from '@/services/api';

export async function uploadImageFromPicker(folder: string): Promise<string | null> {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== 'granted') {
    Alert.alert('Permission required', 'Photo library access is needed to upload images.');
    return null;
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    allowsEditing: true,
    quality: 0.85,
  });

  if (result.canceled || !result.assets[0]) return null;

  const asset = result.assets[0];
  const filename = asset.uri.split('/').pop() ?? 'image.jpg';
  const ext = filename.split('.').pop()?.toLowerCase() ?? 'jpg';
  const mimeType = ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg' : `image/${ext}`;

  const form = new FormData();
  form.append('file', { uri: asset.uri, name: filename, type: mimeType } as unknown as Blob);
  form.append('folder', folder);

  const res = await api.post<never, { data: { url: string } }>('/uploads/image', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return res.data.url;
}
