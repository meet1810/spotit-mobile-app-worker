import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS } from '../styles/theme';
import Ionicons from 'react-native-vector-icons/Ionicons';

const FailureScreen = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <View style={styles.iconCircle}>
                <Ionicons name="close" size={60} color={COLORS.white} />
            </View>

            <Text style={styles.title}>Submission Failed</Text>
            <Text style={styles.subtitle}>Check your internet connection and try again.</Text>

            <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.goBack()}
            >
                <Text style={styles.buttonText}>Retry</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.secondaryButton}
                onPress={() => navigation.navigate('Home')}
            >
                <Text style={styles.secondaryButtonText}>Cancel</Text>
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
        backgroundColor: COLORS.error,
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
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 14,
        color: COLORS.textSecondary,
        textAlign: 'center',
        marginBottom: 40,
    },
    button: {
        width: '100%',
        padding: 16,
        borderRadius: 12,
        backgroundColor: COLORS.primary,
        alignItems: 'center',
        marginBottom: 15,
    },
    buttonText: {
        color: COLORS.white,
        fontSize: 18,
        fontWeight: 'bold',
    },
    secondaryButton: {
        padding: 16,
    },
    secondaryButtonText: {
        color: COLORS.textSecondary,
        fontSize: 16,
    },
});

export default FailureScreen;
