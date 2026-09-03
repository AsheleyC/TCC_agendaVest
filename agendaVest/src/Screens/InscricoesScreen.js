import React, { useCallback, useContext, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, ScrollView } from 'react-native';
import { Dialog, Portal, Button } from 'react-native-paper';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { AuthContext } from '../context/AuthContext';


const MESES = ['JANEIRO', 'FEVEREIRO', 'MARÇO', 'ABRIL', 'MAIO', 'JUNHO', 'JULHO', 'AGOSTO', 'SETEMBRO', 'OUTUBRO', 'NOVEMBRO', 'DEZEMBRO'];
const DIAS = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'];

export default function InscricoesScreen() {
    const navigation = useNavigation();
    const { usuario } = useContext(AuthContext);
    const url_back = process.env.EXPO_PUBLIC_API_URL;

    const [inscricoes, setInscricoes] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState(false);
    const [removendo, setRemovendo] = useState(null);

    const [dialog, setDialog] = useState({
        visible: false,
        titulo: '',
        mensagem: ''
    });

    const [dialogRemover, setDialogRemover] = useState({
        visible: false,
        id_inscricao: null
    });

    const hoje = new Date();
    const [mesAtual, setMesAtual] = useState(hoje.getMonth());
    const [anoAtual, setAnoAtual] = useState(hoje.getFullYear());
    const [diaSelecionado, setDiaSelecionado] = useState(hoje.getDate());

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

    function fecharDialogRemover() {
        setDialogRemover({
            visible: false,
            id_inscricao: null
        });
    }

    async function buscarInscricoes() {
        if (!usuario) {
            setInscricoes([]);
            setCarregando(false);
            return;
        }

        try {
            setCarregando(true);
            setErro(false);

            const resposta = await fetch(`${url_back}/verInscricoes/${usuario.id_usuario}`);

            if (!resposta.ok) throw new Error('Erro ao buscar inscrições');

            const dados = await resposta.json();
            setInscricoes(dados);
        } catch (error) {
            console.log('Erro ao buscar inscrições:', error);
            setErro(true);
        } finally {
            setCarregando(false);
        }
    }

    useFocusEffect(
        useCallback(() => {
            buscarInscricoes();
        }, [usuario])
    );

    function obterData(data) {
        if (!data) return null;

        const parteData = String(data).split('T')[0];
        const [ano, mes, dia] = parteData.split('-').map(Number);

        return { dia, mes: mes - 1, ano };
    }

    function formatarData(data) {
        const dataFormatada = obterData(data);

        if (!dataFormatada) return '';

        return `${String(dataFormatada.dia).padStart(2, '0')}/${String(dataFormatada.mes + 1).padStart(2, '0')}/${dataFormatada.ano}`;
    }

    function possuiVestibularNoDia(dia) {
        return inscricoes.some(item => {
            const data = obterData(item.data_prova);

            return data &&
                data.dia === dia &&
                data.mes === mesAtual &&
                data.ano === anoAtual;
        });
    }

    function vestibularesDoDia() {
        return inscricoes.filter(item => {
            const data = obterData(item.data_prova);

            return data &&
                data.dia === diaSelecionado &&
                data.mes === mesAtual &&
                data.ano === anoAtual;
        });
    }

    function gerarDiasCalendario() {
        const primeiroDia = new Date(anoAtual, mesAtual, 1).getDay();
        const quantidadeDias = new Date(anoAtual, mesAtual + 1, 0).getDate();
        const dias = [];

        for (let i = primeiroDia - 1; i >= 0; i--) {
            const quantidadeDiasAnterior = new Date(anoAtual, mesAtual, 0).getDate();

            dias.push({
                dia: quantidadeDiasAnterior - i,
                outroMes: true,
                chave: `anterior-${i}`
            });
        }

        for (let dia = 1; dia <= quantidadeDias; dia++) {
            dias.push({
                dia,
                outroMes: false,
                chave: `atual-${dia}`
            });
        }

        while (dias.length < 42) {
            dias.push({
                dia: dias.length - quantidadeDias - primeiroDia + 1,
                outroMes: true,
                chave: `proximo-${dias.length}`
            });
        }

        return dias;
    }

    function selecionarDia(dia) {
        setDiaSelecionado(dia);
    }

    function mudarMes(valor) {
        let novoMes = mesAtual + valor;
        let novoAno = anoAtual;

        if (novoMes < 0) {
            novoMes = 11;
            novoAno--;
        }

        if (novoMes > 11) {
            novoMes = 0;
            novoAno++;
        }

        setMesAtual(novoMes);
        setAnoAtual(novoAno);
        setDiaSelecionado(1);
    }

    function removerInscricao(id_inscricao) {
        setDialogRemover({
            visible: true,
            id_inscricao
        });
    }

    async function confirmarRemocao() {
        const id_inscricao = dialogRemover.id_inscricao;

        fecharDialogRemover();

        try {
            setRemovendo(id_inscricao);

            const resposta = await fetch(`${url_back}/delInscricao/${id_inscricao}`, {
                method: 'DELETE'
            });

            const resultado = await resposta.json();

            if (!resposta.ok) {
                mostrarDialog(
                    'Erro',
                    resultado.mensagem || resultado.erro || 'Não foi possível remover.'
                );
                return;
            }

            setInscricoes(lista =>
                lista.filter(item => item.id_inscricao !== id_inscricao)
            );
        } catch (error) {
            console.log('Erro ao remover:', error);

            mostrarDialog(
                'Erro',
                'Não foi possível conectar ao servidor.'
            );
        } finally {
            setRemovendo(null);
        }
    }

    function abrirDetalhes(id_vestibular) {
        navigation.navigate('VestibularDetalhesScreen', { id_vestibular });
    }

    if (!usuario) {
        return (
            <View style={styles.central}>
                <Text style={styles.title}>Minhas Inscrições</Text>
                <Text style={styles.mensagem}>Faça login para acessar sua agenda.</Text>

                <TouchableOpacity
                    style={styles.botao}
                    onPress={() => navigation.navigate('LoginScreen')}
                >
                    <Text style={styles.textoBotao}>FAZER LOGIN</Text>
                </TouchableOpacity>
            </View>
        );
    }

    if (carregando) {
        return (
            <View style={styles.central}>
                <ActivityIndicator size="large" color="#285E73" />
                <Text style={styles.mensagem}>Carregando sua agenda...</Text>
            </View>
        );
    }

    if (erro) {
        return (
            <View style={styles.central}>
                <Text style={styles.title}>Minhas Inscrições</Text>
                <Text style={styles.mensagemErro}>Não foi possível carregar sua agenda.</Text>

                <TouchableOpacity style={styles.botao} onPress={buscarInscricoes}>
                    <Text style={styles.textoBotao}>TENTAR NOVAMENTE</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const diasCalendario = gerarDiasCalendario();
    const vestibularesHoje = vestibularesDoDia();

    return (
        <>
            <ScrollView
                style={styles.container}
                contentContainerStyle={styles.conteudo}
            >
                <Text style={styles.title}>Minhas Inscrições</Text>

                <View style={styles.calendario}>
                    <View style={styles.cabecalhoCalendario}>
                        <TouchableOpacity style={styles.seta} onPress={() => mudarMes(-1)}>
                            <Text style={styles.textoSeta}>‹</Text>
                        </TouchableOpacity>

                        <Text style={styles.mes}>{MESES[mesAtual]} {anoAtual}</Text>

                        <TouchableOpacity style={styles.seta} onPress={() => mudarMes(1)}>
                            <Text style={styles.textoSeta}>›</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.linhaDiasSemana}>
                        {DIAS.map(dia => (
                            <Text key={dia} style={styles.diaSemana}>{dia}</Text>
                        ))}
                    </View>

                    <View style={styles.grade}>
                        {diasCalendario.map(item => {
                            const selecionado = !item.outroMes && item.dia === diaSelecionado;
                            const possuiVestibular = !item.outroMes && possuiVestibularNoDia(item.dia);

                            return (
                                <TouchableOpacity
                                    key={item.chave}
                                    style={[
                                        styles.celula,
                                        selecionado && styles.diaSelecionado
                                    ]}
                                    disabled={item.outroMes}
                                    onPress={() => selecionarDia(item.dia)}
                                >
                                    <Text style={[
                                        styles.numeroDia,
                                        item.outroMes && styles.diaOutroMes,
                                        selecionado && styles.numeroSelecionado
                                    ]}>
                                        {item.dia}
                                    </Text>

                                    {possuiVestibular && (
                                        <View style={[
                                            styles.ponto,
                                            selecionado && styles.pontoSelecionado
                                        ]} />
                                    )}
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </View>

                <View style={styles.tituloDetalhes}>
                    <Text style={styles.detalhesTitulo}>Detalhes do Dia</Text>

                    <View style={styles.contador}>
                        <Text style={styles.contadorTexto}>{vestibularesHoje.length}</Text>
                    </View>

                    <Text style={styles.textoVestibulares}>
                        {vestibularesHoje.length === 1 ? 'Vestibular' : 'Vestibulares'}
                    </Text>
                </View>

                {vestibularesHoje.length === 0 ? (
                    <View style={styles.semEvento}>
                        <Text style={styles.semEventoTexto}>Nenhum vestibular neste dia.</Text>
                    </View>
                ) : (
                    vestibularesHoje.map(item => (
                        <View style={styles.card} key={item.id_inscricao}>
                            <View style={styles.cardTopo}>
                                <View style={styles.informacoes}>
                                    <Text style={styles.nomeVestibular}>{item.vestibular}</Text>
                                    <Text style={styles.dataProva}>
                                        Data da prova: {formatarData(item.data_prova)}
                                    </Text>
                                </View>

                                <View style={styles.etiqueta}>
                                    <Text style={styles.etiquetaTexto}>INSCRITO</Text>
                                </View>
                            </View>

                            <View style={styles.linhaInfo}>
                                <Text style={styles.label}>Inscrições</Text>
                                <Text style={styles.valor}>
                                    {formatarData(item.data_inicio_inscricao)} até {formatarData(item.data_fim_inscricao)}
                                </Text>
                            </View>

                            <View style={styles.linhaInfo}>
                                <Text style={styles.label}>Taxa</Text>
                                <Text style={styles.valor}>
                                    R$ {Number(item.taxa_prova).toFixed(2).replace('.', ',')}
                                </Text>
                            </View>

                            <TouchableOpacity
                                style={styles.botaoDetalhes}
                                onPress={() => abrirDetalhes(item.id_vestibular)}
                            >
                                <Text style={styles.textoBotaoDetalhes}>VER DETALHES</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.botaoRemover}
                                disabled={removendo === item.id_inscricao}
                                onPress={() => removerInscricao(item.id_inscricao)}
                            >
                                {removendo === item.id_inscricao ? (
                                    <ActivityIndicator size="small" color="#B74A4A" />
                                ) : (
                                    <Text style={styles.textoBotaoRemover}>REMOVER DA AGENDA</Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    ))
                )}
            </ScrollView>

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
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#E8EFF8'
    },
    conteudo: {
        padding: 20,
        paddingTop: 45,
        paddingBottom: 30
    },
    central: {
        flex: 1,
        backgroundColor: '#E8EFF8',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 25
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#285E73',
        marginBottom: 20
    },
    calendario: {
        backgroundColor: '#FFFFFF',
        borderRadius: 14,
        padding: 12,
        elevation: 3
    },
    cabecalhoCalendario: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 12
    },
    seta: {
        width: 40,
        height: 35,
        alignItems: 'center',
        justifyContent: 'center'
    },
    textoSeta: {
        fontSize: 32,
        color: '#285E73',
        lineHeight: 34
    },
    mes: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#285E73'
    },
    linhaDiasSemana: {
        flexDirection: 'row',
        backgroundColor: '#E8EFF8',
        borderRadius: 6,
        paddingVertical: 8
    },
    diaSemana: {
        width: '14.28%',
        textAlign: 'center',
        fontSize: 10,
        fontWeight: 'bold',
        color: '#5C6B73'
    },
    grade: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 5
    },
    celula: {
        width: '14.28%',
        height: 48,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 9
    },
    diaSelecionado: {
        backgroundColor: '#285E73'
    },
    numeroDia: {
        fontSize: 14,
        color: '#27343A'
    },
    diaOutroMes: {
        color: '#C4CDD2'
    },
    numeroSelecionado: {
        color: '#FFFFFF',
        fontWeight: 'bold'
    },
    ponto: {
        width: 5,
        height: 5,
        borderRadius: 3,
        backgroundColor: '#D33F49',
        marginTop: 3
    },
    pontoSelecionado: {
        backgroundColor: '#FFFFFF'
    },
    tituloDetalhes: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 22,
        marginBottom: 12
    },
    detalhesTitulo: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#27343A'
    },
    contador: {
        backgroundColor: '#6EA4B8',
        minWidth: 27,
        height: 22,
        borderRadius: 11,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 9
    },
    contadorTexto: {
        color: '#FFFFFF',
        fontSize: 11,
        fontWeight: 'bold'
    },
    textoVestibulares: {
        fontSize: 14,
        color: '#27343A',
        marginLeft: 7
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 14,
        padding: 16,
        marginBottom: 12,
        elevation: 2
    },
    cardTopo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start'
    },
    informacoes: {
        flex: 1,
        marginRight: 10
    },
    nomeVestibular: {
        fontSize: 19,
        fontWeight: 'bold',
        color: '#285E73'
    },
    dataProva: {
        color: '#5C6B73',
        fontSize: 13,
        marginTop: 5
    },
    etiqueta: {
        backgroundColor: '#DDEFEA',
        borderRadius: 6,
        paddingHorizontal: 8,
        paddingVertical: 5
    },
    etiquetaTexto: {
        fontSize: 9,
        fontWeight: 'bold',
        color: '#28705D'
    },
    linhaInfo: {
        marginTop: 13
    },
    label: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#285E73',
        marginBottom: 2
    },
    valor: {
        fontSize: 13,
        color: '#5C6B73'
    },
    semEvento: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 20,
        alignItems: 'center'
    },
    semEventoTexto: {
        color: '#5C6B73',
        fontSize: 14
    },
    botaoDetalhes: {
        backgroundColor: '#285E73',
        borderRadius: 8,
        paddingVertical: 11,
        alignItems: 'center',
        marginTop: 15
    },
    textoBotaoDetalhes: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: 'bold'
    },
    botaoRemover: {
        borderWidth: 1,
        borderColor: '#B74A4A',
        borderRadius: 8,
        paddingVertical: 11,
        alignItems: 'center',
        marginTop: 8
    },
    textoBotaoRemover: {
        color: '#B74A4A',
        fontSize: 12,
        fontWeight: 'bold'
    },
    mensagem: {
        color: '#5C6B73',
        fontSize: 15,
        textAlign: 'center',
        marginBottom: 18
    },
    mensagemErro: {
        color: '#B74A4A',
        fontSize: 15,
        textAlign: 'center',
        marginBottom: 18
    },
    botao: {
        backgroundColor: '#285E73',
        borderRadius: 8,
        paddingVertical: 13,
        paddingHorizontal: 25
    },
    textoBotao: {
        color: '#FFFFFF',
        fontSize: 13,
        fontWeight: 'bold'
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