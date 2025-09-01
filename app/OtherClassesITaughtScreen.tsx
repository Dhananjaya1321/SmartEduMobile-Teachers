import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
    Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import gradeAPIController from '@/controllers/GradesController';

// Use Animated ScrollView alias
const ScrollView = Animated.ScrollView;

export default function OtherClassesITaughtScreen() {
    const router = useRouter();
    const [totalClasses, setTotalClasses] = useState(0);
    const [classes, setClasses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [year] = useState(new Date().getFullYear());

    // Fetch data from backend
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await gradeAPIController.getAllGradesITeach();

                if (!response || !response.data) {
                    setError('Failed to load data.');
                    return;
                }

                let count = 0;
                response.data.forEach((grade: any) => {
                    count += grade.classRooms?.length || 0;
                });

                setTotalClasses(count);
                setClasses(response.data);
            } catch (err) {
                setError('Something went wrong while fetching data.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleClassPress = (grade: any, classRoom: any) => {
        router.push({
            pathname: '/OtherClassStudentsScreen',
            params: {
                gradeId: grade.id,
                grade: grade.gradeName,
                classId: classRoom.id,
                className: classRoom.className,
                year: year,
            },
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
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Classes I Teach</Text>
                <Ionicons name="notifications-outline" size={24} color="black" />
            </View>

            {/* Year */}
            <Text style={styles.yearText}>Year</Text>
            <View style={styles.yearBox}>
                <Text style={styles.year}>{year}</Text>
            </View>

            {/* Total Classes */}
            <View style={styles.totalClassesView}>
                <Text style={styles.totalClassesText}>Total number of classes teach</Text>
                <Text style={styles.totalClasses}>{totalClasses}</Text>
            </View>

            {/* Info */}
            <Text style={styles.clickText}>Please click on the class to see more details.</Text>

            {/* List of Classes */}
            <FlatList
                data={classes}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item: grade }) => (
                    <View>
                        <Text style={styles.gradeHeading}>Grade {grade.gradeName}</Text>
                        {grade.classRooms?.map((classRoom: any, idx: number) => (
                            <TouchableOpacity
                                key={idx}
                                style={styles.classItem}
                                onPress={() => handleClassPress(grade, classRoom)}
                            >
                                <Text style={styles.gradeText}>{classRoom.className}</Text>
                                <Text style={styles.subjectText}>
                                    {classRoom.classTeacherSubject?.length > 12
                                        ? classRoom.classTeacherSubject.substring(0, 12) + '...'
                                        : classRoom.classTeacherSubject || 'No Subject'}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
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
    totalClassesView: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10, alignItems: 'center' },
    gradeHeading: { fontSize: 16, fontWeight: '600', marginBottom: 8, marginTop: 10, color: '#333' },
    gradeText: { fontSize: 14, fontWeight: '500' },
    subjectText: { fontSize: 14, color: '#555' },
    errorText: { textAlign: 'center', fontSize: 16, color: 'red' },
});
