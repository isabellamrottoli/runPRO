import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, fonts, radius, spacing } from '../theme/tokens';
import {
  BarbellIcon,
  CheckCircleIcon,
  FireIcon,
  TimerIcon,
  XCircleIcon,
} from './icons';

export type DayStatus = 'done' | 'missed' | 'planned' | 'active' | 'rest';

export type DayItem = {
  label: string;
  number: number;
  status: DayStatus;
  kind?: 'run' | 'strength' | 'fire';
};

type Props = {
  days: DayItem[];
  activeIndex: number;
  onSelect: (i: number) => void;
};

export default function WeekStrip({ days, activeIndex, onSelect }: Props) {
  return (
    <View style={styles.row}>
      {days.map((d, i) => {
        const isActive = i === activeIndex;
        return (
          <Pressable
            key={i}
            style={[styles.day, isActive && styles.dayActive]}
            onPress={() => onSelect(i)}
          >
            <Text style={[styles.label, isActive && styles.labelActive]}>{d.label}</Text>
            <Text style={[styles.number, isActive && styles.numberActive]}>{d.number}</Text>
            <View style={styles.iconWrap}>{renderIcon(d)}</View>
          </Pressable>
        );
      })}
    </View>
  );
}

function renderIcon(d: DayItem) {
  if (d.status === 'done') return <CheckCircleIcon size={16} />;
  if (d.status === 'missed') return <XCircleIcon size={16} />;
  if (d.kind === 'strength') return <BarbellIcon size={16} color={colors.white} />;
  if (d.kind === 'fire') return <FireIcon size={16} color={colors.white} />;
  return <TimerIcon size={16} color={colors.white} />;
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 4,
    marginTop: spacing.sm,
  },
  day: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.xs,
    borderRadius: radius.md,
  },
  dayActive: {
    backgroundColor: colors.brandAccent,
  },
  label: {
    color: 'rgba(255,255,255,0.85)',
    fontFamily: fonts.semibold,
    fontSize: 12,
  },
  labelActive: {
    color: colors.white,
  },
  number: {
    color: colors.white,
    fontFamily: fonts.bold,
    fontSize: 16,
    marginTop: 2,
  },
  numberActive: {
    color: colors.white,
  },
  iconWrap: {
    marginTop: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
