import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRouter } from 'expo-router';
import {Dropdown} from "react-native-element-dropdown";
import gradeAPIController from "@/controllers/GradesController";
import studentAPIController from "@/controllers/StudentController";
import attendanceAPIController from "@/controllers/AttendanceController";

// Placeholder for backend data
interface AttendanceSummary {
    totalDays: number;
    attendedDays: number;
    absentDays: number;
    attendanceRate: string;
}

interface AttendanceDay {
    day: number;
    present: boolean;
}

interface AttendanceData {
    summary: AttendanceSummary;
    months: { month: string; days: AttendanceDay[] }[];
}

export default function ViewAttendanceScreen() {
    const navigation = useNavigation();
    const [grade, setGrade] = useState('Grade - 10');
    const [className, setClassName] = useState('Class - A');
    const [studentName, setStudentName] = useState('');
    const [date, setDate] = useState(new Date());
    const [expandedMonth, setExpandedMonth] = useState<string | null>('October 2021');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [grades, setGrades] = useState<any[]>([]);
    const [classes, setClasses] = useState<any[]>([]);
    const [students, setStudents] = useState<any[]>([]);
    const [selectedGrade, setSelectedGrade] = useState<string | null>(null);
    const [selectedClass, setSelectedClass] = useState<string | null>(null);
    const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
    const [totalDays, setTotalDays] = useState(0);
    const [attendedDays, setAttendedDays] = useState(0);
    const [absentDays, setAbsentDays] = useState(0);
    const [attendanceRate, setAttendanceRate] = useState(0);
    const [studentDetails, setStudentDetails] = useState<any[]>([]);

    const fetchGradesAndClasses = async () => {
        try {
            const response = await gradeAPIController.getAllGrades();
            const gradeOptions = response.data.map((g: any) => ({
                label: `Grade ${g.gradeName}`,
                value: g.id,
                classRooms: g.classRooms ?? [],
            }));
            setGrades(gradeOptions);
            setLoading(false);
        } catch (error) {
            console.error('Error loading grades:', error);
        }
    };

    const handleGradeSelect = (gradeId: string) => {
        setSelectedGrade(gradeId);
        const selected = grades.find((g) => g.value === gradeId);
        if (selected && selected.classRooms.length > 0) {
            const classOptions = selected.classRooms.map((c: any) => ({
                label: c.className,
                value: c.id,
            }));
            setClasses(classOptions);
        } else {
            setClasses([]);
        }
        setSelectedClass(null); // Reset class when grade changes
    };

    useEffect(() => {
        fetchGradesAndClasses();
    }, []);

    const handleSelectClass =async (classId: string) => {
        setSelectedClass(classId)
        const response =  await studentAPIController.findClassAllStudentsByClassId(classId);
        const studentsOptions = response.map((s: any) => ({
            label: `${s.fullNameWithInitials} - (${s.registrationNumber})`,
            value: s.id,
        }));
        setStudents(studentsOptions);
    };


    const handleSelectStudent = async (studentId: string) => {
        setSelectedStudent(studentId);
        try {
            const response = await attendanceAPIController.getAllAttendanceByStudentId(studentId);
            console.log(response.data.length);
            setStudentDetails(response);

            // Calculate attendance metrics
            const total = response.data.length;
            const attended = response.data.filter((day: any) => day.present).length;
            const absent = total - attended;
            const rate = total > 0 ? ((attended / total) * 100).toFixed(2) + '%' : '0%';

            // Set state values
            setTotalDays(total);
            setAttendedDays(attended);
            setAbsentDays(absent);
            setAttendanceRate(rate);
        } catch (error) {
            console.error('Error fetching attendance:', error);
            setError('Failed to load attendance data');
        }
    };

    if (loading) {
        return <View style={styles.container}><ActivityIndicator size="large" color="#0000ff" /></View>;
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>View Attendance</Text>
                <Ionicons name="notifications-outline" size={24} color="#333" />
            </View>

            <View style={styles.gradeClassRow}>
                <View style={styles.gradeBox}>
                    <Text style={styles.label}>Grade</Text>
                    <View style={styles.inputBox}>
                        <Dropdown
                            style={styles.dropdown}
                            placeholderStyle={styles.placeholderStyle}
                            selectedTextStyle={styles.selectedTextStyle}
                            iconStyle={styles.iconStyle}
                            data={grades}
                            maxHeight={300}
                            labelField="label"
                            valueField="value"
                            value={selectedGrade}
                            onChange={(item) => handleGradeSelect(item.value)}
                        />
                    </View>
                </View>
                <View style={styles.classBox}>
                    <Text style={styles.label}>Class</Text>
                    <View style={styles.inputBox}>
                        <Dropdown
                            style={styles.dropdown}
                            placeholderStyle={styles.placeholderStyle}
                            selectedTextStyle={styles.selectedTextStyle}
                            iconStyle={styles.iconStyle}
                            data={classes}
                            maxHeight={300}
                            labelField="label"
                            valueField="value"
                            value={selectedClass}
                            onChange={(item) => handleSelectClass(item.value)}
                            disable={classes.length === 0}
                        />
                    </View>
                </View>
            </View>

            <View style={styles.classBox}>
                <Text style={styles.label}>Select Student</Text>
                <View style={styles.inputBox}>
                    <Dropdown
                        style={styles.dropdown}
                        placeholderStyle={styles.placeholderStyle}
                        selectedTextStyle={styles.selectedTextStyle}
                        iconStyle={styles.iconStyle}
                        data={students}
                        maxHeight={300}
                        labelField="label"
                        valueField="value"
                        value={selectedStudent}
                        onChange={(item) => handleSelectStudent(item.value)}
                        disable={classes.length === 0}
                    />
                </View>
            </View>

            <View style={styles.summarySection}>
                <Text style={styles.summaryTitle}>Summary ({date.toLocaleDateString()})</Text>
                <View style={styles.summaryRow}>
                    <Text>Total number of days school was in session this year</Text>
                    <Text style={styles.summaryValue}>{totalDays}</Text>
                </View>
                <View style={styles.summaryRow}>
                    <Text>Total number of days attended</Text>
                    <Text style={styles.summaryValue}>{attendedDays}</Text>
                </View>
                <View style={styles.summaryRow}>
                    <Text>Total number of days absent from school</Text>
                    <Text style={styles.summaryValue}>{absentDays}</Text>
                </View>
                <View style={styles.summaryRow}>
                    <Text>Student attendance rate</Text>
                    <Text style={styles.summaryValue}>{attendanceRate}</Text>
                </View>
                <Text style={styles.summaryInstruction}>You can view all the details of the days the student attended and was absent from school.</Text>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F6F9FC', paddingTop: 50, paddingHorizontal: 20 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 50 },
    headerTitle: { fontSize: 18, fontWeight: '600' },
    dropdownRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
    dropdownContainer: { flex: 1, marginRight: 10 },
    searchBox: { backgroundColor: '#fff', padding: 10, borderRadius: 5, flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
    searchIcon: { marginRight: 10 },
    searchInput: { flex: 1, fontSize: 14 },
    yearRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
    yearBox: { backgroundColor: '#E0E0E0', padding: 10, borderRadius: 5, flexDirection: 'row', alignItems: 'center' },
    summarySection: { backgroundColor: '#fff', padding: 15, borderRadius: 5, marginBottom: 20,marginTop:30 },
    summaryTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 10 },
    summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
    summaryValue: { fontWeight: 'bold' },
    summaryInstruction: { fontSize: 12, color: '#777', marginTop: 10 },
    monthHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10, backgroundColor: '#E0E0E0', borderRadius: 5, marginBottom: 10 },
    monthTitle: { fontSize: 16, fontWeight: 'bold' },
    calendarWeekHeader: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 5 },
    calendarRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 5 },
    calendarDayContainer: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
    calendarDay: { fontSize: 14, textAlign: 'center', width: 30, height: 30, lineHeight: 30, borderRadius: 15 },
    presentDay: { backgroundColor: '#BFFFBF', color: '#333' },
    absentDay: { backgroundColor: '#FFBFBF', color: '#333' },
    legend: { flexDirection: 'row', justifyContent: 'center', marginTop: 20 },
    legendItem: { flexDirection: 'row', alignItems: 'center', marginRight: 20 },
    legendCircle: { width: 20, height: 20, borderRadius: 10, marginRight: 5 },
    errorText: { textAlign: 'center', fontSize: 16, color: 'red' },
    inputBox: { backgroundColor: '#fff', padding: 12, borderRadius: 8, elevation: 2, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4 },
    dropdown: {backgroundColor: 'transparent' },
    gradeClassRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
    gradeBox: { flex: 1, marginRight: 10 },
    label: { fontSize: 16, color: '#444', marginBottom: 8 },
    placeholderStyle: { fontSize: 16, color: '#888' },
    selectedTextStyle: { fontSize: 16, color: '#333' },
    iconStyle: { width: 20, height: 20 },
    classBox: { flex: 1 },
});
