import React, { useMemo, useRef, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    FlatList,
    Keyboard,
    ActivityIndicator
} from 'react-native';

import { WebView } from 'react-native-webview';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { Dialog, Portal, Button } from 'react-native-paper';

export default function MapaScreen() {
    const url_back = process.env.EXPO_PUBLIC_API_URL;
    const webViewRef = useRef(null);

    const [pesquisa, setPesquisa] = useState('');
    const [cursoSelecionado, setCursoSelecionado] = useState('');
    const [universidades, setUniversidades] = useState([]);
    const [carregando, setCarregando] = useState(false);
    const [erro, setErro] = useState(false);
    const [mostrarResultados, setMostrarResultados] = useState(false);

    const [localizacaoUsuario, setLocalizacaoUsuario] = useState(null);
    const [totalEncontrado, setTotalEncontrado] = useState(0);

    const [modoFiltro, setModoFiltro] = useState('proximidade');
    const [localManual, setLocalManual] = useState('');

    const [dialogVisivel, setDialogVisivel] = useState(false);
    const [dialogTitulo, setDialogTitulo] = useState('');
    const [dialogMensagem, setDialogMensagem] = useState('');

    const limiteResultados = 20;

    function mostrarDialog(titulo, mensagem) {
        setDialogTitulo(titulo);
        setDialogMensagem(mensagem);
        setDialogVisivel(true);
    }

    function normalizarTexto(texto) {
        return String(texto || '')
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase()
            .trim();
    }

    async function obterLocalizacaoUsuario() {
        try {
            const permissao = await Location.getForegroundPermissionsAsync();
            let status = permissao.status;

            if (status !== 'granted') {
                const resultado = await Location.requestForegroundPermissionsAsync();
                status = resultado.status;
            }

            if (status !== 'granted') {
                mostrarDialog(
                    'Localização necessária',
                    'Para ordenar as universidades por proximidade, permita o acesso à localização do dispositivo. Você também pode utilizar a opção "Escolher local".'
                );

                return null;
            }

            let localizacao = await Location.getLastKnownPositionAsync();

            if (!localizacao) {
                localizacao = await Location.getCurrentPositionAsync({
                    accuracy: Location.Accuracy.Low
                });
            }

            const coordenadas = {
                latitude: localizacao.coords.latitude,
                longitude: localizacao.coords.longitude
            };

            setLocalizacaoUsuario(coordenadas);
            return coordenadas;
        } catch (error) {
            mostrarDialog(
                'Localização indisponível',
                'Não foi possível acessar sua localização neste momento. Você pode tentar novamente ou pesquisar utilizando a opção "Escolher local".'
            );

            return null;
        }
    }

    function calcularDistancia(
        latitudeUsuario,
        longitudeUsuario,
        latitudeUniversidade,
        longitudeUniversidade
    ) {
        const raioTerra = 6371;
        const paraRadianos = graus => graus * (Math.PI / 180);

        const diferencaLatitude = paraRadianos(latitudeUniversidade - latitudeUsuario);
        const diferencaLongitude = paraRadianos(longitudeUniversidade - longitudeUsuario);

        const latitude1 = paraRadianos(latitudeUsuario);
        const latitude2 = paraRadianos(latitudeUniversidade);

        const a =
            Math.sin(diferencaLatitude / 2) ** 2 +
            Math.cos(latitude1) *
            Math.cos(latitude2) *
            Math.sin(diferencaLongitude / 2) ** 2;

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return raioTerra * c;
    }

    async function pesquisarCurso() {
        const texto = pesquisa.trim();

        if (!texto) {
            mostrarDialog(
                'Atenção',
                'Digite o nome de um curso para realizar a pesquisa.'
            );

            return;
        }

        if (modoFiltro === 'local' && !localManual.trim()) {
            mostrarDialog(
                'Atenção',
                'Digite uma cidade ou estado para filtrar os resultados.'
            );

            return;
        }

        try {
            setCarregando(true);
            setErro(false);
            setMostrarResultados(true);
            setCursoSelecionado(texto);

            Keyboard.dismiss();

            const resposta = await fetch(
                `${url_back}/buscarCursoMapa?curso=${encodeURIComponent(texto)}`
            );

            const dados = await resposta.json();

            if (!resposta.ok || dados.status === 'false') {
                throw new Error(
                    dados.mensagem || 'Não foi possível buscar os cursos'
                );
            }

            const resultados = Array.isArray(dados.resultados)
                ? dados.resultados
                : [];

            const resultadosValidos = resultados.filter(
                item =>
                    Number.isFinite(Number(item.latitude)) &&
                    Number.isFinite(Number(item.longitude))
            );

            if (modoFiltro === 'local') {
                setLocalizacaoUsuario(null);

                const termoLocal = normalizarTexto(localManual);

                const filtrados = resultadosValidos.filter(item => {
                    const municipio = normalizarTexto(item.municipio);
                    const estado = normalizarTexto(item.estado);
                    const localCompleto = `${municipio} ${estado}`;

                    return (
                        municipio.includes(termoLocal) ||
                        estado.includes(termoLocal) ||
                        localCompleto.includes(termoLocal)
                    );
                });

                setTotalEncontrado(filtrados.length);
                setUniversidades(filtrados.slice(0, limiteResultados));
                return;
            }

            const localizacao = await obterLocalizacaoUsuario();

            if (!localizacao) {
                setUniversidades([]);
                setTotalEncontrado(0);
                return;
            }

            const comDistancia = resultadosValidos.map(item => {
                const latitude = Number(item.latitude);
                const longitude = Number(item.longitude);

                const distancia = calcularDistancia(
                    localizacao.latitude,
                    localizacao.longitude,
                    latitude,
                    longitude
                );

                return {
                    ...item,
                    distancia
                };
            });

            comDistancia.sort((a, b) => a.distancia - b.distancia);

            setTotalEncontrado(comDistancia.length);
            setUniversidades(comDistancia.slice(0, limiteResultados));
        } catch (error) {
            setUniversidades([]);
            setTotalEncontrado(0);
            setErro(true);
        } finally {
            setCarregando(false);
        }
    }

    function limparPesquisa() {
        setPesquisa('');
        setCursoSelecionado('');
        setUniversidades([]);
        setMostrarResultados(false);
        setErro(false);
        setTotalEncontrado(0);
    }

    function trocarModo(novoModo) {
        setModoFiltro(novoModo);
        setUniversidades([]);
        setCursoSelecionado('');
        setMostrarResultados(false);
        setErro(false);
        setTotalEncontrado(0);
    }

    const universidadesValidas = useMemo(() => {
        return universidades.filter(
            item =>
                Number.isFinite(Number(item.latitude)) &&
                Number.isFinite(Number(item.longitude))
        );
    }, [universidades]);

    function focarUniversidade(item) {
        const latitude = Number(item.latitude);
        const longitude = Number(item.longitude);
        const idCurso = item.id_curso;

        if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
            return;
        }

        const script = `
            map.setView(
                [${latitude}, ${longitude}],
                11,
                { animate: true }
            );

            if (
                window.marcadoresPorId &&
                window.marcadoresPorId["${idCurso}"]
            ) {
                window.marcadoresPorId["${idCurso}"].openPopup();
            }

            true;
        `;

        webViewRef.current?.injectJavaScript(script);
    }

    function criarHtmlMapa() {
        const dados = universidadesValidas.map(item => ({
            ...item,
            latitude: Number(item.latitude),
            longitude: Number(item.longitude),
            notaFormatada: Number(item.nota_corte)
                .toFixed(2)
                .replace('.', ','),
            distanciaFormatada: Number.isFinite(Number(item.distancia))
                ? Number(item.distancia).toFixed(1)
                : null
        }));

        const localizacao =
            modoFiltro === 'proximidade' && localizacaoUsuario
                ? {
                    latitude: Number(localizacaoUsuario.latitude),
                    longitude: Number(localizacaoUsuario.longitude)
                }
                : null;

        return `
            <!DOCTYPE html>
            <html>
                <head>
                    <meta
                        name="viewport"
                        content="width=device-width, initial-scale=1.0, maximum-scale=1.0"
                    />

                    <link
                        rel="stylesheet"
                        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
                    />

                    <style>
                        html,
                        body {
                            margin: 0;
                            padding: 0;
                            width: 100%;
                            height: 100%;
                        }

                        #map {
                            width: 100%;
                            height: 100%;
                        }

                        .popup {
                            min-width: 190px;
                            font-family: Arial, sans-serif;
                        }

                        .sigla {
                            color: #285E73;
                            font-size: 16px;
                            font-weight: bold;
                            margin-bottom: 4px;
                        }

                        .nome {
                            color: #45555C;
                            font-size: 12px;
                            margin-bottom: 4px;
                        }

                        .local {
                            color: #7D8C92;
                            font-size: 11px;
                            margin-bottom: 8px;
                        }

                        .linha {
                            height: 1px;
                            background-color: #E5E9EB;
                            margin-bottom: 8px;
                        }

                        .curso {
                            color: #45555C;
                            font-size: 12px;
                            font-weight: bold;
                        }

                        .nota {
                            color: #285E73;
                            font-size: 13px;
                            font-weight: bold;
                            margin-top: 4px;
                        }

                        .distancia {
                            color: #65777F;
                            font-size: 11px;
                            margin-top: 6px;
                        }

                        .popupUsuario {
                            font-family: Arial, sans-serif;
                            color: #285E73;
                            font-size: 13px;
                            font-weight: bold;
                        }
                    </style>
                </head>

                <body>
                    <div id="map"></div>

                    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>

                    <script>
                        const universidades = ${JSON.stringify(dados)};
                        const localizacaoUsuario = ${JSON.stringify(localizacao)};

                        const map = L.map('map', {
                            zoomControl: true
                        }).setView(
                            [-21.5, -44.5],
                            5
                        );

                        window.map = map;
                        window.marcadoresPorId = {};

                        L.tileLayer(
                            'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
                            {
                                maxZoom: 19,
                                attribution: '&copy; OpenStreetMap'
                            }
                        ).addTo(map);

                        const marcadores = [];

                        if (localizacaoUsuario) {
                            const marcadorUsuario = L.circleMarker(
                                [
                                    localizacaoUsuario.latitude,
                                    localizacaoUsuario.longitude
                                ],
                                {
                                    radius: 9,
                                    color: '#285E73',
                                    fillColor: '#FFFFFF',
                                    fillOpacity: 1,
                                    weight: 4
                                }
                            ).addTo(map);

                            marcadorUsuario.bindPopup(
                                \`
                                    <div class="popupUsuario">
                                        Sua localização
                                    </div>
                                \`
                            );

                            marcadores.push(marcadorUsuario);
                        }

                        universidades.forEach(item => {
                            const marker = L.marker([
                                item.latitude,
                                item.longitude
                            ]).addTo(map);

                            const distanciaHtml = item.distanciaFormatada
                                ? \`
                                    <div class="distancia">
                                        Aproximadamente \${item.distanciaFormatada} km de você
                                    </div>
                                \`
                                : '';

                            marker.bindPopup(
                                \`
                                    <div class="popup">
                                        <div class="sigla">
                                            \${item.sigla || 'Universidade'}
                                        </div>

                                        <div class="nome">
                                            \${item.universidade}
                                        </div>

                                        <div class="local">
                                            \${item.municipio} - \${item.estado}
                                        </div>

                                        <div class="linha"></div>

                                        <div class="curso">
                                            \${item.curso}
                                        </div>

                                        <div class="nota">
                                            Nota de corte: \${item.notaFormatada}
                                        </div>

                                        \${distanciaHtml}
                                    </div>
                                \`
                            );

                            window.marcadoresPorId[
                                String(item.id_curso)
                            ] = marker;

                            marcadores.push(marker);
                        });

                        if (marcadores.length > 0) {
                            const grupo = L.featureGroup(marcadores);

                            map.fitBounds(
                                grupo.getBounds(),
                                {
                                    padding: [45, 45],
                                    maxZoom: 9
                                }
                            );
                        }
                    </script>
                </body>
            </html>
        `;
    }

    return (
        <View style={styles.container}>

            <Portal>
                <Dialog
                    visible={dialogVisivel}
                    onDismiss={() => setDialogVisivel(false)}
                    style={styles.dialog}
                >
                    <Dialog.Title style={styles.dialogTitulo}>
                        {dialogTitulo}
                    </Dialog.Title>

                    <Dialog.Content>
                        <Text style={styles.dialogMensagem}>
                            {dialogMensagem}
                        </Text>
                    </Dialog.Content>

                    <Dialog.Actions>
                        <Button
                            onPress={() => setDialogVisivel(false)}
                            textColor="#285E73"
                        >
                            OK
                        </Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>

            <View style={styles.header}>
                <Text style={styles.titulo}>
                    Notas de Corte
                </Text>

                <Text style={styles.subtitulo}>
                    Pesquise um curso e encontre universidades da região Sudeste.
                </Text>

                <View style={styles.areaPesquisa}>
                    <Ionicons
                        name="search-outline"
                        size={20}
                        color="#788B94"
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="Ex: Medicina"
                        placeholderTextColor="#9AA8AE"
                        value={pesquisa}
                        onChangeText={setPesquisa}
                        onSubmitEditing={pesquisarCurso}
                        returnKeyType="search"
                    />

                    {pesquisa.length > 0 && (
                        <TouchableOpacity onPress={limparPesquisa}>
                            <Ionicons
                                name="close-circle"
                                size={20}
                                color="#9AA8AE"
                            />
                        </TouchableOpacity>
                    )}
                </View>

                <View style={styles.areaFiltros}>
                    <TouchableOpacity
                        style={[
                            styles.botaoFiltro,
                            modoFiltro === 'proximidade' &&
                                styles.botaoFiltroAtivo
                        ]}
                        onPress={() => trocarModo('proximidade')}
                    >
                        <Ionicons
                            name="navigate-outline"
                            size={15}
                            color={
                                modoFiltro === 'proximidade'
                                    ? '#FFFFFF'
                                    : '#2D6B80'
                            }
                        />

                        <Text
                            style={[
                                styles.textoFiltro,
                                modoFiltro === 'proximidade' &&
                                    styles.textoFiltroAtivo
                            ]}
                        >
                            Mais próximos
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.botaoFiltro,
                            modoFiltro === 'local' &&
                                styles.botaoFiltroAtivo
                        ]}
                        onPress={() => trocarModo('local')}
                    >
                        <Ionicons
                            name="location-outline"
                            size={15}
                            color={
                                modoFiltro === 'local'
                                    ? '#FFFFFF'
                                    : '#2D6B80'
                            }
                        />

                        <Text
                            style={[
                                styles.textoFiltro,
                                modoFiltro === 'local' &&
                                    styles.textoFiltroAtivo
                            ]}
                        >
                            Escolher local
                        </Text>
                    </TouchableOpacity>
                </View>

                {modoFiltro === 'local' && (
                    <View style={styles.areaLocal}>
                        <Ionicons
                            name="location-outline"
                            size={19}
                            color="#788B94"
                        />

                        <TextInput
                            style={styles.inputLocal}
                            placeholder="Ex: Campinas, SP"
                            placeholderTextColor="#9AA8AE"
                            value={localManual}
                            onChangeText={setLocalManual}
                            returnKeyType="search"
                            onSubmitEditing={pesquisarCurso}
                        />

                        {localManual.length > 0 && (
                            <TouchableOpacity
                                onPress={() => setLocalManual('')}
                            >
                                <Ionicons
                                    name="close-circle"
                                    size={20}
                                    color="#9AA8AE"
                                />
                            </TouchableOpacity>
                        )}
                    </View>
                )}

                <TouchableOpacity
                    style={[
                        styles.botaoPesquisar,
                        carregando && styles.botaoDesativado
                    ]}
                    onPress={pesquisarCurso}
                    disabled={carregando}
                >
                    {carregando ? (
                        <ActivityIndicator
                            size="small"
                            color="#FFFFFF"
                        />
                    ) : (
                        <>
                            <Ionicons
                                name="map-outline"
                                size={18}
                                color="#FFFFFF"
                            />

                            <Text style={styles.textoBotaoPesquisar}>
                                BUSCAR NO MAPA
                            </Text>
                        </>
                    )}
                </TouchableOpacity>
            </View>

            <View style={styles.areaMapa}>
                <WebView
                    ref={webViewRef}
                    key={`${cursoSelecionado}-${universidades.length}-${modoFiltro}`}
                    originWhitelist={['*']}
                    source={{ html: criarHtmlMapa() }}
                    style={styles.mapa}
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                    mixedContentMode="always"
                />

                {!cursoSelecionado && (
                    <View style={styles.avisoMapa}>
                        <Ionicons
                            name="school-outline"
                            size={30}
                            color="#2D6B80"
                        />

                        <Text style={styles.avisoTitulo}>
                            Encontre universidades
                        </Text>

                        <Text style={styles.avisoTexto}>
                            Pesquise um curso para visualizar os resultados no mapa.
                        </Text>
                    </View>
                )}
            </View>

            {mostrarResultados && (
                <View style={styles.areaResultados}>
                    <View style={styles.cabecalhoResultados}>
                        <Text style={styles.tituloResultados}>
                            Resultados para "{cursoSelecionado}"
                        </Text>

                        {!erro && totalEncontrado > 0 && (
                            <>
                                <Text style={styles.quantidadeResultados}>
                                    {totalEncontrado} resultado(s) encontrado(s)
                                </Text>

                                <View style={styles.infoFiltro}>
                                    <Ionicons
                                        name={
                                            modoFiltro === 'proximidade'
                                                ? 'navigate-outline'
                                                : 'location-outline'
                                        }
                                        size={12}
                                        color="#2D6B80"
                                    />

                                    <Text style={styles.textoInfoFiltro}>
                                        {modoFiltro === 'proximidade'
                                            ? `Exibindo até ${limiteResultados} resultados mais próximos`
                                            : `Exibindo resultados para "${localManual}"`}
                                    </Text>
                                </View>
                            </>
                        )}
                    </View>

                    {erro ? (
                        <View style={styles.semResultado}>
                            <Ionicons
                                name="alert-circle-outline"
                                size={27}
                                color="#AABBC2"
                            />

                            <Text style={styles.textoSemResultado}>
                                Não foi possível buscar os cursos.
                            </Text>
                        </View>
                    ) : universidades.length === 0 && !carregando ? (
                        <View style={styles.semResultado}>
                            <Ionicons
                                name="search-outline"
                                size={26}
                                color="#AABBC2"
                            />

                            <Text style={styles.textoSemResultado}>
                                Nenhuma universidade encontrada para essa pesquisa.
                            </Text>
                        </View>
                    ) : (
                        <FlatList
                            data={universidades}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            keyExtractor={item =>
                                String(item.id_curso)
                            }
                            contentContainerStyle={styles.listaResultados}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={styles.cardUniversidade}
                                    activeOpacity={0.8}
                                    onPress={() =>
                                        focarUniversidade(item)
                                    }
                                >
                                    <View style={styles.topoCard}>
                                        <View style={styles.iconeUniversidade}>
                                            <Ionicons
                                                name="school-outline"
                                                size={19}
                                                color="#2D6B80"
                                            />
                                        </View>

                                        <Text
                                            style={styles.sigla}
                                            numberOfLines={1}
                                        >
                                            {item.sigla || 'Universidade'}
                                        </Text>
                                    </View>

                                    <Text
                                        style={styles.nomeUniversidade}
                                        numberOfLines={2}
                                    >
                                        {item.universidade}
                                    </Text>

                                    <View style={styles.localContainer}>
                                        <Ionicons
                                            name="location-outline"
                                            size={13}
                                            color="#849399"
                                        />

                                        <Text
                                            style={styles.localUniversidade}
                                            numberOfLines={1}
                                        >
                                            {item.municipio} - {item.estado}
                                        </Text>
                                    </View>

                                    {modoFiltro === 'proximidade' &&
                                        Number.isFinite(Number(item.distancia)) && (
                                            <View style={styles.distanciaContainer}>
                                                <Ionicons
                                                    name="navigate-outline"
                                                    size={11}
                                                    color="#2D6B80"
                                                />

                                                <Text
                                                    style={styles.distancia}
                                                    numberOfLines={1}
                                                >
                                                    {Number(item.distancia).toFixed(1)} km de você
                                                </Text>
                                            </View>
                                        )}

                                    <Text
                                        style={styles.curso}
                                        numberOfLines={1}
                                    >
                                        {item.curso}
                                    </Text>

                                    <View style={styles.rodapeCard}>
                                        <View>
                                            <Text style={styles.textoNota}>
                                                Nota de corte
                                            </Text>

                                            <Text style={styles.nota}>
                                                {Number(item.nota_corte)
                                                    .toFixed(2)
                                                    .replace('.', ',')}
                                            </Text>
                                        </View>

                                        <View style={styles.verNoMapa}>
                                            <Ionicons
                                                name="location-outline"
                                                size={13}
                                                color="#285E73"
                                            />

                                            <Text style={styles.textoVerNoMapa}>
                                                VER NO MAPA
                                            </Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            )}
                        />
                    )}
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F7F8'
    },

    header: {
        backgroundColor: '#FFFFFF',
        paddingTop: 42,
        paddingHorizontal: 18,
        paddingBottom: 12
    },

    titulo: {
        color: '#285E73',
        fontSize: 25,
        fontWeight: 'bold'
    },

    subtitulo: {
        color: '#6E7F86',
        fontSize: 13,
        marginTop: 4,
        lineHeight: 18
    },

    areaPesquisa: {
        marginTop: 14,
        backgroundColor: '#F1F4F5',
        borderRadius: 12,
        paddingHorizontal: 14,
        height: 46,
        flexDirection: 'row',
        alignItems: 'center'
    },

    input: {
        flex: 1,
        marginLeft: 9,
        color: '#36464D',
        fontSize: 14
    },

    areaFiltros: {
        flexDirection: 'row',
        gap: 8,
        marginTop: 10
    },

    botaoFiltro: {
        flex: 1,
        height: 38,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#D7E3E7',
        backgroundColor: '#FFFFFF',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 5
    },

    botaoFiltroAtivo: {
        backgroundColor: '#2D6B80',
        borderColor: '#2D6B80'
    },

    textoFiltro: {
        color: '#2D6B80',
        fontSize: 11,
        fontWeight: '700'
    },

    textoFiltroAtivo: {
        color: '#FFFFFF'
    },

    areaLocal: {
        marginTop: 8,
        backgroundColor: '#F1F4F5',
        borderRadius: 12,
        paddingHorizontal: 14,
        height: 44,
        flexDirection: 'row',
        alignItems: 'center'
    },

    inputLocal: {
        flex: 1,
        marginLeft: 8,
        color: '#36464D',
        fontSize: 13
    },

    botaoPesquisar: {
        backgroundColor: '#2D6B80',
        borderRadius: 12,
        height: 42,
        marginTop: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8
    },

    botaoDesativado: {
        opacity: 0.7
    },

    textoBotaoPesquisar: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '700'
    },

    areaMapa: {
        height: 350,
        position: 'relative',
        overflow: 'hidden'
    },

    mapa: {
        width: '100%',
        height: '100%',
        backgroundColor: '#EAEAEA'
    },

    avisoMapa: {
        position: 'absolute',
        alignSelf: 'center',
        top: '28%',
        width: '78%',
        backgroundColor: 'rgba(255,255,255,0.95)',
        borderRadius: 16,
        padding: 18,
        alignItems: 'center',
        elevation: 4
    },

    avisoTitulo: {
        color: '#285E73',
        fontSize: 15,
        fontWeight: '700',
        marginTop: 7
    },

    avisoTexto: {
        color: '#728188',
        fontSize: 12,
        textAlign: 'center',
        marginTop: 5,
        lineHeight: 17
    },

    areaResultados: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        paddingTop: 10,
        paddingBottom: 10
    },

    cabecalhoResultados: {
        paddingHorizontal: 18,
        marginBottom: 8
    },

    tituloResultados: {
        color: '#285E73',
        fontSize: 13,
        fontWeight: '700'
    },

    quantidadeResultados: {
        color: '#849399',
        fontSize: 10,
        marginTop: 2
    },

    infoFiltro: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 3,
        gap: 3
    },

    textoInfoFiltro: {
        color: '#2D6B80',
        fontSize: 10,
        fontWeight: '600'
    },

    listaResultados: {
        paddingHorizontal: 18,
        paddingBottom: 14,
        gap: 10
    },

    cardUniversidade: {
        width: 220,
        backgroundColor: '#F7F9FA',
        borderRadius: 14,
        padding: 12,
        borderWidth: 1,
        borderColor: '#E7ECEE',
        alignSelf: 'flex-start'
    },

    topoCard: {
        flexDirection: 'row',
        alignItems: 'center'
    },

    iconeUniversidade: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: '#E2EDF1',
        alignItems: 'center',
        justifyContent: 'center'
    },

    sigla: {
        flex: 1,
        marginLeft: 8,
        color: '#285E73',
        fontSize: 14,
        fontWeight: 'bold'
    },

    nomeUniversidade: {
        color: '#46565D',
        fontSize: 10,
        marginTop: 6,
        lineHeight: 14,
        minHeight: 28
    },

    localContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 2
    },

    localUniversidade: {
        flex: 1,
        color: '#849399',
        fontSize: 9,
        marginLeft: 2
    },

    distanciaContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
        gap: 3
    },

    distancia: {
        flex: 1,
        color: '#2D6B80',
        fontSize: 9,
        fontWeight: '600'
    },

    curso: {
        color: '#596970',
        fontSize: 10,
        marginTop: 5,
        fontWeight: '600'
    },

    rodapeCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginTop: 8,
        paddingTop: 7,
        borderTopWidth: 1,
        borderTopColor: '#E7ECEE'
    },

    textoNota: {
        color: '#78888F',
        fontSize: 9
    },

    nota: {
        color: '#285E73',
        fontSize: 15,
        fontWeight: 'bold',
        marginTop: 1
    },

    verNoMapa: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 2,
        paddingBottom: 2
    },

    textoVerNoMapa: {
        color: '#285E73',
        fontSize: 8,
        fontWeight: '700'
    },

    semResultado: {
        flex: 1,
        paddingVertical: 15,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20
    },

    textoSemResultado: {
        color: '#78888F',
        fontSize: 11,
        marginTop: 5,
        textAlign: 'center'
    },

    dialog: {
        backgroundColor: '#FFFFFF',
        borderRadius: 18
    },

    dialogTitulo: {
        color: '#285E73',
        fontSize: 20,
        fontWeight: '700'
    },

    dialogMensagem: {
        color: '#64757C',
        fontSize: 13,
        lineHeight: 20
    }
});