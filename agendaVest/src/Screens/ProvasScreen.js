import React, { useEffect, useState } from 'react';

import {
    View,
    Text,
    StyleSheet,
    ActivityIndicator,
    TouchableOpacity,
    FlatList,
    Linking
} from 'react-native';

import { useNavigation, useRoute } from '@react-navigation/native';

export default function ProvasScreen() {

    const navigation = useNavigation();
    const route = useRoute();

    const { id_vestibular, nomeVestibular } = route.params;

    const url_back = process.env.EXPO_PUBLIC_API_URL;

    const [provas, setProvas] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState(false);

    async function buscarProvas() {

        try {

            setCarregando(true);
            setErro(false);

            const resposta = await fetch(
                `${url_back}/verProvas/${id_vestibular}`
            );

            if (!resposta.ok) {
                throw new Error('Erro ao buscar provas');
            }

            const dados = await resposta.json();

            setProvas(dados);

        } catch (error) {

            console.log(error);
            setErro(true);

        } finally {

            setCarregando(false);

        }

    }

    useEffect(() => {

        buscarProvas();

    }, []);

    async function abrirLink(link) {

        if (!link) {
            return;
        }

        await Linking.openURL(link);

    }

    function renderizarProva({ item }) {

        return (

            <View style={styles.card}>

                <Text style={styles.ano}>
                    {item.ano_prova}
                </Text>

                <TouchableOpacity
                    style={styles.botao}
                    onPress={() => abrirLink(item.link_prova)}
                >
                    <Text style={styles.textoBotao}>
                        VER PROVA
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.botao}
                    onPress={() => abrirLink(item.link_gabarito)}
                >
                    <Text style={styles.textoBotao}>
                        VER GABARITO
                    </Text>
                </TouchableOpacity>

            </View>

        );

    }

    if (carregando) {

        return (

            <View style={styles.containerCentral}>

                <ActivityIndicator
                    size="large"
                    color="#285E73"
                />

                <Text style={styles.textoCarregando}>
                    Carregando provas...
                </Text>

            </View>

        );

    }

    if (erro) {

        return (

            <View style={styles.containerCentral}>

                <Text style={styles.textoErro}>
                    Não foi possível carregar as provas.
                </Text>

                <TouchableOpacity
                    style={styles.botao}
                    onPress={buscarProvas}
                >
                    <Text style={styles.textoBotao}>
                        TENTAR NOVAMENTE
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.botaoVoltar}
                    onPress={() => navigation.goBack()}
                >
                    <Text style={styles.textoBotao}>
                        VOLTAR
                    </Text>
                </TouchableOpacity>

            </View>

        );

    }

    return (

        <View style={styles.container}>

            <TouchableOpacity
                onPress={() => navigation.goBack()}
            >
                <Text style={styles.voltar}>
                    ← Voltar
                </Text>
            </TouchableOpacity>

            <Text style={styles.title}>
                Provas anteriores
            </Text>

            <Text style={styles.subtitulo}>
                {nomeVestibular}
            </Text>

            <FlatList
                data={provas}
                keyExtractor={(item) => item.id_prova.toString()}
                renderItem={renderizarProva}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.lista}
            />

        </View>

    );

}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#E8EFF8',
        paddingTop: 50,
        paddingHorizontal: 20,
    },

    containerCentral: {
        flex: 1,
        backgroundColor: '#E8EFF8',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },

    voltar: {
        color: '#285E73',
        fontSize: 16,
        marginBottom: 20,
        fontWeight: '500',
    },

    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#285E73',
    },

    subtitulo: {
        fontSize: 18,
        color: '#5C6B73',
        marginTop: 5,
        marginBottom: 20,
    },

    lista: {
        paddingBottom: 20,
    },

    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 18,
        marginBottom: 15,
        elevation: 2,
    },

    ano: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#285E73',
        marginBottom: 12,
    },

    botao: {
        backgroundColor: '#285E73',
        borderRadius: 8,
        paddingVertical: 12,
        alignItems: 'center',
        marginTop: 8,
    },

    botaoVoltar: {
        borderWidth: 1,
        borderColor: '#5C6B73',
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 18,
        marginTop: 10,
    },

    textoBotao: {
        color: '#FFFFFF',
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
        textAlign: 'center',
    },

});