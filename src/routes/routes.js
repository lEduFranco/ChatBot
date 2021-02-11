const express = require('express');

const routes = express.Router();
const portBot = process.env.PORTBOT

const InitiatorController = require('../controllers/InitiatorController') ;
const RestartController = require('../controllers/RestartController') ;
const RefreshbotController = require('../controllers/RefreshbotController') ;
const AtualizaentradaController = require('../controllers/AtualizaentradaController') ;
const FinalizaticketController = require('../controllers/FinalizaticketController') ;
const SendAudioController = require('../controllers/SendAudioController') ;
const SendFileController = require('../controllers/SendFileController') ;
const NewTicketController = require('../controllers/NewTicketController') ;
const UserChatController = require('../controllers/UserChatController') ;
const LogoutController = require('../controllers/LogoutController') ;
const ResetBotController = require('../controllers/ResetBotController') ;
const NewListController = require('../controllers/NewListController') ;
const NewStatusController = require('../controllers/NewStatusController') ;
const LoggedController = require('../controllers/LoggedController') ;
const TransferChatController = require('../controllers/TransferChatController') ;
const GetUseridController = require('../controllers/GetUseridController') ;
const BlockUserController = require('../controllers/BlockUserController') ;
const UnblockUserController = require('../controllers/UnblockUserController') ;
const GetUserPicController = require('../controllers/GetUserPicController') ;
const NewChatController = require('../controllers/NewChatController') ;
const NewRequestController = require('../controllers/NewRequestController') ;
const SendController = require('../controllers/SendController') ;
// const RemoveController = require('../controllers/RemoveController') ;
// const PowerOnController = require('../controllers/PowerOnController') ;

routes.post('/' + portBot + '/inicializador', InitiatorController.create);
routes.post('/' + portBot + '/restart', RestartController.create);
routes.post('/' + portBot + '/refreshbot', RefreshbotController.create);
routes.post('/' + portBot + '/atualizaentrada', AtualizaentradaController.create);
routes.post('/' + portBot + '/finalizaticket', FinalizaticketController.create);
routes.post('/' + portBot + '/sendaudio', SendAudioController.create);
routes.post('/' + portBot + '/sendfile', SendFileController.create);
routes.post('/' + portBot + '/newticket', NewTicketController.create);
routes.post('/' + portBot + '/userchat', UserChatController.create);
routes.post('/' + portBot + '/logout', LogoutController.create);
routes.post('/' + portBot + '/resetbot', ResetBotController.create);
routes.post('/' + portBot + '/newlist', NewListController.create);
routes.post('/' + portBot + '/newstatus', NewStatusController.create);
routes.post('/' + portBot + '/logged', LoggedController.create);
routes.post('/' + portBot + '/transferchat', TransferChatController.create);
routes.post('/' + portBot + '/getuserid', GetUseridController.create);
routes.post('/' + portBot + '/blockuser', BlockUserController.create);
routes.post('/' + portBot + '/unblockuser', UnblockUserController.create);
routes.post('/' + portBot + '/getuserpic', GetUserPicController.create);
routes.post('/' + portBot + '/newchat', NewChatController.create);
routes.post('/' + portBot + '/newrequest', NewRequestController.create);
routes.post('/' + portBot + '/send', SendController.create);
// routes.post('/3000/remove', RemoveController.create);
// routes.post('/3000/poweron', PowerOnController.create);

module.exports = routes;
