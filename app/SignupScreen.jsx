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

export default function SignupScreen() {
  const { signUp } = useAuth();

  const [name,        setName]        = useState("");
  const [email,       setEmail]       = useState("");
  const [password,    setPassword]    = useState("");
  const [confirm,     setConfirm]     = useState("");
  const [loading,     setLoading]     = useState(false);
  const [showPass,    setShowPass]    = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(24)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 800, useNativeDriver: true }),
    ]).start();
  }, []);

 const handleSignup = async () => {
    console.log("Button pressed"); // ← add this
    if (!name || !email || !password || !confirm) {
      Alert.alert("Missing Fields", "Please fill in all fields.");
      return;
    }
    if (password !== confirm) {
      Alert.alert("Password Mismatch", "Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      Alert.alert("Weak Password", "Password must be at least 6 characters.");
      return;
    }
    try {
      setLoading(true);
      console.log("Trying signup..."); // ← add this
      await signUp(name.trim(), email.trim(), password);
      console.log("Signup success!"); // ← add this
      router.replace("/AppScreenPreview");
    } catch (e) {
      console.log("Error:", e.code, e.message); // ← add this
      Alert.alert("Sign Up Failed", friendlyError(e.code));
    } finally {
      setLoading(false);
    }
  };

  const friendlyError = (code) => {
    switch (code) {
      case "auth/email-already-in-use": return "An account with this email already exists.";
      case "auth/invalid-email":        return "Invalid email address.";
      case "auth/weak-password":        return "Password should be at least 6 characters.";
      default:                          return "Something went wrong. Please try again.";
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
            <Text style={styles.title}>Create</Text>
            <Text style={styles.titleAccent}>Account</Text>

            <View style={styles.divider} />

            {/* ── FORM ── */}
            <View style={styles.form}>

              {/* Name */}
              <View style={styles.fieldWrap}>
                <Text style={styles.label}>FULL NAME</Text>
                <View style={styles.inputWrap}>
                  <TextInput
                    style={styles.input}
                    placeholder="Your name"
                    placeholderTextColor={C.textDim}
                    value={name}
                    onChangeText={setName}
                    autoCapitalize="words"
                  />
                </View>
              </View>

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
                    placeholder="Min. 6 characters"
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

              {/* Confirm Password */}
              <View style={styles.fieldWrap}>
                <Text style={styles.label}>CONFIRM PASSWORD</Text>
                <View style={[
                  styles.inputWrap,
                  confirm && password !== confirm && { borderColor: C.error }
                ]}>
                  <TextInput
                    style={[styles.input, { flex: 1 }]}
                    placeholder="Repeat password"
                    placeholderTextColor={C.textDim}
                    value={confirm}
                    onChangeText={setConfirm}
                    secureTextEntry={!showConfirm}
                    autoCapitalize="none"
                  />
                  <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)} style={styles.eyeBtn}>
                    <Text style={styles.eyeText}>{showConfirm ? "HIDE" : "SHOW"}</Text>
                  </TouchableOpacity>
                </View>
                {confirm && password !== confirm && (
                  <Text style={styles.errorText}>Passwords do not match</Text>
                )}
              </View>

              {/* Sign Up Button */}
              <TouchableOpacity
                style={[styles.btnPrimary, loading && styles.btnDisabled]}
                onPress={handleSignup}
                disabled={loading}
                activeOpacity={0.85}
              >
                {loading
                  ? <ActivityIndicator color={C.bg} size="small" />
                  : <Text style={styles.btnPrimaryText}>CREATE ACCOUNT</Text>
                }
              </TouchableOpacity>

            </View>

            {/* ── FOOTER ── */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => router.push("/LoginScreen")}>
                <Text style={styles.footerLink}>Sign In</Text>
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

  errorText: {
    fontFamily: Platform.OS === "ios" ? "Courier New" : "monospace",
    fontSize: 9,
    letterSpacing: 1,
    color: C.error,
    marginTop: 6,
  },

  btnPrimary: {
    backgroundColor: C.accent,
    height: 52,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },

  btnPrimaryText: {
    fontFamily: Platform.OS === "ios" ? "Courier New" : "monospace",
    fontSize: 11,
    letterSpacing: 4,
    color: C.bg,
    fontWeight: "600",
  },

  btnDisabled: { opacity: 0.6 },

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
