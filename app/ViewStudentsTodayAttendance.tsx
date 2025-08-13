import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, FlatList, TouchableOpacity, Image, ActivityIndicator} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {useNavigation, useRouter} from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import Animated from 'react-native-reanimated';
import {Dropdown} from "react-native-element-dropdown";

const ScrollView = Animated.ScrollView;

// Placeholder image
const placeholderImage = require('@/assets/images/character.png');

export default function ViewStudentsTodayAttendance() {
    const navigation = useNavigation();
    const router = useRouter();
    const [grade, setGrade] = useState('Grade - 10');
    const [className, setClassName] = useState('Class - A');
    const [date, setDate] = useState(new Date('2021-02-02'));
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [students, setStudents] = useState([]);
    const [summary, setSummary] = useState({totalStudents: 0, presentStudents: 0, absentStudents: 0});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchAttendanceData = async () => {
            try {
                setLoading(true);
                // Replace with actual API call
                // const response = await fetch(`your-backend-api/attendance?grade=${grade}&class=${className}&date=${date.toISOString().split('T')[0]}`);
                // const data = await response.json();
                const sampleData = {
                    totalStudents: 40,
                    presentStudents: 32,
                    absentStudents: 8,
                    students: [
                        {id: 1, name: 'Student Name', status: 'Present', photo: placeholderImage},
                        {id: 2, name: 'Student Name', status: 'Present', photo: placeholderImage},
                        {id: 3, name: 'Student Name', status: 'Absent', photo: placeholderImage},
                        {id: 4, name: 'Student Name', status: 'Present', photo: placeholderImage},
                        {id: 5, name: 'Student Name', status: 'Present', photo: placeholderImage},
                        {id: 6, name: 'Student Name', status: 'Absent', photo: placeholderImage},
                        {id: 7, name: 'Student Name', status: 'Present', photo: placeholderImage},
                        {id: 8, name: 'Student Name', status: 'Present', photo: placeholderImage},
                        {id: 9, name: 'Student Name', status: 'Absent', photo: placeholderImage},
                        {id: 10, name: 'Student Name', status: 'Absent', photo: placeholderImage},
                    ]
                };
                setSummary({
                    totalStudents: sampleData.totalStudents,
                    presentStudents: sampleData.presentStudents,
                    absentStudents: sampleData.absentStudents
                });
                setStudents(sampleData.students);
            } catch (err) {
                setError('Failed to load attendance data.');
            } finally {
                setLoading(false);
            }
        };
        fetchAttendanceData();
    }, [grade, className, date]);

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
                <Text style={styles.headerTitle}>Students Today Attendance</Text>
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
                            data={[
                                {label: 'Grade - 10', value: 'Grade - 10'},
                                {label: 'Grade - 11', value: 'Grade - 11'},
                                {label: 'Grade - 12', value: 'Grade - 12'},
                                {label: 'Grade - 13', value: 'Grade - 13'},
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
                                {label: 'Class - A', value: 'Class - A'},
                                {label: 'Class - B', value: 'Class - B'},
                                {label: 'Class - C', value: 'Class - C'},
                                {label: 'Class - D', value: 'Class - D'},
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
            <View style={styles.filterRow}>
                <View style={styles.filterItem}>
                    <Text style={styles.label}>Date</Text>
                    <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                        <Text style={styles.filterText}>{formatDate(date)} 📅</Text>
                    </TouchableOpacity>
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

            {/* Search Button */}
            <TouchableOpacity style={styles.searchButton} onPress={() => {
            }}>
                <Text style={styles.searchButtonText}>Search</Text>
            </TouchableOpacity>

            {/* Summary */}
            <View style={styles.summaryContainer}>
                <Text style={styles.summaryTitle}>Today's Attendance Summary</Text>
                <View style={styles.flex}>
                    <Text>The total number of students in this class in this grade </Text>
                    <Text>{summary.totalStudents}</Text>
                </View>
                <View style={styles.flex}>
                    <Text>The total number of students in this class today </Text>
                    <Text>{summary.presentStudents}</Text>
                </View>
                <View style={styles.flex}>
                    <Text>Total number of students absent from this class today </Text>
                    <Text>{summary.absentStudents}</Text>
                </View>


            </View>

            {/* Student List */}
            <View style={styles.studentListContainer}>
                <Text style={styles.studentListTitle}>Today's Attendance Students</Text>
                <FlatList
                    data={students}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({item}) => (
                        <View
                            style={[styles.studentItem, item.status === 'Absent' ? styles.absentBg : styles.presentBg]}>
                            <Image source={item.photo} style={styles.studentPhoto}/>
                            <Text style={styles.studentName}>{item.name}</Text>
                            <Text
                                style={[styles.statusText, item.status === 'Absent' ? styles.absentText : styles.presentText]}>
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
    headerTitle: {textAlign: "center", fontSize: 20, fontWeight: 'bold', color: '#333'},
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
    flex:{gap:5, display:"flex",flexDirection:"row", justifyContent:"space-around", marginBottom:10}
});
