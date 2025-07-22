import { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  FlatList,
  TextInput,
  StyleSheet,
} from "react-native";
import {
  connectToDatabase,
  createTables,
  getUsers,
  insertUser,
  updateUser,
  deleteUser,
} from "./src/db/db";

function App() {
  const [users, setUsers] = useState([]);
  const [editingUserId, setEditingUserId] = useState(null);

  const [newUser, setNewUser] = useState({
    name: "",
    age: null,
  });

  const loadData = useCallback(async () => {
    try {
      const db = await connectToDatabase();
      await createTables(db);
      const result = await getUsers();
      setUsers(result);
    } catch (error) {
      console.error(error);
    }
  }, []);

  const handleSaveUser = async () => {
    if (editingUserId) {
      await updateUser(editingUserId, newUser.name, newUser.age);
      setEditingUserId(null);
    } else {
      await insertUser(newUser.name, newUser.age);
    }
    setNewUser({ name: "", age: null });
    await loadData();
  };

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>
        {editingUserId ? "Edit User" : "Add New User"}
      </Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your name"
        value={newUser.name}
        onChangeText={(text) => setNewUser({ ...newUser, name: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter your age"
        value={newUser.age ? newUser.age.toString() : ""}
        keyboardType="numeric"
        onChangeText={(text) =>
          setNewUser({ ...newUser, age: parseInt(text) })
        }
      />
      <Button
        title={editingUserId ? "Update User" : "Add User"}
        onPress={handleSaveUser}
      />

      <Text style={styles.listHeading}>User List</Text>
      <FlatList
        data={users}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.userCard}>
            <Text style={styles.userText}>
              {item.id}. {item.name}, {item.age}
            </Text>
            <View style={styles.btnRow}>
              <View style={styles.btnContainer}>
                <Button
                  title="Edit"
                  onPress={() => {
                    setNewUser({ name: item.name, age: item.age });
                    setEditingUserId(item.id);
                  }}
                />
              </View>
              <View style={styles.btnContainer}>
                <Button
                  title="Delete"
                  color="red"
                  onPress={async () => {
                    await deleteUser(item.id);
                    await loadData();
                  }}
                />
              </View>
            </View>
          </View>
        )}
      />
    </View>
  );
}

export default App;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  listHeading: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: "600",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 6,
    marginBottom: 10,
    backgroundColor: "white",
  },
  list: {
    marginTop: 10,
  },
  userCard: {
    backgroundColor: "#fff",
    padding: 12,
    marginBottom: 10,
    borderRadius: 8,
    elevation: 2,
  },
  userText: {
    fontSize: 16,
    marginBottom: 6,
  },
  btnRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  btnContainer: {
    flex: 1,
    marginRight: 10,
  },
});
