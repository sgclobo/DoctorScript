import { useState, useEffect } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { getDB } from '@/services/database';
import { Patient } from '@/types/schema';

export default function PatientsScreen() {
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [phone, setPhone] = useState('');
  const [patients, setPatients] = useState<Patient[]>([]);

  const fetchPatients = async () => {
    try {
      const db = await getDB();
      const result = await db.getAllAsync<Patient>("SELECT * FROM patients ORDER BY id DESC;");
      setPatients(result);
    } catch (e) {
      console.error("Error fetching patients", e);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const handleSave = async () => {
    if (!name || !dob || !phone) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    try {
      const db = await getDB();
      await db.runAsync("INSERT INTO patients (name, dob, phone) VALUES (?, ?, ?)", name, dob, phone);
      setName('');
      setDob('');
      setPhone('');
      Alert.alert('Success', 'Patient registered successfully');
      fetchPatients();
    } catch (e) {
      console.error(e);
      Alert.alert('Error', 'Failed to register patient');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={['top']}>
      <ScrollView contentContainerClassName="pb-24">
        {/* Top App Bar */}
        <View className="px-6 py-4 flex-row items-center justify-between border-b border-outline_variant">
          <View className="flex-row items-center gap-3">
            <IconSymbol name="cross.case.fill" size={24} color="#00488d" />
            <Text className="text-xl font-display font-extrabold text-primary">DoctorScript</Text>
          </View>
        </View>

        <View className="px-6 py-8">
          {/* Header Section */}
          <View className="mb-8">
            <Text className="text-primary font-bold tracking-wider text-xs uppercase mb-1">Clinical Intake</Text>
            <Text className="font-display text-4xl font-extrabold text-on_surface leading-tight mb-2">New Patient Profile</Text>
            <Text className="text-secondary text-base">Enter patient information with precision. All fields are required for clinical records.</Text>
          </View>

          {/* Form */}
          <View className="bg-surface_container_lowest p-6 rounded-xl border border-outline_variant mb-8 space-y-6 shadow-sm">
            
            <View className="mb-4">
              <Text className="text-xs font-bold text-on_surface_variant tracking-wide mb-2">FULL NAME</Text>
              <View className="relative">
                <TextInput 
                  className="w-full bg-surface_container_low border-0 p-4 rounded-lg text-on_surface font-medium"
                  placeholder="e.g. Jonathan Doe"
                  placeholderTextColor="#727783"
                  value={name}
                  onChangeText={setName}
                />
              </View>
            </View>

            <View className="mb-4">
              <Text className="text-xs font-bold text-on_surface_variant tracking-wide mb-2">DATE OF BIRTH (YYYY-MM-DD)</Text>
              <View className="relative">
                <TextInput 
                  className="w-full bg-surface_container_low border-0 p-4 rounded-lg text-on_surface font-medium"
                  placeholder="2000-01-01"
                  placeholderTextColor="#727783"
                  value={dob}
                  onChangeText={setDob}
                />
              </View>
            </View>

            <View className="mb-6">
              <Text className="text-xs font-bold text-on_surface_variant tracking-wide mb-2">PHONE NUMBER</Text>
              <View className="relative">
                <TextInput 
                  className="w-full bg-surface_container_low border-0 p-4 rounded-lg text-on_surface font-medium"
                  placeholder="+1 (555) 000-0000"
                  placeholderTextColor="#727783"
                  keyboardType="phone-pad"
                  value={phone}
                  onChangeText={setPhone}
                />
              </View>
            </View>

            <TouchableOpacity 
              className="bg-primary py-4 rounded-lg items-center shadow-sm"
              onPress={handleSave}
            >
              <Text className="font-display font-bold text-white">Save Patient</Text>
            </TouchableOpacity>
          </View>

          {/* Registered Patients List */}
          {patients.length > 0 && (
            <View>
              <Text className="text-xl font-display font-bold text-on_surface mb-4">Patient Profiles</Text>
              {patients.map(p => (
                <View key={p.id} className="bg-surface_container_lowest p-4 rounded-xl border border-outline_variant mb-3">
                  <Text className="font-display font-bold text-lg">{p.name}</Text>
                  <Text className="text-on_surface_variant">DOB: {p.dob} | Phone: {p.phone}</Text>
                </View>
              ))}
            </View>
          )}

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
