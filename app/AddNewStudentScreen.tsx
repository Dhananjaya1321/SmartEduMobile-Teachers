import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, ActivityIndicator} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {useNavigation} from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import {Dropdown} from 'react-native-element-dropdown';
import RNDateTimePicker from "@react-native-community/datetimepicker";
import gradeAPIController from "@/controllers/GradesController";
import studentAPIController from "@/controllers/StudentController";


export default function AddNewStudentScreen() {
    const navigation = useNavigation();

    // State
    const [dateEnteredSchool, setDateEnteredSchool] = useState(new Date());
    const [fullName, setFullName] = useState('');
    const [fullNameWithInitial, setFullNameWithInitial] = useState('');
    const [birthDate, setBirthDate] = useState(new Date());
    const [motherName, setMotherName] = useState('');
    const [motherContact, setMotherContact] = useState('');
    const [fatherName, setFatherName] = useState('');
    const [fatherContact, setFatherContact] = useState('');
    const [address, setAddress] = useState('');
    const [studentRegNo, setStudentRegNo] = useState('');
    const [grade, setGrade] = useState('');
    const [className, setClassName] = useState('');
    const [showDatePicker, setShowDatePicker] = useState({type: null, visible: false});

    const [grades, setGrades] = useState([]);
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedGrade, setSelectedGrade] = useState<string | null>(null);
    const [selectedClass, setSelectedClass] = useState<string | null>(null);

    const fetchGradesAndClasses = async () => {
        try {
            const response = await gradeAPIController.getAllGrades();

            const gradeOptions = response.data.map((g: any) => ({
                label: "Grade "+g.gradeName,
                value: g.id,
                classRooms: g.classRooms ?? [],
            }));

            setGrades(gradeOptions);
        } catch (error) {

        }
    };

    const fetchStudentRegistrationNumber = async () => {
        try {
            const response = await studentAPIController.getRegistrationNumber();
            setStudentRegNo(response);
        } catch (error) {

        }
    };

    const handleGradeSelect = (gradeId: string) => {
        setSelectedGrade(gradeId);

        const selected = grades.find((g) => g.value === gradeId);
        if (selected && selected.classRooms.length > 0) {
            const classOptions = selected.classRooms.map((c: any) => ({
                label: c.className,
                value: c.id,
            }));
            setClasses(classOptions);
        } else {
            setClasses([]);
        }

        setSelectedClass(null); // reset class when grade changes
    };

    useEffect(() => {
        fetchGradesAndClasses();
        fetchStudentRegistrationNumber();
    }, []);

    const handleDateChange = (event, selectedDate) => {
        if (selectedDate) {
            if (showDatePicker.type === 'enteredSchool') {
                setDateEnteredSchool(selectedDate);
            } else if (showDatePicker.type === 'birthDate') {
                setBirthDate(selectedDate);
            }
        }

        setShowDatePicker({type: null, visible: false});
    };

    const handleSave =async () => {
        const studentData = {
            entryDate: dateEnteredSchool
                ? dateEnteredSchool.toISOString().split("T")[0]
                : null,
            fullName,
            fullNameWithInitials: fullNameWithInitial,
            dateOfBirth: birthDate ? birthDate.toISOString().split("T")[0] : null,
            motherName,
            motherContact,
            fatherName,
            fatherContact,
            address,
            registrationNumber: studentRegNo,
            gradeId: selectedGrade, // dropdown value
            classId: selectedClass, // dropdown value
        };

        const response = await studentAPIController.saveStudent(studentData);
        console.log(response)
        if (response){
            setDateEnteredSchool(new Date())
            setFullName('');
            setFullNameWithInitial('')
            setBirthDate(new Date())
            setMotherName('')
            setMotherContact('')
            setFullName('')
            setFatherContact('')
            setAddress('')
            setSelectedClass(null)
            setSelectedGrade(null)
            fetchStudentRegistrationNumber()
            alert('Student Saved!');
        }else {
            alert(response.message);
        }
    };



    return (
        <ScrollView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color="#000"/>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Add New Student</Text>
                <Ionicons name="notifications-outline" size={24} color="#000"/>
            </View>

            {/* Student Basic Information */}
            <Text style={styles.sectionTitle}>Student Basic Information</Text>

            <Text style={styles.label}>Date the student entered school</Text>
            <View style={styles.dateBox}>
                <RNDateTimePicker value={dateEnteredSchool || new Date()} onChange={handleDateChange}/>
            </View>

            <Text style={styles.label}>Full Name</Text>
            <TextInput style={styles.input} value={fullName} onChangeText={setFullName} placeholder="Full Name"/>

            <Text style={styles.label}>Full Name With Initial</Text>
            <TextInput style={styles.input} value={fullNameWithInitial} onChangeText={setFullNameWithInitial}
                       placeholder="Full Name With Initial"/>

            <Text style={styles.label}>Birth of Date</Text>
            <View style={styles.dateBox}>
                <RNDateTimePicker value={birthDate} onChange={handleDateChange}/>
            </View>

            {/* Parents Details */}
            <Text style={styles.sectionTitle}>Parents Details</Text>
            <Text style={styles.label}>Mother’s Name</Text>
            <TextInput style={styles.input} value={motherName} onChangeText={setMotherName}
                       placeholder="Mother’s Name"/>

            <Text style={styles.label}>Mother’s Contact Number</Text>
            <TextInput style={styles.input} value={motherContact} onChangeText={setMotherContact}
                       placeholder="Mother’s Contact Number" keyboardType="phone-pad"/>

            <Text style={styles.label}>Father’s Name</Text>
            <TextInput style={styles.input} value={fatherName} onChangeText={setFatherName}
                       placeholder="Father’s Name"/>

            <Text style={styles.label}>Father’s Contact Number</Text>
            <TextInput style={styles.input} value={fatherContact} onChangeText={setFatherContact}
                       placeholder="Father’s Contact Number" keyboardType="phone-pad"/>

            <Text style={styles.label}>Address</Text>
            <TextInput style={[styles.input, styles.textArea]} value={address} onChangeText={setAddress}
                       placeholder="Address" multiline/>

            {/* Other Details */}
            <Text style={styles.sectionTitle}>Other Details</Text>
            <Text style={styles.label}>Student Registration Number</Text>
            <TextInput style={styles.input} value={studentRegNo} onChangeText={setStudentRegNo}
                       placeholder="Student Registration Number" editable={false}/>

            {/* Grade & Class Dropdowns */}
            <View style={styles.classAndGradeBox}>
                <Text style={styles.label}>Grade</Text>
                <View style={styles.inputBox}>
                    <Dropdown
                        style={styles.dropdown}
                        placeholderStyle={styles.placeholderStyle}
                        selectedTextStyle={styles.selectedTextStyle}
                        iconStyle={styles.iconStyle}
                        data={grades}
                        maxHeight={300}
                        labelField="label"
                        valueField="value"
                        placeholder="Select Grade"
                        value={selectedGrade}
                        onChange={(item) => handleGradeSelect(item.value)}
                    />
                </View>
            </View>
            <View style={styles.classAndGradeBox}>
                <Text style={styles.label}>Class</Text>
                <View style={styles.inputBox}>
                    <Dropdown
                        style={styles.dropdown}
                        placeholderStyle={styles.placeholderStyle}
                        selectedTextStyle={styles.selectedTextStyle}
                        iconStyle={styles.iconStyle}
                        data={classes}
                        maxHeight={300}
                        labelField="label"
                        valueField="value"
                        placeholder="Select Class"
                        value={selectedClass}
                        onChange={(item) => setSelectedClass(item.value)}
                        disable={classes.length === 0}
                    />
                </View>
            </View>

            {/* Save Button */}
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveButtonText}>Save Student</Text>
            </TouchableOpacity>

            {/* Date Picker */}
            {showDatePicker.visible && (
                <DateTimePicker
                    value={new Date()}
                    mode="date"
                    display="default"
                    onChange={handleDateChange}
                />
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {flex: 1, backgroundColor: '#F6F9FC', paddingTop: 50, paddingHorizontal: 20},
    header: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 50},
    headerTitle: {fontSize: 18, fontWeight: '600'},
    sectionTitle: {fontSize: 16, fontWeight: 'bold', marginBottom: 10, marginTop: 15},
    label: {fontSize: 13, color: '#666', marginBottom: 5},
    input: {
        backgroundColor: '#fff', padding: 12, borderRadius: 8, marginBottom: 15, height: 50, shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    textArea: {height: 80, textAlignVertical: 'top'},
    saveButton: {
        backgroundColor: '#3D4E61',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 30
    },
    saveButtonText: {color: '#fff', fontSize: 16, fontWeight: 'bold'},

    gradeClassRow: {flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15},
    classAndGradeBox: {flex: 1, borderRadius: 8, marginBottom: 15},
    inputBox: {
        backgroundColor: '#fff', borderRadius: 8, paddingHorizontal: 5, paddingVertical: 2,
        shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4,
    },
    dropdown: {height: 40, backgroundColor: '#fff', borderRadius: 8, paddingHorizontal: 8},
    placeholderStyle: {fontSize: 14, color: '#999'},
    selectedTextStyle: {fontSize: 14, color: '#000'},
    iconStyle: {width: 20, height: 20},
    dateBox: {
        display: "flex",
        backgroundColor: '#fff',
        padding: 12,
        borderRadius: 8,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
});
