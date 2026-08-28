import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Animated,
  Platform,
  StatusBar,
} from "react-native";
import { router } from "expo-router";

const C = {
  bg:         "#0D0D0D",
  surface:    "#161616",
  border:     "#2A2A2A",
  accent:     "#C8A96E",
  accentDim:  "#8C7548",
  accentBg:   "#1A1710",
  text:       "#F5F0E8",
  textMuted:  "#7A7570",
  textDim:    "#4A4642",
};

export default function LoadingScreen() {
  const pulseAnim = useRef(new Animated.Value(0.4)).current;
  const fadeAnim  = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Fade in on mount
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    // Pulse loop on eyebrow text
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
      router.replace("/AppScreenPreview");
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={C.bg} />

      <Animated.View style={[styles.container, { opacity: fadeAnim }]}>

        {/* ── EYEBROW ── */}
        <Animated.Text style={[styles.eyebrow, { opacity: pulseAnim }]}>
          VIRTUAL FASHION DESIGNER
        </Animated.Text>

        {/* ── IMAGE ── */}
        <View style={styles.imageFrame}>
          <Image
            source={require("../assets/loading.jpg")}
            style={styles.image}
            resizeMode="cover"
          />
          <View style={[styles.corner, styles.cornerTL]} />
          <View style={[styles.corner, styles.cornerTR]} />
          <View style={[styles.corner, styles.cornerBL]} />
          <View style={[styles.corner, styles.cornerBR]} />
        </View>

        {/* ── TITLE ── */}
        <Text style={styles.title}>Style You</Text>
        <Text style={styles.titleAccent}>Virtually</Text>

        <View style={styles.divider} />

        {/* ── LOADING LABEL ── */}
        <Animated.Text style={[styles.loadingText, { opacity: pulseAnim }]}>
          LOADING YOUR STYLE...
        </Animated.Text>

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

  imageFrame: {
    width: 220,
    height: 220,
    borderRadius: 1000,
    borderWidth: 1,
    borderColor: C.border,
    overflow: "hidden",
    marginBottom: 32,
    position: "relative",
  },

  image: {
    width: "100%",
    height: "100%",
  },

  corner: {
    position: "absolute",
    width: 14,
    height: 14,
    borderColor: C.accent,
  },
  cornerTL: { top: 18,  left: 18,  borderTopWidth: 1.5, borderLeftWidth: 1.5 },
  cornerTR: { top: 18,  right: 18, borderTopWidth: 1.5, borderRightWidth: 1.5 },
  cornerBL: { bottom: 18, left: 18,  borderBottomWidth: 1.5, borderLeftWidth: 1.5 },
  cornerBR: { bottom: 18, right: 18, borderBottomWidth: 1.5, borderRightWidth: 1.5 },

  title: {
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
    fontSize: 36,
    color: C.text,
    fontWeight: "300",
    letterSpacing: -1,
    lineHeight: 40,
  },

  titleAccent: {
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
    fontSize: 36,
    color: C.accent,
    fontWeight: "300",
    letterSpacing: -1,
    fontStyle: "italic",
    lineHeight: 40,
    marginBottom: 20,
  },

  divider: {
    width: 40,
    height: 1,
    backgroundColor: C.accent,
    marginBottom: 20,
  },

  loadingText: {
    fontFamily: Platform.OS === "ios" ? "Courier New" : "monospace",
    fontSize: 9,
    letterSpacing: 4,
    color: C.accentDim,
  },
});