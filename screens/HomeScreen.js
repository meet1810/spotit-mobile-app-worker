import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    RefreshControl,
    Switch,
    Dimensions
} from 'react-native';
import * as Location from 'expo-location';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useFocusEffect } from '@react-navigation/native';

import { COLORS, COMMON_STYLES, SHADOWS, SIZES } from '../styles/theme';
import IssueCard from '../components/IssueCard';
import { useMockContext } from '../utils/MockContext';
import { useLanguage } from '../i18n/LanguageContext';
import { getWorkerTasks } from '../utils/api';
import Header from '../components/Header';

const { width } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
    // State
    const [city, setCity] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [activeTab, setActiveTab] = useState('Pending'); // 'Today', 'Pending', 'Completed'
    const [isOnDuty, setIsOnDuty] = useState(true);

    // Context & Language
    const { setUserLocation } = useMockContext();
    const { t } = useLanguage();

    // Initial Location Fetch
    const fetchLocation = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') return;

        let loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });

        try {
            let address = await Location.reverseGeocodeAsync({
                latitude: loc.coords.latitude,
                longitude: loc.coords.longitude
            });

            if (address && address.length > 0) {
                const { city: cityVal, district, region, name, street } = address[0];
                const mainCity = cityVal || district || region || "Unknown City";
                setCity(mainCity);

                const fullAddr = [name, street, district, cityVal, region].filter(Boolean).join(', ');

                if (setUserLocation) {
                    setUserLocation({
                        ...loc.coords,
                        address: fullAddr,
                        city: mainCity
                    });
                }
            }
        } catch (e) {
            console.log("Geocoding error:", e);
            setCity("India");
        }
    };

    const fetchTasks = async () => {
        try {
            setLoading(true);
            const data = await getWorkerTasks();
            console.log("Tasks response:", data);
            setTasks(data.tasks || []);
        } catch (error) {
            console.log('Error fetching tasks:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchTasks();
    }, []);

    useEffect(() => {
        fetchLocation();
    }, []);

    useFocusEffect(
        useCallback(() => {
            fetchTasks();
        }, [])
    );

    // Filtering Logic
    const getFilteredTasks = () => {
        if (!tasks) return [];
        switch (activeTab) {
            case 'Today':
                // Assuming 'createdAt' or 'assignedAt' is available and we filter for today. 
                // For now, let's show PENDING tasks as 'Today's work' or all pending.
                // Or filter by date if strictly required. Let's start with Status based tabs mostly.
                return tasks.filter(task => task.status === 'PENDING' || task.status === 'IN_PROGRESS');
            case 'Pending':
                return tasks.filter(task => task.status === 'PENDING' || task.status === 'ASSIGNED');
            case 'Completed':
                return tasks.filter(task => task.status === 'RESOLVED' || task.status === 'CLOSED');
            default:
                return tasks;
        }
    };

    const filteredTasks = getFilteredTasks();

    const renderEmpty = () => (
        <View style={styles.emptyContainer}>
            <View style={styles.emptyIconCircle}>
                <Ionicons name="checkbox-outline" size={50} color={COLORS.textLight} />
            </View>
            <Text style={styles.emptyText}>{t('noTasks') || 'No tasks found'}</Text>
            <Text style={styles.emptySubText}>
                {activeTab === 'Completed' ? t('noCompletedTasks') : t('caughtUp')}
            </Text>
        </View>
    );

    const TabButton = ({ title, isActive, onPress }) => (
        <TouchableOpacity
            style={[styles.tabButton, isActive && styles.activeTabButton]}
            onPress={onPress}
        >
            <Text style={[styles.tabText, isActive && styles.activeTabText]}>{title}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={COMMON_STYLES.container}>
            <Header showLocation={true} cityOverride={city} />

            {/* Duty Toggle Section */}
            <View style={styles.dutyContainer}>
                <View>
                    <Text style={styles.dutyLabel}>{isOnDuty ? t('onDuty') : t('offDuty')}</Text>
                    <Text style={styles.dutySubLabel}>{isOnDuty ? t('receivingTasks') : t('youAreOffline')}</Text>
                </View>
                <Switch
                    trackColor={{ false: "#767577", true: COLORS.successLight }}
                    thumbColor={isOnDuty ? COLORS.success : "#f4f3f4"}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={() => setIsOnDuty(!isOnDuty)}
                    value={isOnDuty}
                />
            </View>

            <View style={styles.tabContainer}>
                <TabButton title={t('today')} isActive={activeTab === 'Today'} onPress={() => setActiveTab('Today')} />
                <TabButton title={t('pending')} isActive={activeTab === 'Pending'} onPress={() => setActiveTab('Pending')} />
                <TabButton title={t('completed')} isActive={activeTab === 'Completed'} onPress={() => setActiveTab('Completed')} />
            </View>

            <ScrollView
                contentContainerStyle={{ padding: 20, paddingTop: 10, flexGrow: 1 }}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            >
                {loading ? (
                    <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 50 }} />
                ) : (
                    <View>
                        {filteredTasks.length === 0 ? renderEmpty() : (
                            filteredTasks.map(item => (
                                <TouchableOpacity
                                    key={item.id}
                                    onPress={() => navigation.navigate('TaskDetail', { task: item })}
                                    style={styles.taskCardWrapper}
                                    activeOpacity={0.9}
                                >
                                    <IssueCard issue={item} />
                                    {/* Status Badge overlay if needed, but IssueCard might have it */}
                                </TouchableOpacity>
                            ))
                        )}
                    </View>
                )}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    dutyContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: COLORS.white,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    dutyLabel: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    dutySubLabel: {
        fontSize: 12,
        color: COLORS.textLight,
        marginTop: 2,
    },
    tabContainer: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: COLORS.background, // Match screen background
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    tabButton: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
        borderRadius: 20,
        backgroundColor: COLORS.white,
        marginHorizontal: 4,
        ...SHADOWS.light,
        borderWidth: 1,
        borderColor: 'transparent'
    },
    activeTabButton: {
        backgroundColor: COLORS.primary,
        ...SHADOWS.medium,
    },
    tabText: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.textSecondary,
    },
    activeTabText: {
        color: COLORS.white,
    },

    emptyContainer: {
        alignItems: 'center',
        marginTop: 60,
        paddingHorizontal: 40,
    },
    emptyIconCircle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#f5f5f5',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: 8,
    },
    emptySubText: {
        fontSize: 14,
        color: COLORS.textLight,
        textAlign: 'center',
    },
    taskCardWrapper: {
        marginBottom: 15,
    }
});

export default HomeScreen;
