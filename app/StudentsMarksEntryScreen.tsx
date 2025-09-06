import React, {useState, useEffect} from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
    TextInput,
    Animated,
} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {useLocalSearchParams, useRouter} from 'expo-router';
import {Dropdown} from "react-native-element-dropdown";
import examAPIController from "@/controllers/ExamController";
import studentAPIController from "@/controllers/StudentController";

const ScrollView = Animated.ScrollView;

export default function StudentsReportScreen() {
    const router = useRouter();
    const {subjects, gradeId, grade, classId, className, year} = useLocalSearchParams();
    const [students, setStudents] = useState<any[]>([]);
    const [totalStudents, setTotalStudents] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [exam, setExam] = useState<any>(null);
    const [subjectList, setSubjectList] = useState<{ label: string; value: string }[]>([]);
    const [selectedSubject, setSelectedSubject] = useState<string | null>(null);

    function getSubjects(subjects: string | string[]): { label: string; value: string }[] {
        if (!subjects || typeof subjects !== "string" || subjects.trim() === "") {
            return [];
        }
        return subjects.split(",").map(s => {
            const subject = s.trim();
            return {label: subject, value: subject};
        });
    }

    const handleSubjectSelect = (subject: string) => {
        setSelectedSubject(subject);
    };

    useEffect(() => {
        setSubjectList(getSubjects(subjects));
        checkExamResults();
    }, [grade, className, subjects]);

    const checkExamResults = async () => {
        try {
            const response = await examAPIController.checkExamResults(gradeId, year,classId);
            if (response === null) {
                // no exam yet
            } else {
                setExam(response);
                const studentsResponse = await studentAPIController.findClassAllStudentsByClassId(classId);
                const studentsWithMarks = studentsResponse.map((s: any) => ({
                    ...s,
                    marks: ""   // initialize marks empty
                }));
                setTotalStudents(studentsWithMarks.length);
                setStudents(studentsWithMarks);
            }
        } catch (err) {
            setError("Failed to load exam results");
        } finally {
            setLoading(false);
        }
    };

    const handleReleaseMarks = async () => {
        if (!exam || !selectedSubject) {
            alert("Please select subject and ensure exam exists");
            return;
        }

        const payload = {
            examId: exam.id,
            examName: exam.examName,
            subject: selectedSubject,
            year: year,
            gradeId: gradeId,
            classId: classId,
            students: students.map(s => ({
                studentId: s.id,
                studentName: s.fullNameWithInitials,
                marks: s.marks,
            }))
        };

        try {
            const response = await examAPIController.releaseMarks(payload);
            if (response) {
                alert("Marks released successfully!");
                router.back();
            } else {
                alert("Failed to release marks");
            }
        } catch (e) {
            alert("Error releasing marks");
        }
    };

    const handleMarksChange = (text: string, index: number) => {
        const updatedStudents = [...students];
        updatedStudents[index].marks = text;
        setStudents(updatedStudents);
    };

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#0000ff"/>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>{error}</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="black"/>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Students Report</Text>
                <Ionicons name="notifications-outline" size={24} color="black"/>
            </View>

            <View style={styles.infoRow}>
                <View style={styles.infoBox}>
                    <Text style={styles.infoLabel}>Current Grade</Text>
                    <View style={styles.infoValueBox}>
                        <Text style={styles.infoValue}>{grade}</Text>
                    </View>
                </View>
                <View style={styles.infoBox}>
                    <Text style={styles.infoLabel}>Current Class</Text>
                    <View style={styles.infoValueBox}>
                        <Text style={styles.infoValue}>{className}</Text>
                    </View>
                </View>
            </View>

            <View style={styles.infoRow}>
                <View style={styles.infoBox}>
                    <Text style={styles.infoLabel}>Year</Text>
                    <View style={styles.infoValueBox}>
                        <Text style={styles.infoValue}>{year}</Text>
                    </View>
                </View>
                <View style={styles.infoBox}>
                    <Text style={styles.infoLabel}>Subject</Text>
                    <View style={styles.inputBox}>
                        <Dropdown
                            style={styles.dropdown}
                            placeholderStyle={styles.placeholderStyle}
                            selectedTextStyle={styles.selectedTextStyle}
                            iconStyle={styles.iconStyle}
                            data={subjectList}
                            maxHeight={300}
                            labelField="label"
                            valueField="value"
                            value={selectedSubject}
                            onChange={(item) => handleSubjectSelect(item.value)}
                        />
                    </View>
                </View>
            </View>

            <View style={styles.totalClassesView}>
                <Text style={styles.totalStudentsText}>The total number of students</Text>
                <Text style={styles.totalStudents}>{totalStudents}</Text>
            </View>

            <Text style={styles.clickText}>Please click and enter student marks.</Text>

            <FlatList
                data={students}
                keyExtractor={(item, index) => index.toString()}
                scrollEnabled={false}
                renderItem={({item, index}) => (
                    <View style={styles.studentItem}>
                        <View>
                            <Text style={styles.studentName}>{item.fullNameWithInitials}</Text>
                            <Text style={styles.studentNo}>{item.registrationNumber}</Text>
                        </View>
                        <TextInput
                            style={styles.studentMarksInput}
                            value={item.marks}
                            onChangeText={(text) => handleMarksChange(text, index)}
                            keyboardType="numeric"
                            placeholder=""
                            maxLength={3}
                        />
                    </View>
                )}
            />

            <TouchableOpacity style={styles.releaseButton} onPress={handleReleaseMarks}>
                <Text style={styles.releaseButtonText}>Release Marks</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {flex: 1, backgroundColor: '#F6F9FC', paddingTop: 50, paddingHorizontal: 20},
    header: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 50},
    headerTitle: {fontSize: 18, fontWeight: '600'},
    infoRow: {flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20},
    infoBox: {flex: 1, marginHorizontal: 5},
    infoLabel: {fontSize: 14, color: '#555', marginBottom: 5},
    infoValueBox: {backgroundColor: '#E0E0E0', borderRadius: 5, padding: 10},
    infoValue: {fontSize: 16, fontWeight: 'bold', textAlign: 'center'},
    totalStudentsText: {fontSize: 14, color: '#777', marginBottom: 5},
    totalStudents: {fontSize: 16, fontWeight: 'bold'},
    clickText: {fontSize: 12, color: '#777', marginBottom: 15},
    studentItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    studentName: {fontSize: 14},
    studentNo: {marginTop: 1, fontSize: 10, color: '#444'},
    studentMarksInput: {
        width: 60,
        height: 40,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        textAlign: 'center',
        fontSize: 14,
        fontWeight: 'bold',
    },
    releaseButton: {backgroundColor: '#4682B4', padding: 15, borderRadius: 5, alignItems: 'center', marginTop: 20},
    releaseButtonText: {color: '#fff', fontSize: 16, fontWeight: 'bold'},
    errorText: {textAlign: 'center', fontSize: 16, color: 'red'},
    totalClassesView: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 10,
        alignItems: "center"
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
    placeholderStyle: {fontSize: 16, color: '#888'},
    selectedTextStyle: {fontSize: 16, color: '#333'},
    iconStyle: {width: 20, height: 20},
});
