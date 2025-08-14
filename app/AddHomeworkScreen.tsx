import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';

export default function AddHomeworkScreen() {
    const { grade, class: className, subject, year } = useLocalSearchParams();
    const [totalHomework, setTotalHomework] = useState(0);
    const [homeworkList, setHomeworkList] = useState([]);

    useEffect(() => {
        setTotalHomework(3);
        setHomeworkList([
            { id: 1, title: 'Homework 1' },
            { id: 2, title: 'Homework 2' },
            { id: 3, title: 'Homework 3' },
        ]);
    }, [grade, className, subject]);

    const renderHeader = () => (
        <View>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Add Homework</Text>
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
                <Text style={styles.totalHomeworkText}>
                    The total number of homework you have added for this class
                </Text>
                <Text style={styles.totalHomework}>{totalHomework}</Text>
            </View>

            <TouchableOpacity style={styles.addButton}>
                <Text style={styles.addButtonText}>Add New Homework</Text>
            </TouchableOpacity>

            <Text style={styles.homeworkLabel}>Homework you added.</Text>
        </View>
    );

    return (
        <FlatList
            style={styles.container}
            data={homeworkList}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
                <View style={styles.homeworkItem}>
                    <Text style={styles.homeworkText}>{item.title}</Text>
                </View>
            )}
            ListHeaderComponent={renderHeader}
            contentContainerStyle={styles.homeworkList}
            showsVerticalScrollIndicator={false}
        />
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
    totalHomeworkText: { fontSize: 14, color: '#777', marginBottom: 5 },
    totalHomework: { fontSize: 16, fontWeight: 'bold', marginBottom: 15 },
    addButton: { backgroundColor: '#E0E0E0', padding: 10, borderRadius: 5, marginBottom: 15, flexDirection: 'row', justifyContent: 'space-between' },
    addButtonText: { fontSize: 14, fontWeight: 'bold' },
    homeworkLabel: { fontSize: 14, color: '#555', marginBottom: 10 },
    homeworkList: { paddingBottom: 20 },
    homeworkItem: { backgroundColor: '#D3D3D3', height: 150, borderRadius: 5, marginBottom: 10, justifyContent: 'center', alignItems: 'center' },
    homeworkText: { fontSize: 16, color: '#fff' },
    totalClassesView: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10, alignItems: 'center' },
});
