import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { colors, fonts } from '../theme/tokens';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Splash'>;

export default function SplashScreen({ navigation }: Props) {
  useEffect(() => {
    const t = setTimeout(() => navigation.replace('Welcome'), 1800);
    return () => clearTimeout(t);
  }, [navigation]);

  return (
    <View style={styles.root}>
      <Text style={styles.brand}>RUNPRO</Text>
      <StatusBar style="dark" />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#EDEDF3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brand: {
    color: colors.brandAccent,
    fontFamily: fonts.extrabold,
    fontSize: 56,
    letterSpacing: 2,
  },
});
