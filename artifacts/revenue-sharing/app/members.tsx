import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  FlatList,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Member, useAppData } from "@/context/AppDataContext";
import { useColors } from "@/hooks/useColors";

export default function MembersScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { members, addMember, updateMember, deleteMember, getTotalPercentage } = useAppData();
  const isWeb = Platform.OS === "web";

  const [modalVisible, setModalVisible] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [name, setName] = useState("");
  const [percentage, setPercentage] = useState("");
  const [role, setRole] = useState("");

  const totalPct = getTotalPercentage();

  const openAddModal = () => {
    setEditingMember(null);
    setName("");
    setPercentage("");
    setRole("");
    setModalVisible(true);
  };

  const openEditModal = (member: Member) => {
    setEditingMember(member);
    setName(member.name);
    setPercentage(String(member.percentage));
    setRole(member.role);
    setModalVisible(true);
  };

  const handleSave = () => {
    const pct = parseFloat(percentage);
    if (!name.trim() || isNaN(pct) || pct <= 0 || pct > 100) return;
    if (editingMember) {
      updateMember(editingMember.id, { name: name.trim(), percentage: pct, role: role.trim() });
    } else {
      addMember({ name: name.trim(), percentage: pct, role: role.trim() || "Member" });
    }
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setModalVisible(false);
  };

  const handleDelete = (member: Member) => {
    Alert.alert("Delete Member", `Remove ${member.name}?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          deleteMember(member.id);
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        },
      },
    ]);
  };

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
    addBtn: {
      backgroundColor: colors.primary,
      borderRadius: 20,
      width: 36,
      height: 36,
      alignItems: "center",
      justifyContent: "center",
    },
    summaryCard: {
      margin: 20,
      backgroundColor: colors.card,
      borderRadius: colors.radius,
      padding: 16,
      borderWidth: 1,
      borderColor: colors.border,
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
    },
    summaryInfo: { flex: 1 },
    summaryLabel: {
      fontSize: 13,
      color: colors.mutedForeground,
      fontFamily: "Inter_400Regular",
    },
    summaryValue: {
      fontSize: 22,
      fontWeight: "700" as const,
      color: totalPct === 100 ? colors.success : colors.warning,
      fontFamily: "Inter_700Bold",
    },
    summaryNote: {
      fontSize: 12,
      color: totalPct === 100 ? colors.success : colors.warning,
      fontFamily: "Inter_400Regular",
      marginTop: 2,
    },
    memberCard: {
      backgroundColor: colors.card,
      borderRadius: colors.radius,
      padding: 14,
      marginHorizontal: 20,
      marginBottom: 10,
      flexDirection: "row",
      alignItems: "center",
      borderWidth: 1,
      borderColor: colors.border,
      gap: 12,
    },
    avatar: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: colors.accent,
      alignItems: "center",
      justifyContent: "center",
    },
    avatarText: {
      fontSize: 18,
      fontWeight: "700" as const,
      color: colors.primary,
      fontFamily: "Inter_700Bold",
    },
    memberInfo: { flex: 1 },
    memberName: {
      fontSize: 15,
      fontWeight: "600" as const,
      color: colors.foreground,
      fontFamily: "Inter_600SemiBold",
    },
    memberRole: {
      fontSize: 13,
      color: colors.mutedForeground,
      fontFamily: "Inter_400Regular",
    },
    pctBadge: {
      backgroundColor: colors.primary,
      borderRadius: 16,
      paddingHorizontal: 10,
      paddingVertical: 4,
    },
    pctText: {
      color: "#fff",
      fontSize: 14,
      fontWeight: "700" as const,
      fontFamily: "Inter_700Bold",
    },
    actionBtn: {
      width: 32,
      height: 32,
      borderRadius: 8,
      backgroundColor: colors.muted,
      alignItems: "center",
      justifyContent: "center",
    },
    deleteBtn: { backgroundColor: "#fee2e2" },
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
      padding: 24,
      paddingBottom: insets.bottom + 24,
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: "700" as const,
      color: colors.foreground,
      marginBottom: 20,
      fontFamily: "Inter_700Bold",
    },
    modalLabel: {
      fontSize: 13,
      fontWeight: "600" as const,
      color: colors.foreground,
      marginBottom: 8,
      fontFamily: "Inter_600SemiBold",
    },
    modalInput: {
      backgroundColor: colors.muted,
      borderRadius: colors.radius,
      paddingHorizontal: 14,
      paddingVertical: 14,
      fontSize: 15,
      color: colors.foreground,
      marginBottom: 16,
      fontFamily: "Inter_400Regular",
    },
    modalActions: { flexDirection: "row", gap: 12, marginTop: 8 },
    cancelBtn: {
      flex: 1,
      backgroundColor: colors.muted,
      borderRadius: colors.radius,
      paddingVertical: 14,
      alignItems: "center",
    },
    cancelBtnText: {
      color: colors.foreground,
      fontSize: 15,
      fontWeight: "600" as const,
      fontFamily: "Inter_600SemiBold",
    },
    saveBtn: {
      flex: 1,
      backgroundColor: colors.primary,
      borderRadius: colors.radius,
      paddingVertical: 14,
      alignItems: "center",
    },
    saveBtnText: {
      color: "#fff",
      fontSize: 15,
      fontWeight: "600" as const,
      fontFamily: "Inter_600SemiBold",
    },
  });

  const pctNum = parseFloat(percentage) || 0;
  const isValid = name.trim().length > 0 && pctNum > 0 && pctNum <= 100;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Feather name="arrow-left" size={18} color={colors.foreground} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Members</Text>
        <TouchableOpacity style={styles.addBtn} onPress={openAddModal}>
          <Feather name="plus" size={18} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.summaryCard}>
        <View style={[{ width: 44, height: 44, borderRadius: 22, backgroundColor: totalPct === 100 ? "#dcfce7" : "#fef3c7", alignItems: "center", justifyContent: "center" }]}>
          <Feather name="pie-chart" size={20} color={totalPct === 100 ? colors.success : colors.warning} />
        </View>
        <View style={styles.summaryInfo}>
          <Text style={styles.summaryLabel}>Total Allocation</Text>
          <Text style={styles.summaryValue}>{totalPct}%</Text>
          <Text style={styles.summaryNote}>
            {totalPct === 100 ? "Perfectly balanced" : totalPct < 100 ? `${100 - totalPct}% unallocated` : `${totalPct - 100}% over-allocated`}
          </Text>
        </View>
        <Text style={{ fontSize: 13, color: colors.mutedForeground, fontFamily: "Inter_400Regular" }}>
          {members.length} members
        </Text>
      </View>

      <FlatList
        data={members}
        keyExtractor={(m) => m.id}
        contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Feather name="users" size={40} color={colors.mutedForeground} />
            <Text style={styles.emptyText}>No members yet.{"\n"}Tap + to add your first member.</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.memberCard}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{item.name[0].toUpperCase()}</Text>
            </View>
            <View style={styles.memberInfo}>
              <Text style={styles.memberName}>{item.name}</Text>
              <Text style={styles.memberRole}>{item.role}</Text>
            </View>
            <View style={styles.pctBadge}>
              <Text style={styles.pctText}>{item.percentage}%</Text>
            </View>
            <TouchableOpacity style={styles.actionBtn} onPress={() => openEditModal(item)}>
              <Feather name="edit-2" size={14} color={colors.primary} />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionBtn, styles.deleteBtn]} onPress={() => handleDelete(item)}>
              <Feather name="trash-2" size={14} color={colors.destructive} />
            </TouchableOpacity>
          </View>
        )}
      />

      <Modal visible={modalVisible} transparent animationType="slide" onRequestClose={() => setModalVisible(false)}>
        <View style={styles.overlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>{editingMember ? "Edit Member" : "Add Member"}</Text>

            <Text style={styles.modalLabel}>Full Name</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="e.g. Alice Johnson"
              placeholderTextColor={colors.mutedForeground}
              value={name}
              onChangeText={setName}
            />

            <Text style={styles.modalLabel}>Role / Title</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="e.g. Director, Manager"
              placeholderTextColor={colors.mutedForeground}
              value={role}
              onChangeText={setRole}
            />

            <Text style={styles.modalLabel}>Share Percentage (%)</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="e.g. 40"
              placeholderTextColor={colors.mutedForeground}
              value={percentage}
              onChangeText={setPercentage}
              keyboardType="decimal-pad"
            />

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.saveBtn, { opacity: isValid ? 1 : 0.5 }]}
                onPress={handleSave}
                disabled={!isValid}
              >
                <Text style={styles.saveBtnText}>{editingMember ? "Update" : "Add Member"}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
