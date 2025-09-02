import React, {useState} from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    ScrollView,
    ImageBackground
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useRouter} from 'expo-router';
import {Dropdown} from "react-native-element-dropdown";
import schoolAPIController from "@/controllers/SchoolController";
import loginAPIController from "@/controllers/LoginController";

export const provinceDistrictMap: Record<string, string[]> = {
    "Western": ["Colombo", "Gampaha", "Kalutara"],
    "Central": ["Kandy", "Matale", "Nuwara Eliya"],
    "Southern": ["Galle", "Matara", "Hambantota"],
    "Northern": ["Jaffna", "Mannar", "Vavuniya", "Mullaitivu", "Kilinochchi"],
    "Eastern": ["Batticaloa", "Ampara", "Trincomalee"],
    "North Western": ["Kurunegala", "Puttalam"],
    "North Central": ["Anuradhapura", "Polonnaruwa"],
    "Uva": ["Badulla", "Moneragala"],
    "Sabaragamuwa": ["Ratnapura", "Kegalle"]
};

export const districtZoneMap: Record<string, string[]> = {
    "Colombo": ["Colombo", "Homagama", "Piliyandala", "Sri Jayawardanapura"],
    "Gampaha": ["Gampaha", "Kelaniya", "Minuwangoda", "Negombo"],
    "Kalutara": ["Horana", "Kalutara", "Matugama"],

    "Kandy": ["Denuwara", "Gampola", "Kandy", "Katugastota", "Teldeniya", "Wathegama"],
    "Matale": ["Galewela", "Matale", "Naula", "Wilgamuwa"],
    "Nuwara Eliya": ["Hanguranketha", "Hatton", "Kotmale", "Nuwara Eliya", "Walapane"],

    "Galle": ["Ambalangoda", "Elpitiya", "Galle", "Udugama"],
    "Matara": ["Akuressa", "Matara", "Morawaka", "Mulatiyana (Hakmana)"],
    "Hambantota": ["Hambantota", "Tangalle", "Walasmulla"],

    "Jaffna": ["Islands", "Jaffna", "Thenmarachchi", "Vadamarachchi", "Valikamam"],
    "Mannar": ["Madhu", "Mannar"],
    "Vavuniya": ["Vavuniya North", "Vavuniya South"],
    "Mullaitivu": ["Mullaitivu", "Thunukkai"],
    "Kilinochchi": ["Kilinochchi North", "Kilinochchi South"],

    "Batticaloa": ["Batticaloa", "Batticaloa Central", "Batticaloa West", "Kalkudah", "Paddiruppu"],
    "Ampara": ["Akkaraipattu", "Ampara", "Dehiattakandiya", "Kalmunai", "Mahaoya", "Sammanthurai", "Thirukkovil"],
    "Trincomalee": ["Kantale", "Kinniya", "Muttur", "Trincomalee", "Trincomalee North"],

    "Kurunegala": ["Giriulla", "Ibbagamuwa", "Kuliyapitiya", "Kurunegala", "Maho", "Nikaweratiya"],
    "Puttalam": ["Chilaw", "Puttalam"],

    "Anuradhapura": ["Anuradhapura", "Galenbindunuwewa", "Kebithigollewa", "Kekirawa", "Thambuttegama"],
    "Polonnaruwa": ["Dimbulagala", "Hingurakgoda", "Polonnaruwa"],

    "Badulla": ["Badulla", "Bandarawela", "Mahiyanganaya", "Passara", "Viyaluwa", "Welimada"],
    "Moneragala": ["Bibile", "Moneragala", "Thanamalwila", "Wellawaya"],

    "Ratnapura": ["Balangoda", "Embilipitiya", "Nivitigala", "Ratnapura"],
    "Kegalle": ["Dehiowita", "Kegalle", "Mawanella"]
};

export default function RegisterScreen() {
    const [fullName, setFullName] = useState('');
    const [nic, setNic] = useState('');
    const [username, setUsername] = useState('');
    const [contact, setContact] = useState('');
    const [address, setAddress] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [studentRegNumber, setStudentRegNumber] = useState('');
    const router = useRouter();

    // dropdown states
    const [province, setProvince] = useState<string | null>(null);
    const [district, setDistrict] = useState<string | null>(null);
    const [zonal, setZonal] = useState<string | null>(null);
    const [schools, setSchools] = useState<any[]>([]);
    const [selectedSchool, setSelectedSchool] = useState<string | null>(null);

    const handleRegister = async () => {
        if (!username || !email || !password || !fullName || !contact || !nic || !address || !selectedSchool) {
            Alert.alert('Error', 'All fields are required');
            return;
        }
        if (!email.includes('@') || !email.includes('.')) {
            Alert.alert('Error', 'Please enter a valid email address');
            return;
        }

        try {
            const teacherPayload = {
                fullName,
                nic,
                username,
                contact,
                address,
                email,
                password,
                schoolId: selectedSchool,
            };

            const response = await loginAPIController.saveTeacher(teacherPayload);


            if (response) {
                if (response.token) {
                    await AsyncStorage.setItem('token', response.token);
                }

                await AsyncStorage.setItem('user', JSON.stringify(response));

                Alert.alert('Success', 'Registration successful!');
                router.replace('/');
            } else {
                Alert.alert('Error', 'Failed to register teacher.');
            }
        } catch (error) {
            console.error("Register error:", error);
            Alert.alert('Error', 'Something went wrong. Please try again.');
        }
    };


    const fetchSchools = async (zonalName: string) => {
        try {
            const response = await schoolAPIController.getAllSchoolsByProvinceAndDistrictAndZonal(
                province, district, zonalName
            );

            if (!response) {
                setSchools([]);
                return;
            }

            let schoolList = [];

            if (Array.isArray(response)) {
                schoolList = response;
            } else if (typeof response === "object") {
                schoolList = [response];
            }

            setSchools(schoolList.map((s: any) => ({
                label: s.schoolName,
                value: s.id
            })));
        } catch (error) {
            Alert.alert("Error", "Failed to load schools.");
        }
    };

    return (
        <ImageBackground
            source={require('@/assets/images/background.jpg')}
            style={styles.backgroundImage}
            resizeMode="cover"
        >
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.title}>Teacher</Text>
                <Text style={styles.subtitle}>Register a New Account</Text>

                <Text style={{
                    color: "white",
                    display: "flex",
                    alignSelf: "flex-start",
                    marginBottom: 10,
                    fontSize: 16,
                    fontWeight: "500"
                }}>Personal Details</Text>

                <View style={{width: '100%'}}>
                    <Text style={styles.label}>Full name</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Full name"
                        placeholderTextColor="#888"
                        value={fullName}
                        onChangeText={setFullName}
                        autoCapitalize="none"
                    />
                </View>

                <View style={{width: '100%'}}>
                    <Text style={styles.label}>Contact</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Contact"
                        placeholderTextColor="#888"
                        value={contact}
                        onChangeText={setContact}
                        autoCapitalize="none"
                    />
                </View>

                <View style={{width: '100%'}}>
                    <Text style={styles.label}>NIC</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="NIC"
                        placeholderTextColor="#888"
                        value={nic}
                        onChangeText={setNic}
                        autoCapitalize="none"
                    />
                </View>

                <View style={{width: '100%'}}>
                    <Text style={styles.label}>Address</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Address"
                        placeholderTextColor="#888"
                        value={address}
                        onChangeText={setAddress}
                        autoCapitalize="none"
                    />
                </View>

                <View style={{width: '100%'}}>
                    <Text style={styles.label}>Username</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Username"
                        placeholderTextColor="#888"
                        value={username}
                        onChangeText={setUsername}
                        autoCapitalize="none"
                    />
                </View>

                <View style={{width: '100%'}}>
                    <Text style={styles.label}>Email</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Email"
                        placeholderTextColor="#888"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                </View>

                <View style={{width: '100%'}}>
                    <Text style={styles.label}>Password</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Password"
                        placeholderTextColor="#888"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                    />
                </View>

                <Text
                    style={{
                        color: "white",
                        display: "flex",
                        alignSelf: "flex-start",
                        marginBottom: 10,
                        fontSize: 16,
                        fontWeight: "500"
                    }}
                >
                    School Details
                </Text>

                <View style={styles.classBox}>
                    <Text style={styles.label}>Select Province</Text>
                    <View style={styles.inputBox}>
                        <Dropdown
                            style={styles.dropdown}
                            data={Object.keys(provinceDistrictMap).map(p => ({label: p, value: p}))}
                            labelField="label"
                            valueField="value"
                            placeholder="Select Province"
                            value={province}
                            onChange={item => {
                                setProvince(item.value);
                                setDistrict(null);
                                setZonal(null);
                                setSelectedSchool(null);
                                setSchools([]);
                            }}
                        />
                    </View>
                </View>

                <View style={styles.classBox}>
                    <Text style={styles.label}>Select District</Text>
                    <View style={styles.inputBox}>
                        <Dropdown
                            style={styles.dropdown}
                            data={(province ? provinceDistrictMap[province] : []).map(d => ({label: d, value: d}))}
                            labelField="label"
                            valueField="value"
                            placeholder="Select District"
                            value={district}
                            onChange={item => {
                                setDistrict(item.value);
                                setZonal(null);
                                setSelectedSchool(null);
                                setSchools([]);
                            }}
                            disable={!province}
                        />
                    </View>
                </View>

                <View style={styles.classBox}>
                    <Text style={styles.label}>Select Zonal</Text>
                    <View style={styles.inputBox}> <Dropdown
                        style={styles.dropdown}
                        data={(district ? districtZoneMap[district] : []).map(z => ({label: z, value: z}))}
                        labelField="label"
                        valueField="value"
                        placeholder="Select Zonal"
                        value={zonal}
                        onChange={item => {
                            setZonal(item.value);
                            setSelectedSchool(null);
                            fetchSchools(item.value); // load schools
                        }}
                        disable={!district}
                    />
                    </View>
                </View>

                <View style={styles.classBox}>
                    <Text style={styles.label}>Select School</Text>
                    <View style={styles.inputBox}>
                        <Dropdown
                            style={styles.dropdown}
                            data={schools}
                            labelField="label"
                            valueField="value"
                            placeholder="Select School"
                            value={selectedSchool}
                            onChange={item => setSelectedSchool(item.value)}
                            disable={!zonal}
                        />
                    </View>
                </View>

                <TouchableOpacity style={styles.loginButton} onPress={handleRegister}>
                    <Text style={styles.loginButtonText}>Register</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.replace('/LoginScreen')}
                >
                    <Text style={styles.backButtonText}>Back to Login</Text>
                </TouchableOpacity>
            </ScrollView>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    backgroundImage: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    container: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginVertical: 15,
        color: '#fff',
    },
    subtitle: {
        fontSize: 16,
        color: '#fff',
        marginBottom: 30,
    },
    input: {
        width: '100%',
        height: 50,
        backgroundColor: '#fff',
        borderRadius: 10,
        paddingHorizontal: 15,
        marginBottom: 20,
        fontSize: 16,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    loginButton: {
        width: '100%',
        height: 50,
        backgroundColor: '#007AFF',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    loginButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    backButton: {
        width: '100%',
        height: 50,
        backgroundColor: '#005BB5',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    backButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    gradeBox: {flex: 1, marginRight: 10},
    classBox: {
        display: "flex",
        width: '100%',
        height: 50,
        marginBottom: 40
    },
    inputBox: {
        backgroundColor: '#fff',
        padding: 12,
        borderRadius: 8,
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4
    },
    dropdown: {backgroundColor: 'transparent'},
    placeholderStyle: {fontSize: 16, color: '#888'},
    selectedTextStyle: {fontSize: 16, color: '#333'},
    iconStyle: {width: 20, height: 20},
    label: {fontSize: 14, color: '#ffffff', marginBottom: 8},
});
