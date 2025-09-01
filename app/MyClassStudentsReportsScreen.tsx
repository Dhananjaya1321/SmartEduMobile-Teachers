import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Animated} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {useRouter} from 'expo-router';
import ScrollView = Animated.ScrollView;
import StudentsReportScreen from "@/app/StudentsReportScreen";

export default function MyClassStudentsReportsScreen() {
    const router = useRouter();
    const [grade, setGrade] = useState('Grade - 10');
    const [className, setClassName] = useState('Class - A');
    const [year, setYear] = useState('2021');
    const [totalStudents, setTotalStudents] = useState(0);
    const [exams, setExams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch data from backend
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                // Replace with your actual API endpoint
                // const response = await fetch('your-backend-api-endpoint?grade=Grade-10&class=Class-A');
                // const data = await response.json();
                // setTotalStudents(data.totalStudents);
                // setExams(data.exams || []);
                setTotalStudents(40);
                setExams([
                    {title: 'Final Term Exam', released: false, message: 'Results not released, check and release'},
                    {title: 'Mid-Term Exam', released: true, message: 'this results is released.'},
                    {title: 'First Term Exam', released: true, message: 'this results is released.'},
                ]);
            } catch (err) {
                setError('Failed to load data. Please try again.');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

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

    const handleReportReleaseAndStudentReport = (item) => {
        if (item.released) {
            router.push({
                pathname: '/StudentsReportScreen',
                params: {title: item.title},
            });
        } else {
            router.push({
                pathname: '/TermExamResultsReleaseScreen',
                params: {title: item.title},
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
            </View>

            <View style={styles.totalClassesView}>
                <Text style={styles.totalStudentsText}>
                    The total number of students
                </Text>
                <Text style={styles.totalStudents}>{totalStudents}</Text>
            </View>
            <Text style={styles.clickText}>Please click to see more details.</Text>

            <FlatList
                data={exams}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({item}) => (
                    <TouchableOpacity
                        style={[styles.examItem, item.released ? styles.released : styles.notReleased]}
                        onPress={() => handleReportReleaseAndStudentReport(item)}
                    >
                        <Text style={styles.examTitle}>{item.title}</Text>
                        <Text style={styles.examMessage}>{item.message}</Text>
                    </TouchableOpacity>
                )}
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
        backgroundColor: '#e00000', // Red for not released
    },
    examTitle: {fontSize: 16, fontWeight: 'bold', color: '#fff'},
    examMessage: {fontSize: 12, color: '#fff', marginTop: 5},
    errorText: {textAlign: 'center', fontSize: 16, color: 'red'},
    totalClassesView: {
        display: "flex", flexDirection: "row", justifyContent: "space-between",
        marginBottom: 10, alignItems: "center",
    },
});
