import { StyleSheet, Text, ScrollView,View, TouchableOpacity } from "react-native";
import AppScreenPreview from'./AppScreenPreview'
import SplashScreen from'./SplashScreen'
import LoginScreen from'./LoginScreen'
import SignupScreen from'./SignupScreen'
import LoadingScreen from'./LoadingScreen'
import PredictionScreen from'./PredictionScreen'
import { Link } from "expo-router";
export default function Page() {
  return (
  <SplashScreen/> 

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 24,
  },
  main: {
    flex: 1,
    justifyContent: "center",
    maxWidth: 960,
    marginHorizontal: "auto",
  },
  title: {
    fontSize: 64,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 36,
    color: "#38434D",
  },
});
