import React, { useState } from 'react';
import {
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    ImageBackground,
    Alert, ActivityIndicator
} from 'react-native';
import {useLocalSearchParams, useRouter} from 'expo-router';
import loginAPIController from "@/controllers/LoginController";

export default function ChangePasswordScreen() {
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const router = useRouter();
    const { email } = useLocalSearchParams<{ email: string }>(); // email passed from VerifyCodeScreen

    const handleSubmit = async () => {
        if (!newPassword || !confirmNewPassword) {
            Alert.alert('Error', 'Please fill in both password fields');
            return;
        }

        if (newPassword !== confirmNewPassword) {
            Alert.alert('Error', 'Passwords do not match');
            setNewPassword('');
            setConfirmNewPassword('');
            return;
        }

        if (!email) {
            Alert.alert('Error', 'Email not found. Please restart the reset process.');
            return;
        }
        console.log("dsd")

        setLoading(true);
        const success = await loginAPIController.updatePassword(newPassword, email);
        setLoading(false);

        if (success) {
            router.replace('/LoginScreen')
        } else {
            Alert.alert('Error', 'Failed to update password. Try again.');
        }
    };
    return (
        <ImageBackground
            source={require('@/assets/images/background.jpg')}
            style={styles.backgroundImage}
            resizeMode="cover"
        >
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.title}>Change Password</Text>
                <Text style={styles.subtitle}>Create a new password for your account</Text>

                <TextInput
                    style={styles.input}
                    placeholder="New Password"
                    placeholderTextColor="#888"
                    value={newPassword}
                    onChangeText={setNewPassword}
                    secureTextEntry
                    autoCapitalize="none"
                />

                <TextInput
                    style={styles.input}
                    placeholder="Confirm New Password"
                    placeholderTextColor="#888"
                    value={confirmNewPassword}
                    onChangeText={setConfirmNewPassword}
                    secureTextEntry
                    autoCapitalize="none"
                />

                <TouchableOpacity
                    style={styles.resetButton}
                    onPress={handleSubmit}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.resetButtonText}>Save</Text>
                    )}
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
});
