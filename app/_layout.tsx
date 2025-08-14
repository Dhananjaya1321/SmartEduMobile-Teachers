import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

import { useColorScheme } from '@/hooks/useColorScheme';
import RegisterScreen from "@/app/RegisterScreen";
import ForgotPasswordScreen from "@/app/ForgotPasswordScreen";
import VerifyCodeScreen from "@/app/VerifyCodeScreen";
import ChangePasswordScreen from "@/app/ChangePasswordScreen";

export default function RootLayout() {
    const colorScheme = useColorScheme();
    const [loaded] = useFonts({
        SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    });
    const router = useRouter();

    useEffect(() => {
        const checkLoginStatus = async () => {
            try {
                const user = await AsyncStorage.getItem('user');
                if (!user) {
                    router.replace('/LoginScreen');
                }
            } catch (error) {
                console.error('Error checking login status:', error);
            }
        };
        checkLoginStatus();
    }, []);

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
                <Stack.Screen
                    name="StudentFullReportScreen"
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="MarkAttendanceScreen"
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="ViewAttendanceScreen"
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="AttendanceReportOfAllStudents"
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="ViewStudentsTodayAttendance"
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="MyClassSchedule"
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="OtherClassSchedules"
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="MyClassStudentsScreen"
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="OtherClassesITaughtScreen"
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="OtherClassStudentsScreen"
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="AddNewStudentScreen"
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="ALExamScheduleScreen"
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="OLExamScheduleScreen"
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="ScholarshipExamScheduleScreen"
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="SemesterExamScheduleScreen"
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="LoginScreen"
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="RegisterScreen"
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="ForgotPasswordScreen"
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="VerifyCodeScreen"
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="ChangePasswordScreen"
                    options={{ headerShown: false }}
                />
            </Stack>
            <StatusBar style="auto" />
        </ThemeProvider>
    );
}
