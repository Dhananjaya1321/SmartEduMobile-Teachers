import React, { useState, useEffect } from 'react';
import {View, Text, StyleSheet, Image, ScrollView, FlatList, ActivityIndicator, TouchableOpacity} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';

// Placeholder image (replace with actual image source from backend)
const placeholderImage = require('@/assets/images/character.png'); // Update with your asset path

export default function StudentFullReportScreen() {
    const { name } = useLocalSearchParams();
    const router = useRouter();
    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch data from backend
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                // Replace with your actual API endpoint
                // const response = await fetch(`your-backend-api-endpoint?studentName=${name}`);
                // const data = await response.json();
                // setStudent(data.student || {});
                setStudent({
                    photo: placeholderImage,
                    name: name || 'Student Name',
                    ranks: {
                        classRank: 1,
                        schoolRank: 5,
                        zonalRank: 12,
                        provincialRank: 25,
                        islandRank: 50,
                    },
                    termResults: [
                        { term: '1st Term', mathematics: '85%', science: '78%', english: '90%' },
                        { term: '2nd Term', mathematics: '88%', science: '80%', english: '92%' },
                        { term: '3rd Term', mathematics: '90%', science: '82%', english: '95%' },
                    ],
                    progress: '88%',
                    attendance: '94%',
                    achievements: ['Top Scorer in Mathematics', 'Attendance Award', 'Science Project Winner'],
                });
            } catch (err) {
                setError('Failed to load data. Please try again.');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [name]);

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    if (error || !student) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>{error || 'Student data not found.'}</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Student Full Report</Text>
                <Ionicons name="notifications-outline" size={24} color="black" />
            </View>

            <View style={styles.profileSection}>
                <Image source={student.photo} style={styles.profilePhoto} />
                <Text style={styles.studentName}>{student.name}</Text>
            </View>

            <View style={styles.ranksSection}>
                <Text style={styles.sectionTitle}>Ranks</Text>
                <View style={styles.ranksRow}>
                    <Text style={styles.rankLabel}>Class Rank:</Text>
                    <Text style={styles.rankValue}>{student.ranks.classRank}</Text>
                </View>
                <View style={styles.ranksRow}>
                    <Text style={styles.rankLabel}>School Rank:</Text>
                    <Text style={styles.rankValue}>{student.ranks.schoolRank}</Text>
                </View>
                <View style={styles.ranksRow}>
                    <Text style={styles.rankLabel}>Zonal Rank:</Text>
                    <Text style={styles.rankValue}>{student.ranks.zonalRank}</Text>
                </View>
                <View style={styles.ranksRow}>
                    <Text style={styles.rankLabel}>Provincial Rank:</Text>
                    <Text style={styles.rankValue}>{student.ranks.provincialRank}</Text>
                </View>
                <View style={styles.ranksRow}>
                    <Text style={styles.rankLabel}>Island Rank:</Text>
                    <Text style={styles.rankValue}>{student.ranks.islandRank}</Text>
                </View>
            </View>

            <View style={styles.resultsSection}>
                <Text style={styles.sectionTitle}>Term Test Results</Text>
                <View style={styles.tableHeader}>
                    <Text style={styles.tableHeaderText}>Term</Text>
                    <Text style={styles.tableHeaderText}>Mathematics</Text>
                    <Text style={styles.tableHeaderText}>Science</Text>
                    <Text style={styles.tableHeaderText}>English</Text>
                </View>
                <FlatList
                    data={student.termResults}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.tableRow}>
                            <Text style={styles.tableCell}>{item.term}</Text>
                            <Text style={styles.tableCell}>{item.mathematics}</Text>
                            <Text style={styles.tableCell}>{item.science}</Text>
                            <Text style={styles.tableCell}>{item.english}</Text>
                        </View>
                    )}
                />
            </View>

            <View style={styles.detailsSection}>
                <Text style={styles.sectionTitle}>Progress</Text>
                <Text style={styles.detailText}>{student.progress}</Text>

                <Text style={styles.sectionTitle}>Attendance</Text>
                <Text style={styles.detailText}>{student.attendance}</Text>

                <Text style={styles.sectionTitle}>Achievements</Text>
                <FlatList
                    data={student.achievements}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => <Text style={styles.achievementText}>- {item}</Text>}
                />
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F6F9FC', paddingTop: 50, paddingHorizontal: 20 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 50 },
    headerTitle: { fontSize: 18, fontWeight: '600' },
    profileSection: { alignItems: 'center', marginBottom: 20 },
    profilePhoto: { width: 100, height: 100, borderRadius: 50, marginBottom: 10 },
    studentName: { fontSize: 18, fontWeight: 'bold' },
    ranksSection: { backgroundColor: '#fff', padding: 15, borderRadius: 10, marginBottom: 20, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
    sectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 10, color: '#333' },
    ranksRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
    rankLabel: { fontSize: 14, color: '#555' },
    rankValue: { fontSize: 14, fontWeight: 'bold' },
    resultsSection: { backgroundColor: '#fff', padding: 15, borderRadius: 10, marginBottom: 20, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
    tableHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
    tableHeaderText: { fontSize: 14, fontWeight: 'bold', color: '#555' },
    tableRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
    tableCell: { fontSize: 14, color: '#444' },
    detailsSection: { backgroundColor: '#fff', padding: 15, borderRadius: 10, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
    detailText: { fontSize: 14, color: '#777', marginBottom: 15 },
    achievementText: { fontSize: 14, color: '#444', marginBottom: 5 },
    errorText: { textAlign: 'center', fontSize: 16, color: 'red' },
});
