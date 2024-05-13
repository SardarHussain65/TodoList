import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  TextInput,
  Image,
  FlatList,
  ScrollView,
  Dimensions,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width, height } = Dimensions.get("window");
const TodoList = ({ navigation }) => {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);
  const [show, setShow] = useState(false);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [date, setDate] = useState("");
  const [heading, setHeading] = useState("");
  const [editTaskId, setEditTaskId] = useState(null);

  useEffect(() => {
    // Load tasks from AsyncStorage when component mounts
    loadTasks();
  }, []);

  useEffect(() => {
    // Save tasks to AsyncStorage whenever tasks state changes
    saveTasks();
  }, [tasks]);

  const saveTasks = async () => {
    try {
      await AsyncStorage.setItem("tasks", JSON.stringify(tasks));
    } catch (error) {
      console.error("Error saving tasks:", error);
    }
  };

  const loadTasks = async () => {
    try {
      const savedTasks = await AsyncStorage.getItem("tasks");
      if (savedTasks !== null) {
        setTasks(JSON.parse(savedTasks));
      }
    } catch (error) {
      console.error("Error loading tasks:", error);
    }
  };

  const handleShow = () => {
    setShow(true);
  };

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <MaterialIcons
          name="add"
          size={40}
          color="black"
          style={{ marginRight: 10 }}
          onPress={() => {
            console.log("called");
            handleShow();
          }}
        />
      ),
    });
  }, []);

  const removeData = async () => {
    try {
      navigation.navigate("Home");
    } catch (e) {
      console.log(e);
    }
  };

  // const handleAddTask = () => {
  //   if (task.trim()) {
  //     setTasks([
  //       ...tasks,
  //       {
  //         id: new Date(),
  //         lastDate: new Date(date).toDateString(),
  //         title: task,
  //         completed: false,
  //         head: heading,
  //       },
  //     ]);
  //     setTask("");
  //     setDate("");
  //     setHeading("");
  //   }
  // };

  const handleAddTask = () => {
    if (task.trim()) {
      if (editTaskId) {
        // Edit existing task
        setTasks(
          tasks.map((t) =>
            t.id === editTaskId
              ? {
                  ...t,
                  title: task,
                  lastDate: new Date(date).toDateString(),
                  head: heading,
                }
              : t
          )
        );
        setEditTaskId(null);
      } else {
        // Add new task
        setTasks([
          ...tasks,
          {
            id: new Date(),
            lastDate: new Date(date).toDateString(),
            title: task,
            completed: false,
            head: heading,
          },
        ]);
      }
      setTask("");
      setDate("");
      setHeading("");
    }
  };

  const handleEditTask = (id) => {
    const taskToEdit = tasks.find((task) => task.id === id);
    if (taskToEdit) {
      setTask(taskToEdit.title);
      setDate(taskToEdit.lastDate);
      setHeading(taskToEdit.head);
      setEditTaskId(id);
      setShow(true);
    }
  };

  // const handleToggleTask = (id) => {
  //   setTasks(
  //     tasks.map((task) => {
  //       if (task.id === id) {
  //         return { ...task, completed: !task.completed };
  //       }
  //       return task;
  //     })
  //   );
  // };

  const handleDeleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    setDate(date);
    console.log("A date has been picked: ", date);
    hideDatePicker();
  };

  return (
    <ScrollView
      style={{ flexGrow: 1, backgroundColor: "blue" }}
      contentContainerStyle={styles.container}
    >
      {show ? (
        <View style={styles.modal}>
          <TouchableOpacity onPress={() => setShow(false)} style={styles.cross}>
            <Image
              source={require("../../assets/asil.png")}
              style={styles.image}
            />
          </TouchableOpacity>
          <Text style={styles.textHeader}>Add Your Todo</Text>

          <View style={{ display: "flex", flexDirection: "row", gap: 20 }}>
            <TextInput
              style={styles.inputTitle}
              autoCapitalize="none"
              autoCorrect={false}
              value={heading}
              placeholder="Select Title"
              onChangeText={(actualdata) => setHeading(actualdata.trim())}
            />
            <TouchableOpacity style={styles.DateBtn} onPress={showDatePicker}>
              <Text style={{ color: "white" }}>Set Date</Text>
            </TouchableOpacity>
            <DateTimePickerModal
              isVisible={isDatePickerVisible}
              mode="date"
              onConfirm={handleConfirm}
              onCancel={hideDatePicker}
            />
          </View>

          <TextInput
            style={styles.inputDes}
            autoCapitalize="none"
            autoCorrect={false}
            placeholder="Add a new task"
            value={task}
            onChangeText={(text) => setTask(text)}
          />
          <TouchableOpacity
            onPress={() => {
              handleAddTask();
              setShow(false);
            }}
            style={styles.submitBtn}
          >
            <Text style={{ fontSize: 20, color: "white" }}>Submit</Text>
          </TouchableOpacity>
        </View>
      ) : null}
      {!show ? (
        <View style={{ width: "85%" }}>
          <Text
            style={{
              fontSize: 20,
              color: "white",
              marginVertical: 20,
              width: "99%",
              textAlign: "center",
            }}
          >
            WellCome to Your TodoList
          </Text>

          <View style={styles.containers}>
            <Text style={styles.title}>To-Do List</Text>
            <FlatList
              data={tasks}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.task,
                    {
                      textDecorationLine: item.completed
                        ? "line-through"
                        : "none",
                    },
                  ]}
                  // onPress={() => handleToggleTask(item.id)}
                  onPress={() => handleEditTask(item.id)}
                  onLongPress={() => handleDeleteTask(item.id)}
                >
                  <Text style={{ fontWeight: "700" }}>{item.head}</Text>
                  <Text>
                    {item.title} {item.lastDate}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
          <TouchableOpacity
            style={styles.Logout}
            onPress={() => {
              removeData();
            }}
          >
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      ) : null}
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  container: {
    // flex: 1,
    backgroundColor: "blue",
    justifyContent: "center",
    alignItems: "center",
    maxHeight: 1900,
  },

  modal: {
    alignItems: "center",
    width: "80%",
    height: 400,
    backgroundColor: "aqua",
    justifyContent: "space-around",
    borderRadius: 15,
    marginVertical: "15%",
  },

  DateBtn: {
    backgroundColor: "#342342",
    paddingVertical: 22,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    paddingVertical: 12,
    marginVertical: 16,
    width: "30%",
  },

  AddBtn: {
    backgroundColor: "#342342",
    paddingVertical: 22,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    paddingVertical: 12,
    marginVertical: 16,
  },
  textHeader: {
    fontSize: 36,
    marginVertical: 60,
    color: "#111",
  },

  inputBtn: {
    borderWidth: 1,
    borderRadius: 4,
    borderColor: "#222",
    height: 50,
    paddingLeft: 8,
    fontSize: 18,
    justifyContent: "center",
    marginTop: 14,
    width: "40%",
    placeholder: "Select Date",
  },
  submitBtn: {
    backgroundColor: "#342342",
    paddingVertical: 22,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    paddingVertical: 12,
    marginVertical: 16,
    width: "80%",
  },

  inputDes: {
    borderWidth: 1,
    borderRadius: 4,
    borderColor: "#222",
    height: 60,
    paddingLeft: 8,
    fontSize: 18,
    justifyContent: "center",
    marginTop: 14,
    width: "80%",
  },
  inputTitle: {
    borderWidth: 1,
    borderRadius: 4,
    borderColor: "#222",
    height: 50,
    paddingLeft: 8,
    fontSize: 18,
    justifyContent: "center",
    marginTop: 14,
    width: "40%",
  },
  image: {
    width: 20,
    height: 20,
    margin: 8,
  },
  cross: {
    alignSelf: "flex-end",
  },
  containers: {
    // flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingTop: 50,
    height: height * 0.6,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
  },
  addButton: {
    backgroundColor: "blue",
    borderRadius: 5,
    padding: 10,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  task: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  Logout: {
    height: 30,
    width: 90,
    backgroundColor: "red",
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
    borderRadius: 12,
  },
  logoutText: {
    color: "white",
    fontSize: 15,
    fontWeight: "700",
  },
});
export default TodoList;
