import { hideAsync, preventAutoHideAsync } from 'expo-splash-screen';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Router from '_nav/Router';
import { ProvideTheme, useCurrentTheme } from '_hooks/theme_provider';
import initialize from './src/initialize';

export default function App() {
    async function initializeApp() {
        try {
            await preventAutoHideAsync();
            await initialize();
        } catch (error) {
            throw new Error(error.message);
        }
        await hideAsync();
    }

    useEffect(() => {
        initializeApp();
    });

    // Wrap contexts here
    return (
        <ProvideTheme>
            <InnerApp />
        </ProvideTheme>
    );
}

function InnerApp() {
    const theme = useCurrentTheme();

    return (
        <SafeAreaProvider>
            <Router />
            <ExpoStatusBar style={theme.dark ? 'light' : 'dark'} backgroundColor={theme.primary.dark} />
        </SafeAreaProvider >
    );
}