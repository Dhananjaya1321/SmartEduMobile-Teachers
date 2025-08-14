import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRouter } from "expo-router";
import Animated from 'react-native-reanimated';
import {Dropdown} from "react-native-element-dropdown";
import RNDateTimePicker from "@react-native-community/datetimepicker";

const ScrollView = Animated.ScrollView;

function formatData(data, numColumns) {
    const numberOfFullRows = Math.floor(data.length / numColumns);
    let numberOfElementsLastRow = data.length - numberOfFullRows * numColumns;

    while (numberOfElementsLastRow !== 0 && numberOfElementsLastRow !== numColumns) {
        data.push({ label: `blank-${numberOfElementsLastRow}`, empty: true });
        numberOfElementsLastRow++;
    }
    return data;
}

export default function AttendanceReportOfAllStudents() {
    const navigation = useNavigation();
    const router = useRouter();
    const [attendanceData, setAttendanceData] = useState([]);
    const [summary, setSummary] = useState({ totalDays: 0, totalStudents: 0 });
    const [filters, setFilters] = useState({ grade: 'Grade - 10', class: 'Class - A', year: '2021' });
    const [grade, setGrade] = useState('Grade - 10');
    const [className, setClassName] = useState('Class - A');

    // Sample data to simulate backend response
    useEffect(() => {
        const sampleData = {
            totalDays: 226,
            totalStudents: 40,
            students: [
                { attendedCount: 215, absentCount: 11, attendedRate: '95%' },
                { attendedCount: 210, absentCount: 16, attendedRate: '93%' },
                { attendedCount: 205, absentCount: 21, attendedRate: '91%' },
                { attendedCount: 200, absentCount: 26, attendedRate: '88%' },
                { attendedCount: 215, absentCount: 11, attendedRate: '95%' },
            ]
        };
        setSummary({ totalDays: sampleData.totalDays, totalStudents: sampleData.totalStudents });
        setAttendanceData(sampleData.students);
    }, [filters]);

    const handleFilterChange = (field, value) => {
        setFilters(prev => ({ ...prev, [field]: value }));
    };

    const renderStudentItem = ({ item }) => (
        <View style={styles.studentCard}>
            <Image source={require('@/assets/images/character.png')} style={styles.studentImage} />
            <View style={styles.studentInfo}>
                <Text style={styles.studentName}>Student Name</Text>
                <Text>Attended count: {item.attendedCount || 0}</Text>
                <Text>Absent count: {item.absentCount || 0}</Text>
                <Text>Attended Rate: {item.attendedRate || '0%'}</Text>
            </View>
        </View>
    );

    return (
        <ScrollView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
                <View style={{width:200}}>
                    <Text style={styles.headerTitle}>Attendance Report of All Students</Text>
                </View>
                <Ionicons name="notifications-outline" size={24} color="black" />
            </View>

            {/* Filters */}
            <View style={styles.gradeClassRow}>
                <View style={styles.gradeBox}>
                    <Text style={styles.label}>Grade</Text>
                    <View style={styles.inputBox}>
                        <Dropdown
                            style={styles.dropdown}
                            placeholderStyle={styles.placeholderStyle}
                            selectedTextStyle={styles.selectedTextStyle}
                            iconStyle={styles.iconStyle}
                            data={[
                                { label: 'Grade - 10', value: 'Grade - 10' },
                                { label: 'Grade - 11', value: 'Grade - 11' },
                                { label: 'Grade - 12', value: 'Grade - 12' },
                                { label: 'Grade - 13', value: 'Grade - 13' },
                            ]}
                            maxHeight={300}
                            labelField="label"
                            valueField="value"
                            value={grade}
                            onChange={item => setGrade(item.value)}
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
                            data={[
                                { label: 'Class - A', value: 'Class - A' },
                                { label: 'Class - B', value: 'Class - B' },
                                { label: 'Class - C', value: 'Class - C' },
                                { label: 'Class - D', value: 'Class - D' },
                            ]}
                            maxHeight={300}
                            labelField="label"
                            valueField="value"
                            value={className}
                            onChange={item => setClassName(item.value)}
                        />
                    </View>
                </View>
            </View>
            <View style={styles.filterContainer}>
                <View style={styles.filterItem}>

                    <Text style={styles.label}>Year</Text>
                    <View style={styles.dateBox}>
                        <RNDateTimePicker value={new Date()} />
                    </View>
                </View>
            </View>

            {/* Search Button */}
            <TouchableOpacity style={styles.searchButton} onPress={() => {}}>
                <Text style={styles.searchButtonText}>Search</Text>
            </TouchableOpacity>

            {/* Summary */}
            <View style={styles.summaryContainer}>
                <Text style={styles.summaryTitle}>Attendance Report Summary</Text>
                <Text>Total number of days school was in session this year: {summary.totalDays}</Text>
                <Text>The total number of students in this class in this grade: {summary.totalStudents}</Text>
            </View>

            {/* Download Button */}
            <TouchableOpacity style={styles.downloadButton} onPress={() => {}}>
                <Text style={styles.downloadButtonText}>Download Report</Text>
            </TouchableOpacity>

            {/* Student List */}
            <FlatList
                data={attendanceData}
                keyExtractor={(item, index) => index.toString()}
                renderItem={renderStudentItem}
                contentContainerStyle={styles.studentList}
            />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F6F9FC', paddingTop: 50, paddingHorizontal: 20 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 50 },
    headerTitle: {textAlign:"center", fontSize: 18, fontWeight: '600' },
    filterContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
    filterItem: { flex: 1, marginHorizontal: 5 },
    filterText: { fontSize: 16, borderWidth: 1, borderColor: '#ccc', padding: 5, borderRadius: 5 },
    searchButton: { backgroundColor: '#4a5e7a', padding: 10, borderRadius: 5, marginBottom: 20 },
    searchButtonText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },
    summaryContainer: { marginBottom: 20 },
    summaryTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 10 },
    downloadButton: { backgroundColor: '#4a5e7a', padding: 10, borderRadius: 5, marginBottom: 20 },
    downloadButtonText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },
    studentList: { paddingBottom: 20 },
    studentCard: { flexDirection: 'row', backgroundColor: '#fff', padding: 10, marginBottom: 10, borderRadius: 5, alignItems: 'center' },
    studentImage: { width: 50, height: 50, marginRight: 10 },
    studentName: { fontSize: 16, fontWeight: 'bold', marginBottom: 5 },
    studentInfo: { flex: 1 },
    inputBox: { backgroundColor: '#fff', padding: 12, borderRadius: 8, elevation: 2, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4 },
    dropdown: {backgroundColor: 'transparent' },
    gradeClassRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
    gradeBox: { flex: 1, marginRight: 10 },
    label: { fontSize: 16, color: '#444', marginBottom: 8 },
    placeholderStyle: { fontSize: 16, color: '#888' },
    selectedTextStyle: { fontSize: 16, color: '#333' },
    iconStyle: { width: 20, height: 20 },
    classBox: { flex: 1 },
    dateBox: {
        display:"flex",
        backgroundColor: '#fff',
        padding: 12,
        borderRadius: 8,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,

    },
});
