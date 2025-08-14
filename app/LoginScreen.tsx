import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ImageBackground, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import * as Linking from 'expo-linking';

export default function LoginScreen() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    useEffect(() => {
        const checkLoginStatus = async () => {
            const user = await AsyncStorage.getItem('user');
            if (user) router.replace('/');
        };
        checkLoginStatus();
    }, []);

    const handleLogin = async () => {
        if (username === 'teacher' && password === 'password') {
            await AsyncStorage.setItem('user', JSON.stringify({ username }));
            router.replace('/');
        } else {
            Alert.alert('Error', 'Invalid username or password');
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
                <Text style={styles.subtitle}>Please login to continue</Text>

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
                    placeholder="Password"
                    placeholderTextColor="#888"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />

                <TouchableOpacity onPress={() => router.replace('/ForgotPasswordScreen')}>
                    <Text style={styles.forgotPasswordButtonText}>Forgot password?</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                    <Text style={styles.loginButtonText}>Login</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.registerButton} onPress={() => router.replace('/RegisterScreen')}>
                    <Text style={styles.loginButtonText}>Register</Text>
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
    registerButton: {
        width: '100%',
        height: 50,
        backgroundColor: '#005BB5',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
    loginButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    forgotPasswordButtonText: {
        color: '#fff',
        alignSelf: 'flex-end',
        marginBottom: 10,
    },
});
