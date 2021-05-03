import { useCurrentTheme } from '@/src/hooks/theme_provider';
import layoutStyles from '@/src/styles/layout';
import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

interface SpinnerProps {
    scale?: number;
}

export default function Spinner({ scale }: SpinnerProps) {
    const theme = useCurrentTheme();
    return (
        <View style={layoutStyles.center}>
            <ActivityIndicator style={{ transform: [{ scale: scale ?? 3 }] }} size={"large"} color={theme.palette.secondaryText} />
        </View>
    );
}

const styles = StyleSheet.create({});
