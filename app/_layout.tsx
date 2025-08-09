import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import ManageResultsScreen from "@/app/ManageResultsScreen";
import ManageHomeworkScreen from "@/app/ManageHomeworkScreen";
import AddHomeworkScreen from "@/app/AddHomeworkScreen";
import ManageResultsClassesITaughtScreen from "@/app/ManageResultsClassesITaughtScreen";
import StudentsMarksEntryScreen from "@/app/StudentsMarksEntryScreen";
import MyClassStudentsReportsScreen from "@/app/MyClassStudentsReportsScreen";
import TermExamResultsReleaseScreen from "@/app/TermExamResultsReleaseScreen";
import StudentsReportScreen from "@/app/StudentsReportScreen";

export default function RootLayout() {
    const colorScheme = useColorScheme();
    const [loaded] = useFonts({
        SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    });

    if (!loaded) {
        return null;
    }

    return (
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <Stack>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="+not-found" />
                <Stack.Screen
                    name="ManageAttendanceScreen"
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="ManageTimetableScreen"
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="ManageStudentsScreen"
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="ManageExamsScreen"
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="ManageResultsScreen"
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="ManageHomeworkScreen"
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="AddHomeworkScreen"
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="ViewEventsScreen"
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="ManageResultsClassesITaughtScreen"
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="StudentsMarksEntryScreen"
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="MyClassStudentsReportsScreen"
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="TermExamResultsReleaseScreen"
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="StudentsReportScreen"
                    options={{ headerShown: false }}
                />
            </Stack>
            <StatusBar style="auto" />
        </ThemeProvider>
    );
}
