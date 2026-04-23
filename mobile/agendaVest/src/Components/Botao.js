import { StyleSheet, Text, TouchableOpacity } from 'react-native';

const Botao = ({texto, acao}) =>{
    return(
        <TouchableOpacity style={[styles.button]} onPress={acao}>
            <Text style={[styles.buttonText]}>{texto}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create ({
    button: {
        width: '60%',
        alignSelf: 'center',
        backgroundColor: 'rgba(200, 210, 220, 0.7)',
        paddingVertical: 12,
        margin: 10,
        borderRadius: 25,
        alignItems: 'center',
    },

    buttonText: {
        color: '#3b5b7a',
        fontSize: 16,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
})

export {Botao}