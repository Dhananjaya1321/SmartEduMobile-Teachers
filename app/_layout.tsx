import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import AttendanceReportOfAllStudents from "@/app/AttendanceReportOfAllStudents";
import ViewStudentsTodayAttendance from "@/app/ViewStudentsTodayAttendance";
import MyClassSchedule from "@/app/MyClassSchedule";
import OtherClassSchedules from "@/app/OtherClassSchedules";
import MyClassStudentsScreen from "@/app/MyClassStudentsScreen";
import OtherClassesITaughtScreen from "@/app/OtherClassesITaughtScreen";
import AddNewStudentScreen from "@/app/AddNewStudentScreen";
import ALExamScheduleScreen from "@/app/ALExamScheduleScreen";
import OLExamScheduleScreen from "@/app/OLExamScheduleScreen";
import ScholarshipExamScheduleScreen from "@/app/ScholarshipExamScheduleScreen";
import SemesterExamScheduleScreen from "@/app/SemesterExamScheduleScreen";


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
            </Stack>
            <StatusBar style="auto" />
        </ThemeProvider>
    );
}
