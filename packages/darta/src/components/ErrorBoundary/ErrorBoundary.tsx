import React from 'react';
import analytics from '@react-native-firebase/analytics';
import crashlytics from '@react-native-firebase/crashlytics';

interface ErrorBoundaryProps {
  children: React.ReactNode; // Typing children prop
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    const isDev = process.env.EXPO_PUBLIC_ENVIRONMENT === "development";
    if (!isDev) {
      analytics().logEvent('crash', { error, errorInfo });
      crashlytics().recordError(error);
      crashlytics().log(error.message);
    }
  }

  render() {
    return this.props.children;
  }
}

export default ErrorBoundary;
