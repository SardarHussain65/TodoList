import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";

const Home = ({ navigation }) => {
  const onPressTodo = () => {
    navigation.navigate("TodoList");
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onPressTodo} style={styles.button}>
        <Text style={styles.buttonText}>TodoList</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 15,
  },
  button: {
    backgroundColor: "blue",
    padding: 15,
    borderRadius: 5,
    marginBottom: 5,
    width: "45%",
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontSize: 20,
  },
});

// import { StyleSheet, Text, View, TouchableOpacity, Alert } from "react-native";
// import React, { useCallback } from "react";
// import { useFocusEffect } from "@react-navigation/native";

// const Home = ({ navigation }) => {
//   const onPressTodo = () => {
//     navigation.navigate("TodoList");
//   };

//   const onPressCount = () => {
//     navigation.navigate("Counter");
//   };

//   useFocusEffect(
//     useCallback(() => {
//       // Logic to execute when the screen gains focus
//       Alert.alert("Home Screen", "Welcome to the Home screen");
//       return () => {
//         // Cleanup function when the screen loses focus (optional)
//       };
//     }, [])
//   );

//   return (
//     <View style={styles.container}>
//       <TouchableOpacity onPress={onPressTodo} style={styles.button}>
//         <Text style={styles.buttonText}>TodoList</Text>
//       </TouchableOpacity>

//       <TouchableOpacity onPress={onPressCount} style={styles.button}>
//         <Text style={styles.buttonText}>Counter</Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// export default Home;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     gap: 15,
//   },
//   button: {
//     backgroundColor: "blue",
//     padding: 15,
//     borderRadius: 5,
//     marginBottom: 5,
//     width: "45%",
//   },
//   buttonText: {
//     color: "white",
//     textAlign: "center",
//     fontSize: 20,
//   },
// });
