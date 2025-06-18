import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import {formatDate} from "../utils/utils";

const DropDownMap = ({title, trips = [], setSelectedId }) => {
    const [open, setOpen] = useState(false);
    const toggleDropdown = () => {
        setOpen(!open);
    };

    const handleSelect = (item) => {
        setSelectedId(item.id);
        setOpen(false);
    };

    return (
        <View style={styles.dropDown}>
            <View style={styles.dropdownWrapper}>
                <TouchableOpacity onPress={toggleDropdown} style={styles.dropdownHeader}>
                    <Text style={styles.dropdownHeaderText}>{title}</Text>
                </TouchableOpacity>

                {open && (
                    <View style={styles.dropdownList}>
                        <FlatList
                            data={trips}
                            keyExtractor={(item, index) => (item?.id != null ? item.id.toString() : `trip-${index}`)}
                            renderItem={({ item }) => (
                                <TouchableOpacity onPress={() => handleSelect(item)} style={styles.dropdownItem}>
                                    <Text style={styles.itemText}>User: {item.user_id}</Text>
                                    <Text style={styles.itemText}>Started: {formatDate(item.started_at)}</Text>
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                )}
            </View>
        </View>
    );
};

export default DropDownMap;

const styles = StyleSheet.create({
    dropDown: {
        // flex: 1,
    },
    dropdownWrapper: {
        position: 'absolute',
        top: 50,
        left: 20,
        right: 20,
        zIndex: 10,
        // marginTop: 40,
        // marginHorizontal: 20,
    },
    dropdownHeader: {
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 5,
        elevation: 3,
    },
    dropdownHeaderText: {
        fontSize: 16,
        fontWeight: '500',
    },
    dropdownList: {
        backgroundColor: '#fff',
        borderRadius: 5,
        elevation: 3,
        marginTop: 5,
        maxHeight: 300,
    },
    dropdownItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    itemText: {
        fontSize: 14,
    },
});
