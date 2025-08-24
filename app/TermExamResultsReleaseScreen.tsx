import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Animated, Alert} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {useLocalSearchParams, useRouter} from 'expo-router';
import ScrollView = Animated.ScrollView;
import studentAPIController from "@/controllers/StudentController";
import examAPIController from "@/controllers/ExamController";

export default function TermExamResultsReleaseScreen() {
    const router = useRouter();
    const {
        id,
        examName,
        institutionId,
        grade,
        year,
        title,
        status,
        timetable
    } = useLocalSearchParams();

    const [subjects, setSubjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    // Parse timetable from params
    useEffect(() => {
        console.log(id,examName)
        if (timetable) {
            try {
                const parsed = JSON.parse(timetable as string);
                setSubjects(parsed);
            } catch (e) {
                console.error("Failed to parse timetable", e);
            }
        }
        setLoading(false);
    }, [timetable]);

    // Check if all subjects are released
    const allReleased = subjects.every(
        (item) => item.examsSubjectResultsStatus === "RELEASED"
    );

    const releaseExamResults = async () => {
        const payload = {
            examId:id,
            examName,
            schoolId:institutionId,
            gradeName:grade,
            year,
        };

        try {
            setSubmitting(true);
            console.log(payload)
            const response = await examAPIController.releaseExamResults(payload);

            if (response?.state === "OK") {
                Alert.alert("Success", "Exam results released successfully!");

                // Navigate to StudentsReportScreen after success
                router.push({
                    pathname: "/StudentsReportScreen",
                    params: {
                        title,
                        status: "RELEASED",
                        timetable: JSON.stringify(subjects),
                    },
                });
            } else {
                Alert.alert("Error", response?.message || "Failed to release results");
            }
        } catch (err) {
            console.error("Release Exam Results Error:", err);
            Alert.alert("Error", "Something went wrong while releasing results.");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#0000ff"/>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="black"/>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{title || 'Exam Results'}</Text>
                <Ionicons name="notifications-outline" size={24} color="black"/>
            </View>

            <View style={styles.tableHeader}>
                <Text style={styles.tableHeaderText}>Subject</Text>
                <Text style={styles.tableHeaderText}>Status</Text>
            </View>

            <FlatList
                data={subjects}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({item}) => (
                    <View style={styles.subjectItem}>
                        <Text style={styles.subjectText}>{item.subject}</Text>
                        <Text
                            style={[
                                styles.statusText,
                                item.examsSubjectResultsStatus === "RELEASED"
                                    ? styles.released
                                    : styles.pending,
                            ]}
                        >
                            {item.examsSubjectResultsStatus === "RELEASED"
                                ? "✔ Released"
                                : "Pending"}
                        </Text>
                    </View>
                )}
            />

            <TouchableOpacity
                style={[
                    styles.releaseButton,
                    (!allReleased || submitting) && styles.disabledButton,
                ]}
                disabled={!allReleased || submitting}
                onPress={releaseExamResults}
            >
                {submitting ? (
                    <ActivityIndicator color="#fff"/>
                ) : (
                    <Text style={styles.releaseButtonText}>Release and Generate Reports</Text>
                )}
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {flex: 1, backgroundColor: '#F6F9FC', paddingTop: 50, paddingHorizontal: 20},
    header: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 50},
    headerTitle: {fontSize: 18, fontWeight: '600'},
    tableHeader: {flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10},
    tableHeaderText: {fontSize: 14, fontWeight: 'bold', color: '#555'},
    subjectItem: {
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
    subjectText: {fontSize: 14, flex: 1},
    statusText: {fontSize: 14, flex: 1, textAlign: 'right'},
    released: {color: '#32CD32'},
    pending: {color: '#FF69B4'},
    releaseButton: {
        backgroundColor: '#445669',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 20,
    },
    releaseButtonText: {color: '#ffffff', fontSize: 16, fontWeight: 'bold'},
    disabledButton: {
        backgroundColor: '#A9A9A9',
        opacity: 0.6,
    },
});
