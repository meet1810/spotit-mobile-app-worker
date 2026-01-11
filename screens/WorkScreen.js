import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { COLORS, GLOBAL_STYLES, SHADOWS } from '../styles/theme';
import Header from '../components/Header';
import i18n from '../i18n';
import { MOCK_TASKS } from '../services/mockData';
import Ionicons from 'react-native-vector-icons/Ionicons';

const WorkScreen = ({ navigation }) => {
    const [activeTab, setActiveTab] = useState('All');
    const [tasks] = useState(MOCK_TASKS);

    const renderTaskItem = ({ item }) => (
        <TouchableOpacity
            style={styles.taskItem}
            onPress={() => navigation.navigate('TaskDetail', { task: item })}
        >
            <View style={styles.thumbnailPlaceholder} />

            <View style={styles.taskContent}>
                <View style={styles.badgeRow}>
                    <View style={[styles.badge, { backgroundColor: item.status === 'pending' ? '#2E8B57' : COLORS.secondary }]}>
                        <Text style={styles.badgeText}>{item.status === 'pending' ? 'Assigned' : 'Analyzed'}</Text>
                    </View>
                </View>

                <Text style={styles.dateText}>1/10/2026</Text>
                <Text style={styles.titleText}>{item.locationName}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={GLOBAL_STYLES.container}>
            <Header title="Work" showLogo={true} />

            <View style={styles.tabContainer}>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'All' && styles.activeTab]}
                    onPress={() => setActiveTab('All')}
                >
                    <Text style={[styles.tabText, activeTab === 'All' && styles.activeTabText]}>All</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.tab, activeTab === 'Recent' && styles.activeTab]}
                    onPress={() => setActiveTab('Recent')}
                >
                    <Text style={[styles.tabText, activeTab === 'Recent' && styles.activeTabText]}>Recent</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={tasks}
                renderItem={renderTaskItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    tabContainer: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        marginBottom: 10,
        marginTop: 10,
    },
    tab: {
        paddingHorizontal: 24,
        paddingVertical: 10,
        borderRadius: 20,
        backgroundColor: '#F3F4F6',
        marginRight: 12,
    },
    activeTab: {
        backgroundColor: COLORS.primary,
    },
    tabText: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.textSecondary,
    },
    activeTabText: {
        color: COLORS.white,
    },
    listContent: {
        padding: 20,
    },
    taskItem: {
        backgroundColor: COLORS.white,
        borderRadius: 16,
        padding: 12,
        marginBottom: 16,
        flexDirection: 'row',
        ...SHADOWS.low,
        borderWidth: 1,
        borderColor: '#F0F0F0',
    },
    thumbnailPlaceholder: {
        width: 70,
        height: 70,
        backgroundColor: '#EEEEEE',
        borderRadius: 12,
        marginRight: 16,
    },
    taskContent: {
        flex: 1,
        justifyContent: 'center',
    },
    badgeRow: {
        flexDirection: 'row',
        marginBottom: 6,
    },
    badge: {
        borderRadius: 4,
        paddingHorizontal: 8,
        paddingVertical: 3,
    },
    badgeText: {
        fontSize: 10,
        color: COLORS.white,
        fontWeight: 'bold',
    },
    dateText: {
        fontSize: 12,
        color: COLORS.textSecondary,
        marginBottom: 2,
    },
    titleText: {
        fontSize: 16,
        fontWeight: '700',
        color: COLORS.secondary,
    },
});

export default WorkScreen;
