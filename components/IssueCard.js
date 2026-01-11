import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { COLORS, SHADOWS } from '../styles/theme';
import { NATIVE_PUBLIC_URL } from '../constants/Config';

const IssueCard = ({ issue }) => {
    // Helper to get Status Color
    const getStatusColor = (status) => {
        switch (status) {
            case 'RESOLVED': return COLORS.success;
            case 'IN_PROGRESS': return COLORS.warning || '#FFA500';
            case 'PENDING': return COLORS.danger;
            default: return COLORS.secondary;
        }
    };

    // Construct Image URL
    const imageUrl = issue.imagePath
        ? (issue.imagePath.startsWith('http') ? issue.imagePath : `${NATIVE_PUBLIC_URL}/${issue.imagePath}`)
        : null;

    return (
        <View style={styles.card}>
            <Image
                source={imageUrl ? { uri: imageUrl } : require('../assets/icon.png')}
                style={styles.thumbnail}
            />
            <View style={styles.content}>
                <View style={[styles.badge, { backgroundColor: getStatusColor(issue.status) }]}>
                    <Text style={styles.badgeText}>{issue.status}</Text>
                </View>
                <Text style={styles.date}>{new Date(issue.createdAt || Date.now()).toLocaleDateString()}</Text>
                <Text style={styles.title}>{issue.category || 'Issue'}</Text>
                <Text style={styles.subtitle}>Severity: {issue.severity}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: COLORS.white,
        borderRadius: 16,
        padding: 12,
        marginBottom: 16,
        flexDirection: 'row',
        ...SHADOWS.low,
    },
    thumbnail: {
        width: 80,
        height: 80,
        backgroundColor: '#EEEEEE',
        borderRadius: 12,
        marginRight: 16,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
    },
    badge: {
        alignSelf: 'flex-start',
        borderRadius: 4,
        paddingHorizontal: 8,
        paddingVertical: 3,
        marginBottom: 6,
    },
    badgeText: {
        color: COLORS.white,
        fontSize: 10,
        fontWeight: 'bold',
    },
    date: {
        fontSize: 12,
        color: COLORS.textSecondary,
        marginBottom: 2,
    },
    title: {
        fontSize: 16,
        fontWeight: '700',
        color: COLORS.secondary,
        marginBottom: 2,
    },
    subtitle: {
        fontSize: 12,
        color: COLORS.textLight,
    },
});

export default IssueCard;
