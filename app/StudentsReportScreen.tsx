import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Image,
    ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import studentResultsAPIController from "@/controllers/StudentResultsController";

// Placeholder image (replace with actual image source from backend)
const placeholderImage = require("@/assets/images/character.png");

export default function StudentsReportScreen() {
    const router = useRouter();
    const [students, setStudents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const params = useLocalSearchParams();
    const id = params.id as string | undefined;

    useEffect(() => {
        if (!id) {
            setLoading(false);
            setError("Invalid exam ID. Cannot load data.");
            return;
        }

        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await studentResultsAPIController.getAllClassStudentsResultsDetails(id);

                if (response) {
                    // Sort by rank before setting
                    const sorted = [...response].sort((a, b) => a.rank - b.rank);
                    setStudents(sorted);
                } else {
                    setError("No results found for this exam.");
                }
            } catch (err) {
                setError("Failed to load data. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

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
                <Text style={styles.headerTitle}>Students Report</Text>
                <Ionicons name="notifications-outline" size={24} color="black" />
            </View>

            <Text style={styles.instructionText}>
                Please click on the student to see full report.
            </Text>

            <View style={styles.tableHeader}>
                <Text style={styles.tableHeaderText}>Photo</Text>
                <Text style={styles.tableHeaderText}>Name</Text>
                <Text style={styles.tableHeaderText}>Rank in class</Text>
            </View>

            <FlatList
                data={students}
                keyExtractor={(item) => item.studentId}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.studentItem}
                        onPress={() =>
                            router.push({
                                pathname: "/StudentFullReportScreen",
                                params: {
                                    studentId: item.studentId,
                                    name: item.studentName,
                                    examId: item.examId,
                                },
                            })
                        }
                    >
                        <Image
                            source={placeholderImage}
                            style={styles.studentPhoto}
                        />
                        <Text style={styles.studentName}>{item.studentName}</Text>
                        <Text style={styles.studentRank}>{item.rank}</Text>
                    </TouchableOpacity>
                )}
            />

         {/*   <TouchableOpacity style={styles.downloadButton}>
                <Text style={styles.downloadButtonText}>Download Report</Text>
            </TouchableOpacity>*/}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#F6F9FC", paddingTop: 50, paddingHorizontal: 20 },
    header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 50 },
    headerTitle: { fontSize: 18, fontWeight: "600" },
    instructionText: { fontSize: 12, color: "#777", marginBottom: 10 },
    tableHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 10 },
    tableHeaderText: { fontSize: 14, fontWeight: "bold", color: "#555" },
    studentItem: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    studentPhoto: { width: 40, height: 40, marginRight: 10 },
    studentName: { fontSize: 14, flex: 1 },
    studentRank: { fontSize: 14, fontWeight: "bold" },
    downloadButton: {marginBottom:20, backgroundColor: "#445669", padding: 15, borderRadius: 5, alignItems: "center", marginTop: 20 },
    downloadButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
    errorText: { textAlign: "center", fontSize: 16, color: "red" },
});
