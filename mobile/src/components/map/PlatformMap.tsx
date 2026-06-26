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

export function PlatformMap({ style, region, markers }: PlatformMapProps) {
  return (
    <RNMapView style={style} initialRegion={region}>
      {markers.map((m) => (
        <RNMarker key={m.id} coordinate={{ latitude: m.latitude, longitude: m.longitude }}>
          {m.children}
        </RNMarker>
      ))}
    </RNMapView>
  );
}
