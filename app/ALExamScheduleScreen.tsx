import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from "expo-router";
import examAPIController from "@/controllers/ExamController";

export default function ALExamScheduleScreen() {
    const navigation = useNavigation();
    const [examData, setExamData] = useState<any[]>([]);
    const [expandedStreams, setExpandedStreams] = useState<{ [key: string]: boolean }>({});

    const fetchData = async () => {
        try {
            const response = await examAPIController.getALExams();

            if (response) {
                // Transform backend data -> group exams by stream
                const exam = response[0]; // since your JSON has one exam
                const grouped: { [key: string]: any[] } = {};

                exam.timetable.forEach((t: any) => {
                    if (!grouped[t.stream]) {
                        grouped[t.stream] = [];
                    }
                    grouped[t.stream].push({
                        date: t.date,
                        time: `${t.startTime} - ${t.endTime}`,
                        subject: t.subject,
                        paper: t.paper
                    });
                });

                // Convert to array for rendering
                const formatted = Object.keys(grouped).map((stream) => ({
                    stream,
                    exams: grouped[stream]
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

    const toggleExpand = (stream: string) => {
        setExpandedStreams((prev) => ({
            ...prev,
            [stream]: !prev[stream]
        }));
    };

    return (
        <ScrollView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>A/L Exam Schedule</Text>
                <Ionicons name="notifications-outline" size={24} color="#000" />
            </View>


            {/* Subject Streams */}
            <Text style={styles.subjectStreamTitle}>Subject Streams</Text>

            {examData.map((item, index) => (
                <View key={index} style={styles.subjectBox}>
                    {/* Stream Header */}
                    <TouchableOpacity
                        style={styles.subjectHeader}
                        onPress={() => toggleExpand(item.stream)}
                    >
                        <Text style={styles.subjectText}>{item.stream.toUpperCase()}</Text>
                        <Ionicons
                            name={expandedStreams[item.stream] ? 'remove-circle-outline' : 'add-circle-outline'}
                            size={20}
                            color="#666"
                        />
                    </TouchableOpacity>

                    {/* Expanded Exams */}
                    {expandedStreams[item.stream] && item.exams.length > 0 && (
                        <View style={styles.examList}>
                            {item.exams.map((exam: any, i: number) => (
                                <View key={i} style={styles.examItem}>
                                    <Text style={styles.examDate}>
                                        {exam.date} | ({exam.time})
                                    </Text>
                                    <Text style={styles.examName}>
                                        {exam.subject} ({exam.paper})
                                    </Text>
                                </View>
                            ))}
                        </View>
                    )}
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
    subjectStreamTitle: { fontWeight: 'bold', marginBottom: 10, fontSize: 16 },
    subjectBox: { backgroundColor: '#fff', borderRadius: 8, marginBottom: 10, overflow: 'hidden' },
    subjectHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 15, paddingVertical: 12 },
    subjectText: { fontSize: 14, fontWeight: '500', color: '#000' },
    examList: { backgroundColor: '#fff', paddingHorizontal: 15, paddingBottom: 10 },
    examItem: { marginBottom: 10 },
    examDate: { fontSize: 12, fontWeight: 'bold', color: '#000' },
    examName: { fontSize: 12, color: '#666' }
});
