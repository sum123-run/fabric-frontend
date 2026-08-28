import React, { useRef, useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Platform,
  StatusBar,
  ActivityIndicator,
  KeyboardAvoidingView,
  ScrollView,
  Alert,
} from "react-native";
import { router } from "expo-router";
//import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { useAuth } from "../AuthContext";

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
  error:     "#E07070",
};

//GoogleSignin.configure({
  //webClientId: "500141154122-4jdav9g75lt58d3hdgsult7qnkhrrae6.apps.googleusercontent.com",
//});

export default function LoginScreen() {
  const { logIn, signInWithGoogle } = useAuth();

  const [email,       setEmail]       = useState("");
  const [password,    setPassword]    = useState("");
  const [loading,     setLoading]     = useState(false);
  const [gLoading,    setGLoading]    = useState(false);
  const [showPass,    setShowPass]    = useState(false);

  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(24)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 800, useNativeDriver: true }),
    ]).start();
  }, []);

  const handleLogin = async () => {   //async=This function will do something that takes time, and I will handle it without freezing the app
    if (!email || !password) {
      Alert.alert("Missing Fields", "Please enter your email and password.");
      return;
    }
    try {
      setLoading(true);
      await logIn(email.trim(), password);
      router.replace("/AppScreenPreview");
    } catch (e) {
      Alert.alert("Login Failed", friendlyError(e.code));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    try {
      setGLoading(true);
      await GoogleSignin.hasPlayServices();
      const { idToken } = await GoogleSignin.signIn();
      await signInWithGoogle(idToken);
      router.replace("/AppScreenPreview");
    } catch (e) {
      Alert.alert("Google Sign-In Failed", e.message);
    } finally {
      setGLoading(false);
    }
  };

  const friendlyError = (code) => {
    switch (code) {
      case "auth/user-not-found":    return "No account found with this email.";
      case "auth/wrong-password":    return "Incorrect password. Please try again.";
      case "auth/invalid-email":     return "Invalid email address.";
      case "auth/too-many-requests": return "Too many attempts. Try again later.";
      default:                       return "Something went wrong. Please try again.";
    }
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={C.bg} />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Animated.View
            style={[styles.container, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}
          >
            {/* ── EYEBROW ── */}
            <Text style={styles.eyebrow}>VIRTUAL FASHION DESIGNER</Text>

            {/* ── TITLE ── */}
            <Text style={styles.title}>Welcome</Text>
            <Text style={styles.titleAccent}>Back</Text>

            <View style={styles.divider} />

            {/* ── FORM ── */}
            <View style={styles.form}>

              {/* Email */}
              <View style={styles.fieldWrap}>
                <Text style={styles.label}>EMAIL</Text>
                <View style={styles.inputWrap}>
                  <TextInput
                    style={styles.input}
                    placeholder="your@email.com"
                    placeholderTextColor={C.textDim}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>
              </View>

              {/* Password */}
              <View style={styles.fieldWrap}>
                <Text style={styles.label}>PASSWORD</Text>
                <View style={styles.inputWrap}>
                  <TextInput
                    style={[styles.input, { flex: 1 }]}
                    placeholder="••••••••"
                    placeholderTextColor={C.textDim}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPass}
                    autoCapitalize="none"
                  />
                  <TouchableOpacity onPress={() => setShowPass(!showPass)} style={styles.eyeBtn}>
                    <Text style={styles.eyeText}>{showPass ? "HIDE" : "SHOW"}</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Forgot */}
              <TouchableOpacity style={styles.forgotWrap}>
                <Text style={styles.forgotText}>Forgot password?</Text>
              </TouchableOpacity>

              {/* Login Button */}
              <TouchableOpacity
                style={[styles.btnPrimary, loading && styles.btnDisabled]}
                onPress={handleLogin}
                disabled={loading}
                activeOpacity={0.85}
              >
                {loading
                  ? <ActivityIndicator color={C.bg} size="small" />
                  : <Text style={styles.btnPrimaryText}>SIGN IN</Text>
                }
              </TouchableOpacity>

              {/* Divider */}
              <View style={styles.orRow}>
                <View style={styles.orLine} />
                <Text style={styles.orText}>OR</Text>
                <View style={styles.orLine} />
              </View>

              {/* Google Button */}
              <TouchableOpacity
                style={[styles.btnGoogle, gLoading && styles.btnDisabled]}
                onPress={handleGoogle}
                disabled={gLoading}
                activeOpacity={0.85}
              >
                {gLoading ? (
                  <ActivityIndicator color={C.accent} size="small" />
                ) : (
                  <>
                    <Text style={styles.googleIcon}>G</Text>
                    <Text style={styles.btnGoogleText}>CONTINUE WITH GOOGLE</Text>
                  </>
                )}
              </TouchableOpacity>

            </View>

            {/* ── FOOTER ── */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>Don't have an account? </Text>
              <TouchableOpacity onPress={() => router.push("/SignupScreen")}>
                <Text style={styles.footerLink}>Sign Up</Text>
              </TouchableOpacity>
            </View>

          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },

  scroll: { flexGrow: 1, justifyContent: "center" },

  container: {
    alignItems: "center",
    paddingHorizontal: 32,
    paddingVertical: 48,
  },

  eyebrow: {
    fontFamily: Platform.OS === "ios" ? "Courier New" : "monospace",
    fontSize: 9,
    letterSpacing: 4,
    color: C.accentDim,
    marginBottom: 24,
  },

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
    marginBottom: 32,
  },

  form: { width: "100%" },

  fieldWrap: { marginBottom: 20 },

  label: {
    fontFamily: Platform.OS === "ios" ? "Courier New" : "monospace",
    fontSize: 9,
    letterSpacing: 3,
    color: C.accentDim,
    marginBottom: 8,
  },

  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: C.border,
    backgroundColor: C.surface,
    paddingHorizontal: 16,
    height: 52,
  },

  input: {
    flex: 1,
    color: C.text,
    fontSize: 14,
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
    letterSpacing: 0.5,
  },

  eyeBtn: { paddingLeft: 12 },
  eyeText: {
    fontFamily: Platform.OS === "ios" ? "Courier New" : "monospace",
    fontSize: 8,
    letterSpacing: 2,
    color: C.accentDim,
  },

  forgotWrap: { alignItems: "flex-end", marginBottom: 28, marginTop: -8 },
  forgotText: {
    fontFamily: Platform.OS === "ios" ? "Courier New" : "monospace",
    fontSize: 9,
    letterSpacing: 2,
    color: C.textMuted,
  },

  btnPrimary: {
    backgroundColor: C.accent,
    height: 52,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },

  btnPrimaryText: {
    fontFamily: Platform.OS === "ios" ? "Courier New" : "monospace",
    fontSize: 11,
    letterSpacing: 4,
    color: C.bg,
    fontWeight: "600",
  },

  btnDisabled: { opacity: 0.6 },

  orRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  orLine: { flex: 1, height: 1, backgroundColor: C.border },
  orText: {
    fontFamily: Platform.OS === "ios" ? "Courier New" : "monospace",
    fontSize: 9,
    letterSpacing: 3,
    color: C.textDim,
    marginHorizontal: 12,
  },

  btnGoogle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 52,
    borderWidth: 1,
    borderColor: C.accent,
    backgroundColor: C.accentBg,
    gap: 10,
  },

  googleIcon: {
    fontSize: 16,
    fontWeight: "700",
    color: C.accent,
  },

  btnGoogleText: {
    fontFamily: Platform.OS === "ios" ? "Courier New" : "monospace",
    fontSize: 10,
    letterSpacing: 3,
    color: C.accent,
  },

  footer: {
    flexDirection: "row",
    marginTop: 32,
    alignItems: "center",
  },

  footerText: {
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
    fontSize: 13,
    color: C.textMuted,
  },

  footerLink: {
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
    fontSize: 13,
    color: C.accent,
    fontStyle: "italic",
  },
});
