import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    FlatList,
    RefreshControl
} from 'react-native';
import * as Location from 'expo-location';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useFocusEffect } from '@react-navigation/native';

import { COLORS, COMMON_STYLES, SHADOWS } from '../styles/theme';
import IssueCard from '../components/IssueCard';
import { useMockContext } from '../utils/MockContext';
import { useLanguage } from '../i18n/LanguageContext';
import { getWorkerTasks } from '../utils/api';
import Header from '../components/Header';

const HomeScreen = ({ navigation }) => {
    // State
    const [city, setCity] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    // Context & Language
    const { points, setUserLocation } = useMockContext();
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
            // const data = await getWorkerTasks(); // Use real API
            // For now, if API fails or returns empty during dev without valid backend, fall back or use empty array
            // But per instruction, we use the API.

            // Assuming getWorkerTasks returns { tasks: [], ... }
            const data = await getWorkerTasks();
            console.log("Tasks response:", data);
            setTasks(data.tasks || []);
        } catch (error) {
            console.log('Error fetching tasks:', error);
            // Optional: fallback to mock if needed, but user wants real API.
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

    const renderTaskItem = ({ item }) => (
        <TouchableOpacity
            onPress={() => navigation.navigate('TaskDetail', { task: item })}
            style={styles.taskCardWrapper}
        >
            <IssueCard issue={item} />
        </TouchableOpacity>
    );

    const renderEmpty = () => (
        <View style={styles.emptyContainer}>
            <Ionicons name="clipboard-outline" size={60} color={COLORS.textLight} />
            <Text style={styles.emptyText}>{t('noTasks')}</Text>
        </View>
    );

    return (
        <View style={COMMON_STYLES.container}>
            {/* Standard Header */}
            <Header showLocation={true} cityOverride={city} />

            <ScrollView
                contentContainerStyle={{ padding: 20, flexGrow: 1 }}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            >
                {/* Rewards / Status Card */}
                {/* <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
                    <View style={[styles.rewardsCard, { backgroundColor: COLORS.primary }]}>
                        <View style={styles.rewardsContent}>
                            <View>
                                <Text style={styles.rewardsLabel}>{t('yourImpact')}</Text>
                                <Text style={styles.rewardsValue}>{points} {t('points')}</Text>
                                <Text style={styles.rewardsSub}>Keep it up, Worker!</Text>
                            </View>
                            <View style={styles.trophyContainer}>
                                <Ionicons name="trophy" size={50} color={COLORS.warning} />
                            </View>
                        </View>
                    </View>
                </TouchableOpacity> */}

                {/* Pending Tasks Header */}
                <View style={styles.sectionHeaderRow}>
                    <Text style={styles.sectionHeader}>{t('pendingTasks')}</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Work')}>
                        <Text style={styles.seeAllText}>{t('seeAll')}</Text>
                    </TouchableOpacity>
                </View>

                {/* Task List */}
                {loading ? (
                    <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 20 }} />
                ) : (
                    <View>
                        {tasks.length === 0 ? renderEmpty() : (
                            tasks.map(item => (
                                <TouchableOpacity
                                    key={item.id}
                                    onPress={() => navigation.navigate('TaskDetail', { task: item })}
                                    style={{ marginBottom: 15 }}
                                >
                                    <IssueCard issue={item} />
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
    rewardsCard: {
        borderRadius: 20,
        padding: 20,
        marginBottom: 25,
        ...SHADOWS.strong,
        overflow: 'hidden',
    },
    rewardsContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    rewardsLabel: {
        color: 'rgba(255,255,255,0.9)',
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 5,
    },
    rewardsValue: {
        color: COLORS.white,
        fontSize: 36,
        fontWeight: 'bold',
    },
    rewardsSub: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 12,
    },
    trophyContainer: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        width: 70,
        height: 70,
        borderRadius: 35,
        justifyContent: 'center',
        alignItems: 'center',
    },

    sectionHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: 15,
    },
    sectionHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        marginBottom: 10,
    },
    seeAllText: {
        color: COLORS.primary,
        fontWeight: '600',
        fontSize: 14,
    },

    emptyContainer: {
        alignItems: 'center',
        marginTop: 50,
        opacity: 0.6
    },
    emptyText: {
        marginTop: 10,
        fontSize: 16,
        color: COLORS.textLight
    },
    taskCardWrapper: {
        marginBottom: 15
    }
});

export default HomeScreen;
