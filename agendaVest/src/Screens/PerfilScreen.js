import React, { useCallback, useContext, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ActivityIndicator,
    TouchableOpacity,
    TextInput,
    Alert,
    ScrollView,
    Image,
    Modal
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { AuthContext } from '../context/AuthContext';

export default function PerfilScreen() {
    const navigation = useNavigation();
    const { usuario, token, logout, setUsuario } = useContext(AuthContext);
    const url_back = process.env.EXPO_PUBLIC_API_URL;
    const [perfil, setPerfil] = useState(null);
    const [inscricoes, setInscricoes] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [editando, setEditando] = useState(false);
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [salvando, setSalvando] = useState(false);
    const [modalSenha, setModalSenha] = useState(false);
    const [senhaNova, setSenhaNova] = useState('');
    const [palavraChave, setPalavraChave] = useState('');
    const [alterandoSenha, setAlterandoSenha] = useState(false);
    const [confirmarExclusao, setConfirmarExclusao] = useState(false);
    const [senhaExclusao, setSenhaExclusao] = useState('');
    const [deletando, setDeletando] = useState(false);

    async function buscarDados() {
        if (!usuario || !token) {
            setCarregando(false);
            return;
        }

        try {
            setCarregando(true);

            const respostaPerfil = await fetch(
                `${url_back}/ver_perfil`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (!respostaPerfil.ok) {
                throw new Error('Erro ao buscar perfil');
            }

            const dadosPerfil = await respostaPerfil.json();
            const dados = dadosPerfil.resposta?.[0];

            setPerfil(dados);
            setNome(dados?.nome_usuario || '');
            setEmail(dados?.email || '');

            const respostaInscricoes = await fetch(
                `${url_back}/verInscricoes/${usuario.id_usuario}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (respostaInscricoes.ok) {
                const dadosInscricoes = await respostaInscricoes.json();
                setInscricoes(dadosInscricoes);
            }
        } catch (error) {
            console.log('Erro ao carregar perfil:', error);
            Alert.alert(
                'Erro',
                'Não foi possível carregar seus dados.'
            );
        } finally {
            setCarregando(false);
        }
    }

    useFocusEffect(
        useCallback(() => {
            buscarDados();
        }, [usuario, token])
    );

    async function trocarFoto() {
        try {
            const permissao =
                await ImagePicker.requestMediaLibraryPermissionsAsync();

            if (!permissao.granted) {
                Alert.alert(
                    'Permissão necessária',
                    'Permita o acesso às suas fotos para escolher uma foto de perfil.'
                );
                return;
            }

            const resultado =
                await ImagePicker.launchImageLibraryAsync({
                    mediaTypes: ['images'],
                    allowsEditing: true,
                    aspect: [1, 1],
                    quality: 0.8
                });

            if (resultado.canceled) {
                return;
            }

            const foto = resultado.assets[0];

            setPerfil(prev => ({
                ...prev,
                foto_perfil: foto.uri
            }));

            const formulario = new FormData();

            formulario.append('foto', {
                uri: foto.uri,
                name: 'foto_perfil.jpg',
                type: 'image/jpeg'
            });

            const resposta = await fetch(
                `${url_back}/atualizar_foto`,
                {
                    method: 'PUT',
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                    body: formulario
                }
            );

            const resultadoUpload = await resposta.json();

            if (
                !resposta.ok ||
                resultadoUpload.status === 'false'
            ) {
                throw new Error(
                    resultadoUpload.mensagem ||
                    'Erro ao enviar foto.'
                );
            }

            const novaFoto = resultadoUpload.foto_perfil;

            setPerfil(prev => ({
                ...prev,
                foto_perfil: novaFoto
            }));

            const usuarioAtualizado = {
                ...usuario,
                foto_perfil: novaFoto
            };

            await setUsuario(usuarioAtualizado);

            Alert.alert(
                'Sucesso',
                'Foto de perfil atualizada.'
            );
        } catch (error) {
            console.log('Erro ao trocar foto:', error);
            Alert.alert(
                'Erro',
                'Não foi possível atualizar sua foto de perfil.'
            );
        }
    }

    async function salvarPerfil() {
        if (!nome.trim()) {
            Alert.alert(
                'Atenção',
                'Digite seu nome de usuário.'
            );
            return;
        }

        if (!email.trim()) {
            Alert.alert(
                'Atenção',
                'Digite seu e-mail.'
            );
            return;
        }

        try {
            setSalvando(true);

            const nomeAlterado =
                nome.trim() !== perfil.nome_usuario;

            const emailAlterado =
                email.trim() !== perfil.email;

            if (!nomeAlterado && !emailAlterado) {
                setEditando(false);
                return;
            }

            if (nomeAlterado) {
                const respostaNome = await fetch(
                    `${url_back}/atualizar_nomeUsuario`,
                    {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${token}`
                        },
                        body: JSON.stringify({
                            nome_usuario: nome.trim()
                        })
                    }
                );

                const resultadoNome =
                    await respostaNome.json();

                if (
                    !respostaNome.ok ||
                    resultadoNome.status === 'false'
                ) {
                    Alert.alert(
                        'Erro',
                        resultadoNome.mensagem ||
                        'Não foi possível atualizar o nome.'
                    );
                    return;
                }
            }

            if (emailAlterado) {
                const respostaEmail = await fetch(
                    `${url_back}/atualizar_emailUsuario`,
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${token}`
                        },
                        body: JSON.stringify({
                            email_novo: email.trim()
                        })
                    }
                );

                const resultadoEmail =
                    await respostaEmail.json();

                if (
                    !respostaEmail.ok ||
                    resultadoEmail.status === 'false'
                ) {
                    Alert.alert(
                        'Erro',
                        resultadoEmail.mensagem ||
                        'Não foi possível atualizar o e-mail.'
                    );
                    return;
                }
            }

            const usuarioAtualizado = {
                ...usuario,
                nome_usuario: nome.trim(),
                email: email.trim()
            };

            await setUsuario(usuarioAtualizado);

            setPerfil(prev => ({
                ...prev,
                nome_usuario: nome.trim(),
                email: email.trim()
            }));

            setEditando(false);

            Alert.alert(
                'Sucesso',
                'Perfil atualizado com sucesso.'
            );
        } catch (error) {
            console.log('Erro ao salvar perfil:', error);
            Alert.alert(
                'Erro',
                'Não foi possível atualizar seu perfil.'
            );
        } finally {
            setSalvando(false);
        }
    }

    async function alterarSenha() {
        if (!senhaNova || !palavraChave) {
            Alert.alert(
                'Atenção',
                'Preencha todos os campos.'
            );
            return;
        }

        if (senhaNova.length < 6) {
            Alert.alert(
                'Atenção',
                'A nova senha deve conter no mínimo 6 caracteres.'
            );
            return;
        }

        try {
            setAlterandoSenha(true);

            const resposta = await fetch(
                `${url_back}/atualizarSenhaPerfil`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        senha_nova: senhaNova,
                        palavra_chave: palavraChave
                    })
                }
            );

            const resultado = await resposta.json();

            if (
                !resposta.ok ||
                resultado.status === 'false'
            ) {
                Alert.alert(
                    'Erro',
                    resultado.mensagem ||
                    'Não foi possível alterar a senha.'
                );
                return;
            }

            setSenhaNova('');
            setPalavraChave('');
            setModalSenha(false);

            Alert.alert(
                'Sucesso',
                'Sua senha foi alterada com sucesso.'
            );
        } catch (error) {
            console.log('Erro ao alterar senha:', error);
            Alert.alert(
                'Erro',
                'Não foi possível conectar ao servidor.'
            );
        } finally {
            setAlterandoSenha(false);
        }
    }

    async function deletarPerfil() {
        if (!senhaExclusao) {
            Alert.alert(
                'Atenção',
                'Digite sua senha para continuar.'
            );
            return;
        }

        try {
            setDeletando(true);

            const resposta = await fetch(
                `${url_back}/deletar_usuario`,
                {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        senha: senhaExclusao
                    })
                }
            );

            const resultado = await resposta.json();

            if (
                !resposta.ok ||
                resultado.status === 'false'
            ) {
                Alert.alert(
                    'Erro',
                    resultado.mensagem ||
                    'Não foi possível deletar seu perfil.'
                );
                return;
            }

            setConfirmarExclusao(false);
            setSenhaExclusao('');

            await logout();

            navigation.reset({
                index: 0,
                routes: [{ name: 'InicioScreen' }]
            });
        } catch (error) {
            console.log('Erro ao deletar perfil:', error);
            Alert.alert(
                'Erro',
                'Não foi possível conectar ao servidor.'
            );
        } finally {
            setDeletando(false);
        }
    }

    function formatarData(data) {
        if (!data) return '';

        const parteData = String(data).split('T')[0];
        const [ano, mes, dia] = parteData.split('-');

        return `${dia}/${mes}/${ano}`;
    }

    function abrirDetalhes(id_vestibular) {
        navigation.navigate(
            'VestibularDetalhesScreen',
            {
                id_vestibular
            }
        );
    }

    function sair() {
        Alert.alert(
            'Sair da conta',
            'Deseja realmente sair da sua conta?',
            [
                {
                    text: 'CANCELAR',
                    style: 'cancel'
                },
                {
                    text: 'SAIR',
                    style: 'destructive',
                    onPress: async () => {
                        await logout();

                        navigation.reset({
                            index: 0,
                            routes: [{ name: 'InicioScreen' }]
                        });
                    }
                }
            ]
        );
    }

    if (!usuario) {
        return (
            <View style={styles.central}>
                <Text style={styles.title}>
                    Meu Perfil
                </Text>

                <Text style={styles.mensagem}>
                    Faça login para acessar seu perfil.
                </Text>

                <TouchableOpacity
                    style={styles.botao}
                    onPress={() =>
                        navigation.navigate('LoginScreen')
                    }
                >
                    <Text style={styles.textoBotao}>
                        FAZER LOGIN
                    </Text>
                </TouchableOpacity>
            </View>
        );
    }

    if (carregando) {
        return (
            <View style={styles.central}>
                <ActivityIndicator
                    size="large"
                    color="#285E73"
                />

                <Text style={styles.mensagem}>
                    Carregando seu perfil...
                </Text>
            </View>
        );
    }

    return (
        <>
            <ScrollView
                style={styles.container}
                contentContainerStyle={styles.conteudo}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.cabecalho}>
                    {perfil?.foto_perfil ? (
                        <Image
                            source={{
                                uri: perfil.foto_perfil.startsWith('http')
                                    ? perfil.foto_perfil
                                    : `${url_back}${perfil.foto_perfil}`
                            }}
                            style={styles.foto}
                            onError={erro =>
                                console.log(
                                    'Erro ao carregar foto:',
                                    erro.nativeEvent
                                )
                            }
                        />
                    ) : (
                        <View style={styles.fotoPadrao}>
                            <Text style={styles.letra}>
                                {(perfil?.nome_usuario || 'U')
                                    .charAt(0)
                                    .toUpperCase()}
                            </Text>
                        </View>
                    )}

                    <TouchableOpacity
                        style={styles.trocarFoto}
                        onPress={trocarFoto}
                    >
                        <Text style={styles.textoTrocarFoto}>
                            TROCAR FOTO DE PERFIL
                        </Text>
                    </TouchableOpacity>

                    <Text style={styles.nomeCabecalho}>
                        {perfil?.nome_usuario}
                    </Text>

                    <Text style={styles.emailCabecalho}>
                        {perfil?.email}
                    </Text>
                </View>

                <View style={styles.secao}>
                    <View style={styles.secaoCabecalho}>
                        <Text style={styles.tituloSecao}>
                            Meus dados
                        </Text>

                        <TouchableOpacity
                            onPress={() =>
                                setEditando(!editando)
                            }
                        >
                            <Text style={styles.editar}>
                                {editando
                                    ? 'CANCELAR'
                                    : 'EDITAR'}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.label}>
                        Nome de usuário
                    </Text>

                    {editando ? (
                        <TextInput
                            style={styles.input}
                            value={nome}
                            onChangeText={setNome}
                            placeholder="Nome de usuário"
                            placeholderTextColor="#9AA6AD"
                        />
                    ) : (
                        <Text style={styles.valor}>
                            {perfil?.nome_usuario}
                        </Text>
                    )}

                    <Text style={styles.label}>
                        E-mail
                    </Text>

                    {editando ? (
                        <TextInput
                            style={styles.input}
                            value={email}
                            onChangeText={setEmail}
                            placeholder="E-mail"
                            placeholderTextColor="#9AA6AD"
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                    ) : (
                        <Text style={styles.valor}>
                            {perfil?.email}
                        </Text>
                    )}

                    {editando && (
                        <TouchableOpacity
                            style={styles.botaoSalvar}
                            disabled={salvando}
                            onPress={salvarPerfil}
                        >
                            {salvando ? (
                                <ActivityIndicator
                                    size="small"
                                    color="#FFFFFF"
                                />
                            ) : (
                                <Text style={styles.textoBotao}>
                                    SALVAR ALTERAÇÕES
                                </Text>
                            )}
                        </TouchableOpacity>
                    )}
                </View>

                <View style={styles.secao}>
                    <Text style={styles.tituloSecao}>
                        Segurança
                    </Text>

                    {!modalSenha ? (
                        <TouchableOpacity
                            style={styles.opcao}
                            onPress={() =>
                                setModalSenha(true)
                            }
                        >
                            <View>
                                <Text style={styles.opcaoTitulo}>
                                    Alterar senha
                                </Text>

                                <Text style={styles.opcaoTexto}>
                                    Atualize sua senha usando sua palavra-chave.
                                </Text>
                            </View>

                            <Text style={styles.seta}>
                                ›
                            </Text>
                        </TouchableOpacity>
                    ) : (
                        <View>
                            <Text style={styles.label}>
                                Nova senha
                            </Text>

                            <TextInput
                                style={styles.input}
                                value={senhaNova}
                                onChangeText={setSenhaNova}
                                placeholder="Digite a nova senha"
                                placeholderTextColor="#9AA6AD"
                                secureTextEntry
                            />

                            <Text style={styles.label}>
                                Palavra-chave
                            </Text>

                            <TextInput
                                style={styles.input}
                                value={palavraChave}
                                onChangeText={setPalavraChave}
                                placeholder="Digite sua palavra-chave"
                                placeholderTextColor="#9AA6AD"
                                secureTextEntry
                            />

                            <TouchableOpacity
                                style={styles.botaoSalvar}
                                disabled={alterandoSenha}
                                onPress={alterarSenha}
                            >
                                {alterandoSenha ? (
                                    <ActivityIndicator
                                        size="small"
                                        color="#FFFFFF"
                                    />
                                ) : (
                                    <Text style={styles.textoBotao}>
                                        ALTERAR SENHA
                                    </Text>
                                )}
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.botaoCancelar}
                                onPress={() => {
                                    setModalSenha(false);
                                    setSenhaNova('');
                                    setPalavraChave('');
                                }}
                            >
                                <Text style={styles.textoCancelar}>
                                    CANCELAR
                                </Text>
                            </TouchableOpacity>
                        </View>
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

                <TouchableOpacity
                    style={styles.botaoSair}
                    onPress={sair}
                >
                    <Text style={styles.textoSair}>
                        SAIR DA CONTA
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.botaoDeletar}
                    onPress={() =>
                        setConfirmarExclusao(true)
                    }
                >
                    <Text style={styles.textoDeletar}>
                        DELETAR PERFIL
                    </Text>
                </TouchableOpacity>
            </ScrollView>

            <Modal
                visible={confirmarExclusao}
                transparent
                animationType="fade"
                onRequestClose={() =>
                    setConfirmarExclusao(false)
                }
            >
                <View style={styles.fundoModal}>
                    <View style={styles.modal}>
                        <Text style={styles.confirmacaoTitulo}>
                            Deletar perfil
                        </Text>

                        <Text style={styles.confirmacaoTexto}>
                            Digite sua senha para confirmar a exclusão da conta.
                        </Text>

                        <TextInput
                            style={styles.input}
                            value={senhaExclusao}
                            onChangeText={setSenhaExclusao}
                            placeholder="Sua senha"
                            placeholderTextColor="#9AA6AD"
                            secureTextEntry
                        />

                        <TouchableOpacity
                            style={styles.botaoDeletarConfirmar}
                            disabled={deletando}
                            onPress={deletarPerfil}
                        >
                            {deletando ? (
                                <ActivityIndicator
                                    size="small"
                                    color="#FFFFFF"
                                />
                            ) : (
                                <Text style={styles.textoDeletarConfirmar}>
                                    CONFIRMAR EXCLUSÃO
                                </Text>
                            )}
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.botaoCancelar}
                            onPress={() => {
                                setConfirmarExclusao(false);
                                setSenhaExclusao('');
                            }}
                        >
                            <Text style={styles.textoCancelar}>
                                CANCELAR
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
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
        paddingTop: 40,
        paddingBottom: 35
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
        color: '#285E73'
    },
    cabecalho: {
        backgroundColor: '#285E73',
        alignItems: 'center',
        paddingTop: 35,
        paddingBottom: 28,
        marginHorizontal: -20,
        marginTop: -40,
        marginBottom: 18
    },
    foto: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 3,
        borderColor: '#FFFFFF',
        marginBottom: 10
    },
    fotoPadrao: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#6EA4B8',
        borderWidth: 3,
        borderColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10
    },
    letra: {
        color: '#FFFFFF',
        fontSize: 38,
        fontWeight: 'bold'
    },
    trocarFoto: {
        borderWidth: 1,
        borderColor: '#FFFFFF',
        borderRadius: 7,
        paddingHorizontal: 12,
        paddingVertical: 6,
        marginBottom: 12
    },
    textoTrocarFoto: {
        color: '#FFFFFF',
        fontSize: 10,
        fontWeight: 'bold'
    },
    nomeCabecalho: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#FFFFFF'
    },
    emailCabecalho: {
        fontSize: 13,
        color: '#DCEAF0',
        marginTop: 4
    },
    secao: {
        backgroundColor: '#FFFFFF',
        borderRadius: 14,
        padding: 16,
        marginBottom: 14,
        elevation: 2
    },
    secaoCabecalho: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 15
    },
    tituloSecao: {
        fontSize: 19,
        fontWeight: 'bold',
        color: '#27343A'
    },
    editar: {
        fontSize: 11,
        fontWeight: 'bold',
        color: '#285E73'
    },
    label: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#285E73',
        marginBottom: 5,
        marginTop: 10
    },
    valor: {
        fontSize: 15,
        color: '#5C6B73',
        paddingBottom: 8
    },
    input: {
        borderWidth: 1,
        borderColor: '#C9D5DC',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 14,
        color: '#27343A',
        backgroundColor: '#F8FAFC'
    },
    botaoSalvar: {
        backgroundColor: '#285E73',
        borderRadius: 8,
        paddingVertical: 12,
        alignItems: 'center',
        marginTop: 15
    },
    textoBotao: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: 'bold'
    },
    opcao: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 4
    },
    opcaoTitulo: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#285E73'
    },
    opcaoTexto: {
        fontSize: 12,
        color: '#5C6B73',
        marginTop: 3
    },
    seta: {
        fontSize: 28,
        color: '#6EA4B8'
    },
    botaoCancelar: {
        alignItems: 'center',
        paddingVertical: 10,
        marginTop: 3
    },
    textoCancelar: {
        color: '#5C6B73',
        fontSize: 12,
        fontWeight: 'bold'
    },
    quantidade: {
        backgroundColor: '#6EA4B8',
        color: '#FFFFFF',
        minWidth: 26,
        height: 22,
        borderRadius: 11,
        textAlign: 'center',
        paddingTop: 4,
        fontSize: 11,
        fontWeight: 'bold'
    },
    vestibular: {
        borderTopWidth: 1,
        borderTopColor: '#E2E8EC',
        paddingVertical: 13,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    vestibularInfo: {
        flex: 1
    },
    vestibularNome: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#285E73'
    },
    vestibularData: {
        fontSize: 13,
        color: '#5C6B73',
        marginTop: 4
    },
    inscrito: {
        alignSelf: 'flex-start',
        backgroundColor: '#DDEFEA',
        color: '#28705D',
        fontSize: 9,
        fontWeight: 'bold',
        paddingHorizontal: 7,
        paddingVertical: 4,
        borderRadius: 5,
        marginTop: 6
    },
    detalhes: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#285E73',
        marginLeft: 10
    },
    semInscricoes: {
        paddingVertical: 5
    },
    botao: {
        backgroundColor: '#285E73',
        borderRadius: 8,
        paddingVertical: 13,
        paddingHorizontal: 25
    },
    mensagem: {
        color: '#5C6B73',
        fontSize: 15,
        textAlign: 'center',
        marginBottom: 18,
        marginTop: 8
    },
    botaoSair: {
        borderWidth: 1,
        borderColor: '#B74A4A',
        borderRadius: 8,
        paddingVertical: 13,
        alignItems: 'center',
        marginTop: 3
    },
    textoSair: {
        color: '#B74A4A',
        fontSize: 12,
        fontWeight: 'bold'
    },
    botaoDeletar: {
        alignItems: 'center',
        paddingVertical: 13,
        marginTop: 8
    },
    textoDeletar: {
        color: '#B74A4A',
        fontSize: 11,
        fontWeight: 'bold'
    },
    fundoModal: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 25
    },
    modal: {
        width: '100%',
        backgroundColor: '#FFFFFF',
        borderRadius: 14,
        padding: 20,
        elevation: 5
    },
    confirmacaoTitulo: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#B74A4A',
        marginBottom: 5
    },
    confirmacaoTexto: {
        fontSize: 13,
        color: '#5C6B73',
        lineHeight: 19,
        marginBottom: 8
    },
    botaoDeletarConfirmar: {
        backgroundColor: '#B74A4A',
        borderRadius: 8,
        paddingVertical: 12,
        alignItems: 'center',
        marginTop: 12
    },
    textoDeletarConfirmar: {
        color: '#FFFFFF',
        fontSize: 11,
        fontWeight: 'bold'
    }
});