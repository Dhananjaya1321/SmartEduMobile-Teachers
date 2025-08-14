import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, ScrollView} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {useRouter} from 'expo-router';

export default function ViewEventsScreen() {
    const router = useRouter();
    const [totalEvents, setTotalEvents] = useState(0);
    const [events, setEvents] = useState([]);
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
                // setTotalEvents(data.totalEvents);
                // setEvents(data.events || []);
                setTotalEvents(14);
                setEvents([
                    {
                        title: 'Pola',
                        startDate: '2025/02/05',
                        endDate: '2025/02/07',
                        grade: 'All',
                        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec sed libero nibh. Mauris libero tortor, facilisis et enim sit amet, auctor euismod leo. Cras a ante cursus, blandit neque eu, porta elit. Cras at accumsan mi. Vivamus sapien ligula, aliquam id dolor ac, laculis commodo mi. Ut in dictum diam. Etiam lacinia consectetur ipsum sit amet pretium.'
                    },
                    {
                        title: 'New year festival',
                        startDate: '2025/02/05',
                        endDate: '2025/02/07',
                        grade: 'All',
                        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec sed libero nibh. Mauris libero tortor, facilisis et enim sit amet, auctor euismod leo. Cras a ante cursus, blandit neque eu, porta elit. Cras at accumsan mi. Vivamus sapien ligula, aliquam id dolor ac, laculis commodo mi. Ut in dictum diam. Etiam lacinia consectetur ipsum sit amet pretium.'
                    },
                    {
                        title: 'Trip',
                        startDate: '2025/02/05',
                        endDate: '2025/02/07',
                        grade: 'Grade - 10',
                        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec sed libero nibh. Mauris libero tortor, facilisis et enim sit amet, auctor euismod leo. Cras a ante cursus, blandit neque eu, porta elit. Cras at accumsan mi. Vivamus sapien ligula, aliquam id dolor ac, laculis commodo mi. Ut in dictum diam. Etiam lacinia consectetur ipsum sit amet pretium.'
                    },
                ]);
            } catch (err) {

            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#0000ff"/>
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
                    <Ionicons name="arrow-back" size={24} color="black"/>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>View Events</Text>
                <Ionicons name="notifications-outline" size={24} color="black"/>
            </View>

            <Text style={styles.yearText}>Year</Text>
            <View style={styles.yearBox}>
                <Text style={styles.year}>2021</Text>
            </View>

            <View style={styles.totalClassesView}>
                <Text style={styles.totalEventsText}>Total number of events</Text>
                <Text style={styles.totalEvents}>{totalEvents}</Text>
            </View>

            <FlatList
                data={events}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({item}) => (
                    <View style={styles.eventItem}>
                        <View style={styles.gradeBox}>
                            <Text style={styles.eventGrade}>{item.grade}</Text>
                        </View>
                        <Text style={styles.eventTitle}>{item.title}</Text>
                        <View style={{marginBottom:10}}>
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
