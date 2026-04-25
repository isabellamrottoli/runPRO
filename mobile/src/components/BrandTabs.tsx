import { useEffect, useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, fonts, radius, spacing } from '../theme/tokens';

export type AuthTab = 'login' | 'signup';

type Props = {
  value: AuthTab;
  onChange: (next: AuthTab) => void;
};

const TABS_PADDING = 4;

export default function BrandTabs({ value, onChange }: Props) {
  const [width, setWidth] = useState(0);
  const pos = useRef(new Animated.Value(0)).current;

  const half = width > 0 ? (width - TABS_PADDING * 2) / 2 : 0;
  const translate = pos.interpolate({ inputRange: [0, 1], outputRange: [0, half] });

  useEffect(() => {
    Animated.timing(pos, {
      toValue: value === 'login' ? 0 : 1,
      duration: 220,
      useNativeDriver: true,
    }).start();
  }, [value, pos]);

  return (
    <View style={styles.tabs} onLayout={(e) => setWidth(e.nativeEvent.layout.width)}>
      {half > 0 && (
        <Animated.View
          pointerEvents="none"
          style={[styles.indicator, { width: half, transform: [{ translateX: translate }] }]}
        />
      )}
      <Pressable style={styles.tab} onPress={() => onChange('login')}>
        <Text style={[styles.text, value === 'login' ? styles.active : styles.inactive]}>
          Entrar
        </Text>
      </Pressable>
      <Pressable style={styles.tab} onPress={() => onChange('signup')}>
        <Text style={[styles.text, value === 'signup' ? styles.active : styles.inactive]}>
          Cadastrar
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#E5E5EC',
    borderRadius: radius.full,
    padding: TABS_PADDING,
    marginBottom: spacing.lg,
    position: 'relative',
  },
  indicator: {
    position: 'absolute',
    top: TABS_PADDING,
    bottom: TABS_PADDING,
    left: TABS_PADDING,
    backgroundColor: colors.brandPrimary,
    borderRadius: radius.full,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.sm + 2,
    alignItems: 'center',
    borderRadius: radius.full,
  },
  text: {
    fontFamily: fonts.semibold,
    fontSize: 14,
  },
  active: { color: colors.white },
  inactive: { color: colors.textSecondary },
});
