import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, fonts, radius, spacing } from '../theme/tokens';
import { CheckCircleIcon } from './icons';

type Props = {
  title: string;
  description: string;
  icon: React.ReactNode;
  selected: boolean;
  onPress: () => void;
};

export default function RoleCard({ title, description, icon, selected, onPress }: Props) {
  return (
    <Pressable style={[styles.card, selected && styles.cardSelected]} onPress={onPress}>
      <View style={styles.iconBox}>{icon}</View>
      <View style={styles.textBox}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
      {selected && (
        <View style={styles.check}>
          <CheckCircleIcon size={22} color={colors.brandPrimary} />
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.brandPrimary,
    padding: spacing.md,
    marginBottom: spacing.md,
    gap: spacing.md,
  },
  cardSelected: {
    backgroundColor: '#EDEEFB',
    borderWidth: 2,
  },
  iconBox: {
    width: 64,
    height: 64,
    borderRadius: radius.md,
    backgroundColor: colors.brandPrimary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textBox: { flex: 1 },
  title: {
    color: colors.bgBase,
    fontFamily: fonts.extrabold,
    fontSize: 18,
    marginBottom: 2,
  },
  description: {
    color: colors.textSecondary,
    fontFamily: fonts.regular,
    fontSize: 13,
    lineHeight: 18,
  },
  check: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
  },
});
