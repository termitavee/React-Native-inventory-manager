import React, { Component } from 'react';
import {
    TextInput,
    View,
    ListView,
    StyleSheet,
    Text,
} from 'react-native';
import { Actions } from 'react-native-router-flux';

import SearchRow from '../components/searchRow'
import { setSearchText, updateDataSource } from '../share/utils'
export default class SearchScreen extends Component {

    constructor(props) {
        super(props);
        const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.state = {
            dataSource: ds,
        };

    }

    renderTitle = () => {
        return (
            <Text style={styles.title}>{this.props.title}</Text>
        )
    }

    componentDidMount() {

        Actions.refresh({ renderTitle: this.renderTitle })
        updateDataSource(this, this.props.getItems(this.props.title,this.props));
    }

    render() {
        const { filter, actionSelected, parentRef, loteLimits={} } = this.props
        return (
            <View style={styles.container}>
                <TextInput
                    style={styles.input}
                    onChange={(event) => setSearchText(this, event, this.props.title, this.props.loteLimits)}
                    underlineColorAndroid='transparent'
                    placeholder='buscar'
                />

                < ListView
                    style={styles.list}
                    dataSource={this.state.dataSource}
                    enableEmptySections={true}//evita un warning
                    renderRow={(rowData) => <SearchRow data={rowData} filter={filter} action={actionSelected} parentRef={parentRef} loteLimits={loteLimits}/>}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        marginTop: 55,
    },
    title: {
        alignSelf: 'center',
        fontSize: 20,
        marginTop: 15,
    },
    input: {
        paddingLeft: 30,
        fontSize: 22,
        height: 70,
        borderWidth: 9,
        borderColor: '#E4E4E4',
    },
    list: {
        flex: 1,
        marginBottom: 5,
    },
});