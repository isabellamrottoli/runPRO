import { Platform, StyleSheet, TextInput, TextInputProps, View } from 'react-native';
import { colors, fonts, radius, spacing } from '../theme/tokens';

type Props = TextInputProps & {
  icon: React.ReactNode;
};

export default function InputField({ icon, style, ...inputProps }: Props) {
  return (
    <View style={styles.input}>
      <View style={styles.iconWrap}>{icon}</View>
      <TextInput
        style={[styles.field, style]}
        placeholderTextColor={colors.brandPrimary}
        {...inputProps}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: radius.full,
    borderWidth: 1.5,
    borderColor: colors.brandPrimary,
    paddingHorizontal: spacing.md,
    paddingVertical: Platform.OS === 'ios' ? 14 : 8,
    marginBottom: spacing.md,
  },
  iconWrap: {
    width: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  field: {
    flex: 1,
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.brandPrimary,
  },
});
