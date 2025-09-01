import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {useNavigation} from "expo-router";

export default function ScholarshipExamScheduleScreen() {
    const navigation = useNavigation();
    const [examData, setExamData] = useState([]);

    useEffect(() => {
        // TODO: Replace with your API call
        // fetch('YOUR_API_URL')
        //   .then(res => res.json())
        //   .then(data => setExamData(data));

        // Sample Data (matches your screenshot)
        setExamData([
            {
                date: '17th March 2025 Monday',
                time: '08:30 A.M. - 11:40 A.M.',
                subjects: [
                    'Paper I'
                ]
            },
            {
                date: '18th March 2025 Monday',
                time: '08:30 A.M. - 11:40 A.M.',
                subjects: [
                    'Paper II'
                ]
            },
        ]);
    }, []);

    const handleDownload = () => {
        // TODO: Implement download from backend
        alert('Download timetable from backend here');
    };

    return (
        <ScrollView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color="black"/>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>O/L Exam Schedule</Text>
                <Ionicons name="notifications-outline" size={24} color="#000" />
            </View>

            {/* Info Text */}
            <Text style={styles.infoText}>
                Click the button below to download the complete exam timetable.
            </Text>

            {/* Download Button */}
            <TouchableOpacity style={styles.downloadButton} onPress={handleDownload}>
                <Text style={styles.downloadText}>Download Timetable</Text>
            </TouchableOpacity>

            {/* Timetable List */}
            <ScrollView>
                <Text style={styles.timetableTitle}>Timetable</Text>

                {examData.map((item, index) => (
                    <View key={index} style={styles.examBox}>
                        <Text style={styles.examDate}>
                            {item.date} | ({item.time})
                        </Text>
                        {item.subjects.map((subj, i) => (
                            <Text key={i} style={styles.subjectText}>{subj}</Text>
                        ))}
                    </View>
                ))}
            </ScrollView>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {flex: 1, backgroundColor: '#F6F9FC', paddingTop: 50, paddingHorizontal: 20},
    header: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 50},
    headerTitle: {fontSize: 18, fontWeight: '600'},
    infoText: { fontSize: 13, color: '#555', marginBottom: 10 },
    downloadButton: { backgroundColor: '#3D4E61', paddingVertical: 12, borderRadius: 8, alignItems: 'center', marginBottom: 50 },
    downloadText: { color: '#fff', fontSize: 15, fontWeight: 'bold' },
    timetableTitle: { fontWeight: 'bold', marginBottom: 10 },
    examBox: { backgroundColor: '#fff', borderRadius: 8, padding: 15, marginBottom: 10 },
    examDate: { fontSize: 12, fontWeight: 'bold', color: '#000', marginBottom: 5 },
    subjectText: { fontSize: 12, color: '#666' }
});
