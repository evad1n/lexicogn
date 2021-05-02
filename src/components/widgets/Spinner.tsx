import { useCurrentTheme } from '@/src/hooks/theme_provider';
import layoutStyles from '@/src/styles/layout';
import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

export default function Spinner() {
    const theme = useCurrentTheme();
    return (
        <View style={layoutStyles.center}>
            <ActivityIndicator style={{ transform: [{ scale: 3 }] }} size={"large"} color={theme.palette.secondaryText} />
        </View>
    );
}

const styles = StyleSheet.create({});
