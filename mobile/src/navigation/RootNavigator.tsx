import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from '../screens/SplashScreen';
import WelcomeScreen from '../screens/WelcomeScreen';
import LoginScreen from '../screens/LoginScreen';
import SignupRoleScreen from '../screens/SignupRoleScreen';
import SignupCoachScreen from '../screens/SignupCoachScreen';
import SignupRunnerScreen from '../screens/SignupRunnerScreen';
import CoachHomeScreen from '../screens/CoachHomeScreen';
import RunnerHomeScreen from '../screens/RunnerHomeScreen';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{ headerShown: false, animation: 'fade' }}
    >
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="SignupRole" component={SignupRoleScreen} />
      <Stack.Screen name="SignupCoach" component={SignupCoachScreen} />
      <Stack.Screen name="SignupRunner" component={SignupRunnerScreen} />
      <Stack.Screen name="CoachHome" component={CoachHomeScreen} />
      <Stack.Screen name="RunnerHome" component={RunnerHomeScreen} />
    </Stack.Navigator>
  );
}
