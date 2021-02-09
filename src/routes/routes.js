import  Router from  'express';

import _checkApiKey from '../../bot';

const botRouter = Router();
const portBot = process.env.PORTBOT

import ButInitiatorController from '../controllers/ButInitiatorController';
import ButRestartCntroller from '../controllers/ButRestartCntroller';
import ButRefreshbotController from '../controllers/ButRefreshbotController';
import ButAtualizaentradaController from '../controllers/ButAtualizaentradaController';

const butInitiatorController = new ButInitiatorController();
const butRestartCntroller = new ButRestartCntroller();
const butRefreshbotController = new ButRefreshbotController();
const butAtualizaentradaController = new ButAtualizaentradaController();

botRouter.post('/' + portBot + '/inicializador', butInitiatorController.create);
botRouter.post('/' + portBot + '/restart', butRestartCntroller.create);
botRouter.post('/' + portBot + '/refreshbot', butRefreshbotController.create);
botRouter.post('/' + portBot + '/atualizaentrada', butAtualizaentradaController.create);


