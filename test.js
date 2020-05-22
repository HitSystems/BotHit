process.env.NTBA_FIX_319 = 1;
const TelegramBot = require('node-telegram-bot-api');
const conexion  = require('./conexion');
let BotName ="";
var Token='';

BotName=process.argv[2];
if(BotName === undefined) BotName="SecreHit";

if (BotName=='SecreHit')  Token='1175028468:AAGzPS8EvKKfLcnjOZozFj493tzJ9uATxCA';  
if (BotName=='Armengol')  Token='1260450287:AAHvbf7kmJ5qk1Rmt5-1N-SrYE2gBXmHq30';  
if (BotName=='PaNatural') Token='1283151953:AAE9lDaNpCYoDfDwYKk_nCKJL5FjPxts6n0';  
if (BotName=='365Cafe')   Token='1089352379:AAHAudMormiXYAsfNLnPKakCMVdhCT3sv30';  
console.log(' Bot Name : ************************** ' + BotName + ' ************************** ');

var request = require("request");
var opt = {polling: true}
var bot = new TelegramBot(Token,opt)

let opts = {
        reply_markup:  {
            inline_keyboard: [
                [
                    {
                        text: "Comanda Taula 1",
                        callback_data: "Comanda Taula 1"
                    }
                ],
                [
                    {
                        text: "Comanda Taula 2",
                        callback_data: "Comanda Taula 2"
                    }
                ],
                [
                    {
                        text: "Comanda Taula 3",
                        callback_data: "Comanda Taula 3"
                    }
                ]
            ]
        }
    
};

 bot.onText(/\/start/, (msg)=>{
	bot.sendMessage(msg.from.id, 'Tria Taula', opts)
 })
 
bot.on('callback_query', msg => {
	var ooo = {
			reply_markup:  {
				inline_keyboard: [
					[
						{
							text: "CANVI DE TAULA",
							callback_data: "CANVI DE TAULA"
						}
					],
					[
						{
							text: "Cafe ",
							callback_data: "Cafe"
						}
					],
					[
						{
							text: "Tallat",
							callback_data: "Tallat"
						}
					],
					[
						{
							text: "Entrepa de pernim",
							callback_data: "Entrepa de Pernil"
						}
					]
				]
			}
		
	};
	
	switch (msg.data){
		case 'CANVI DE TAULA':
			bot.deleteMessage( msg.from.id, msg.message.message_id);
			bot.sendMessage(msg.from.id, msg.data, opts)
			break;
		case 'Comanda Taula 1':
		case 'Comanda Taula 2':
		case 'Comanda Taula 3':
			bot.deleteMessage(msg.from.id, msg.message.message_id);
			bot.sendMessage(msg.from.id, msg.data, ooo).then( reply => 
				bot.sendMessage(msg.from.id,msg.data)
			)
			break;
		default:
			bot.sendMessage(msg.from.id,'Comanda --> ' + msg.data )
			Dependenta = -1;
			Botiga=975;
			Cd=312;
			Preu =1;
			Comentari =1;
			IdSincro =1;
			Servit =1;
			
			var Sql="";
			Sql+="";
			Sql+="insert into TicketsTemporals ";
			Sql+="(id,rebut,tmst,Botiga,Dependenta,Quantitat,Cd,Preu,Comentari,IdSincro,Servit) ";
			Sql+="values ";
			Sql+="(Newid(),'',GETDATE()," + Botiga + "," + Dependenta + "," + 1 + "," + Cd + "," + Preu +  ",'" + Comentari + "','" + IdSincro + "','" + Servit + "')";
			conexion.recHit('Fac_Tena', Sql);			
//			console.log (Sql);
			break;
	}	
})

//bot.on("polling_error", (err) => console.log(err));

