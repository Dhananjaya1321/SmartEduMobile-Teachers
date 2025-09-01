import React, { useState, useEffect } from 'react';
import {View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Animated} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {useLocalSearchParams, useRouter} from 'expo-router';
import ScrollView = Animated.ScrollView;

export default function TermExamResultsReleaseScreen() {
    const router = useRouter();
    const { examName } = useLocalSearchParams();
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch data from backend
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                // Replace with your actual API endpoint
                // const response = await fetch('your-backend-api-endpoint?exam=Final Term Exam Results');
                // const data = await response.json();
                // setSubjects(data.subjects || []);
                setSubjects([
                    { subject: 'Mathematics', teacher: 'A.S. Kamala', released: true },
                    { subject: 'Buddhism', teacher: 'A.S. Amal', released: true },
                    { subject: 'Sinhala', teacher: 'A.S. Sunil', released: false },
                    { subject: 'English', teacher: 'A.S. Saman', released: true },
                    { subject: 'History', teacher: 'A.S. Nisala', released: true },
                    { subject: 'Science', teacher: 'A.S. Gamage', released: true },
                    { subject: 'Commerce', teacher: 'A.S. Priyantha', released: true },
                    { subject: 'Geography', teacher: 'A.S. Abekon', released: true },
                    { subject: 'Music', teacher: 'A.S. Niola', released: true },
                ]);
            } catch (err) {
                setError('Failed to load data. Please try again.');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [examName]);

    // Check if all subjects are released
    const allReleased = subjects.every((item) => item.released);

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
                <Text style={styles.headerTitle}>{examName || 'Final Term Exam Results'}</Text>
                <Ionicons name="notifications-outline" size={24} color="black" />
            </View>

            <View style={styles.tableHeader}>
                <Text style={styles.tableHeaderText}>Subject</Text>
                <Text style={styles.tableHeaderText}>Teacher</Text>
                <Text style={styles.tableHeaderText}>Status</Text>
            </View>

            <FlatList
                data={subjects}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <View style={styles.subjectItem}>
                        <Text style={styles.subjectText}>{item.subject}</Text>
                        <Text style={styles.teacherText}>{item.teacher}</Text>
                        <Text style={[styles.statusText, item.released ? styles.released : styles.pending]}>
                            {item.released ? '✔' : 'Pending'}
                        </Text>
                    </View>
                )}
            />

            <TouchableOpacity
                style={[styles.releaseButton, !allReleased && styles.disabledButton]}
                disabled={!allReleased}
                onPress={() => {
                    if (allReleased) {
                        // Add your release and generate reports logic here
                        console.log('Releasing and generating reports...');
                    }
                }}
            >
                <Text style={styles.releaseButtonText}>Release and Generate Reports</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F6F9FC', paddingTop: 50, paddingHorizontal: 20 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 50 },
    headerTitle: { fontSize: 18, fontWeight: '600' },
    tableHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
    tableHeaderText: { fontSize: 14, fontWeight: 'bold', color: '#555' },
    subjectItem: {
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
    subjectText: { fontSize: 14, flex: 1 },
    teacherText: { fontSize: 14, flex: 1, textAlign: 'center' },
    statusText: { fontSize: 14, flex: 1, textAlign: 'right' },
    released: { color: '#32CD32' }, // Green for released
    pending: { color: '#FF69B4' }, // Pink for pending
    releaseButton: { backgroundColor: '#445669', padding: 15, borderRadius: 5, alignItems: 'center', marginTop: 20 },
    releaseButtonText: { color: '#ffffff', fontSize: 16, fontWeight: 'bold' },
    disabledButton: {
        backgroundColor: '#A9A9A9', // Lighter gray when disabled
        opacity: 0.6,
    },
    errorText: { textAlign: 'center', fontSize: 16, color: 'red' },
});
