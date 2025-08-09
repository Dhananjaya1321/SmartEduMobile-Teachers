import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function ManageHomeworkScreen() {
    const router = useRouter();
    const [totalClasses, setTotalClasses] = useState(0);
    const [classes, setClasses] = useState([]);
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
                // setTotalClasses(data.totalClasses);
                // setClasses(data.classes);
                setTotalClasses(11);
                setClasses([
                    { grade: '10', class: 'A', subject: 'Science' },
                    { grade: '10', class: 'B', subject: 'Science' },
                    { grade: '10', class: 'C', subject: 'Science' },
                    { grade: '11', class: 'A', subject: 'Science' },
                    { grade: '11', class: 'D', subject: 'Science' },
                    { grade: '12', class: 'A', subject: 'Bio Art' },
                    { grade: '12', class: 'E', subject: 'Bio Art' },
                    { grade: '13', class: 'F', subject: 'Bio' },
                ]);
            } catch (err) {
                setError('Failed to load data. Please try again.');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleClassPress = (item) => {
        router.push({
            pathname: '/AddHomeworkScreen',
            params: { grade: item.grade, class: item.class, subject: item.subject, year: '2021' },
        });
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
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Manage Homework</Text>
                <Ionicons name="notifications-outline" size={24} color="black" />
            </View>

            <Text style={styles.yearText}>Year</Text>
            <View style={styles.yearBox}>
                <Text style={styles.year}>2021</Text>
            </View>

            <View style={styles.totalClassesView}>
                <Text style={styles.totalClassesText}>Total number of classes teach</Text>
                <Text style={styles.totalClasses}>{totalClasses}</Text>
            </View>


            <Text style={styles.clickText}>Click on the class to add homework.</Text>

            <FlatList
                data={classes}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.classItem}
                        onPress={() => handleClassPress(item)}
                    >
                        <Text style={styles.gradeText}>Grade {item.grade}-{item.class}</Text>
                        <Text style={styles.subjectText}>{item.subject}</Text>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F6F9FC', padding: 20 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    headerTitle: { fontSize: 18, fontWeight: '600' },
    yearText: { fontSize: 14, color: '#555', marginBottom: 5 },
    yearBox: { backgroundColor: '#E0E0E0', borderRadius: 5, padding: 10, marginBottom: 20 },
    year: { fontSize: 16, fontWeight: 'bold', textAlign: 'center' },
    totalClassesText: { fontSize: 14, color: '#555', marginBottom: 5 },
    totalClasses: { fontSize: 16, fontWeight: 'bold', marginBottom: 10 },
    clickText: { fontSize: 12, color: '#777', marginBottom: 15 },
    classItem: {
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
    totalClassesView: { display:"flex", flexDirection:"row", justifyContent:"space-between", marginBottom:10, alignItems:"center" },
    gradeText: { fontSize: 14 },
    classText: { fontSize: 14 },
    subjectText: { fontSize: 14 },
    errorText: { textAlign: 'center', fontSize: 16, color: 'red' },
});
