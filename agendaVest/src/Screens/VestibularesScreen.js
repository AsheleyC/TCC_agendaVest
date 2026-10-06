import React, { useCallback, useContext, useState } from 'react';
import { View, Text, StyleSheet, FlatList, SectionList, ActivityIndicator, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Dialog, Portal, Button } from 'react-native-paper';

export default function VestibularesScreen() {
    const navigation = useNavigation();
    const { usuario } = useContext(AuthContext);
    const url_back = process.env.EXPO_PUBLIC_API_URL;

    const [vestibulares, setVestibulares] = useState([]);
    const [inscricoes, setInscricoes] = useState([]);
    const [textoBusca, setTextoBusca] = useState('');
    const [filtroSelecionado, setFiltroSelecionado] = useState('todos');
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState(false);
    const [dialogLogin, setDialogLogin] = useState(false);

    async function buscarDados() {
        try {
            setCarregando(true);
            setErro(false);

            const respostaVestibulares = await fetch(`${url_back}/verVest`);

            if (!respostaVestibulares.ok) {
                throw new Error('Erro ao buscar vestibulares');
            }

            const dadosVestibulares = await respostaVestibulares.json();
            setVestibulares(dadosVestibulares);

            if (usuario) {
                const respostaInscricoes = await fetch(`${url_back}/verInscricoes/${usuario.id_usuario}`);

                if (!respostaInscricoes.ok) {
                    throw new Error('Erro ao buscar agenda');
                }

                const dadosInscricoes = await respostaInscricoes.json();
                setInscricoes(dadosInscricoes);
            } else {
                setInscricoes([]);
            }
        } catch (error) {
            setErro(true);
        } finally {
            setCarregando(false);
        }
    }

    useFocusEffect(
        useCallback(() => {
            buscarDados();
        }, [usuario, url_back])
    );

    function formatarData(data) {
        if (!data) {
            return '';
        }

        const texto = String(data).substring(0, 10);

        if (texto.includes('-')) {
            const [ano, mes, dia] = texto.split('-');
            return `${dia}/${mes}/${ano.slice(2)}`;
        }

        return texto;
    }

    function converterData(data) {
        if (!data) {
            return null;
        }

        const texto = String(data).trim();

        if (/^\d{2}\/\d{2}\/\d{4}/.test(texto)) {
            const partes = texto.substring(0, 10).split('/');
            const dia = Number(partes[0]);
            const mes = Number(partes[1]);
            const ano = Number(partes[2]);

            return new Date(ano, mes - 1, dia);
        }

        if (/^\d{4}-\d{2}-\d{2}/.test(texto)) {
            const partes = texto.substring(0, 10).split('-');
            const ano = Number(partes[0]);
            const mes = Number(partes[1]);
            const dia = Number(partes[2]);

            return new Date(ano, mes - 1, dia);
        }

        return null;
    }

    function verificarSituacao(item) {
        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);

        const inicioInscricao = converterData(item.data_inicio_inscricao);
        const fimInscricao = converterData(item.data_fim_inscricao);
        const dataProva = converterData(item.data_prova);

        if (dataProva && dataProva < hoje) {
            return {
                texto: 'Processo encerrado',
                tipo: 'encerrado'
            };
        }

        if (fimInscricao && fimInscricao < hoje) {
            return {
                texto: 'Inscrições encerradas',
                tipo: 'inscricoesEncerradas'
            };
        }

        if (inicioInscricao && inicioInscricao > hoje) {
            return {
                texto: 'Inscrições em breve',
                tipo: 'emBreve'
            };
        }

        return {
            texto: 'Inscrições abertas',
            tipo: 'abertas'
        };
    }

    function obterPrioridade(tipo) {
        const prioridades = {
            abertas: 1,
            emBreve: 2,
            inscricoesEncerradas: 3,
            encerrado: 4
        };

        return prioridades[tipo] || 5;
    }

    function obterDataOrdenacao(item, tipo) {
        if (tipo === 'abertas') {
            return converterData(item.data_fim_inscricao);
        }

        if (tipo === 'emBreve') {
            return converterData(item.data_inicio_inscricao);
        }

        if (tipo === 'inscricoesEncerradas') {
            return converterData(item.data_prova);
        }

        return converterData(item.data_prova);
    }

    const vestibularesFiltrados = vestibulares
        .filter((item) => {
            const correspondeBusca = item.vestibular
                .toLowerCase()
                .includes(textoBusca.toLowerCase());

            if (!correspondeBusca) {
                return false;
            }

            const situacao = verificarSituacao(item);

            if (filtroSelecionado === 'todos') {
                return true;
            }

            return situacao.tipo === filtroSelecionado;
        })
        .sort((a, b) => {
            const situacaoA = verificarSituacao(a);
            const situacaoB = verificarSituacao(b);

            const prioridadeA = obterPrioridade(situacaoA.tipo);
            const prioridadeB = obterPrioridade(situacaoB.tipo);

            if (prioridadeA !== prioridadeB) {
                return prioridadeA - prioridadeB;
            }

            const dataA = obterDataOrdenacao(a, situacaoA.tipo);
            const dataB = obterDataOrdenacao(b, situacaoB.tipo);

            if (!dataA && !dataB) {
                return 0;
            }

            if (!dataA) {
                return 1;
            }

            if (!dataB) {
                return -1;
            }

            return dataA - dataB;
        });

    const idsMinhaAgenda = new Set(
        inscricoes.map((item) => Number(item.id_vestibular))
    );

    const meusVestibulares = vestibularesFiltrados.filter((item) =>
        idsMinhaAgenda.has(Number(item.id_vestibular))
    );

    const vestibularesDisponiveis = vestibularesFiltrados.filter((item) =>
        !idsMinhaAgenda.has(Number(item.id_vestibular))
    );

    const inscricoesAbertas = vestibularesDisponiveis.filter((item) =>
        verificarSituacao(item).tipo === 'abertas'
    );

    const outrosVestibulares = vestibularesDisponiveis.filter((item) =>
        verificarSituacao(item).tipo !== 'abertas'
    );

    function obterTituloDisponiveis() {
        if (filtroSelecionado === 'emBreve') {
            return 'Inscrições em breve';
        }

        if (filtroSelecionado === 'inscricoesEncerradas') {
            return 'Inscrições encerradas';
        }

        if (filtroSelecionado === 'encerrado') {
            return 'Processos encerrados';
        }

        return 'Vestibulares disponíveis';
    }

    function montarSecoes() {
        const secoes = [];

        if (meusVestibulares.length > 0) {
            secoes.push({
                titulo: 'Meus vestibulares',
                subtitulo: 'Vestibulares que você está acompanhando.',
                data: meusVestibulares
            });
        }

        if (filtroSelecionado === 'todos') {
            if (inscricoesAbertas.length > 0) {
                secoes.push({
                    titulo: 'Inscrições abertas',
                    subtitulo: 'Outros processos seletivos com inscrições disponíveis.',
                    data: inscricoesAbertas
                });
            }

            if (outrosVestibulares.length > 0) {
                secoes.push({
                    titulo: 'Outros vestibulares',
                    subtitulo: 'Confira também os demais processos seletivos.',
                    data: outrosVestibulares
                });
            }

            return secoes;
        }

        if (filtroSelecionado === 'abertas') {
            if (inscricoesAbertas.length > 0) {
                secoes.push({
                    titulo: 'Inscrições abertas',
                    subtitulo: 'Outros processos seletivos com inscrições disponíveis.',
                    data: inscricoesAbertas
                });
            }

            return secoes;
        }

        if (vestibularesDisponiveis.length > 0) {
            secoes.push({
                titulo: obterTituloDisponiveis(),
                subtitulo: 'Outros processos seletivos disponíveis.',
                data: vestibularesDisponiveis
            });
        }

        return secoes;
    }

    const secoesVestibulares = montarSecoes();

    function abrirDetalhes(id) {
        if (!usuario) {
            setDialogLogin(true);
            return;
        }

        navigation.navigate('VestibularDetalhesScreen', {
            id_vestibular: id
        });
    }

    function renderizarFiltro(texto, valor) {
        const selecionado = filtroSelecionado === valor;

        return (
            <TouchableOpacity
                style={[
                    styles.botaoFiltro,
                    selecionado && styles.botaoFiltroSelecionado
                ]}
                onPress={() => setFiltroSelecionado(valor)}
            >
                <Text
                    style={[
                        styles.textoFiltro,
                        selecionado && styles.textoFiltroSelecionado
                    ]}
                >
                    {texto}
                </Text>
            </TouchableOpacity>
        );
    }

    function renderizarVestibular({ item }) {
        const situacao = verificarSituacao(item);

        return (
            <View style={styles.card}>
                <View style={styles.informacoes}>
                    <Text style={styles.nomeVestibular}>
                        {item.vestibular}
                    </Text>

                    <Text style={styles.inscricoes}>
                        Inscrições: {formatarData(item.data_inicio_inscricao)}
                    </Text>

                    <View
                        style={[
                            styles.status,
                            situacao.tipo === 'abertas' && styles.statusAberto,
                            situacao.tipo === 'emBreve' && styles.statusEmBreve,
                            situacao.tipo === 'inscricoesEncerradas' && styles.statusInscricoesEncerradas,
                            situacao.tipo === 'encerrado' && styles.statusEncerrado
                        ]}
                    >
                        <Text
                            style={[
                                styles.textoStatus,
                                situacao.tipo === 'abertas' && styles.textoStatusAberto,
                                situacao.tipo === 'emBreve' && styles.textoStatusEmBreve,
                                situacao.tipo === 'inscricoesEncerradas' && styles.textoStatusInscricoesEncerradas,
                                situacao.tipo === 'encerrado' && styles.textoStatusEncerrado
                            ]}
                        >
                            {situacao.texto}
                        </Text>
                    </View>
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

    function renderizarCabecalhoSecao({ section }) {
        return (
            <View style={styles.cabecalhoSecao}>
                <Text style={styles.tituloSecao}>
                    {section.titulo}
                </Text>

                <Text style={styles.subtituloSecao}>
                    {section.subtitulo}
                </Text>
            </View>
        );
    }

    function renderizarSemAgenda() {
        if (idsMinhaAgenda.size > 0) {
            return null;
        }

        return (
            <View style={styles.semAgenda}>
                <Text style={styles.semAgendaTitulo}>
                    Meus vestibulares
                </Text>

                <Text style={styles.semAgendaTexto}>
                    Você ainda não adicionou nenhum vestibular à sua agenda.
                </Text>
            </View>
        );
    }

    if (carregando) {
        return (
            <View style={styles.containerCarregando}>
                <ActivityIndicator
                    size="large"
                    color="#285E73"
                />

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
                    onPress={buscarDados}
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
                placeholderTextColor="#8A969D"
                value={textoBusca}
                onChangeText={setTextoBusca}
            />

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.filtrosScroll}
                contentContainerStyle={styles.filtros}
            >
                {renderizarFiltro('Todos', 'todos')}
                {renderizarFiltro('Abertas', 'abertas')}
                {renderizarFiltro('Em breve', 'emBreve')}
                {renderizarFiltro('Inscrições encerradas', 'inscricoesEncerradas')}
                {renderizarFiltro('Processo encerrado', 'encerrado')}
            </ScrollView>

            {!usuario ? (
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
            ) : (
                <SectionList
                    sections={secoesVestibulares}
                    renderItem={renderizarVestibular}
                    renderSectionHeader={renderizarCabecalhoSecao}
                    keyExtractor={(item) => item.id_vestibular.toString()}
                    contentContainerStyle={styles.lista}
                    stickySectionHeadersEnabled={false}
                    ListHeaderComponent={
                        filtroSelecionado === 'todos' && !textoBusca.trim()
                            ? renderizarSemAgenda
                            : null
                    }
                    ListEmptyComponent={
                        <Text style={styles.semResultados}>
                            Nenhum vestibular encontrado.
                        </Text>
                    }
                />
            )}

            <Portal>
                <Dialog
                    visible={dialogLogin}
                    onDismiss={() => setDialogLogin(false)}
                    style={styles.dialog}
                >
                    <Dialog.Title style={styles.dialogTitulo}>
                        Login necessário
                    </Dialog.Title>

                    <Dialog.Content>
                        <Text style={styles.dialogTexto}>
                            Você precisa fazer login para acessar os detalhes do vestibular.
                        </Text>
                    </Dialog.Content>

                    <Dialog.Actions>
                        <Button
                            onPress={() => setDialogLogin(false)}
                            textColor="#5C6B73"
                        >
                            CANCELAR
                        </Button>

                        <Button
                            onPress={() => {
                                setDialogLogin(false);
                                navigation.navigate('LoginScreen');
                            }}
                            textColor="#285E73"
                        >
                            FAZER LOGIN
                        </Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#E8EFF8',
        paddingTop: 40
    },

    containerCarregando: {
        flex: 1,
        backgroundColor: '#E8EFF8',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20
    },

    title: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#285E73',
        marginHorizontal: 20
    },

    subtitulo: {
        fontSize: 14,
        color: '#5C6B73',
        marginHorizontal: 20,
        marginTop: 5,
        marginBottom: 20
    },

    busca: {
        backgroundColor: '#FFFFFF',
        marginHorizontal: 15,
        marginBottom: 10,
        borderRadius: 8,
        paddingHorizontal: 15,
        paddingVertical: 12,
        fontSize: 14,
        color: '#285E73'
    },

    filtrosScroll: {
        flexGrow: 0,
        height: 44,
        marginBottom: 10
    },

    filtros: {
        paddingHorizontal: 15,
        alignItems: 'center'
    },

    botaoFiltro: {
        height: 34,
        justifyContent: 'center',
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#C9D5DC',
        borderRadius: 18,
        paddingHorizontal: 14,
        marginRight: 8
    },

    botaoFiltroSelecionado: {
        backgroundColor: '#285E73',
        borderColor: '#285E73'
    },

    textoFiltro: {
        fontSize: 11,
        color: '#5C6B73',
        fontWeight: '600'
    },

    textoFiltroSelecionado: {
        color: '#FFFFFF'
    },

    lista: {
        paddingHorizontal: 10,
        paddingBottom: 20
    },

    cabecalhoSecao: {
        backgroundColor: '#E8EFF8',
        paddingHorizontal: 5,
        paddingTop: 10,
        paddingBottom: 10
    },

    tituloSecao: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#285E73'
    },

    subtituloSecao: {
        fontSize: 12,
        color: '#5C6B73',
        marginTop: 3
    },

    semAgenda: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#D7E1E7'
    },

    semAgendaTitulo: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#285E73',
        marginBottom: 5
    },

    semAgendaTexto: {
        fontSize: 13,
        color: '#5C6B73',
        lineHeight: 19
    },

    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 18,
        marginBottom: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        elevation: 2
    },

    informacoes: {
        flex: 1
    },

    nomeVestibular: {
        fontSize: 17,
        fontWeight: 'bold',
        color: '#285E73'
    },

    inscricoes: {
        fontSize: 13,
        color: '#5C6B73',
        marginTop: 6
    },

    status: {
        alignSelf: 'flex-start',
        borderRadius: 20,
        paddingHorizontal: 9,
        paddingVertical: 4,
        marginTop: 8
    },

    statusAberto: {
        backgroundColor: '#E4F4ED'
    },

    statusEmBreve: {
        backgroundColor: '#E7EFF8'
    },

    statusInscricoesEncerradas: {
        backgroundColor: '#FFF2D9'
    },

    statusEncerrado: {
        backgroundColor: '#F5E3E3'
    },

    textoStatus: {
        fontSize: 10,
        fontWeight: 'bold'
    },

    textoStatusAberto: {
        color: '#287A5B'
    },

    textoStatusEmBreve: {
        color: '#416B8A'
    },

    textoStatusInscricoesEncerradas: {
        color: '#9A6B16'
    },

    textoStatusEncerrado: {
        color: '#A84A4A'
    },

    botao: {
        borderWidth: 1,
        borderColor: '#285E73',
        borderRadius: 8,
        paddingVertical: 10,
        paddingHorizontal: 14,
        marginLeft: 10
    },

    textoBotao: {
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
    },

    botaoTentar: {
        borderWidth: 1,
        borderColor: '#285E73',
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 18
    },

    semResultados: {
        textAlign: 'center',
        color: '#5C6B73',
        marginTop: 30,
        fontSize: 14
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