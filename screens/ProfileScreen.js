import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Image,
    TouchableOpacity,
    SafeAreaView
} from 'react-native';
import { COLORS, GLOBAL_STYLES, SHADOWS } from '../styles/theme';
import Header from '../components/Header';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useMockContext } from '../utils/MockContext';
import i18n from '../i18n';
import { useLanguage } from '../i18n/LanguageContext';

const ProfileScreen = ({ navigation }) => {
    const { t, locale } = useLanguage();
    const { user, logout } = useMockContext();

    const handleLogout = async () => {
        await logout();
        navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
        });
    };

    return (
        <View style={GLOBAL_STYLES.container}>
            <Header title="Profile" showLogo={true} />

            <ScrollView contentContainerStyle={styles.content}>

                {/* Profile Card */}
                <View style={styles.profileCard}>
                    <View style={styles.avatarContainer}>
                        <View style={styles.avatarCircle}>
                            <Text style={styles.avatarInitial}>{user?.name ? user.name.charAt(0).toUpperCase() : 'U'}</Text>
                        </View>
                        <View style={styles.editIconBadge}>
                            <Ionicons name="camera" size={12} color={COLORS.white} />
                        </View>
                    </View>

                    <Text style={styles.userName}>{user?.name || 'Worker'}</Text>
                    <Text style={styles.userEmail}>{user?.email || 'worker@spotit.com'} | {t('sanitationWorker') || 'Sanitation Worker'}</Text>

                    <View style={styles.locationContainer}>
                        <Ionicons name="location-sharp" size={14} color={COLORS.textSecondary} />
                        <Text style={styles.locationText}>{user?.zone || 'Zone 1'}</Text>
                    </View>
                </View>

                {/* Stats Grid */}
                <View style={styles.statsGrid}>
                    <View style={styles.statCard}>
                        <View style={[styles.iconCircle, { backgroundColor: '#FFF0E6' }]}>
                            <Ionicons name="camera" size={20} color={COLORS.primary} />
                        </View>
                        <Text style={styles.statValue}>{user?.totalTasks || 0}</Text>
                        <Text style={styles.statLabel}>{t('tasksDone') || 'Tasks Done'}</Text>
                    </View>

                    <View style={styles.statCard}>
                        <View style={[styles.iconCircle, { backgroundColor: '#FFFAEB' }]}>
                            <Ionicons name="trophy" size={20} color="#FFC107" />
                        </View>
                        <Text style={styles.statValue}>{user?.points || 0}</Text>
                        <Text style={styles.statLabel}>{t('points')}</Text>
                    </View>

                    <View style={styles.statCard}>
                        <View style={[styles.iconCircle, { backgroundColor: '#E6F4EA' }]}>
                            <Ionicons name="ribbon" size={20} color={COLORS.success} />
                        </View>
                        <Text style={styles.statValue}>{user?.rank || t('guard')}</Text>
                        <Text style={styles.statLabel}>{t('rank')}</Text>
                    </View>
                </View>

                {/* Language Section */}
                <View style={styles.actionButton}>
                    <View style={styles.actionLeft}>
                        <View style={[styles.actionIcon, { backgroundColor: '#FFF0E6' }]}>
                            <Ionicons name="language" size={20} color={COLORS.primary} />
                        </View>
                        <Text style={styles.actionText}>{t('language')}</Text>
                    </View>
                    <View style={styles.actionRight}>
                        <Text style={styles.actionValueText}>{locale === 'en' ? 'English' : 'Hindi'}</Text>
                        <Ionicons name="chevron-forward" size={20} color={COLORS.textLight} />
                    </View>
                </View>

                {/* Settings Header */}
                <Text style={styles.sectionHeader}>{t('settings')}</Text>

                <View style={styles.settingsContainer}>
                    <TouchableOpacity style={styles.settingRow} onPress={() => navigation.navigate('Home')}>
                        <Ionicons name="home-outline" size={22} color={COLORS.textSecondary} />
                        <Text style={styles.settingText}>{t('home')}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.settingRow}>
                        <Ionicons name="notifications-outline" size={22} color={COLORS.textSecondary} />
                        <Text style={styles.settingText}>{t('notifications')}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.settingRow} onPress={handleLogout}>
                        <Ionicons name="log-out-outline" size={22} color={COLORS.error} />
                        <Text style={[styles.settingText, { color: COLORS.error }]}>{t('logout')}</Text>
                    </TouchableOpacity>
                </View>

            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    content: {
        padding: 20,
        paddingBottom: 40,
    },
    profileCard: {
        backgroundColor: COLORS.white,
        borderRadius: 24,
        padding: 30,
        alignItems: 'center',
        marginBottom: 20,
        ...SHADOWS.card,
    },
    avatarContainer: {
        marginBottom: 16,
    },
    avatarCircle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarInitial: {
        fontSize: 48,
        fontWeight: 'bold',
        color: COLORS.white,
    },
    editIconBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: COLORS.success,
        width: 28,
        height: 28,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: COLORS.white,
    },
    userName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.secondary,
        marginBottom: 4,
    },
    userEmail: {
        fontSize: 14,
        color: COLORS.textSecondary,
        marginBottom: 10,
    },
    locationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F3F4F6',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
    },
    locationText: {
        fontSize: 12,
        color: COLORS.textSecondary,
        marginLeft: 4,
    },
    statsGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    statCard: {
        flex: 1,
        backgroundColor: COLORS.white,
        borderRadius: 16,
        padding: 16,
        alignItems: 'center',
        marginHorizontal: 4,
        ...SHADOWS.low,
    },
    iconCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    statValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.secondary,
        marginBottom: 2,
    },
    statLabel: {
        fontSize: 12,
        color: COLORS.textSecondary,
        textAlign: 'center',
    },
    actionButton: {
        backgroundColor: COLORS.white,
        borderRadius: 16,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 24,
        ...SHADOWS.low,
    },
    actionLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    actionIcon: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    actionText: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.secondary,
    },
    actionRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    actionValueText: {
        fontSize: 14,
        color: COLORS.textSecondary,
        marginRight: 8,
    },
    sectionHeader: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.secondary,
        marginBottom: 16,
    },
    settingsContainer: {
        backgroundColor: COLORS.white,
        borderRadius: 24,
        padding: 20,
        ...SHADOWS.low,
    },
    settingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
    },
    settingText: {
        fontSize: 16,
        fontWeight: '500',
        color: COLORS.text,
        marginLeft: 16,
    },
});

export default ProfileScreen;
