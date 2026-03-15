
import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, StatusBar } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
// import { SafeAreaView } from 'react-native-safe-area-context'; // Original Windows/Native code
import ScreenWrapper from '../components/ScreenWrapper'; // Linux/NewArch Fix


const MoreScreen = () => {
    const options = [
        { id: '1', title: 'About Us', icon: 'info-circle' },
        { id: '2', title: 'Terms & Conditions', icon: 'file-text' },
        { id: '3', title: 'Privacy Policy', icon: 'lock' },
        { id: '4', title: 'Help & Support', icon: 'question-circle' },
        { id: '5', title: 'Share App', icon: 'share-alt' },
        { id: '6', title: 'Rate Us', icon: 'star' },
    ];

    interface OptionItem {
        id: string;
        title: string;
        icon: string;
    }

    const renderItem = ({ item }: { item: OptionItem }) => (
        <TouchableOpacity style={styles.optionItem}>
            <View style={styles.optionLeft}>
                <View style={styles.iconContainer}>
                    <FontAwesome name={item.icon} size={20} color="#94a3b8" />
                </View>
                <Text style={styles.optionTitle}>{item.title}</Text>
            </View>
            <FontAwesome name="chevron-right" size={14} color="#64748b" />
        </TouchableOpacity>
    );

    return (
        <ScreenWrapper 
          style={styles.container} 
          statusBarColor="#0f172a" 
          statusBarStyle="light-content"
          backgroundColor="#0f172a"
        >
            {/* <SafeAreaView style={styles.container}> */} {/* Original code */}
            {/* <StatusBar barStyle="light-content" backgroundColor="#0f172a" /> */} {/* Original code */}




            <View style={styles.header}>
                <Text style={styles.headerTitle}>More</Text>
            </View>

            <FlatList
                data={options}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContent}
            />

            <View style={styles.footer}>
                <Text style={styles.versionText}>Version 1.0.0</Text>
                <Text style={styles.footerText}>Made with ❤️ for Gamers</Text>
            </View>
            {/* </SafeAreaView> */} {/* Original code */}
        </ScreenWrapper>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0f172a',
    },
    header: {
        padding: 20,
        backgroundColor: '#0f172a',
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#f8fafc',
    },
    listContent: {
        paddingHorizontal: 20,
    },
    optionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#1e293b',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#334155',
    },
    optionLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconContainer: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#334155',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    optionTitle: {
        fontSize: 16,
        color: '#94a3b8',
    },
    footer: {
        padding: 24,
        alignItems: 'center',
    },
    versionText: {
        color: '#64748b',
        fontSize: 12,
        marginBottom: 4,
    },
    footerText: {
        color: '#475569',
        fontSize: 12,
    },
});

export default MoreScreen;
