import React, { useState, useEffect } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity, FlatList, Modal, TextInput, Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import { router, useLocalSearchParams } from 'expo-router';
import homeworksAPIController from "@/controllers/HomeworksController";
import * as FileSystem from 'expo-file-system';

export default function AddHomeworkScreen() {
    const params = useLocalSearchParams();
    const { gradeId, grade, classId, class: className, subjects, year } = params as {
        gradeId?: string;
        grade?: string;
        classId?: string;
        class?: string;
        subjects?: string;
        year?: string;
    };
    const [totalHomework, setTotalHomework] = useState(0);
    const [homeworkList, setHomeworkList] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [homeworkText, setHomeworkText] = useState("");

    useEffect(() => {
        setTotalHomework(3);
        setHomeworkList([
            { id: 1, title: 'Homework 1' },
            { id: 2, title: 'Homework 2' },
            { id: 3, title: 'Homework 3' },
        ]);
    }, [grade, className, subjects]);

    const handlePickDocument = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: "*/*",
                copyToCacheDirectory: true
            });
            if (!result.canceled && result.assets && result.assets.length > 0) {
                setSelectedFile(result.assets[0]);
                console.log("Selected file:", result.assets[0]);
            } else {
                console.log("Document picking canceled or no assets found.");
            }
        } catch (error) {
            console.error("Error picking document:", error);
        }
    };

    const convertFileToBase64 = async (file) => {
        try {
            if (!file || !file.uri) {
                console.error("No valid file or URI provided for Base64 conversion.");
                return null;
            }

            if (Platform.OS === 'web') {
                const fileReader = new FileReader();
                return new Promise((resolve, reject) => {
                    fileReader.onload = (event) => {
                        const base64String = event.target.result.split(',')[1];
                        const mimeType = file.mimeType || "application/octet-stream";
                        resolve(`data:${mimeType};base64,${base64String}`);
                    };
                    fileReader.onerror = (error) => reject(error);
                    fileReader.readAsDataURL(file.file || file); // Handle web File object
                });
            } else {
                const base64 = await FileSystem.readAsStringAsync(file.uri, {
                    encoding: FileSystem.EncodingType.Base64,
                });
                const mimeType = file.mimeType || "application/octet-stream";
                return `data:${mimeType};base64,${base64}`;
            }
        } catch (error) {
            console.error("Error converting file to Base64:", error);
            return null;
        }
    };

    const handleAddHomework = async () => {
        if (!homeworkText.trim()) {
            console.warn("Homework description is empty.");
            return;
        }

        let fileBase64 = null;
        if (selectedFile) {
            fileBase64 = await convertFileToBase64(selectedFile);
            if (!fileBase64) {
                console.warn("Failed to convert file to Base64. Please try a different file.");
                return;
            }
        }

        if (!gradeId || !classId || !year) {
            console.error("Missing required fields: gradeId, classId, or year", { gradeId, classId, year });
            return;
        }

        const payload = {
            description: homeworkText,
            gradeId,
            classId,
            year,
            document: fileBase64,
        };

        console.log("Payload:", payload);

        try {
            const response = await homeworksAPIController.saveHomeworks(payload);

            if (response) {
                const newHomework = {
                    id: homeworkList.length + 1, // Assuming backend doesn't return an ID
                    title: homeworkText,
                    file: selectedFile,
                };
                setHomeworkList(prevList => [...prevList, newHomework]);
                setTotalHomework(prevTotal => prevTotal + 1);
                setHomeworkText("");
                setSelectedFile(null);
                setModalVisible(false);
            } else {
                console.warn("Failed to save homework: Invalid response from server.", response);
            }
        } catch (error) {
            console.error("Error saving homework:", error.response?.data || error.message);
        }
    };

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
                        <Text style={styles.infoValue}>{grade || 'N/A'}</Text>
                    </View>
                </View>
                <View style={styles.infoBox}>
                    <Text style={styles.infoLabel}>Current Class</Text>
                    <View style={styles.infoValueBox}>
                        <Text style={styles.infoValue}>{className || 'N/A'}</Text>
                    </View>
                </View>
            </View>

            <View style={styles.infoRow}>
                <View style={styles.infoBox}>
                    <Text style={styles.infoLabel}>Year</Text>
                    <View style={styles.infoValueBox}>
                        <Text style={styles.infoValue}>{year || 'N/A'}</Text>
                    </View>
                </View>
                <View style={styles.infoBox}>
                    <Text style={styles.infoLabel}>Subjects</Text>
                    <View style={styles.infoValueBox}>
                        <Text style={styles.infoValue}>{subjects || 'N/A'}</Text>
                    </View>
                </View>
            </View>

            <View style={styles.totalClassesView}>
                <Text style={styles.totalHomeworkText}>The total homework</Text>
                <Text style={styles.totalHomework}>{totalHomework}</Text>
            </View>

            <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
                <Text style={styles.addButtonText}>Add New Homework</Text>
            </TouchableOpacity>

            <Text style={styles.homeworkList}>Homework you added.</Text>
        </View>
    );

    return (
        <View style={{ flex: 1 }}>
            <FlatList
                style={styles.container}
                data={homeworkList}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.homeworkItem}>
                        <Text style={styles.homeworkText}>{item.title}</Text>
                        {item.file && <Text style={styles.fileText}>📎 {item.file.name}</Text>}
                    </View>
                )}
                ListHeaderComponent={renderHeader}
                contentContainerStyle={styles.homeworkList}
                showsVerticalScrollIndicator={false}
            />

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Add Homework</Text>

                        <TextInput
                            style={styles.input}
                            placeholder="Enter homework title"
                            value={homeworkText}
                            onChangeText={setHomeworkText}
                        />

                        <TouchableOpacity style={styles.fileButton} onPress={handlePickDocument}>
                            <Text style={styles.fileButtonText}>
                                {selectedFile ? selectedFile.name : "Upload Document"}
                            </Text>
                        </TouchableOpacity>

                        <View style={styles.modalActions}>
                            <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                                <Text style={styles.cancelButtonText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.saveButton} onPress={handleAddHomework}>
                                <Text style={styles.saveButtonText}>Save</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
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
    addButton: { backgroundColor: '#E0E0E0', padding: 10, borderRadius: 5, marginBottom: 15, alignItems: 'center' },
    addButtonText: { fontSize: 14, fontWeight: 'bold' },
    homeworkList: { fontSize: 14, color: '#555', marginBottom: 10 },
    homeworkItem: { backgroundColor: '#D3D3D3', height: 150, borderRadius: 5, marginBottom: 10, justifyContent: 'center', alignItems: 'center' },
    homeworkText: { fontSize: 16, color: '#fff' },
    fileText: { fontSize: 12, color: '#000', marginTop: 5 },
    totalClassesView: { display: "flex", flexDirection: "row", justifyContent: "space-between" },
    modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
    modalContent: { backgroundColor: '#fff', padding: 20, borderRadius: 10, width: '90%' },
    modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
    input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 5, padding: 10, marginBottom: 15 },
    fileButton: { backgroundColor: '#e0e0e0', padding: 10, borderRadius: 5, alignItems: 'center', marginBottom: 15 },
    fileButtonText: { fontSize: 14, color: '#333' },
    modalActions: { flexDirection: 'row', justifyContent: 'flex-end' },
    cancelButton: { marginRight: 10, padding: 10 },
    cancelButtonText: { color: '#999' },
    saveButton: { backgroundColor: '#4CAF50', padding: 10, borderRadius: 5 },
    saveButtonText: { color: '#fff', fontWeight: 'bold' }
});
