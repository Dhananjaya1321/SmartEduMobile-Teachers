import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from "expo-router";
import examAPIController from "@/controllers/ExamController";

export default function ScholarshipExamScheduleScreen() {
    const navigation = useNavigation();
    const [examData, setExamData] = useState<any[]>([]);

    const fetchData = async () => {
        try {
            const response = await examAPIController.getG5Exams();

            if (response) {
                const exam = response[0]; // your API likely returns a single exam object

                // Flatten timetable for display
                const formatted = exam.timetable.map((t: any) => ({
                    date: t.date,
                    time: `${t.startTime} - ${t.endTime}`,
                    subject: t.subject,
                    paper: t.paper
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
                <Text style={styles.headerTitle}>Grade 5 Scholarship Exam</Text>
                <Ionicons name="notifications-outline" size={24} color="#000" />
            </View>


            {/* Timetable List */}
            <Text style={styles.timetableTitle}>Timetable</Text>

            {examData.length === 0 ? (
                <Text style={{ color: "#888", fontSize: 13 }}>No exams available.</Text>
            ) : (
                examData.map((exam, index) => (
                    <View key={index} style={styles.examBox}>
                        <Text style={styles.examDate}>
                            {exam.date} | ({exam.time})
                        </Text>
                        <Text style={styles.subjectText}>
                            {exam.paper}
                        </Text>
                    </View>
                ))
            )}
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
    examBox: { backgroundColor: '#fff', borderRadius: 8, padding: 15, marginBottom: 10 },
    examDate: { fontSize: 12, fontWeight: 'bold', color: '#000', marginBottom: 5 },
    subjectText: { fontSize: 12, color: '#666' }
});
