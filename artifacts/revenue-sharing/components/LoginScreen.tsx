import * as Haptics from "expo-haptics";
import React, { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useAuth } from "@/context/AuthContext";
import { useColors } from "@/hooks/useColors";

export default function LoginScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      setError("Please enter username and password");
      return;
    }
    setError("");
    setLoading(true);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const ok = await login(username.trim(), password.trim());
    setLoading(false);
    if (!ok) {
      setError("Invalid username or password");
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.primary,
      paddingTop: insets.top,
      paddingBottom: insets.bottom,
    },
    topSection: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 32,
    },
    logoContainer: {
      width: 80,
      height: 80,
      borderRadius: 24,
      backgroundColor: "rgba(255,255,255,0.2)",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 20,
    },
    logoText: {
      fontSize: 36,
      fontWeight: "700" as const,
      color: colors.primaryForeground,
    },
    appName: {
      fontSize: 28,
      fontWeight: "700" as const,
      color: colors.primaryForeground,
      marginBottom: 4,
      fontFamily: "Inter_700Bold",
    },
    tagline: {
      fontSize: 14,
      color: "rgba(255,255,255,0.75)",
      fontFamily: "Inter_400Regular",
      textAlign: "center",
    },
    card: {
      backgroundColor: colors.card,
      borderTopLeftRadius: 32,
      borderTopRightRadius: 32,
      padding: 32,
      paddingBottom: Math.max(32, insets.bottom + 16),
    },
    cardTitle: {
      fontSize: 22,
      fontWeight: "700" as const,
      color: colors.foreground,
      marginBottom: 4,
      fontFamily: "Inter_700Bold",
    },
    cardSubtitle: {
      fontSize: 14,
      color: colors.mutedForeground,
      marginBottom: 28,
      fontFamily: "Inter_400Regular",
    },
    label: {
      fontSize: 13,
      fontWeight: "600" as const,
      color: colors.foreground,
      marginBottom: 8,
      fontFamily: "Inter_600SemiBold",
    },
    input: {
      backgroundColor: colors.muted,
      borderRadius: colors.radius,
      paddingHorizontal: 16,
      paddingVertical: 14,
      fontSize: 15,
      color: colors.foreground,
      marginBottom: 16,
      fontFamily: "Inter_400Regular",
    },
    error: {
      color: colors.destructive,
      fontSize: 13,
      marginBottom: 16,
      fontFamily: "Inter_400Regular",
    },
    loginBtn: {
      backgroundColor: colors.primary,
      borderRadius: colors.radius,
      paddingVertical: 16,
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "row",
      gap: 8,
    },
    loginBtnText: {
      color: colors.primaryForeground,
      fontSize: 16,
      fontWeight: "600" as const,
      fontFamily: "Inter_600SemiBold",
    },
    hint: {
      marginTop: 20,
      backgroundColor: colors.accent,
      borderRadius: colors.radius,
      padding: 12,
    },
    hintTitle: {
      fontSize: 12,
      fontWeight: "600" as const,
      color: colors.accentForeground,
      marginBottom: 4,
      fontFamily: "Inter_600SemiBold",
    },
    hintText: {
      fontSize: 12,
      color: colors.mutedForeground,
      fontFamily: "Inter_400Regular",
      lineHeight: 18,
    },
  });

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.topSection}>
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>$</Text>
        </View>
        <Text style={styles.appName}>RevenueShare</Text>
        <Text style={styles.tagline}>Manage and distribute daily revenue{"\n"}among your team members</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Welcome back</Text>
        <Text style={styles.cardSubtitle}>Sign in to your account</Text>

        <Text style={styles.label}>Username</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter username"
          placeholderTextColor={colors.mutedForeground}
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
          autoCorrect={false}
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter password"
          placeholderTextColor={colors.mutedForeground}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        {!!error && <Text style={styles.error}>{error}</Text>}

        <TouchableOpacity style={styles.loginBtn} onPress={handleLogin} disabled={loading} activeOpacity={0.8}>
          {loading ? (
            <ActivityIndicator color={colors.primaryForeground} size="small" />
          ) : (
            <Text style={styles.loginBtnText}>Sign In</Text>
          )}
        </TouchableOpacity>

        <View style={styles.hint}>
          <Text style={styles.hintTitle}>Demo Credentials</Text>
          <Text style={styles.hintText}>
            Admin: admin / admin123{"\n"}User: user1 / user123
          </Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
