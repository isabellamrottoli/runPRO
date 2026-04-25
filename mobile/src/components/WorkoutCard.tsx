import { StyleSheet, Text, View } from 'react-native';
import { colors, fonts, radius, spacing } from '../theme/tokens';
import PrimaryButton from './PrimaryButton';

export type WorkoutBlock = {
  label: string;
  description: string;
  icon: React.ReactNode;
};

type Props = {
  title: string;
  blocks: WorkoutBlock[];
  done?: boolean;
  onMarkDone: () => void;
};

export default function WorkoutCard({ title, blocks, done, onMarkDone }: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>

      {blocks.map((b, i) => (
        <View key={i} style={styles.block}>
          <View style={styles.blockIcon}>{b.icon}</View>
          <View style={styles.blockText}>
            <Text style={styles.blockLabel}>{b.label}</Text>
            <Text style={styles.blockDesc}>{b.description}</Text>
          </View>
        </View>
      ))}

      <PrimaryButton
        label={done ? 'Feito!' : 'Marcar como feito'}
        variant="success"
        onPress={onMarkDone}
        disabled={done}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1.5,
    borderColor: '#E2E3EF',
  },
  title: {
    color: colors.brandAccent,
    fontFamily: fonts.extrabold,
    fontSize: 20,
    marginBottom: spacing.sm,
  },
  block: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  blockIcon: {
    marginTop: 2,
  },
  blockText: { flex: 1 },
  blockLabel: {
    color: colors.bgBase,
    fontFamily: fonts.bold,
    fontSize: 13,
  },
  blockDesc: {
    color: colors.textSecondary,
    fontFamily: fonts.regular,
    fontSize: 12,
    lineHeight: 16,
  },
});
