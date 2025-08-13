import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRouter } from 'expo-router';
import {Dropdown} from "react-native-element-dropdown";

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
    const [year, setYear] = useState('2021');
    const [expandedMonth, setExpandedMonth] = useState<string | null>('October 2021');
    const [attendanceData, setAttendanceData] = useState<AttendanceData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch data from backend
    useEffect(() => {
        const fetchAttendance = async () => {
            try {
                setLoading(true);
                // Replace with actual API call
                // const response = await fetch(`your-backend-api-endpoint?grade=${grade}&class=${className}&student=${studentName}&year=${year}`);
                // const data = await response.json();
                // setAttendanceData(data);
                setAttendanceData({
                    summary: {
                        totalDays: 226,
                        attendedDays: 215,
                        absentDays: 11,
                        attendanceRate: '95%',
                    },
                    months: [
                        {
                            month: 'October 2021',
                            days: [
                                { day: 1, present: false },
                                { day: 2, present: true },
                                { day: 3, present: true },
                                { day: 4, present: true },
                                { day: 5, present: true },
                                { day: 6, present: true },
                                { day: 7, present: true },
                                { day: 8, present: true },
                                { day: 9, present: true },
                                { day: 10, present: true },
                                { day: 11, present: true },
                                { day: 12, present: true },
                                { day: 13, present: true },
                                { day: 14, present: true },
                                { day: 15, present: true },
                                { day: 16, present: true },
                                { day: 17, present: true },
                                { day: 18, present: true },
                                { day: 19, present: true },
                                { day: 20, present: true },
                                { day: 21, present: true },
                                { day: 22, present: false },
                                { day: 23, present: true },
                                { day: 24, present: true },
                                { day: 25, present: true },
                                { day: 26, present: true },
                                { day: 27, present: true },
                                { day: 28, present: true },
                                { day: 29, present: true },
                                { day: 30, present: true },
                                { day: 31, present: true },
                            ],
                        },
                    ],
                });
            } catch (err) {
                setError('Failed to load attendance data.');
            } finally {
                setLoading(false);
            }
        };
        fetchAttendance();
    }, [grade, className, studentName, year]);

    const toggleMonth = (month: string) => {
        setExpandedMonth(expandedMonth === month ? null : month);
    };

    const renderCalendar = (days: AttendanceDay[]) => {
        const weeks = [];
        for (let i = 0; i < days.length; i += 7) {
            weeks.push(days.slice(i, i + 7));
        }
        return (
            <FlatList
                data={weeks}
                keyExtractor={(_, index) => index.toString()}
                renderItem={({ item: week }) => (
                    <View style={styles.calendarRow}>
                        {week.map((day) => (
                            <View key={day.day} style={styles.calendarDayContainer}>
                                <Text style={[styles.calendarDay, day.present ? styles.presentDay : styles.absentDay]}>
                                    {day.day}
                                </Text>
                            </View>
                        ))}
                    </View>
                )}
            />
        );
    };

    if (loading) {
        return <View style={styles.container}><ActivityIndicator size="large" color="#0000ff" /></View>;
    }

    if (error || !attendanceData) {
        return <View style={styles.container}><Text style={styles.errorText}>{error || 'Data not found.'}</Text></View>;
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

            <View style={styles.dropdownRow}>
                <View style={styles.dropdownContainer}>
                    <Text style={styles.label}>Current Grade</Text>
                    <Dropdown
                        style={styles.dropdown}
                        placeholderStyle={styles.placeholderStyle}
                        selectedTextStyle={styles.selectedTextStyle}
                        data={[
                            { label: 'Grade - 10', value: 'Grade - 10' },
                            { label: 'Grade - 11', value: 'Grade - 11' },
                        ]}
                        labelField="label"
                        valueField="value"
                        value={grade}
                        onChange={(item) => setGrade(item.value)}
                        renderRightIcon={() => <Ionicons name="chevron-down" size={20} color="#555" />}
                    />
                </View>
                <View style={styles.dropdownContainer}>
                    <Text style={styles.label}>Current Class</Text>
                    <Dropdown
                        style={styles.dropdown}
                        placeholderStyle={styles.placeholderStyle}
                        selectedTextStyle={styles.selectedTextStyle}
                        data={[
                            { label: 'Class - A', value: 'Class - A' },
                            { label: 'Class - B', value: 'Class - B' },
                        ]}
                        labelField="label"
                        valueField="value"
                        value={className}
                        onChange={(item) => setClassName(item.value)}
                        renderRightIcon={() => <Ionicons name="chevron-down" size={20} color="#555" />}
                    />
                </View>
            </View>

            <Text style={styles.label}>Student Name</Text>
            <View style={styles.searchBox}>
                <Ionicons name="search" size={20} color="#555" style={styles.searchIcon} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search"
                    value={studentName}
                    onChangeText={setStudentName}
                />
            </View>

            <View style={styles.yearRow}>
                <TouchableOpacity style={styles.yearBox}>
                    <Text>{year}</Text>
                    <Ionicons name="calendar-outline" size={20} color="#555" />
                </TouchableOpacity>
                <View style={styles.yearBox}>
                    <Text>{grade}</Text>
                </View>
                <View style={styles.yearBox}>
                    <Text>{className}</Text>
                </View>
            </View>

            <View style={styles.summarySection}>
                <Text style={styles.summaryTitle}>Summary</Text>
                <View style={styles.summaryRow}>
                    <Text>Total number of days school was in session this year</Text>
                    <Text style={styles.summaryValue}>{attendanceData.summary.totalDays}</Text>
                </View>
                <View style={styles.summaryRow}>
                    <Text>Total number of days attended</Text>
                    <Text style={styles.summaryValue}>{attendanceData.summary.attendedDays}</Text>
                </View>
                <View style={styles.summaryRow}>
                    <Text>Total number of days absent from school</Text>
                    <Text style={styles.summaryValue}>{attendanceData.summary.absentDays}</Text>
                </View>
                <View style={styles.summaryRow}>
                    <Text>Student attendance rate</Text>
                    <Text style={styles.summaryValue}>{attendanceData.summary.attendanceRate}</Text>
                </View>
                <Text style={styles.summaryInstruction}>Using this calendar, you can view all the details of the days the student attended and was absent from school.</Text>
            </View>

            {attendanceData.months.map((monthData) => (
                <View key={monthData.month}>
                    <TouchableOpacity style={styles.monthHeader} onPress={() => toggleMonth(monthData.month)}>
                        <Text style={styles.monthTitle}>{monthData.month}</Text>
                        <Ionicons name={expandedMonth === monthData.month ? 'chevron-up' : 'chevron-down'} size={20} color="#555" />
                    </TouchableOpacity>
                    {expandedMonth === monthData.month && (
                        <>
                            <View style={styles.calendarWeekHeader}>
                                <Text>SUN</Text>
                                <Text>MON</Text>
                                <Text>TUE</Text>
                                <Text>WED</Text>
                                <Text>THU</Text>
                                <Text>FRI</Text>
                                <Text>SAT</Text>
                            </View>
                            {renderCalendar(monthData.days)}
                        </>
                    )}
                </View>
            ))}

            <View style={styles.legend}>
                <View style={styles.legendItem}>
                    <View style={[styles.legendCircle, { backgroundColor: '#BFFFBF' }]} />
                    <Text>Present</Text>
                </View>
                <View style={styles.legendItem}>
                    <View style={[styles.legendCircle, { backgroundColor: '#FFBFBF' }]} />
                    <Text>Absent</Text>
                </View>
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
    label: { fontSize: 14, color: '#555', marginBottom: 5 },
    dropdown: { backgroundColor: '#E0E0E0', padding: 10, borderRadius: 5 },
    placeholderStyle: { fontSize: 14, color: '#777' },
    selectedTextStyle: { fontSize: 14, color: '#333' },
    searchBox: { backgroundColor: '#fff', padding: 10, borderRadius: 5, flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
    searchIcon: { marginRight: 10 },
    searchInput: { flex: 1, fontSize: 14 },
    yearRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
    yearBox: { backgroundColor: '#E0E0E0', padding: 10, borderRadius: 5, flexDirection: 'row', alignItems: 'center' },
    summarySection: { backgroundColor: '#fff', padding: 15, borderRadius: 5, marginBottom: 20 },
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
});
