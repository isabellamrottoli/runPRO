import { Pressable, StyleSheet, View } from 'react-native';
import { colors, radius, spacing } from '../theme/tokens';
import { HouseIcon, ProfileIcon } from './icons';

type Tab = 'home' | 'profile';

type Props = {
  active: Tab;
  onChange: (t: Tab) => void;
};

export default function BottomTabBar({ active, onChange }: Props) {
  return (
    <View style={styles.wrap}>
      <View style={styles.bar}>
        <Pressable style={styles.tab} onPress={() => onChange('home')}>
          <HouseIcon color={active === 'home' ? colors.white : 'rgba(255,255,255,0.55)'} />
        </Pressable>
        <View style={styles.sep} />
        <Pressable style={styles.tab} onPress={() => onChange('profile')}>
          <ProfileIcon color={active === 'profile' ? colors.white : 'rgba(255,255,255,0.55)'} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.md,
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.brandPrimary,
    borderRadius: radius.full,
    paddingVertical: spacing.md,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
  },
  sep: {
    width: 1,
    height: 20,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
});
