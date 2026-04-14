import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useAppData } from "@/context/AppDataContext";
import { useAuth } from "@/context/AuthContext";
import { useColors } from "@/hooks/useColors";

export default function RevenueScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { members, addRevenueEntry, getTotalPercentage } = useAppData();

  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [step, setStep] = useState<"input" | "share_question" | "preview" | "done">("input");
  const [isShared, setIsShared] = useState(false);
  const [shares, setShares] = useState<Array<{ memberId: string; memberName: string; percentage: number; amount: number }>>([]);

  const totalPct = getTotalPercentage();

  const handleAmountNext = () => {
    const num = parseFloat(amount.replace(/[^0-9.]/g, ""));
    if (!num || num <= 0) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setStep("share_question");
  };

  const handleShareYes = () => {
    const num = parseFloat(amount.replace(/[^0-9.]/g, ""));
    const calculated = members.map((m) => ({
      memberId: m.id,
      memberName: m.name,
      percentage: m.percentage,
      amount: (num * m.percentage) / 100,
    }));
    setShares(calculated);
    setIsShared(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setStep("preview");
  };

  const handleShareNo = () => {
    setIsShared(false);
    setShares([]);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setStep("preview");
  };

  const handleConfirm = () => {
    const num = parseFloat(amount.replace(/[^0-9.]/g, ""));
    addRevenueEntry({
      date,
      amount: num,
      isShared,
      shares,
      createdBy: user?.name ?? "Unknown",
    });
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setStep("done");
  };

  const handleReset = () => {
    setAmount("");
    setDate(new Date().toISOString().split("T")[0]);
    setStep("input");
    setIsShared(false);
    setShares([]);
  };

  const formatCurrency = (n: number) =>
    n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 });

  const num = parseFloat(amount.replace(/[^0-9.]/g, "")) || 0;
  const isWeb = Platform.OS === "web";

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
    content: { flex: 1 },
    scrollContent: { padding: 20, paddingBottom: insets.bottom + 100 },
    stepCard: {
      backgroundColor: colors.card,
      borderRadius: colors.radius,
      padding: 24,
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: 16,
    },
    stepTitle: {
      fontSize: 20,
      fontWeight: "700" as const,
      color: colors.foreground,
      marginBottom: 6,
      fontFamily: "Inter_700Bold",
    },
    stepSubtitle: {
      fontSize: 14,
      color: colors.mutedForeground,
      marginBottom: 24,
      fontFamily: "Inter_400Regular",
    },
    label: {
      fontSize: 13,
      fontWeight: "600" as const,
      color: colors.foreground,
      marginBottom: 8,
      fontFamily: "Inter_600SemiBold",
    },
    amountInput: {
      backgroundColor: colors.muted,
      borderRadius: colors.radius,
      paddingHorizontal: 16,
      paddingVertical: 16,
      fontSize: 28,
      fontWeight: "700" as const,
      color: colors.foreground,
      marginBottom: 16,
      fontFamily: "Inter_700Bold",
      textAlign: "center",
    },
    dateInput: {
      backgroundColor: colors.muted,
      borderRadius: colors.radius,
      paddingHorizontal: 16,
      paddingVertical: 14,
      fontSize: 15,
      color: colors.foreground,
      marginBottom: 24,
      fontFamily: "Inter_400Regular",
    },
    primaryBtn: {
      backgroundColor: colors.primary,
      borderRadius: colors.radius,
      paddingVertical: 16,
      alignItems: "center",
    },
    primaryBtnText: {
      color: colors.primaryForeground,
      fontSize: 16,
      fontWeight: "600" as const,
      fontFamily: "Inter_600SemiBold",
    },
    shareQuestion: {
      fontSize: 18,
      fontWeight: "700" as const,
      color: colors.foreground,
      textAlign: "center",
      marginBottom: 8,
      fontFamily: "Inter_700Bold",
    },
    shareAmount: {
      fontSize: 32,
      fontWeight: "700" as const,
      color: colors.primary,
      textAlign: "center",
      marginBottom: 6,
      fontFamily: "Inter_700Bold",
    },
    shareSubtitle: {
      fontSize: 14,
      color: colors.mutedForeground,
      textAlign: "center",
      marginBottom: 32,
      fontFamily: "Inter_400Regular",
    },
    shareButtons: { flexDirection: "row", gap: 12 },
    yesBtn: {
      flex: 1,
      backgroundColor: colors.primary,
      borderRadius: colors.radius,
      paddingVertical: 16,
      alignItems: "center",
    },
    noBtn: {
      flex: 1,
      backgroundColor: colors.muted,
      borderRadius: colors.radius,
      paddingVertical: 16,
      alignItems: "center",
    },
    yesBtnText: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "700" as const,
      fontFamily: "Inter_700Bold",
    },
    noBtnText: {
      color: colors.foreground,
      fontSize: 16,
      fontWeight: "700" as const,
      fontFamily: "Inter_700Bold",
    },
    warningCard: {
      backgroundColor: "#fef3c7",
      borderRadius: colors.radius,
      padding: 12,
      marginBottom: 16,
      flexDirection: "row",
      gap: 8,
      alignItems: "flex-start",
    },
    warningText: {
      color: "#92400e",
      fontSize: 13,
      fontFamily: "Inter_400Regular",
      flex: 1,
    },
    previewRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    previewLabel: {
      fontSize: 14,
      color: colors.mutedForeground,
      fontFamily: "Inter_400Regular",
    },
    previewValue: {
      fontSize: 14,
      fontWeight: "600" as const,
      color: colors.foreground,
      fontFamily: "Inter_600SemiBold",
    },
    shareItem: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      gap: 10,
    },
    shareItemAvatar: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: colors.accent,
      alignItems: "center",
      justifyContent: "center",
    },
    shareItemInitial: {
      fontSize: 14,
      fontWeight: "700" as const,
      color: colors.primary,
      fontFamily: "Inter_700Bold",
    },
    shareItemName: {
      fontSize: 14,
      color: colors.foreground,
      fontFamily: "Inter_500Medium",
      flex: 1,
    },
    shareItemPct: {
      fontSize: 12,
      color: colors.mutedForeground,
      fontFamily: "Inter_400Regular",
    },
    shareItemAmount: {
      fontSize: 15,
      fontWeight: "700" as const,
      color: colors.success,
      fontFamily: "Inter_700Bold",
    },
    doneCard: { alignItems: "center", padding: 32 },
    doneIcon: {
      width: 72,
      height: 72,
      borderRadius: 36,
      backgroundColor: "#dcfce7",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 20,
    },
    doneTitle: {
      fontSize: 22,
      fontWeight: "700" as const,
      color: colors.foreground,
      marginBottom: 8,
      fontFamily: "Inter_700Bold",
    },
    doneSub: {
      fontSize: 14,
      color: colors.mutedForeground,
      textAlign: "center",
      marginBottom: 28,
      fontFamily: "Inter_400Regular",
    },
    doneActions: { flexDirection: "row", gap: 12, width: "100%" },
    secondaryBtn: {
      flex: 1,
      backgroundColor: colors.muted,
      borderRadius: colors.radius,
      paddingVertical: 14,
      alignItems: "center",
    },
    secondaryBtnText: {
      color: colors.foreground,
      fontSize: 15,
      fontWeight: "600" as const,
      fontFamily: "Inter_600SemiBold",
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Feather name="arrow-left" size={18} color={colors.foreground} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Record Revenue</Text>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">

        {step === "input" && (
          <View style={styles.stepCard}>
            <Text style={styles.stepTitle}>Enter Revenue</Text>
            <Text style={styles.stepSubtitle}>Record today's revenue amount</Text>

            <Text style={styles.label}>Amount</Text>
            <TextInput
              style={styles.amountInput}
              placeholder="$0.00"
              placeholderTextColor={colors.mutedForeground}
              value={amount}
              onChangeText={setAmount}
              keyboardType="decimal-pad"
            />

            <Text style={styles.label}>Date</Text>
            <TextInput
              style={styles.dateInput}
              placeholder="YYYY-MM-DD"
              placeholderTextColor={colors.mutedForeground}
              value={date}
              onChangeText={setDate}
            />

            <TouchableOpacity
              style={[styles.primaryBtn, { opacity: num > 0 ? 1 : 0.5 }]}
              onPress={handleAmountNext}
              disabled={num <= 0}
              activeOpacity={0.8}
            >
              <Text style={styles.primaryBtnText}>Continue</Text>
            </TouchableOpacity>
          </View>
        )}

        {step === "share_question" && (
          <View style={styles.stepCard}>
            <Text style={styles.shareAmount}>{formatCurrency(num)}</Text>
            <Text style={styles.shareQuestion}>Should this revenue be shared?</Text>
            <Text style={styles.shareSubtitle}>
              Distribute among {members.length} members based on{"\n"}their predefined percentage allocations
            </Text>

            {totalPct !== 100 && (
              <View style={styles.warningCard}>
                <Feather name="alert-triangle" size={16} color="#92400e" />
                <Text style={styles.warningText}>
                  Member percentages total {totalPct}% (not 100%). Shares will be calculated proportionally.
                </Text>
              </View>
            )}

            <View style={styles.shareButtons}>
              <TouchableOpacity style={styles.noBtn} onPress={handleShareNo} activeOpacity={0.8}>
                <Text style={styles.noBtnText}>No</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.yesBtn} onPress={handleShareYes} activeOpacity={0.8}>
                <Text style={styles.yesBtnText}>Yes, Share</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {step === "preview" && (
          <View style={styles.stepCard}>
            <Text style={styles.stepTitle}>Confirm Entry</Text>
            <Text style={styles.stepSubtitle}>Review before saving</Text>

            <View style={styles.previewRow}>
              <Text style={styles.previewLabel}>Date</Text>
              <Text style={styles.previewValue}>{date}</Text>
            </View>
            <View style={styles.previewRow}>
              <Text style={styles.previewLabel}>Total Revenue</Text>
              <Text style={styles.previewValue}>{formatCurrency(num)}</Text>
            </View>
            <View style={[styles.previewRow, { marginBottom: isShared ? 16 : 0 }]}>
              <Text style={styles.previewLabel}>Shared</Text>
              <Text style={[styles.previewValue, { color: isShared ? colors.success : colors.mutedForeground }]}>
                {isShared ? "Yes" : "No"}
              </Text>
            </View>

            {isShared && shares.map((s) => (
              <View key={s.memberId} style={styles.shareItem}>
                <View style={styles.shareItemAvatar}>
                  <Text style={styles.shareItemInitial}>{s.memberName[0]}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.shareItemName}>{s.memberName}</Text>
                  <Text style={styles.shareItemPct}>{s.percentage}%</Text>
                </View>
                <Text style={styles.shareItemAmount}>{formatCurrency(s.amount)}</Text>
              </View>
            ))}

            <View style={{ height: 24 }} />
            <TouchableOpacity style={styles.primaryBtn} onPress={handleConfirm} activeOpacity={0.8}>
              <Text style={styles.primaryBtnText}>Save Entry</Text>
            </TouchableOpacity>
          </View>
        )}

        {step === "done" && (
          <View style={[styles.stepCard, styles.doneCard]}>
            <View style={styles.doneIcon}>
              <Feather name="check-circle" size={36} color={colors.success} />
            </View>
            <Text style={styles.doneTitle}>Entry Saved!</Text>
            <Text style={styles.doneSub}>
              Revenue of {formatCurrency(num)} has been recorded{isShared ? " and shared among members" : ""}.
            </Text>
            <View style={styles.doneActions}>
              <TouchableOpacity style={styles.secondaryBtn} onPress={handleReset} activeOpacity={0.8}>
                <Text style={styles.secondaryBtnText}>New Entry</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.primaryBtn, { flex: 1 }]}
                onPress={() => router.push("/reports")}
                activeOpacity={0.8}
              >
                <Text style={styles.primaryBtnText}>View Report</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
