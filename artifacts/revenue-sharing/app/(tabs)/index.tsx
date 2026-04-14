import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useAppData } from "@/context/AppDataContext";
import { useAuth } from "@/context/AuthContext";
import { useColors } from "@/hooks/useColors";

export default function DashboardScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { user, logout, isAdmin } = useAuth();
  const { revenueEntries, members } = useAppData();
  const isWeb = Platform.OS === "web";

  const totalRevenue = revenueEntries.reduce((s, e) => s + e.amount, 0);
  const sharedEntries = revenueEntries.filter((e) => e.isShared);
  const totalShared = sharedEntries.reduce((s, e) => s + e.amount, 0);
  const todayStr = new Date().toISOString().split("T")[0];
  const todayEntries = revenueEntries.filter((e) => e.date === todayStr);
  const todayRevenue = todayEntries.reduce((s, e) => s + e.amount, 0);

  const formatCurrency = (n: number) =>
    n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 });

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: {
      backgroundColor: colors.primary,
      paddingTop: insets.top + (isWeb ? 67 : 0),
      paddingBottom: 24,
      paddingHorizontal: 20,
    },
    headerRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    greeting: {
      fontSize: 13,
      color: "rgba(255,255,255,0.75)",
      fontFamily: "Inter_400Regular",
    },
    userName: {
      fontSize: 20,
      fontWeight: "700" as const,
      color: "#fff",
      fontFamily: "Inter_700Bold",
    },
    roleBadge: {
      backgroundColor: "rgba(255,255,255,0.2)",
      borderRadius: 20,
      paddingHorizontal: 10,
      paddingVertical: 4,
    },
    roleText: {
      fontSize: 12,
      color: "#fff",
      fontWeight: "600" as const,
      fontFamily: "Inter_600SemiBold",
      textTransform: "capitalize",
    },
    content: { padding: 20, paddingBottom: insets.bottom + 100 },
    sectionTitle: {
      fontSize: 16,
      fontWeight: "600" as const,
      color: colors.foreground,
      marginBottom: 12,
      fontFamily: "Inter_600SemiBold",
    },
    statsGrid: { flexDirection: "row", gap: 12, marginBottom: 24 },
    statCard: {
      flex: 1,
      backgroundColor: colors.card,
      borderRadius: colors.radius,
      padding: 16,
      borderWidth: 1,
      borderColor: colors.border,
    },
    statLabel: {
      fontSize: 12,
      color: colors.mutedForeground,
      marginBottom: 6,
      fontFamily: "Inter_400Regular",
    },
    statValue: {
      fontSize: 20,
      fontWeight: "700" as const,
      color: colors.foreground,
      fontFamily: "Inter_700Bold",
    },
    statValueSmall: {
      fontSize: 16,
      fontWeight: "700" as const,
      color: colors.foreground,
      fontFamily: "Inter_700Bold",
    },
    statIcon: {
      width: 32,
      height: 32,
      borderRadius: 8,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 8,
    },
    quickActions: { gap: 12, marginBottom: 24 },
    actionBtn: {
      backgroundColor: colors.card,
      borderRadius: colors.radius,
      padding: 16,
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      borderWidth: 1,
      borderColor: colors.border,
    },
    actionBtnPrimary: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    actionIconBox: {
      width: 40,
      height: 40,
      borderRadius: 10,
      alignItems: "center",
      justifyContent: "center",
    },
    actionTitle: {
      fontSize: 15,
      fontWeight: "600" as const,
      color: colors.foreground,
      fontFamily: "Inter_600SemiBold",
    },
    actionTitleWhite: { color: "#fff" },
    actionSubtitle: {
      fontSize: 12,
      color: colors.mutedForeground,
      fontFamily: "Inter_400Regular",
    },
    actionSubtitleWhite: { color: "rgba(255,255,255,0.75)" },
    actionChevron: { marginLeft: "auto" },
    recentHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 12,
    },
    seeAll: {
      fontSize: 13,
      color: colors.primary,
      fontFamily: "Inter_500Medium",
    },
    entryRow: {
      backgroundColor: colors.card,
      borderRadius: colors.radius,
      padding: 14,
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: 8,
    },
    entryDot: {
      width: 10,
      height: 10,
      borderRadius: 5,
    },
    entryDate: {
      fontSize: 13,
      color: colors.mutedForeground,
      fontFamily: "Inter_400Regular",
      flex: 1,
    },
    entryAmount: {
      fontSize: 15,
      fontWeight: "600" as const,
      color: colors.foreground,
      fontFamily: "Inter_600SemiBold",
    },
    sharedTag: {
      fontSize: 11,
      color: colors.success,
      fontFamily: "Inter_500Medium",
      backgroundColor: "#dcfce7",
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 10,
    },
    noSharedTag: {
      fontSize: 11,
      color: colors.mutedForeground,
      fontFamily: "Inter_500Medium",
      backgroundColor: colors.muted,
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 10,
    },
    emptyText: {
      color: colors.mutedForeground,
      fontSize: 14,
      textAlign: "center",
      paddingVertical: 20,
      fontFamily: "Inter_400Regular",
    },
    logoutBtn: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      padding: 4,
    },
    logoutText: {
      color: "rgba(255,255,255,0.75)",
      fontSize: 13,
      fontFamily: "Inter_400Regular",
    },
  });

  const recent = revenueEntries.slice(0, 5);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.greeting}>Good {getGreeting()},</Text>
            <Text style={styles.userName}>{user?.name ?? "User"}</Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
            <View style={styles.roleBadge}>
              <Text style={styles.roleText}>{user?.role}</Text>
            </View>
            <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
              <Feather name="log-out" size={16} color="rgba(255,255,255,0.75)" />
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: "#dbeafe" }]}>
              <Feather name="trending-up" size={16} color={colors.primary} />
            </View>
            <Text style={styles.statLabel}>Today's Revenue</Text>
            <Text style={styles.statValueSmall}>{formatCurrency(todayRevenue)}</Text>
          </View>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: "#dcfce7" }]}>
              <Feather name="dollar-sign" size={16} color={colors.success} />
            </View>
            <Text style={styles.statLabel}>Total Revenue</Text>
            <Text style={styles.statValueSmall}>{formatCurrency(totalRevenue)}</Text>
          </View>
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: "#fef3c7" }]}>
              <Feather name="users" size={16} color={colors.gold} />
            </View>
            <Text style={styles.statLabel}>Members</Text>
            <Text style={styles.statValue}>{members.length}</Text>
          </View>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: "#ede9fe" }]}>
              <Feather name="share-2" size={16} color="#7c3aed" />
            </View>
            <Text style={styles.statLabel}>Total Shared</Text>
            <Text style={styles.statValueSmall}>{formatCurrency(totalShared)}</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={[styles.actionBtn, styles.actionBtnPrimary]}
            onPress={() => router.push("/revenue")}
            activeOpacity={0.8}
          >
            <View style={[styles.actionIconBox, { backgroundColor: "rgba(255,255,255,0.2)" }]}>
              <Feather name="plus-circle" size={20} color="#fff" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.actionTitle, styles.actionTitleWhite]}>Record Revenue</Text>
              <Text style={[styles.actionSubtitle, styles.actionSubtitleWhite]}>Input today's revenue</Text>
            </View>
            <Feather name="chevron-right" size={18} color="rgba(255,255,255,0.75)" style={styles.actionChevron} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => router.push("/reports")}
            activeOpacity={0.8}
          >
            <View style={[styles.actionIconBox, { backgroundColor: colors.accent }]}>
              <Feather name="file-text" size={20} color={colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.actionTitle}>View Reports</Text>
              <Text style={styles.actionSubtitle}>Share summaries & slips</Text>
            </View>
            <Feather name="chevron-right" size={18} color={colors.mutedForeground} style={styles.actionChevron} />
          </TouchableOpacity>

          {isAdmin && (
            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() => router.push("/members")}
              activeOpacity={0.8}
            >
              <View style={[styles.actionIconBox, { backgroundColor: "#fef3c7" }]}>
                <Feather name="users" size={20} color={colors.gold} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.actionTitle}>Manage Members</Text>
                <Text style={styles.actionSubtitle}>Add/edit percentage shares</Text>
              </View>
              <Feather name="chevron-right" size={18} color={colors.mutedForeground} style={styles.actionChevron} />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.recentHeader}>
          <Text style={styles.sectionTitle}>Recent Entries</Text>
          <TouchableOpacity onPress={() => router.push("/reports")}>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>

        {recent.length === 0 ? (
          <Text style={styles.emptyText}>No revenue entries yet</Text>
        ) : (
          recent.map((entry) => (
            <View key={entry.id} style={styles.entryRow}>
              <View
                style={[
                  styles.entryDot,
                  { backgroundColor: entry.isShared ? colors.success : colors.mutedForeground },
                ]}
              />
              <Text style={styles.entryDate}>{formatDate(entry.date)}</Text>
              <Text style={styles.entryAmount}>{formatCurrency(entry.amount)}</Text>
              <Text style={entry.isShared ? styles.sharedTag : styles.noSharedTag}>
                {entry.isShared ? "Shared" : "Not Shared"}
              </Text>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "morning";
  if (h < 17) return "afternoon";
  return "evening";
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}
