import { StyleSheet, View } from 'react-native';
import { colors, radius } from '../theme/tokens';

type Props = {
  value: number;
  max: number;
  height?: number;
};

export default function ProgressBar({ value, max, height = 12 }: Props) {
  const pct = Math.max(0, Math.min(1, value / max));
  return (
    <View style={[styles.track, { height, borderRadius: height / 2 }]}>
      <View
        style={[
          styles.fill,
          { width: `${pct * 100}%`, height, borderRadius: height / 2 },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    width: '100%',
    backgroundColor: '#E5E5EC',
    overflow: 'hidden',
  },
  fill: {
    backgroundColor: colors.brandAccent,
  },
});
