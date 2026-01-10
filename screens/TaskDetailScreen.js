import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { COLORS, GLOBAL_STYLES, SHADOWS } from '../styles/theme';
import Header from '../components/Header';
import Ionicons from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window');

const TaskDetailScreen = ({ route, navigation }) => {
    const { task } = route.params || {};

    const handleStart = () => {
        navigation.navigate('TaskOnboarding', { task });
    };

    return (
        <View style={GLOBAL_STYLES.container}>
            <Header title="Issue Details" showLogo={false} showBack={true} navigation={navigation} />

            <ScrollView contentContainerStyle={styles.content}>

                <View style={styles.headerSection}>
                    <View style={styles.statusPill}>
                        <Text style={styles.statusText}>COUNTED</Text>
                    </View>
                    <Text style={styles.mainTitle}>{task?.title || 'Garbage Dump'}</Text>
                    <Text style={styles.dateText}>Sat Jan 10 2026</Text>
                </View>

                {/* Location Card with Map */}
                <View style={styles.locationCard}>
                    <View style={styles.cardHeader}>
                        <Ionicons name="location-sharp" size={20} color={COLORS.primary} />
                        <Text style={styles.cardTitle}>Location</Text>
                    </View>
                    <Text style={styles.addressText}>{task?.locationName}, New Delhi</Text>

                    <View style={styles.mapContainer}>
                        <MapView
                            style={styles.map}
                            initialRegion={{
                                latitude: task?.coordinate.latitude || 28.6139,
                                longitude: task?.coordinate.longitude || 77.2090,
                                latitudeDelta: 0.005,
                                longitudeDelta: 0.005,
                            }}
                            scrollEnabled={false}
                        >
                            <Marker coordinate={task?.coordinate} />
                        </MapView>
                        <TouchableOpacity style={styles.openMapButton}>
                            <Text style={styles.openMapText}>Open in Google Maps</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Timeline */}
                <Text style={styles.sectionTitle}>Status Timeline</Text>

                <View style={styles.timelineContainer}>
                    {/* Timeline Item 1 */}
                    <View style={styles.timelineItem}>
                        <View style={styles.timelineDot} />
                        <View style={styles.timelineLine} />
                        <View style={styles.timelineContent}>
                            <Text style={styles.timelineTitle}>Issue Submitted!</Text>
                            <Text style={styles.timelineDesc}>Your report was received.</Text>
                            <Text style={styles.timelineTime}>4:28 PM</Text>
                        </View>
                    </View>

                    {/* Timeline Item 2 */}
                    <View style={styles.timelineItem}>
                        <View style={styles.timelineDot} />
                        <View style={styles.timelineContent}>
                            <Text style={styles.timelineTitle}>AI Analysis Complete</Text>
                            <Text style={styles.timelineDesc}>Verified as garbage dump.</Text>
                        </View>
                    </View>
                </View>

            </ScrollView>

            {/* Footer Action */}
            <View style={styles.footer}>
                <TouchableOpacity style={styles.actionButton} onPress={handleStart}>
                    <Text style={styles.actionButtonText}>Start Task</Text>
                </TouchableOpacity>
            </View>

        </View>
    );
};

const styles = StyleSheet.create({
    content: {
        padding: 20,
        paddingBottom: 100,
    },
    headerSection: {
        marginBottom: 24,
    },
    statusPill: {
        backgroundColor: COLORS.primary,
        alignSelf: 'flex-start',
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 20,
        marginBottom: 12,
    },
    statusText: {
        color: COLORS.white,
        fontWeight: 'bold',
        fontSize: 12,
    },
    mainTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: COLORS.white, // In screenshot background is grey, but here we are on white? 
        // Ah, screenshot has GREY background header. Let's stick to clean white for now per "Stunning UI", 
        // or adjust if background is needed. 
        // Actually, Image 0 has a big grey header area. 
        // Let's keep it clean white with dark text for better readability unless requested otherwise.
        color: '#4B5563', // Dark grey
    },
    dateText: {
        fontSize: 16,
        color: '#9CA3AF',
        marginTop: 4,
    },
    // Adjusting for the grey background look from screenshot
    headerSection: {
        marginBottom: 20,
        paddingBottom: 20,
    },

    locationCard: {
        backgroundColor: COLORS.white,
        borderRadius: 20,
        padding: 16,
        marginBottom: 30,
        ...SHADOWS.medium,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.secondary,
        marginLeft: 8,
    },
    addressText: {
        fontSize: 14,
        color: COLORS.textSecondary,
        marginBottom: 16,
        marginLeft: 28,
    },
    mapContainer: {
        height: 180,
        borderRadius: 12,
        overflow: 'hidden',
        position: 'relative',
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    openMapButton: {
        position: 'absolute',
        bottom: 12,
        alignSelf: 'center',
        backgroundColor: COLORS.white,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    openMapText: {
        color: COLORS.primary,
        fontWeight: 'bold',
        fontSize: 12,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.secondary,
        marginBottom: 20,
    },
    timelineContainer: {
        paddingLeft: 10,
    },
    timelineItem: {
        flexDirection: 'row',
        marginBottom: 30,
        position: 'relative',
    },
    timelineDot: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: COLORS.success, // Green dot
        marginRight: 16,
        zIndex: 1,
    },
    timelineLine: {
        position: 'absolute',
        left: 9, // Center of dot (20/2 - 1)
        top: 20,
        bottom: -30,
        width: 2,
        backgroundColor: COLORS.success,
    },
    timelineContent: {
        flex: 1,
    },
    timelineTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.secondary,
        marginBottom: 4,
    },
    timelineDesc: {
        fontSize: 14,
        color: COLORS.textSecondary,
        marginBottom: 2,
    },
    timelineTime: {
        fontSize: 12,
        color: '#9CA3AF',
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: COLORS.white,
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
    },
    actionButton: {
        backgroundColor: COLORS.primary,
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    actionButtonText: {
        color: COLORS.white,
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default TaskDetailScreen;
