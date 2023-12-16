import React, { Component } from 'react'
import {View, Text} from 'react-native'
export default class Errors extends Component {
    render() {
        return (
            <View>
                <Text style={textStyle}>{this.props.error}</Text>
            </View>
        )
    }
}
const textStyle = {
    textAlign: "center",
    paddingTop: 10,
    fontSize: 20
}