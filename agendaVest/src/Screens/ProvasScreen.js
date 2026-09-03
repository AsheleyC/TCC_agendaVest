import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, FlatList, Linking } from 'react-native';

import { useNavigation, useRoute } from '@react-navigation/native';

export default function ProvasScreen() {
    const navigation = useNavigation();
    const route = useRoute();

    const { id_vestibular, nomeVestibular } = route.params;

    const url_back = process.env.EXPO_PUBLIC_API_URL;

    const [provas, setProvas] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState(false);
    const [anosAbertos, setAnosAbertos] = useState({});
    const [fasesAbertas, setFasesAbertas] = useState({});

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

    function alternarAno(ano) {
        setAnosAbertos(prev => ({
            ...prev,
            [ano]: !prev[ano]
        }));
    }

    function alternarFase(id) {
        setFasesAbertas(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    }

    function organizarPorAno() {
        const grupos = {};

        provas.forEach(prova => {
            if (!grupos[prova.ano_prova]) {
                grupos[prova.ano_prova] = [];
            }

            grupos[prova.ano_prova].push(prova);
        });

        return Object.entries(grupos).sort(
            ([anoA], [anoB]) =>
                Number(anoB) - Number(anoA)
        );
    }

    function renderizarAno({ item }) {
        const [ano, fases] = item;

        const anoAberto = anosAbertos[ano];

        return (
            <View style={styles.card}>
                <TouchableOpacity
                    style={styles.cabecalhoAno}
                    onPress={() => alternarAno(ano)}
                >
                    <Text style={styles.ano}>
                        {ano}
                    </Text>

                    <Text style={styles.seta}>
                        {anoAberto ? '▲' : '▼'}
                    </Text>
                </TouchableOpacity>

                {anoAberto && (
                    <View style={styles.conteudoAno}>
                        {fases.map(fase => {
                            const chaveFase =
                                `${ano}-${fase.id_prova}`;

                            const faseAberta =
                                fasesAbertas[chaveFase];

                            return (
                                <View
                                    key={fase.id_prova}
                                    style={styles.faseContainer}
                                >
                                    <TouchableOpacity
                                        style={styles.faseCabecalho}
                                        onPress={() =>
                                            alternarFase(chaveFase)
                                        }
                                    >
                                        <Text style={styles.fase}>
                                            {fase.fase}
                                        </Text>

                                        <Text style={styles.setaFase}>
                                            {faseAberta ? '▲' : '▼'}
                                        </Text>
                                    </TouchableOpacity>

                                    {faseAberta && (
                                        <View style={styles.botoes}>
                                            <TouchableOpacity
                                                style={styles.botao}
                                                onPress={() =>
                                                    abrirLink(
                                                        fase.link_prova
                                                    )
                                                }
                                            >
                                                <Text
                                                    style={
                                                        styles.textoBotao
                                                    }
                                                >
                                                    VER PROVA
                                                </Text>
                                            </TouchableOpacity>

                                            <TouchableOpacity
                                                style={styles.botao}
                                                onPress={() =>
                                                    abrirLink(
                                                        fase.link_gabarito
                                                    )
                                                }
                                            >
                                                <Text
                                                    style={
                                                        styles.textoBotao
                                                    }
                                                >
                                                    VER GABARITO
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                    )}
                                </View>
                            );
                        })}
                    </View>
                )}
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
                    onPress={() =>
                        navigation.goBack()
                    }
                >
                    <Text style={styles.textoBotaoVoltar}>
                        VOLTAR
                    </Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <TouchableOpacity
                onPress={() =>
                    navigation.goBack()
                }
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
                data={organizarPorAno()}
                keyExtractor={([ano]) =>
                    ano.toString()
                }
                renderItem={renderizarAno}
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
        paddingHorizontal: 20
    },

    containerCentral: {
        flex: 1,
        backgroundColor: '#E8EFF8',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20
    },

    voltar: {
        color: '#285E73',
        fontSize: 16,
        marginBottom: 20,
        fontWeight: '500'
    },

    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#285E73'
    },

    subtitulo: {
        fontSize: 18,
        color: '#5C6B73',
        marginTop: 5,
        marginBottom: 20
    },

    lista: {
        paddingBottom: 20
    },

    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        marginBottom: 15,
        elevation: 2,
        overflow: 'hidden'
    },

    cabecalhoAno: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 18
    },

    ano: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#285E73'
    },

    seta: {
        fontSize: 16,
        color: '#285E73',
        fontWeight: 'bold'
    },

    conteudoAno: {
        paddingHorizontal: 18,
        paddingBottom: 12
    },

    faseContainer: {
        borderTopWidth: 1,
        borderTopColor: '#E1E7EC',
        paddingVertical: 5
    },

    faseCabecalho: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12
    },

    fase: {
        fontSize: 17,
        fontWeight: '600',
        color: '#5C6B73'
    },

    setaFase: {
        fontSize: 13,
        color: '#5C6B73'
    },

    botoes: {
        paddingBottom: 10
    },

    botao: {
        backgroundColor: '#285E73',
        borderRadius: 8,
        paddingVertical: 12,
        alignItems: 'center',
        marginTop: 8
    },

    botaoVoltar: {
        borderWidth: 1,
        borderColor: '#5C6B73',
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 18,
        marginTop: 10
    },

    textoBotao: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: 'bold'
    },

    textoBotaoVoltar: {
        color: '#285E73',
        fontSize: 12,
        fontWeight: 'bold'
    },

    textoCarregando: {
        marginTop: 15,
        color: '#285E73',
        fontSize: 15
    },

    textoErro: {
        color: '#B74A4A',
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20
    }
});