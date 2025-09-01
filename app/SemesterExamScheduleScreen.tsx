import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {useNavigation} from "expo-router";
import {Dropdown} from "react-native-element-dropdown";

export default function SemesterExamScheduleScreen() {
    const navigation = useNavigation();
    const [examData, setExamData] = useState([]);
    const [expandedSubjects, setExpandedSubjects] = useState({});
    const [semester, setSemester] = useState('');

    useEffect(() => {
        // TODO: API CALL - Replace sample data with real API call
        // fetch('YOUR_API_URL')
        //   .then(res => res.json())
        //   .then(data => setExamData(data));

        setExamData([
            {
                grade: 'Grade 13 - Maths',
                exams: []
            },
            {
                grade: 'Grade 13 - Bio Science',
                exams: [
                    { date: 'Monday, 25th November', time: '08:30 A.M. - 11:40 A.M.', name: 'Combined Mathematics I' },
                    { date: 'Monday, 26th November', time: '08:30 A.M. - 11:40 A.M.', name: 'Combined Mathematics II' },
                    { date: 'Monday, 27th November', time: '08:30 A.M. - 11:40 A.M.', name: 'Physics I' },
                    { date: 'Monday, 28th November', time: '08:30 A.M. - 11:40 A.M.', name: 'Physics II' }
                ]
            },
            {
                grade: 'Grade 13 - Commerce',
                exams: []
            },
            {
                grade: 'Grade 13 - Art',
                exams: []
            },
            {
                grade: 'Grade 13 - Technology',
                exams: []
            },
            {
                grade: 'Grade 12 - Maths',
                exams: []
            },
            {
                grade: 'Grade 12 - Bio Science',
                exams: []
            },
            {
                grade: 'Grade 12 - Commerce',
                exams: []
            },
        ]);
    }, []);

    const toggleExpand = (subject) => {
        setExpandedSubjects((prev) => ({
            ...prev,
            [subject]: !prev[subject]
        }));
    };

    const handleSearch = () => {
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
                <Text style={styles.headerTitle}>Semester Exams Schedule</Text>
                <Ionicons name="notifications-outline" size={24} color="#000" />
            </View>

            <View style={styles.classAndGradeBox}>
                <Text style={styles.label}>Class</Text>
                <View style={styles.inputBox}>
                    <Dropdown
                        style={styles.dropdown}
                        placeholderStyle={styles.placeholderStyle}
                        selectedTextStyle={styles.selectedTextStyle}
                        iconStyle={styles.iconStyle}
                        data={[
                            {label: 'First Semester', value: 'First Semester'},
                            {label: 'Second Semester', value: 'Second Semester'},
                            {label: 'Final Semester', value: 'Final Semester'},
                        ]}
                        maxHeight={300}
                        labelField="label"
                        valueField="value"
                        placeholder="Select Semester"
                        value={semester}
                        onChange={item => setSemester(item.value)}
                    />
                </View>
            </View>


            {/* Search Button */}
            <TouchableOpacity style={styles.downloadButton} onPress={handleSearch}>
                <Text style={styles.downloadText}>Search</Text>
            </TouchableOpacity>

            {/* Subject Stream */}
            <ScrollView>
                <Text style={styles.subjectStreamTitle}>Grade</Text>

                {examData.map((item, index) => (
                    <View key={index} style={styles.subjectBox}>
                        <TouchableOpacity
                            style={styles.subjectHeader}
                            onPress={() => toggleExpand(item.grade)}
                        >
                            <Text style={styles.subjectText}>{item.grade}</Text>
                            <Ionicons
                                name={expandedSubjects[item.grade] ? 'remove-circle-outline' : 'add-circle-outline'}
                                size={20}
                                color="#666"
                            />
                        </TouchableOpacity>

                        {/* Expanded Exams */}
                        {expandedSubjects[item.grade] && item.exams.length > 0 && (
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
    headerTitle: {fontSize: 18, fontWeight: '600', paddingHorizontal:20, textAlign:"center"},
    infoText: { fontSize: 13, color: '#555', marginBottom: 10 },
    downloadButton: { backgroundColor: '#3D4E61', paddingVertical: 12, borderRadius: 8, alignItems: 'center', marginBottom: 50, marginTop:20},
    downloadText: { color: '#fff', fontSize: 15, fontWeight: 'bold' },
    subjectStreamTitle: { fontWeight: 'bold', marginBottom: 10 },
    subjectBox: { backgroundColor: '#fff', borderRadius: 8, marginBottom: 10, overflow: 'hidden' },
    subjectHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 15, paddingVertical: 12 },
    subjectText: { fontSize: 14, fontWeight: '500', color: '#000' },
    examList: { backgroundColor: '#fff', paddingHorizontal: 15, paddingBottom: 10 },
    examItem: { marginBottom: 10 },
    examDate: { fontSize: 12, fontWeight: 'bold', color: '#000' },
    examName: { fontSize: 12, color: '#666' },
    classAndGradeBox: {flex: 1, borderRadius: 8, marginBottom: 50},
    inputBox: {backgroundColor: '#fff', borderRadius: 8, paddingHorizontal: 5, paddingVertical: 2},
    dropdown: {height: 40, backgroundColor: '#fff', borderRadius: 8, paddingHorizontal: 8},
    placeholderStyle: {fontSize: 14, color: '#999'},
    selectedTextStyle: {fontSize: 14, color: '#000'},
    iconStyle: {width: 20, height: 20},
    label: {fontSize: 13, color: '#666', marginBottom: 5},
});
