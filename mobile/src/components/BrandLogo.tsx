import { Image, StyleSheet, Text, View } from 'react-native';
import { colors, fonts, radius, spacing } from '../theme/tokens';

type Variant = 'dark' | 'orange';

type Props = {
  variant?: Variant;
  size?: 'md' | 'lg';
};

export default function BrandLogo({ variant = 'dark', size = 'md' }: Props) {
  const isLarge = size === 'lg';
  return (
    <View style={styles.block}>
      <View style={[styles.logoN, isLarge && styles.logoNLarge]}>
        <Text
          style={[
            styles.logoNText,
            isLarge && styles.logoNTextLarge,
            variant === 'orange' && { color: colors.brandAccent },
          ]}
        >
          N
        </Text>
      </View>
      <Text
        style={[
          styles.brand,
          isLarge && styles.brandLarge,
          variant === 'orange' && { color: colors.brandAccent },
        ]}
      >
        RUNPRO
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  block: {
    alignItems: 'center',
  },
  logoN: {
    width: 56,
    height: 56,
    borderRadius: radius.md,
    backgroundColor: colors.bgBase,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  logoNLarge: {
    width: 88,
    height: 88,
    borderRadius: radius.lg,
  },
  logoNText: {
    color: colors.white,
    fontFamily: fonts.brand,
    fontSize: 36,
    lineHeight: 40,
    transform: [{ skewX: '-8deg' }],
  },
  logoNTextLarge: {
    fontSize: 58,
    lineHeight: 62,
  },
  brand: {
    color: colors.bgBase,
    fontFamily: fonts.extrabold,
    fontSize: 22,
    letterSpacing: 1,
  },
  brandLarge: {
    fontSize: 34,
    letterSpacing: 1.5,
  },
});
