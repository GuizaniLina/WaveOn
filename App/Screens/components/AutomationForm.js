import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';

const AutomationForm = ({ onSubmit }) => {
  const [name, setName] = useState('');
  const [eventType, setEventType] = useState('scene');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setDate(currentDate);
  };

  const handleSubmit = () => {
    if (!name) {
      Alert.alert('Error', 'Please enter a name for the automation.');
      return;
    }

    const automationData = {
      name,
      eventType,
      automationTimes: eventType === 'planification' ? date.toISOString() : '',
      // Add other fields based on eventType as needed
    };

    onSubmit(automationData);
  };

  return (
    <View style={styles.formContainer}>
      <Text style={styles.label}>Name</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
      />

      <Text style={styles.label}>Event Type</Text>
      <Picker
        selectedValue={eventType}
        style={styles.input}
        onValueChange={(itemValue) => setEventType(itemValue)}
      >
        <Picker.Item label="Scene" value="scene" />
        <Picker.Item label="Event Reseau" value="evenement_reseau" />
        <Picker.Item label="Planification" value="planification" />
        <Picker.Item label="API Externe" value="api_externe" />
        <Picker.Item label="Alarme" value="alarme" />
      </Picker>

      {eventType === 'planification' && (
        <View>
          <Button onPress={() => setShowDatePicker(true)} title="Select Date" />
          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display="default"
              onChange={handleDateChange}
            />
          )}
          <Text>Selected Date: {date.toDateString()}</Text>
        </View>
      )}

      <Button onPress={handleSubmit} title="Add Automation" />
    </View>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginVertical: 8,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
});

export default AutomationForm;