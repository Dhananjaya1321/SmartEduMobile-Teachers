import React, {useState, useEffect} from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Image,
    ActivityIndicator,
    ScrollView,
    Alert
} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {useNavigation, useRouter} from 'expo-router';
import {Dropdown} from "react-native-element-dropdown";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import gradeAPIController from "@/controllers/GradesController";
import studentAPIController from "@/controllers/StudentController";
import attendanceAPIController from "@/controllers/AttendanceController";

// Placeholder image
const placeholderImage = require('@/assets/images/character.png');

export default function MarkAttendanceScreen() {
    const router = useRouter();
    const navigation = useNavigation();

    const [date, setDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [grade, setGrade] = useState('Grade - 10');
    const [className, setClassName] = useState('Class - A');
    const [students, setStudents] = useState([]);
    const [attendance, setAttendance] = useState<Record<string, 'present' | 'absent'>>({}); // TypeScript type
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
            const response = await studentAPIController.findClassAllStudentsByClassId(classId);
            setStudents(response);
        } catch (err) {
            setError('Failed to load students.');
        } finally {
            setLoading(false);
        }
    };

    const toggleAttendance = (id: number, status: 'present' | 'absent') => {
        setAttendance((prev) => ({...prev, [id]: status}));
    };

    const totalStudents = students.length;
    const absentCount = Object.values(attendance).filter((s) => s === 'absent').length;
    const presentCount = Object.values(attendance).filter((s) => s === 'present').length;
    const allMarked = Object.keys(attendance).length === totalStudents;

    const handleSave = async () => {
        // Transform attendance map -> array
        const formattedAttendance = Object.entries(attendance).map(([studentId, status]) => ({
            studentId,
            status: status.toUpperCase(), // backend expects enum in UPPERCASE
        }));

        if (allMarked) {
            const payload = {
                date: date.toISOString().split("T")[0], // "2025-08-18"
                classId: selectedClass,
                attendance: formattedAttendance,
            };

            const response = await attendanceAPIController.saveAttendance(payload);
            if (response){
                Alert.alert("Attendance Saved!");
                setSelectedGrade(null)
                setSelectedClass(null);
                setStudents([]);

            }
        }

    };

    const onDateChange = (event: any, selectedDate?: Date) => {
        setShowDatePicker(false);
        if (selectedDate) {
            setDate(selectedDate);
        }
    };

    const formatDate = (date: Date) => {
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
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color="#333"/>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Mark Attendance</Text>
                <Ionicons name="notifications-outline" size={24} color="#333"/>
            </View>

            <Text style={styles.label}>Date</Text>
            <View style={styles.dateBox}>
                <RNDateTimePicker value={new Date()}/>
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

            <View style={styles.tableHeader}>
                <Text style={styles.tableHeaderText}>Student Name</Text>
                <Text style={styles.tableHeaderText}>Absent Present</Text>
            </View>

            <FlatList
                data={students}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({item}) => {
                    const status = attendance[item.id];
                    const isPresent = status === 'present';
                    const isAbsent = status === 'absent';
                    return (
                        <View
                            style={[styles.studentItem, isPresent ? styles.presentBg : isAbsent ? styles.absentBg : null]}>
                            <Image source={placeholderImage} style={styles.studentPhoto}/>
                            <Text style={styles.studentName}>{item.fullNameWithInitials}</Text>
                            <View style={styles.toggleContainer}>
                                <TouchableOpacity
                                    onPress={() => toggleAttendance(item.id, 'absent')}
                                    style={[styles.absentBtn, styles.toggleButton, isAbsent ? styles.selectedAbsent : null]}
                                >
                                    <Text style={[styles.absentBtnText, isAbsent ? styles.selectedText : null]}>O</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => toggleAttendance(item.id, 'present')}
                                    style={[styles.presentBtn, styles.toggleButton, isPresent ? styles.selectedPresent : null]}
                                >
                                    <Text
                                        style={[styles.presentBtnText, isPresent ? styles.selectedText : null]}>/</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    );
                }}
            />

            <View style={styles.totalsSection}>
                <View style={styles.totalRow}>
                    <Text style={styles.totalLabel}>Total Students Count</Text>
                    <Text style={styles.totalValue}>{totalStudents}</Text>
                </View>
                <View style={styles.totalRow}>
                    <Text style={styles.totalLabel}>Absent Students Count</Text>
                    <Text style={styles.totalValue}>{absentCount}</Text>
                </View>
                <View style={styles.totalRow}>
                    <Text style={styles.totalLabel}>Present Students Count</Text>
                    <Text style={styles.totalValue}>{presentCount}</Text>
                </View>
            </View>

            <TouchableOpacity
                style={[styles.saveButton, !allMarked ? styles.disabledButton : null]}
                disabled={!allMarked}
                onPress={handleSave}
            >
                <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {flex: 1, backgroundColor: '#F6F9FC', paddingTop: 50, paddingHorizontal: 20},
    header: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 50},
    headerTitle: {fontSize: 18, fontWeight: '600'},
    label: {fontSize: 16, color: '#444', marginBottom: 8},
    dateBox: {
        display: "flex",
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
    dateText: {fontSize: 16, color: '#333'},
    datePicker: {width: '100%', backgroundColor: '#fff'},
    gradeClassRow: {flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20},
    gradeBox: {flex: 1, marginRight: 10},
    classBox: {flex: 1},
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
    placeholderStyle: {fontSize: 16, color: '#888'},
    selectedTextStyle: {fontSize: 16, color: '#333'},
    iconStyle: {width: 20, height: 20},
    icon: {marginRight: 8},
    tableHeader: {flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10, paddingHorizontal: 5},
    tableHeaderText: {fontSize: 16, fontWeight: '600', color: '#444'},
    studentItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderRadius: 8,
        marginBottom: 10,
        backgroundColor: '#fff',
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,

    },
    presentBg: {backgroundColor: '#E6F3E6'},
    absentBg: {backgroundColor: '#F9E4E6'},
    presentBtn: {
        borderRadius: 5,
        backgroundColor: '#C4FFD7',
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    absentBtn: {
        borderRadius: 5,
        backgroundColor: '#FFCDCA',
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    absentBtnText: {color: '#FF0000', fontSize: 18},
    presentBtnText: {color: '#00DC30', fontSize: 18},
    studentPhoto: {width: 40, height: 40, borderRadius: 5, marginRight: 10},
    studentName: {flex: 1, fontSize: 16, color: '#333'},
    toggleContainer: {flexDirection: 'row', alignItems: 'center'},
    toggleButton: {marginLeft: 10},
    selectedAbsent: {backgroundColor: '#FF9999'},
    selectedPresent: {backgroundColor: '#99FF99'},
    selectedText: {fontWeight: 'bold'},
    totalsSection: {
        marginTop: 20,
        marginBottom: 20,
        padding: 15,
        backgroundColor: '#fff',
        borderRadius: 8,
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4
    },
    totalRow: {flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10},
    totalLabel: {fontSize: 16, color: '#555'},
    totalValue: {fontSize: 16, fontWeight: 'bold', color: '#333'},
    saveButton: {
        backgroundColor: '#4A90E2',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 20
    },
    saveButtonText: {color: '#fff', fontSize: 18, fontWeight: 'bold'},
    disabledButton: {backgroundColor: '#A9A9A9', opacity: 0.6},
    errorText: {textAlign: 'center', fontSize: 16, color: 'red', marginTop: 20},
});
