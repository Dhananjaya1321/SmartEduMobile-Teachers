import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {useNavigation} from 'expo-router';
import Animated, {SlideInDown} from 'react-native-reanimated';

const ScrollView = Animated.ScrollView;

export default function MyClassSchedule() {
    const navigation = useNavigation();
    const [view, setView] = useState('today'); // 'today' or 'weekly'
    const [schedule, setSchedule] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [expandedDays, setExpandedDays] = useState(new Set());

    useEffect(() => {
        const fetchScheduleData = async () => {
            try {
                setLoading(true);
                // Replace with actual API call
                // const response = await fetch('your-backend-api/schedule');
                // const data = await response.json();
                const sampleData = {
                    today: [
                        {day: 'Tuesday', time: '08:30 A.M. - 09:05 A.M.', gradeClass: 'Grade 10 - A'},
                        {day: 'Tuesday', time: '09:05 A.M. - 09:40 A.M.', gradeClass: 'Grade 10 - A'},
                        {day: 'Tuesday', time: '09:40 A.M. - 10:15 A.M.', gradeClass: 'Grade 9 - E'},
                        {day: 'Tuesday', time: '10:15 A.M. - 10:50 A.M.', gradeClass: 'Grade 8 - C'},
                        {day: 'Tuesday', time: '10:50 A.M. - 11:10 A.M.', gradeClass: 'Interval'},
                        {day: 'Tuesday', time: '11:10 A.M. - 11:45 A.M.', gradeClass: 'Grade 7 - B'},
                        {day: 'Tuesday', time: '11:45 A.M. - 12:20 P.M.', gradeClass: 'Grade 7 - B'},
                        {day: 'Tuesday', time: '12:20 P.M. - 12:55 P.M.', gradeClass: '-'},
                        {day: 'Tuesday', time: '12:55 P.M. - 01:30 P.M.', gradeClass: 'Grade 10 - E'},
                    ],
                    weekly: {
                        Monday: [],
                        Tuesday: [
                            {time: '08:30 A.M. - 09:05 A.M.', gradeClass: 'Grade 10 - A'},
                            {time: '09:05 A.M. - 09:40 A.M.', gradeClass: 'Grade 10 - A'},
                            {time: '09:40 A.M. - 10:15 A.M.', gradeClass: 'Grade 9 - E'},
                            {time: '10:15 A.M. - 10:50 A.M.', gradeClass: 'Grade 8 - C'},
                            {time: '10:50 A.M. - 11:10 A.M.', gradeClass: 'Interval'},
                            {time: '11:10 A.M. - 11:45 A.M.', gradeClass: 'Grade 7 - B'},
                            {time: '11:45 A.M. - 12:20 P.M.', gradeClass: 'Grade 7 - B'},
                        ],
                        Wednesday: [],
                        Thursday: [],
                        Friday: [],
                    }
                };
                setSchedule(sampleData);
            } catch (err) {
                setError('Failed to load schedule data.');
            } finally {
                setLoading(false);
            }
        };
        fetchScheduleData();
    }, []);

    const toggleDay = (day) => {
        const newExpandedDays = new Set(expandedDays);
        if (newExpandedDays.has(day)) {
            newExpandedDays.delete(day);
        } else {
            newExpandedDays.add(day);
        }
        setExpandedDays(newExpandedDays);
    };

    if (loading) {
        return <View style={styles.container}><ActivityIndicator size="large" color="#0000ff"/></View>;
    }

    if (error) {
        return <View style={styles.container}><Text style={styles.errorText}>{error}</Text></View>;
    }

    return (
        <ScrollView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color="#333"/>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>My Class Schedule</Text>
                <Ionicons name="notifications-outline" size={24} color="#333"/>
            </View>

            {/* Tabs */}
            <View style={styles.tabContainer}>
                <TouchableOpacity
                    style={[styles.tab, view === 'today' && styles.activeTab]}
                    onPress={() => setView('today')}
                >
                    <Text style={[styles.tabText, view === 'today' && styles.activeTabText]}>Today's schedule</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, view === 'weekly' && styles.activeTab]}
                    onPress={() => setView('weekly')}
                >
                    <Text style={[styles.tabText, view === 'weekly' && styles.activeTabText]}>Weekly schedule</Text>
                </TouchableOpacity>
            </View>

            {/* Schedule Content */}
            {view === 'today' && (
                <View entering={SlideInDown}>
                    <View style={styles.scheduleItem}>
                        <Text style={styles.scheduleDay}>{schedule.today.day}</Text>
                        {schedule.today && schedule.today.map((item, index) => (
                            <View style={styles.scheduleTable}>
                                <Text style={styles.scheduleTime}>{item.time}</Text>
                                <Text style={styles.scheduleGrade}>{item.gradeClass}</Text>
                            </View>
                        ))}
                    </View>
                </View>
            )}

            {view === 'weekly' && (
                <View entering={SlideInDown}>
                    {Object.keys(schedule.weekly).map((day) => (
                        <View key={day} style={styles.scheduleItem}>
                            <TouchableOpacity onPress={() => toggleDay(day)} style={styles.dayHeader}>
                                <Text style={styles.scheduleDay}>{day}</Text>
                                <Ionicons
                                    name={expandedDays.has(day) ? 'remove-circle-outline' : 'add-circle-outline'}
                                    size={20}
                                    color="#333"
                                />
                            </TouchableOpacity>
                            {expandedDays.has(day) && schedule.weekly[day].length > 0 && (
                                <FlatList
                                    data={schedule.weekly[day]}
                                    keyExtractor={(item, index) => index.toString()}
                                    renderItem={({item}) => (
                                        <View style={styles.scheduleTable}>
                                            <Text style={styles.scheduleTime}>{item.time}</Text>
                                            <Text style={styles.scheduleGrade}>{item.gradeClass}</Text>
                                        </View>
                                    )}
                                />
                            )}
                        </View>
                    ))}
                </View>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {flex: 1, backgroundColor: '#F6F9FC', padding: 15},
    header: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20},
    headerTitle: { fontSize: 18, fontWeight: '600' },
    tabContainer: {flexDirection: 'row', marginBottom: 20, gap:10, display:"flex", justifyContent:"center",alignItems:"center",textAlign:"center"},
    tab: {height:50, flex: 1, padding: 10, borderRadius: 5, alignItems: 'center', backgroundColor: '#E0E0E0', display:"flex", justifyContent:"center",textAlign:"center"},
    activeTab: {height:50, backgroundColor: '#4a5e7a',display:"flex", justifyContent:"center",alignItems:"center",textAlign:"center"},
    tabText: {fontWeight: 'bold',fontSize: 16, color: '#333',display:"flex", justifyContent:"center",alignItems:"center",textAlign:"center"},
    activeTabText: {color: '#fff', fontWeight: 'bold',display:"flex", justifyContent:"center",alignItems:"center",textAlign:"center"},
    scheduleItem: {
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4
    },
    scheduleDay: {fontSize: 16, fontWeight: 'bold', marginBottom: 5},
    scheduleTable: {flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 5},
    scheduleTime: {fontSize: 14, color: '#444'},
    scheduleGrade: {fontSize: 14, color: '#444'},
    dayHeader: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'},
    errorText: {textAlign: 'center', fontSize: 16, color: 'red', marginTop: 20},
});
