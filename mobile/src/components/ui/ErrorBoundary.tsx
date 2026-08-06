import React from 'react';
import { View, Text } from 'react-native';
import { Button } from './Button';
import { T } from '@/constants/colors';

interface Props {
  children: React.ReactNode;
  /** Optional label shown in the fallback so crash reports/screenshots identify which boundary tripped. */
  scope?: string;
}

interface State {
  error: Error | null;
}

/**
 * Last-resort crash guard. Without this, any uncaught render error anywhere in the
 * tree unmounts the whole screen and React Native shows a blank white view with no
 * indication anything went wrong (see: "food item / reviews / restaurant page is
 * blank" reports). This renders a recoverable fallback instead.
 *
 * Not a substitute for fixing the underlying error, and not a network-error handler —
 * screens should still handle their own loading/error/empty query states. This only
 * catches what those don't: genuine render-time exceptions.
 */
export class ErrorBoundary extends React.Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    if (__DEV__) {
      console.error(`[ErrorBoundary${this.props.scope ? `:${this.props.scope}` : ''}]`, error, info.componentStack);
    }
  }

  reset = () => this.setState({ error: null });

  render() {
    if (this.state.error) {
      return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32, backgroundColor: T.bg }}>
          <Text style={{ fontSize: 18, fontWeight: '800', color: T.text, marginBottom: 8, textAlign: 'center' }}>
            Something went wrong
          </Text>
          <Text style={{ fontSize: 14, color: T.textSec, textAlign: 'center', marginBottom: 24, lineHeight: 20 }}>
            This screen hit an unexpected error. You can try again, or go back and retry.
          </Text>
          <Button variant="primary" onPress={this.reset}>Try again</Button>
        </View>
      );
    }
    return this.props.children;
  }
}
