-- phpMyAdmin SQL Dump
-- version 4.6.6deb5ubuntu0.5
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: 23-Jan-2021 às 18:46
-- Versão do servidor: 5.7.32-0ubuntu0.18.04.1
-- PHP Version: 7.2.24-0ubuntu0.18.04.7

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `chatbot`
--

-- --------------------------------------------------------

--
-- Estrutura da tabela `tbActions`
--

CREATE TABLE `tbActions` (
  `id` int(11) NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_bin NOT NULL,
  `description` text COLLATE utf8mb4_bin NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- --------------------------------------------------------

--
-- Estrutura da tabela `tbAdmin`
--

CREATE TABLE `tbAdmin` (
  `id` int(11) NOT NULL,
  `username` text COLLATE utf8mb4_bin NOT NULL,
  `password` text COLLATE utf8mb4_bin NOT NULL,
  `status` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- --------------------------------------------------------

--
-- Estrutura da tabela `tbAnswers`
--

CREATE TABLE `tbAnswers` (
  `id` int(11) NOT NULL,
  `idBot` int(11) NOT NULL,
  `idSetor` int(11) NOT NULL,
  `idSubSetor` int(11) NOT NULL,
  `texto` mediumtext COLLATE utf8mb4_bin NOT NULL,
  `img` text COLLATE utf8mb4_bin NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- --------------------------------------------------------

--
-- Estrutura da tabela `tbAttendants`
--

CREATE TABLE `tbAttendants` (
  `id` int(11) NOT NULL,
  `idBot` int(11) NOT NULL,
  `nomeAtend` mediumtext COLLATE utf8mb4_bin NOT NULL,
  `senha` mediumtext COLLATE utf8mb4_bin NOT NULL,
  `nivel` int(11) NOT NULL,
  `img` mediumtext COLLATE utf8mb4_bin NOT NULL,
  `email` mediumtext COLLATE utf8mb4_bin NOT NULL,
  `authToken` mediumtext COLLATE utf8mb4_bin NOT NULL,
  `hash` text COLLATE utf8mb4_bin NOT NULL,
  `blocked` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin COMMENT='Tabela de atendentes';

-- --------------------------------------------------------

--
-- Estrutura da tabela `tbAttendants_sectors`
--

CREATE TABLE `tbAttendants_sectors` (
  `id` int(11) NOT NULL,
  `idBot` int(11) NOT NULL,
  `idAtend` int(11) NOT NULL,
  `idSetor` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin COMMENT='Setores do atendente';

-- --------------------------------------------------------

--
-- Estrutura da tabela `tbAttendants_wallet`
--

CREATE TABLE `tbAttendants_wallet` (
  `id` int(11) NOT NULL,
  `idBot` int(11) NOT NULL,
  `aid` int(11) NOT NULL,
  `lid` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- --------------------------------------------------------

--
-- Estrutura da tabela `tbChats`
--

CREATE TABLE `tbChats` (
  `idBot` int(11) NOT NULL,
  `idConv` int(11) NOT NULL,
  `idInt` varchar(255) COLLATE utf8mb4_bin NOT NULL,
  `tipoConv` varchar(255) COLLATE utf8mb4_bin NOT NULL,
  `numeroConv` mediumtext COLLATE utf8mb4_bin NOT NULL,
  `nomeConv` mediumtext COLLATE utf8mb4_bin NOT NULL,
  `nomeContato` text COLLATE utf8mb4_bin NOT NULL,
  `dataConv` varchar(255) COLLATE utf8mb4_bin NOT NULL,
  `imgConv` mediumtext COLLATE utf8mb4_bin NOT NULL,
  `numTel` int(11) NOT NULL,
  `salvo` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin COMMENT='Tabela de Conversas';

-- --------------------------------------------------------

--
-- Estrutura da tabela `tbConfigBot`
--

CREATE TABLE `tbConfigBot` (
  `idBot` int(11) NOT NULL,
  `nomeBot` mediumtext COLLATE utf8mb4_bin NOT NULL,
  `numTelefone` mediumtext COLLATE utf8mb4_bin NOT NULL,
  `numEspelho` mediumtext COLLATE utf8mb4_bin NOT NULL,
  `msgInicio` mediumtext COLLATE utf8mb4_bin NOT NULL,
  `msgOcioso` mediumtext COLLATE utf8mb4_bin NOT NULL,
  `msgAusente` mediumtext COLLATE utf8mb4_bin NOT NULL,
  `msgErro` mediumtext COLLATE utf8mb4_bin NOT NULL,
  `msgAtendHumano` mediumtext COLLATE utf8mb4_bin NOT NULL,
  `msgFinal` mediumtext COLLATE utf8mb4_bin NOT NULL,
  `msgLeaveList` text COLLATE utf8mb4_bin NOT NULL,
  `infoRodape` mediumtext COLLATE utf8mb4_bin NOT NULL,
  `avaliarAtend` tinyint(1) NOT NULL,
  `atendHumano` tinyint(1) NOT NULL,
  `atendFila` tinyint(1) NOT NULL,
  `chatbot` int(11) NOT NULL,
  `tempoLimite` int(11) NOT NULL,
  `urlMedia` text COLLATE utf8mb4_bin NOT NULL,
  `nomeAut` int(11) NOT NULL,
  `leaveList` int(11) NOT NULL,
  `saveName` int(11) NOT NULL,
  `sendUnreads` int(11) NOT NULL,
  `urlImgInicio` text COLLATE utf8mb4_bin NOT NULL,
  `urlImgFim` text COLLATE utf8mb4_bin NOT NULL,
  `coordenadas` varchar(255) COLLATE utf8mb4_bin NOT NULL,
  `textoCoordenadas` varchar(255) COLLATE utf8mb4_bin NOT NULL,
  `ativo` tinyint(1) NOT NULL,
  `session` text COLLATE utf8mb4_bin NOT NULL,
  `state` int(11) NOT NULL,
  `receptSector` int(11) NOT NULL,
  `namevCard` varchar(255) COLLATE utf8mb4_bin NOT NULL,
  `rdstation` text COLLATE utf8mb4_bin NOT NULL,
  `options` text COLLATE utf8mb4_bin NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- --------------------------------------------------------

--
-- Estrutura da tabela `tbCron`
--

CREATE TABLE `tbCron` (
  `id` int(11) NOT NULL,
  `idBot` int(11) NOT NULL,
  `name` text COLLATE utf8mb4_bin NOT NULL,
  `url` text COLLATE utf8mb4_bin NOT NULL,
  `param` text COLLATE utf8mb4_bin NOT NULL,
  `time` text COLLATE utf8mb4_bin NOT NULL,
  `dateIn` datetime NOT NULL,
  `lastRun` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- --------------------------------------------------------

--
-- Estrutura da tabela `tbDelivery`
--

CREATE TABLE `tbDelivery` (
  `id` int(11) NOT NULL,
  `idBot` int(11) NOT NULL,
  `message` longtext COLLATE utf8mb4_bin NOT NULL,
  `phone` text COLLATE utf8mb4_bin NOT NULL,
  `status` int(11) NOT NULL,
  `dateIn` datetime NOT NULL,
  `dateOut` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- --------------------------------------------------------

--
-- Estrutura da tabela `tbFeedback`
--

CREATE TABLE `tbFeedback` (
  `id` int(11) NOT NULL,
  `idBot` int(11) NOT NULL,
  `idAtend` int(11) NOT NULL,
  `description` text COLLATE utf8mb4_bin NOT NULL,
  `options` text COLLATE utf8mb4_bin NOT NULL,
  `dateIn` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- --------------------------------------------------------

--
-- Estrutura da tabela `tbLeads`
--

CREATE TABLE `tbLeads` (
  `id` int(11) NOT NULL,
  `idBot` int(11) NOT NULL,
  `idInt` text COLLATE utf8mb4_bin NOT NULL,
  `idList` int(11) NOT NULL,
  `statusCliente` int(11) NOT NULL,
  `nomeCliente` text COLLATE utf8mb4_bin,
  `emailCliente` text COLLATE utf8mb4_bin NOT NULL,
  `nascCliente` int(11) NOT NULL,
  `estcivilCliente` int(11) NOT NULL,
  `sexoCliente` int(11) NOT NULL,
  `telefoneCliente` text COLLATE utf8mb4_bin NOT NULL,
  `tipoCliente` int(11) NOT NULL,
  `cpfCliente` int(11) NOT NULL,
  `cepCliente` int(11) NOT NULL,
  `ruaCliente` text COLLATE utf8mb4_bin NOT NULL,
  `numeroCliente` text COLLATE utf8mb4_bin NOT NULL,
  `complCliente` text COLLATE utf8mb4_bin NOT NULL,
  `bairroCliente` text COLLATE utf8mb4_bin NOT NULL,
  `cidadeCliente` text COLLATE utf8mb4_bin NOT NULL,
  `ufCliente` text COLLATE utf8mb4_bin NOT NULL,
  `obsCliente` text COLLATE utf8mb4_bin NOT NULL,
  `imgCliente` text COLLATE utf8mb4_bin NOT NULL,
  `agenda` int(11) NOT NULL,
  `valido` int(11) NOT NULL,
  `acTransmissao` int(11) NOT NULL,
  `dataCad` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- --------------------------------------------------------

--
-- Estrutura da tabela `tbLists`
--

CREATE TABLE `tbLists` (
  `id` int(11) NOT NULL,
  `idBot` int(11) NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_bin NOT NULL,
  `status` int(11) NOT NULL,
  `dateIn` datetime NOT NULL,
  `dateOut` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- --------------------------------------------------------

--
-- Estrutura da tabela `tbLogs`
--

CREATE TABLE `tbLogs` (
  `id` int(11) NOT NULL,
  `idBot` int(11) NOT NULL,
  `idAtend` int(11) NOT NULL,
  `idAction` int(11) NOT NULL,
  `data` text COLLATE utf8mb4_bin NOT NULL,
  `dateIn` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- --------------------------------------------------------

--
-- Estrutura da tabela `tbPlugins`
--

CREATE TABLE `tbPlugins` (
  `id` int(11) NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_bin NOT NULL,
  `type` varchar(255) COLLATE utf8mb4_bin NOT NULL,
  `path` text COLLATE utf8mb4_bin NOT NULL,
  `description` text COLLATE utf8mb4_bin NOT NULL,
  `helper` text COLLATE utf8mb4_bin NOT NULL,
  `image` text COLLATE utf8mb4_bin NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- --------------------------------------------------------

--
-- Estrutura da tabela `tbPlugins_active`
--

CREATE TABLE `tbPlugins_active` (
  `id` int(11) NOT NULL,
  `idBot` int(11) NOT NULL,
  `idPlugin` int(11) NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_bin NOT NULL,
  `options` text COLLATE utf8mb4_bin NOT NULL,
  `filename` varchar(255) COLLATE utf8mb4_bin NOT NULL,
  `status` int(11) NOT NULL,
  `dataIn` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- --------------------------------------------------------

--
-- Estrutura da tabela `tbPorts`
--

CREATE TABLE `tbPorts` (
  `id` int(11) NOT NULL,
  `idBot` int(11) NOT NULL,
  `idStore` int(11) NOT NULL,
  `port` int(11) NOT NULL,
  `status` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- --------------------------------------------------------

--
-- Estrutura da tabela `tbRecipients`
--

CREATE TABLE `tbRecipients` (
  `id` int(11) NOT NULL,
  `idBot` int(11) NOT NULL,
  `idList` int(11) NOT NULL,
  `data` longtext COLLATE utf8mb4_bin NOT NULL,
  `size` int(11) NOT NULL,
  `lastSend` text COLLATE utf8mb4_bin NOT NULL,
  `lastIndex` int(11) NOT NULL,
  `lastTime` datetime NOT NULL,
  `averageTime` time NOT NULL,
  `totalTime` time NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- --------------------------------------------------------

--
-- Estrutura da tabela `tbRequests`
--

CREATE TABLE `tbRequests` (
  `id` int(11) NOT NULL,
  `idBot` int(11) NOT NULL,
  `name` text COLLATE utf8mb4_bin NOT NULL,
  `phone` text COLLATE utf8mb4_bin NOT NULL,
  `dataIn` datetime NOT NULL,
  `location` text COLLATE utf8mb4_bin NOT NULL,
  `ip` text COLLATE utf8mb4_bin NOT NULL,
  `status` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- --------------------------------------------------------

--
-- Estrutura da tabela `tbSchedules`
--

CREATE TABLE `tbSchedules` (
  `id` int(11) NOT NULL,
  `idBot` int(11) NOT NULL,
  `schedules` text COLLATE utf8mb4_bin NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- --------------------------------------------------------

--
-- Estrutura da tabela `tbSectors`
--

CREATE TABLE `tbSectors` (
  `id` int(11) NOT NULL,
  `idBot` int(11) NOT NULL,
  `idResp` int(11) NOT NULL,
  `nome` mediumtext COLLATE utf8mb4_bin NOT NULL,
  `mensagem` mediumtext COLLATE utf8mb4_bin NOT NULL,
  `status` int(11) NOT NULL,
  `digito` int(11) NOT NULL,
  `subSetor` tinyint(1) NOT NULL,
  `atendHumano` int(11) NOT NULL,
  `codApi` int(11) NOT NULL,
  `hidden` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- --------------------------------------------------------

--
-- Estrutura da tabela `tbServerLogs`
--

CREATE TABLE `tbServerLogs` (
  `id` int(11) NOT NULL,
  `idBot` int(11) NOT NULL,
  `info` text COLLATE utf8mb4_bin NOT NULL,
  `dateIn` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- --------------------------------------------------------

--
-- Estrutura da tabela `tbStatistics`
--

CREATE TABLE `tbStatistics` (
  `id` int(11) NOT NULL,
  `idBot` int(11) NOT NULL,
  `idSector` int(11) NOT NULL,
  `idSubsector` int(11) NOT NULL,
  `clicks` int(11) NOT NULL,
  `date` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- --------------------------------------------------------

--
-- Estrutura da tabela `tbStatus`
--

CREATE TABLE `tbStatus` (
  `id` int(11) NOT NULL,
  `idBot` int(11) NOT NULL,
  `name` text COLLATE utf8mb4_bin NOT NULL,
  `text` text COLLATE utf8mb4_bin NOT NULL,
  `image` text COLLATE utf8mb4_bin NOT NULL,
  `dateIn` datetime NOT NULL,
  `dateOut` datetime NOT NULL,
  `status` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- --------------------------------------------------------

--
-- Estrutura da tabela `tbStorage`
--

CREATE TABLE `tbStorage` (
  `id` int(11) NOT NULL,
  `idBot` int(11) NOT NULL,
  `idAnswer` int(11) NOT NULL,
  `url` text COLLATE utf8mb4_bin NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- --------------------------------------------------------

--
-- Estrutura da tabela `tbStores`
--

CREATE TABLE `tbStores` (
  `idBot` int(11) NOT NULL,
  `codStore` text COLLATE utf8mb4_bin NOT NULL,
  `server` text COLLATE utf8mb4_bin NOT NULL,
  `port` int(11) NOT NULL,
  `status` int(11) NOT NULL,
  `apiKey` text COLLATE utf8mb4_bin NOT NULL,
  `logo` text COLLATE utf8mb4_bin NOT NULL,
  `color` varchar(255) COLLATE utf8mb4_bin NOT NULL,
  `bglogin` text COLLATE utf8mb4_bin NOT NULL,
  `cors` text COLLATE utf8mb4_bin NOT NULL,
  `urlUpload` text COLLATE utf8mb4_bin NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- --------------------------------------------------------

--
-- Estrutura da tabela `tbSubsectors`
--

CREATE TABLE `tbSubsectors` (
  `id` int(11) NOT NULL,
  `idBot` int(11) NOT NULL,
  `idResp` int(11) NOT NULL,
  `idSetor` int(11) NOT NULL,
  `nome` varchar(255) COLLATE utf8mb4_bin NOT NULL,
  `mensagem` mediumtext COLLATE utf8mb4_bin NOT NULL,
  `status` int(11) NOT NULL,
  `digito` int(11) NOT NULL,
  `atendHumano` tinyint(1) NOT NULL,
  `hidden` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- --------------------------------------------------------

--
-- Estrutura da tabela `tbTemplates`
--

CREATE TABLE `tbTemplates` (
  `id` int(11) NOT NULL,
  `idBot` int(11) NOT NULL,
  `idList` int(11) NOT NULL,
  `body` text COLLATE utf8mb4_bin NOT NULL,
  `images` mediumtext COLLATE utf8mb4_bin NOT NULL,
  `date` datetime NOT NULL,
  `status` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- --------------------------------------------------------

--
-- Estrutura da tabela `tbTickets`
--

CREATE TABLE `tbTickets` (
  `id` int(11) NOT NULL,
  `idBot` int(11) NOT NULL,
  `idLead` int(11) NOT NULL,
  `dataInicio` datetime NOT NULL,
  `dataFim` datetime NOT NULL,
  `idEtapa` int(11) NOT NULL,
  `idStatus` int(11) NOT NULL,
  `idCanal` int(11) NOT NULL,
  `idSetor` int(11) NOT NULL,
  `idSubSetor` int(11) NOT NULL,
  `idAtend` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- --------------------------------------------------------

--
-- Estrutura da tabela `tbTicketsMsg`
--

CREATE TABLE `tbTicketsMsg` (
  `id` int(11) NOT NULL,
  `idBot` int(11) NOT NULL,
  `idTicket` int(11) NOT NULL,
  `messages` text COLLATE utf8mb4_bin NOT NULL,
  `dataCad` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `tbActions`
--
ALTER TABLE `tbActions`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbAdmin`
--
ALTER TABLE `tbAdmin`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbAnswers`
--
ALTER TABLE `tbAnswers`
  ADD PRIMARY KEY (`id`),
  ADD KEY `storage_id` (`id`),
  ADD KEY `tbAnswers_ibfk_1` (`idSetor`),
  ADD KEY `tbAnswers_ibfk_2` (`idSubSetor`);

--
-- Indexes for table `tbAttendants`
--
ALTER TABLE `tbAttendants`
  ADD PRIMARY KEY (`id`),
  ADD KEY `tbAttendants_ibfk_1` (`idBot`);

--
-- Indexes for table `tbAttendants_sectors`
--
ALTER TABLE `tbAttendants_sectors`
  ADD PRIMARY KEY (`id`),
  ADD KEY `tbAttendants_sectors_ibfk_1` (`idAtend`);

--
-- Indexes for table `tbAttendants_wallet`
--
ALTER TABLE `tbAttendants_wallet`
  ADD PRIMARY KEY (`id`),
  ADD KEY `lid` (`lid`),
  ADD KEY `idBot` (`idBot`),
  ADD KEY `aid` (`aid`);

--
-- Indexes for table `tbChats`
--
ALTER TABLE `tbChats`
  ADD PRIMARY KEY (`idConv`),
  ADD KEY `conversas_id_fk` (`idBot`);

--
-- Indexes for table `tbConfigBot`
--
ALTER TABLE `tbConfigBot`
  ADD PRIMARY KEY (`idBot`);

--
-- Indexes for table `tbCron`
--
ALTER TABLE `tbCron`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idBot` (`idBot`);

--
-- Indexes for table `tbDelivery`
--
ALTER TABLE `tbDelivery`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idBot` (`idBot`);

--
-- Indexes for table `tbFeedback`
--
ALTER TABLE `tbFeedback`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idBot` (`idBot`);

--
-- Indexes for table `tbLeads`
--
ALTER TABLE `tbLeads`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idBot` (`idBot`);

--
-- Indexes for table `tbLists`
--
ALTER TABLE `tbLists`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idBot` (`idBot`);

--
-- Indexes for table `tbLogs`
--
ALTER TABLE `tbLogs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idBot` (`idBot`),
  ADD KEY `idAction` (`idAction`),
  ADD KEY `idAtend` (`idAtend`);

--
-- Indexes for table `tbPlugins`
--
ALTER TABLE `tbPlugins`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbPlugins_active`
--
ALTER TABLE `tbPlugins_active`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idPlugin` (`idPlugin`),
  ADD KEY `idBot` (`idBot`);

--
-- Indexes for table `tbPorts`
--
ALTER TABLE `tbPorts`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbRecipients`
--
ALTER TABLE `tbRecipients`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idList` (`idList`);

--
-- Indexes for table `tbRequests`
--
ALTER TABLE `tbRequests`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idBot` (`idBot`);

--
-- Indexes for table `tbSchedules`
--
ALTER TABLE `tbSchedules`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idBot` (`idBot`);

--
-- Indexes for table `tbSectors`
--
ALTER TABLE `tbSectors`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idBot` (`idBot`);

--
-- Indexes for table `tbServerLogs`
--
ALTER TABLE `tbServerLogs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idBot` (`idBot`);

--
-- Indexes for table `tbStatistics`
--
ALTER TABLE `tbStatistics`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idBot` (`idBot`);

--
-- Indexes for table `tbStatus`
--
ALTER TABLE `tbStatus`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idBot` (`idBot`);

--
-- Indexes for table `tbStorage`
--
ALTER TABLE `tbStorage`
  ADD PRIMARY KEY (`id`),
  ADD KEY `ssdasdsa` (`idAnswer`);

--
-- Indexes for table `tbStores`
--
ALTER TABLE `tbStores`
  ADD PRIMARY KEY (`idBot`);

--
-- Indexes for table `tbSubsectors`
--
ALTER TABLE `tbSubsectors`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idSetor` (`idSetor`);

--
-- Indexes for table `tbTemplates`
--
ALTER TABLE `tbTemplates`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idList` (`idList`);

--
-- Indexes for table `tbTickets`
--
ALTER TABLE `tbTickets`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idLead` (`idLead`);

--
-- Indexes for table `tbTicketsMsg`
--
ALTER TABLE `tbTicketsMsg`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idTicket` (`idTicket`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `tbActions`
--
ALTER TABLE `tbActions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
--
-- AUTO_INCREMENT for table `tbAdmin`
--
ALTER TABLE `tbAdmin`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT for table `tbAnswers`
--
ALTER TABLE `tbAnswers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=62;
--
-- AUTO_INCREMENT for table `tbAttendants`
--
ALTER TABLE `tbAttendants`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=61;
--
-- AUTO_INCREMENT for table `tbAttendants_sectors`
--
ALTER TABLE `tbAttendants_sectors`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=212;
--
-- AUTO_INCREMENT for table `tbAttendants_wallet`
--
ALTER TABLE `tbAttendants_wallet`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;
--
-- AUTO_INCREMENT for table `tbChats`
--
ALTER TABLE `tbChats`
  MODIFY `idConv` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `tbConfigBot`
--
ALTER TABLE `tbConfigBot`
  MODIFY `idBot` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;
--
-- AUTO_INCREMENT for table `tbCron`
--
ALTER TABLE `tbCron`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `tbDelivery`
--
ALTER TABLE `tbDelivery`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT for table `tbFeedback`
--
ALTER TABLE `tbFeedback`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;
--
-- AUTO_INCREMENT for table `tbLeads`
--
ALTER TABLE `tbLeads`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=64260;
--
-- AUTO_INCREMENT for table `tbLists`
--
ALTER TABLE `tbLists`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=421;
--
-- AUTO_INCREMENT for table `tbLogs`
--
ALTER TABLE `tbLogs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=958;
--
-- AUTO_INCREMENT for table `tbPlugins`
--
ALTER TABLE `tbPlugins`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
--
-- AUTO_INCREMENT for table `tbPlugins_active`
--
ALTER TABLE `tbPlugins_active`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
--
-- AUTO_INCREMENT for table `tbPorts`
--
ALTER TABLE `tbPorts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;
--
-- AUTO_INCREMENT for table `tbRecipients`
--
ALTER TABLE `tbRecipients`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=421;
--
-- AUTO_INCREMENT for table `tbRequests`
--
ALTER TABLE `tbRequests`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=142;
--
-- AUTO_INCREMENT for table `tbSchedules`
--
ALTER TABLE `tbSchedules`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=59;
--
-- AUTO_INCREMENT for table `tbSectors`
--
ALTER TABLE `tbSectors`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=52;
--
-- AUTO_INCREMENT for table `tbServerLogs`
--
ALTER TABLE `tbServerLogs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `tbStatistics`
--
ALTER TABLE `tbStatistics`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=60;
--
-- AUTO_INCREMENT for table `tbStatus`
--
ALTER TABLE `tbStatus`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;
--
-- AUTO_INCREMENT for table `tbStorage`
--
ALTER TABLE `tbStorage`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;
--
-- AUTO_INCREMENT for table `tbStores`
--
ALTER TABLE `tbStores`
  MODIFY `idBot` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;
--
-- AUTO_INCREMENT for table `tbSubsectors`
--
ALTER TABLE `tbSubsectors`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
--
-- AUTO_INCREMENT for table `tbTemplates`
--
ALTER TABLE `tbTemplates`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=404;
--
-- AUTO_INCREMENT for table `tbTickets`
--
ALTER TABLE `tbTickets`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4870;
--
-- AUTO_INCREMENT for table `tbTicketsMsg`
--
ALTER TABLE `tbTicketsMsg`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3048;
--
-- Constraints for dumped tables
--

--
-- Limitadores para a tabela `tbAnswers`
--
ALTER TABLE `tbAnswers`
  ADD CONSTRAINT `tbAnswers_ibfk_1` FOREIGN KEY (`idSetor`) REFERENCES `tbSectors` (`id`) ON DELETE CASCADE;

--
-- Limitadores para a tabela `tbAttendants`
--
ALTER TABLE `tbAttendants`
  ADD CONSTRAINT `tbAttendants_ibfk_1` FOREIGN KEY (`idBot`) REFERENCES `tbStores` (`idBot`) ON DELETE CASCADE;

--
-- Limitadores para a tabela `tbAttendants_sectors`
--
ALTER TABLE `tbAttendants_sectors`
  ADD CONSTRAINT `tbAttendants_sectors_ibfk_1` FOREIGN KEY (`idAtend`) REFERENCES `tbAttendants` (`id`) ON DELETE CASCADE;

--
-- Limitadores para a tabela `tbAttendants_wallet`
--
ALTER TABLE `tbAttendants_wallet`
  ADD CONSTRAINT `tbAttendants_wallet_ibfk_1` FOREIGN KEY (`lid`) REFERENCES `tbLeads` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `tbAttendants_wallet_ibfk_2` FOREIGN KEY (`idBot`) REFERENCES `tbStores` (`idBot`) ON DELETE CASCADE,
  ADD CONSTRAINT `tbAttendants_wallet_ibfk_3` FOREIGN KEY (`aid`) REFERENCES `tbAttendants` (`id`) ON DELETE CASCADE;

--
-- Limitadores para a tabela `tbChats`
--
ALTER TABLE `tbChats`
  ADD CONSTRAINT `tbChats_ibfk_1` FOREIGN KEY (`idBot`) REFERENCES `tbStores` (`idBot`) ON DELETE CASCADE;

--
-- Limitadores para a tabela `tbConfigBot`
--
ALTER TABLE `tbConfigBot`
  ADD CONSTRAINT `tbConfigBot_ibfk_1` FOREIGN KEY (`idBot`) REFERENCES `tbStores` (`idBot`) ON DELETE CASCADE;

--
-- Limitadores para a tabela `tbCron`
--
ALTER TABLE `tbCron`
  ADD CONSTRAINT `tbCron_ibfk_1` FOREIGN KEY (`idBot`) REFERENCES `tbStores` (`idBot`) ON DELETE CASCADE;

--
-- Limitadores para a tabela `tbDelivery`
--
ALTER TABLE `tbDelivery`
  ADD CONSTRAINT `tbDelivery_ibfk_1` FOREIGN KEY (`idBot`) REFERENCES `tbStores` (`idBot`) ON DELETE CASCADE,
  ADD CONSTRAINT `tbDelivery_ibfk_2` FOREIGN KEY (`idBot`) REFERENCES `tbStores` (`idBot`) ON DELETE CASCADE;

--
-- Limitadores para a tabela `tbFeedback`
--
ALTER TABLE `tbFeedback`
  ADD CONSTRAINT `tbFeedback_ibfk_1` FOREIGN KEY (`idBot`) REFERENCES `tbStores` (`idBot`) ON DELETE CASCADE;

--
-- Limitadores para a tabela `tbLeads`
--
ALTER TABLE `tbLeads`
  ADD CONSTRAINT `tbLeads_ibfk_1` FOREIGN KEY (`idBot`) REFERENCES `tbStores` (`idBot`) ON DELETE CASCADE;

--
-- Limitadores para a tabela `tbLists`
--
ALTER TABLE `tbLists`
  ADD CONSTRAINT `tbLists_ibfk_1` FOREIGN KEY (`idBot`) REFERENCES `tbStores` (`idBot`) ON DELETE CASCADE;

--
-- Limitadores para a tabela `tbLogs`
--
ALTER TABLE `tbLogs`
  ADD CONSTRAINT `tbLogs_ibfk_1` FOREIGN KEY (`idBot`) REFERENCES `tbStores` (`idBot`) ON DELETE CASCADE,
  ADD CONSTRAINT `tbLogs_ibfk_2` FOREIGN KEY (`idAction`) REFERENCES `tbActions` (`id`) ON DELETE CASCADE;

--
-- Limitadores para a tabela `tbPlugins_active`
--
ALTER TABLE `tbPlugins_active`
  ADD CONSTRAINT `tbPlugins_active_ibfk_1` FOREIGN KEY (`idPlugin`) REFERENCES `tbPlugins` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `tbPlugins_active_ibfk_2` FOREIGN KEY (`idBot`) REFERENCES `tbStores` (`idBot`) ON DELETE CASCADE;

--
-- Limitadores para a tabela `tbRecipients`
--
ALTER TABLE `tbRecipients`
  ADD CONSTRAINT `tbRecipients_ibfk_1` FOREIGN KEY (`idList`) REFERENCES `tbLists` (`id`) ON DELETE CASCADE;

--
-- Limitadores para a tabela `tbRequests`
--
ALTER TABLE `tbRequests`
  ADD CONSTRAINT `tbRequests_ibfk_1` FOREIGN KEY (`idBot`) REFERENCES `tbStores` (`idBot`) ON DELETE CASCADE;

--
-- Limitadores para a tabela `tbSchedules`
--
ALTER TABLE `tbSchedules`
  ADD CONSTRAINT `tbSchedules_ibfk_1` FOREIGN KEY (`idBot`) REFERENCES `tbStores` (`idBot`) ON DELETE CASCADE;

--
-- Limitadores para a tabela `tbSectors`
--
ALTER TABLE `tbSectors`
  ADD CONSTRAINT `tbSectors_ibfk_1` FOREIGN KEY (`idBot`) REFERENCES `tbStores` (`idBot`) ON DELETE CASCADE;

--
-- Limitadores para a tabela `tbServerLogs`
--
ALTER TABLE `tbServerLogs`
  ADD CONSTRAINT `tbServerLogs_ibfk_1` FOREIGN KEY (`idBot`) REFERENCES `tbStores` (`idBot`) ON DELETE CASCADE;

--
-- Limitadores para a tabela `tbStatistics`
--
ALTER TABLE `tbStatistics`
  ADD CONSTRAINT `tbStatistics_ibfk_1` FOREIGN KEY (`idBot`) REFERENCES `tbStores` (`idBot`) ON DELETE CASCADE;

--
-- Limitadores para a tabela `tbStatus`
--
ALTER TABLE `tbStatus`
  ADD CONSTRAINT `tbStatus_ibfk_1` FOREIGN KEY (`idBot`) REFERENCES `tbStores` (`idBot`) ON DELETE CASCADE;

--
-- Limitadores para a tabela `tbStorage`
--
ALTER TABLE `tbStorage`
  ADD CONSTRAINT `tbStorage_ibfk_1` FOREIGN KEY (`idAnswer`) REFERENCES `tbAnswers` (`id`) ON DELETE CASCADE;

--
-- Limitadores para a tabela `tbSubsectors`
--
ALTER TABLE `tbSubsectors`
  ADD CONSTRAINT `tbSubsectors_ibfk_1` FOREIGN KEY (`idSetor`) REFERENCES `tbSectors` (`id`) ON DELETE CASCADE;

--
-- Limitadores para a tabela `tbTemplates`
--
ALTER TABLE `tbTemplates`
  ADD CONSTRAINT `tbTemplates_ibfk_1` FOREIGN KEY (`idList`) REFERENCES `tbLists` (`id`) ON DELETE CASCADE;

--
-- Limitadores para a tabela `tbTickets`
--
ALTER TABLE `tbTickets`
  ADD CONSTRAINT `tbTickets_ibfk_1` FOREIGN KEY (`idLead`) REFERENCES `tbLeads` (`id`) ON DELETE CASCADE;

--
-- Limitadores para a tabela `tbTicketsMsg`
--
ALTER TABLE `tbTicketsMsg`
  ADD CONSTRAINT `tbTicketsMsg_ibfk_1` FOREIGN KEY (`idTicket`) REFERENCES `tbTickets` (`id`) ON DELETE CASCADE;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
