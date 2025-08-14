import React, { useState } from 'react';
import {
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    ImageBackground,
    Alert
} from 'react-native';
import { useRouter } from 'expo-router';

export default function VerifyCodeScreen() {
    const [otp, setOtp] = useState('');
    const router = useRouter();

    const handleSubmit = () => {
        if (!otp || otp.length !== 6) {
            Alert.alert('Error', 'Please enter a valid 6-digit code');
            return;
        }
        router.push('/ChangePasswordScreen');
    };

    return (
        <ImageBackground
            source={require('@/assets/images/background.jpg')}
            style={styles.backgroundImage}
            resizeMode="cover"
        >
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.title}>We sent a code to your email</Text>
                <Text style={styles.subtitle}>
                    Enter the 6-digit verification code sent to your email address
                </Text>

                <TextInput
                    style={styles.input}
                    placeholder="OTP Code"
                    placeholderTextColor="#888"
                    value={otp}
                    onChangeText={setOtp}
                    keyboardType="number-pad"
                    autoCapitalize="none"
                />

                <TouchableOpacity style={styles.resetButton} onPress={handleSubmit}>
                    <Text style={styles.resetButtonText}>Submit</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.replace('/ForgotPasswordScreen')}
                >
                    <Text style={styles.backButtonText}>Go Back</Text>
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
        paddingHorizontal: 20,
        textAlign: 'center',
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#fff',
    },
    subtitle: {
        paddingHorizontal: 20,
        textAlign: 'center',
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
    resetButton: {
        width: '100%',
        height: 50,
        backgroundColor: '#007AFF',
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
