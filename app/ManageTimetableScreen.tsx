import React from 'react';
import {View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Animated} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {useNavigation, useRouter} from "expo-router";
import ScrollView = Animated.ScrollView;
import MyClassSchedule from "@/app/MyClassSchedule";
import OtherClassSchedules from "@/app/OtherClassSchedules";

const features = [
    { label: 'My class schedule', image: require('@/assets/images/timetable.png'), route: '/MyClassSchedule' },
    { label: 'View other class schedules', image: require('@/assets/images/timetable1.png'), route: '/OtherClassSchedules' },
];

function formatData(data: any[], numColumns: number) {
    const numberOfFullRows = Math.floor(data.length / numColumns);
    let numberOfElementsLastRow = data.length - numberOfFullRows * numColumns;

    while (numberOfElementsLastRow !== 0 && numberOfElementsLastRow !== numColumns) {
        data.push({ label: `blank-${numberOfElementsLastRow}`, empty: true });
        numberOfElementsLastRow++;
    }
    return data;
}

export default function ManageTimetableScreen() {
    const navigation = useNavigation();
    const router = useRouter();
    return (
        <ScrollView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Manage Timetable</Text>
                <Ionicons name="notifications-outline" size={24} color="black" />
            </View>

            {/* Grid */}
            <FlatList
                data={formatData([...features], 2)}
                keyExtractor={(item, index) => index.toString()}
                numColumns={2}
                columnWrapperStyle={{ justifyContent: 'space-between' }}
                renderItem={({ item }) => {
                    if (item.empty) {
                        return <View style={[styles.card, styles.invisibleCard]} />;
                    }
                    return (
                        <TouchableOpacity style={styles.card} onPress={() => item.route && router.push(item.route)}>
                            <Image source={item.image} style={styles.cardImage} />
                            <Text style={styles.cardText}>{item.label}</Text>
                        </TouchableOpacity>
                    );
                }}
            />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F6F9FC', paddingTop: 50, paddingHorizontal: 20 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 50 },
    headerTitle: { fontSize: 18, fontWeight: '600' },
    card: {
        flex: 1,
        margin: 5,
        height: 150,
        borderRadius: 10,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3
    },
    cardImage: { width: 60, height: 60, resizeMode: 'contain', marginBottom: 8 },
    cardText: { fontSize: 12, textAlign: 'center', paddingHorizontal: 15 },
    invisibleCard: { backgroundColor: 'transparent', elevation: 0, shadowOpacity: 0 }
});
