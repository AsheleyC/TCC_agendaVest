import React, { useMemo, useRef, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, Keyboard, ActivityIndicator } from 'react-native';

import { WebView } from 'react-native-webview';
import { Ionicons } from '@expo/vector-icons';

export default function MapaScreen() {
    const url_back = process.env.EXPO_PUBLIC_API_URL;

    const webViewRef = useRef(null);

    const [pesquisa, setPesquisa] = useState('');
    const [cursoSelecionado, setCursoSelecionado] = useState('');
    const [universidades, setUniversidades] = useState([]);
    const [carregando, setCarregando] = useState(false);
    const [erro, setErro] = useState(false);
    const [mostrarResultados, setMostrarResultados] = useState(false);

    async function pesquisarCurso() {
        const texto = pesquisa.trim();

        if (!texto) {
            setCursoSelecionado('');
            setUniversidades([]);
            setMostrarResultados(false);
            setErro(false);
            Keyboard.dismiss();
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
                    dados.mensagem ||
                    'Não foi possível buscar os cursos'
                );
            }

            const resultados = Array.isArray(dados.resultados)
                ? dados.resultados
                : [];

            const resultadosValidos = resultados.filter(
                item =>
                    item.latitude !== null &&
                    item.longitude !== null
            );

            setUniversidades(resultadosValidos);
        } catch (error) {
            setUniversidades([]);
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

        if (
            !Number.isFinite(latitude) ||
            !Number.isFinite(longitude)
        ) {
            return;
        }

        const script = `
            map.setView(
                [${latitude}, ${longitude}],
                11,
                {
                    animate: true
                }
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
                .replace('.', ',')
        }));

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
                    </style>
                </head>

                <body>
                    <div id="map"></div>

                    <script
                        src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js">
                    </script>

                    <script>
                        const universidades =
                            ${JSON.stringify(dados)};

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

                        universidades.forEach(item => {
                            const marker = L.marker([
                                item.latitude,
                                item.longitude
                            ]).addTo(map);

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
                                            Nota de corte:
                                            \${item.notaFormatada}
                                        </div>
                                    </div>
                                \`
                            );

                            window.marcadoresPorId[
                                String(item.id_curso)
                            ] = marker;

                            marcadores.push(marker);
                        });

                        if (marcadores.length > 0) {
                            const grupo =
                                L.featureGroup(marcadores);

                            map.fitBounds(
                                grupo.getBounds(),
                                {
                                    padding: [45, 45],
                                    maxZoom: 7
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
            <View style={styles.header}>
                <Text style={styles.titulo}>
                    Notas de Corte
                </Text>

                <Text style={styles.subtitulo}>
                    Pesquise um curso e veja universidades da região Sudeste.
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
                        <TouchableOpacity
                            onPress={limparPesquisa}
                        >
                            <Ionicons
                                name="close-circle"
                                size={20}
                                color="#9AA8AE"
                            />
                        </TouchableOpacity>
                    )}
                </View>

                <TouchableOpacity
                    style={[
                        styles.botaoPesquisar,
                        carregando &&
                        styles.botaoDesativado
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
                    key={`${cursoSelecionado}-${universidades.length}`}
                    originWhitelist={['*']}
                    source={{
                        html: criarHtmlMapa()
                    }}
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

                        <Text style={styles.quantidadeResultados}>
                            {universidades.length} universidade(s) encontrada(s)
                        </Text>
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
                                Nenhuma universidade encontrada para esse curso.
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
                            contentContainerStyle={
                                styles.listaResultados
                            }
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
                                                size={20}
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

                                    <Text style={styles.curso}>
                                        {item.curso}
                                    </Text>

                                    <View style={styles.notaContainer}>
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
        paddingBottom: 8
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

    listaResultados: {
        paddingHorizontal: 18,
        paddingBottom: 6,
        gap: 10
    },

    cardUniversidade: {
        width: 215,
        backgroundColor: '#F7F9FA',
        borderRadius: 14,
        padding: 12,
        borderWidth: 1,
        borderColor: '#E7ECEE'
    },

    topoCard: {
        flexDirection: 'row',
        alignItems: 'center'
    },

    iconeUniversidade: {
        width: 32,
        height: 32,
        borderRadius: 16,
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
        fontSize: 11,
        marginTop: 7,
        minHeight: 29
    },

    localContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 3
    },

    localUniversidade: {
        flex: 1,
        color: '#849399',
        fontSize: 10,
        marginLeft: 2
    },

    curso: {
        color: '#596970',
        fontSize: 10,
        marginTop: 5,
        fontWeight: '600'
    },

    notaContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 8
    },

    textoNota: {
        color: '#78888F',
        fontSize: 10
    },

    nota: {
        color: '#285E73',
        fontSize: 15,
        fontWeight: 'bold'
    },

    verNoMapa: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        marginTop: 8,
        gap: 3
    },

    textoVerNoMapa: {
        color: '#285E73',
        fontSize: 9,
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
    }
});