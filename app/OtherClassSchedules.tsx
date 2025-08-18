import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Dropdown } from 'react-native-element-dropdown';
import classTimetablesAPIController from '@/controllers/ClassTimetablesController';
import gradeAPIController from '@/controllers/GradesController';

// Predefined standard periods
const PERIODS = [
    '08:30 A.M. - 09:05 A.M.',
    '09:05 A.M. - 09:40 A.M.',
    '09:40 A.M. - 10:15 A.M.',
    '10:15 A.M. - 10:50 A.M.',
    '11:10 A.M. - 11:45 A.M.',
    '11:45 A.M. - 12:20 P.M.',
    '12:20 P.M. - 12:55 P.M.',
    '12:55 P.M. - 01:30 P.M.',
];

export default function TimeTableScreen() {
    const [expandedDay, setExpandedDay] = useState<string | null>('Monday');
    const [loading, setLoading] = useState(false);
    const [timeTableData, setTimeTableData] = useState<any>({ weekly: {} });
    const [grades, setGrades] = useState<any[]>([]);
    const [classes, setClasses] = useState<any[]>([]);
    const [selectedGrade, setSelectedGrade] = useState<string | null>(null);
    const [selectedClass, setSelectedClass] = useState<string | null>(null);
    const router = useRouter();

    // Fetch grades and classes
    const fetchGradesAndClasses = async () => {
        try {
            const response = await gradeAPIController.getAllGrades();
            const gradeOptions = response.data.map((g: any) => ({
                label: `Grade ${g.gradeName}`,
                value: g.id,
                classRooms: g.classRooms ?? [],
            }));
            setGrades(gradeOptions);
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

    // Fetch timetable
    const handleSearch = async () => {
        if (!selectedClass) return;
        setLoading(true);

        try {
            const res = await classTimetablesAPIController.findOtherClassesTimetableToTeacherByClassId(selectedClass);

            // Prepare structure with all periods
            const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
            const weekly: Record<string, any[]> = {};
            days.forEach(day => {
                weekly[day] = [];
            });

            PERIODS.forEach((time, periodIndex) => {
                const period = periodIndex + 1;
                days.forEach((day, idx) => {
                    const periodData = res.timetablePeriods.find((p: any) => p.period === period);
                    if (time === '10:50 A.M. - 11:10 A.M.') {
                        // Forcefully add interval from frontend
                        weekly[day].push({
                            time,
                            subject: 'Interval',
                            teacher: '',
                            highlight: true,
                        });
                    } else if (periodData && periodData.slots[idx]) {
                        const slot = periodData.slots[idx];
                        weekly[day].push({
                            time,
                            subject: slot.subject || 'Unknown',
                            teacher: slot.teacherName || 'N/A',
                        });
                    } else {
                        weekly[day].push({
                            time,
                            subject: '-',
                            teacher: '-',
                        });
                    }
                });
            });

            setTimeTableData({ weekly });
        } catch (error) {
            console.error('Error fetching timetable:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGradesAndClasses();
    }, []);

    const toggleDay = (day: string) => {
        setExpandedDay(expandedDay === day ? null : day);
    };

    if (loading) {
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="#000" />
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Class Timetable</Text>
                <Ionicons name="notifications-outline" size={24} color="black" />
            </View>

            {/* Dropdowns */}
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
                            onChange={(item) => setSelectedClass(item.value)}
                            disable={classes.length === 0}
                        />
                    </View>
                </View>
            </View>

            {/* Search Button */}
            <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
                <Text style={styles.searchButtonText}>Search</Text>
            </TouchableOpacity>

            {/* Timetable */}
            <ScrollView showsVerticalScrollIndicator={false}>
                {Object.keys(timeTableData.weekly).map((day) => (
                    <View key={day} style={styles.dayContainer}>
                        {/* Day Header */}
                        <TouchableOpacity style={styles.dayHeader} onPress={() => toggleDay(day)}>
                            <Text style={styles.dayTitle}>{day}</Text>
                            <Ionicons
                                name={expandedDay === day ? 'remove-circle-outline' : 'add-circle-outline'}
                                size={24}
                                color="gray"
                            />
                        </TouchableOpacity>

                        {/* Time Table Rows */}
                        {expandedDay === day && timeTableData.weekly[day].length > 0 && (
                            <View style={styles.table}>
                                <View style={styles.tableHeader}>
                                    <Text style={styles.tableHeaderText}>Time</Text>
                                    <Text style={styles.tableHeaderText}>Subject</Text>
                                    <Text style={styles.tableHeaderText}>Teacher</Text>
                                </View>
                                {timeTableData.weekly[day].map((item, index) => (
                                    <View
                                        key={index}
                                        style={[
                                            styles.tableRow,
                                            item.highlight && { backgroundColor: '#FFF3CD' },
                                        ]}
                                    >
                                        <Text style={styles.tableCell}>{item.time}</Text>
                                        <Text style={[styles.tableCell, item.highlight && { fontWeight: 'bold' }]}>
                                            {item.subject}
                                        </Text>
                                        <Text style={styles.tableCell}>{item.teacher}</Text>
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
    container: { flex: 1, backgroundColor: '#F6F9FC', paddingTop: 50, paddingHorizontal: 20 },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 30,
    },
    headerTitle: { fontSize: 18, fontWeight: '600' },
    loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    gradeClassRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
    gradeBox: { flex: 1, marginRight: 10 },
    classBox: { flex: 1 },
    label: { fontSize: 16, color: '#444', marginBottom: 8 },
    inputBox: {
        backgroundColor: '#fff',
        padding: 12,
        borderRadius: 8,
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    dropdown: { backgroundColor: 'transparent' },
    placeholderStyle: { fontSize: 16, color: '#888' },
    selectedTextStyle: { fontSize: 16, color: '#333' },
    iconStyle: { width: 20, height: 20 },
    searchButton: { backgroundColor: '#4a5e7a', padding: 12, borderRadius: 5, marginBottom: 30 },
    searchButtonText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },
    dayContainer: { marginBottom: 10 },
    dayHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
    },
    dayTitle: { fontSize: 16, fontWeight: 'bold' },
    table: { backgroundColor: '#fff', borderRadius: 10, marginTop: 5, overflow: 'hidden' },
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: '#F0F0F0',
        padding: 10,
        justifyContent: 'space-around',
    },
    tableHeaderText: { flex: 1, fontWeight: 'bold', textAlign: 'center' },
    tableRow: {
        flexDirection: 'row',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        justifyContent: 'space-around',
    },
    tableCell: { flex: 1, textAlign: 'center' },
});
