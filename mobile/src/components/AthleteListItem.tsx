import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors, fonts, radius, spacing } from '../theme/tokens';
import { CaretRightIcon, CheckCircleIcon, XCircleIcon } from './icons';

type Props = {
  name: string;
  nextRace: string;
  lastTrainingCompleted: boolean;
  onPress?: () => void;
};

export default function AthleteListItem({
  name,
  nextRace,
  lastTrainingCompleted,
  onPress,
}: Props) {
  return (
    <TouchableOpacity style={styles.row} onPress={onPress} activeOpacity={0.85}>
      <View style={styles.info}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.race}>Próxima Corrida {nextRace}</Text>
        <View style={styles.training}>
          <Text style={styles.trainingLabel}>Último treino: </Text>
          {lastTrainingCompleted ? <CheckCircleIcon /> : <XCircleIcon />}
        </View>
      </View>
      <CaretRightIcon />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  info: { flex: 1 },
  name: {
    color: colors.bgBase,
    fontFamily: fonts.bold,
    fontSize: 15,
  },
  race: {
    color: colors.textSecondary,
    fontFamily: fonts.regular,
    fontSize: 12,
    marginTop: 2,
  },
  training: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  trainingLabel: {
    color: colors.textSecondary,
    fontFamily: fonts.regular,
    fontSize: 12,
  },
});
