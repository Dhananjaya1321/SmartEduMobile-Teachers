import React, { useState, useEffect } from 'react';
import {View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, ScrollView} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import gradeAPIController from "@/controllers/GradesController";

export default function ManageHomeworkScreen() {
    const router = useRouter();
    const [totalClasses, setTotalClasses] = useState(0);
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [year, setYear] = useState(new Date().getFullYear());

    // Fetch data from backend
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                // Replace with your actual API endpoint
                const response = await gradeAPIController.getAllGradesITeach();

                setTotalClasses(response.data.length);
                setClasses(response.data);
            } catch (err) {

            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleClassPress = (item) => {
        router.push({
            pathname: '/AddHomeworkScreen',
            params: { gradeId:item.id, grade: item.gradeName, classId:item.classRooms[0].id,class: item.classRooms[0].className,subjects: item.classRooms[0].classTeacherSubject, year: year },
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
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Classes I Teach</Text>
                <Ionicons name="notifications-outline" size={24} color="black" />
            </View>

            <Text style={styles.yearText}>Year</Text>
            <View style={styles.yearBox}>
                <Text style={styles.year}>{year}</Text>
            </View>

            <View style={styles.totalClassesView}>
                <Text style={styles.totalClassesText}>Total number of classes teach</Text>
                <Text style={styles.totalClasses}>{totalClasses}</Text>
            </View>


            <Text style={styles.clickText}>Please click on the class to see more details.</Text>

            <FlatList
                data={classes}
                keyExtractor={(item, index) => index.toString()}
                scrollEnabled={false}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.classItem}
                        onPress={() => handleClassPress(item)}
                    >
                        <Text style={styles.gradeText}>Grade {item.classRooms[0].className}</Text>
                        <Text style={styles.subjectText}>
                            {item.classRooms[0].classTeacherSubject.length > 12
                                ? item.classRooms[0].classTeacherSubject.substring(0, 12) + "..."
                                : item.classRooms[0].classTeacherSubject}
                        </Text>

                    </TouchableOpacity>
                )}
            />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F6F9FC', paddingTop: 50, paddingHorizontal: 20 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 50 },
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
