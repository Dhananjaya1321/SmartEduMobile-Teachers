import React, { useState, useEffect } from 'react';
import {View, Text, StyleSheet, FlatList, TouchableOpacity, Image, ActivityIndicator, ScrollView} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';
import Animated from 'react-native-reanimated';
import studentAPIController from "@/controllers/StudentController";


// Placeholder image
const placeholderImage = require('@/assets/images/character.png');

export default function MyClassStudentsScreen() {
    const navigation = useNavigation();
    const [grade, setGrade] = useState('');
    const [className, setClassName] = useState('');
    const [students, setStudents] = useState([]);
    const [totalStudents, setTotalStudents] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [year, setYear] = useState(new Date().getFullYear());

    useEffect(() => {
        const fetchStudentsData = async () => {
            try {
                setLoading(true);
                const response = await studentAPIController.findMyClassAllStudents();

                setGrade(response[0].gradeName)
                setClassName(response[0].className)
                setTotalStudents(response.length);
                setStudents(response);
            } catch (err) {
                setError('Failed to load students data.');
            } finally {
                setLoading(false);
            }
        };
        fetchStudentsData();
    }, [year]);

    const handleStudentPress = (studentId) => {
        // Navigate to student details screen
        console.log(`Navigating to details for student ID: ${studentId}`);
        // Replace with navigation logic, e.g., router.push(`/studentDetails/${studentId}`);
    };

    if (loading) {
        return <View style={styles.container}><ActivityIndicator size="large" color="#0000ff" /></View>;
    }

    if (error) {
        return <View style={styles.container}><Text style={styles.errorText}>{error}</Text></View>;
    }

    return (
        <ScrollView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>My Class Students</Text>
                <Ionicons name="notifications-outline" size={24} color="#333" />
            </View>

            {/* Filters */}
            <View style={styles.infoRow}>
                <View style={styles.infoBox}>
                    <Text style={styles.infoLabel}>Current Grade</Text>
                    <View style={styles.infoValueBox}>
                        <Text style={styles.infoValue}>Grade {grade}</Text>
                    </View>
                </View>
                <View style={styles.infoBox}>
                    <Text style={styles.infoLabel}>Current Class</Text>
                    <View style={styles.infoValueBox}>
                        <Text style={styles.infoValue}>{className}</Text>
                    </View>
                </View>
            </View>
            <View style={styles.filterRow}>
                <View style={styles.infoBox}>
                    <Text style={styles.infoLabel}>Year</Text>
                    <View style={styles.infoValueBox}>
                        <Text style={styles.infoValue}>{year}</Text>
                    </View>
                </View>
            </View>

            {/* Summary */}

            <View style={styles.totalClassesView}>
                <Text style={styles.totalStudentsText}>
                    The total students
                </Text>
                <Text style={styles.totalStudents}>{totalStudents}</Text>
            </View>
            <Text style={styles.clickText}>Please click on the student to see more details.</Text>




            {/* Student List */}
            <FlatList
                data={students}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => handleStudentPress(item.id)} style={styles.studentItem}>
                        <Image source={placeholderImage} style={styles.studentPhoto} />

                      <View style={{display:"flex",}}>
                          <Text style={styles.studentName}>{item.fullNameWithInitials}</Text>
                          <Text style={styles.studentNo}>{item.registrationNumber}</Text>
                      </View>
                    </TouchableOpacity>
                )}
                contentContainerStyle={styles.studentList}
            />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F6F9FC', paddingTop: 50, paddingHorizontal: 20 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 50 },
    headerTitle: { fontSize: 18, fontWeight: '600' },
    filterRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
    filterItem: { flex: 1, marginHorizontal: 5 },
    label: { fontSize: 16, color: '#444', marginBottom: 5 },
    filterText: { fontSize: 16, borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 5, textAlign: 'center' },
    summaryContainer: { marginBottom: 20, padding: 10, backgroundColor: '#fff', borderRadius: 5 },
    noteText: { fontSize: 12, color: '#666', textAlign: 'center' },
    studentList: { paddingBottom: 20 },
    studentItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        marginBottom: 10,
        backgroundColor: '#fff',
        borderRadius: 5,
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    studentPhoto: { width: 40, height: 40, borderRadius: 5, marginRight: 10 },
    studentName: { flex: 1, fontSize: 16, color: '#333' },
    studentNo: {marginTop:1,fontSize: 10, color: '#444' },
    errorText: { textAlign: 'center', fontSize: 16, color: 'red', marginTop: 20 },
    infoRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
    infoBox: { flex: 1, marginHorizontal: 5 },
    infoLabel: { fontSize: 14, color: '#555', marginBottom: 5 },
    infoValueBox: { backgroundColor: '#E0E0E0', borderRadius: 5, padding: 10 },
    infoValue: { fontSize: 16, fontWeight: 'bold', textAlign: 'center' },
    totalClassesView: {
        display:"flex",
        flexDirection:"row",
        justifyContent:"space-between",
        marginBottom:10,
        alignItems:"center"
    },
    totalStudentsText: { fontSize: 14, color: '#777', marginBottom: 5 },
    totalStudents: { fontSize: 16, fontWeight: 'bold', marginBottom: 15, paddingLeft:10 },
    clickText: { fontSize: 12, color: '#777', marginBottom: 15 },
});
