import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, TouchableOpacity, Image } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { COLORS, GLOBAL_STYLES, SHADOWS } from '../styles/theme';
import Header from '../components/Header';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { NATIVE_PUBLIC_URL } from '../constants/Config';

const { width } = Dimensions.get('window');

const TaskDetailScreen = ({ route, navigation }) => {
    const { task } = route.params || {};

    const handleAction = async () => {
        navigation.navigate('WorkCompletion', { task });
    };

    const imageUrl = task?.imagePath
        ? (task.imagePath.startsWith('http') ? task.imagePath : `${NATIVE_PUBLIC_URL}/${task.imagePath}`)
        : null;

    const getStatusColor = (status) => {
        switch (status) {
            case 'RESOLVED': return COLORS.success;
            case 'IN_PROGRESS': return COLORS.warning || '#FFA500';
            case 'PENDING': return COLORS.danger;
            default: return COLORS.primary;
        }
    };

    return (
        <View style={GLOBAL_STYLES.container}>
            <Header title="Issue Details" showLogo={false} showBack={true} navigation={navigation} />

            <ScrollView contentContainerStyle={styles.content}>

                {/* Task Image */}
                {imageUrl && (
                    <Image source={{ uri: imageUrl }} style={styles.taskImage} resizeMode="cover" />
                )}

                <View style={styles.headerSection}>
                    <View style={[styles.statusPill, { backgroundColor: getStatusColor(task?.status) }]}>
                        <Text style={styles.statusText}>{task?.status || 'PENDING'}</Text>
                    </View>
                    <Text style={styles.mainTitle}>{task?.category || 'Issue Reported'}</Text>
                    <Text style={styles.dateText}>Posted on {new Date(task?.createdAt || Date.now()).toDateString()}</Text>
                    {task?.severity && <Text style={styles.severityText}>Severity: {task.severity}</Text>}
                </View>

                {/* Location Card with Map */}
                <View style={styles.locationCard}>
                    <View style={styles.cardHeader}>
                        <Ionicons name="location-sharp" size={20} color={COLORS.primary} />
                        <Text style={styles.cardTitle}>Location</Text>
                    </View>
                    <Text style={styles.addressText}>{task?.address || `Lat: ${task?.latitude}, Long: ${task?.longitude}`}</Text>

                    <View style={styles.mapContainer}>
                        <MapView
                            style={styles.map}
                            initialRegion={{
                                latitude: parseFloat(task?.latitude) || 28.6139,
                                longitude: parseFloat(task?.longitude) || 77.2090,
                                latitudeDelta: 0.005,
                                longitudeDelta: 0.005,
                            }}
                            scrollEnabled={false}
                        >
                            {task?.latitude && task?.longitude && (
                                <Marker coordinate={{ latitude: parseFloat(task.latitude), longitude: parseFloat(task.longitude) }} />
                            )}
                        </MapView>
                        <TouchableOpacity style={styles.openMapButton}>
                            <Text style={styles.openMapText}>Open in Google Maps</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Info Card */}
                <View style={styles.infoCard}>
                    <Text style={styles.sectionTitle}>Details</Text>
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Issue ID:</Text>
                        <Text style={styles.detailValue}>#{task?.id}</Text>
                    </View>
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Reporter:</Text>
                        <Text style={styles.detailValue}>
                            {task?.reporter?.name ? `${task.reporter.name} (${task.reporter.type || 'Citizen'})` : 'Anonymous'}
                        </Text>
                    </View>
                </View>

            </ScrollView>

            {/* Footer Action */}
            {task?.status !== 'RESOLVED' && (
                <View style={styles.footer}>
                    <TouchableOpacity style={[styles.actionButton, { backgroundColor: getStatusColor(task?.status) }]} onPress={handleAction}>
                        <Text style={styles.actionButtonText}>
                            {task?.status === 'PENDING' ? 'Start Task' : 'Complete & Resolve'}
                        </Text>
                    </TouchableOpacity>
                </View>
            )}

        </View>
    );
};

const styles = StyleSheet.create({
    content: {
        padding: 20,
        paddingBottom: 100,
    },
    taskImage: {
        width: '100%',
        height: 200,
        borderRadius: 12,
        marginBottom: 20,
    },
    headerSection: {
        marginBottom: 20,
    },
    statusPill: {
        alignSelf: 'flex-start',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 20,
        marginBottom: 10,
    },
    statusText: {
        color: COLORS.white,
        fontWeight: 'bold',
        fontSize: 12,
    },
    mainTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: 5,
    },
    dateText: {
        fontSize: 14,
        color: COLORS.textLight,
    },
    severityText: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.danger,
        marginTop: 5,
    },
    locationCard: {
        backgroundColor: COLORS.white,
        borderRadius: 16,
        padding: 16,
        marginBottom: 20,
        ...SHADOWS.medium,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.secondary,
        marginLeft: 8,
    },
    addressText: {
        fontSize: 14,
        color: COLORS.textSecondary,
        marginBottom: 15,
        lineHeight: 20,
    },
    mapContainer: {
        height: 150,
        borderRadius: 12,
        overflow: 'hidden',
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    openMapButton: {
        position: 'absolute',
        bottom: 10,
        right: 10,
        backgroundColor: COLORS.white,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        elevation: 3,
    },
    openMapText: {
        color: COLORS.primary,
        fontSize: 10,
        fontWeight: 'bold',
    },
    infoCard: {
        backgroundColor: COLORS.white,
        borderRadius: 16,
        padding: 16,
        marginBottom: 20,
        ...SHADOWS.low,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.secondary,
        marginBottom: 15,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
        paddingBottom: 8,
    },
    detailLabel: {
        fontSize: 14,
        color: COLORS.textLight,
    },
    detailValue: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.text,
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
        paddingVertical: 15,
        borderRadius: 12,
        alignItems: 'center',
    },
    actionButtonText: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default TaskDetailScreen;
