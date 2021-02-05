import React from 'react';
import {View, StyleSheet} from 'react-native';
import { Table, Row, Rows } from 'react-native-table-component';

const TableStack = props => {
    return (
        <View style={styles.container}>
            <Table borderStyle={{borderWidth: 2, borderColor: '#6B9080'}}>
                <Row data={props.dataHead} style={styles.tableHead} textStyle={styles.tableText}/>
                <Rows data={props.dataTable} style={styles.tableBody} textStyle={styles.tableText}/>
            </Table>
        </View>
    )
}

export default TableStack;

const styles = StyleSheet.create(
    {
    
        container: { flex: 1, paddingHorizontal: 25, paddingVertical:15},
        tableHead: { height: 40, backgroundColor: '#A4C3B2' },
        tableText: { margin: 6 },
        tableBody: { height: 40, backgroundColor: '#fff' }
  
    });