
import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
} from 'react-native';

import { Actions } from 'react-native-router-flux';

export default class SearchRow extends Component {

    render() {
        const { data, filter, parentRef, action } = this.props;

        return (
            <TouchableOpacity onPress={() => action(parentRef, data)} style={styles.container}>

                {filter.map((item, i) => {

                    return <Text key={i} style={styles.text} > {i == 0 ? data[item] : ' - ' + data[item]}</Text>
                })}
            </TouchableOpacity>

        );
    }
}

const styles = StyleSheet.create({

    container: {
        flexDirection: 'row',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#E4E4E4',

    },
    text: {
        textAlign: 'left',
        fontSize: 22,
        flexWrap: 'wrap'
    },

});

