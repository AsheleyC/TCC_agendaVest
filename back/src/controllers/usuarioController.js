/**
 * Controller de Usuários.
 * Trata as requisições HTTP, aplica lógica de negócio
 * e delega operações de banco ao UsuarioModel.
 */
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const UsuarioModel = require('../models/usuarioModel')

const api_key = process.env.api_key

const UsuarioController = {

    async verPerfil(req, res) {
        try {
            const { id_usuario } = req.query
            const resultado = await UsuarioModel.buscarPerfilPorId(id_usuario)
            return res.json({ resposta: resultado })
        } catch (error) {
            console.error('[verPerfil]', error)
            return res.status(500).json({ resposta: 'Erro interno ao buscar perfil', status: 'false' })
        }
    },

    async cadastrar(req, res) {
        try {
            const { nome_usuario, email, foto_perfil } = req.body
            let { senha, palavra_chave } = req.body

            senha = senha.trim()
            palavra_chave = palavra_chave.trim()

            if (!nome_usuario || nome_usuario.trim() === '') {
                return res.json({
                    resposta: 'Preencha o campo nome',
                    status: 'false'
                })
            }

            if (palavra_chave.length < 3) {
                return res.json({
                    resposta: 'Mínimo 3 caracteres no campo Palavra chave',
                    status: 'false'
                })
            }

            if (nome_usuario.trim().length < 3) {
                return res.json({
                    resposta: 'O nome de usuário deve conter no mínimo 3 caracteres',
                    status: 'false'
                })
            }

            if (!email || email.trim() === '') {
                return res.json({
                    resposta: 'Preencha o campo e-mail',
                    status: 'false'
                })
            }

            // Validação do formato do e-mail
            const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

            if (!emailValido) {
                return res.json({
                    resposta: 'Digite um e-mail válido',
                    status: 'false'
                })
            }

            if (senha === '') {
                return res.json({
                    resposta: 'Preencha o campo senha',
                    status: 'false'
                })
            }

            if (senha.length < 6) {
                return res.json({
                    resposta: 'A senha deve conter no mínimo 6 caracteres',
                    status: 'false'
                })
            }

            const emailExistente = await UsuarioModel.buscarPorEmail(email)

            if (emailExistente.length !== 0) {
                return res.json({
                    resposta: 'E-mail já cadastrado',
                    status: 'false'
                })
            }

            const hash = await bcrypt.hash(senha, 10)
            const palavra_hash = await bcrypt.hash(palavra_chave, 10)

            const resultado = await UsuarioModel.cadastrar(
                nome_usuario.trim(),
                email.trim(),
                hash,
                palavra_hash,
                foto_perfil
            )

            if (resultado.affectedRows > 0) {
                return res.json({
                    resposta: 'Cadastro realizado',
                    status: 'true'
                })
            } else {
                return res.json({
                    resposta: 'Erro no cadastro',
                    status: 'false'
                })
            }
        } catch (error) {
            console.error('[cadastrar]', error)
            return res.status(500).json({ resposta: 'Erro interno ao realizar cadastro', status: 'false' })
        }
    },

    async login(req, res) {
        try {
            const { email, senha } = req.body

            const usuarioExistente = await UsuarioModel.buscarPorEmail(email)

            if (usuarioExistente.length > 0) {
                const credenciais = await UsuarioModel.buscarCredenciaisPorEmail(email)
                const senhaValida = await bcrypt.compare(senha, credenciais[0].senha)

                if (!senhaValida)
                    return res.json({ status: 'false', mensagem: 'Email ou senha inválidos!!' })

                const token = jwt.sign({ email }, api_key, { expiresIn: '1h' })
                return res.json({ status: 'true', mensagem: 'Acesso liberado', token })
            } else {
                return res.json({ status: 'false', mensagem: 'Email ou senha inválidos!!' })
            }
        } catch (error) {
            console.error('[login]', error)
            return res.status(500).json({ status: 'false', mensagem: 'Erro interno ao realizar login' })
        }
    },

    async atualizarNome(req, res) {
        try {
            const { nome_usuario, email } = req.body
            const usuarioExistente = await UsuarioModel.buscarPorEmail(email)
            if (usuarioExistente.length === 0)
                return res.json({ mensagem: 'E-mail Inexistente', status: 'false' })

            const resultado = await UsuarioModel.atualizarNome(nome_usuario, email)
            return res.json({
                resultado,
                mensagem: `Nome de usuário Atualizado para: ${nome_usuario}`,
                status: 'true',
            })
        } catch (error) {
            console.error('[atualizarNome]', error)
            return res.status(500).json({ mensagem: 'Erro interno ao atualizar nome', status: 'false' })
        }
    },

    async atualizarEmail(req, res) {
        try {
            const { email_antigo, email_novo } = req.body
            const usuarioExistente = await UsuarioModel.buscarPorEmail(email_antigo)
            if (usuarioExistente.length === 0)
                return res.json({ mensagem: 'E-mail Inexistente', status: 'false' })

            const resultado = await UsuarioModel.atualizarEmail(email_novo, email_antigo)
            return res.json({
                resultado,
                mensagem: `Email do usuário Atualizado para: ${email_novo}`,
                status: 'true',
            })
        } catch (error) {
            console.error('[atualizarEmail]', error)
            return res.status(500).json({ mensagem: 'Erro interno ao atualizar e-mail', status: 'false' })
        }
    },

    async atualizarSenha(req, res) {
        try {
            const { email, senha_nova, palavra_chave } = req.body

            if (!email || !senha_nova || !palavra_chave) {
                return res.json({
                    mensagem: 'Preencha todos os campos',
                    status: 'false'
                })
            }

            if (senha_nova.length < 6) {
                return res.json({
                    mensagem: 'A nova senha deve conter no mínimo 6 caracteres',
                    status: 'false'
                })
            }

            const usuarioExistente = await UsuarioModel.buscarPorEmail(email)

            if (usuarioExistente.length === 0) {
                return res.json({
                    mensagem: 'E-mail não cadastrado',
                    status: 'false'
                })
            }

            const dadosPalavraChave =
                await UsuarioModel.buscarPalavraChavePorEmail(email)

            const palavraChaveValida = await bcrypt.compare(
                palavra_chave,
                dadosPalavraChave.palavra_chave
            )

            if (!palavraChaveValida) {
                return res.json({
                    mensagem: 'Palavra-chave incorreta',
                    status: 'false'
                })
            }

            const dadosSenha =
                await UsuarioModel.buscarSenhaPorEmail(email)

            const senhaIgual = await bcrypt.compare(
                senha_nova,
                dadosSenha.senha
            )

            if (senhaIgual) {
                return res.json({
                    mensagem: 'A nova senha não pode ser igual à senha atual',
                    status: 'false'
                })
            }

            const hash = await bcrypt.hash(senha_nova, 10)

            const resultado =
                await UsuarioModel.atualizarSenha(hash, email)

            if (resultado.affectedRows === 0) {
                return res.json({
                    mensagem: 'Não foi possível atualizar a senha',
                    status: 'false'
                })
            }

            return res.json({
                mensagem: 'Senha atualizada com sucesso',
                status: 'true'
            })

        } catch (error) {
            console.error('[atualizarSenha]', error)

            return res.status(500).json({
                mensagem: 'Erro interno ao atualizar senha',
                status: 'false'
            })
        }
    },

    async deletarUsuario(req, res) {
        try {
            const { senha, email } = req.body
            const hash = crypto.createHash('sha256').update(senha).digest('hex')
            const resultado = await UsuarioModel.deletar(email, hash)
            return res.json({
                resultado,
                mensagem: 'Usuário Deletado',
                status: 'true',
            })
        } catch (error) {
            console.error('[deletarUsuario]', error)
            return res.status(500).json({ mensagem: 'Erro interno ao deletar usuário', status: 'false' })
        }
    },
}

module.exports = UsuarioController