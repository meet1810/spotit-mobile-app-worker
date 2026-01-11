import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Image,
    TouchableOpacity,
    SafeAreaView,
    Modal,
    Alert
} from 'react-native';
import { COLORS, GLOBAL_STYLES, SHADOWS } from '../styles/theme';
import Header from '../components/Header';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useMockContext } from '../utils/MockContext';
import i18n from '../i18n';
import { useLanguage } from '../i18n/LanguageContext';

const ProfileScreen = ({ navigation }) => {
    const { t, locale, changeLanguage, language, languages } = useLanguage();
    const { user, logout } = useMockContext();
    const [langModalVisible, setLangModalVisible] = useState(false);

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
                {/* Profile Card */}
                <View style={styles.profileCard}>
                    <View style={styles.avatarContainer}>
                        <View style={styles.avatarCircle}>
                            <Text style={styles.avatarInitial}>{user?.name ? user.name.charAt(0).toUpperCase() : 'U'}</Text>
                        </View>
                    </View>

                    <Text style={styles.userName}>{user?.name || 'Worker'}</Text>
                    <Text style={styles.userEmail}>{user?.email || 'worker@spotit.com'}</Text>
                    <Text style={[styles.userEmail, { marginTop: -5 }]}>{t('sanitationWorker')}</Text>
                </View>

                {/* Stats Grid - Simplified */}
                <View style={styles.statsGrid}>
                    <View style={[styles.statCard, { flex: 1 }]}>
                        <View style={[styles.iconCircle, { backgroundColor: '#FFF0E6' }]}>
                            <Ionicons name="briefcase" size={20} color={COLORS.primary} />
                        </View>
                        <Text style={styles.statValue}>{user?.totalTasks || 0}</Text>
                        <Text style={styles.statLabel}>{t('tasksDone') || 'Tasks Completed'}</Text>
                    </View>

                    {/* Removed Points and Rank Cards */}
                </View>

                {/* Language Section */}
                {/* Language Section */}
                <TouchableOpacity style={styles.actionButton} onPress={() => setLangModalVisible(true)}>
                    <View style={styles.actionLeft}>
                        <View style={[styles.actionIcon, { backgroundColor: '#FFF0E6' }]}>
                            <Ionicons name="language" size={20} color={COLORS.primary} />
                        </View>
                        <Text style={styles.actionText}>{t('language')}</Text>
                    </View>
                    <View style={styles.actionRight}>
                        <Text style={styles.actionValueText}>
                            {languages.find(l => l.code === language)?.label || (locale === 'en' ? 'English' : 'Hindi')}
                        </Text>
                        <Ionicons name="chevron-forward" size={20} color={COLORS.textLight} />
                    </View>
                </TouchableOpacity>

                {/* Settings Header */}
                <Text style={styles.sectionHeader}>{t('settings')}</Text>

                <View style={styles.settingsContainer}>
                    <TouchableOpacity style={styles.settingRow} onPress={() => navigation.navigate('Home')}>
                        <Ionicons name="home-outline" size={22} color={COLORS.textSecondary} />
                        <Text style={styles.settingText}>{t('home')}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.settingRow} onPress={() => Alert.alert(t('notifications'), t('caughtUp'))}>
                        <Ionicons name="notifications-outline" size={22} color={COLORS.textSecondary} />
                        <Text style={styles.settingText}>{t('notifications')}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.settingRow} onPress={handleLogout}>
                        <Ionicons name="log-out-outline" size={22} color={COLORS.error} />
                        <Text style={[styles.settingText, { color: COLORS.error }]}>{t('logout')}</Text>
                    </TouchableOpacity>
                </View>

            </ScrollView>
            {/* Language Modal */}
            <Modal visible={langModalVisible} animationType="slide" transparent>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>{t('language')}</Text>
                            <TouchableOpacity onPress={() => setLangModalVisible(false)}>
                                <Ionicons name="close" size={24} color={COLORS.text} />
                            </TouchableOpacity>
                        </View>
                        <ScrollView contentContainerStyle={{ padding: 20 }}>
                            {languages.map(lang => (
                                <TouchableOpacity
                                    key={lang.code}
                                    style={[styles.langOption, language === lang.code && styles.selectedLang]}
                                    onPress={() => {
                                        changeLanguage(lang.code);
                                        setLangModalVisible(false);
                                    }}
                                >
                                    <Text style={[styles.langModalText, language === lang.code && { color: COLORS.primary, fontWeight: 'bold' }]}>
                                        {lang.label}
                                    </Text>
                                    {language === lang.code && <Ionicons name="checkmark" size={20} color={COLORS.primary} />}
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                </View>
            </Modal>
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
    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: COLORS.white,
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        height: '60%',
        paddingBottom: 20,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    langOption: {
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    selectedLang: {
        backgroundColor: '#f9f9f9'
    },
    langModalText: {
        fontSize: 16,
        color: COLORS.text,
    }
});

export default ProfileScreen;
