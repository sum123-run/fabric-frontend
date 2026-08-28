import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  ActivityIndicator,
  Platform,
  Alert,
  Share,
  Animated,
  PanResponder,
  TextInput,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as MediaLibrary from "expo-media-library";
import * as Sharing from "expo-sharing";
import ViewShot from "react-native-view-shot";

// ⚠️ Apni actual Groq API key yahan paste karein (Groq console se: https://console.groq.com/keys)
// Warning: is tareeqe se key app ke bundle mein chali jati hai — sirf testing/personal use ke liye theek hai.

const C = {
  bg: "#0D0D0D",
  surface: "#161616",
  card: "#1E1E1E",
  border: "#2A2A2A",
  accent: "#C8A96E",
  accentDim: "#8C7548",
  accentBg: "#1A1710",
  text: "#F5F0E8",
  textMuted: "#7A7570",
  textDim: "#4A4642",
  success: "#6BBF8E",
  danger: "#E07070",
  white: "#FFFFFF",
};

const categories = {
  Frocks: [
    { id: 1, name: "Frocks", image: require("../assets/templates/wedding_dresses.png") },
    { id: 2, name: "Short Frock", image: require("../assets/templates/frock2.png") },
    { id: 3, name: "Long Shirt", image: require("../assets/templates/frock3.png") },
    { id: 4, name: "Frocks", image: require("../assets/templates/frock4.png") },
    { id: 5, name: "Wedding", image: require("../assets/templates/wedding_dresses.png") },
  ],
  Saree: [{ id: 6, name: "Saree", image: require("../assets/templates/saree1.png") }],
  Kurta: [
    { id: 7, name: "Women Kurta", image: require("../assets/templates/kurta.png") },
    { id: 8, name: "Men Kurta", image: require("../assets/templates/men2.png") },
  ],
  Men: [
    { id: 9, name: "Full Sleeve", image: require("../assets/templates/sleeve.png") },
    { id: 10, name: "Suit", image: require("../assets/templates/suit1.png") },
    { id: 11, name: "Shirt", image: require("../assets/templates/sleeve-half.png") },
    { id: 12, name: "Dress", image: require("../assets/templates/mn2.png") },
    { id: 13, name: "Formal", image: require("../assets/templates/mn1.png") },
    { id: 14, name: "Upper Shirt", image: require("../assets/templates/shirt1.png") },
  ],
  Qameez: [
    { id: 15, name: "Women Kameez", image: require("../assets/templates/qameez1.png") },
    { id: 16, name: "With Trousers", image: require("../assets/templates/qameez1.png") },
  ],
  "Long Dress": [
    { id: 17, name: "Long Frock", image: require("../assets/templates/long_dress.png") },
    { id: 18, name: "Long Dress", image: require("../assets/templates/frock3.png") },
  ],
  "Shalwar Qameez": [
    { id: 19, name: "Women", image: require("../assets/templates/sk2.png") },
    { id: 20, name: "Full Suit", image: require("../assets/templates/sk2.png") },
  ],
  "Men Wear": [
    { id: 21, name: "Trouser Style", image: require("../assets/templates/trouser2.png") },
    { id: 22, name: "Trousers", image: require("../assets/templates/trouser2.png") },
    { id: 23, name: "Casual", image: require("../assets/templates/mn3.png") },
  ],
};

const fabricDetails = {
  Cotton: {
    breathability: "High",
    durability: "Medium",
    care: "Machine Wash",
    bestFor: "Casual, Everyday Wear",
    season: "Summer",
    icon: "🌿",
  },
  Silk: {
    breathability: "Medium",
    durability: "Low",
    care: "Dry Clean Only",
    bestFor: "Formal, Bridal Wear",
    season: "All Seasons",
    icon: "✨",
  },
  Linen: {
    breathability: "Very High",
    durability: "High",
    care: "Hand Wash",
    bestFor: "Casual, Summer Wear",
    season: "Summer",
    icon: "🌾",
  },
  Polyester: {
    breathability: "Low",
    durability: "Very High",
    care: "Machine Wash",
    bestFor: "Activewear, Casual",
    season: "All Seasons",
    icon: "⚙️",
  },
  Wool: {
    breathability: "Medium",
    durability: "High",
    care: "Dry Clean",
    bestFor: "Formal, Winter Wear",
    season: "Winter",
    icon: "🐑",
  },
  Default: {
    breathability: "Medium",
    durability: "Medium",
    care: "Check Label",
    bestFor: "General Use",
    season: "All Seasons",
    icon: "🧵",
  },
};

const catIcons = {
  Frocks: "👗",
  Saree: "🥻",
  Kurta: "👘",
  Men: "👔",
  Qameez: "🧣",
  "Long Dress": "👒",
  "Shalwar Qameez": "🪡",
  "Men Wear": "🥼",
};

// ─── Realistic decoration visuals 
const PearlButton = ({ size = 28 }) => (
  <View style={{
    width: size, height: size, borderRadius: size / 2,
    backgroundColor: "#F0EDE8",
    borderWidth: 1.5, borderColor: "#C8B8A2",
    alignItems: "center", justifyContent: "center",
  }}>
    <View style={{ width: size * 0.55, height: size * 0.55, borderRadius: 99, borderWidth: 1, borderColor: "#B0A090", alignItems: "center", justifyContent: "center" }}>
      <View style={{ width: size * 0.2, height: size * 0.2, borderRadius: 99, backgroundColor: "#fff", opacity: 0.8 }} />
    </View>
  </View>
);

const GoldButton = ({ size = 28 }) => (
  <View style={{
    width: size, height: size, borderRadius: size / 2,
    backgroundColor: "#C8A96E",
    borderWidth: 2, borderColor: "#8C7548",
    alignItems: "center", justifyContent: "center",
  }}>
    <View style={{ width: size * 0.45, height: size * 0.45, borderRadius: 99, borderWidth: 1.5, borderColor: "#6A5530", alignItems: "center", justifyContent: "center" }}>
      <View style={{ width: size * 0.15, height: size * 0.15, borderRadius: 99, backgroundColor: "#fff", opacity: 0.5 }} />
    </View>
  </View>
);

const StoneBorder = ({ size = 28 }) => (
  <View style={{ flexDirection: "row", gap: 3, alignItems: "center" }}>
    {[0, 1, 2, 3, 4].map((i) => (
      <View key={i} style={{
        width: size * 0.28, height: size * 0.28, borderRadius: 99,
        backgroundColor: i % 2 === 0 ? "#C4B0D8" : "#E8D5F8",
        borderWidth: 0.5, borderColor: "#9988BB",
      }}>
        <View style={{ position: "absolute", top: 2, left: 2, width: size * 0.08, height: size * 0.08, borderRadius: 99, backgroundColor: "#fff", opacity: 0.5 }} />
      </View>
    ))}
  </View>
);

const SatinBow = ({ size = 28 }) => (
  <View style={{ width: size * 2, height: size * 1.1, alignItems: "center", justifyContent: "center" }}>
    <View style={{ position: "absolute", left: 2, width: size * 0.75, height: size * 0.6, borderRadius: 6, backgroundColor: "#E07090", borderWidth: 1, borderColor: "#A04060", transform: [{ rotate: "18deg" }] }} />
    <View style={{ position: "absolute", right: 2, width: size * 0.75, height: size * 0.6, borderRadius: 6, backgroundColor: "#E07090", borderWidth: 1, borderColor: "#A04060", transform: [{ rotate: "-18deg" }] }} />
    <View style={{ width: size * 0.32, height: size * 0.32, borderRadius: 99, backgroundColor: "#C05070", borderWidth: 1, borderColor: "#903050", zIndex: 2 }} />
    <View style={{ position: "absolute", left: size * 0.15, bottom: 0, width: size * 0.18, height: size * 0.45, backgroundColor: "#D06080", borderRadius: 3, transform: [{ rotate: "15deg" }] }} />
    <View style={{ position: "absolute", right: size * 0.15, bottom: 0, width: size * 0.18, height: size * 0.45, backgroundColor: "#D06080", borderRadius: 3, transform: [{ rotate: "-15deg" }] }} />
  </View>
);

const ZariLace = ({ size = 28 }) => (
  <View style={{ width: size * 2.2, height: size * 0.7, backgroundColor: "#1A1208", borderRadius: 3, borderWidth: 1, borderColor: "#C8A96E", overflow: "hidden", alignItems: "center", justifyContent: "center" }}>
    <View style={{ flexDirection: "row", alignItems: "center", gap: 0 }}>
      {[...Array(10)].map((_, i) => (
        <View key={i} style={{ width: i % 3 === 0 ? 3 : 1.5, height: i % 3 === 0 ? size * 0.5 : size * 0.3, backgroundColor: "#C8A96E", marginHorizontal: 1.5, opacity: i % 3 === 0 ? 1 : 0.5 }} />
      ))}
    </View>
    <View style={{ position: "absolute", top: 2, left: 0, right: 0, height: 1, backgroundColor: "#C8A96E", opacity: 0.4 }} />
    <View style={{ position: "absolute", bottom: 2, left: 0, right: 0, height: 1, backgroundColor: "#C8A96E", opacity: 0.4 }} />
  </View>
);

const FloralLace = ({ size = 28 }) => (
  <View style={{ flexDirection: "row", gap: 3, alignItems: "center" }}>
    {[0, 1, 2, 3].map((i) => (
      <View key={i} style={{ alignItems: "center", justifyContent: "center", width: size * 0.55, height: size * 0.55 }}>
        {[0, 72, 144, 216, 288].map((angle, pi) => (
          <View key={pi} style={{
            position: "absolute",
            width: size * 0.2, height: size * 0.3,
            borderRadius: 99,
            backgroundColor: "#F5DDF5",
            borderWidth: 0.5, borderColor: "#D0A8D0",
            opacity: 0.85,
            transform: [{ rotate: `${angle}deg` }, { translateY: -size * 0.1 }],
          }} />
        ))}
        <View style={{ width: size * 0.18, height: size * 0.18, borderRadius: 99, backgroundColor: "#F9C0E0", zIndex: 1 }} />
      </View>
    ))}
  </View>
);

const Embroidery = ({ size = 28 }) => {
  const threads = [
    { h: 22, c: "#E8A020" }, { h: 14, c: "#C060A0" }, { h: 18, c: "#4080D0" },
    { h: 10, c: "#E8A020" }, { h: 20, c: "#50C080" }, { h: 12, c: "#C060A0" },
    { h: 16, c: "#4080D0" }, { h: 8, c: "#E8A020" }, { h: 18, c: "#50C080" },
    { h: 14, c: "#C060A0" },
  ];
  return (
    <View style={{ flexDirection: "row", alignItems: "flex-end", gap: 2.5 }}>
      {threads.map((t, i) => (
        <View key={i} style={{ width: 3, height: t.h, backgroundColor: t.c, borderRadius: 1.5 }} />
      ))}
    </View>
  );
};

const CrystalBead = ({ size = 28 }) => (
  <View style={{ flexDirection: "row", gap: 4, alignItems: "center" }}>
    {[0, 1, 2].map((i) => (
      <View key={i} style={{
        width: size * 0.42, height: size * 0.42, transform: [{ rotate: "45deg" }],
        backgroundColor: i === 1 ? "#A0D8EF" : "#D0EEFF",
        borderWidth: 1, borderColor: "#60B0D0",
        alignItems: "center", justifyContent: "center",
      }}>
        <View style={{ width: size * 0.1, height: size * 0.1, backgroundColor: "#fff", opacity: 0.7 }} />
      </View>
    ))}
  </View>
);

const DarkButton = ({ size = 28 }) => (
  <View style={{
    width: size, height: size, borderRadius: size / 2,
    backgroundColor: "#1A1A1A", borderWidth: 2, borderColor: "#555",
    alignItems: "center", justifyContent: "center",
  }}>
    <View style={{ width: size * 0.58, height: size * 0.58, borderRadius: 99, borderWidth: 1, borderColor: "#666", alignItems: "center", justifyContent: "center" }}>
      <View style={{ flexDirection: "row", gap: 2 }}>
        <View style={{ width: size * 0.1, height: size * 0.1, borderRadius: 99, backgroundColor: "#777" }} />
        <View style={{ width: size * 0.1, height: size * 0.1, borderRadius: 99, backgroundColor: "#777" }} />
      </View>
    </View>
  </View>
);

const CrochetEdge = ({ size = 28 }) => (
  <View style={{ flexDirection: "row", alignItems: "flex-end", gap: 2 }}>
    {[...Array(8)].map((_, i) => (
      <View key={i} style={{
        width: size * 0.25, height: i % 2 === 0 ? size * 0.55 : size * 0.32,
        borderWidth: 1.5, borderColor: "#F5F0E8", borderRadius: 99,
        backgroundColor: "transparent",
      }} />
    ))}
  </View>
);

const RoseApplique = ({ size = 28 }) => (
  <View style={{ width: size * 1.2, height: size * 1.2, alignItems: "center", justifyContent: "center" }}>
    {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
      <View key={i} style={{
        position: "absolute",
        width: size * 0.35, height: size * 0.42,
        borderRadius: 99,
        backgroundColor: i % 2 === 0 ? "#D44060" : "#C03050",
        borderWidth: 0.5, borderColor: "#901030",
        opacity: 0.9,
        transform: [{ rotate: `${angle}deg` }, { translateY: -size * 0.2 }],
      }} />
    ))}
    <View style={{ width: size * 0.25, height: size * 0.25, borderRadius: 99, backgroundColor: "#901030", zIndex: 2 }} />
  </View>
);

// ─── Decoration items registry ────────────────────────────────────────────────
const decoItems = [
  { id: "d1",  label: "Pearl Button",   render: (s) => <PearlButton size={s} /> },
  { id: "d2",  label: "Gold Button",    render: (s) => <GoldButton size={s} /> },
  { id: "d3",  label: "Stone Border",   render: (s) => <StoneBorder size={s} /> },
  { id: "d4",  label: "Satin Bow",      render: (s) => <SatinBow size={s} /> },
  { id: "d5",  label: "Zari Lace",      render: (s) => <ZariLace size={s} /> },
  { id: "d6",  label: "Floral Lace",    render: (s) => <FloralLace size={s} /> },
  { id: "d7",  label: "Embroidery",     render: (s) => <Embroidery size={s} /> },
  { id: "d8",  label: "Crystal Bead",   render: (s) => <CrystalBead size={s} /> },
  { id: "d9",  label: "Dark Button",    render: (s) => <DarkButton size={s} /> },
  { id: "d10", label: "Crochet Edge",   render: (s) => <CrochetEdge size={s} /> },
  { id: "d11", label: "Rose Appliqué",  render: (s) => <RoseApplique size={s} /> },
];

// ─── Draggable + Pinch-Resize + Rotate Decoration ────────────────────────────
// Fixes vs old version:
//  1. The old PanResponder claimed the gesture on ANY movement, even a 1px
//     jitter while tapping the × button — that stole the touch from the
//     TouchableOpacity before onPress could fire, so remove never worked.
//     Now onMoveShouldSetPanResponder only engages after a small threshold.
//  2. The corner square was a plain <View> with no handler at all — it never
//     resized anything. It now has its own PanResponder that drives `scale`.
//  3. Rotation depended entirely on a clean 2-finger pinch, which many
//     devices/emulators never report reliably. Added a dedicated single-finger
//     rotate handle so rotation works even without multitouch.
//  4. Reading `pan.x._value` / `scale._value` relies on Animated's private
//     internals. Replaced with listeners + extractOffset(), which is the
//     officially supported way to read/re-base an Animated.Value.
function DraggableDecoration({ item, onRemove }) {
  const pan       = useRef(new Animated.ValueXY({ x: item.x, y: item.y })).current;
  const scale     = useRef(new Animated.Value(1)).current;
  const rotation  = useRef(new Animated.Value(0)).current;

  const lastScale    = useRef(1);
  const lastRotation = useRef(0);
  const scaleVal     = useRef(1);
  const rotationVal  = useRef(0);
  const initDist     = useRef(null);
  const initAngle    = useRef(null);

  // Keep plain-number mirrors of the animated values via the public
  // listener API instead of touching Animated's private `_value`.
  useEffect(() => {
    const sId = scale.addListener(({ value }) => { scaleVal.current = value; });
    const rId = rotation.addListener(({ value }) => { rotationVal.current = value; });
    return () => {
      scale.removeListener(sId);
      rotation.removeListener(rId);
    };
  }, [scale, rotation]);

  const getDist = (t1, t2) => {
    const dx = t1.pageX - t2.pageX;
    const dy = t1.pageY - t2.pageY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const getAngle = (t1, t2) =>
    Math.atan2(t2.pageY - t1.pageY, t2.pageX - t1.pageX) * (180 / Math.PI);

  // ── Drag / pinch-resize / pinch-rotate on the decoration itself ──
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (e, gestureState) => {
        // Require real movement (or a genuine 2-finger touch) before
        // claiming the responder, so a tap on the × button isn't hijacked.
        return (
          e.nativeEvent.touches.length === 2 ||
          Math.abs(gestureState.dx) > 3 ||
          Math.abs(gestureState.dy) > 3
        );
      },
      onPanResponderGrant: () => {
        pan.extractOffset();
        initDist.current  = null;
        initAngle.current = null;
      },
      onPanResponderMove: (e, gestureState) => {
        const touches = e.nativeEvent.touches;
        if (touches.length === 2) {
          const dist  = getDist(touches[0], touches[1]);
          const angle = getAngle(touches[0], touches[1]);
          if (initDist.current === null) {
            initDist.current  = dist;
            initAngle.current = angle;
          } else {
            scale.setValue(
              Math.max(0.3, Math.min(4, lastScale.current * (dist / initDist.current)))
            );
            rotation.setValue(lastRotation.current + (angle - initAngle.current));
          }
        } else {
          Animated.event(
            [null, { dx: pan.x, dy: pan.y }],
            { useNativeDriver: false }
          )(e, gestureState);
        }
      },
      onPanResponderRelease: () => {
        pan.flattenOffset();
        lastScale.current    = scaleVal.current;
        lastRotation.current = rotationVal.current;
        initDist.current     = null;
        initAngle.current    = null;
      },
    })
  ).current;

  // ── Drag-the-corner-to-resize handle (works with a single finger) ──
  const resizeResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        lastScale.current = scaleVal.current;
      },
      onPanResponderMove: (e, gestureState) => {
        const delta = (gestureState.dx + gestureState.dy) / 2;
        scale.setValue(Math.max(0.3, Math.min(4, lastScale.current + delta / 60)));
      },
      onPanResponderRelease: () => {
        lastScale.current = scaleVal.current;
      },
    })
  ).current;

  // ── Drag-the-handle-to-rotate (works with a single finger) ──
  const rotateResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        lastRotation.current = rotationVal.current;
      },
      onPanResponderMove: (e, gestureState) => {
        rotation.setValue(lastRotation.current + gestureState.dx * 1.5);
      },
      onPanResponderRelease: () => {
        lastRotation.current = rotationVal.current;
      },
    })
  ).current;

  const rotDeg = rotation.interpolate({
    inputRange: [-360, 360],
    outputRange: ["-360deg", "360deg"],
  });

  return (
    <Animated.View
      style={[
        styles.decoOnFabric,
        { transform: [...pan.getTranslateTransform(), { scale }, { rotate: rotDeg }] },
      ]}
      {...panResponder.panHandlers}
    >
      {item.render(34)}

      <TouchableOpacity
        style={styles.decoRemoveBtn}
        onPress={() => onRemove(item.uid)}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Text style={styles.decoRemoveIcon}>×</Text>
      </TouchableOpacity>

      {/* Drag this to rotate */}
      <View
        style={styles.decoRotateBtn}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        {...rotateResponder.panHandlers}
      >
        <Text style={styles.decoRotateIcon}>⟳</Text>
      </View>

      {/* Drag this corner to resize */}
      <View
        style={styles.decoResizeCorner}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        {...resizeResponder.panHandlers}
      />
    </Animated.View>
  );
}

// ─── Main Screen ─────────────────────────────────────────────────────────────
export default function AppScreenPreview() {
  const [fabricImage, setFabricImage]             = useState(null);
  const [prediction, setPrediction]               = useState(null);
  const [confidence, setConfidence]               = useState(null);
  const [loading, setLoading]                     = useState(false);
  const [selectedCategory, setSelectedCategory]   = useState("Frocks");
  const [filteredTemplates, setFilteredTemplates] = useState(categories["Frocks"]);
  const [selectedTemplate, setSelectedTemplate]   = useState(categories["Frocks"][0]);
  const [isSaved, setIsSaved]                     = useState(false);
  const [userRating, setUserRating]               = useState(0);
  const [feedbackSent, setFeedbackSent]           = useState(false);
  const [placedDecos, setPlacedDecos]             = useState([]);

  // Chatbot state
  const [chatOpen, setChatOpen]         = useState(false);
  const [chatMessages, setChatMessages] = useState([
    {
      role: "assistant",
      content: "Hi! I'm your AI fashion stylist. Ask me anything about fabrics, outfit combinations, or styling tips for your design.",
    },
  ]);
  const [chatInput, setChatInput]       = useState("");
  const [chatLoading, setChatLoading]   = useState(false);
  const chatScrollRef                   = useRef(null);
  const previewRef                      = useRef(null); // captures the design for save/share
  const [isSaving, setIsSaving]         = useState(false);
  const [isSharing, setIsSharing]       = useState(false);

  useEffect(() => {
    (async () => {
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    })();
  }, []);

  useEffect(() => {
    setFilteredTemplates(categories[selectedCategory]);
    setSelectedTemplate(categories[selectedCategory][0]);
  }, [selectedCategory]);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
  mediaTypes: ["images"],
  quality: 1,
});
    if (!result.canceled) {
      const imageUri = result.assets?.[0]?.uri;
      setFabricImage(imageUri);
      setIsSaved(false);
      setUserRating(0);
      setFeedbackSent(false);
      setPlacedDecos([]);

      const formData = new FormData();
formData.append("file", {
  uri: imageUri,
  type: "image/jpeg",
  name: "photo.jpg",
});

      try {
        setLoading(true);
        setPrediction(null);
        setConfidence(null);

        const response = await fetch("https://fabric-backend-production-ae3a.up.railway.app/predict", {
          method: "POST",
          body: formData,
        });
        const data = await response.json();
        console.log("RESPONSE:", data);
        setPrediction(data.prediction);
        setConfidence(data.confidence);
      } catch (error) {
        console.log("API Error:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSave = async () => {
    if (!fabricImage || !previewRef.current || isSaving) return;
    try {
      setIsSaving(true);

      const { status, canAskAgain } = await MediaLibrary.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Needed",
          canAskAgain
            ? "Please allow access to your photos so the design can be saved."
            : "Photo access is disabled. Please enable it from your device Settings.",
          [{ text: "OK" }]
        );
        return;
      }

      // Render the current preview (fabric + template + decorations) to a PNG.
      const uri = await previewRef.current.capture();
      await MediaLibrary.saveToLibraryAsync(uri);

      setIsSaved(true);
      Alert.alert("Saved!", "Your design has been saved to your gallery.", [{ text: "OK" }]);
    } catch (error) {
      console.log("Save error:", error);
      Alert.alert("Error", "Could not save the design. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleShare = async () => {
    if (!fabricImage || !previewRef.current || isSharing) return;
    try {
      setIsSharing(true);

      // Render the current preview to a PNG so we can actually share the image,
      // not just a caption.
      const uri = await previewRef.current.capture();
      const canShareFiles = await Sharing.isAvailableAsync();

      if (canShareFiles) {
        await Sharing.shareAsync(uri, {
          mimeType: "image/png",
          dialogTitle: "Share your outfit design",
        });
      } else {
        // Fallback for platforms where native file sharing isn't available
        // (e.g. web) — at least share the caption instead of failing silently.
        await Share.share({
          message: `Check out this ${selectedTemplate.name} outfit styled with ${
            prediction || "my fabric"
          } — designed using Virtual Fashion Designer! 👗✨`,
          title: "My Virtual Outfit",
        });
      }
    } catch (error) {
      console.log("Share error:", error);
      Alert.alert("Error", "Could not share at this time.");
    } finally {
      setIsSharing(false);
    }
  };

  const handleRatingSubmit = () => {
    if (userRating === 0) {
      Alert.alert("Rate First", "Please tap a star before submitting.");
      return;
    }
    setFeedbackSent(true);
    Alert.alert(
      "Thank You! ⭐",
      `You rated this look ${userRating} star${userRating > 1 ? "s" : ""}. Your feedback helps us improve!`,
      [{ text: "OK" }]
    );
  };

  const addDecoration = (item) => {
    setPlacedDecos((prev) => [
      ...prev,
      {
        ...item,
        uid: `${item.id}_${Date.now()}_${Math.random()}`,
        x: 40 + Math.random() * 180,
        y: 40 + Math.random() * 150,
      },
    ]);
  };

  const removeDecoration = (uid) => {
    setPlacedDecos((prev) => prev.filter((d) => d.uid !== uid));
  };

  // ── Chatbot ──
  const sendChatMessage = async () => {
    if (!chatInput.trim() || chatLoading) return;

    const userMsg = chatInput.trim();
    setChatInput("");
    const updatedMessages = [...chatMessages, { role: "user", content: userMsg }];
    setChatMessages(updatedMessages);
    setChatLoading(true);

    setTimeout(() => chatScrollRef.current?.scrollToEnd({ animated: true }), 100);

    const currentFabric = prediction && typeof prediction === "string" ? prediction : null;
    const currentConfidence = confidence !== null ? Math.round(confidence * 100) : null;
    const currentFabricInfo = currentFabric
      ? fabricDetails[currentFabric] || fabricDetails["Default"]
      : null;

    const context = [
      currentFabric
        ? `The user's fabric has been detected as: ${currentFabric} (${currentConfidence}% confidence).`
        : "No fabric has been detected yet.",
      selectedTemplate
        ? `Currently previewing the "${selectedTemplate.name}" style in the "${selectedCategory}" category.`
        : "",
      currentFabricInfo
        ? `Fabric properties: breathability ${currentFabricInfo.breathability}, durability ${currentFabricInfo.durability}, care: ${currentFabricInfo.care}, season: ${currentFabricInfo.season}, best for: ${currentFabricInfo.bestFor}.`
        : "",
    ]
      .filter(Boolean)
      .join(" ");

    const systemPrompt = `You are an expert AI fashion stylist assistant embedded in a virtual fashion design app called "Virtual Fashion Designer". ${context} Give concise, practical, warm advice. Focus on fabric care, outfit combinations, tailoring tips, and style recommendations relevant to South Asian fashion. Keep responses under 3 sentences unless asked for more.`;

    try {
      const apiMessages = updatedMessages
        .filter((m) => !(m.role === "assistant" && m === chatMessages[0]))
        .map((m) => ({ role: m.role, content: m.content }));

      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: "openai/gpt-oss-20b",
          max_tokens: 300,
          messages: [
            { role: "system", content: systemPrompt },
            ...apiMessages,
          ],
        }),
      });

      const data = await response.json();
      console.log("Groq response:", JSON.stringify(data));

      const reply =
        data.choices?.[0]?.message?.content ||
        "Sorry, I couldn't respond right now. Please try again!";

      setChatMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch (e) {
      console.log("Chat error:", e.message);
      setChatMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Connection error. Please check your internet and try again." },
      ]);
    } finally {
      setChatLoading(false);
      setTimeout(() => chatScrollRef.current?.scrollToEnd({ animated: true }), 100);
    }
  };
  const predictedFabric =
    prediction && typeof prediction === "string" ? prediction : null;
  const confidencePct =
    confidence !== null && confidence !== undefined
      ? Math.round(confidence * 100)
      : null;
  const fabricInfo =
    predictedFabric && fabricDetails[predictedFabric]
      ? fabricDetails[predictedFabric]
      : predictedFabric
      ? fabricDetails["Default"]
      : null;

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={C.bg} />
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* ── HEADER ── */}
        <View style={styles.header}>
          <Text style={styles.headerEyebrow}>VIRTUAL STYLING</Text>
          <Text style={styles.headerTitle}>Style You</Text>
          <Text style={styles.headerTitle2}>Virtually</Text>
          <View style={styles.headerLine} />
        </View>

        {/* ── UPLOAD ── */}
        <TouchableOpacity
          style={[styles.uploadBtn, fabricImage && styles.uploadBtnActive]}
          onPress={pickImage}
          activeOpacity={0.8}
        >
          <View style={styles.uploadBtnInner}>
            <Text style={styles.uploadIcon}>{fabricImage ? "✦" : "⊕"}</Text>
            <Text style={styles.uploadBtnText}>
              {fabricImage ? "Change Fabric" : "Upload Fabric"}
            </Text>
          </View>
        </TouchableOpacity>

        {/* ── PREVIEW ── */}
        <View style={styles.previewContainer}>
          <Text style={styles.sectionLabel}>PREVIEW</Text>
          <View style={styles.previewFrame}>
            {fabricImage ? (
              <>
                <ViewShot
                  ref={previewRef}
                  style={StyleSheet.absoluteFill}
                  options={{ format: "png", quality: 1 }}
                >
                  <View style={StyleSheet.absoluteFill}>
                    <Image source={{ uri: fabricImage }} style={styles.fabric} />
                    <Image source={selectedTemplate.image} style={styles.template} />
                  </View>

                  {/* Placed decorations */}
                  {placedDecos.map((item) => (
                    <DraggableDecoration
                      key={item.uid}
                      item={item}
                      onRemove={removeDecoration}
                    />
                  ))}
                </ViewShot>

                <View style={[styles.corner, styles.cornerTL]} />
                <View style={[styles.corner, styles.cornerTR]} />
                <View style={[styles.corner, styles.cornerBL]} />
                <View style={[styles.corner, styles.cornerBR]} />
              </>
            ) : (
              <View style={styles.emptyPreview}>
                <Text style={styles.emptyIcon}>◈</Text>
                <Text style={styles.emptyText}>No fabric selected</Text>
                <Text style={styles.emptySubtext}>Upload a fabric to begin</Text>
              </View>
            )}
          </View>

          {fabricImage && (
            <View style={styles.previewMeta}>
              <Text style={styles.templateLabelText}>{selectedTemplate.name}</Text>
              <View style={styles.actionRow}>
                <TouchableOpacity
                  style={[styles.actionBtn, isSaved && styles.actionBtnActive]}
                  onPress={handleSave}
                  activeOpacity={0.8}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <ActivityIndicator size="small" color={C.accent} />
                  ) : (
                    <Text style={styles.actionBtnIcon}>{isSaved ? "♥" : "♡"}</Text>
                  )}
                  <Text style={[styles.actionBtnText, isSaved && styles.actionBtnTextActive]}>
                    {isSaving ? "Saving..." : isSaved ? "Saved" : "Save"}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.actionBtn}
                  onPress={handleShare}
                  activeOpacity={0.8}
                  disabled={isSharing}
                >
                  {isSharing ? (
                    <ActivityIndicator size="small" color={C.accent} />
                  ) : (
                    <Text style={styles.actionBtnIcon}>⬆</Text>
                  )}
                  <Text style={styles.actionBtnText}>{isSharing ? "Sharing..." : "Share"}</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>

        {/* ── DECORATION PICKER ── */}
        {fabricImage && (
          <View style={styles.decoPanel}>
            <View style={styles.decoPanelHeader}>
              <Text style={styles.sectionLabel}>DECORATIONS</Text>
              {placedDecos.length > 0 && (
                <TouchableOpacity onPress={() => setPlacedDecos([])}>
                  <Text style={styles.decoClearText}>CLEAR ALL</Text>
                </TouchableOpacity>
              )}
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.decoScroll}
            >
              {decoItems.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.decoChip}
                  activeOpacity={0.75}
                  onPress={() => addDecoration(item)}
                >
                  <View style={styles.decoChipVisual}>
                    {item.render(20)}
                  </View>
                  <Text style={styles.decoChipLabel}>{item.label.toUpperCase()}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <Text style={styles.decoHint}>
              TAP TO PLACE  ·  DRAG TO MOVE  ·  PINCH TO RESIZE  ·  TWIST TO ROTATE  ·  × TO REMOVE
            </Text>
          </View>
        )}

        {/* ── AI RESULT ── */}
        {loading && (
          <View style={styles.resultCard}>
            <ActivityIndicator color={C.accent} size="small" />
            <Text style={styles.resultLoadingText}>Analysing fabric...</Text>
          </View>
        )}

        {predictedFabric && !loading && (
          <View style={styles.resultCard}>
            <View style={styles.resultRow}>
              <Text style={styles.resultIcon}>◈</Text>
              <View>
                <Text style={styles.resultLabel}>DETECTED FABRIC</Text>
                <Text style={styles.resultValue}>{predictedFabric}</Text>
              </View>
            </View>

            {confidencePct !== null && (
              <>
                <View style={styles.confidenceBar}>
                  <View style={[styles.confidenceFill, { width: `${confidencePct}%` }]} />
                </View>
                <Text style={styles.confidenceText}>{confidencePct}% confidence</Text>
              </>
            )}
          </View>
        )}

        {/* ── FABRIC DETAILS ── */}
        {fabricInfo && !loading && (
          <View style={styles.fabricDetailsCard}>
            <View style={styles.fabricDetailsHeader}>
              <Text style={styles.fabricDetailsIcon}>{fabricInfo.icon}</Text>
              <Text style={styles.fabricDetailsTitle}>FABRIC DETAILS</Text>
            </View>

            <View style={styles.fabricDetailsGrid}>
              <View style={styles.fabricDetailItem}>
                <Text style={styles.fabricDetailKey}>BREATHABILITY</Text>
                <Text style={styles.fabricDetailVal}>{fabricInfo.breathability}</Text>
              </View>
              <View style={styles.fabricDetailItem}>
                <Text style={styles.fabricDetailKey}>DURABILITY</Text>
                <Text style={styles.fabricDetailVal}>{fabricInfo.durability}</Text>
              </View>
              <View style={styles.fabricDetailItem}>
                <Text style={styles.fabricDetailKey}>CARE</Text>
                <Text style={styles.fabricDetailVal}>{fabricInfo.care}</Text>
              </View>
              <View style={styles.fabricDetailItem}>
                <Text style={styles.fabricDetailKey}>SEASON</Text>
                <Text style={styles.fabricDetailVal}>{fabricInfo.season}</Text>
              </View>
            </View>

            <View style={styles.fabricBestFor}>
              <Text style={styles.fabricDetailKey}>BEST FOR  —  </Text>
              <Text style={styles.fabricBestForVal}>{fabricInfo.bestFor}</Text>
            </View>
          </View>
        )}

        {/* ── CATEGORIES ── */}
        <Text style={styles.sectionLabel}>CATEGORY</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.catScroll}
          contentContainerStyle={styles.catScrollContent}
        >
          {Object.keys(categories).map((cat) => {  //converting objects to categories cat loop creation
            const active = selectedCategory === cat;  //active checks if category selected
            return (
              <TouchableOpacity
                key={cat}
                onPress={() => setSelectedCategory(cat)}
                style={[styles.catChip, active && styles.catChipActive]}
                activeOpacity={0.75}
              >
                <Text style={styles.catChipIcon}>{catIcons[cat] || "✦"}</Text>
                <Text style={[styles.catChipText, active && styles.catChipTextActive]}>
                  {cat}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* ── TEMPLATES ── */}
        <Text style={styles.sectionLabel}>STYLES</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.templateScroll}
        >
          {filteredTemplates.map((item) => {
            const active = selectedTemplate?.id === item.id;
            return (
              <TouchableOpacity
                key={item.id}
                onPress={() => setSelectedTemplate(item)}
                style={[styles.templateCard, active && styles.templateCardActive]}
                activeOpacity={0.8}
              >
                <Image source={item.image} style={styles.templateThumb} />
                {active && <View style={styles.templateActiveDot} />}
                <Text
                  style={[styles.templateName, active && styles.templateNameActive]}
                  numberOfLines={2}
                >
                  {item.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* ── RATING & FEEDBACK ── */}
        {fabricImage && (
          <View style={styles.ratingCard}>
            <Text style={styles.sectionLabel}>RATE THIS LOOK</Text>
            <Text style={styles.ratingSubtitle}>
              How do you feel about this outfit combination?
            </Text>

            <View style={styles.starsRow}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity
                  key={star}
                  onPress={() => !feedbackSent && setUserRating(star)}
                  activeOpacity={0.7}
                  style={styles.starBtn}
                >
                  <Text style={[styles.starIcon, star <= userRating && styles.starIconActive]}>
                    {star <= userRating ? "★" : "☆"}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {userRating > 0 && (
              <Text style={styles.ratingLabel}>
                {["", "Not Quite", "It's Okay", "Looks Good", "Love It!", "Perfect! ✦"][userRating]}
              </Text>
            )}

            {!feedbackSent ? (
              <TouchableOpacity
                style={styles.ratingSubmitBtn}
                onPress={handleRatingSubmit}
                activeOpacity={0.8}
              >
                <Text style={styles.ratingSubmitText}>SUBMIT FEEDBACK</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.ratingThanks}>
                <Text style={styles.ratingThanksIcon}>✦</Text>
                <Text style={styles.ratingThanksText}>Thank you for your feedback!</Text>
              </View>
            )}
          </View>
        )}

        {/* ── AI FASHION CHATBOT ── */}
        <View style={styles.chatPanel}>
          <TouchableOpacity
            style={styles.chatToggle} //it will set chat ipen or close
            onPress={() => setChatOpen((p) => !p)}   //p = previous state (true/false) !p = opposite value
            activeOpacity={0.8}
          >
            <View style={styles.chatToggleLeft}>
              <View style={styles.chatAiDot} />
              <Text style={styles.chatToggleLabel}>AI FASHION STYLIST</Text>
            </View>
            <View style={styles.chatToggleRight}>
              <View style={styles.chatBadge}>
                <Text style={styles.chatBadgeText}>AI</Text>
              </View>
              <Text style={styles.chatChevron}>{chatOpen ? "▾" : "▸"}</Text>
            </View>
          </TouchableOpacity>

          {chatOpen && (
            <>
              {/* Suggestion chips */}
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.chatSuggestions}
              >
                {[
                  "Best fabric for summer?",
                  "How to care for silk?",
                  "Match fabric to this style?",
                  "What embroidery suits this?",
                ].map((suggestion) => (
                  <TouchableOpacity
                    key={suggestion}
                    style={styles.chatSuggestionChip}
                    onPress={() => {
                      setChatInput(suggestion);
                    }}
                    activeOpacity={0.75}
                  >
                    <Text style={styles.chatSuggestionText}>{suggestion}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              {/* Messages */}
              <ScrollView
                ref={chatScrollRef}
                style={styles.chatMessages}
                contentContainerStyle={styles.chatMessagesContent}
                showsVerticalScrollIndicator={false}
                onContentSizeChange={() =>
                  chatScrollRef.current?.scrollToEnd({ animated: true })
                }
              >
                {chatMessages.map((msg, i) => (          // i =index of message
                  <View
                    key={i}                              // it will help react to unique track each change
                    style={[
                      styles.chatBubbleWrapper,
                      msg.role === "user"           //if message is of user
                        ? styles.chatBubbleWrapperUser
                        : styles.chatBubbleWrapperAssistant,
                    ]}
                  >
                    {msg.role === "assistant" && (
                      <View style={styles.chatAvatarDot} />
                    )}
                    <View
                      style={[
                        styles.chatBubble, //common design on every message
                        msg.role === "user"
                          ? styles.chatBubbleUser
                          : styles.chatBubbleAssistant,
                      ]}
                    >
                      {msg.role === "assistant" && (
                        <Text style={styles.chatBubbleSender}>STYLIST AI</Text>
                      )}
                      <Text style={styles.chatBubbleText}>{msg.content}</Text>
                    </View>
                  </View>
                ))}
                {chatLoading && (
                  <View style={[styles.chatBubbleWrapper, styles.chatBubbleWrapperAssistant]}>
                    <View style={styles.chatAvatarDot} />
                    <View style={[styles.chatBubble, styles.chatBubbleAssistant, styles.chatBubbleTyping]}>
                      <ActivityIndicator color={C.accent} size="small" />
                      <Text style={styles.chatTypingText}>Styling advice...</Text>
                    </View>
                  </View>
                )}
              </ScrollView>

              {/* Input */}
              <View style={styles.chatInputRow}>
                <TextInput
                  style={styles.chatInput}
                  value={chatInput}
                  onChangeText={setChatInput}
                  placeholder="Ask about fabrics, styles, care..."
                  placeholderTextColor={C.textDim}
                  onSubmitEditing={sendChatMessage}
                  returnKeyType="send"
                  multiline={false}
                />
                <TouchableOpacity
                  style={[
                    styles.chatSendBtn,
                    (!chatInput.trim() || chatLoading) && styles.chatSendBtnDisabled,
                  ]}
                  onPress={sendChatMessage}
                  activeOpacity={0.8}
                >
                  <Text style={styles.chatSendIcon}>⬆</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>

        <View style={{ height: 40 }} />

        {/* ── FOOTER ── */}
        <View style={styles.footer}>
          <View style={styles.footerLine} />
          <Text style={styles.footerEyebrow}>AI POWERED FASHION TECHNOLOGY</Text>
          <Text style={styles.footerTitle}>Virtual Fashion Designer</Text>
          <Text style={styles.footerDescription}>
            Upload fabric, detect material using AI, and preview fashion designs
            before tailoring.
          </Text>
          <Text style={styles.footerVersion}>Version 1.0</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  scroll: { paddingHorizontal: 20, paddingTop: Platform.OS === "ios" ? 60 : 40 },

  // ── HEADER ──
  header: { marginBottom: 28 },
  headerEyebrow: {
    fontFamily: Platform.OS === "ios" ? "Courier New" : "monospace",
    fontSize: 10, letterSpacing: 4, color: C.accent, marginBottom: 6,
  },
  headerTitle: {
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
    fontSize: 40, color: C.text, lineHeight: 44, fontWeight: "300", letterSpacing: -1,
  },
  headerTitle2: {
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
    fontSize: 40, color: C.accent, lineHeight: 44, fontWeight: "300",
    letterSpacing: -1, fontStyle: "italic",
  },
  headerLine: { width: 40, height: 1, backgroundColor: C.accent, marginTop: 14 },

  // ── UPLOAD ──
  uploadBtn: {
    borderWidth: 1, borderColor: C.border, borderRadius: 4,
    paddingVertical: 16, paddingHorizontal: 24, marginBottom: 28, backgroundColor: C.surface,
  },
  uploadBtnActive: { borderColor: C.accentDim, backgroundColor: C.accentBg },
  uploadBtnInner: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10 },
  uploadIcon: { fontSize: 18, color: C.accent },
  uploadBtnText: {
    fontFamily: Platform.OS === "ios" ? "Courier New" : "monospace",
    fontSize: 12, letterSpacing: 3, color: C.accent,
  },

  sectionLabel: {
    fontFamily: Platform.OS === "ios" ? "Courier New" : "monospace",
    fontSize: 9, letterSpacing: 4, color: C.textMuted, marginBottom: 10,
  },

  // ── PREVIEW ──
  previewContainer: { marginBottom: 20 },
  previewFrame: {
    width: 350, height: 300, alignSelf: "center",
    backgroundColor: C.bg, borderRadius: 6,
    borderWidth: 1, borderColor: C.border, overflow: "hidden", position: "relative",
  },
  fabric: { ...StyleSheet.absoluteFillObject, resizeMode: "cover" },
  template: { width: "100%", height: "100%", position: "absolute", resizeMode: "stretch" },
  corner: { position: "absolute", width: 16, height: 16, borderColor: C.accent },
  cornerTL: { top: 10, left: 10, borderTopWidth: 1.5, borderLeftWidth: 1.5 },
  cornerTR: { top: 10, right: 10, borderTopWidth: 1.5, borderRightWidth: 1.5 },
  cornerBL: { bottom: 10, left: 10, borderBottomWidth: 1.5, borderLeftWidth: 1.5 },
  cornerBR: { bottom: 10, right: 10, borderBottomWidth: 1.5, borderRightWidth: 1.5 },
  emptyPreview: { flex: 1, alignItems: "center", justifyContent: "center" },
  emptyIcon: { fontSize: 28, color: C.textDim, marginBottom: 8 },
  emptyText: {
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
    fontSize: 15, color: C.textMuted, fontStyle: "italic",
  },
  emptySubtext: {
    fontFamily: Platform.OS === "ios" ? "Courier New" : "monospace",
    fontSize: 9, letterSpacing: 2, color: C.textDim, marginTop: 6,
  },

  // ── PREVIEW META ──
  previewMeta: {
    flexDirection: "row", alignItems: "center",
    justifyContent: "space-between", marginTop: 10,
  },
  templateLabelText: {
    fontFamily: Platform.OS === "ios" ? "Courier New" : "monospace",
    fontSize: 9, letterSpacing: 3, color: C.accentDim,
  },

  // ── SAVE & SHARE ──
  actionRow: { flexDirection: "row", gap: 8 },
  actionBtn: {
    flexDirection: "row", alignItems: "center", gap: 5,
    paddingVertical: 7, paddingHorizontal: 14,
    borderRadius: 100, borderWidth: 1, borderColor: C.border,
    backgroundColor: C.surface,
  },
  actionBtnActive: { borderColor: C.accent, backgroundColor: C.accentBg },
  actionBtnIcon: { fontSize: 13, color: C.accent },
  actionBtnText: {
    fontFamily: Platform.OS === "ios" ? "Courier New" : "monospace",
    fontSize: 9, letterSpacing: 2, color: C.textMuted,
  },
  actionBtnTextActive: { color: C.accent },

  // ── DECORATION PANEL ──
  decoPanel: {
    backgroundColor: C.surface, borderWidth: 1, borderColor: C.border,
    borderRadius: 4, padding: 14, marginBottom: 20,
  },
  decoPanelHeader: {
    flexDirection: "row", justifyContent: "space-between",
    alignItems: "center", marginBottom: 10,
  },
  decoClearText: {
    fontFamily: Platform.OS === "ios" ? "Courier New" : "monospace",
    fontSize: 8, letterSpacing: 2, color: C.danger,
  },
  decoScroll: { gap: 8, paddingVertical: 4 },
  decoChip: {
    alignItems: "center", justifyContent: "center",
    minWidth: 64, paddingHorizontal: 8, paddingVertical: 10,
    backgroundColor: C.card, borderWidth: 1, borderColor: C.border, borderRadius: 4,
  },
  decoChipVisual: {
    height: 34, alignItems: "center", justifyContent: "center", marginBottom: 5,
  },
  decoChipLabel: {
    fontFamily: Platform.OS === "ios" ? "Courier New" : "monospace",
    fontSize: 6, letterSpacing: 0.5, color: C.textDim, textAlign: "center",
  },
  decoHint: {
    fontFamily: Platform.OS === "ios" ? "Courier New" : "monospace",
    fontSize: 7, letterSpacing: 1.5, color: C.textDim,
    textAlign: "center", marginTop: 10,
  },

  // ── DECORATION ON FABRIC ──
  decoOnFabric: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
  decoRemoveBtn: {
    position: "absolute", top: -10, right: -10,
    backgroundColor: C.danger, borderRadius: 10,
    width: 20, height: 20, alignItems: "center", justifyContent: "center",
    zIndex: 11,
  },
  decoRemoveIcon: {
    color: C.white, fontSize: 14, lineHeight: 20,
    fontWeight: "700", textAlign: "center",
  },
  decoResizeCorner: {
    position: "absolute", bottom: -10, right: -10,
    width: 20, height: 20, borderRadius: 4,
    backgroundColor: C.accent, opacity: 0.9,
    zIndex: 11,
    alignItems: "center", justifyContent: "center",
  },
  decoRotateBtn: {
    position: "absolute", top: -10, left: -10,
    backgroundColor: C.surface, borderRadius: 10,
    width: 20, height: 20, alignItems: "center", justifyContent: "center",
    borderWidth: 1, borderColor: C.accent,
    zIndex: 11,
  },
  decoRotateIcon: {
    color: C.accent, fontSize: 12, fontWeight: "700", textAlign: "center",
  },

  // ── AI RESULT CARD ──
  resultCard: {
    backgroundColor: C.surface, borderWidth: 1, borderColor: C.border,
    borderRadius: 4, padding: 16, marginBottom: 24, gap: 10,
  },
  resultRow: { flexDirection: "row", alignItems: "center", gap: 14 },
  resultIcon: { fontSize: 22, color: C.accent },
  resultLabel: {
    fontFamily: Platform.OS === "ios" ? "Courier New" : "monospace",
    fontSize: 8, letterSpacing: 3, color: C.textMuted, marginBottom: 3,
  },
  resultValue: {
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
    fontSize: 20, color: C.text, fontWeight: "500",
  },
  resultLoadingText: {
    fontFamily: Platform.OS === "ios" ? "Courier New" : "monospace",
    fontSize: 10, letterSpacing: 3, color: C.textMuted, textAlign: "center", marginTop: 4,
  },
  confidenceBar: { height: 2, backgroundColor: C.border, borderRadius: 2, overflow: "hidden" },
  confidenceFill: { height: "100%", backgroundColor: C.success, borderRadius: 2 },
  confidenceText: {
    fontFamily: Platform.OS === "ios" ? "Courier New" : "monospace",
    fontSize: 9, letterSpacing: 2, color: C.success,
  },

  // ── FABRIC DETAILS CARD ──
  fabricDetailsCard: {
    backgroundColor: C.surface, borderWidth: 1, borderColor: C.border,
    borderRadius: 4, padding: 16, marginBottom: 24,
  },
  fabricDetailsHeader: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 14 },
  fabricDetailsIcon: { fontSize: 18 },
  fabricDetailsTitle: {
    fontFamily: Platform.OS === "ios" ? "Courier New" : "monospace",
    fontSize: 9, letterSpacing: 4, color: C.textMuted,
  },
  fabricDetailsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12, marginBottom: 12 },
  fabricDetailItem: {
    width: "45%", backgroundColor: C.card, borderRadius: 4,
    padding: 10, borderWidth: 1, borderColor: C.border,
  },
  fabricDetailKey: {
    fontFamily: Platform.OS === "ios" ? "Courier New" : "monospace",
    fontSize: 7, letterSpacing: 2, color: C.textDim, marginBottom: 4,
  },
  fabricDetailVal: {
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
    fontSize: 13, color: C.accent, fontStyle: "italic",
  },
  fabricBestFor: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: C.accentBg, borderRadius: 4,
    paddingVertical: 8, paddingHorizontal: 12,
    borderWidth: 1, borderColor: C.accentDim,
  },
  fabricBestForVal: {
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
    fontSize: 12, color: C.accent,
  },

  // ── CATEGORIES ──
  catScroll: { marginBottom: 24 },
  catScrollContent: { paddingVertical: 2, gap: 8 },
  catChip: {
    flexDirection: "row", alignItems: "center", gap: 6,
    paddingVertical: 8, paddingHorizontal: 14, borderRadius: 100,
    borderWidth: 1, borderColor: C.border, backgroundColor: C.surface,
  },
  catChipActive: { backgroundColor: C.accentBg, borderColor: C.accent },
  catChipIcon: { fontSize: 12 },
  catChipText: {
    fontFamily: Platform.OS === "ios" ? "Courier New" : "monospace",
    fontSize: 10, letterSpacing: 1, color: C.textMuted,
  },
  catChipTextActive: { color: C.accent },

  // ── TEMPLATES ──
  templateScroll: { gap: 12, paddingVertical: 4, marginBottom: 24 },
  templateCard: {
    width: 90, alignItems: "center", backgroundColor: C.surface,
    borderRadius: 4, borderWidth: 1, borderColor: C.border, padding: 8, paddingBottom: 10,
  },
  templateCardActive: { borderColor: C.accent, backgroundColor: C.accentBg },
  templateThumb: { width: 70, height: 80, resizeMode: "contain", marginBottom: 6 },
  templateActiveDot: {
    width: 4, height: 4, borderRadius: 2, backgroundColor: C.accent, marginBottom: 4,
  },
  templateName: {
    fontFamily: Platform.OS === "ios" ? "Courier New" : "monospace",
    fontSize: 8, letterSpacing: 1, color: C.textMuted, textAlign: "center", lineHeight: 12,
  },
  templateNameActive: { color: C.accent },

  // ── RATING CARD ──
  ratingCard: {
    backgroundColor: C.surface, borderWidth: 1, borderColor: C.border,
    borderRadius: 4, padding: 18, marginBottom: 20,
  },
  ratingSubtitle: {
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
    fontSize: 13, color: C.textMuted, fontStyle: "italic", marginBottom: 16,
  },
  starsRow: { flexDirection: "row", gap: 8, marginBottom: 10 },
  starBtn: { padding: 4 },
  starIcon: { fontSize: 28, color: C.textDim },
  starIconActive: { color: C.accent },
  ratingLabel: {
    fontFamily: Platform.OS === "ios" ? "Courier New" : "monospace",
    fontSize: 9, letterSpacing: 3, color: C.accentDim, marginBottom: 14,
  },
  ratingSubmitBtn: {
    borderWidth: 1, borderColor: C.accent, borderRadius: 4,
    paddingVertical: 12, alignItems: "center", marginTop: 4,
    backgroundColor: C.accentBg,
  },
  ratingSubmitText: {
    fontFamily: Platform.OS === "ios" ? "Courier New" : "monospace",
    fontSize: 10, letterSpacing: 3, color: C.accent,
  },
  ratingThanks: {
    flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 6,
  },
  ratingThanksIcon: { fontSize: 14, color: C.success },
  ratingThanksText: {
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
    fontSize: 14, color: C.success, fontStyle: "italic",
  },

  // ── CHATBOT ──
  chatPanel: {
    backgroundColor: C.surface, borderWidth: 1, borderColor: C.border,
    borderRadius: 4, marginBottom: 24, overflow: "hidden",
  },
  chatToggle: {
    flexDirection: "row", alignItems: "center",
    justifyContent: "space-between", padding: 14,
  },
  chatToggleLeft: { flexDirection: "row", alignItems: "center", gap: 10 },
  chatToggleRight: { flexDirection: "row", alignItems: "center", gap: 8 },
  chatAiDot: {
    width: 7, height: 7, borderRadius: 99,
    backgroundColor: C.success,
  },
  chatToggleLabel: {
    fontFamily: Platform.OS === "ios" ? "Courier New" : "monospace",
    fontSize: 9, letterSpacing: 4, color: C.textMuted,
  },
  chatBadge: {
    backgroundColor: C.accentBg, borderWidth: 1, borderColor: C.accentDim,
    borderRadius: 3, paddingHorizontal: 6, paddingVertical: 2,
  },
  chatBadgeText: {
    fontFamily: Platform.OS === "ios" ? "Courier New" : "monospace",
    fontSize: 8, letterSpacing: 2, color: C.accent,
  },
  chatChevron: { fontSize: 13, color: C.textMuted },
  chatSuggestions: {
    paddingHorizontal: 12, paddingBottom: 10, gap: 8,
    borderTopWidth: 1, borderTopColor: C.border, paddingTop: 10,
  },
  chatSuggestionChip: {
    paddingVertical: 6, paddingHorizontal: 12,
    borderRadius: 100, borderWidth: 1, borderColor: C.border,
    backgroundColor: C.card,
  },
  chatSuggestionText: {
    fontFamily: Platform.OS === "ios" ? "Courier New" : "monospace",
    fontSize: 9, letterSpacing: 1, color: C.textMuted,
  },
  chatMessages: {
    maxHeight: 300,
    borderTopWidth: 1, borderTopColor: C.border,
  },
  chatMessagesContent: { padding: 12, gap: 10 },
  chatBubbleWrapper: { flexDirection: "row", alignItems: "flex-end", gap: 8 },
  chatBubbleWrapperUser: { justifyContent: "flex-end" },
  chatBubbleWrapperAssistant: { justifyContent: "flex-start" },
  chatAvatarDot: {
    width: 8, height: 8, borderRadius: 99,
    backgroundColor: C.accent, marginBottom: 4, flexShrink: 0,
  },
  chatBubble: {
    maxWidth: "80%", borderRadius: 4, padding: 10,
  },
  chatBubbleUser: {
    backgroundColor: C.accentBg,
    borderWidth: 1, borderColor: C.accentDim,
  },
  chatBubbleAssistant: {
    backgroundColor: C.card,
    borderWidth: 1, borderColor: C.border,
  },
  chatBubbleTyping: {
    flexDirection: "row", alignItems: "center", gap: 8, paddingVertical: 12,
  },
  chatTypingText: {
    fontFamily: Platform.OS === "ios" ? "Courier New" : "monospace",
    fontSize: 9, letterSpacing: 2, color: C.textMuted,
  },
  chatBubbleSender: {
    fontFamily: Platform.OS === "ios" ? "Courier New" : "monospace",
    fontSize: 7, letterSpacing: 2, color: C.accentDim, marginBottom: 4,
  },
  chatBubbleText: {
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
    fontSize: 13, color: C.text, lineHeight: 20,
  },
  chatInputRow: {
    flexDirection: "row", borderTopWidth: 1, borderTopColor: C.border,
    padding: 10, gap: 8, alignItems: "center",
  },
  chatInput: {
    flex: 1, backgroundColor: C.card, borderWidth: 1, borderColor: C.border,
    borderRadius: 4, paddingHorizontal: 12, paddingVertical: 9,
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
    fontSize: 13, color: C.text,
  },
  chatSendBtn: {
    width: 40, height: 40, borderRadius: 4, backgroundColor: C.accentBg,
    borderWidth: 1, borderColor: C.accent, alignItems: "center", justifyContent: "center",
  },
  chatSendBtnDisabled: { opacity: 0.3 },
  chatSendIcon: { fontSize: 15, color: C.accent },

  // ── FOOTER ──
  footer: { marginTop: 20, marginBottom: 30, alignItems: "center", paddingVertical: 25 },
  footerLine: { width: 60, height: 1, backgroundColor: C.accent, marginBottom: 18 },
  footerEyebrow: {
    fontFamily: Platform.OS === "ios" ? "Courier New" : "monospace",
    fontSize: 9, letterSpacing: 3, color: C.accentDim, marginBottom: 10,
  },
  footerTitle: {
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
    fontSize: 22, color: C.text, fontStyle: "italic", marginBottom: 10,
  },
  footerDescription: {
    textAlign: "center", color: C.textMuted, fontSize: 12, lineHeight: 20,
    paddingHorizontal: 20, maxWidth: 320,
  },
  footerVersion: {
    marginTop: 14,
    fontFamily: Platform.OS === "ios" ? "Courier New" : "monospace",
    fontSize: 9, letterSpacing: 2, color: C.textDim,
  },
});
