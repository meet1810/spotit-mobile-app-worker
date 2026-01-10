import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { COLORS, GLOBAL_STYLES } from '../styles/theme';
import i18n from '../i18n';
import Ionicons from 'react-native-vector-icons/Ionicons';

const SuccessScreen = ({ route, navigation }) => {
    const { points } = route.params || { points: 0 };

    return (
        <View style={styles.container}>
            <View style={styles.iconCircle}>
                <Ionicons name="checkmark" size={60} color={COLORS.white} />
            </View>

            <Text style={styles.title}>{i18n.t('success')}</Text>

            <View style={styles.pointsCard}>
                <Text style={styles.pointsLabel}>{i18n.t('pointsEarned')}</Text>
                <Text style={styles.pointsValue}>+{points}</Text>
            </View>

            <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate('Home')}
            >
                <Text style={styles.buttonText}>{i18n.t('backHome')}</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.white,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 30,
    },
    iconCircle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: COLORS.success,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 30,
        elevation: 5,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.text,
        textAlign: 'center',
        marginBottom: 30,
    },
    pointsCard: {
        backgroundColor: '#FFF3E0',
        padding: 20,
        borderRadius: 12,
        alignItems: 'center',
        width: '100%',
        marginBottom: 40,
        borderWidth: 1,
        borderColor: '#FFE0B2',
    },
    pointsLabel: {
        fontSize: 16,
        color: COLORS.textSecondary,
        marginBottom: 5,
    },
    pointsValue: {
        fontSize: 32,
        fontWeight: 'bold',
        color: COLORS.primary,
    },
    button: {
        width: '100%',
        padding: 16,
        borderRadius: 12,
        backgroundColor: COLORS.secondary,
        alignItems: 'center',
    },
    buttonText: {
        color: COLORS.white,
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default SuccessScreen;
