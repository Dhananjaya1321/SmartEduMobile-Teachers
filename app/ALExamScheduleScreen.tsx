import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {useNavigation} from "expo-router";

export default function ALExamScheduleScreen() {
    const navigation = useNavigation();
    const [examData, setExamData] = useState([]);
    const [expandedSubjects, setExpandedSubjects] = useState({});

    useEffect(() => {
        // TODO: API CALL - Replace sample data with real API call
        // fetch('YOUR_API_URL')
        //   .then(res => res.json())
        //   .then(data => setExamData(data));

        setExamData([
            {
                subject: 'Bio Science',
                exams: []
            },
            {
                subject: 'Maths',
                exams: [
                    { date: 'Monday, 25th November', time: '08:30 A.M. - 11:40 A.M.', name: 'Combined Mathematics I' },
                    { date: 'Monday, 26th November', time: '08:30 A.M. - 11:40 A.M.', name: 'Combined Mathematics II' },
                    { date: 'Monday, 27th November', time: '08:30 A.M. - 11:40 A.M.', name: 'Physics I' },
                    { date: 'Monday, 28th November', time: '08:30 A.M. - 11:40 A.M.', name: 'Physics II' }
                ]
            },
            {
                subject: 'Commerce',
                exams: []
            },
            {
                subject: 'Arts',
                exams: []
            },
            {
                subject: 'Technology',
                exams: []
            }
        ]);
    }, []);

    const toggleExpand = (subject) => {
        setExpandedSubjects((prev) => ({
            ...prev,
            [subject]: !prev[subject]
        }));
    };

    const handleDownload = () => {
        // TODO: API CALL - trigger download from backend
        alert('Download timetable from backend here');
    };

    return (
        <ScrollView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color="black"/>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>A/L Exam Schedule</Text>
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

            {/* Subject Stream */}
            <ScrollView>
                <Text style={styles.subjectStreamTitle}>Subject stream</Text>

                {examData.map((item, index) => (
                    <View key={index} style={styles.subjectBox}>
                        <TouchableOpacity
                            style={styles.subjectHeader}
                            onPress={() => toggleExpand(item.subject)}
                        >
                            <Text style={styles.subjectText}>{item.subject}</Text>
                            <Ionicons
                                name={expandedSubjects[item.subject] ? 'remove-circle-outline' : 'add-circle-outline'}
                                size={20}
                                color="#666"
                            />
                        </TouchableOpacity>

                        {/* Expanded Exams */}
                        {expandedSubjects[item.subject] && item.exams.length > 0 && (
                            <View style={styles.examList}>
                                {item.exams.map((exam, i) => (
                                    <View key={i} style={styles.examItem}>
                                        <Text style={styles.examDate}>
                                            {exam.date} | ({exam.time})
                                        </Text>
                                        <Text style={styles.examName}>{exam.name}</Text>
                                    </View>
                                ))}
                            </View>
                        )}
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
    downloadButton: { backgroundColor: '#3D4E61', paddingVertical: 12, borderRadius: 8, alignItems: 'center', marginBottom: 50},
    downloadText: { color: '#fff', fontSize: 15, fontWeight: 'bold' },
    subjectStreamTitle: { fontWeight: 'bold', marginBottom: 10 },
    subjectBox: { backgroundColor: '#fff', borderRadius: 8, marginBottom: 10, overflow: 'hidden' },
    subjectHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 15, paddingVertical: 12 },
    subjectText: { fontSize: 14, fontWeight: '500', color: '#000' },
    examList: { backgroundColor: '#fff', paddingHorizontal: 15, paddingBottom: 10 },
    examItem: { marginBottom: 10 },
    examDate: { fontSize: 12, fontWeight: 'bold', color: '#000' },
    examName: { fontSize: 12, color: '#666' }
});
