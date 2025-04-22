// LoadingIndicator.js
import React from 'react';
import { ActivityIndicator } from 'react-native-paper';

export default function LoadingIndicator() {
  return <ActivityIndicator animating={true} size="large" style={{ marginVertical: 16 }} />;
} 