import React, { useState } from 'react';
import { View, Text, LayoutChangeEvent } from 'react-native';
import Svg, { Path, Rect, Line, Text as SvgText, Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import { T } from '@/constants/colors';

export type ChartType = 'line' | 'bar' | 'area';

export interface ChartProps {
  type?: ChartType;
  data: Array<Record<string, any>>;
  xKey: string;
  dataKey: string;
  height?: number;
  color?: string;
}

const PAD = { top: 16, right: 16, bottom: 28, left: 40 };
const GRADIENT_ID = 'empireChartGradient';

export function Chart({ type = 'line', data, xKey, dataKey, height = 240, color = T.gold }: ChartProps) {
  const [width, setWidth] = useState(300);

  const onLayout = (e: LayoutChangeEvent) => {
    setWidth(e.nativeEvent.layout.width);
  };

  const values = data.map((d) => Number(d[dataKey]) || 0);
  const max = Math.max(...values, 1);
  const innerW = Math.max(0, width - PAD.left - PAD.right);
  const innerH = height - PAD.top - PAD.bottom;

  const xPos = (i: number) =>
    PAD.left + (data.length <= 1 ? innerW / 2 : (i / (data.length - 1)) * innerW);
  const yPos = (v: number) => PAD.top + innerH - (v / max) * innerH;

  const linePath = data
    .map((d, i) => `${i === 0 ? 'M' : 'L'} ${xPos(i)} ${yPos(Number(d[dataKey]) || 0)}`)
    .join(' ');

  const areaPath = `${linePath} L ${xPos(data.length - 1)} ${PAD.top + innerH} L ${xPos(0)} ${PAD.top + innerH} Z`;

  const gridLines = [0, 0.25, 0.5, 0.75, 1];

  return (
    <View onLayout={onLayout} style={{ width: '100%', height }}>
      <Svg width={width} height={height}>
        <Defs>
          <LinearGradient id={GRADIENT_ID} x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor={color} stopOpacity={0.35} />
            <Stop offset="100%" stopColor={color} stopOpacity={0} />
          </LinearGradient>
        </Defs>

        {/* Grid lines */}
        {gridLines.map((g) => (
          <Line
            key={g}
            x1={PAD.left}
            x2={PAD.left + innerW}
            y1={PAD.top + innerH - g * innerH}
            y2={PAD.top + innerH - g * innerH}
            stroke={T.border}
            strokeDasharray="3 3"
          />
        ))}

        {/* Y-axis labels */}
        {gridLines.map((g) => (
          <SvgText
            key={`y-${g}`}
            x={PAD.left - 6}
            y={PAD.top + innerH - g * innerH + 4}
            textAnchor="end"
            fontSize={10}
            fill={T.textTer}
          >
            {Math.round(g * max)}
          </SvgText>
        ))}

        {/* X-axis labels */}
        {data.map((d, i) => (
          <SvgText
            key={`x-${i}`}
            x={xPos(i)}
            y={height - 6}
            textAnchor="middle"
            fontSize={10}
            fill={T.textTer}
          >
            {String(d[xKey])}
          </SvgText>
        ))}

        {/* Bar chart */}
        {type === 'bar' &&
          data.map((d, i) => {
            const v = Number(d[dataKey]) || 0;
            const bw = Math.max(4, innerW / data.length / 1.8);
            return (
              <Rect
                key={i}
                x={xPos(i) - bw / 2}
                y={yPos(v)}
                width={bw}
                height={PAD.top + innerH - yPos(v)}
                rx={6}
                fill={color}
              />
            );
          })}

        {/* Area chart */}
        {type === 'area' && (
          <>
            <Path d={areaPath} fill={`url(#${GRADIENT_ID})`} />
            <Path d={linePath} fill="none" stroke={color} strokeWidth={2} />
          </>
        )}

        {/* Line chart */}
        {type === 'line' && <Path d={linePath} fill="none" stroke={color} strokeWidth={2} />}

        {/* Data point circles */}
        {type !== 'bar' &&
          data.map((d, i) => (
            <Circle
              key={i}
              cx={xPos(i)}
              cy={yPos(Number(d[dataKey]) || 0)}
              r={3}
              fill={color}
            />
          ))}
      </Svg>
    </View>
  );
}
