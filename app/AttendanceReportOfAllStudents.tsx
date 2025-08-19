import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Alert, Platform} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {useNavigation} from 'expo-router';
import Animated from 'react-native-reanimated';
import {Dropdown} from 'react-native-element-dropdown';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import gradeAPIController from '@/controllers/GradesController';
import attendanceAPIController from '@/controllers/AttendanceController';
import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system";

const ScrollView = Animated.ScrollView;

export default function AttendanceReportOfAllStudents() {
    const navigation = useNavigation();
    const [attendanceData, setAttendanceData] = useState([]);
    const [summary, setSummary] = useState({totalDays: 0, totalStudents: 0});
    const [grades, setGrades] = useState([]);
    const [classes, setClasses] = useState([]);
    const [selectedGrade, setSelectedGrade] = useState(null);
    const [selectedClass, setSelectedClass] = useState(null);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch grades and classes
    const fetchGradesAndClasses = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await gradeAPIController.getAllGrades();
            const gradeOptions = response.data.map((g) => ({
                label: `Grade ${g.gradeName}`,
                value: g.id,
                classRooms: g.classRooms ?? [],
            }));
            setGrades(gradeOptions);
        } catch (error) {
            console.error('Error loading grades:', error);
            setError('Failed to load grades. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    // Handle grade selection
    const handleGradeSelect = (gradeId) => {
        setSelectedGrade(gradeId);
        const selected = grades.find((g) => g.value === gradeId);
        if (selected && selected.classRooms.length > 0) {
            const classOptions = selected.classRooms.map((c) => ({
                label: c.className,
                value: c.id,
            }));
            setClasses(classOptions);
        } else {
            setClasses([]);
        }
        setSelectedClass(null);
        setAttendanceData([]);
        setSummary({totalDays: 0, totalStudents: 0});
    };

    // Handle class selection
    const handleSelectClass = (classId) => {
        setSelectedClass(classId);
        fetchStudents(classId, selectedYear);
    };

    // Handle year change
    const handleYearChange = (event, selectedDate) => {
        if (event.type === 'set' && selectedDate) {
            const year = selectedDate.getFullYear();
            setSelectedYear(year);
            if (selectedClass) {
                fetchStudents(selectedClass, year);
            }
        }
    };

    // Fetch students' attendance data
    const fetchStudents = async (classId, year) => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await attendanceAPIController.getAllStudentsAllAttendanceByClassId(classId);

            console.log(response.data)

            setSummary({totalDays: response.data[0].totalDays, totalStudents: response.data.length});
            setAttendanceData(response.data.map((s, index) => ({...s, id: s.id || index.toString()})));
        } catch (err) {
            console.error('Error fetching students:', err);
            setError('Failed to load attendance data. Please try again.');
            setAttendanceData([]);
            setSummary({totalDays: 0, totalStudents: 0});
        } finally {
            setIsLoading(false);
        }
    };

    // Download report as CSV (using react-native-share)

    const handleDownloadReport = async () => {
        if (!attendanceData.length) {
            Alert.alert("No Data", "No attendance data available to download.");
            return;
        }

        try {
            const csvContent = [
                "Student Name,Attended Count,Absent Count,Attendance Rate",
                ...attendanceData.map(
                    (item) =>
                        `${item.studentName || "Unknown"},${item.attendedCount || 0},${item.absentCount || 0},${item.attendedRate || "0%"}`
                ),
            ].join("\n");

            const fileName = FileSystem.documentDirectory + `attendance_report_${selectedYear}.csv`;

            await FileSystem.writeAsStringAsync(fileName, csvContent, {
                encoding: FileSystem.EncodingType.UTF8,
            });

            await Sharing.shareAsync(fileName, {
                mimeType: "text/csv",
                dialogTitle: "Share Attendance Report",
                UTI: "public.comma-separated-values-text",
            });

            Alert.alert("Success", "Report shared successfully.");
        } catch (err) {
            console.error("Error sharing report:", err);
            Alert.alert("Error", "Failed to share report. Please try again.");
        }
    };

    // Initial fetch
    useEffect(() => {
        fetchGradesAndClasses();
    }, []);

    // Render student item
    const renderStudentItem = ({item}) => (
        <View style={styles.studentCard}>
            <Image source={require('@/assets/images/character.png')} style={styles.studentImage}/>
            <View style={styles.studentInfo}>
                <Text style={styles.studentName}>{item.studentName || 'Unknown'}</Text>
                <Text>Attended count: {item.totalAttended || 0}</Text>
                <Text>Absent count: {item.totalAbsent || 0}</Text>
                <Text>Attended Rate: {item.attendedRate+'%' || '0%'}</Text>
            </View>
        </View>
    );

    return (
        <ScrollView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color="black"/>
                </TouchableOpacity>
                <View style={{width: 200}}>
                    <Text style={styles.headerTitle}>Attendance Report of All Students</Text>
                </View>
                <Ionicons name="notifications-outline" size={24} color="black"/>
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
                            data={grades}
                            maxHeight={300}
                            labelField="label"
                            valueField="value"
                            placeholder="Select Grade"
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
                            placeholder="Select Class"
                            value={selectedClass}
                            onChange={(item) => handleSelectClass(item.value)}
                            disable={classes.length === 0}
                        />
                    </View>
                </View>
            </View>
            <View style={styles.filterContainer}>
                <View style={styles.filterItem}>
                    <Text style={styles.label}>Year</Text>
                    <View style={styles.dateBox}>
                        <RNDateTimePicker
                            value={new Date(selectedYear, 0, 1)}
                            mode="date"
                            display={Platform.OS === 'ios' ? 'inline' : 'default'}
                            onChange={handleYearChange}
                        />
                    </View>
                </View>
            </View>

            {/* Loading and Error States */}
            {isLoading && <Text style={styles.infoText}>Loading...</Text>}
            {error && <Text style={styles.errorText}>{error}</Text>}

            {/* Summary */}
            <View style={styles.summaryContainer}>
                <Text style={styles.summaryTitle}>Attendance Report Summary</Text>
                <Text>Total number of days school was in session this year: {summary.totalDays}</Text>
                <Text>The total number of students in this class in this grade: {summary.totalStudents}</Text>
            </View>

            {/* Download Button */}
            <TouchableOpacity style={styles.downloadButton} onPress={handleDownloadReport}>
                <Text style={styles.downloadButtonText}>Download Report</Text>
            </TouchableOpacity>

            {/* Student List */}
            <FlatList
                data={attendanceData}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderStudentItem}
                contentContainerStyle={styles.studentList}
                ListEmptyComponent={<Text style={styles.infoText}>No students found.</Text>}
            />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {flex: 1, backgroundColor: '#F6F9FC', paddingTop: 50, paddingHorizontal: 20},
    header: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 50},
    headerTitle: {textAlign: 'center', fontSize: 18, fontWeight: '600'},
    filterContainer: {flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10},
    filterItem: {flex: 1, marginHorizontal: 5},
    summaryContainer: {marginBottom: 20},
    summaryTitle: {fontSize: 16, fontWeight: 'bold', marginBottom: 10},
    downloadButton: {backgroundColor: '#4a5e7a', padding: 10, borderRadius: 5, marginBottom: 20},
    downloadButtonText: {color: '#fff', textAlign: 'center', fontWeight: 'bold'},
    studentList: {paddingBottom: 20},
    studentCard: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        padding: 10,
        marginBottom: 10,
        borderRadius: 5,
        alignItems: 'center'
    },
    studentImage: {width: 50, height: 50, marginRight: 10},
    studentName: {fontSize: 16, fontWeight: 'bold', marginBottom: 5},
    studentInfo: {flex: 1},
    inputBox: {
        backgroundColor: '#fff',
        padding: 12,
        borderRadius: 8,
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4
    },
    dropdown: {backgroundColor: 'transparent'},
    gradeClassRow: {flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20},
    gradeBox: {flex: 1, marginRight: 10},
    label: {fontSize: 16, color: '#444', marginBottom: 8},
    placeholderStyle: {fontSize: 16, color: '#888'},
    selectedTextStyle: {fontSize: 16, color: '#333'},
    iconStyle: {width: 20, height: 20},
    classBox: {flex: 1},
    dateBox: {
        display: 'flex',
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
    infoText: {textAlign: 'center', fontSize: 16, color: '#666', marginVertical: 20},
    errorText: {textAlign: 'center', fontSize: 16, color: 'red', marginVertical: 20},
});
