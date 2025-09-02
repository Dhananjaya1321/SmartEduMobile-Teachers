import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, ActivityIndicator, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import { Table, Row } from 'react-native-table-component';
import { LineChart } from 'react-native-chart-kit';
import studentResultsAPIController from "@/controllers/StudentResultsController";

export default function StudentFullReportScreen() {
    const [loading, setLoading] = useState(true);
    const [reportData, setReportData] = useState<any>(null);
    const navigation = useNavigation();
    const { studentId, name, examId } = useLocalSearchParams();
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);

    // map exam names to short codes
    const examMap: Record<string, string> = {
        "First Term Exam": "T1 Mar.",
        "Mid-Term Exam": "T2 Mar.",
        "Final Term Exam": "T3 Mar."
    };

    useEffect(() => {
        if (!studentId) {
            setLoading(false);
            setError("Invalid student ID. Cannot load data.");
            return;
        }

        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await studentResultsAPIController.getStudentsResultsDetails(studentId);

                if (response) {
                    const student = {
                        name: response.studentName,
                        grade: response.reports[0]?.gradeName,
                        className: "", // if API has class, map it here
                        year: response.reports[0]?.year,
                        totalMarks: response.reports.reduce((sum: number, r: any) => sum + (r.totalMarks || 0), 0)
                    };

                    // Collect all reports
                    const reports = response.reports;

                    // Fixed: always use all 3 exam codes
                    const examOrder = ["T1 Mar.", "T2 Mar.", "T3 Mar."];

                    // Collect all subjects
                    const allSubjects = Array.from(
                        new Set(
                            reports.flatMap((r: any) =>
                                r.marksList ? r.marksList.map((m: any) => m.subject) : []
                            )
                        )
                    );

                    // Build report table with subject rows first
                    const reportTable = allSubjects.map(subject => {
                        const row: any[] = [subject];
                        examOrder.forEach(examCode => {
                            const report = reports.find(
                                (r: any) => (examMap[r.examName] || r.examName) === examCode
                            );
                            if (report) {
                                const markObj = report.marksList?.find((m: any) => m.subject === subject);
                                row.push(markObj ? markObj.marks : "-");
                            } else {
                                row.push("-"); // placeholder if exam not in backend yet
                            }
                        });
                        return row;
                    });

                    // Add total, average, and rank rows below subject marks
                    const totalRow = ["Total"];
                    const averageRow = ["Average"];
                    const rankRow = ["Rank"];

                    examOrder.forEach(examCode => {
                        const report = reports.find((r: any) => (examMap[r.examName] || r.examName) === examCode);
                        totalRow.push(report ? report.totalMarks || "-" : "-");
                        averageRow.push(report ? report.averageMarks || "-" : "-");
                        rankRow.push(report ? report.rank || "-" : "-");
                    });

                    reportTable.push(totalRow);
                    reportTable.push(averageRow);
                    reportTable.push(rankRow);

                    // Simple chart demo: take total marks and average marks
                    const chartData = {
                        labels: examOrder,
                        series1: examOrder.map(code => {
                            const report = reports.find(
                                (r: any) => (examMap[r.examName] || r.examName) === code
                            );
                            return report ? report.totalMarks || 0 : 0;
                        }),
                        series2: examOrder.map(code => {
                            const report = reports.find(
                                (r: any) => (examMap[r.examName] || r.examName) === code
                            );
                            return report ? report.averageMarks || 0 : 0;
                        }),
                    };

                    setReportData({
                        student,
                        classInfo: {
                            grade: student.grade,
                            className: student.className,
                            totalStudents: reports[0]?.totalStudents || 0,
                        },
                        ranks: {
                            classRank: reports[0]?.rank || "-",
                            schoolRank: "-",
                            zonalRank: "-",
                            districtRank: "-",
                            provinceRank: "-",
                            islandRank: "-"
                        },
                        reportTable,
                        chartData
                    });
                }
            } catch (err) {
                console.error(err);
                setError("Failed to load data. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [studentId]);

    if (loading) {
        return (
            <View style={styles.loader}>
                <ActivityIndicator size="large" color="#000" />
            </View>
        );
    }

    if (!reportData) {
        return (
            <View style={styles.loader}>
                <Text>{error || "Failed to load data"}</Text>
            </View>
        );
    }

    const { student, ranks, classInfo, reportTable, chartData } = reportData;

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Report</Text>
                <Ionicons name="notifications-outline" size={24} color="black" />
            </View>

            {/* Student Info */}
            <View style={styles.studentCard}>
                <View style={{ flex: 1, marginLeft: 10 }}>
                    <View style={{ display: "flex", alignItems: "center" }}>
                        <View style={styles.profileHeader}>
                            <Image
                                source={require('@/assets/images/character.png')}
                                style={styles.profileImage}
                            />
                        </View>
                        <Text style={styles.studentName}>{student.name}</Text>
                        <Text style={styles.studentClass}>Grade {student.grade} ({student.year})</Text>
                    </View>
                </View>
            </View>

            {/* Report Table */}
            <Text style={styles.sectionTitle}>Report</Text>
            <View style={styles.tableContainer}>
                <Table borderStyle={{ borderWidth: 1, borderColor: '#ccc' }}>
                    <Row
                        data={['Subject', ...chartData.labels]}
                        style={styles.tableHeader}
                        textStyle={styles.tableHeaderText}
                    />
                    {reportTable.map((row: any[], index: number) => (
                        <Row
                            key={index}
                            data={row}
                            style={styles.tableRow}
                            textStyle={styles.tableText}
                        />
                    ))}
                </Table>
            </View>

            {/* Chart */}
            <LineChart
                data={{
                    labels: chartData.labels,
                    datasets: [
                        { data: chartData.series1, color: () => 'blue' },
                        { data: chartData.series2, color: () => 'red' }
                    ]
                }}
                width={Dimensions.get('window').width - 40}
                height={220}
                chartConfig={{
                    backgroundGradientFrom: '#fff',
                    backgroundGradientTo: '#fff',
                    decimalPlaces: 0,
                    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                    labelColor: () => '#000'
                }}
                bezier
                style={{ marginVertical: 20, borderRadius: 10 }}
            />

    {/*         Download Button
            <TouchableOpacity style={styles.downloadBtn}>
                <Text style={{ color: 'white', fontWeight: 'bold' }}>Download Report</Text>
            </TouchableOpacity>*/}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F6F9FC', paddingTop: 50, paddingHorizontal: 20 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 },
    headerTitle: { fontSize: 18, fontWeight: '600' },
    loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    studentCard: { flexDirection: 'row', backgroundColor: '#fff', padding: 15, borderRadius: 10, alignItems: 'center' },
    studentName: { fontSize: 16, fontWeight: 'bold' },
    studentClass: { fontSize: 12, color: 'gray' },
    sectionTitle: { fontWeight: 'bold', marginTop: 20, marginBottom: 10 },
    tableContainer: { backgroundColor: '#fff', borderRadius: 10 },
    tableHeader: { height: 40, backgroundColor: '#f0f0f0' },
    tableHeaderText: { fontWeight: 'bold', textAlign: 'center' },
    tableRow: { height: 40 },
    tableText: { textAlign: 'center' },
    downloadBtn: { backgroundColor: '#2d3748', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 20, marginBottom: 20 },
    profileHeader: { alignItems: 'center', marginBottom: 20 },
    profileImage: { width: 100, height: 100, borderRadius: 10 },
});
