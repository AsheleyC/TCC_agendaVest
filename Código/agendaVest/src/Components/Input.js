import { StyleSheet, Text, View, TextInput } from 'react-native';

const Input = ({ texto, seguro, set ,value, placeholder}) => {
    return (
        <View style={styles.inputGroup}>
            <Text style={styles.label}>{texto}</Text>
            <TextInput style={styles.input}
                onChangeText={set}
                value={value}
                secureTextEntry={seguro}
                placeholder={placeholder}
            />
            
        </View>
    )
}

const styles = StyleSheet.create({
    inputGroup: {
        marginBottom: 25,
    },

    label: {
        color: '#3b5b7a',
        fontSize: 14,
        marginBottom: 5,
        fontWeight: '500',
    },

    input: {
        borderBottomWidth: 2,
        borderBottomColor: '#8fb3c9',
        paddingVertical: 5,
        fontSize: 16,
        color: '#2c3e50',
    },
})

export { Input }