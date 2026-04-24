import { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert, Image, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { getDB } from '@/services/database';
import { Doctor } from '@/types/schema';

export default function HomeScreen() {
  const router = useRouter();
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  // Form states for first-time doctor registration
  const [docName, setDocName] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [license, setLicense] = useState('');
  const [phone, setPhone] = useState('');
  const [signatureUri, setSignatureUri] = useState('');

  // Stats
  const [patientCount, setPatientCount] = useState(0);
  const [activeDrs, setActiveDrs] = useState(0);

  const pickSignature = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        aspect: [16, 9],
        quality: 0.5,
        base64: true,
      });
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const base64Str = result.assets[0].base64;
        if (base64Str) {
          setSignatureUri(`data:image/jpeg;base64,${base64Str}`);
        } else {
          setSignatureUri(result.assets[0].uri);
        }
      }
    } catch (e) {
      console.log('Error picking signature:', e);
      Alert.alert('Error', 'Could not open photo library');
    }
  };

  const fetchData = async () => {
    try {
      const db = await getDB();
      const docs = await db.getAllAsync<Doctor>("SELECT * FROM doctors LIMIT 1;");
      if (docs.length > 0) {
        setDoctor(docs[0]);
      }
      
      const pCount = await db.getAllAsync<{count: number}>("SELECT COUNT(*) as count FROM patients;");
      if (pCount.length > 0) setPatientCount(pCount[0].count);
      
      const dCount = await db.getAllAsync<{count: number}>("SELECT COUNT(*) as count FROM doctors;");
      if (dCount.length > 0) setActiveDrs(dCount[0].count);

    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRegisterDoctor = async () => {
    if (!docName || !specialty) {
      Alert.alert('Error', 'Please enter your Name and Specialty to set up your workspace.');
      return;
    }
    
    try {
      const db = await getDB();
      if (doctor && isEditing) {
        await db.runAsync(
          "UPDATE doctors SET name=?, license_number=?, specialty=?, phone=?, signature=? WHERE id=?",
          docName, license, specialty, phone, signatureUri, doctor.id
        );
        setDoctor({
          ...doctor,
          name: docName,
          license_number: license,
          specialty: specialty,
          phone: phone,
          signature: signatureUri
        });
        setIsEditing(false);
        Alert.alert('Success', 'Profile updated successfully!');
      } else {
        const result = await db.runAsync(
          "INSERT INTO doctors (name, license_number, specialty, phone, signature) VALUES (?, ?, ?, ?, ?)",
          docName, license, specialty, phone, signatureUri
        );
        
        setDoctor({
          id: result.lastInsertRowId,
          name: docName,
          license_number: license,
          specialty: specialty,
          phone: phone,
          signature: signatureUri
        });
        setActiveDrs(prev => prev + 1);
        Alert.alert('Success', 'Welcome to DoctorScript!');
      }
    } catch (e) {
      console.error(e);
      Alert.alert('Error', 'Failed to save practitioner profile.');
    }
  };

  const showProfileMenu = () => {
    Alert.alert('Profile Options', 'Manage your workspace', [
      { 
        text: 'Edit Profile', 
        onPress: () => {
          setDocName(doctor?.name || '');
          setSpecialty(doctor?.specialty || '');
          setLicense(doctor?.license_number || '');
          setPhone(doctor?.phone || '');
          setSignatureUri(doctor?.signature || '');
          setIsEditing(true);
        } 
      },
      { text: 'Export Data (CSV)', onPress: exportCSV },
      { text: 'Delete Profile', onPress: confirmDelete, style: 'destructive' },
      { text: 'Cancel', style: 'cancel' }
    ]);
  };

  const confirmDelete = () => {
    Alert.alert('Delete Workspace', 'Are you sure you want to delete your profile and all data? This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: performDelete }
    ]);
  };

  const performDelete = async () => {
    try {
      const db = await getDB();
      await db.runAsync("DELETE FROM medications");
      await db.runAsync("DELETE FROM prescriptions");
      await db.runAsync("DELETE FROM patients");
      await db.runAsync("DELETE FROM doctors");
      setDoctor(null);
      setIsEditing(false);
      setPatientCount(0);
      setActiveDrs(0);
      setDocName('');
      setSpecialty('');
      setLicense('');
      setPhone('');
      setSignatureUri('');
      Alert.alert('Deleted', 'Your workspace has been cleared.');
    } catch (e) {
      console.error(e);
      Alert.alert('Error', 'Failed to delete workspace.');
    }
  };

  const exportCSV = async () => {
    try {
      const db = await getDB();
      const patients = await db.getAllAsync("SELECT * FROM patients");
      const prescriptions = await db.getAllAsync("SELECT * FROM prescriptions");
      
      let csv = '--- Patients ---\nID,Name,DOB,Phone\n';
      patients.forEach((p: any) => {
         csv += `${p.id},"${p.name}","${p.dob}","${p.phone}"\n`;
      });
      
      csv += '\n--- Prescriptions ---\nID,Patient ID,Doctor ID,Date,Notes\n';
      prescriptions.forEach((r: any) => {
         csv += `${r.id},${r.patient_id},${r.doctor_id},"${r.date}","${r.notes || ''}"\n`;
      });

      const uri = (FileSystem as any).cacheDirectory + 'DoctorScript_Export.csv';
      await (FileSystem as any).writeAsStringAsync(uri, csv, { encoding: (FileSystem as any).EncodingType.UTF8 });
      if (Platform.OS === 'ios' || Platform.OS === 'android') {
        await Sharing.shareAsync(uri, { mimeType: 'text/csv', dialogTitle: 'Export Data' });
      }
    } catch (e) {
      Alert.alert('Error', 'Failed to export data');
    }
  };

  if (loading) {
    return <SafeAreaView className="flex-1 bg-surface" />;
  }

  // --- DOCTOR ONBOARDING (FIRST TIME OPENING APP) ---
  if (!doctor || isEditing) {
    return (
      <SafeAreaView className="flex-1 bg-surface" edges={['top']}>
        <View className="px-6 py-4 flex-row items-center border-b border-outline_variant">
          <IconSymbol name="cross.case.fill" size={24} color="#00488d" />
          <Text className="text-xl font-display font-extrabold text-primary ml-3">DoctorScript</Text>
        </View>
        <ScrollView contentContainerClassName="p-6 pb-24">
          <View className="mb-8">
            <Text className="text-primary font-bold tracking-wider text-xs uppercase mb-1">
              {isEditing ? 'Edit Profile' : 'Welcome Setup'}
            </Text>
            <Text className="font-display text-4xl font-extrabold text-on_surface leading-tight mb-2">
              Practitioner Profile
            </Text>
            <Text className="text-on_surface_variant leading-relaxed text-base">
              {isEditing ? 'Update your practitioner details and digital signature below.' : 'It looks like this is your first time opening the app. Please enter your details below so we can issue scripts under your authority.'}
            </Text>
          </View>

          <View className="bg-surface_container_lowest p-6 rounded-xl border border-outline_variant space-y-6 shadow-sm">
            <View className="mb-4">
              <Text className="text-xs font-bold text-on_surface_variant tracking-wide mb-2 uppercase">Your Full Name</Text>
              <TextInput 
                className="w-full bg-surface_container_low border-0 p-4 rounded-lg text-on_surface font-medium"
                placeholder="e.g. Dr. Jane Smith"
                placeholderTextColor="#727783"
                value={docName}
                onChangeText={setDocName}
              />
            </View>

            <View className="mb-4">
              <Text className="text-xs font-bold text-on_surface_variant tracking-wide mb-2 uppercase">Specialty</Text>
              <TextInput 
                className="w-full bg-surface_container_low border-0 p-4 rounded-lg text-on_surface font-medium"
                placeholder="e.g. General Practice"
                placeholderTextColor="#727783"
                value={specialty}
                onChangeText={setSpecialty}
              />
            </View>

            <View className="mb-4">
              <Text className="text-xs font-bold text-on_surface_variant tracking-wide mb-2 uppercase">License Number (Optional)</Text>
              <TextInput 
                className="w-full bg-surface_container_low border-0 p-4 rounded-lg text-on_surface font-medium"
                placeholder="e.g. MSP-9831"
                placeholderTextColor="#727783"
                value={license}
                onChangeText={setLicense}
              />
            </View>

            <View className="mb-6">
              <Text className="text-xs font-bold text-on_surface_variant tracking-wide mb-2 uppercase">Contact Phone (Optional)</Text>
              <TextInput 
                className="w-full bg-surface_container_low border-0 p-4 rounded-lg text-on_surface font-medium"
                placeholder="+1 (555) 000-0000"
                placeholderTextColor="#727783"
                keyboardType="phone-pad"
                value={phone}
                onChangeText={setPhone}
              />
            </View>

            <View className="mb-8">
              <Text className="text-xs font-bold text-on_surface_variant tracking-wide mb-2 uppercase">Digital Signature</Text>
              <TouchableOpacity
                onPress={pickSignature}
                className="w-full bg-surface_container_low border border-dashed border-outline p-6 rounded-lg items-center justify-center"
              >
                {signatureUri ? (
                  <Image source={{ uri: signatureUri }} style={{ width: '100%', height: 80 }} resizeMode="contain" />
                ) : (
                  <View className="items-center">
                    <IconSymbol name="signature" size={32} color="#727783" />
                    <Text className="text-on_surface_variant mt-2 font-medium">Upload Signature Image</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>

            <View className="flex-row gap-4">
              {isEditing && (
                <TouchableOpacity 
                  className="flex-1 bg-surface_container_highest py-4 rounded-lg items-center shadow-sm"
                  onPress={() => setIsEditing(false)}
                >
                  <Text className="font-display font-bold text-on_surface text-base">Cancel</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity 
                className="flex-1 bg-primary py-4 rounded-lg items-center shadow-lg"
                onPress={handleRegisterDoctor}
              >
                <Text className="font-display font-bold text-white text-base">
                  {isEditing ? 'Save Changes' : 'Complete Setup'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // --- HOME DASHBOARD (DOCTOR EXISTS) ---
  return (
    <SafeAreaView className="flex-1 bg-surface" edges={['top']}>
      <ScrollView contentContainerClassName="pb-24">
        {/* Top App Bar */}
        <View className="px-6 py-4 flex-row items-center justify-between border-b border-outline_variant">
          <View className="flex-row items-center gap-3">
            <IconSymbol name="cross.case.fill" size={24} color="#00488d" />
            <Text className="text-xl font-display font-extrabold text-primary">DoctorScript</Text>
          </View>
          <TouchableOpacity 
            className="w-10 h-10 rounded-full bg-surface_container_high items-center justify-center"
            onPress={showProfileMenu}
          >
            <IconSymbol name="person.crop.circle.fill" size={24} color="#424752" />
          </TouchableOpacity>
        </View>

        <View className="px-6 py-8">
          {/* Hero Section */}
          <View className="relative overflow-hidden rounded-xl bg-primary p-6 mb-8">
            <View className="relative z-10">
              <Text className="text-3xl font-display font-extrabold text-white mb-2">
                Welcome back, {doctor.name}.
              </Text>
              <Text className="text-white text-base leading-relaxed opacity-90">
                Efficiently manage your clinical workspace with precision. Access patient records, manage practitioners, and issue digital prescriptions from one secure dashboard.
              </Text>
            </View>
          </View>

          {/* Action Grid */}
          <View className="mb-8 gap-4">
            <TouchableOpacity 
              className="bg-surface_container_lowest p-6 rounded-xl border border-outline_variant flex-row items-center shadow-sm"
              onPress={() => router.push('/patients')}
            >
              <View className="w-12 h-12 rounded-full bg-primary_container items-center justify-center mr-4">
                <IconSymbol name="person.fill.badge.plus" size={24} color="#ffffff" />
              </View>
              <View className="flex-1">
                <Text className="text-xl font-display font-bold text-on_surface mb-1">Patients</Text>
                <Text className="text-on_surface_variant text-sm">Manage patient profiles</Text>
              </View>
              <IconSymbol name="chevron.right" size={20} color="#00488d" />
            </TouchableOpacity>

            <TouchableOpacity 
              className="bg-surface_container_lowest p-6 rounded-xl border border-outline_variant flex-row items-center shadow-sm"
              onPress={() => router.push('/prescriptions')}
            >
              <View className="w-12 h-12 rounded-full bg-secondary_container items-center justify-center mr-4">
                <IconSymbol name="doc.text.fill" size={24} color="#00488d" />
              </View>
              <View className="flex-1">
                <Text className="text-xl font-display font-bold text-on_surface mb-1">Prescriptions</Text>
                <Text className="text-on_surface_variant text-sm">View and create prescriptions</Text>
              </View>
              <IconSymbol name="chevron.right" size={20} color="#4c5f7d" />
            </TouchableOpacity>
          </View>

          {/* Stats Panel */}
          <View className="bg-surface_container_high rounded-xl p-6 shadow-sm">
            <Text className="text-lg font-display font-bold mb-4 text-on_surface">Today's Snapshot</Text>
            
            <View className="flex-row justify-between mb-4 border-b border-outline_variant pb-4">
              <View>
                <Text className="text-xs text-on_surface_variant uppercase font-bold tracking-wider">Patients</Text>
                <Text className="text-2xl font-display font-bold text-on_surface mt-1">{patientCount}</Text>
              </View>
              <View>
                <Text className="text-xs text-on_surface_variant uppercase font-bold tracking-wider">Active Drs</Text>
                <Text className="text-2xl font-display font-bold text-on_surface mt-1">{activeDrs}</Text>
              </View>
            </View>

            <View className="gap-2">
              <View className="flex-row justify-between">
                <Text className="text-sm font-bold text-on_surface">Pharmacy Fulfilment</Text>
                <Text className="text-sm font-bold text-tertiary">92%</Text>
              </View>
              <View className="h-2 w-full bg-surface_container_lowest rounded-full overflow-hidden">
                <View className="h-full bg-tertiary" style={{ width: '92%' }} />
              </View>
            </View>
          </View>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
