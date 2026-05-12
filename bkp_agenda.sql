-- --------------------------------------------------------
-- Servidor:                     127.0.0.1
-- Versão do servidor:           10.4.32-MariaDB - mariadb.org binary distribution
-- OS do Servidor:               Win64
-- HeidiSQL Versão:              12.10.0.7000
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Copiando estrutura do banco de dados para agendavest
DROP DATABASE IF EXISTS `agendavest`;
CREATE DATABASE IF NOT EXISTS `agendavest` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_bin */;
USE `agendavest`;

-- Copiando estrutura para tabela agendavest.adms
DROP TABLE IF EXISTS `adms`;
CREATE TABLE IF NOT EXISTS `adms` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(100) NOT NULL DEFAULT '0',
  `senha` varchar(100) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- Exportação de dados foi desmarcado.

-- Copiando estrutura para tabela agendavest.conteudos
DROP TABLE IF EXISTS `conteudos`;
CREATE TABLE IF NOT EXISTS `conteudos` (
  `id_conteudo` int(11) NOT NULL AUTO_INCREMENT,
  `id_vestibular` int(11) NOT NULL,
  `disciplina` varchar(50) NOT NULL,
  `descricao` varchar(150) NOT NULL,
  PRIMARY KEY (`id_conteudo`),
  KEY `id_vestibular` (`id_vestibular`),
  CONSTRAINT `conteudos_ibfk_1` FOREIGN KEY (`id_vestibular`) REFERENCES `vestibulares` (`id_vestibular`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- Exportação de dados foi desmarcado.

-- Copiando estrutura para tabela agendavest.cursos
DROP TABLE IF EXISTS `cursos`;
CREATE TABLE IF NOT EXISTS `cursos` (
  `id_curso` int(11) NOT NULL AUTO_INCREMENT,
  `id_universidade` int(11) NOT NULL,
  `curso` varchar(150) NOT NULL,
  `nota_corte` decimal(8,2) NOT NULL,
  PRIMARY KEY (`id_curso`),
  KEY `id_universidade` (`id_universidade`),
  CONSTRAINT `cursos_ibfk_1` FOREIGN KEY (`id_universidade`) REFERENCES `universidades` (`id_universidade`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- Exportação de dados foi desmarcado.

-- Copiando estrutura para tabela agendavest.ibge_municipios
DROP TABLE IF EXISTS `ibge_municipios`;
CREATE TABLE IF NOT EXISTS `ibge_municipios` (
  `cod_ibge` int(11) NOT NULL AUTO_INCREMENT,
  `descricao` varchar(150) NOT NULL,
  PRIMARY KEY (`cod_ibge`)
) ENGINE=InnoDB AUTO_INCREMENT=5300109 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- Exportação de dados foi desmarcado.

-- Copiando estrutura para tabela agendavest.inscricoes
DROP TABLE IF EXISTS `inscricoes`;
CREATE TABLE IF NOT EXISTS `inscricoes` (
  `id_inscricao` int(11) NOT NULL AUTO_INCREMENT,
  `id_usuario` int(11) NOT NULL,
  `id_vestibular` int(11) NOT NULL,
  `notificar_inscricao` tinyint(1) NOT NULL,
  PRIMARY KEY (`id_inscricao`),
  KEY `id_usuario` (`id_usuario`),
  KEY `id_vestibular` (`id_vestibular`),
  CONSTRAINT `inscricoes_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE,
  CONSTRAINT `inscricoes_ibfk_2` FOREIGN KEY (`id_vestibular`) REFERENCES `vestibulares` (`id_vestibular`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- Exportação de dados foi desmarcado.

-- Copiando estrutura para tabela agendavest.provas_anteriores
DROP TABLE IF EXISTS `provas_anteriores`;
CREATE TABLE IF NOT EXISTS `provas_anteriores` (
  `id_prova` int(11) NOT NULL AUTO_INCREMENT,
  `id_vestibular` int(11) NOT NULL,
  `link_prova` text NOT NULL,
  `link_gabarito` text NOT NULL,
  `ano_prova` year(4) NOT NULL,
  PRIMARY KEY (`id_prova`),
  KEY `id_vestibular` (`id_vestibular`),
  CONSTRAINT `provas_anteriores_ibfk_1` FOREIGN KEY (`id_vestibular`) REFERENCES `vestibulares` (`id_vestibular`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- Exportação de dados foi desmarcado.

-- Copiando estrutura para tabela agendavest.sugestao
DROP TABLE IF EXISTS `sugestao`;
CREATE TABLE IF NOT EXISTS `sugestao` (
  `id_sugestao` int(11) NOT NULL AUTO_INCREMENT,
  `vest_sugestao` varchar(50) NOT NULL,
  `curso_sugestao` varchar(50) NOT NULL,
  PRIMARY KEY (`id_sugestao`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- Exportação de dados foi desmarcado.

-- Copiando estrutura para tabela agendavest.universidades
DROP TABLE IF EXISTS `universidades`;
CREATE TABLE IF NOT EXISTS `universidades` (
  `id_universidade` int(11) NOT NULL,
  `nome` varchar(255) NOT NULL,
  `sigla` varchar(50) DEFAULT NULL,
  `codigo_municipio_ibge` int(11) NOT NULL,
  `municipio` varchar(150) NOT NULL,
  `estado` char(2) NOT NULL,
  `situacao` varchar(100) NOT NULL,
  PRIMARY KEY (`id_universidade`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- Exportação de dados foi desmarcado.

-- Copiando estrutura para tabela agendavest.usuarios
DROP TABLE IF EXISTS `usuarios`;
CREATE TABLE IF NOT EXISTS `usuarios` (
  `id_usuario` int(11) NOT NULL AUTO_INCREMENT,
  `nome_usuario` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `senha` varchar(256) NOT NULL,
  `foto_perfil` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id_usuario`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- Exportação de dados foi desmarcado.

-- Copiando estrutura para tabela agendavest.vestibulares
DROP TABLE IF EXISTS `vestibulares`;
CREATE TABLE IF NOT EXISTS `vestibulares` (
  `id_vestibular` int(11) NOT NULL AUTO_INCREMENT,
  `vestibular` varchar(50) NOT NULL,
  `data_inicio_inscricao` date NOT NULL,
  `data_fim_inscricao` date NOT NULL,
  `data_prova` date NOT NULL,
  `taxa_prova` decimal(8,2) NOT NULL,
  `link_edital` text NOT NULL,
  `created_by` int(11) NOT NULL,
  `status` varchar(10) NOT NULL,
  PRIMARY KEY (`id_vestibular`),
  KEY `FK_vestibulares_usuarios` (`created_by`),
  CONSTRAINT `FK_vestibulares_usuarios` FOREIGN KEY (`created_by`) REFERENCES `usuarios` (`id_usuario`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- Exportação de dados foi desmarcado.

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
