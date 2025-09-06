import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    ImageBackground,
    ScrollView,
    ActivityIndicator
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import * as Linking from 'expo-linking';
import loginAPIController from "@/controllers/LoginController";
import jwtDecode from "jwt-decode";

export default function LoginScreen() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();


    useEffect(() => {
        const checkLoginStatus = async () => {
            const token = await AsyncStorage.getItem("token");
            if (!token) return;

            try {
                const decoded = jwtDecode(token);
                const currentTime = Date.now() / 1000;

                if (decoded.exp < currentTime) {
                    await AsyncStorage.removeItem("token");
                    await AsyncStorage.removeItem("user");
                    router.replace("/LoginScreen");
                } else {
                    router.replace("/");
                }
            } catch (e) {
                await AsyncStorage.removeItem("token");
                await AsyncStorage.removeItem("user");
                router.replace("/LoginScreen");
            }
        };

        checkLoginStatus();
    }, []);


    const handleLogin = async () => {
        if (!username || !password) {
            Alert.alert('Error', 'Please enter both username and password');
            return;
        }

        setLoading(true);
        const result = await loginAPIController.checkLogin(username, password);
        setLoading(false);

        if (result.error) {
            Alert.alert('Login Failed', result.error);
        } else {
            // Save user + token
            await AsyncStorage.setItem('user', JSON.stringify(result));
            await AsyncStorage.setItem('token', result.token);

            router.replace('/');
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

                <TouchableOpacity style={styles.loginButton} onPress={handleLogin} disabled={loading}>
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.loginButtonText}>Login</Text>
                    )}
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
