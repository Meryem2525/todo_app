import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState([]);

  useEffect(() => {

    loadTasks();
  }, []);

  useEffect(() => {
    saveTasks();
  }, [tasks]);

  const saveTasks = async () => {
    try {
      await AsyncStorage.setItem('tasks', JSON.stringify(tasks));
    } catch (error) {
      console.log(error);
    }
  };

  const loadTasks = async () => {
    try {
      const savedTasks = await AsyncStorage.getItem('tasks');
      if (savedTasks) {
        setTasks(JSON.parse(savedTasks));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const addTask = () => {
    if (task.trim()) {
      setTasks([...tasks, { id: Date.now().toString(), text: task, completed: false }]);
      setTask('');
    }
  };

  const toggleTask = (id) => {

    setTasks(tasks.map(t => t.id === id ?
      { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎯 Eğlenceli Görev Listem</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Yeni görev yaz....."
          placeholderTextColor="#666"
          value={task}
          onChangeText={setTask}
        />
        <TouchableOpacity style={styles.addButton} onPress={addTask}>
          <Text style={styles.addText}>➕</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={tasks}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={[styles.taskContainer, { backgroundColor: item.completed ? '#d4edda' : '#fff3cd' }]}>
            <TouchableOpacity onPress={() => toggleTask(item.id)}>
              <Text style={styles.taskEmoji}>{item.completed ? '✅' : '⭕'}</Text>
            </TouchableOpacity>
            <Text style={[styles.taskText, item.completed && styles.completed]}>
              {item.text}
            </Text>
            <TouchableOpacity onPress={() => deleteTask(item.id)}>
              <Text style={styles.delete}>🗑️</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fcefee' },
  title: { fontSize: 28, marginTop: 45, fontWeight: 'bold', marginBottom: 20, color: '#ff4c60', textAlign: 'center' },
  inputContainer: { flexDirection: 'row', marginBottom: 20 },
  input: { flex: 1, borderWidth: 2, borderColor: '#ff9aa2', padding: 10, borderRadius: 10, backgroundColor: '#fff' },
  addButton: { marginLeft: 10, backgroundColor: '#ff4c60', paddingHorizontal: 15, paddingVertical: 10, borderRadius: 10 },
  addText: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  taskContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 15, borderRadius: 10, marginBottom: 10 },
  taskEmoji: { fontSize: 22, marginRight: 10 },
  taskText: { fontSize: 18, flex: 1 },
  completed: { textDecorationLine: 'line-through', color: '#888' },
  delete: { fontSize: 20 }
});
