import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Animated} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {useRouter} from 'expo-router';
import ScrollView = Animated.ScrollView;
import studentAPIController from "@/controllers/StudentController";
import examAPIController from "@/controllers/ExamController";

export default function MyClassStudentsReportsScreen() {
    const router = useRouter();
    const [exams, setExams] = useState<any[]>([]);
    const [grade, setGrade] = useState('');
    const [examData, setExamData] = useState();
    const [className, setClassName] = useState('');
    const [students, setStudents] = useState<any[]>([]);
    const [totalStudents, setTotalStudents] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [year, setYear] = useState(new Date().getFullYear());

    // Fetch students
    const fetchStudentsData = async () => {
        try {
            setLoading(true);
            const response = await studentAPIController.findMyClassAllStudents();
            setGrade(response[0].gradeName);
            setClassName(response[0].className);
            setTotalStudents(response.length);
            setStudents(response);
        } catch (err) {
            console.error(err);
            setError('Failed to load students data.');
        } finally {
            setLoading(false);
        }
    };

    // Fetch exams
    const fetchExamsData = async () => {
        try {
            setLoading(true);
            const response = await examAPIController.getAllTermExamsMyClass(students[0].gradeId, year);
            setExamData(response)

            // Exams backend gives
            const backendExams = response || [];

            // We always need exactly these 3 terms
            const allExams = ["Final Term Exam", "Mid-Term Exam", "First Term Exam"];

            const mappedExams = allExams.map(title => {
                const found = backendExams.find((ex: any) => ex.examName === title);
                if (found) {
                    return {
                        title: found.examName,
                        status: found.examsResultsStatus, // RELEASED | PENDING
                        timetable: found.timetable,
                        disabled: false,
                    };
                } else {
                    return {
                        title,
                        status: "NOT_SCHEDULED",
                        timetable: [],
                        disabled: true,
                    };
                }
            });

            setExams(mappedExams);
        } catch (err) {
            console.error(err);
            setError('Failed to load exams data.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStudentsData();
    }, []);

    useEffect(() => {
        if (students.length > 0) {
            fetchExamsData();
        }
    }, [students, year]);

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#0000ff"/>
            </View>
        );
    }

    const handleExamClick = (item: any) => {
        if (item.disabled) return; // ignore clicks on not scheduled

        // Find the clicked exam's full data from examData
        const selectedExam = examData?.find((ex: any) => ex.examName === item.title);

        if (!selectedExam) {
            console.warn("Exam data not found for:", item.title);
            return;
        }

        if (item.status === "PENDING") {
            // Go to TermExamResultsReleaseScreen
            router.push({
                pathname: "/TermExamResultsReleaseScreen",
                params: {
                    id: selectedExam.id,
                    examName: selectedExam.examName,
                    institutionId: selectedExam.institutionId,
                    grade: selectedExam.grade,
                    year: selectedExam.year,
                    title: item.title,
                    status: item.status,
                    timetable: JSON.stringify(selectedExam.timetable),
                },
            });
        } else if (item.status === "RELEASED") {
            // Go to StudentsReportScreen
            router.push({
                pathname: "/StudentsReportScreen",
                params: {
                    id: selectedExam.id,
                    examName: selectedExam.examName,
                    institutionId: selectedExam.institutionId,
                    grade: selectedExam.grade,
                    year: selectedExam.year,
                    title: item.title,
                    status: item.status,
                    timetable: JSON.stringify(selectedExam.timetable),
                },
            });
        }
    };


    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="black"/>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>My Class Students</Text>
                <Ionicons name="notifications-outline" size={24} color="black"/>
            </View>

            <View style={styles.infoRow}>
                <View style={styles.infoBox}>
                    <Text style={styles.infoLabel}>Current Grade</Text>
                    <View style={styles.infoValueBox}>
                        <Text style={styles.infoValue}>Grade - {grade}</Text>
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
            </View>

            <View style={styles.totalClassesView}>
                <Text style={styles.totalStudentsText}>The total number of students</Text>
                <Text style={styles.totalStudents}>{totalStudents}</Text>
            </View>
            <Text style={styles.clickText}>Please click to see more details.</Text>

            <FlatList
                data={exams}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({item}) => {
                    let bgStyle = styles.disabledExam;
                    if (!item.disabled) {
                        bgStyle =
                            item.status === "RELEASED"
                                ? styles.released
                                : styles.notReleased;
                    }

                    return (
                        <TouchableOpacity
                            style={[styles.examItem, bgStyle]}
                            disabled={item.disabled}
                            onPress={() => handleExamClick(item)}
                        >
                            <Text style={styles.examTitle}>{item.title}</Text>
                            <Text style={styles.examMessage}>
                                {item.disabled
                                    ? "Exam not scheduled"
                                    : item.status === "RELEASED"
                                        ? "Results Released"
                                        : "Results Pending"}
                            </Text>
                        </TouchableOpacity>
                    );
                }}
            />
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
    totalStudentsText: {fontSize: 14, color: '#777', marginBottom: 5, paddingRight: 50},
    totalStudents: {fontSize: 16, fontWeight: 'bold', marginBottom: 15},
    clickText: {fontSize: 12, color: '#777', marginBottom: 15},
    examItem: {
        padding: 15,
        borderRadius: 5,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    released: {
        backgroundColor: '#32CD32', // Green for released
    },
    notReleased: {
        backgroundColor: '#e00000', // Red for pending
    },
    disabledExam: {
        backgroundColor: '#A9A9A9', // Gray for not scheduled
    },
    examTitle: {fontSize: 16, fontWeight: 'bold', color: '#fff'},
    examMessage: {fontSize: 12, color: '#fff', marginTop: 5},
    totalClassesView: {
        display: "flex", flexDirection: "row", justifyContent: "space-between",
        marginBottom: 10, alignItems: "center",
    },
});
