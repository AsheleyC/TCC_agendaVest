import React, { useCallback, useContext, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ActivityIndicator,
    TouchableOpacity,
    ScrollView,
    RefreshControl,
    Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { AuthContext } from '../context/AuthContext';

export default function HomeScreen() {
    const navigation = useNavigation();
    const { usuario, token } = useContext(AuthContext);
    const url_back = process.env.EXPO_PUBLIC_API_URL;

    const [inscricoes, setInscricoes] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [atualizando, setAtualizando] = useState(false);

    const buscarDados = useCallback(async (refresh = false) => {
        if (!usuario?.id_usuario || !token) {
            setInscricoes([]);
            setCarregando(false);
            return;
        }

        try {
            if (refresh) {
                setAtualizando(true);
            } else {
                setCarregando(true);
            }

            const resposta = await fetch(
                `${url_back}/verInscricoes/${usuario.id_usuario}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (!resposta.ok) {
                throw new Error('Erro ao buscar inscrições');
            }

            const dados = await resposta.json();

            setInscricoes(
                Array.isArray(dados) ? dados : []
            );
        } catch (error) {
            console.log('Erro ao carregar Home:', error);
            setInscricoes([]);
        } finally {
            setCarregando(false);
            setAtualizando(false);
        }
    }, [usuario, token]);

    useFocusEffect(
        useCallback(() => {
            buscarDados();
        }, [buscarDados])
    );

    function formatarData(data) {
        if (!data) return '';

        const parteData = String(data).split('T')[0];
        const [ano, mes, dia] = parteData.split('-');

        return `${dia}/${mes}/${ano}`;
    }

    function calcularDias(data) {
        if (!data) return null;

        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);

        const dataEvento = new Date(`${data}T00:00:00`);
        const diferenca = dataEvento - hoje;

        return Math.ceil(
            diferenca / (1000 * 60 * 60 * 24)
        );
    }

    function abrirDetalhes(id_vestibular) {
        navigation.navigate(
            'VestibularDetalhesScreen',
            {
                id_vestibular
            }
        );
    }

    function obterProximosEventos() {
        const eventos = [];

        inscricoes.forEach(item => {
            const diasInscricao =
                calcularDias(item.data_fim_inscricao);

            const diasProva =
                calcularDias(item.data_prova);

            if (
                diasInscricao !== null &&
                diasInscricao >= 0
            ) {
                eventos.push({
                    id: `${item.id_inscricao}-inscricao`,
                    vestibular: item.vestibular,
                    tipo: 'Encerramento das inscrições',
                    data: item.data_fim_inscricao,
                    dias: diasInscricao,
                    icone: 'calendar-outline'
                });
            }

            if (
                diasProva !== null &&
                diasProva >= 0
            ) {
                eventos.push({
                    id: `${item.id_inscricao}-prova`,
                    vestibular: item.vestibular,
                    tipo: 'Data da prova',
                    data: item.data_prova,
                    dias: diasProva,
                    icone: 'school-outline'
                });
            }
        });

        return eventos
            .sort((a, b) => a.dias - b.dias)
            .slice(0, 5);
    }

    function textoDias(data) {
        const dias = calcularDias(data);

        if (dias === null) return '';

        if (dias === 0) return 'Hoje';
        if (dias === 1) return 'Amanhã';

        return `Faltam ${dias} dias`;
    }

    const proximosEventos = obterProximosEventos();

    const nomeUsuario =
        usuario?.nome_usuario || 'Usuário';

    function obterFotoPerfil() {
        if (!usuario?.foto_perfil) {
            return null;
        }

        if (usuario.foto_perfil.startsWith('http')) {
            return usuario.foto_perfil;
        }

        return `${url_back}${usuario.foto_perfil}`;
    }

    const fotoPerfil = obterFotoPerfil();

    if (carregando) {
        return (
            <View style={styles.carregando}>
                <ActivityIndicator
                    size="large"
                    color="#2D6B80"
                />

                <Text style={styles.textoCarregando}>
                    Carregando sua agenda...
                </Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={atualizando}
                        onRefresh={() => buscarDados(true)}
                        colors={['#2D6B80']}
                    />
                }
            >
                <View style={styles.header}>
                    <View>
                        <Text style={styles.ola}>
                            Olá,
                        </Text>

                        <Text style={styles.nome}>
                            {nomeUsuario}
                        </Text>
                    </View>

                    <TouchableOpacity
                        style={styles.iconeUsuario}
                        onPress={() => navigation.navigate('Perfil')}
                    >
                        {fotoPerfil ? (
                            <Image
                                source={{
                                    uri: fotoPerfil
                                }}
                                style={styles.fotoPerfil}
                            />
                        ) : (
                            <Ionicons
                                name="person-outline"
                                size={25}
                                color="#2D6B80"
                            />
                        )}
                    </TouchableOpacity>
                </View>

                <View style={styles.resumoContainer}>
                    <View style={styles.resumoCard}>
                        <View style={styles.iconeResumo}>
                            <Ionicons
                                name="calendar-outline"
                                size={24}
                                color="#2D6B80"
                            />
                        </View>

                        <Text style={styles.numeroResumo}>
                            {inscricoes.length}
                        </Text>

                        <Text style={styles.labelResumo}>
                            Na sua agenda
                        </Text>
                    </View>

                    <View style={styles.resumoCard}>
                        <View style={styles.iconeResumo}>
                            <Ionicons
                                name="school-outline"
                                size={24}
                                color="#2D6B80"
                            />
                        </View>

                        <Text style={styles.numeroResumo}>
                            {
                                inscricoes.filter(item => {
                                    const dias =
                                        calcularDias(item.data_prova);

                                    return (
                                        dias !== null &&
                                        dias >= 0
                                    );
                                }).length
                            }
                        </Text>

                        <Text style={styles.labelResumo}>
                            Próximas provas
                        </Text>
                    </View>
                </View>

                <View style={styles.secao}>
                    <Text style={styles.tituloSecao}>
                        Próximos eventos
                    </Text>

                    {proximosEventos.length === 0 ? (
                        <View style={styles.vazio}>
                            <Ionicons
                                name="calendar-outline"
                                size={38}
                                color="#AABBC2"
                            />

                            <Text style={styles.textoVazio}>
                                Você ainda não possui eventos próximos.
                            </Text>

                            <Text style={styles.subtextoVazio}>
                                Adicione vestibulares à sua agenda para acompanhar as datas.
                            </Text>
                        </View>
                    ) : (
                        proximosEventos.map(evento => (
                            <View
                                key={evento.id}
                                style={styles.eventoCard}
                            >
                                <View style={styles.iconeEvento}>
                                    <Ionicons
                                        name={evento.icone}
                                        size={23}
                                        color="#2D6B80"
                                    />
                                </View>

                                <View style={styles.infoEvento}>
                                    <Text style={styles.nomeEvento}>
                                        {evento.vestibular}
                                    </Text>

                                    <Text style={styles.tipoEvento}>
                                        {evento.tipo}
                                    </Text>

                                    <Text style={styles.dataEvento}>
                                        {formatarData(evento.data)}
                                    </Text>
                                </View>

                                <Text style={styles.diasEvento}>
                                    {textoDias(evento.data)}
                                </Text>
                            </View>
                        ))
                    )}
                </View>

                <View style={styles.secao}>
                    <View style={styles.secaoCabecalho}>
                        <Text style={styles.tituloSecao}>
                            Meus vestibulares
                        </Text>

                        <Text style={styles.quantidade}>
                            {inscricoes.length}
                        </Text>
                    </View>

                    {inscricoes.length === 0 ? (
                        <View style={styles.semInscricoes}>
                            <Text style={styles.opcaoTexto}>
                                Você ainda não possui vestibulares na agenda.
                            </Text>
                        </View>
                    ) : (
                        inscricoes.map(item => (
                            <View
                                key={item.id_inscricao}
                                style={styles.vestibular}
                            >
                                <View style={styles.vestibularInfo}>
                                    <Text style={styles.vestibularNome}>
                                        {item.vestibular}
                                    </Text>

                                    <Text style={styles.vestibularData}>
                                        Prova: {formatarData(item.data_prova)}
                                    </Text>

                                    <Text style={styles.inscrito}>
                                        INSCRITO
                                    </Text>
                                </View>

                                <TouchableOpacity
                                    onPress={() =>
                                        abrirDetalhes(
                                            item.id_vestibular
                                        )
                                    }
                                >
                                    <Text style={styles.detalhes}>
                                        VER DETALHES
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        ))
                    )}
                </View>

                <View style={styles.ultimaSecao}>
                    <View style={styles.informacao}>
                        <Ionicons
                            name="information-circle-outline"
                            size={22}
                            color="#2D6B80"
                        />

                        <Text style={styles.textoInformacao}>
                            As informações exibidas aqui são carregadas diretamente da sua agenda.
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F7FAFB'
    },
    carregando: {
        flex: 1,
        backgroundColor: '#F7FAFB',
        alignItems: 'center',
        justifyContent: 'center'
    },
    textoCarregando: {
        marginTop: 12,
        color: '#495057',
        fontSize: 15
    },
    header: {
        backgroundColor: '#2D6B80',
        paddingHorizontal: 22,
        paddingTop: 55,
        paddingBottom: 25,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    ola: {
        color: '#DCEAF0',
        fontSize: 16
    },
    nome: {
        color: '#FFFFFF',
        fontSize: 24,
        fontWeight: '700',
        marginTop: 2
    },
    iconeUsuario: {
        width: 45,
        height: 45,
        borderRadius: 23,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden'
    },
    fotoPerfil: {
        width: '100%',
        height: '100%',
        borderRadius: 23
    },
    resumoContainer: {
        flexDirection: 'row',
        gap: 12,
        paddingHorizontal: 18,
        marginTop: -5
    },
    resumoCard: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        borderRadius: 14,
        padding: 16,
        alignItems: 'center',
        elevation: 2
    },
    iconeResumo: {
        width: 45,
        height: 45,
        borderRadius: 23,
        backgroundColor: '#EAF3F6',
        alignItems: 'center',
        justifyContent: 'center'
    },
    numeroResumo: {
        color: '#2D6B80',
        fontSize: 25,
        fontWeight: '700',
        marginTop: 8
    },
    labelResumo: {
        color: '#6C757D',
        fontSize: 12,
        marginTop: 2,
        textAlign: 'center'
    },
    secao: {
        paddingHorizontal: 18,
        marginTop: 25
    },
    tituloSecao: {
        color: '#343A40',
        fontSize: 19,
        fontWeight: '700',
        marginBottom: 12
    },
    vazio: {
        backgroundColor: '#FFFFFF',
        borderRadius: 14,
        padding: 25,
        alignItems: 'center'
    },
    textoVazio: {
        color: '#495057',
        fontSize: 15,
        fontWeight: '600',
        textAlign: 'center',
        marginTop: 10
    },
    subtextoVazio: {
        color: '#868E96',
        fontSize: 13,
        textAlign: 'center',
        marginTop: 5,
        lineHeight: 19
    },
    eventoCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 14,
        padding: 14,
        marginBottom: 10,
        flexDirection: 'row',
        alignItems: 'center',
        elevation: 1
    },
    iconeEvento: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#EAF3F6',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12
    },
    infoEvento: {
        flex: 1
    },
    nomeEvento: {
        color: '#343A40',
        fontSize: 15,
        fontWeight: '700'
    },
    tipoEvento: {
        color: '#6C757D',
        fontSize: 12,
        marginTop: 3
    },
    dataEvento: {
        color: '#2D6B80',
        fontSize: 13,
        fontWeight: '600',
        marginTop: 3
    },
    diasEvento: {
        color: '#2D6B80',
        fontSize: 12,
        fontWeight: '700',
        marginLeft: 8
    },
    secaoCabecalho: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    quantidade: {
        backgroundColor: '#EAF3F6',
        color: '#2D6B80',
        minWidth: 28,
        height: 28,
        borderRadius: 14,
        textAlign: 'center',
        paddingTop: 5,
        fontWeight: '700'
    },
    semInscricoes: {
        backgroundColor: '#FFFFFF',
        borderRadius: 14,
        padding: 18
    },
    opcaoTexto: {
        color: '#6C757D',
        fontSize: 14,
        textAlign: 'center'
    },
    vestibular: {
        backgroundColor: '#FFFFFF',
        borderRadius: 14,
        padding: 16,
        marginBottom: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        elevation: 1
    },
    vestibularInfo: {
        flex: 1,
        paddingRight: 10
    },
    vestibularNome: {
        color: '#343A40',
        fontSize: 16,
        fontWeight: '700'
    },
    vestibularData: {
        color: '#6C757D',
        fontSize: 13,
        marginTop: 5
    },
    inscrito: {
        alignSelf: 'flex-start',
        backgroundColor: '#D3F9D8',
        color: '#2B8A3E',
        fontSize: 10,
        fontWeight: '700',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        marginTop: 8
    },
    detalhes: {
        color: '#2D6B80',
        fontSize: 11,
        fontWeight: '700'
    },
    ultimaSecao: {
        paddingHorizontal: 18,
        paddingTop: 15,
        paddingBottom: 35
    },
    informacao: {
        backgroundColor: '#EAF3F6',
        borderRadius: 12,
        padding: 14,
        flexDirection: 'row',
        alignItems: 'center'
    },
    textoInformacao: {
        flex: 1,
        color: '#52717D',
        fontSize: 12,
        lineHeight: 17,
        marginLeft: 9
    }
});