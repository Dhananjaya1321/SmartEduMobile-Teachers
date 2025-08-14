import React, {useState} from 'react';
import {View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, Image} from 'react-native';
import {useRouter} from 'expo-router';

export default function VerifyCodeScreen() {
    const [otp, setOtp] = useState('');
    const router = useRouter();

    const handleSubmit = () => {
        router.push('/ChangePasswordScreen')
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Image source={require('@/assets/images/background.jpg')} style={styles.backgroundImage}
                   resizeMode="cover"/>
            <Text style={styles.title}>We sent a code to your email</Text>
            <Text style={styles.subtitle}>Enter the 6-digit verification code sent to</Text>

            <TextInput
                style={styles.input}
                placeholder="OTP Code"
                value={otp}
                onChangeText={setOtp}
                keyboardType="number-pad"
                autoCapitalize="none"
            />

            <TouchableOpacity style={styles.resetButton} onPress={handleSubmit}>
                <Text style={styles.resetButtonText}>Submit</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.backButton} onPress={() => router.replace('/ForgotPasswordScreen')}>
                <Text style={styles.backButtonText}>Go Back</Text>
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
        paddingVertical: 20,
        backgroundColor: '#F6F9FC',
    },
    title: {
        paddingHorizontal: 20,
        textAlign: "center",
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#ffffff',
    },
    subtitle: {
        paddingHorizontal: 20,
        textAlign: "center",
        fontSize: 16,
        color: '#ffffff',
        marginBottom: 30,
        textAlign: 'center',
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
    resetButton: {
        width: '100%',
        height: 50,
        backgroundColor: 'rgba(0,122,255,0.38)',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    resetButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    backButton: {
        width: '100%',
        height: 50,
        backgroundColor: 'rgba(0,122,255,0.38)',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    backButtonText: {
        color: '#ffffff',
        fontSize: 16,
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
        zIndex: -1
    },
});
