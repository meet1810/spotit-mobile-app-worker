import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import LottieView from 'lottie-react-native';
import { COLORS, GLOBAL_STYLES } from '../styles/theme';
import i18n from '../i18n';
import Ionicons from 'react-native-vector-icons/Ionicons';

const { width, height } = Dimensions.get('window');

const TaskOnboardingScreen = ({ route, navigation }) => {
    const { task } = route.params || {};
    // Mock current location (starting point)
    const [currentLocation, setCurrentLocation] = useState({
        latitude: task ? task.coordinate.latitude - 0.005 : 28.6100,
        longitude: task ? task.coordinate.longitude - 0.005 : 77.2000,
    });

    // Mock movement
    useEffect(() => {
        // In a real app, this would be live GPS updates
        const interval = setInterval(() => {
            setCurrentLocation(prev => ({
                latitude: prev.latitude + 0.0001,
                longitude: prev.longitude + 0.0001,
            }));
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const handleArrived = () => {
        navigation.replace('WorkCompletion', { task });
    };

    if (!task) return null;

    return (
        <View style={GLOBAL_STYLES.container}>
            <MapView
                style={styles.map}
                initialRegion={{
                    latitude: currentLocation.latitude,
                    longitude: currentLocation.longitude,
                    latitudeDelta: 0.005,
                    longitudeDelta: 0.005,
                }}
                region={{
                    latitude: currentLocation.latitude,
                    longitude: currentLocation.longitude,
                    latitudeDelta: 0.005,
                    longitudeDelta: 0.005,
                }}
            >
                {/* Destination */}
                <Marker coordinate={task.coordinate} title={task.locationName} pinColor={COLORS.primary} />

                {/* Current Location (Worker/Truck) */}
                <Marker coordinate={currentLocation}>
                    <View style={styles.markerContainer}>
                        <Ionicons name="bus" size={24} color={COLORS.secondary} />
                    </View>
                </Marker>

                {/* Path Line */}
                <Polyline
                    coordinates={[currentLocation, task.coordinate]}
                    strokeColor={COLORS.secondary}
                    strokeWidth={3}
                    lineDashPattern={[5, 5]}
                />
            </MapView>

            {/* Overlay UI */}
            <View style={styles.overlay}>
                <View style={styles.headerCard}>
                    <Text style={styles.navText}>{i18n.t('navigating')}</Text>
                    <Text style={styles.destText}>To: {task.locationName}</Text>
                </View>

                {/* Lottie Animation Layer - Floating */}
                <View style={styles.lottieContainer} pointerEvents="none">
                    {/* Using the mock truck.json. 
                 In real implementation, this would be a high quality truck animation. 
                 Since we have a placeholder, we add a Visual cue too. */}
                    <LottieView
                        source={require('../assets/truck.json')}
                        autoPlay
                        loop
                        style={styles.lottie}
                    />
                    {/* Fallback visual if lottie is empty/invisible */}
                    <Ionicons name="navigate-circle" size={80} color={COLORS.primary} style={{ opacity: 0.8 }} />
                </View>

                <TouchableOpacity style={styles.arrivedButton} onPress={handleArrived}>
                    <Text style={styles.buttonText}>Arrived at Location</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    markerContainer: {
        backgroundColor: COLORS.white,
        padding: 5,
        borderRadius: 20,
        elevation: 5,
    },
    overlay: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        justifyContent: 'space-between',
        padding: 20,
        paddingTop: 50, // Status bar
    },
    headerCard: {
        backgroundColor: COLORS.white,
        padding: 15,
        borderRadius: 12,
        elevation: 4,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
    },
    navText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.primary,
        marginBottom: 5,
    },
    destText: {
        fontSize: 14,
        color: COLORS.textSecondary,
    },
    lottieContainer: {
        alignSelf: 'center',
        width: 200,
        height: 200,
        justifyContent: 'center',
        alignItems: 'center',
    },
    lottie: {
        width: '100%',
        height: '100%',
        position: 'absolute',
    },
    arrivedButton: {
        backgroundColor: COLORS.success,
        padding: 18,
        borderRadius: 12,
        alignItems: 'center',
        elevation: 4,
    },
    buttonText: {
        color: COLORS.white,
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default TaskOnboardingScreen;
