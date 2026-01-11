import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { COLORS } from '../styles/theme';

const CustomButton = ({ title, onPress, type = 'primary', style, loading = false, disabled = false }) => {
    return (
        <TouchableOpacity
            style={[
                styles.button,
                type === 'outline' ? styles.outline : styles.primary,
                (disabled || loading) && styles.disabled,
                style
            ]}
            onPress={onPress}
            disabled={disabled || loading}
            activeOpacity={0.7}
        >
            {loading ? (
                <ActivityIndicator color={type === 'outline' ? COLORS.primary : COLORS.white} />
            ) : (
                <Text style={[
                    styles.text,
                    type === 'outline' ? styles.outlineText : styles.primaryText
                ]}>
                    {title}
                </Text>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        borderRadius: 12,
        paddingVertical: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    primary: {
        backgroundColor: COLORS.primary,
    },
    outline: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: COLORS.primary,
    },
    text: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    primaryText: {
        color: COLORS.white,
    },
    outlineText: {
        color: COLORS.primary,
    },
    disabled: {
        opacity: 0.7,
    }
});

export default CustomButton;
