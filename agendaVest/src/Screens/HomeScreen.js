import React, { useCallback, useContext, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, ScrollView, RefreshControl, Image } from 'react-native';

import { Dialog, Portal, Button } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { AuthContext } from '../context/AuthContext';

export default function HomeScreen() {
    const navigation = useNavigation();
    const { usuario, token } = useContext(AuthContext);
    const url_back = process.env.EXPO_PUBLIC_API_URL;

    const [inscricoes, setInscricoes] = useState([]);
    const [vestibulares, setVestibulares] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [atualizando, setAtualizando] = useState(false);
    const [removendo, setRemovendo] = useState(null);
    const [mostrarTodosEventos, setMostrarTodosEventos] = useState(false);

    const [dialog, setDialog] = useState({
        visible: false,
        titulo: '',
        mensagem: ''
    });

    const [dialogRemover, setDialogRemover] = useState({
        visible: false,
        id_inscricao: null
    });

    function mostrarDialog(titulo, mensagem) {
        setDialog({
            visible: true,
            titulo,
            mensagem
        });
    }

    function fecharDialog() {
        setDialog(prev => ({
            ...prev,
            visible: false
        }));
    }

    function abrirDialogRemover(id_inscricao) {
        setDialogRemover({
            visible: true,
            id_inscricao
        });
    }

    function fecharDialogRemover() {
        setDialogRemover({
            visible: false,
            id_inscricao: null
        });
    }

    const buscarDados = useCallback(async (refresh = false) => {
        if (!usuario?.id_usuario || !token) {
            setInscricoes([]);
            setVestibulares([]);
            setCarregando(false);
            return;
        }

        try {
            if (refresh) {
                setAtualizando(true);
            } else {
                setCarregando(true);
            }

            const [
                respostaInscricoes,
                respostaVestibulares
            ] = await Promise.all([
                fetch(
                    `${url_back}/verInscricoes/${usuario.id_usuario}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                ),
                fetch(`${url_back}/verVest`)
            ]);

            if (!respostaInscricoes.ok) {
                throw new Error('Erro ao buscar inscrições');
            }

            if (!respostaVestibulares.ok) {
                throw new Error('Erro ao buscar vestibulares');
            }

            const dadosInscricoes =
                await respostaInscricoes.json();

            const dadosVestibulares =
                await respostaVestibulares.json();

            setInscricoes(
                Array.isArray(dadosInscricoes)
                    ? dadosInscricoes
                    : []
            );

            setVestibulares(
                Array.isArray(dadosVestibulares)
                    ? dadosVestibulares
                    : []
            );

        } catch (error) {
            setInscricoes([]);
            setVestibulares([]);

        } finally {
            setCarregando(false);
            setAtualizando(false);
        }
    }, [usuario, token, url_back]);

    useFocusEffect(
        useCallback(() => {
            buscarDados();
        }, [buscarDados])
    );

    function formatarData(data) {
        if (!data) return '';

        const parteData =
            String(data).split('T')[0];

        const [ano, mes, dia] =
            parteData.split('-');

        return `${dia}/${mes}/${ano}`;
    }

    function calcularDias(data) {
        if (!data) return null;

        const parteData =
            String(data).split('T')[0];

        const [ano, mes, dia] =
            parteData
                .split('-')
                .map(Number);

        if (!ano || !mes || !dia) {
            return null;
        }

        const hoje = new Date();

        hoje.setHours(
            0,
            0,
            0,
            0
        );

        const dataEvento = new Date(
            ano,
            mes - 1,
            dia
        );

        dataEvento.setHours(
            0,
            0,
            0,
            0
        );

        const diferenca =
            dataEvento - hoje;

        return Math.ceil(
            diferenca /
            (1000 * 60 * 60 * 24)
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

    async function confirmarRemocao() {
        const id_inscricao =
            dialogRemover.id_inscricao;

        fecharDialogRemover();

        try {
            setRemovendo(id_inscricao);

            const resposta = await fetch(
                `${url_back}/delInscricao/${id_inscricao}`,
                {
                    method: 'DELETE'
                }
            );

            const resultado =
                await resposta.json();

            if (!resposta.ok) {
                mostrarDialog(
                    'Erro',
                    resultado.mensagem ||
                    resultado.erro ||
                    'Não foi possível remover.'
                );

                return;
            }

            setInscricoes(lista =>
                lista.filter(
                    item =>
                        item.id_inscricao !==
                        id_inscricao
                )
            );

        } catch (error) {
            mostrarDialog(
                'Erro',
                'Não foi possível conectar ao servidor.'
            );

        } finally {
            setRemovendo(null);
        }
    }

    function obterProximosEventos() {
        const eventos = [];

        // INSCRIÇÕES ENCERRANDO NOS PRÓXIMOS 10 DIAS
        vestibulares.forEach(item => {
            const dias =
                calcularDias(
                    item.data_fim_inscricao
                );

            if (
                dias !== null &&
                dias >= 0 &&
                dias <= 10
            ) {
                eventos.push({
                    id: `inscricao-${item.id_vestibular}`,
                    vestibular: item.vestibular,
                    tipo: 'Encerramento das inscrições',
                    data: item.data_fim_inscricao,
                    dias,
                    icone: 'calendar-outline'
                });
            }
        });

        // PROVAS DA AGENDA NOS PRÓXIMOS 10 DIAS
        inscricoes.forEach(item => {
            const dias =
                calcularDias(
                    item.data_prova
                );

            if (
                dias !== null &&
                dias >= 0 &&
                dias <= 10
            ) {
                eventos.push({
                    id: `prova-${item.id_inscricao}`,
                    vestibular: item.vestibular,
                    tipo: 'Data da prova',
                    data: item.data_prova,
                    dias,
                    icone: 'school-outline'
                });
            }
        });

        return eventos.sort(
            (a, b) =>
                a.dias - b.dias
        );
    }

    function textoDias(data) {
        const dias =
            calcularDias(data);

        if (dias === null) {
            return '';
        }

        if (dias === 0) {
            return 'Hoje';
        }

        if (dias === 1) {
            return 'Amanhã';
        }

        return `Em ${dias} dias`;
    }

    const proximosEventos =
        obterProximosEventos();

    const eventosExibidos =
        mostrarTodosEventos
            ? proximosEventos
            : proximosEventos.slice(0, 3);

    const nomeUsuario =
        usuario?.nome_usuario ||
        'Usuário';

    function obterFotoPerfil() {
        if (!usuario?.foto_perfil) {
            return null;
        }

        if (
            usuario.foto_perfil.startsWith(
                'http'
            )
        ) {
            return usuario.foto_perfil;
        }

        return `${url_back}${usuario.foto_perfil}`;
    }

    const fotoPerfil =
        obterFotoPerfil();

    const proximasProvas =
        inscricoes.filter(item => {
            const dias =
                calcularDias(
                    item.data_prova
                );

            return (
                dias !== null &&
                dias >= 0 &&
                dias <= 10
            );
        }).length;

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
        <>
            <View style={styles.container}>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={atualizando}
                            onRefresh={() =>
                                buscarDados(true)
                            }
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
                            onPress={() =>
                                navigation.navigate(
                                    'Perfil'
                                )
                            }
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
                                {proximasProvas}
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
                                    Nenhum evento nos próximos dias.
                                </Text>

                                <Text style={styles.subtextoVazio}>
                                    Nenhuma inscrição ou prova acontecerá nos próximos 10 dias.
                                </Text>
                            </View>
                        ) : (
                            <>
                                {eventosExibidos.map(evento => (
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
                                                {formatarData(
                                                    evento.data
                                                )}
                                            </Text>
                                        </View>

                                        <Text style={styles.diasEvento}>
                                            {textoDias(
                                                evento.data
                                            )}
                                        </Text>
                                    </View>
                                ))}

                                {proximosEventos.length > 3 && (
                                    <TouchableOpacity
                                        style={styles.botaoVerMais}
                                        onPress={() =>
                                            setMostrarTodosEventos(
                                                !mostrarTodosEventos
                                            )
                                        }
                                    >
                                        <Text style={styles.textoVerMais}>
                                            {mostrarTodosEventos
                                                ? 'VER MENOS'
                                                : 'VER MAIS'}
                                        </Text>
                                    </TouchableOpacity>
                                )}
                            </>
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
                                            Prova:{' '}
                                            {formatarData(
                                                item.data_prova
                                            )}
                                        </Text>

                                        <Text style={styles.inscrito}>
                                            INSCRITO
                                        </Text>
                                    </View>

                                    <View style={styles.acoesVestibular}>
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

                                        <TouchableOpacity
                                            disabled={
                                                removendo ===
                                                item.id_inscricao
                                            }
                                            onPress={() =>
                                                abrirDialogRemover(
                                                    item.id_inscricao
                                                )
                                            }
                                        >
                                            {removendo ===
                                                item.id_inscricao ? (
                                                <ActivityIndicator
                                                    size="small"
                                                    color="#B74A4A"
                                                />
                                            ) : (
                                                <Text style={styles.remover}>
                                                    REMOVER DA AGENDA
                                                </Text>
                                            )}
                                        </TouchableOpacity>
                                    </View>
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
                                Os próximos eventos mostram inscrições e provas que acontecerão nos próximos 10 dias.
                            </Text>
                        </View>
                    </View>
                </ScrollView>
            </View>

            <Portal>
                <Dialog
                    visible={dialogRemover.visible}
                    onDismiss={fecharDialogRemover}
                    style={styles.dialog}
                >
                    <Dialog.Title style={styles.dialogTitulo}>
                        Remover inscrição
                    </Dialog.Title>

                    <Dialog.Content>
                        <Text style={styles.dialogTexto}>
                            Deseja remover este vestibular da sua agenda?
                        </Text>
                    </Dialog.Content>

                    <Dialog.Actions>
                        <Button
                            onPress={fecharDialogRemover}
                            textColor="#5C6B73"
                        >
                            CANCELAR
                        </Button>

                        <Button
                            onPress={confirmarRemocao}
                            textColor="#B74A4A"
                        >
                            REMOVER
                        </Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>

            <Portal>
                <Dialog
                    visible={dialog.visible}
                    onDismiss={fecharDialog}
                    style={styles.dialog}
                >
                    <Dialog.Title style={styles.dialogTitulo}>
                        {dialog.titulo}
                    </Dialog.Title>

                    <Dialog.Content>
                        <Text style={styles.dialogTexto}>
                            {dialog.mensagem}
                        </Text>
                    </Dialog.Content>

                    <Dialog.Actions>
                        <Button
                            onPress={fecharDialog}
                            textColor="#285E73"
                        >
                            OK
                        </Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        </>
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

    botaoVerMais: {
        alignSelf: 'center',
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginTop: 4
    },

    textoVerMais: {
        color: '#2D6B80',
        fontSize: 12,
        fontWeight: '700'
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

    acoesVestibular: {
        alignItems: 'flex-end',
        gap: 15
    },

    detalhes: {
        color: '#2D6B80',
        fontSize: 11,
        fontWeight: '700'
    },

    remover: {
        color: '#B74A4A',
        fontSize: 10,
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
    },

    dialog: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16
    },

    dialogTitulo: {
        color: '#285E73',
        fontWeight: 'bold'
    },

    dialogTexto: {
        color: '#5C6B73',
        fontSize: 14,
        lineHeight: 20
    }
});