import { NavigationContainer } from '@react-navigation/native';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Router from '_nav/Router';

export default function App() {
    return (
        <SafeAreaProvider>
            <NavigationContainer>
                <Router />
            </NavigationContainer >
            <ExpoStatusBar />
        </SafeAreaProvider >
    );
}