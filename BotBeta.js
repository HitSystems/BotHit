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

const bot = new TelegramBot(Token, {polling:true}); 

function registraUser(msg,Emp,NomEmp){
	var Tel = msg.contact.phone_number;
	var IdC = msg.chat.id;
	
	Sql="select max(codi) as Codi from (";
	Sql+="select id as codi from dependentesExtes where nom='TLF_MOBIL' and (valor = '" + Tel + "' or '34' + valor = '" + Tel + "') union ";
	Sql+="select codi from dependentes where (telefon = '" + Tel + "' or '34' + telefon = '" + Tel + "')) a where not codi is null ";

	conexion.recHit(Emp, Sql).then(info1 => {
		if (info1.rowsAffected>0 && info1.recordset[0].Codi > 0) {
			codiUser = info1.recordset[0].Codi;
			conexion.recHit('Hit', "Delete secretaria where Aux1 = '" + IdC + "' ").then(info2 => {
				conexion.recHit('Hit', "insert into secretaria (Id,lastConnect,empresa,usuario,Aux1) values (newid(),getdate(),'" + Emp + "','" + codiUser + "','" + IdC + "')").then(info3 => {
					conexion.recHit(Emp, "Select Nom from Dependentes where codi = " + codiUser + " ").then(info4 => {
						if (info4.rowsAffected>0) {
							conexion.recHit(Emp, "CREATE TABLE [dbo].[Bot_Estat]([id] [nvarchar](255) NULL,[TimeStamp] [datetime] NULL,[CodiUser] [nvarchar](255) NULL,[Variable] [nvarchar](255) NULL,[Valor] [nvarchar](255) NULL,[Texte] [nvarchar](255) NULL,[Auxiliar1] [nvarchar](255) NULL,[Auxiliar2] [nvarchar](255) NULL,[Auxiliar3] [nvarchar](255) NULL,[Auxiliar4] [nvarchar](255) NULL) ON [PRIMARY]");
							botsendMessage(msg, "Hola " +  info4.recordset[0].Nom + " \n Ben vingut a " + NomEmp + " " );
						}else {BuscaMsgIdEmpresa(msg,NomEmp);};							
					});	
				});	
			});	
		}else {BuscaMsgIdEmpresa(msg,NomEmp);};							
	});									
}			
				
function buscaId(msg){
	BuscaMsgIdEmpresa(msg,"");
}

function 	BuscaMsgIdEmpresa(msg,NomEmpresaNo){
	conexion.recHit("Hit", "select nom,db from web_empreses where nom > '" + NomEmpresaNo + "' order by nom ").then(info => {
		if(info.rowsAffected>0){
			registraUser(msg,info.recordset[0].db,info.recordset[0].nom);
		}else{
			botsendMessage(msg, "No trobo el Teu numero (" + msg.contact.phone_number + ") a la base de dades. \nParla amb l Oficina." );
		}
	});
}

function onlyDigits(s) {
	if(s == undefined) return false;
  for (let i = s.length - 1; i >= 0; i--) {
    const d = s.charCodeAt(i);
    if (d < 48 || d > 57) return false
  }
  return true
}

async function venut(msg,estat){
		var Cli_Emp = estat[0].Valor;
		var Cli_Codi= estat[0].CodiUser;
		var Cli_Nom = estat[0].Auxiliar1;

		var t="";
		var today = new Date();
		
		p = msg.text.split(' ');
		if(onlyDigits(p[1])) today.setDate(today.getDate() - p[1]);
		
		var month = ("0" + (today.getMonth() + 1)).slice(-2);
		var keyboard = [];

		Sql ="select rtrim(lTRIM(upper(isnull(g.valor,'')))) gg,c.nom b,format(i,'0') t ,i tt,c.codi cc from clients c ";
		Sql+="join (select botiga,sum(import) i from [V_Venut_" + today.getFullYear() + "-"+ month + "] where day(data) = " + today.getDate() + " group by botiga) v on c.codi=v.Botiga  ";
		Sql+="left join (select codi,valor from ConstantsClient where variable = 'Grup_client') g on g.codi = c.codi  ";
		Sql+="order by nom  ";
		
		conexion.recHit(Cli_Emp, Sql).then(info => {
			var ii=0,iig=0,ng=0;
			var gg = info.recordset[0].gg;
			for(i=0;i<info.rowsAffected;i++){
				if(info.recordset[i].t > 500){
					btt=info.recordset[i].b + '    ' + info.recordset[i].t + "     \u{1F604}" ;
				}else{
					btt=info.recordset[i].b + '    ' + info.recordset[i].t + "     \u{1F612}" ;
				}
				keyboard.push([{'text': btt , 'callback_data': 'InfoVentas' + info.recordset[i].cc}]);
				ii+=info.recordset[i].tt;
			}

			t="	Venut " + today.toString() + " ";
			keyboard.push([{'text': t , 'callback_data': 'Infontas' + 33}]);
			
			t= "Total " + parseFloat(ii).toFixed(2); + "\u{1F604}";	
			keyboard.push([{'text': t , 'callback_data': 'Infontas' + 33}]);

bot.sendMessage(msg.from.id, "Ventas" , {
                    reply_markup: JSON.stringify({
                        inline_keyboard: keyboard
                    })
                });
				
/*			botsendMessage(msg, "Ventas" , {
                    reply_markup: JSON.stringify({
                        inline_keyboard: keyboard
                    })
                });
	*/		
			estat[0].TimeStamp = new Date();
			estat[0].Texte = 'Estat Post mostrar Vendes';

			conexion.recHit(Cli_Emp, "Delete Bot_Estat where CodiUser='" + Cli_Codi + "'").then(RsIdCli => {
				Sql ="";	
				Sql+="Insert Into Bot_Estat ([id],[TimeStamp],[CodiUser],[Variable],[Valor],[Texte],[Auxiliar1],[Auxiliar2],[Auxiliar3],[Auxiliar4]) values (";					
				Sql+="newid()";
				Sql+=",getdate()";
				Sql+="," + estat[0].CodiUser;
				Sql+=",'Cli_Emp'",
				Sql+=",'" + estat[0].Valor + "'";
				Sql+=",'" + estat[0].Texte + "'";
				Sql+=",'" + estat[0].Auxiliar1 + "'";
				Sql+=",''";				
				Sql+=",''";				
				Sql+=",''";				
				Sql+=") ";		
				conexion.recHit(Cli_Emp, Sql).then(RsIdCli => {
					
					return estat;
				});
			});
			t="	Venut " + today.toString() + " ";
			bot.sendMessage(msg.from.id,  t);
			
			t= "Total " + parseFloat(ii).toFixed(2); + " \n\u{1F604}";	
			bot.sendMessage(msg.from.id,  t);
			
			bot.sendMessage('911219941', msg.from.first_name + " Diu : " + msg.text + " respong " + t);  // me lo mando a mi pa verlo to....

        });
}

nomTaulaVenut = function(d){
	return "[V_Venut_" + d.getFullYear() + "-"+ ("0" + (d.getMonth() + 1)).slice(-2) + "]";
}


async function detallDia(msg,estat){
	var Cli_Emp = estat[0].Valor;
	var Cli_Codi= estat[0].CodiUser;
	var Cli_Nom = estat[0].Auxiliar1;
	var codiBotiga= msg.data.substring(10, 100);
	var today = new Date();
	var Sql='';
	
	Sql+="      select format(sum(import),'0.00') i , 'venutMAti' t from " + nomTaulaVenut(today) + " where botiga= " + codiBotiga + " and day(data) = " + today.getDate() + " and datepart(hour,data) <15 ";
	Sql+="union select format(count( distinct Num_tick),'0.00') i , 'ClientsMAti' t from  " + nomTaulaVenut(today) + " where botiga= " + codiBotiga + " and day(data) = " + today.getDate() + " and datepart(hour,data) <15 ";
	Sql+="union select format(sum(import),'0.00') i , 'venutTarda' t from  " + nomTaulaVenut(today) + " where botiga= " + codiBotiga + " and day(data) = " + today.getDate() + " and datepart(hour,data) >15 ";
	Sql+="union select format(count( distinct Num_tick),'0.00') i , 'ClientsTarda' t from  " + nomTaulaVenut(today) + " where botiga= " + codiBotiga + " and day(data) = " + today.getDate() + " and datepart(hour,data) >15 ";
	Sql+="union select format(count( distinct Num_tick),'0.00') i , 'ClientsTarda' t from  " + nomTaulaVenut(today) + " where botiga= " + codiBotiga + " and day(data) = " + today.getDate() + " and datepart(hour,data) >15 ";
	Sql+="union select nom i , 'Nom' t from clients where codi = " + codiBotiga + " "

	conexion.recHit(Cli_Emp,Sql).then(RsIdCli => {
		var cM='',cT='',vM='',vT='',nomB='';
		
		for (i=0;i<RsIdCli.rowsAffected;i++) {

			if(RsIdCli.recordset[i].t=='venutMAti') vM=RsIdCli.recordset[i].i;
			if(RsIdCli.recordset[i].t=='ClientsMAti') cM=RsIdCli.recordset[i].i;
			if(RsIdCli.recordset[i].t=='venutTarda') vT=RsIdCli.recordset[i].i;
			if(RsIdCli.recordset[i].t=='ClientsTarda') cT=RsIdCli.recordset[i].i;
			if(RsIdCli.recordset[i].t=='Nom') nomB=RsIdCli.recordset[i].i;
		};
		
			var Txt='';
			Txt+=" Detall Dia Botiga " + nomB + "\n";
			Txt+="<b>Venut   Mati : </b>" + vM + "\n";
			Txt+="<b>Clients Mati : </b>" + cM + "\n";
			Txt+="<b>Venut   Tarda : </b>" + vT + "\n";
			Txt+="<b>Clients Tarda : </b>" + cT + "\n";
	
			bot.sendMessage(msg.from.id, Txt, {parse_mode: 'html'});
	});
}

accio = function(msg){

	if(msg.text!==undefined && (msg.text + ' ').toUpperCase().substring(0, 9) == 'VERSIOBOT') return 'VersioBotMenu';
	if(msg.data!==undefined && msg.data.substring(0, 10) == 'InfoVentas') return 'Detall Dia';
	if(msg.text!==undefined && (msg.text + ' ').toUpperCase().substring(0, 2) == 'V ') return 'Ventas';
	if(msg.text!==undefined )  return msg.text;
	if(msg.data!==undefined )  return msg.data;
}
	
async function BotContesta(msg,estat,TipTep) {
	var acc=accio(msg);
	
	switch(TipTep) {
		case 'GERENT':
		case 'GERENT_2':
		case 'ADMINISTRACIO':
		case 'CONTABILITAT':
		case 'RESPONSABLE':
			switch (acc){
				case "Ventas":
					NouEstat= venut(msg,estat).then(NouEstat => {return NouEstat;});	
					return;
				case "Detall Dia":
					NouEstat= detallDia(msg,estat).then(NouEstat => {return NouEstat;});	
					return;
				}
		case 'AUXILIAR':
		case 'BOLLERIA':
		case 'CAMBRER':
		case 'CUINER':
		case 'DEPENDENTA':
		case 'FORNER':
		case 'GESTOR DE PRODUCTE':
		case 'NETEJA':
		case 'PASTISSER/FORNER':
		case 'PRODUCCIO':
		case 'REPARTIDOR':
			switch (acc){
				case "Ventas","Detall Dia":
					botsendMessage(msg, 'Tens un perfil d usuari de : ' + TipTep + ' No pots accedir a aquesta informació ');
					return;
				}
		default:
			switch (acc){
				case "VersioBotMenu":
				case "VersioBotNew":
				if (msg.from.id=='911219941'){
					switch (acc){
						case "VersioBotMenu":
							botsendMessage(msg, 'Opcions Admin Bot',{reply_markup: JSON.stringify({inline_keyboard: [[{'text': 'Crea Versio', 'callback_data': 'VersioBotNew'}],[{'text': 'No', 'callback_data': '--'}]]})});
							return;
						case "VersioBotNew":
							bot.sendMessage(msg.from.id, 'Entra descripcio de la nova versio del Bot:', {
      reply_markup: JSON.stringify({ force_reply: true }),
    })
    .then(sentMessage => {
      bot.onReplyToMessage(
        sentMessage.from.id,
        sentMessage.message_id,
        reply => {
console.log(reply.text)

        }
      )
    })

							return;
					}
				}else{botsendMessage(msg, 'Nomes Deu pot fer aixo !!');return;}	
				case "ComandaClientSi":
					var opt = {"parse_mode": "Markdown","reply_markup": {"one_time_keyboard": true,"keyboard": [[{text: "My location",request_location: true}], ["Cancel"]]}};
					botsendMessage(msg, 'Posat a pocs metres de la botiga i enviam la teva Posicio',opt);
					return;
				case "ComandaClientNo":
					botsendMessage(msg, 'Doncs quan vulguis ja ho saps..... ');
					return;
				default:
					botsendMessage(msg, 'Hola !! \nDegut al confinament pots fer la comanda per Telegram.\nVols fer una comanda i t avisem cuan la puguis passar a recollir ? ',{reply_markup: JSON.stringify({inline_keyboard: [[{'text': 'Si', 'callback_data': 'ComandaClientSi'}],[{'text': 'No', 'callback_data': 'ComandaClientNo'}]]})});
					return;
				}
	}
}		
				
function mainBot(msg) {
	var estat = [{}];

	conexion.recHit('Hit', "select empresa,usuario from Secretaria where aux1='" + msg.from.id + "'").then(RsIdCli => {
		if (RsIdCli.rowsAffected>0) {
			Cli_Emp=RsIdCli.recordset[0].empresa;
			Cli_Codi=RsIdCli.recordset[0].usuario;
			Cli_Nom=msg.from.first_name;
			conexion.recHit(Cli_Emp, "select  valor from dependentesextes where id = '" + Cli_Codi + "' and nom = 'TIPUSTREBALLADOR' ").then(RsTipTep => {
				TipTep ="ClientNoIdentificat";
//botsendMessage(msg, "select  valor from dependentesextes where id = '" + Cli_Codi + "' and nom = 'TIPUSTREBALLADOR' ");					
				TipTep=RsTipTep.recordset[0].valor;
				if(RsTipTep.rowsAffected>0) TipTep=RsTipTep.recordset[0].valor;
				conexion.recHit(Cli_Emp, "select Nom From Dependentes where codi = " + Cli_Codi + "").then(RsNomDep => {
					Cli_Nom=RsNomDep.recordset[0].Nom;
//					conexion.recHit(Cli_Emp, "select e.id,[TimeStamp],CodiUser,Variable,e.Valor,Texte,Auxiliar1,Auxiliar2,Auxiliar3,Auxiliar4,e.valor as UserType  From Bot_Estat b join dependentesextes e on e.nom COLLATE DATABASE_DEFAULT = 'TIPUSTREBALLADOR' COLLATE DATABASE_DEFAULT and e.id  COLLATE DATABASE_DEFAULT = b.codiuser COLLATE DATABASE_DEFAULT where CodiUser= '" + Cli_Codi + "'").then(RsIdCli => {
					conexion.recHit(Cli_Emp, "select id,[TimeStamp],CodiUser,Variable,Valor,Texte,Auxiliar1,Auxiliar2,Auxiliar3,Auxiliar4 From Bot_Estat where CodiUser= '" + Cli_Codi + "'").then(RsIdCli => {
						estat=RsIdCli.recordset;
						if (estat.length==0) {
							estat = [{'id': new Date(),'TimeStamp': new Date(),'CodiUser': Cli_Codi,'Variable': 'Cli_Emp','Valor': Cli_Emp,'Texte': 'Estat inicial Autocreat','Auxiliar1': Cli_Nom ,'Auxiliar2': '.','Auxiliar3': '.','Auxiliar4': '.'}];
						};
						BotContesta(msg,estat,TipTep).then(NouEstat => {	});
					});
				});
			});
		} else {
			const opts = {reply_markup: JSON.stringify({keyboard: [[{text: 'Contact', request_contact: true}],],hide_keyboard: false,resize_keyboard: true,one_time_keyboard: true,}),};
			botsendMessage(msg, 'No et tinc fichat. Enviam el teu numero de telefon.', opts);			
		}				
		});
	
}

// MAIN........................

bot.on('polling_error', function(error){
    console.log(error);
});
bot.onText(/./, function(msg){
console.log(msg.from.first_name + "--->" + msg.text);
    mainBot(msg);
});

bot.on("contact",(msg)=>{
  console.log(msg.contact.first_name);
  console.log(msg.contact.phone_number);
  buscaId(msg);
});

getKilometros = function(lat1,lon1,lat2,lon2) {
	rad = function(x) {return x*Math.PI/180;}
	var R = 6378.137; //Radio de la tierra en km
	var dLat = rad( lat2 - lat1 );
	var dLong = rad( lon2 - lon1 );
	var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(rad(lat1)) * Math.cos(rad(lat2)) * Math.sin(dLong/2) * Math.sin(dLong/2);
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
	var d = R * c;
	return d.toFixed(3); //Retorna tres decimales
 }

carregaBotiga = function(codi) {
	var Botig = [];
	switch(codi){
		case 58:
			Botig = 
				{'Nom':'Forrellat',
				'latitude': '41.56173008199911',
				'longitude': '2.0985739618410104'};
			break;
		case 819:
			Botig = 
				{'Nom': 'T--91',
				'latitude': '41.550438',
				'longitude': '2.0984575'};
			break;
		case 1:
			Botig = 
				{'Nom': 'Major',
				'latitude': '41.559794',
				'longitude': '2.0981033'};
			break;			
	}
	return Botig ;
}

seleccionaBotiga = function(lat,lon) {
	
	switch(BotName){
		case 'PaNatural':
			return carregaBotiga(58);
			break;
		case '365Cafe':
			return carregaBotiga(819);
			break;
		case 'Armengol':
			return carregaBotiga(1);
			break;
	}
	return carregaBotiga(58);
 }
 

bot.on('location', (msg) => {
	lat= msg.location.latitude;
	lon= msg.location.longitude;
	
	if (lon<0) {  // estic a irlanda 
		lat = 41.56179;
		lon = 2.098570;
	}

	console.log(lat);	
	console.log(lon);	

	Botiga=seleccionaBotiga(lat,lon);

	m=(getKilometros(lat,lon,Botiga.latitude,Botiga.longitude) * 1000)
	if(m>50){
		botsendMessage(msg, 'Estas a ' + m + ' Metres de La Botiga.\ncuan estiguis a menos de 50 metres t agafarem la comanda.');		
	}else{
		botsendMessage(msg, 'Estas a ' + m + ' Metres de La Botiga.\nQue et preparem ?.');		
	};
});

/*
	const url = 'https://telegram.org/img/t_logo.png';
	bot.sendPhoto(msg.from.id, url);
*/
bot.on('callback_query', function(msg) {
	mainBot(msg);
});


function botsendMessage(msg, t ,o){
	bot.sendMessage(msg.from.id, t ,o);
	if (msg.from.id!='911219941') bot.sendMessage('911219941', msg.from.first_name + " Diu : " + msg.text + " respong " + t ,o);  // me lo mando a mi pa verlo to....
}

