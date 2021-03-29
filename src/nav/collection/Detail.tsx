import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { CollectionRouteProps } from './CollectionRoutes';

export default function Detail({ route, navigation }: CollectionRouteProps<'detail'>) {
    console.log(route);
    return (
        <View>
            <Text></Text>
        </View>
    );
}

const styles = StyleSheet.create({});
