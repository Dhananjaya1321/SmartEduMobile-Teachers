import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, ScrollView} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {useRouter} from 'expo-router';
import eventAPIController from "@/controllers/EventController";

export default function ViewEventsScreen() {
    const router = useRouter();
    const [totalEvents, setTotalEvents] = useState(0);
    const [events, setEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch data from backend
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const data = await eventAPIController.getAllEventsToTeacher();

                if (data) {
                    setTotalEvents(data.totalEvents || data.length || 0);
                    setEvents(data.events || data); // backend might return { events: [] } or just []
                } else {
                    setError("Failed to load events.");
                }
            } catch (err) {
                setError("Something went wrong while fetching events.");
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
        <ScrollView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>View Events</Text>
                <Ionicons name="notifications-outline" size={24} color="black" />
            </View>

            {/* Year */}
            <Text style={styles.yearText}>Year</Text>
            <View style={styles.yearBox}>
                <Text style={styles.year}>{new Date().getFullYear()}</Text>
            </View>

            {/* Total events */}
            <View style={styles.totalClassesView}>
                <Text style={styles.totalEventsText}>Total number of events</Text>
                <Text style={styles.totalEvents}>{totalEvents}</Text>
            </View>

            {/* Events list */}
            <FlatList
                data={events}
                keyExtractor={(item, index) => index.toString()}
                scrollEnabled={false}
                renderItem={({ item }) => (
                    <View style={styles.eventItem}>
                        <View style={styles.gradeBox}>
                            <Text style={styles.eventGrade}>{item.grade || "All"}</Text>
                        </View>
                        <Text style={styles.eventTitle}>{item.name}</Text>
                        <View style={{ marginBottom: 10 }}>
                            <Text style={styles.eventDate}>
                                Start date: {item.startDate}
                            </Text>
                            <Text style={styles.eventDate}>
                                End date: {item.endDate}
                            </Text>
                        </View>
                        <Text style={styles.eventDescription}>{item.description}</Text>
                    </View>
                )}
            />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F6F9FC', paddingTop: 50, paddingHorizontal: 20 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 50 },
    headerTitle: {fontSize: 18, fontWeight: '600'},
    yearText: {fontSize: 14, color: '#555', marginBottom: 5},
    yearBox: {backgroundColor: '#E0E0E0', borderRadius: 5, padding: 10, marginBottom: 20},
    year: {fontSize: 16, fontWeight: 'bold', textAlign: 'center'},
    totalEventsText: {fontSize: 14, color: '#555', marginBottom: 5},
    totalEvents: {fontSize: 16, fontWeight: 'bold', marginBottom: 15},
    eventItem: {
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    eventTitle: {fontSize: 16, fontWeight: 'bold', marginBottom: 5},
    eventDate: {fontSize: 10, color: '#777', marginBottom: 5,marginTop:0},
    eventGrade: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 12,
        color: '#555'
    },
    eventDescription: {fontSize: 12, color: '#333'},
    errorText: {textAlign: 'center', fontSize: 16, color: 'red'},
    gradeBox: {
        marginTop:10,
        position: "absolute",
        right: 10,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#F0F4F9",
        width: "auto",
        paddingHorizontal: 15,
        height: 30,
        borderRadius: 10
    },
    totalClassesView: { display:"flex", flexDirection:"row", justifyContent:"space-between", marginBottom:10, alignItems:"center" },

});
