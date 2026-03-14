import { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, Alert, Platform, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { getDB } from '@/services/database';
import { Patient, Doctor, Prescription, Medication } from '@/types/schema';
import ViewShot from 'react-native-view-shot';
import * as MediaLibrary from 'expo-media-library';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';

export default function PrescriptionsScreen() {
  const [view, setView] = useState<'list' | 'create' | 'detail'>('list');
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctor, setDoctor] = useState<Doctor | null>(null);

  // Form State
  const [selectedPatientId, setSelectedPatientId] = useState<number | null>(null);
  const [notes, setNotes] = useState('');
  const [medications, setMedications] = useState<Partial<Medication>[]>([{ name: '', dosage: '', frequency: '', duration: '' }]);

  // Detail State
  const [detailData, setDetailData] = useState<any>(null);
  const viewShotRef = useRef<ViewShot>(null);

  const fetchData = async () => {
    try {
      const db = await getDB();
      // Fetch Prescriptions
      const rxResult = await db.getAllAsync(`
        SELECT p.*, pat.name as patient_name, pat.phone as patient_phone, pat.dob as patient_dob, doc.name as doctor_name 
        FROM prescriptions p
        JOIN patients pat ON p.patient_id = pat.id
        JOIN doctors doc ON p.doctor_id = doc.id
        ORDER BY p.id DESC;
      `);
      setPrescriptions(rxResult);

      // Fetch Patients
      const ptResult = await db.getAllAsync<Patient>("SELECT * FROM patients;");
      setPatients(ptResult);

      // Fetch Doctor
      const docResult = await db.getAllAsync<Doctor>("SELECT * FROM doctors LIMIT 1;");
      if (docResult.length > 0) setDoctor(docResult[0]);

    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchData();
  }, [view]);

  const calculateAge = (dob: string) => {
    if (!dob) return 0;
    const diff = Date.now() - new Date(dob).getTime();
    const ageDate = new Date(diff);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  const handleSavePrescription = async () => {
    if (!selectedPatientId || !doctor) {
      Alert.alert('Error', 'Please select a patient.');
      return;
    }

    try {
      const db = await getDB();
      const date = new Date().toISOString().split('T')[0];
      const result = await db.runAsync(
        "INSERT INTO prescriptions (patient_id, doctor_id, date, notes) VALUES (?, ?, ?, ?)",
        selectedPatientId, doctor.id, date, notes
      );

      const rxId = result.lastInsertRowId;

      for (const med of medications) {
        if (med.name) {
          await db.runAsync(
            "INSERT INTO medications (prescription_id, name, dosage, frequency, duration) VALUES (?, ?, ?, ?, ?)",
            rxId, med.name, med.dosage || '', med.frequency || '', med.duration || ''
          );
        }
      }

      Alert.alert('Success', 'Prescription created successfully');
      setView('list');
      // reset form
      setSelectedPatientId(null);
      setNotes('');
      setMedications([{ name: '', dosage: '', frequency: '', duration: '' }]);
    } catch (e) {
      console.error(e);
      Alert.alert('Error', 'Failed to save prescription');
    }
  };

  const openDetail = async (rxInfo: any) => {
    try {
      const db = await getDB();
      const meds = await db.getAllAsync("SELECT * FROM medications WHERE prescription_id = ?", rxInfo.id);
      setDetailData({ ...rxInfo, medications: meds });
      setView('detail');
    } catch (e) {
      console.error(e);
    }
  };

  const addMedicationRow = () => {
    setMedications([...medications, { name: '', dosage: '', frequency: '', duration: '' }]);
  };

  const updateMedication = (index: number, field: keyof Medication, value: string) => {
    const updated = [...medications];
    updated[index] = { ...updated[index], [field]: value };
    setMedications(updated);
  };

  const removeMedicationRow = (index: number) => {
    const updated = [...medications];
    updated.splice(index, 1);
    setMedications(updated);
  };

  const getFormattedFileName = (ext: string) => {
    return `R-${detailData.patient_name.replace(/[^a-zA-Z0-9]/g, '_')}-${detailData.date}.${ext}`;
  };

  const exportPDF = async () => {
    if (!detailData) return;
    const medRows = detailData.medications.map((m: any) => `
      <div style="margin-bottom: 12px; padding-left: 10px; border-left: 4px solid #6099f0;">
        <p style="margin: 0; font-size: 16px; font-weight: bold; color: #00488d;">
          <span style="font-family: serif; font-style: italic; margin-right: 4px;">R/</span>${m.name}
        </p>
        ${m.dosage ? `<p style="margin: 2px 0 0 24px; font-size: 14px; color: #333;">Qty: ${m.dosage}</p>` : ''}
        ${m.frequency || m.duration ? `<p style="margin: 2px 0 0 24px; font-size: 14px; color: #333;">Sig: ${m.frequency}${m.duration ? `, ${m.duration}` : ''}</p>` : ''}
      </div>
    `).join('');
    
    // NOTE: In production, local signature images must be converted to base64 for PDF rendering to work correctly without a server. 
    // We will render the HTML without breaking if signature fails.
    let sigImg = '';
    if (doctor?.signature) {
       // Optional: convert to base64 but for now we skip complex fs reads here, just linking local uri may work natively
       sigImg = `<img src="${doctor.signature}" style="max-width: 150px; max-height: 80px; object-fit: contain; margin-bottom: 8px;" />`;
    }

    const html = `
      <html>
        <body style="font-family: Helvetica, Arial, sans-serif; padding: 40px; color: #181c1f;">
          <div style="display: flex; justify-content: space-between; border-bottom: 2px solid #00488d; padding-bottom: 16px; margin-bottom: 20px;">
            <div style="font-size: 60px; color: #00488d; font-weight: bold; font-family: serif; line-height: 1;">℞</div>
            <div style="text-align: right;">
              <p style="margin: 0; font-size: 16px; font-weight: bold; color: #00488d;">${doctor?.name || detailData.doctor_name}${doctor?.specialty ? ', ' + doctor.specialty : ''}</p>
              ${doctor?.phone ? `<p style="margin: 4px 0 0; font-size: 14px; color: #555;">${doctor.phone}</p>` : ''}
            </div>
          </div>
          
          <h2 style="font-size: 20px; color: #333; margin-bottom: 24px;">Reseita</h2>
          
          <div style="margin-bottom: 40px;">
            ${medRows}
          </div>
          
          <div style="background-color: #eef5fe; padding: 20px; border-radius: 8px; border: 1px solid #d6e5fa; margin-bottom: 60px;">
            <h3 style="margin: 0 0 12px; font-size: 16px; color: #00488d;">Detalles Pasiente</h3>
            <p style="margin: 0 0 4px; font-size: 14px;"><strong>Naran:</strong> ${detailData.patient_name}, ${calculateAge(detailData.patient_dob)} anos</p>
            ${detailData.patient_phone ? `<p style="margin: 0 0 4px; font-size: 14px;"><strong>Telemóvel:</strong> ${detailData.patient_phone}</p>` : ''}
            <p style="margin: 0; font-size: 14px;"><strong>Data Reseita:</strong> ${detailData.date}</p>
          </div>
          
          <div style="text-align: right; margin-top: 40px;">
            ${sigImg || '<div style="height: 80px;"></div>'}
            <div style="width: 200px; border-bottom: 1px solid #333; margin-left: auto; margin-bottom: 8px;"></div>
            <p style="margin: 0; font-size: 14px; font-weight: bold; color: #333;">${doctor?.name || detailData.doctor_name}${doctor?.specialty ? ', ' + doctor.specialty : ''}</p>
            ${doctor?.license_number ? `<p style="margin: 4px 0 0; font-size: 12px; color: #666;">CP N° : ${doctor.license_number}</p>` : ''}
          </div>
        </body>
      </html>
    `;
    
    try {
      const { uri } = await Print.printToFileAsync({ html });
      const newUri = (FileSystem as any).documentDirectory + getFormattedFileName('pdf');
      await FileSystem.copyAsync({ from: uri, to: newUri });
      if (Platform.OS === 'ios' || Platform.OS === 'android') {
        await Sharing.shareAsync(newUri, { UTI: '.pdf', mimeType: 'application/pdf' });
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to generate PDF');
    }
  };

  const saveToGallery = async () => {
    try {
      if (viewShotRef.current && viewShotRef.current.capture) {
        const uri = await viewShotRef.current.capture();
        const newUri = (FileSystem as any).documentDirectory + getFormattedFileName('jpg');
        await FileSystem.copyAsync({ from: uri, to: newUri });
        
        if (Platform.OS === 'ios' || Platform.OS === 'android') {
          await Sharing.shareAsync(newUri, { mimeType: 'image/jpeg', dialogTitle: 'Save Image' });
        }
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Failed to save photo');
    }
  };

  if (view === 'create') {
    const selectedPatient = patients.find(p => p.id === selectedPatientId);
    return (
      <SafeAreaView className="flex-1 bg-surface" edges={['top']}>
        <View className="px-6 py-4 flex-row items-center justify-between border-b border-outline_variant bg-surface">
          <TouchableOpacity onPress={() => setView('list')} className="flex-row items-center gap-2">
            <IconSymbol name="chevron.left" size={24} color="#00488d" />
            <Text className="font-display font-bold text-primary text-lg">Back to List</Text>
          </TouchableOpacity>
        </View>
        <ScrollView contentContainerClassName="p-6 pb-24">
          <Text className="font-display font-bold text-3xl mb-6 text-on_surface">New Prescription</Text>
          
          <View className="bg-surface_container_lowest p-6 rounded-xl border border-outline_variant mb-6 shadow-sm">
            <Text className="text-xs font-bold tracking-wider mb-2 text-on_surface_variant uppercase">Select Patient</Text>
            {/* Simple selection for demo purposes. In real app, use a Picker or Modal */}
            <View className="flex-row flex-wrap gap-2 mb-4">
              {patients.map(p => (
                <TouchableOpacity 
                  key={p.id} 
                  onPress={() => setSelectedPatientId(p.id)}
                  className={`px-4 py-2 rounded-lg border ${selectedPatientId === p.id ? 'bg-primary border-primary' : 'bg-surface_container_low border-outline_variant'}`}
                >
                  <Text className={selectedPatientId === p.id ? 'text-on_primary font-bold' : 'text-on_surface'}>{p.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
            
            {selectedPatient && (
              <View className="bg-primary_container/10 p-4 rounded-lg mb-4">
                <Text className="text-primary font-bold">Age: {calculateAge(selectedPatient.dob)} years old</Text>
                <Text className="text-primary">Phone: {selectedPatient.phone}</Text>
              </View>
            )}

            <View className="mb-4">
              <Text className="text-xs font-bold tracking-wider mb-2 text-on_surface_variant uppercase">Attending Doctor</Text>
              <TextInput 
                className="w-full bg-surface_container_low p-4 rounded-lg text-on_surface font-medium opacity-70"
                value={doctor?.name || ''}
                editable={false}
              />
            </View>

            <View className="mb-4">
              <Text className="text-xs font-bold tracking-wider mb-2 text-on_surface_variant uppercase">Clinical Notes</Text>
              <TextInput 
                className="w-full bg-surface_container_low p-4 rounded-lg text-on_surface font-medium"
                multiline
                numberOfLines={3}
                placeholder="Add condition notes..."
                value={notes}
                onChangeText={setNotes}
              />
            </View>
          </View>

          <Text className="font-display font-bold text-xl mb-4 text-on_surface">Medications</Text>
          {medications.map((med, index) => (
            <View key={index} className="bg-surface_container_lowest p-4 rounded-xl border border-outline_variant mb-4 shadow-sm relative">
              <TextInput placeholder="Medication Name" className="bg-surface_container_low p-3 rounded-lg mb-2 text-on_surface" value={med.name} onChangeText={(v) => updateMedication(index, 'name', v)} />
              <View className="flex-row gap-2 mb-2">
                <TextInput placeholder="Dosage (e.g. 500mg)" className="flex-1 bg-surface_container_low p-3 rounded-lg text-on_surface" value={med.dosage} onChangeText={(v) => updateMedication(index, 'dosage', v)} />
                <TextInput placeholder="Frequency (e.g. 2x a day)" className="flex-1 bg-surface_container_low p-3 rounded-lg text-on_surface" value={med.frequency} onChangeText={(v) => updateMedication(index, 'frequency', v)} />
              </View>
              <TextInput placeholder="Duration (e.g. 7 days)" className="bg-surface_container_low p-3 rounded-lg text-on_surface mb-2" value={med.duration} onChangeText={(v) => updateMedication(index, 'duration', v)} />
              {medications.length > 1 && (
                <TouchableOpacity onPress={() => removeMedicationRow(index)} className="absolute top-4 right-4 bg-error_container p-1 rounded-full">
                  <IconSymbol name="xmark" size={16} color="#ba1a1a" />
                </TouchableOpacity>
              )}
            </View>
          ))}

          <TouchableOpacity onPress={addMedicationRow} className="items-center py-4 mb-8">
            <Text className="text-primary font-bold">+ Add Another Medication</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleSavePrescription} className="bg-primary py-4 rounded-lg items-center shadow-lg">
            <Text className="font-display font-bold text-white">Create Prescription</Text>
          </TouchableOpacity>

        </ScrollView>
      </SafeAreaView>
    );
  }

  if (view === 'detail' && detailData) {
    return (
      <SafeAreaView className="flex-1 bg-surface" edges={['top']}>
        <View className="px-6 py-4 flex-row items-center justify-between border-b border-outline_variant bg-surface">
          <TouchableOpacity onPress={() => setView('list')} className="flex-row items-center gap-2">
            <IconSymbol name="chevron.left" size={24} color="#00488d" />
            <Text className="font-display font-bold text-primary text-lg">Back to List</Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerClassName="p-6 pb-24">
          <ViewShot ref={viewShotRef} options={{ format: "jpg", quality: 0.9 }}>
            <View className="bg-white p-6 rounded-xl border border-outline_variant shadow-lg" style={{ backgroundColor: 'white' }}>
              
              <View className="flex-row justify-between border-b-[3px] border-[#00488d] pb-4 mb-6 items-center">
                <Text style={{ fontSize: 50, color: '#00488d', fontWeight: 'bold', fontFamily: 'serif' }}>℞</Text>
                <View className="items-end">
                  <Text className="font-bold text-[#00488d] text-base">{doctor?.name || detailData.doctor_name}{doctor?.specialty ? `, ${doctor.specialty}` : ''}</Text>
                  {doctor?.phone ? <Text className="text-on_surface_variant text-xs mt-1">{doctor.phone}</Text> : null}
                </View>
              </View>

              <Text className="font-display font-bold text-on_surface text-xl mb-6">Reseita</Text>

              <View className="mb-8">
                {detailData.medications.map((m: any, idx: number) => (
                  <View key={idx} className="mb-5 pl-4 py-1 border-l-4 border-[#6099f0]">
                    <Text className="font-bold text-[#00488d] text-lg mb-1">
                      <Text className="italic pr-1 text-[#00488d] font-serif font-bold">R/ </Text>
                      {m.name}
                    </Text>
                    {m.dosage ? <Text className="text-on_surface_variant text-sm pl-6 mb-1">Qty: {m.dosage}</Text> : null}
                    {(m.frequency || m.duration) ? (
                      <Text className="text-on_surface_variant text-sm pl-6">
                        Sig: {m.frequency}{m.duration ? `, ${m.duration}` : ''}
                      </Text>
                    ) : null}
                  </View>
                ))}
              </View>

              <View className="bg-[#eef5fe] p-5 rounded-lg mb-8 border border-[#d6e5fa]">
                <Text className="font-bold text-[#00488d] mb-3 text-base">Detalles Pasiente</Text>
                <View className="flex-row items-center mb-1">
                  <Text className="font-bold text-on_surface text-sm w-24">Naran:</Text>
                  <Text className="text-on_surface text-sm flex-1">{detailData.patient_name}, {calculateAge(detailData.patient_dob)} anos</Text>
                </View>
                {detailData.patient_phone ? (
                  <View className="flex-row items-center mb-1">
                    <Text className="font-bold text-on_surface text-sm w-24">Telemóvel:</Text>
                    <Text className="text-on_surface text-sm flex-1">{detailData.patient_phone}</Text>
                  </View>
                ) : null}
                <View className="flex-row items-center mt-1">
                  <Text className="font-bold text-on_surface text-sm w-24">Data Reseita:</Text>
                  <Text className="text-on_surface text-sm flex-1">{detailData.date}</Text>
                </View>
              </View>

              <View className="items-end mt-4">
                {doctor?.signature ? (
                  <Image source={{ uri: doctor.signature }} style={{ width: 140, height: 70 }} resizeMode="contain" className="mb-2" />
                ) : (
                  <View style={{ height: 70 }} className="mb-2" />
                )}
                <View className="w-48 border-b border-outline mb-2" />
                <Text className="font-bold text-on_surface text-sm">{doctor?.name || detailData.doctor_name}{doctor?.specialty ? `, ${doctor.specialty}` : ''}</Text>
                {doctor?.license_number ? <Text className="text-xs text-on_surface_variant mt-1">CP N° : {doctor.license_number}</Text> : null}
              </View>

            </View>
          </ViewShot>

          <View className="flex-row gap-4 mt-8">
            <TouchableOpacity onPress={exportPDF} className="flex-1 bg-surface_container_highest py-4 rounded-lg items-center flex-row justify-center gap-2 shadow-sm border border-outline_variant">
              <IconSymbol name="doc.plaintext.fill" size={20} color="#181c1f" />
              <Text className="text-on_surface font-bold text-sm">Save as PDF</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={saveToGallery} className="flex-1 bg-primary py-4 rounded-lg items-center flex-row justify-center gap-2 shadow-sm">
              <IconSymbol name="square.and.arrow.down.fill" size={20} color="white" />
              <Text className="text-white font-bold text-sm">Save as Image</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // DEFAULT VIEW = LIST
  return (
    <SafeAreaView className="flex-1 bg-surface" edges={['top']}>
      <View className="px-6 py-4 flex-row items-center justify-between border-b border-outline_variant">
        <View className="flex-row items-center gap-3">
          <IconSymbol name="cross.case.fill" size={24} color="#00488d" />
          <Text className="text-xl font-display font-extrabold text-primary">MedScript</Text>
        </View>
        <TouchableOpacity 
          className="w-10 h-10 rounded-full bg-primary items-center justify-center shadow-lg hover:scale-105"
          onPress={() => setView('create')}
        >
          <IconSymbol name="plus" size={24} color="#ffffff" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerClassName="px-6 py-8 pb-24">
        <View className="mb-8">
          <Text className="text-primary font-bold tracking-wider text-xs uppercase mb-1">Clinical Overview</Text>
          <Text className="font-display text-4xl font-extrabold text-on_surface leading-tight mb-2">Recent Prescriptions</Text>
          <Text className="text-on_surface_variant max-w-sm mt-2">Manage medical scripts and access patient active treatments.</Text>
        </View>

        {prescriptions.map((rx) => (
          <TouchableOpacity 
            key={rx.id} 
            className="bg-surface_container_lowest p-6 rounded-xl border border-outline_variant border-l-4 border-l-primary mb-4 shadow-sm"
            onPress={() => openDetail(rx)}
          >
            <View className="flex-row justify-between mb-4">
              <View>
                <Text className="font-display text-lg font-bold text-on_surface">{rx.patient_name}</Text>
                <Text className="text-xs text-on_surface_variant">ID: #MS-{8800 + rx.patient_id}</Text>
              </View>
              <View className="bg-primary_fixed px-3 py-1 rounded-full items-center justify-center">
                <Text className="text-on_primary_fixed font-bold text-xs uppercase">View</Text>
              </View>
            </View>

            <View className="flex-row justify-between border-t border-outline_variant pt-4">
              <View>
                <Text className="text-[10px] text-outline uppercase font-bold tracking-widest mb-1">Practitioner</Text>
                <Text className="font-semibold text-on_surface text-sm">{rx.doctor_name}</Text>
              </View>
              <View>
                <Text className="text-[10px] text-outline uppercase font-bold tracking-widest mb-1">Date</Text>
                <Text className="font-semibold text-on_surface text-sm">{rx.date}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}

        {prescriptions.length === 0 && (
          <View className="p-10 items-center justify-center bg-surface_container_low rounded-xl">
            <Text className="text-on_surface_variant text-center">No prescriptions created yet. Click the + button at the top to issue the first prescription.</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
