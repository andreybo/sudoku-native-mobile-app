import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';

export default class Square extends Component {
    render() {
        const { value, onPress, style, isPreGenerated, size, game = "classic" } = this.props;

        const styles = {
            hold: {
                color: "#4EABF4",
                fontWeight: "regular",
                fontSize: size, // Using size from props
            },
            default: {
                color: "#313234",
                fontWeight: "bold",
                fontSize: size, // Using size from props
            }
        }

        const images = {
            0: require('../assets/games/eggs/d0.png'),
            1: require('../assets/games/eggs/d1.png'),
            2: require('../assets/games/eggs/d2.png'),
            3: require('../assets/games/eggs/d3.png'),
            4: require('../assets/games/eggs/d4.png'),
            5: require('../assets/games/eggs/d5.png'),
            6: require('../assets/games/eggs/d6.png'),
            7: require('../assets/games/eggs/d7.png'),
            8: require('../assets/games/eggs/d8.png'),
            9: require('../assets/games/eggs/d9.png'),
        };

        return (
            <TouchableOpacity onPress={onPress} style={style}>
                { game === 'eggs' && images[value.value] ? 
                    <Image 
                    source={images[value.value]}
                    style={{ width: '90%', height: '90%' }}
                    />
                :
                    <Text style={isPreGenerated ? styles.hold : styles.default}>
                        {value.value}
                    </Text>
                }
            </TouchableOpacity>
        );
    }
}
