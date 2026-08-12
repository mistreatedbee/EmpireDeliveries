import React from 'react';
import { type ViewStyle } from 'react-native';
import RNMapView, { Marker as RNMarker, type Region } from 'react-native-maps';

export interface PlatformMapMarker {
  id: string;
  latitude: number;
  longitude: number;
  children: React.ReactElement;
}

interface PlatformMapProps {
  style?: ViewStyle;
  region: Region;
  markers: PlatformMapMarker[];
}

/** Use react-native-maps everywhere on Android — MapLibre native modules break Expo Go. */
export function PlatformMap({ style, region, markers }: PlatformMapProps) {
  return (
    <RNMapView style={style} region={region} initialRegion={region}>
      {markers.map((m) => (
        <RNMarker key={m.id} coordinate={{ latitude: m.latitude, longitude: m.longitude }}>
          {m.children}
        </RNMarker>
      ))}
    </RNMapView>
  );
}
