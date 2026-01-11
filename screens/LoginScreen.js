import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Image,
    TouchableOpacity,
    ActivityIndicator,
    Modal
} from 'react-native';
import { COLORS, COMMON_STYLES, SIZES, SHADOWS } from '../styles/theme';
import CustomButton from '../components/CustomButton';
import * as Location from 'expo-location';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { login as apiLogin, register as apiRegister } from '../utils/api';
import { useMockContext } from '../utils/MockContext';
import { useLanguage } from '../i18n/LanguageContext';
import { getFCMToken, onMessageListener } from '../utils/fcmHelper';

const LoginScreen = ({ navigation }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [secureTextEntry, setSecureTextEntry] = useState(true);
    const [langModalVisible, setLangModalVisible] = useState(false);

    const { login } = useMockContext();
    const { t, changeLanguage, language, languages } = useLanguage();

    const toggleSecureEntry = () => {
        setSecureTextEntry(!secureTextEntry);
    };

    const validateInput = () => {
        setError('');
        if (!isLogin && !name.trim()) return t('invalidInput');
        if (!email.trim()) return t('invalidInput');
        if (!password.trim()) return t('invalidInput');
        return null;
    };

    // FCM Listener
    React.useEffect(() => {
        const unsubscribe = onMessageListener(async remoteMessage => {
            console.log("Notification:", remoteMessage);
            Alert.alert(
                remoteMessage.notification?.title || 'New Notification',
                remoteMessage.notification?.body || JSON.stringify(remoteMessage.data)
            );
        });
        return unsubscribe;
    }, []);

    const handleAuth = async () => {
        const validationError = validateInput();
        if (validationError) {
            setError(validationError);
            Alert.alert(t('invalidInput'), validationError);
            return;
        }

        setLoading(true);

        try {
            try {
                const { status } = await Location.requestForegroundPermissionsAsync();
            } catch (permError) {
                console.log("Location permission error:", permError);
            }

            // Get FCM Token (Safe Helper)
            const fcmToken = await getFCMToken();
            console.log("FCM Token Used:", fcmToken);

            // LOGIN - Send token (real or mock)
            const response = await apiLogin(email, password, fcmToken);

            if (response.success || response.token) {
                const userObj = response.user || { name: 'Worker', email: email, role: 'worker' };
                await login(userObj, response.token);
                navigation.replace('MainApp');
            } else {
                throw new Error(response.message || 'Login failed');
            }

        } catch (error) {
            console.log('Auth Error:', error);
            const errorMsg = typeof error === 'string' ? error : (error.message || JSON.stringify(error) || t('authFailed'));
            setError(errorMsg);
            setLoading(false); // Only stop loading on error
        } finally {
            if (error) setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setLoading(true);
        setTimeout(async () => {
            setLoading(false);
            const mockUser = { name: 'Google User', email: 'user@gmail.com', u_id: 'g_123' };
            await login(mockUser, 'mock_token');
            navigation.replace('MainApp');
        }, 1500);
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={COMMON_STYLES.container}
            >
                <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>

                    {/* Header Section */}
                    <View style={styles.header}>
                        <TouchableOpacity
                            style={styles.langButton}
                            onPress={() => setLangModalVisible(true)}
                        >
                            <Ionicons name="language" size={20} color={COLORS.primary} />
                            <Ionicons name="chevron-down" size={16} color={COLORS.primary} style={{ marginLeft: 2 }} />
                        </TouchableOpacity>

                        <Image source={require('../assets/logo.png')} style={styles.logo} resizeMode="contain" />
                        <Text style={styles.title}>{isLogin ? t('welcomeBack') : t('joinMission')}</Text>
                        <Text style={styles.subtitle}>
                            {isLogin ? t('signInDesc') : t('registerDesc')}
                        </Text>
                    </View>

                    {/* Form Section */}
                    <View style={styles.cardForm}>
                        {/* Removed Register Logic */}
                        {error ? <Text style={styles.errorText}>{error}</Text> : null}

                        <View style={styles.inputContainer}>
                            <Ionicons name="mail-outline" size={20} color={COLORS.textLight} style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder={t('mobileOrEmail') || t('emailPlaceholder')}
                                placeholderTextColor="#999"
                                value={email}
                                onChangeText={setEmail}
                                autoCapitalize="none"
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <Ionicons name="lock-closed-outline" size={20} color={COLORS.textLight} style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder={t('passwordPlaceholder')}
                                placeholderTextColor="#999"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry={secureTextEntry}
                            />
                            <TouchableOpacity onPress={toggleSecureEntry} style={styles.eyeIcon}>
                                <Ionicons name={secureTextEntry ? "eye-off-outline" : "eye-outline"} size={20} color={COLORS.textLight} />
                            </TouchableOpacity>
                        </View>

                        <CustomButton
                            title={t('login')}
                            onPress={handleAuth}
                            loading={loading}
                            style={styles.authButton}
                        />
                    </View>

                    {/* Footer decoration */}
                    <View style={styles.footer}>
                        <Text style={styles.footerText}>{t('missionInitiative')}</Text>
                    </View>

                </ScrollView>
            </KeyboardAvoidingView>

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
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 20,
    },
    header: {
        alignItems: 'center',
        marginBottom: 30,
        position: 'relative',
        width: '100%',
    },
    langButton: {
        position: 'absolute',
        top: 0,
        right: 0,
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 12,
        backgroundColor: COLORS.white,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: COLORS.border,
        zIndex: 10,
        ...SHADOWS.light
    },
    langText: {
        marginLeft: 5,
        fontWeight: 'bold',
        color: COLORS.primary,
        fontSize: 12,
        marginRight: 4,
    },
    logo: {
        width: 120,
        height: 120,
        marginBottom: 10,
    },
    title: {
        fontSize: 26,
        color: COLORS.text,
        fontWeight: 'bold',
        marginBottom: 8,
        textAlign: 'center'
    },
    subtitle: {
        fontSize: 14,
        color: COLORS.textLight,
        textAlign: 'center',
        paddingHorizontal: 20,
    },
    cardForm: {
        backgroundColor: COLORS.white,
        borderRadius: 20,
        padding: 20,
        ...COMMON_STYLES.shadow,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.background,
        borderRadius: 12,
        marginBottom: 15,
        paddingHorizontal: 15,
        height: 55,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    inputIcon: {
        marginRight: 10,
    },
    eyeIcon: {
        padding: 5,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: COLORS.text,
        height: '100%',
    },
    authButton: {
        marginTop: 10,
        marginBottom: 20,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5,
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: COLORS.border,
    },
    dividerText: {
        marginHorizontal: 10,
        color: COLORS.textLight,
        fontSize: 12,
        fontWeight: '600',
    },
    googleButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.white,
        borderWidth: 1,
        borderColor: COLORS.border,
        height: 55,
        borderRadius: 12,
        marginBottom: 20,
    },
    googleButtonText: {
        color: COLORS.text,
        fontWeight: '600',
        fontSize: 14,
    },
    toggleContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 10,
    },
    toggleText: {
        color: COLORS.textLight,
        fontSize: 14,
    },
    toggleLink: {
        color: COLORS.primary,
        fontWeight: 'bold',
        fontSize: 14,
    },
    errorText: {
        color: COLORS.danger,
        textAlign: 'center',
        marginBottom: 15,
        fontWeight: '500',
    },
    footer: {
        marginTop: 30,
        alignItems: 'center',
    },
    footerText: {
        color: COLORS.textLight,
        fontSize: 12,
        opacity: 0.6,
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

export default LoginScreen;
