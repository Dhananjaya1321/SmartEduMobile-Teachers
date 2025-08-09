import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const teacherName = "Teacher’s Name";

const features = [
    { label: 'Attendance', image: require('@/assets/images/attendance.png'), route: '/AttendanceScreen' },
    { label: 'Timetable', image: require('@/assets/images/timetable.png'), route: '/TimetableScreen' },
    { label: 'Students', image: require('@/assets/images/students.png') },
    { label: 'Exams', image: require('@/assets/images/exams.png') },
    { label: 'Results', image: require('@/assets/images/results.png') },
    { label: 'Homework', image: require('@/assets/images/homework.png') },
    { label: 'Events', image: require('@/assets/images/events.png') },
];

function formatData(data, numColumns) {
    const numberOfFullRows = Math.floor(data.length / numColumns);
    let numberOfElementsLastRow = data.length - numberOfFullRows * numColumns;
    while (numberOfElementsLastRow !== 0 && numberOfElementsLastRow !== numColumns) {
        data.push({ label: `blank-${numberOfElementsLastRow}`, empty: true });
        numberOfElementsLastRow++;
    }
    return data;
}

export default function HomeScreen() {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View>
                    <Text style={styles.helloText}>Hello</Text>
                    <Text style={styles.teacherName}>{teacherName}</Text>
                </View>
                <Ionicons name="menu" size={24} color="black" />
            </View>

            <Text style={styles.sectionTitle}>Academics</Text>

            <FlatList
                data={formatData(features, 3)}
                keyExtractor={(item, index) => index.toString()}
                numColumns={3}
                renderItem={({ item }) => {
                    if (item.empty) {
                        return <View style={[styles.card, styles.invisibleCard]} />;
                    }
                    return (
                        <TouchableOpacity
                            style={styles.card}
                            onPress={() => item.route && router.push(item.route)}
                        >
                            <Image source={item.image} style={styles.cardImage} />
                            <Text style={styles.cardText}>{item.label}</Text>
                        </TouchableOpacity>
                    );
                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F6F9FC', paddingTop: 50, paddingHorizontal: 20 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    helloText: { fontSize: 14, color: '#555' },
    teacherName: { fontSize: 20, fontWeight: 'bold' },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', marginVertical: 20 },
    grid: { gap: 10 },
    card: { flex: 1, margin: 5, height: 150, borderRadius: 10, backgroundColor: '#fff',
        alignItems: 'center', justifyContent: 'center', shadowColor: '#000',
        shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
    cardImage: { height: 60, width: 60, resizeMode: 'contain', marginBottom: 8 },
    cardText: { fontSize: 12, textAlign: 'center' },
    invisibleCard: { backgroundColor: 'transparent', elevation: 0, shadowOpacity: 0 }
});
