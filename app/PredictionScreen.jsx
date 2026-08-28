import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";

const PredictionScreen = () => {
  // Get data from previous screen
  const {
    imageUri,
    prediction = "Unknown",
    confidence = "0",
  } = useLocalSearchParams();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>

        {/* Title */}
        <Text style={styles.title}>
          Fabric Prediction Result
        </Text>

        {/* Card */}
        <View style={styles.card}>

          {/* Image */}
          {imageUri && (
            <Image
              source={{ uri: imageUri }}
              style={styles.image}
            />
          )}

          {/* Prediction */}
          <Text style={styles.label}>Predicted Fabric</Text>
          <Text style={styles.prediction}>
            {prediction}
          </Text>

          {/* Confidence */}
          <Text style={styles.label}>Confidence</Text>
          <Text style={styles.confidence}>
            {typeof confidence === "string"
              ? (parseFloat(confidence) * 100).toFixed(2)
              : (confidence * 100).toFixed(2)
            }%
          </Text>

          {/* Info Box */}
          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>
              About {prediction}
            </Text>

            <Text style={styles.infoText}>
              {prediction} is widely used in the textile industry
              for clothing production. It is known for its comfort
              and versatility in fashion design.
            </Text>
          </View>

        </View>

        {/* Button */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.back()}
        >
          <Text style={styles.buttonText}>
            Try Another Image
          </Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
};

export default PredictionScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  content: {
    padding: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginVertical: 20,
    color: "#111",
  },
  card: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    elevation: 5,
  },
  image: {
    width: 280,
    height: 280,
    borderRadius: 15,
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: "#666",
    marginTop: 10,
  },
  prediction: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#000",
    marginTop: 5,
  },
  confidence: {
    fontSize: 22,
    fontWeight: "600",
    color: "green",
    marginTop: 5,
  },
  infoBox: {
    marginTop: 20,
    backgroundColor: "#F0F0F0",
    padding: 15,
    borderRadius: 15,
    width: "100%",
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
    color: "#555",
  },
  button: {
    marginTop: 25,
    backgroundColor: "#000",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 15,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});