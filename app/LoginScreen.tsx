import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import * as Linking from 'expo-linking';

export default function LoginScreen() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    useEffect(() => {
        const checkLoginStatus = async () => {
            try {
                const user = await AsyncStorage.getItem('user');
                if (user) {
                    router.replace('/');
                }
            } catch (error) {
                console.error('Error checking login status:', error);
            }
        };
        checkLoginStatus();
    }, []);

    const handleLogin = async () => {
        if (username === 'teacher' && password === 'password') {
            try {
                await AsyncStorage.setItem('user', JSON.stringify({ username }));
                router.replace('/');
                const url = 'http://localhost:8081/';
                await Linking.openURL(url).catch(err => {
                    console.error('Failed to open URL:', err);
                    Alert.alert('Error', 'Could not open the destination URL');
                });
            } catch (error) {
                Alert.alert('Error', 'Failed to save login details');
            }
        } else {
            Alert.alert('Error', 'Invalid username or password');
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Image source={require('@/assets/images/background.jpg')} style={styles.backgroundImage} resizeMode="cover" />
            <Text style={styles.title}>Teacher Dashboard</Text>
            <Text style={styles.subtitle}>Please login to continue</Text>

            <TextInput
                style={styles.input}
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
            />

            <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />

            <View style={styles.forgotPasswordButtonView}>
                <TouchableOpacity style={styles.forgotPasswordButton} onPress={() => { /* Add forgot password logic here */ }}>
                    <Text style={styles.forgotPasswordButtonText}>Forgot password?</Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                <Text style={styles.loginButtonText}>Login</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.loginButton} onPress={() => { /* Add register logic here */ }}>
                <Text style={styles.loginButtonText}>Register</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
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
        color: '#ffffff',
    },
    subtitle: {
        fontSize: 16,
        color: '#ffffff',
        marginBottom: 30,
        zIndex:10
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
        backgroundColor: 'rgba(0,122,255,0.38)',

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
    backgroundImage: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        width: '100%',
        height: '100%',
        zIndex:-1
    },
    forgotPasswordButton: {
        backgroundColor: 'transparent',
    },
    forgotPasswordButtonText: {
        color: '#fff',
    },
    forgotPasswordButtonView: {
        width: '100%',
        display: 'flex',
        alignItems: 'flex-end',
        marginRight: 50,
        marginVertical: 10,
    },
});
