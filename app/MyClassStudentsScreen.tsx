import React, { useState, useEffect } from 'react';
import {View, Text, StyleSheet, FlatList, TouchableOpacity, Image, ActivityIndicator, ScrollView} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';
import Animated from 'react-native-reanimated';


// Placeholder image
const placeholderImage = require('@/assets/images/character.png');

export default function MyClassStudentsScreen() {
    const navigation = useNavigation();
    const [grade, setGrade] = useState('Grade - 10');
    const [className, setClassName] = useState('Class - A');
    const [year, setYear] = useState('2021');
    const [students, setStudents] = useState([]);
    const [totalStudents, setTotalStudents] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchStudentsData = async () => {
            try {
                setLoading(true);
                // Replace with actual API call
                // const response = await fetch(`your-backend-api/students?grade=${grade}&class=${className}&year=${year}`);
                // const data = await response.json();
                const sampleData = {
                    totalStudents: 40,
                    students: [
                        { id: 1, name: 'Student Name', studentNo: '5082055', photo: placeholderImage },
                        { id: 2, name: 'Student Name', studentNo: '5082055', photo: placeholderImage },
                        { id: 3, name: 'Student Name', studentNo: '5082055', photo: placeholderImage },
                        { id: 4, name: 'Student Name', studentNo: '5082055', photo: placeholderImage },
                        { id: 5, name: 'Student Name', studentNo: '5082055', photo: placeholderImage },
                        { id: 6, name: 'Student Name', studentNo: '5082055', photo: placeholderImage },
                        { id: 7, name: 'Student Name', studentNo: '5082055', photo: placeholderImage },
                        { id: 8, name: 'Student Name', studentNo: '5082055', photo: placeholderImage },
                        { id: 9, name: 'Student Name', studentNo: '5082055', photo: placeholderImage },
                        { id: 10, name: 'Student Name', studentNo: '5082055', photo: placeholderImage },
                    ]
                };
                setTotalStudents(sampleData.totalStudents);
                setStudents(sampleData.students);
            } catch (err) {
                setError('Failed to load students data.');
            } finally {
                setLoading(false);
            }
        };
        fetchStudentsData();
    }, [grade, className, year]);

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
                    The total number of students in this class in this grade
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
                        <Image source={item.photo} style={styles.studentPhoto} />
                        <Text style={styles.studentName}>{item.name}</Text>
                        <Text style={styles.studentNo}>{item.studentNo}</Text>
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
    studentNo: { fontSize: 14, color: '#444' },
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
