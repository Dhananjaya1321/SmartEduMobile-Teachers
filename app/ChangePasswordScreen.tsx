import React, {useState} from 'react';
import {View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, Image} from 'react-native';
import {useRouter} from 'expo-router';

export default function ChangePasswordScreen() {
    const [newPassword, setNewPassword] = useState('');
    const [conformNewPassword, setConformNewPassword] = useState('');
    const router = useRouter();

    const handleSubmit = () => {
        if (newPassword===conformNewPassword){
            router.push('/LoginScreen')
        }else {
            setConformNewPassword('');
            setNewPassword('');
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Image source={require('@/assets/images/background.jpg')} style={styles.backgroundImage}
                   resizeMode="cover"/>
            <Text style={styles.title}>Change password</Text>
            <Text style={styles.subtitle}>Create a new password for your</Text>

            <TextInput
                style={styles.input}
                placeholder="New Password"
                value={newPassword}
                onChangeText={setNewPassword}
                keyboardType="visible-password"
                autoCapitalize="none"
            />

            <TextInput
                style={styles.input}
                placeholder="Conform New Password"
                value={conformNewPassword}
                onChangeText={setConformNewPassword}
                keyboardType="visible-password"
                autoCapitalize="none"
            />

            <TouchableOpacity style={styles.resetButton} onPress={handleSubmit}>
                <Text style={styles.resetButtonText}>Save</Text>
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
