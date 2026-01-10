import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { COLORS, SHADOWS } from '../styles/theme';

const IssueCard = ({ issue }) => {
    return (
        <View style={styles.card}>
            <Image
                source={typeof issue.imageUri === 'string' ? { uri: issue.imageUri } : require('../assets/icon.png')}
                style={styles.thumbnail}
            />
            <View style={styles.content}>
                <View style={[styles.badge, { backgroundColor: issue.status === 'pending' ? COLORS.success : COLORS.secondary }]}>
                    <Text style={styles.badgeText}>{issue.status}</Text>
                </View>
                <Text style={styles.date}>{new Date(issue.timestamp || Date.now()).toLocaleDateString()}</Text>
                <Text style={styles.title}>{issue.locationText || issue.locationName}</Text>
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
        width: 70,
        height: 70,
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
    },
});

export default IssueCard;
