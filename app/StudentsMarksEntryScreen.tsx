import React, { useState, useEffect } from 'react';
import {View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, TextInput, Animated} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {useLocalSearchParams, useRouter} from 'expo-router';
import ScrollView = Animated.ScrollView;

export default function StudentsReportScreen() {
    const router = useRouter();
    const { grade, class: className, subject, year } = useLocalSearchParams();
    const [totalStudents, setTotalStudents] = useState(0);
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch data from backend
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                // Replace with your actual API endpoint
                // const response = await fetch(`your-backend-api-endpoint?grade=${grade}&class=${className}&subject=${subject}`);
                // const data = await response.json();
                // setTotalStudents(data.totalStudents);
                // setStudents(data.students || []);
                setTotalStudents(40);
                setStudents([
                    { name: 'Student Name', index: '5050', marks: '' },
                    { name: 'Student Name', index: '5050', marks: '' },
                    { name: 'Student Name', index: '5050', marks: '' },
                    { name: 'Student Name', index: '5050', marks: '' },
                    { name: 'Student Name', index: '5050', marks: '' },
                    { name: 'Student Name', index: '5050', marks: '' },
                    { name: 'Student Name', index: '5050', marks: '' },
                    { name: 'Student Name', index: '5050', marks: '' },
                    { name: 'Student Name', index: '5050', marks: '' },
                    { name: 'Student Name', index: '5050', marks: '' },
                    { name: 'Student Name', index: '5050', marks: '' },
                    { name: 'Student Name', index: '5050', marks: '' },
                    { name: 'Student Name', index: '5050', marks: '' },
                    { name: 'Student Name', index: '5050', marks: '' },
                    { name: 'Student Name', index: '5050', marks: '' },
                    { name: 'Student Name', index: '5050', marks: '' },
                ]);
            } catch (err) {
                setError('Failed to load data. Please try again.');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [grade, className, subject]);

    const handleMarksChange = (text, index) => {
        const updatedStudents = [...students];
        updatedStudents[index].marks = text;
        setStudents(updatedStudents);
    };

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#0000ff" />
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
                    <Ionicons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Students Report</Text>
                <Ionicons name="notifications-outline" size={24} color="black" />
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
                    <View style={styles.infoValueBox}>
                        <Text style={styles.infoValue}>{subject}</Text>
                    </View>
                </View>
            </View>


            <View style={styles.totalClassesView}>
                <Text style={styles.totalStudentsText}>
                    The total number of students in this class in this grade
                </Text>
                <Text style={styles.totalStudents}>{totalStudents}</Text>
            </View>

            <Text style={styles.clickText}>Please click and enter student marks.</Text>

            <FlatList
                data={students}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item, index }) => (
                    <View style={styles.studentItem}>
                        <View style={styles.studentInfo}>
                            <Text style={styles.studentName}>{item.name}</Text>
                            <Text style={styles.studentIndex}>Index number - {item.index}</Text>
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

            <TouchableOpacity style={styles.releaseButton}>
                <Text style={styles.releaseButtonText}>Release Marks</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F6F9FC', paddingTop: 50, paddingHorizontal: 20 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 50 },
    headerTitle: { fontSize: 18, fontWeight: '600' },
    infoRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
    infoBox: { flex: 1, marginHorizontal: 5 },
    infoLabel: { fontSize: 14, color: '#555', marginBottom: 5 },
    infoValueBox: { backgroundColor: '#E0E0E0', borderRadius: 5, padding: 10 },
    infoValue: { fontSize: 16, fontWeight: 'bold', textAlign: 'center' },
    totalStudentsText: { fontSize: 14, color: '#777', marginBottom: 5 },
    totalStudents: { fontSize: 16, fontWeight: 'bold',},
    clickText: { fontSize: 12, color: '#777', marginBottom: 15 },
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
    studentInfo: { flex: 1 },
    studentName: { fontSize: 14 },
    studentIndex: { fontSize: 12, color: '#777' },
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
    releaseButton: { backgroundColor: '#4682B4', padding: 15, borderRadius: 5, alignItems: 'center', marginTop: 20 },
    releaseButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
    errorText: { textAlign: 'center', fontSize: 16, color: 'red' },
    totalClassesView: { display:"flex", flexDirection:"row", justifyContent:"space-between", marginBottom:10, alignItems:"center" },
});
