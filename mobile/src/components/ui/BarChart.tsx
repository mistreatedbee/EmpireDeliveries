import React from 'react';
import { View } from 'react-native';
import Svg, { Rect, Text as SvgText, G } from 'react-native-svg';

interface BarChartProps {
  data: Array<{ label: string; value: number }>;
  barColor?: string;
  height?: number;
  formatValue?: (v: number) => string;
}

const CHART_PADDING = { top: 20, bottom: 32, left: 4, right: 4 };

export function BarChart({ data, barColor = '#C9A227', height = 180, formatValue }: BarChartProps) {
  const maxValue = Math.max(...data.map((d) => d.value), 1);
  const chartHeight = height - CHART_PADDING.top - CHART_PADDING.bottom;

  return (
    <View style={{ width: '100%', height }}>
      <Svg width="100%" height={height} viewBox={`0 0 ${data.length * 48} ${height}`}>
        {data.map((item, i) => {
          const barH = Math.max((item.value / maxValue) * chartHeight, item.value > 0 ? 4 : 0);
          const x = i * 48 + 6;
          const barWidth = 36;
          const barY = CHART_PADDING.top + chartHeight - barH;
          const labelY = height - 4;
          const valueY = barY - 5;

          return (
            <G key={i}>
              <Rect
                x={x}
                y={barY}
                width={barWidth}
                height={barH}
                rx={6}
                fill={barColor}
                fillOpacity={item.value === 0 ? 0.2 : 1}
              />
              {item.value > 0 && formatValue && (
                <SvgText
                  x={x + barWidth / 2}
                  y={valueY}
                  fontSize={9}
                  fontWeight="700"
                  fill={barColor}
                  textAnchor="middle"
                >
                  {formatValue(item.value)}
                </SvgText>
              )}
              <SvgText
                x={x + barWidth / 2}
                y={labelY}
                fontSize={10}
                fill="#888"
                textAnchor="middle"
              >
                {item.label}
              </SvgText>
            </G>
          );
        })}
      </Svg>
    </View>
  );
}
