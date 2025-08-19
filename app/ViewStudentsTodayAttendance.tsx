import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, FlatList, TouchableOpacity, Image, ActivityIndicator} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {useNavigation, useRouter} from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import Animated from 'react-native-reanimated';
import {Dropdown} from "react-native-element-dropdown";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import attendanceAPIController from "@/controllers/AttendanceController";
import gradeAPIController from "@/controllers/GradesController";
import studentAPIController from "@/controllers/StudentController";

const ScrollView = Animated.ScrollView;

// Placeholder image
const placeholderImage = require('@/assets/images/character.png');

export default function ViewStudentsTodayAttendance() {
    const navigation = useNavigation();
    const router = useRouter();
    const [grade, setGrade] = useState('Grade - 10');
    const [className, setClassName] = useState('Class - A');
    const [date, setDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [students, setStudents] = useState([]);
    const [summary, setSummary] = useState({totalStudents: 0, presentStudents: 0, absentStudents: 0});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [grades, setGrades] = useState<any[]>([]);
    const [classes, setClasses] = useState<any[]>([]);
    const [selectedGrade, setSelectedGrade] = useState<string | null>(null);
    const [selectedClass, setSelectedClass] = useState<string | null>(null);

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
        const currentDate = new Date();
        setDate(currentDate);
    }, []);

    const handleSelectClass = (classId: string) => {
        setSelectedClass(classId)
        fetchStudents(classId)
    };
    const fetchStudents = async (classId: string) => {
        try {
            setLoading(true);
            const response = await attendanceAPIController.getAllAttendanceByClassId(classId);

            const presentCount = response.data.filter((s: any) => s.status === "PRESENT").length;
            const absentCount = response.data.filter((s: any) => s.status === "ABSENT").length;

            setSummary({
                totalStudents: response.data.length,
                presentStudents: presentCount,
                absentStudents: absentCount,
            });

            setStudents(response.data);
        } catch (err) {
            setError('Failed to load students.');
        } finally {
            setLoading(false);
        }
    };

    const onDateChange = (event, selectedDate) => {
        setShowDatePicker(false);
        if (selectedDate) {
            setDate(selectedDate);
        }
    };

    const formatDate = (date) => {
        return `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}`;
    };

    if (loading) {
        return <View style={styles.container}><ActivityIndicator size="large" color="#0000ff"/></View>;
    }

    if (error) {
        return <View style={styles.container}><Text style={styles.errorText}>{error}</Text></View>;
    }

    return (
        <ScrollView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color="#333"/>
                </TouchableOpacity>
                <View style={{width:200}}>
                    <Text style={styles.headerTitle}>Students Today Attendance</Text>
                </View>
                <Ionicons name="notifications-outline" size={24} color="#333"/>
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
            <View style={styles.filterRow}>
                <View style={styles.filterItem}>
                    <Text style={styles.label}>Date</Text>
                    <View style={styles.dateBox}>
                        <RNDateTimePicker value={new Date()} />
                    </View>
                </View>
            </View>
            {showDatePicker && (
                <DateTimePicker
                    value={date}
                    mode="date"
                    display="default"
                    onChange={onDateChange}
                />
            )}


            {/* Summary */}
            <View style={styles.summaryContainer}>
                <Text style={styles.summaryTitle}>Today's Attendance Summary</Text>
                <View style={styles.summeryBoxFlex}>
                    <Text>The total students </Text>
                    <Text>{summary.totalStudents}</Text>
                </View>
                <View style={styles.summeryBoxFlex}>
                    <Text>The total students today </Text>
                    <Text>{summary.presentStudents}</Text>
                </View>
                <View style={styles.summeryBoxFlex}>
                    <Text>Total absent today </Text>
                    <Text>{summary.absentStudents}</Text>
                </View>


            </View>

            {/* Student List */}
            <View style={styles.studentListContainer}>
                <Text style={styles.studentListTitle}>Today's Attendance Students</Text>
                <FlatList
                    data={students}
                    keyExtractor={(item) => item.studentId.toString()}
                    renderItem={({item}) => (
                        <View
                            style={[styles.studentItem, item.status === 'ABSENT' ? styles.absentBg : styles.presentBg]}>
                            <Image source={placeholderImage} style={styles.studentPhoto}/>
                            <Text style={styles.studentName}>{item.studentName}</Text>
                            <Text
                                style={[styles.statusText, item.status === 'ABSENT' ? styles.absentText : styles.presentText]}>
                                {item.status}
                            </Text>
                        </View>
                    )}
                />
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F6F9FC', paddingTop: 50, paddingHorizontal: 20 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 50 },
    headerTitle: {textAlign: "center", fontSize: 18, fontWeight: 'bold', color: '#333', paddingHorizontal:20    },
    filterRow: {flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10},
    filterItem: {flex: 1, marginHorizontal: 5},
    label: {fontSize: 16, color: '#444', marginBottom: 5},
    filterText: {fontSize: 16, borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 5, textAlign: 'center'},
    searchButton: {backgroundColor: '#4a5e7a', padding: 12, borderRadius: 5, marginBottom: 20},
    searchButtonText: {color: '#fff', textAlign: 'center', fontWeight: 'bold'},
    summaryContainer: {marginBottom: 20, padding: 10, backgroundColor: '#fff', borderRadius: 5},
    summaryTitle: {fontSize: 16, fontWeight: 'bold', marginBottom: 10},
    studentListContainer: {marginBottom: 20},
    studentListTitle: {fontSize: 16, fontWeight: 'bold', marginBottom: 10},
    studentItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        marginBottom: 10,
        borderRadius: 10,
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    presentBg: {backgroundColor: '#BEF7BD'},
    absentBg: {backgroundColor: '#FFCDCA'},
    studentPhoto: {width: 40, height: 40, borderRadius: 5, marginRight: 10},
    studentName: {flex: 1, fontSize: 16, color: '#333'},
    statusText: {fontSize: 14, fontWeight: 'bold', padding: 5, borderRadius: 5},
    presentText: {
        color: '#00DC30',
        backgroundColor: '#BEF7BD',
        borderColor: '#00DC30',
        borderWidth: 1,
        padding: 5,
        borderRadius: 8
    },
    absentText: {
        color: '#FF0000',
        backgroundColor: '#FFCDCA',
        borderColor: '#FF0000',
        borderWidth: 1,
        padding: 5,
        borderRadius: 8
    },
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
    placeholderStyle: {fontSize: 16, color: '#888'},
    selectedTextStyle: {fontSize: 16, color: '#333'},
    iconStyle: {width: 20, height: 20},
    classBox: {flex: 1},
    errorText: {textAlign: 'center', fontSize: 16, color: 'red', marginTop: 20},
    flex:{gap:5, display:"flex",flexDirection:"row", justifyContent:"space-around", marginBottom:10},
    summeryBoxFlex:{gap:5, display:"flex",flexDirection:"row", justifyContent:"space-between", marginBottom:10},
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
