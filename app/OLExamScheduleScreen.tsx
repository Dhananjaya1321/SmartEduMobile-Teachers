import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from "expo-router";
import examAPIController from "@/controllers/ExamController";

export default function OLExamScheduleScreen() {
    const navigation = useNavigation();
    const [examData, setExamData] = useState<any[]>([]);

    const fetchData = async () => {
        try {
            const response = await examAPIController.getOLExams();

            if (response) {
                // transform backend data into UI-friendly structure
                const formatted = response.map((exam: any) => ({
                    examName: exam.examName,
                    grade: exam.grade,
                    year: exam.year,
                    exams: exam.timetable.map((t: any) => ({
                        date: t.date,
                        time: `${t.startTime} - ${t.endTime}`,
                        subject: t.subject,
                        paper: t.paper
                    }))
                }));

                setExamData(formatted);
            }
        } catch (err) {
            console.error("Failed to fetch exams", err);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <ScrollView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>O/L Exam Schedule</Text>
                <Ionicons name="notifications-outline" size={24} color="#000" />
            </View>


            {/* Timetable List */}
            <Text style={styles.timetableTitle}>Timetable</Text>

            {examData.map((exam, index) => (
                <View key={index} style={styles.examSection}>
                    {/* Exam Header */}
                    <Text style={styles.examHeader}>
                        {exam.examName} (Grade {exam.grade}, {exam.year})
                    </Text>
                    <View  style={styles.examBox}>
                        {exam.exams.map((e: any, i: number) => (
                           <View style={{marginBottom:5}}>
                                <Text key={i} style={styles.examDate}>
                                    {e.date} | ({e.time})
                                </Text>
                                <Text style={styles.subjectText}>
                                    {e.subject} ({e.paper})
                                </Text>
                           </View>
                        ))}
                    </View>
                </View>
            ))}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F6F9FC', paddingTop: 50, paddingHorizontal: 20 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 },
    headerTitle: { fontSize: 18, fontWeight: '600' },
    infoText: { fontSize: 13, color: '#555', marginBottom: 10 },
    downloadButton: { backgroundColor: '#3D4E61', paddingVertical: 12, borderRadius: 8, alignItems: 'center', marginBottom: 30 },
    downloadText: { color: '#fff', fontSize: 15, fontWeight: 'bold' },
    timetableTitle: { fontWeight: 'bold', marginBottom: 10, fontSize: 16 },
    examSection: { marginBottom: 20 },
    examHeader: { fontSize: 14, fontWeight: '600', marginBottom: 10, color: '#222' },
    examBox: { backgroundColor: '#fff', borderRadius: 8, padding: 12, marginBottom: 10 },
    examDate: { fontSize: 12, fontWeight: 'bold', color: '#000', marginBottom: 5 },
    subjectText: { fontSize: 12, color: '#666' }
});
