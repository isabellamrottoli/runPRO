import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors, fonts, radius, spacing } from '../theme/tokens';

type Props = {
  label: string;
  onPress?: () => void;
  disabled?: boolean;
  variant?: 'solid' | 'success';
};

export default function PrimaryButton({ label, onPress, disabled, variant = 'solid' }: Props) {
  const bg =
    disabled
      ? '#9CA0B8'
      : variant === 'success'
      ? colors.statusSuccess
      : colors.brandPrimary;

  return (
    <TouchableOpacity
      style={[styles.btn, { backgroundColor: bg }]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.85}
    >
      <Text style={styles.text}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    borderRadius: radius.full,
    paddingVertical: spacing.md,
    alignItems: 'center',
    marginTop: spacing.md,
  },
  text: {
    color: colors.white,
    fontFamily: fonts.bold,
    fontSize: 16,
  },
});
