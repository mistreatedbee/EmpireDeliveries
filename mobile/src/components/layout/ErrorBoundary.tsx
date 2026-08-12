import React, { Component, type ReactNode } from 'react';
import { View, Text, Pressable } from 'react-native';
import { T } from '@/constants/colors';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    if (__DEV__) console.error('[ErrorBoundary]', error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, backgroundColor: T.bg }}>
          <Text style={{ fontSize: 18, fontWeight: '800', color: T.text, marginBottom: 8 }}>
            Something went wrong
          </Text>
          <Text style={{ fontSize: 14, color: T.textSec, textAlign: 'center', marginBottom: 20 }}>
            An unexpected error occurred. Please restart the app or try again.
          </Text>
          <Pressable
            onPress={() => this.setState({ hasError: false })}
            style={{ backgroundColor: T.action, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 10 }}
          >
            <Text style={{ color: '#FFF', fontWeight: '700' }}>Try again</Text>
          </Pressable>
        </View>
      );
    }

    return this.props.children;
  }
}
