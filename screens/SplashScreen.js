import React, { useEffect } from 'react';
import { View, Image, Text, StyleSheet, Dimensions } from 'react-native';
import { COLORS } from '../styles/theme';

const { width } = Dimensions.get('window');

const SplashScreen = ({ navigation }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            navigation.replace('Login');
        }, 2000);
        return () => clearTimeout(timer);
    }, [navigation]);

    return (
        <View style={styles.container}>
            <View style={styles.contentContainer}>
                <Image
                    source={require('../assets/logo.png')}
                    style={styles.logo}
                    resizeMode="contain"
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.white,
        justifyContent: 'center',
        alignItems: 'center',
    },
    contentContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    logo: {
        width: width * 0.8,
        height: 150,
        marginBottom: 20,
    },
    subtitle: {
        fontSize: 16,
        color: COLORS.secondary,
        textAlign: 'center',
        fontWeight: '600',
        marginTop: 10,
    },
});

export default SplashScreen;
