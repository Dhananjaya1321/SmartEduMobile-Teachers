import React, { useState } from 'react';
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
import { useRouter } from 'expo-router';

export default function RegisterScreen() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [studentRegNumber, setStudentRegNumber] = useState('');
    const router = useRouter();

    const handleRegister = async () => {
        if (!username || !email || !password || !studentRegNumber) {
            Alert.alert('Error', 'All fields are required');
            return;
        }
        if (!email.includes('@') || !email.includes('.')) {
            Alert.alert('Error', 'Please enter a valid email address');
            return;
        }

        try {
            const userData = { username, email, password, studentRegNumber };
            await AsyncStorage.setItem('user', JSON.stringify(userData));
            Alert.alert('Success', 'Registration successful!');
            router.replace('/');
        } catch (error) {
            Alert.alert('Error', 'Failed to register. Please try again.');
        }
    };

    return (
        <ImageBackground
            source={require('@/assets/images/background.jpg')}
            style={styles.backgroundImage}
            resizeMode="cover"
        >
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.title}>Teacher Dashboard</Text>
                <Text style={styles.subtitle}>Register a New Account</Text>

                <TextInput
                    style={styles.input}
                    placeholder="Username"
                    placeholderTextColor="#888"
                    value={username}
                    onChangeText={setUsername}
                    autoCapitalize="none"
                />

                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    placeholderTextColor="#888"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />

                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    placeholderTextColor="#888"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />

                <TextInput
                    style={styles.input}
                    placeholder="Student Registration Number"
                    placeholderTextColor="#888"
                    value={studentRegNumber}
                    onChangeText={setStudentRegNumber}
                    autoCapitalize="none"
                />

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
        marginBottom: 10,
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
});
