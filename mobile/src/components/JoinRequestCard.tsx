import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors, fonts, radius, spacing } from '../theme/tokens';

type Props = {
  name: string;
  message: string;
  onApprove: () => void;
  onReject: () => void;
};

export default function JoinRequestCard({ name, message, onApprove, onReject }: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.message}>{message}</Text>
      <View style={styles.actions}>
        <TouchableOpacity style={[styles.btn, styles.reject]} onPress={onReject}>
          <Text style={styles.rejectText}>Rejeitar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.btn, styles.approve]} onPress={onApprove}>
          <Text style={styles.approveText}>Aprovar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  name: {
    color: colors.bgBase,
    fontFamily: fonts.bold,
    fontSize: 15,
  },
  message: {
    color: colors.textSecondary,
    fontFamily: fonts.regular,
    fontSize: 13,
    marginTop: 2,
    marginBottom: spacing.md,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  btn: {
    flex: 1,
    paddingVertical: spacing.sm + 2,
    borderRadius: radius.full,
    alignItems: 'center',
  },
  reject: {
    backgroundColor: colors.statusError,
  },
  rejectText: {
    color: colors.white,
    fontFamily: fonts.semibold,
    fontSize: 14,
  },
  approve: {
    backgroundColor: colors.statusSuccess,
  },
  approveText: {
    color: colors.white,
    fontFamily: fonts.semibold,
    fontSize: 14,
  },
});
