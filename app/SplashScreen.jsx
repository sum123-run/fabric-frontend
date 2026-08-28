import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Animated,
  Platform,
  StatusBar,
} from "react-native";
import { router } from "expo-router";

const C = {
  bg:        "#0D0D0D",
  surface:   "#161616",
  border:    "#2A2A2A",
  accent:    "#C8A96E",
  accentDim: "#8C7548",
  accentBg:  "#1A1710",
  text:      "#F5F0E8",
  textMuted: "#7A7570",
  textDim:   "#4A4642",
};

export default function SplashScreen() {
  const fadeAnim   = useRef(new Animated.Value(0)).current;
  const pulseAnim  = useRef(new Animated.Value(0.4)).current;
  const scaleAnim  = useRef(new Animated.Value(0.92)).current;
  const slideAnim  = useRef(new Animated.Value(18)).current;

  useEffect(() => {
    // Fade + scale in the logo
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 900,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 900,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 900,
        useNativeDriver: true,
      }),
    ]).start();

    // Pulse on subtitle
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.4,
          duration: 900,
          useNativeDriver: true,
        }),
      ])
    ).start();

    const timer = setTimeout(() => {
     // router.replace("/LoadingScreen");
      router.replace("/LoginScreen");
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={C.bg} />

      <Animated.View
        style={[
          styles.container,
          {
            opacity: fadeAnim,
            transform: [
              { scale: scaleAnim },
              { translateY: slideAnim },
            ],
          },
        ]}
      >
        {/* ── TOP LABEL ── */}
        <Animated.Text style={[styles.eyebrow, { opacity: pulseAnim }]}>
          VIRTUAL FASHION DESIGNER
        </Animated.Text>

        {/* ── LOGO FRAME ── */}
        <View style={styles.logoFrame}>
          <Image
            source={require("../assets/logo.png")}
            style={styles.logo}
            resizeMode="contain"
          />
          {/* Corner accents */}
          <View style={[styles.corner, styles.cornerTL]} />
          <View style={[styles.corner, styles.cornerTR]} />
          <View style={[styles.corner, styles.cornerBL]} />
          <View style={[styles.corner, styles.cornerBR]} />
        </View>

        {/* ── DIVIDER ── */}
        <View style={styles.divider} />

        {/* ── SUBTITLE ── */}
        <Animated.Text style={[styles.subtitle, { opacity: pulseAnim }]}>
          AI FASHION HUB
        </Animated.Text>

        {/* ── BOTTOM DIVIDER ── */}
        <View style={styles.divider} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: C.bg,
  },

  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
  },

  eyebrow: {
    fontFamily: Platform.OS === "ios" ? "Courier New" : "monospace",
    fontSize: 9,
    letterSpacing: 4,
    color: C.accentDim,
    marginBottom: 28,
  },

  logoFrame: {
    width: 190,
    height: 190,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 32,
    position: "relative",
    backgroundColor: C.accentBg,
  },

  logo: {
    width: 140,
    height: 140,
  },

  corner: {
    position: "absolute",
    width: 14,
    height: 14,
    borderColor: C.accent,
  },
  cornerTL: { top: 10,    left: 10,   borderTopWidth: 1.5,    borderLeftWidth: 1.5 },
  cornerTR: { top: 10,    right: 10,  borderTopWidth: 1.5,    borderRightWidth: 1.5 },
  cornerBL: { bottom: 10, left: 10,   borderBottomWidth: 1.5, borderLeftWidth: 1.5 },
  cornerBR: { bottom: 10, right: 10,  borderBottomWidth: 1.5, borderRightWidth: 1.5 },

  divider: {
    width: 40,
    height: 1,
    backgroundColor: C.accent,
    marginVertical: 16,
  },

  subtitle: {
    fontFamily: Platform.OS === "ios" ? "Courier New" : "monospace",
    fontSize: 9,
    letterSpacing: 4,
    color: C.accentDim,
  },
});
