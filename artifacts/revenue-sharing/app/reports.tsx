import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  FlatList,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { RevenueEntry, useAppData } from "@/context/AppDataContext";
import { useColors } from "@/hooks/useColors";

type TabType = "summary" | "slips";

export default function ReportsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { revenueEntries, deleteRevenueEntry } = useAppData();
  const isWeb = Platform.OS === "web";

  const [activeTab, setActiveTab] = useState<TabType>("summary");
  const [selectedEntry, setSelectedEntry] = useState<RevenueEntry | null>(null);
  const [detailVisible, setDetailVisible] = useState(false);

  const sharedEntries = revenueEntries.filter((e) => e.isShared);
  const totalRevenue = revenueEntries.reduce((s, e) => s + e.amount, 0);
  const totalShared = sharedEntries.reduce((s, e) => s + e.amount, 0);
  const totalNotShared = totalRevenue - totalShared;

  const formatCurrency = (n: number) =>
    n.toLocaleString("en-PH", { style: "currency", currency: "PHP", maximumFractionDigits: 2 });

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr + "T00:00:00");
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  const openDetail = (entry: RevenueEntry) => {
    setSelectedEntry(entry);
    setDetailVisible(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleDeleteEntry = (id: string) => {
    deleteRevenueEntry(id);
    setDetailVisible(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
  };

  const memberTotals = (() => {
    const map: Record<string, { name: string; total: number; entries: number }> = {};
    for (const entry of sharedEntries) {
      for (const s of entry.shares) {
        if (!map[s.memberId]) map[s.memberId] = { name: s.memberName, total: 0, entries: 0 };
        map[s.memberId].total += s.amount;
        map[s.memberId].entries += 1;
      }
    }
    return Object.values(map).sort((a, b) => b.total - a.total);
  })();

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: {
      flexDirection: "row",
      alignItems: "center",
      paddingTop: insets.top + (isWeb ? 67 : 0),
      paddingHorizontal: 20,
      paddingBottom: 16,
      backgroundColor: colors.card,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      gap: 12,
    },
    backBtn: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: colors.muted,
      alignItems: "center",
      justifyContent: "center",
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: "700" as const,
      color: colors.foreground,
      fontFamily: "Inter_700Bold",
      flex: 1,
    },
    tabs: {
      flexDirection: "row",
      padding: 16,
      gap: 8,
    },
    tab: {
      flex: 1,
      paddingVertical: 10,
      borderRadius: colors.radius,
      alignItems: "center",
      backgroundColor: colors.muted,
    },
    activeTab: { backgroundColor: colors.primary },
    tabText: {
      fontSize: 14,
      fontWeight: "600" as const,
      color: colors.mutedForeground,
      fontFamily: "Inter_600SemiBold",
    },
    activeTabText: { color: "#fff" },
    scrollContent: { padding: 20, paddingBottom: insets.bottom + 100 },
    statsRow: { flexDirection: "row", gap: 12, marginBottom: 20 },
    statCard: {
      flex: 1,
      backgroundColor: colors.card,
      borderRadius: colors.radius,
      padding: 14,
      borderWidth: 1,
      borderColor: colors.border,
    },
    statLabel: {
      fontSize: 12,
      color: colors.mutedForeground,
      fontFamily: "Inter_400Regular",
      marginBottom: 4,
    },
    statValue: {
      fontSize: 16,
      fontWeight: "700" as const,
      color: colors.foreground,
      fontFamily: "Inter_700Bold",
    },
    sectionTitle: {
      fontSize: 15,
      fontWeight: "600" as const,
      color: colors.foreground,
      fontFamily: "Inter_600SemiBold",
      marginBottom: 12,
    },
    memberRow: {
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
    memberAvatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.accent,
      alignItems: "center",
      justifyContent: "center",
    },
    memberInitial: {
      fontSize: 16,
      fontWeight: "700" as const,
      color: colors.primary,
      fontFamily: "Inter_700Bold",
    },
    memberName: {
      fontSize: 14,
      fontWeight: "600" as const,
      color: colors.foreground,
      fontFamily: "Inter_600SemiBold",
    },
    memberEntries: {
      fontSize: 12,
      color: colors.mutedForeground,
      fontFamily: "Inter_400Regular",
    },
    memberTotal: {
      fontSize: 15,
      fontWeight: "700" as const,
      color: colors.success,
      fontFamily: "Inter_700Bold",
    },
    entryRow: {
      backgroundColor: colors.card,
      borderRadius: colors.radius,
      padding: 14,
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: 8,
    },
    entryTop: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: 8,
    },
    entryDate: {
      fontSize: 15,
      fontWeight: "600" as const,
      color: colors.foreground,
      fontFamily: "Inter_600SemiBold",
    },
    entryAmount: {
      fontSize: 18,
      fontWeight: "700" as const,
      color: colors.foreground,
      fontFamily: "Inter_700Bold",
    },
    entryBy: {
      fontSize: 12,
      color: colors.mutedForeground,
      fontFamily: "Inter_400Regular",
    },
    sharedTag: {
      fontSize: 11,
      color: colors.success,
      backgroundColor: "#dcfce7",
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: 10,
      fontFamily: "Inter_500Medium",
    },
    notSharedTag: {
      fontSize: 11,
      color: colors.mutedForeground,
      backgroundColor: colors.muted,
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: 10,
      fontFamily: "Inter_500Medium",
    },
    entryShareRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      paddingTop: 8,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    entryShareName: {
      fontSize: 12,
      color: colors.mutedForeground,
      fontFamily: "Inter_400Regular",
    },
    entryShareAmt: {
      fontSize: 12,
      fontWeight: "600" as const,
      color: colors.success,
      fontFamily: "Inter_600SemiBold",
    },
    viewDetailsBtn: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
      marginTop: 8,
      paddingTop: 8,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    viewDetailsText: {
      fontSize: 13,
      color: colors.primary,
      fontFamily: "Inter_500Medium",
    },
    emptyContainer: {
      alignItems: "center",
      padding: 40,
    },
    emptyText: {
      color: colors.mutedForeground,
      fontSize: 14,
      textAlign: "center",
      fontFamily: "Inter_400Regular",
      marginTop: 12,
    },
    overlay: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.5)",
      justifyContent: "flex-end",
    },
    modalCard: {
      backgroundColor: colors.card,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      maxHeight: "85%",
    },
    modalHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 20,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: "700" as const,
      color: colors.foreground,
      fontFamily: "Inter_700Bold",
    },
    closeBtn: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: colors.muted,
      alignItems: "center",
      justifyContent: "center",
    },
    modalScroll: { padding: 20 },
    slipHeader: {
      backgroundColor: colors.primary,
      borderRadius: colors.radius,
      padding: 16,
      marginBottom: 16,
    },
    slipTitle: {
      fontSize: 12,
      color: "rgba(255,255,255,0.75)",
      fontFamily: "Inter_400Regular",
      textTransform: "uppercase",
      letterSpacing: 1,
      marginBottom: 4,
    },
    slipAmount: {
      fontSize: 32,
      fontWeight: "700" as const,
      color: "#fff",
      fontFamily: "Inter_700Bold",
    },
    slipDate: {
      fontSize: 14,
      color: "rgba(255,255,255,0.8)",
      fontFamily: "Inter_400Regular",
      marginTop: 4,
    },
    slipRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    slipLabel: {
      fontSize: 14,
      color: colors.mutedForeground,
      fontFamily: "Inter_400Regular",
    },
    slipValue: {
      fontSize: 14,
      fontWeight: "600" as const,
      color: colors.foreground,
      fontFamily: "Inter_600SemiBold",
    },
    shareSlipTitle: {
      fontSize: 14,
      fontWeight: "600" as const,
      color: colors.foreground,
      fontFamily: "Inter_600SemiBold",
      marginTop: 16,
      marginBottom: 8,
    },
    shareSlipItem: {
      backgroundColor: colors.muted,
      borderRadius: colors.radius,
      padding: 12,
      marginBottom: 8,
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
    },
    shareSlipAvatar: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: colors.accent,
      alignItems: "center",
      justifyContent: "center",
    },
    shareSlipInitial: {
      fontSize: 14,
      fontWeight: "700" as const,
      color: colors.primary,
      fontFamily: "Inter_700Bold",
    },
    shareSlipName: {
      flex: 1,
      fontSize: 14,
      fontWeight: "600" as const,
      color: colors.foreground,
      fontFamily: "Inter_600SemiBold",
    },
    shareSlipPct: {
      fontSize: 12,
      color: colors.mutedForeground,
      fontFamily: "Inter_400Regular",
    },
    shareSlipAmt: {
      fontSize: 15,
      fontWeight: "700" as const,
      color: colors.success,
      fontFamily: "Inter_700Bold",
    },
    deleteEntryBtn: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      marginTop: 20,
      marginBottom: insets.bottom + 8,
      padding: 14,
      borderRadius: colors.radius,
      backgroundColor: "#fee2e2",
    },
    deleteEntryText: {
      fontSize: 14,
      fontWeight: "600" as const,
      color: colors.destructive,
      fontFamily: "Inter_600SemiBold",
    },
  });

  const renderSummaryTab = () => (
    <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Total Revenue</Text>
          <Text style={styles.statValue}>{formatCurrency(totalRevenue)}</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Total Entries</Text>
          <Text style={styles.statValue}>{revenueEntries.length}</Text>
        </View>
      </View>
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Shared Revenue</Text>
          <Text style={[styles.statValue, { color: colors.success }]}>{formatCurrency(totalShared)}</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Not Shared</Text>
          <Text style={styles.statValue}>{formatCurrency(totalNotShared)}</Text>
        </View>
      </View>

      {memberTotals.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>Member Totals</Text>
          {memberTotals.map((m) => (
            <View key={m.name} style={styles.memberRow}>
              <View style={styles.memberAvatar}>
                <Text style={styles.memberInitial}>{m.name[0]}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.memberName}>{m.name}</Text>
                <Text style={styles.memberEntries}>{m.entries} shared entries</Text>
              </View>
              <Text style={styles.memberTotal}>{formatCurrency(m.total)}</Text>
            </View>
          ))}
        </>
      )}

      {memberTotals.length === 0 && (
        <View style={styles.emptyContainer}>
          <Feather name="bar-chart-2" size={40} color={colors.mutedForeground} />
          <Text style={styles.emptyText}>No shared revenue yet.{"\n"}Record revenue and choose to share it.</Text>
        </View>
      )}
    </ScrollView>
  );

  const renderSlipsTab = () => (
    <FlatList
      data={revenueEntries}
      keyExtractor={(e) => e.id}
      contentContainerStyle={[styles.scrollContent, revenueEntries.length === 0 && { flex: 1 }]}
      ListEmptyComponent={
        <View style={styles.emptyContainer}>
          <Feather name="file-text" size={40} color={colors.mutedForeground} />
          <Text style={styles.emptyText}>No revenue entries yet.{"\n"}Go to Record Revenue to add entries.</Text>
        </View>
      }
      renderItem={({ item }) => (
        <View style={styles.entryRow}>
          <View style={styles.entryTop}>
            <View>
              <Text style={styles.entryDate}>{formatDate(item.date)}</Text>
              <Text style={styles.entryBy}>by {item.createdBy}</Text>
            </View>
            <View style={{ alignItems: "flex-end", gap: 6 }}>
              <Text style={styles.entryAmount}>{formatCurrency(item.amount)}</Text>
              <Text style={item.isShared ? styles.sharedTag : styles.notSharedTag}>
                {item.isShared ? "Shared" : "Not Shared"}
              </Text>
            </View>
          </View>

          {item.isShared && item.shares.slice(0, 3).map((s) => (
            <View key={s.memberId} style={styles.entryShareRow}>
              <Text style={styles.entryShareName}>{s.memberName} ({s.percentage}%)</Text>
              <Text style={styles.entryShareAmt}>{formatCurrency(s.amount)}</Text>
            </View>
          ))}
          {item.isShared && item.shares.length > 3 && (
            <View style={styles.entryShareRow}>
              <Text style={styles.entryShareName}>+{item.shares.length - 3} more members</Text>
            </View>
          )}

          <TouchableOpacity style={styles.viewDetailsBtn} onPress={() => openDetail(item)}>
            <Feather name="eye" size={14} color={colors.primary} />
            <Text style={styles.viewDetailsText}>View Full Slip</Text>
          </TouchableOpacity>
        </View>
      )}
    />
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Feather name="arrow-left" size={18} color={colors.foreground} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Reports</Text>
      </View>

      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "summary" && styles.activeTab]}
          onPress={() => setActiveTab("summary")}
        >
          <Text style={[styles.tabText, activeTab === "summary" && styles.activeTabText]}>Summary</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "slips" && styles.activeTab]}
          onPress={() => setActiveTab("slips")}
        >
          <Text style={[styles.tabText, activeTab === "slips" && styles.activeTabText]}>Daily Slips</Text>
        </TouchableOpacity>
      </View>

      {activeTab === "summary" ? renderSummaryTab() : renderSlipsTab()}

      <Modal visible={detailVisible} transparent animationType="slide" onRequestClose={() => setDetailVisible(false)}>
        <View style={styles.overlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Revenue Slip</Text>
              <TouchableOpacity style={styles.closeBtn} onPress={() => setDetailVisible(false)}>
                <Feather name="x" size={16} color={colors.foreground} />
              </TouchableOpacity>
            </View>
            {selectedEntry && (
              <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
                <View style={styles.slipHeader}>
                  <Text style={styles.slipTitle}>Daily Revenue Slip</Text>
                  <Text style={styles.slipAmount}>{formatCurrency(selectedEntry.amount)}</Text>
                  <Text style={styles.slipDate}>{formatDate(selectedEntry.date)}</Text>
                </View>

                <View style={styles.slipRow}>
                  <Text style={styles.slipLabel}>Date</Text>
                  <Text style={styles.slipValue}>{formatDate(selectedEntry.date)}</Text>
                </View>
                <View style={styles.slipRow}>
                  <Text style={styles.slipLabel}>Total Revenue</Text>
                  <Text style={styles.slipValue}>{formatCurrency(selectedEntry.amount)}</Text>
                </View>
                <View style={styles.slipRow}>
                  <Text style={styles.slipLabel}>Recorded By</Text>
                  <Text style={styles.slipValue}>{selectedEntry.createdBy}</Text>
                </View>
                <View style={styles.slipRow}>
                  <Text style={styles.slipLabel}>Shared</Text>
                  <Text style={[styles.slipValue, { color: selectedEntry.isShared ? colors.success : colors.mutedForeground }]}>
                    {selectedEntry.isShared ? "Yes" : "No"}
                  </Text>
                </View>

                {selectedEntry.isShared && (
                  <>
                    <Text style={styles.shareSlipTitle}>Individual Share Breakdown</Text>
                    {selectedEntry.shares.map((s) => (
                      <View key={s.memberId} style={styles.shareSlipItem}>
                        <View style={styles.shareSlipAvatar}>
                          <Text style={styles.shareSlipInitial}>{s.memberName[0]}</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={styles.shareSlipName}>{s.memberName}</Text>
                          <Text style={styles.shareSlipPct}>{s.percentage}% share</Text>
                        </View>
                        <Text style={styles.shareSlipAmt}>{formatCurrency(s.amount)}</Text>
                      </View>
                    ))}
                  </>
                )}

                <TouchableOpacity
                  style={styles.deleteEntryBtn}
                  onPress={() => handleDeleteEntry(selectedEntry.id)}
                >
                  <Feather name="trash-2" size={16} color={colors.destructive} />
                  <Text style={styles.deleteEntryText}>Delete This Entry</Text>
                </TouchableOpacity>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}
