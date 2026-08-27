import React, { useEffect, useState } from 'react';

import {
    View,
    Text,
    StyleSheet,
    FlatList,
    ActivityIndicator,
    TouchableOpacity,
    TextInput
} from 'react-native';

import { useNavigation } from '@react-navigation/native';

export default function VestibularesScreen() {

    const navigation = useNavigation();

    const url_back = process.env.EXPO_PUBLIC_API_URL;

    const [vestibulares, setVestibulares] = useState([]);
    const [textoBusca, setTextoBusca] = useState('');
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState(false);

    async function buscarVestibulares() {
        try {
            setCarregando(true);
            setErro(false);

            const resposta = await fetch(`${url_back}/verVest`);

            if (!resposta.ok) {
                throw new Error('Erro ao buscar vestibulares');
            }

            const dados = await resposta.json();

            setVestibulares(dados);

        } catch (error) {
            console.log(error);
            setErro(true);

        } finally {
            setCarregando(false);
        }
    }

    useEffect(() => {
        buscarVestibulares();
    }, []);

    const vestibularesFiltrados = vestibulares.filter((item) =>
        item.vestibular
            .toLowerCase()
            .includes(textoBusca.toLowerCase())
    );

    function abrirDetalhes(id) {
        navigation.navigate('VestibularDetalhesScreen', {
            id_vestibular: id
        });
    }

    function renderizarVestibular({ item }) {
        return (
            <View style={styles.card}>

                <View style={styles.informacoes}>

                    <Text style={styles.nomeVestibular}>
                        {item.vestibular}
                    </Text>

                    <Text style={styles.inscricoes}>
                        Inscrições: {item.data_inicio_inscricao}
                    </Text>

                </View>

                <TouchableOpacity
                    style={styles.botao}
                    onPress={() => abrirDetalhes(item.id_vestibular)}
                >
                    <Text style={styles.textoBotao}>
                        VER MAIS
                    </Text>
                </TouchableOpacity>

            </View>
        );
    }

    if (carregando) {
        return (
            <View style={styles.containerCarregando}>

                <ActivityIndicator size="large" color="#285E73" />

                <Text style={styles.textoCarregando}>
                    Carregando vestibulares...
                </Text>

            </View>
        );
    }

    if (erro) {
        return (
            <View style={styles.containerCarregando}>

                <Text style={styles.textoErro}>
                    Não foi possível carregar os vestibulares.
                </Text>

                <TouchableOpacity
                    style={styles.botaoTentar}
                    onPress={buscarVestibulares}
                >
                    <Text style={styles.textoBotao}>
                        TENTAR NOVAMENTE
                    </Text>
                </TouchableOpacity>

            </View>
        );
    }

    return (
        <View style={styles.container}>

            <Text style={styles.title}>
                Vestibulares
            </Text>

            <Text style={styles.subtitulo}>
                Encontre os principais vestibulares.
            </Text>

            <TextInput
                style={styles.busca}
                placeholder="Buscar vestibular..."
                value={textoBusca}
                onChangeText={setTextoBusca}
            />

            <FlatList
                data={vestibularesFiltrados}
                renderItem={renderizarVestibular}
                keyExtractor={(item) => item.id_vestibular.toString()}
                contentContainerStyle={styles.lista}
                ListEmptyComponent={
                    <Text style={styles.semResultados}>
                        Nenhum vestibular encontrado.
                    </Text>
                }
            />

        </View>
    );
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#E8EFF8',
        paddingTop: 40,
    },

    containerCarregando: {
        flex: 1,
        backgroundColor: '#E8EFF8',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },

    title: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#285E73',
        marginHorizontal: 20,
    },

    subtitulo: {
        fontSize: 14,
        color: '#5C6B73',
        marginHorizontal: 20,
        marginTop: 5,
        marginBottom: 20,
    },

    busca: {
        backgroundColor: '#FFFFFF',
        marginHorizontal: 20,
        marginBottom: 15,
        borderRadius: 8,
        paddingHorizontal: 15,
        paddingVertical: 12,
        fontSize: 14,
        color: '#285E73',
    },

    lista: {
        paddingHorizontal: 15,
        paddingBottom: 20,
    },

    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 18,
        marginBottom: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        elevation: 2,
    },

    informacoes: {
        flex: 1,
    },

    nomeVestibular: {
        fontSize: 17,
        fontWeight: 'bold',
        color: '#285E73',
    },

    inscricoes: {
        fontSize: 13,
        color: '#5C6B73',
        marginTop: 6,
    },

    botao: {
        borderWidth: 1,
        borderColor: '#285E73',
        borderRadius: 8,
        paddingVertical: 10,
        paddingHorizontal: 14,
        marginLeft: 10,
    },

    textoBotao: {
        color: '#285E73',
        fontSize: 12,
        fontWeight: 'bold',
    },

    textoCarregando: {
        marginTop: 15,
        color: '#285E73',
        fontSize: 15,
    },

    textoErro: {
        color: '#B74A4A',
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
    },

    botaoTentar: {
        borderWidth: 1,
        borderColor: '#285E73',
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 18,
    },

    semResultados: {
        textAlign: 'center',
        color: '#5C6B73',
        marginTop: 30,
        fontSize: 14,
    },

});