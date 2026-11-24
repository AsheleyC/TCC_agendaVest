import React, { createContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [usuario, setUsuario] = useState(null);
    const [token, setToken] = useState(null);
    const [carregando, setCarregando] = useState(true);

    useEffect(() => {
        carregarLogin();
    }, []);

    async function carregarLogin() {
        try {
            const usuarioSalvo = await AsyncStorage.getItem('@AgendaVest_usuario');
            const tokenSalvo = await AsyncStorage.getItem('@AgendaVest_token');

            if (usuarioSalvo && tokenSalvo) {
                setUsuario(JSON.parse(usuarioSalvo));
                setToken(tokenSalvo);
            }
        } catch (error) {
            console.log('Erro ao carregar login:', error);
        } finally {
            setCarregando(false);
        }
    }

    async function login(dadosUsuario, tokenRecebido) {
        try {
            await AsyncStorage.setItem(
                '@AgendaVest_usuario',
                JSON.stringify(dadosUsuario)
            );

            await AsyncStorage.setItem(
                '@AgendaVest_token',
                tokenRecebido
            );

            setUsuario(dadosUsuario);
            setToken(tokenRecebido);
        } catch (error) {
            console.log('Erro ao salvar login:', error);
        }
    }

    async function logout() {
        try {
            await AsyncStorage.removeItem('@AgendaVest_usuario');
            await AsyncStorage.removeItem('@AgendaVest_token');

            setUsuario(null);
            setToken(null);
        } catch (error) {
            console.log('Erro ao sair da conta:', error);
        }
    }

    async function atualizarUsuario(dadosAtualizados) {
        try {
            await AsyncStorage.setItem(
                '@AgendaVest_usuario',
                JSON.stringify(dadosAtualizados)
            );

            setUsuario(dadosAtualizados);
        } catch (error) {
            console.log('Erro ao atualizar usuário:', error);
        }
    }

    return (
        <AuthContext.Provider
            value={{
                usuario,
                token,
                carregando,
                login,
                logout,
                setUsuario: atualizarUsuario
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}