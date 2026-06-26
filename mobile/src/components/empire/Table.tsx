import React, { useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import { ChevronUpIcon, ChevronDownIcon, ChevronsUpDownIcon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react-native';
import { T, Fonts } from '@/constants/colors';

export interface Column<T> {
  key: string;
  header: string;
  sortable?: boolean;
  align?: 'left' | 'right' | 'center';
  render?: (row: T) => React.ReactNode;
  accessor?: (row: T) => string | number;
  width?: number;
}

export interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  pageSize?: number;
  rowKey?: (row: T, index: number) => string | number;
}

export function Table<T extends Record<string, any>>({ columns, data, pageSize = 8, rowKey }: TableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useState(0);

  const sorted = useMemo(() => {
    if (!sortKey) return data;
    const col = columns.find((c) => c.key === sortKey);
    if (!col) return data;
    const get = col.accessor ?? ((row: T) => row[sortKey]);
    return [...data].sort((a, b) => {
      const av = get(a);
      const bv = get(b);
      if (av < bv) return sortDir === 'asc' ? -1 : 1;
      if (av > bv) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, columns, sortKey, sortDir]);

  const pageCount = Math.max(1, Math.ceil(sorted.length / pageSize));
  const current = Math.min(page, pageCount - 1);
  const rows = sorted.slice(current * pageSize, current * pageSize + pageSize);

  const toggleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const alignStyle = (align?: 'left' | 'right' | 'center'): 'flex-start' | 'flex-end' | 'center' => {
    if (align === 'right') return 'flex-end';
    if (align === 'center') return 'center';
    return 'flex-start';
  };

  return (
    <View
      style={{
        borderRadius: 16,
        borderWidth: 1,
        borderColor: T.border,
        overflow: 'hidden',
        backgroundColor: T.surface,
      }}
    >
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View>
          {/* Header */}
          <View
            className="flex-row"
            style={{ borderBottomWidth: 1, borderBottomColor: T.border }}
          >
            {columns.map((col) => (
              <View
                key={col.key}
                style={{ width: col.width ?? 120, padding: 12, alignItems: alignStyle(col.align) }}
              >
                {col.sortable ? (
                  <TouchableOpacity
                    onPress={() => toggleSort(col.key)}
                    className="flex-row items-center gap-1"
                  >
                    <Text style={{ fontFamily: Fonts.bodySemibold, color: T.textSec, fontSize: 13 }}>
                      {col.header}
                    </Text>
                    {sortKey === col.key ? (
                      sortDir === 'asc' ? (
                        <ChevronUpIcon size={12} color={T.gold} />
                      ) : (
                        <ChevronDownIcon size={12} color={T.gold} />
                      )
                    ) : (
                      <ChevronsUpDownIcon size={12} color={T.textTer} />
                    )}
                  </TouchableOpacity>
                ) : (
                  <Text style={{ fontFamily: Fonts.bodySemibold, color: T.textSec, fontSize: 13 }}>
                    {col.header}
                  </Text>
                )}
              </View>
            ))}
          </View>

          {/* Rows */}
          {rows.map((row, i) => (
            <View
              key={rowKey ? rowKey(row, i) : i}
              className="flex-row"
              style={{
                borderBottomWidth: i < rows.length - 1 ? 1 : 0,
                borderBottomColor: T.border,
              }}
            >
              {columns.map((col) => (
                <View
                  key={col.key}
                  style={{ width: col.width ?? 120, padding: 12, alignItems: alignStyle(col.align) }}
                >
                  {col.render ? (
                    col.render(row)
                  ) : (
                    <Text style={{ fontFamily: Fonts.body, color: T.text, fontSize: 13 }}>
                      {String(row[col.key] ?? '')}
                    </Text>
                  )}
                </View>
              ))}
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Pagination */}
      {pageCount > 1 && (
        <View
          className="flex-row items-center justify-between px-4 py-3"
          style={{ borderTopWidth: 1, borderTopColor: T.border }}
        >
          <Text style={{ fontFamily: Fonts.body, color: T.textSec, fontSize: 13 }}>
            Page {current + 1} of {pageCount}
          </Text>
          <View className="flex-row gap-2">
            <TouchableOpacity
              onPress={() => setPage(Math.max(0, current - 1))}
              disabled={current === 0}
              className="h-8 w-8 items-center justify-center rounded-full"
              style={{ backgroundColor: T.surface2, opacity: current === 0 ? 0.4 : 1 }}
            >
              <ChevronLeftIcon size={16} color={T.text} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setPage(Math.min(pageCount - 1, current + 1))}
              disabled={current === pageCount - 1}
              className="h-8 w-8 items-center justify-center rounded-full"
              style={{ backgroundColor: T.surface2, opacity: current === pageCount - 1 ? 0.4 : 1 }}
            >
              <ChevronRightIcon size={16} color={T.text} />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}
