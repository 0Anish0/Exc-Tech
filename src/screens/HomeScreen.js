// HomeScreen.js
import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Text, Button, Card } from 'react-native-paper';
import { supabase } from '../api/supabase/client';
import { useAuth } from '../store/AuthContext';
import UserTable from '../components/UserTable';
import LoadingIndicator from '../components/LoadingIndicator';
import { registerForPushNotificationsAsync } from '../utils/notifications';
import { savePushToken, getPushToken } from '../api/supabase/pushTokens';

export default function HomeScreen() {
  const { signOut, user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    // Register for push notifications and save token
    const setupPushNotifications = async () => {
      if (!user) return;
      const token = await registerForPushNotificationsAsync();
      if (token) {
        await savePushToken({ user_id: user.id, expo_push_token: token });
      }
    };
    setupPushNotifications();
  }, [user]);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      const accessToken = session?.access_token;
      if (!accessToken) {
        setLoading(false);
        return;
      }
      const { data, error } = await supabase.functions.invoke('swift-api', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (error) {
        console.error('Edge Function error:', error);
      }
      if (data && data.users) setUsers(data.users);
      setLoading(false);
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    // Debug: Log the current user's access token for Postman testing
    const logAccessToken = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.access_token) {
        console.log('Access Token:', session.access_token);
      }
    };
    if (user) logAccessToken();
  }, [user]);

  // Send test notification
  const handleSendTestNotification = async () => {
    setSending(true);
    try {
      // Get the current user's push token from Supabase
      const token = await getPushToken(user.id);
      if (!token) throw new Error('No push token found for this user.');
      // Call an Edge Function to send the notification
      const { data, error } = await supabase.functions.invoke('send-push', {
        body: { expoPushToken: token },
      });
      if (error) throw error;
      alert('Test notification sent!');
    } catch (err) {
      alert('Failed to send notification: ' + err.message);
    }
    setSending(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Welcome{user && user.email ? `, ${user.email}` : ''}!</Text>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Card style={styles.card}>
          <Text variant="titleLarge" style={styles.title}>All Registered Users</Text>
          {loading ? <LoadingIndicator /> : <UserTable users={users} />}
        </Card>
        <Button
          mode="contained"
          onPress={handleSendTestNotification}
          loading={sending}
          style={[styles.button, { backgroundColor: '#007AFF', marginBottom: 8 }]}
        >
          Send Test Notification
        </Button>
        <Button mode="outlined" onPress={signOut} style={styles.button}>
          Logout
        </Button>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f8fa',
    paddingTop: 32,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#222',
    textAlign: 'center',
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    padding: 16,
  },
  card: {
    width: '100%',
    maxWidth: 500,
    padding: 24,
    borderRadius: 20,
    elevation: 8,
    backgroundColor: '#fff',
    marginBottom: 20,
  },
  title: {
    marginBottom: 18,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#222',
  },
  button: {
    alignSelf: 'center',
    borderRadius: 8,
    marginTop: 8,
    paddingHorizontal: 24,
    paddingVertical: 4,
  },
});