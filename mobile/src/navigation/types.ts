export type RootStackParamList = {
  Splash: undefined;
  Welcome: undefined;
  Login: undefined;
  SignupRole: undefined;
  SignupCoach: undefined;
  SignupRunner: undefined;
  CoachHome: undefined;
  RunnerHome: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
