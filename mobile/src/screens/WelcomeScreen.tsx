import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { Image, ImageBackground, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { colors, fonts, radius, spacing } from '../theme/tokens';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Welcome'>;

export default function WelcomeScreen({ navigation }: Props) {
  return (
    <ImageBackground
      source={require('../../assets/background-initial-screen.png')}
      style={styles.root}
      resizeMode="cover"
    >
      <LinearGradient
        colors={['rgba(79,86,211,0)', 'rgba(79,86,211,0.4)', 'rgba(79,86,211,1)']}
        locations={[0, 0.5, 0.75]}
        style={StyleSheet.absoluteFill}
      />

      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <View style={styles.logoWrapper}>
          <Image
            source={require('../../assets/icon.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <View style={styles.bottom}>
          <Text style={styles.title}>
            Evolua{'\n'}na <Text style={styles.titleItalic}>Corrida</Text>
          </Text>

          <Text style={styles.subtitle}>
            Acompanhe seus treinos, defina metas e visualize seu progresso com sua assessoria.
          </Text>

          <TouchableOpacity style={styles.cta} onPress={() => navigation.navigate('Login')}>
            <View style={styles.ctaIcon}>
              <Text style={styles.ctaIconGlyph}>N</Text>
            </View>
            <Text style={styles.ctaText}>Começar agora</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <StatusBar style="light" />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bgBase,
  },
  safe: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    justifyContent: 'space-between',
  },
  logoWrapper: {
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  logo: {
    width: 380,
    height: 120,
    marginTop: 6,
  },
  bottom: {
    paddingBottom: spacing.lg,
  },
  title: {
    color: colors.textPrimary,
    fontFamily: fonts.extrabold,
    fontSize: 62,
    lineHeight: 72,
    marginBottom: spacing.md,
  },
  titleItalic: {
    fontFamily: fonts.extraboldItalic,
  },
  subtitle: {
    color: colors.textPrimary,
    fontFamily: fonts.regular,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: spacing.lg,
  },
  cta: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: radius.full,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    alignSelf: 'stretch',
    gap: spacing.md,
  },
  ctaIcon: {
    width: 36,
    height: 36,
    borderRadius: radius.full,
    backgroundColor: colors.brandPrimary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaIconGlyph: {
    color: colors.brandAccent,
    fontFamily: fonts.brand,
    fontSize: 20,
    lineHeight: 22,
    transform: [{ skewX: '-10deg' }],
  },
  ctaText: {
    color: colors.bgBase,
    fontFamily: fonts.semibold,
    fontSize: 15,
  },
});
