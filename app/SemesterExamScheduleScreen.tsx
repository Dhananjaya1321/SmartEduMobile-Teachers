import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from "expo-router";
import { Dropdown } from "react-native-element-dropdown";
import examAPIController from "@/controllers/ExamController";

export default function SemesterExamScheduleScreen() {
    const navigation = useNavigation();
    const [expandedGrades, setExpandedGrades] = useState({});
    const [semester, setSemester] = useState('');
    const [examData, setExamData] = useState<any[]>([]);

    const fetchData = async () => {
        try {
            const response = await examAPIController.getAllTermExams();

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

    const toggleExpand = (grade: string) => {
        setExpandedGrades((prev) => ({
            ...prev,
            [grade]: !prev[grade]
        }));
    };

    return (
        <ScrollView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Semester Exams Schedule</Text>
                <Ionicons name="notifications-outline" size={24} color="#000" />
            </View>


            {/* Grade-wise Exam Timetable */}
            <Text style={styles.subjectStreamTitle}>Exams by Grade</Text>
            {examData.map((item, index) => (
                <View key={index} style={styles.subjectBox}>
                    <TouchableOpacity
                        style={styles.subjectHeader}
                        onPress={() => toggleExpand(item.grade)}
                    >
                        <Text style={styles.subjectText}>
                            Grade {item.grade} ({item.examName} - {item.year})
                        </Text>
                        <Ionicons
                            name={expandedGrades[item.grade] ? 'remove-circle-outline' : 'add-circle-outline'}
                            size={20}
                            color="#666"
                        />
                    </TouchableOpacity>

                    {/* Expanded Exam List */}
                    {expandedGrades[item.grade] && item.exams.length > 0 && (
                        <View style={styles.examList}>
                            {item.exams.map((exam, i) => (
                                <View key={i} style={styles.examItem}>
                                    <Text style={styles.examDate}>
                                        {exam.date} | {exam.time}
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
    headerTitle: { fontSize: 18, fontWeight: '600', paddingHorizontal: 20, textAlign: "center" },
    classAndGradeBox: { marginBottom: 30 },
    inputBox: { backgroundColor: '#fff', borderRadius: 8, paddingHorizontal: 5, paddingVertical: 2 },
    dropdown: { height: 40, backgroundColor: '#fff', borderRadius: 8, paddingHorizontal: 8 },
    placeholderStyle: { fontSize: 14, color: '#999' },
    selectedTextStyle: { fontSize: 14, color: '#000' },
    iconStyle: { width: 20, height: 20 },
    label: { fontSize: 13, color: '#666', marginBottom: 5 },
    subjectStreamTitle: { fontWeight: 'bold', marginBottom: 10, fontSize: 16 },
    subjectBox: { backgroundColor: '#fff', borderRadius: 8, marginBottom: 10, overflow: 'hidden' },
    subjectHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 15, paddingVertical: 12 },
    subjectText: { fontSize: 14, fontWeight: '500', color: '#000' },
    examList: { backgroundColor: '#f9f9f9', paddingHorizontal: 15, paddingBottom: 10 },
    examItem: { marginBottom: 10 },
    examDate: { fontSize: 12, fontWeight: 'bold', color: '#000' },
    examName: { fontSize: 12, color: '#666' },
});
