import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

// Placeholder image (replace with actual image source from backend)
const placeholderImage = require('@/assets/images/character.png'); // Update with your asset path

export default function StudentsReportScreen() {
    const router = useRouter();
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch data from backend
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                // Replace with your actual API endpoint
                // const response = await fetch('your-backend-api-endpoint');
                // const data = await response.json();
                // setStudents(data.students || []);
                setStudents([
                    { photo: placeholderImage, name: 'Student Name', rank: 1, trend: 'up' },
                    { photo: placeholderImage, name: 'Student Name', rank: 2, trend: 'down' },
                    { photo: placeholderImage, name: 'Student Name', rank: 3, trend: 'up' },
                    { photo: placeholderImage, name: 'Student Name', rank: 3, trend: 'stable' },
                    { photo: placeholderImage, name: 'Student Name', rank: 5, trend: 'up' },
                    { photo: placeholderImage, name: 'Student Name', rank: 6, trend: 'up' },
                    { photo: placeholderImage, name: 'Student Name', rank: 7, trend: 'down' },
                    { photo: placeholderImage, name: 'Student Name', rank: 8, trend: 'up' },
                    { photo: placeholderImage, name: 'Student Name', rank: 9, trend: 'up' },
                    { photo: placeholderImage, name: 'Student Name', rank: 10, trend: 'up' },
                    { photo: placeholderImage, name: 'Student Name', rank: 11, trend: 'up' },
                    { photo: placeholderImage, name: 'Student Name', rank: 12, trend: 'down' },
                    { photo: placeholderImage, name: 'Student Name', rank: 13, trend: 'up' },
                    { photo: placeholderImage, name: 'Student Name', rank: 13, trend: 'up' },
                    { photo: placeholderImage, name: 'Student Name', rank: 13, trend: 'up' },
                    { photo: placeholderImage, name: 'Student Name', rank: 16, trend: 'up' },
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
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Students Report</Text>
                <Ionicons name="notifications-outline" size={24} color="black" />
            </View>

            <Text style={styles.instructionText}>
                Please click on the student to see full report.
            </Text>

            <View style={styles.tableHeader}>
                <Text style={styles.tableHeaderText}>Photo</Text>
                <Text style={styles.tableHeaderText}>Name</Text>
                <Text style={styles.tableHeaderText}>Rank in class</Text>
            </View>

            <FlatList
                data={students}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.studentItem}>
                        <Image source={item.photo} style={styles.studentPhoto} />
                        <Text style={styles.studentName}>{item.name}</Text>
                        <Text style={styles.studentRank}>
                            {item.rank}
                            {item.trend === 'up' && <Text style={styles.trendUp}>▲</Text>}
                            {item.trend === 'down' && <Text style={styles.trendDown}>▼</Text>}
                            {item.trend === 'stable' && <Text style={styles.trendStable}>■</Text>}
                        </Text>
                    </TouchableOpacity>
                )}
            />

            <TouchableOpacity style={styles.downloadButton}>
                <Text style={styles.downloadButtonText}>Download Report</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F6F9FC', padding: 20 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    headerTitle: { fontSize: 18, fontWeight: '600' },
    instructionText: { fontSize: 12, color: '#777', marginBottom: 10 },
    tableHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
    tableHeaderText: { fontSize: 14, fontWeight: 'bold', color: '#555' },
    studentItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    studentPhoto: { width: 40, height: 40, marginRight: 10 },
    studentName: { fontSize: 14, flex: 1 },
    studentRank: { fontSize: 14, fontWeight: 'bold' },
    trendUp: { color: '#32CD32' }, // Green for up
    trendDown: { color: '#FF4500' }, // Red for down
    trendStable: { color: '#800080' }, // Purple for stable
    downloadButton: { backgroundColor: '#445669', padding: 15, borderRadius: 5, alignItems: 'center', marginTop: 20 },
    downloadButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
    errorText: { textAlign: 'center', fontSize: 16, color: 'red' },
});
