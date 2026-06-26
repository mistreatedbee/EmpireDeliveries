import React from 'react';
import { type ViewStyle } from 'react-native';
import { type Region } from 'react-native-maps';
import {
  Map as MapLibreMapView,
  Camera as MapLibreCamera,
  Marker as MapLibreMarker,
} from '@maplibre/maplibre-react-native';

// Android has no built-in (Google-free) map renderer, so it uses MapLibre with
// raw OpenStreetMap raster tiles instead of react-native-maps' Google provider.
const OSM_STYLE = {
  version: 8 as const,
  sources: {
    osm: {
      type: 'raster' as const,
      tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
      tileSize: 256,
      attribution: '© OpenStreetMap contributors',
    },
  },
  layers: [{ id: 'osm', type: 'raster' as const, source: 'osm' }],
};

function zoomFromDelta(longitudeDelta: number): number {
  return Math.log2(360 / longitudeDelta);
}

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
    <MapLibreMapView style={style} mapStyle={OSM_STYLE} attribution={false} logo={false}>
      <MapLibreCamera
        initialViewState={{
          center: [region.longitude, region.latitude],
          zoom: zoomFromDelta(region.longitudeDelta),
        }}
      />
      {markers.map((m) => (
        <MapLibreMarker key={m.id} id={m.id} lngLat={[m.longitude, m.latitude]}>
          {m.children}
        </MapLibreMarker>
      ))}
    </MapLibreMapView>
  );
}
