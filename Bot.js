process.env.NTBA_FIX_319 = 1;
process.env["NTBA_FIX_350"] = 1;
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
if (BotName=='FornCarne')   Token='1262755647:AAGQH37t7lgAqDKiI4TBWTSWuEIseVs12x0';  
if (BotName=='Camps')   Token='1239103405:AAGVlClcVEhiVoo_AoSCwQT2JPSvDeI-SSI';  

console.log(' Bot Name : ************************** ' + BotName + ' ************************** ');

const bot = new TelegramBot(Token, {polling:true}); 

function registraUser(msg,Emp,NomEmp){
	var Tel = msg.contact.phone_number;
	var IdC = msg.chat.id;

	Sql="select d.codi Codi from ( ";
	Sql+="select id as codi from dependentesExtes where nom='TLF_MOBIL' and   ";
	Sql+="(valor = '" + msg.contact.phone_number + "' or '34' + valor = '" + msg.contact.phone_number + "') union   ";
	Sql+="select codi from dependentes where   ";
	Sql+="(telefon = '" + msg.contact.phone_number + "' or '34' + telefon = '" + msg.contact.phone_number + "')) a   ";
	Sql+="join dependentes d on d.codi = a.codi   ";
	conexion.recHit(Emp, Sql).then(info1 => {
		if (info1.rowsAffected>0 && info1.recordset[0].Codi > 0) {
console.log(info1.recordset[0].Codi);
			codiUser = info1.recordset[0].Codi;
			conexion.recHit('Hit', "Delete secretaria where Aux1 = '" + IdC + "' ").then(info2 => {
				conexion.recHit('Hit', "insert into secretaria (Id,lastConnect,empresa,usuario,Aux1) values (newid(),getdate(),'" + Emp + "','" + codiUser + "','" + IdC + "')").then(info3 => {
					conexion.recHit(Emp, "Select Nom from Dependentes where codi = " + codiUser + " ").then(info4 => {
						if (info4.rowsAffected>0) {
							console.log('Enregistra a Empresa : ' + NomEmp);
							conexion.recHit(Emp, "IF OBJECT_ID(N'Bot_Estat', N'U') IS NULL BEGIN CREATE TABLE [dbo].[Bot_Estat]([id] [nvarchar](255) NULL,[TimeStamp] [datetime] NULL,[CodiUser] [nvarchar](255) NULL,[Variable] [nvarchar](255) NULL,[Valor] [nvarchar](255) NULL,[Texte] [nvarchar](255) NULL,[Auxiliar1] [nvarchar](255) NULL,[Auxiliar2] [nvarchar](255) NULL,[Auxiliar3] [nvarchar](255) NULL,[Auxiliar4] [nvarchar](255) NULL) ON [PRIMARY] END; ");
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

async function venut(msg,estat,TipTep){
		var Cli_Emp = estat[0].Valor;
		var Cli_Codi= estat[0].CodiUser;
		var Cli_Nom = estat[0].Auxiliar1;

		var t="";
		var today = new Date();
		
		p = msg.text.split(' ');
		if(onlyDigits(p[1])) today.setDate(today.getDate() - p[1]);
		var keyboard = [];

		Sql ="select c.nom b,format(i,'0') t ,i tt,c.codi cc from clients c ";
		Sql+="join (select botiga,sum(import) i from [V_Venut_" + today.getFullYear() + "-"+ ("0" + (today.getMonth() + 1)).slice(-2) + "] where day(data) = " + today.getDate() + " group by botiga) v on c.codi=v.Botiga  ";
		switch(TipTep) {
			case 'FRANQUICIA' :
				Sql+=" and botiga in (select codi from ConstantsClient where variable = 'userFranquicia' and valor = " + Cli_Codi + " ) ";
				break;
		}
		Sql+="order by nom  ";
		
		conexion.recHit(Cli_Emp, Sql).then(info => {
			var ii=0;
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
	if(msg.text!==undefined && msg.text.toUpperCase() == 'C') return 'Comandero';	
	if(msg.data!==undefined && msg.data.substring(0, 10) == 'Comandero_')  return 'Comandero';
	if(msg.data!==undefined && msg.data.substring(0, 13) == 'Comanda Taula')  return 'ComanderoTaula';
	if(msg.data!==undefined && msg.data.substring(0, 13) == 'Detall  Taula')  return 'ComanderoTaulaDetall';
	if(msg.data!==undefined && msg.data.substring(0, 13) == 'Tanca   Taula')  return 'ComanderoTaulaTanca';
	if(msg.data!==undefined && msg.data.substring(0, 15) == 'ComanderoTeclat')  return 'ComanderoTeclat';
	if(msg.data!==undefined && msg.data.substring(0, 16) == 'ComanderoArticle')  return 'ComanderoArticle';
	if(msg.data!==undefined && msg.data.substring(0, 10) == 'ArticleMes')  return 'ArticleMes';
	if(msg.data!==undefined && msg.data.substring(0, 12) == 'ArticleMenos')  return 'ArticleMenos';

	if(msg.photo!==undefined)  			return 'photo';
	if(msg.text!==undefined )  			return msg.text;
	if(msg.data.split(' ')[0].length>0) return msg.data.split(' ')[0];
	if(msg.data!==undefined )  			return msg.data;
	if(msg.data!==undefined )  			return msg.data;
}
	
async function BotContesta(msg,estat,TipTep) {
	var acc=accio(msg);

	switch(TipTep) {
		case 'GERENT':
		case 'GERENT_2':
		case 'ADMINISTRACIO':
		case 'CONTABILITAT':
		case 'RESPONSABLE':
		case 'FRANQUICIA':
			switch (acc){
				case "Ventas":
					NouEstat= venut(msg,estat,TipTep).then(NouEstat => {return NouEstat;});	
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
				case "Comandero":
					NouEstat= comanderoLlistaTaules(msg,estat).then(NouEstat => {return NouEstat;});	
					return;
				case "ComanderoTaula":
					NouEstat= comanderoMain(msg,estat).then(NouEstat => {return NouEstat;});	
					return;
				case "ComanderoTaulaDetall":
					NouEstat= comanderoTaulaDetall(msg,estat).then(NouEstat => {return NouEstat;});	
					return;
				case "ComanderoTaulaTanca":
					NouEstat= comanderoTaulaTanca(msg,estat).then(NouEstat => {return NouEstat;});	
					return;
				case "ComanderoTeclat":
					NouEstat= ComanderoTeclat(msg,estat).then(NouEstat => {return NouEstat;});	
					return;
				case "ComanderoArticle":
					NouEstat= ComanderoArticle(msg,estat).then(NouEstat => {return NouEstat;});	
					return;
				case "ArticleMes":
					NouEstat= ArticleInc(msg,estat,' + 1').then(NouEstat => {return NouEstat;});	
					return;
				case "ArticleMenos":
					NouEstat= ArticleInc(msg,estat,' - 1').then(NouEstat => {return NouEstat;});	
					return;
				case "Ventas","Detall Dia":
					botsendMessage(msg, 'Tens un perfil d usuari de : ' + TipTep + ' No pots accedir a aquesta informaci� ');
					return;
				case 'FotoPujada':
					botGuardaFoto(msg,estat);
				case "photo":
					botGuardaFoto(msg,estat);
					return;	
				}
		default:
			switch (acc){
				case "Su":
					logaSu(msg,estat);
					return;
				case "VersioBotMenu":
				case "VersioBotNew":
				case "VersioBotAddComentari":
				if (msg.from.id=='911219941'){
					switch (acc){
						case "VersioBotMenu":
							botsendMessage(msg, 'Opcions Admin Bot',{reply_markup: JSON.stringify({inline_keyboard: [[{'text': 'Add Comentari', 'callback_data': 'VersioBotAddComentari'}],[{'text': 'No', 'callback_data': '--'}]]})});
							return;
						case "VersioBotAddComentari":
							bot.sendMessage(msg.from.id, 'Entra Comentari x seguent versio:', {reply_markup: JSON.stringify({ force_reply: true }),}).then(reply => console.log(reply))
							return;
						case "VersioBotNew":
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
//					botsendMessage(msg, 'Hola !! \nDegut al confinament pots fer la comanda per Telegram.\nVols fer una comanda i t avisem cuan la puguis passar a recollir ? ',{reply_markup: JSON.stringify({inline_keyboard: [[{'text': 'Si', 'callback_data': 'ComandaClientSi'}],[{'text': 'No', 'callback_data': 'ComandaClientNo'}]]})});
					botsendMessage(msg, 'Hola !! \nBen Vingut !!!');
					return;
				case "photo":
					
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
			bot.sendPhoto(msg.chat.id, 'help.jpg', { caption: 'No et tinc fichat. Enviam el teu numero de telefon.'}); 

			const opts = {reply_markup: JSON.stringify({keyboard: [[{text: 'Contact', request_contact: true}],],hide_keyboard: false,resize_keyboard: true,one_time_keyboard: true,}),};
			botsendMessage(msg, 'No et tinc fichat. Enviam el teu numero de telefon.', opts);			


 // bot.sendPhoto(msg.from.id,'help.jpg','No et tinc fichat. Enviam el teu numero de telefon.');
		}				
		});
	
}

function logaSu(msg,estat){
	var keyboard = [];

	if(msg.data===undefined || msg.data.split(' ')[1].length==0){
		conexion.recHit(estat[0].Valor, "select distinct empresa nom from hit.dbo.Secretaria  where not isnull(Aux1,'') ='' order by empresa").then(info => {
			for(i=0;i<info.rowsAffected;i++)
				keyboard.push([{'text': '\u{1F64B}' + ' Loga  ' + info.recordset[i].nom + '\u{1F481}' , 'callback_data': 'Su ' + info.recordset[i].nom}]);
				bot.sendMessage(msg.from.id,"Tria Empresa", {
						reply_markup: JSON.stringify({
							inline_keyboard: keyboard
						})
					});
		});
	}else{
		conexion.recHit(estat[0].Valor, "update hit.dbo.Secretaria set empresa = '" + msg.data.split(' ')[1] + "' , usuario = (Select top 1 usuario from hit.dbo.Secretaria where empresa='" + msg.data.split(' ')[1] + "' and not isnull(Aux1,'') ='') where aux1='911219941' ").then(info => {
			bot.sendMessage(msg.from.id,"Logat a : " + msg.data.split(' ')[1]);
			});
	}
}				
	


// MAIN........................

/*
	const url = 'https://telegram.org/img/t_logo.png';
	bot.sendPhoto(msg.from.id, url);
*/

bot.on('callback_query', function(msg) {
	mainBot(msg);
});

bot.on('polling_error', function(error){
//    console.log(error);

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

bot.on('photo', function(msg) {
  var photoId = msg.photo[msg.photo.length-1].file_id;
  var path = bot.downloadFile(photoId, ".").then(function (path) {
	msg.photo[msg.photo.length-1].push({'path':path});
    console.log(path);
	mainBot(msg);
  });
});


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
				'codi': codi,
				'latitude': '41.56173008199911',
				'longitude': '2.0985739618410104'};
			break;
		case 415:
			Botig = 
				{'Nom': 'T--115',
				'codi': codi,
				'latitude': '41.375578',
				'longitude': '2.1410033'};
			break;
		case 1:
			Botig = 
				{'Nom': 'Major',
				'codi': codi,
				'latitude': '41.559794',
				'longitude': '2.0981033'};
			break;		
		case 117:
			Botig = 
				{'Nom': 'Tenda 0',
				'codi': codi,
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
			return carregaBotiga(415);
			break;
		case 'Armengol':
			return carregaBotiga(1);
			break;
		case 'Carne':
			return carregaBotiga(117);
			break;
		default:
			return carregaBotiga(117);
			break;
	}
	return carregaBotiga(58);
 }
 
function botsendMessage(msg, t ,o){
	bot.sendMessage(msg.from.id, t ,o);
	if (msg.from.id!='911219941') bot.sendMessage('911219941', msg.from.first_name + " Diu : " + msg.text + " respong " + t ,o);  // me lo mando a mi pa verlo to....
}

async function comanderoLlistaTaules(msg,estat){
	var keyboard = [];
	var Sql='';

	Sql+='IF (select top 1 lloc from cdpDadesFichador  where usuari = ' + estat[0].CodiUser + ' and lloc in (select codi from ParamsHw) order by tmst desc) IS NULL ';
	Sql+='BEGIN  ';
	Sql+='select top 1 c.codi codi,nom from clients C join ParamsHw w on c.codi=w.codi ';
	Sql+='END else ';
	Sql+='select c.codi codi,c.nom nom from clients c join ( ';
	Sql+='select top 1 lloc codi from cdpDadesFichador  where usuari = ' + estat[0].CodiUser + ' and lloc in (select codi from ParamsHw) order by tmst desc) f ';
	Sql+='on f.codi =c.codi ';
	conexion.recHit(estat[0].Valor, Sql).then(info => {
		Botiga=info.recordset[0].codi;
		BotigaNom=info.recordset[0].nom;
		
		// Pa U+1F956 

		keyboard.push([{'text': '\u{1F64B}' + ' Tria Taula \u{1F481}' , 'callback_data': 'Comandero_' + Botiga}]);
		keyboard.push([{'text': '\u{1FA91}' + ' Comanda Taula 1' , 'callback_data': 'Comanda Taula 1'}]);
		keyboard.push([{'text': '\u{1FA91}' + ' Comanda Taula 2' , 'callback_data': 'Comanda Taula 2'}]);
		keyboard.push([{'text': '\u{1FA91}' + ' Comanda Taula 3' , 'callback_data': 'Comanda Taula 3'}]);
		keyboard.push([{'text': '\u{1FA91}' + ' Comanda Taula 4' , 'callback_data': 'Comanda Taula 4'}]);
		keyboard.push([{'text': '\u{1FA91}' + ' Comanda Taula 5' , 'callback_data': 'Comanda Taula 5'}]);
		if(msg.message===undefined) {bot.deleteMessage(msg.from.id, msg.message_id);}else{bot.deleteMessage(msg.from.id, msg.message.message_id);}
		bot.sendMessage(msg.from.id,'Comandero Botiga : ' + BotigaNom, {
                   reply_markup: JSON.stringify({
                       inline_keyboard: keyboard
                   })
            });
		});	
}

async function comanderoTaulaDetall(msg,estat){
	var keyboard = [];

	Dependenta = -extreuTaula(msg) ;
	Botiga=extreuBotiga(msg);

	keyboard.push([{'text': '\u{1F64B}' + ' Tria Taula \u{1F481}' , 'callback_data': 'Comandero_' + extreuBotiga(msg)}]);
	keyboard.push([
	{'text': '\u{1FA91}' + ' Detall Taula ' + extreuTaula(msg)  , 'callback_data': 'Detall  Taula ' + extreuTaula(msg)}
	,{'text': '\u{1FA91}' + ' Tancar Taula ', 'callback_data': 'Tanca   Taula ' + extreuTaula(msg)}]);
	keyboard.push([{'text': '\u{1F64B}' + ' Afegir  Article \u{1F481}' , 'callback_data': 'Comanda Taula ' + extreuTaula(msg)}]);

	var Sql="";
	Sql+="select a.codi codi, nom ,sum(quantitat) q ,sum(tt.preu) p ";
	Sql+="from TicketsTemporals tt  ";
	Sql+="join articles a on a.Codi=tt.Cd "; 
	Sql+="where botiga = " + Botiga + " and dependenta = " + Dependenta + " ";
	Sql+="group by dependenta,nom,a.codi ";
	
	conexion.recHit(estat[0].Valor, Sql).then(info => {
		let mis="Articles \n";
		for(i=0;i<info.rowsAffected;i++){
		keyboard.push([
			{'text': '' + ' + ' , 'callback_data': 'ArticleMes   ' + info.recordset[i].codi},
			{'text': info.recordset[i].q + ' ' + info.recordset[i].nom , 'callback_data': 'Comanda Taula ' + info.recordset[i].codi},
			{'text': '' + ' - ' , 'callback_data': 'ArticleMenos ' + info.recordset[i].codi}
			]);
		}
		bot.deleteMessage(msg.from.id, msg.message.message_id).then(x => {
			bot.sendMessage(msg.from.id,msg.message.text, {
				resize_keyboard: false,
				one_time_keyboard: false,
				selective: false,
						reply_markup: JSON.stringify({
							inline_keyboard: keyboard
						})
					});
				});
	});

}	

async function comanderoTaulaTanca(msg,estat){
	var keyboard = [];
	var today = new Date();

	keyboard.push([{'text': '\u{1F64B}' + ' Tria Taula \u{1F481}' , 'callback_data': 'Comandero_' + extreuBotiga(msg)}]);
	keyboard.push([
	{'text': '\u{1FA91}' + ' Detall Taula ' + msg.data.substring(14, 100)  , 'callback_data': 'Detall  Taula ' + msg.data.substring(14, 100) }
	,{'text': '\u{1FA91}' + ' Tancar Taula ', 'callback_data': 'Tanca   Taula ' + msg.data.substring(14, 100) }]);
	
	Sql ="select distinct ambient from teclatstpv where data in( "
	Sql+="select max(data) from TeclatsTpv where llicencia = " + extreuBotiga(msg) + " "
	Sql+=") and llicencia = " + extreuBotiga(msg) + " and article in (select distinct plu from [V_Venut_" + today.getFullYear() + "-"+ ("0" + (today.getMonth() + 1)).slice(-2) + "] where botiga = " + extreuBotiga(msg) + ")  order by ambient "

	conexion.recHit(estat[0].Valor, Sql).then(info => {
		var linea=[];
		for(i=0;i<info.rowsAffected;i++){
			linea.push({'text': info.recordset[i].ambient , 'callback_data': 'ComanderoTeclat_' + info.recordset[i].ambient});
			if(((i+1)%3)==0)  {keyboard.push(linea);linea=[];}
		}
	if(!linea==[]) {keyboard.push(linea);linea=[];}

	bot.deleteMessage(msg.from.id, msg.message.message_id).then(x => {
		bot.sendMessage(msg.from.id,msg.message.text, {
            resize_keyboard: false,
            one_time_keyboard: false,
            selective: false,
                    reply_markup: JSON.stringify({
                        inline_keyboard: keyboard
                    })
                });
			});
		});

	}	

async function ArticleInc(msg,estat,Incr){
	codiArticle = msg.data.substring(13, 100);
	Dependenta = -extreuTaula(msg) ;
	Botiga=extreuBotiga(msg);

	var Sql="";
	Sql+="";
	Sql+="Update TicketsTemporals ";
	Sql+="set rebut='' , quantitat = quantitat " + Incr + '  ';
	Sql+="where id in( ";
	Sql+=" select top 1 id from  TicketsTemporals where Botiga = " + Botiga + " and Dependenta = " + Dependenta + "  and cd = " + codiArticle + " ";
	Sql+=") ";
	conexion.recHit(estat[0].Valor, Sql).then(info => {
		comanderoTaulaDetall(msg,estat);
	});
	
}	

function botGuardaFoto(msg,estat){
	var keyboard = [];

	if(msg.data===undefined || msg.data.split(' ')[1].length==0){
		Sql ="select c.codi codi,nom from clients c join paramshw w on w.codi = c.codi order by c.nom "
console.log(msg);
		conexion.recHit(estat[0].Valor, Sql).then(info => {
			var linea=[];
			for(i=0;i<info.rowsAffected;i++){
				linea.push({'text': info.recordset[i].nom , 'callback_data': 'FotoPujada ' + info.recordset[i].codi + ' ' + msg.photo[0].file_unique_id});
				if(((i+1)%3)==0)  {keyboard.push(linea);linea=[];}
			}
			if(!linea==[]) {keyboard.push(linea);linea=[];}
			bot.sendMessage(msg.from.id,'Tria una Botiga', {
				resize_keyboard: false,
				one_time_keyboard: false,
				selective: false,
						reply_markup: JSON.stringify({
							inline_keyboard: keyboard
						})
					});
			});
	}else{
		var Botiga=msg.data.split(' ')[1];
		var File=msg.data.split(' ')[2];
		
	}

}	


async function comanderoMain(msg,estat){
	var keyboard = [];
	var today = new Date();

	keyboard.push([{'text': '\u{1F64B}' + ' Tria Taula \u{1F481}' , 'callback_data': 'Comandero_' + extreuBotiga(msg)}]);
	keyboard.push([
	{'text': '\u{1FA91}' + ' Detall Taula ' + msg.data.substring(14, 100)  , 'callback_data': 'Detall  Taula ' + msg.data.substring(14, 100) }
	,{'text': '\u{1FA91}' + ' Tancar Taula ', 'callback_data': 'Tanca   Taula ' + msg.data.substring(14, 100) }]);
	
	Sql ="select distinct ambient from teclatstpv where data in( "
	Sql+="select max(data) from TeclatsTpv where llicencia = " + extreuBotiga(msg) + " "
	Sql+=") and llicencia = " + extreuBotiga(msg) + " and article in (select distinct plu from [V_Venut_" + today.getFullYear() + "-"+ ("0" + (today.getMonth() + 1)).slice(-2) + "] where botiga = " + extreuBotiga(msg) + ")  order by ambient "
	conexion.recHit(estat[0].Valor, Sql).then(info => {
		var linea=[];
		for(i=0;i<info.rowsAffected;i++){
			linea.push({'text': info.recordset[i].ambient , 'callback_data': 'ComanderoTeclat_' + info.recordset[i].ambient});
			if(((i+1)%3)==0)  {keyboard.push(linea);linea=[];}
		}
	if(!linea==[]) {keyboard.push(linea);linea=[];}
	bot.deleteMessage(msg.from.id, msg.message.message_id).then(x => {
		bot.sendMessage(msg.from.id,msg.message.text, {
            resize_keyboard: false,
            one_time_keyboard: false,
            selective: false,
                    reply_markup: JSON.stringify({
                        inline_keyboard: keyboard
                    })
                });
			});
		});

	var sql="";
	sql+="Delete TicketsTemporals where datediff(hour,tmst,getdate()) > 10 ";
	sql+="insert into MissatgesPerLlicencia  ([Id],[TimeStamp],[QuiStamp],[DataEnviat],[DataRebut],[Desti],[Origen],[Accio],[Param1],[Param2],[Param3],[Param4],[Texte]) ";
	sql+="values  ";
	sql+="(newid(),getdate(),'" + estat[0].Auxiliar1 + "',getdate(),Null," + extreuBotiga(msg) + ",'" + estat[0].Auxiliar1 + "','ConfiguraConexio','Tickets','" + extreuBotiga(msg) + "','','','') ";
	conexion.recHit(estat[0].Valor, sql);
	}	

async function ComanderoTeclat(msg,estat){
	var keyboard = [];
	keyboard.push([{'text': '\u{1F64B}' + ' Tria Taula \u{1F481}' , 'callback_data': 'Comandero_' + Botiga}]);
	keyboard.push([
	{'text': '\u{1FA91}' + ' Detall Taula ' + extreuTaula(msg) , 'callback_data': 'Detall  Taula ' + extreuTaula(msg)}
	,{'text': '\u{1FA91}' + ' Tancar Taula ', 'callback_data': 'Tanca   Taula ' + extreuTaula(msg)}]);
	keyboard.push([{'text': msg.data.substring(16, 100) , 'callback_data': 'Comanda Taula ' + extreuTaula(msg)}]);

	var today = new Date();

	Sql="select nom,codi from ( "
	Sql+="select distinct article from teclatstpv where data in( "
	Sql+="select max(data) from TeclatsTpv where llicencia = " + extreuBotiga(msg) + " "
	Sql+=") and llicencia = " + extreuBotiga(msg) + " and ambient = '" + msg.data.substring(16, 100)  + "' and article in (select distinct plu from [V_Venut_" + today.getFullYear() + "-"+ ("0" + (today.getMonth() + 1)).slice(-2) + "] where botiga = " + extreuBotiga(msg) + ") "
	Sql+=" ) t join articles a on a.codi=t.article order by nom "
	
	conexion.recHit(estat[0].Valor, Sql).then(info => {
		var linea=[];
		for(i=0;i<info.rowsAffected;i++){
			linea.push({'text': info.recordset[i].nom , 'callback_data': 'ComanderoArticle_' + info.recordset[i].codi});
			if(((i+1)%3)==0) {keyboard.push(linea);linea=[];}
		}
	if(!linea==[]) {keyboard.push(linea);linea=[];}

	bot.deleteMessage(msg.from.id, msg.message.message_id).then(x => {
		bot.sendMessage(msg.from.id,msg.message.text, {
                    reply_markup: JSON.stringify({
                        inline_keyboard: keyboard
                    })
                });
		});
	});
	}	

async function ComanderoArticle(msg,estat){
	var keyboard = [];
	var today = new Date();
	codiArticle = msg.data.substring(17, 100);
	Dependenta = -extreuTaula(msg) ;
	Botiga=extreuBotiga(msg);
	Cd=codiArticle;
	Preu =1;
	Comentari =1;
	IdSincro =1;
	Servit =1;
 
	var Sql="";
	Sql+="";
	Sql+="insert into TicketsTemporals ";
	Sql+="(id,rebut,tmst,Botiga,Dependenta,Quantitat,Cd,Preu,Comentari,IdSincro,Servit) ";
	Sql+=" select  ";
	Sql+="Newid(),'',GETDATE()," + Botiga + "," + Dependenta + "," + 1 + "," + codiArticle + "," + 1 +  ",'" + Comentari + "',(select isnull(max(idsincro),0) from ticketstemporals)+1 ,'" + Servit + "' ";

	conexion.recHit(estat[0].Valor, Sql).then(x => {
		var Sql="";
		Sql+="";
		
		Sql+="select dependenta t , nom ,sum(quantitat) q ,sum(tt.preu) p ";
		Sql+="from TicketsTemporals tt  ";
		Sql+="join articles a on a.Codi=tt.Cd "; 
		Sql+="where botiga = " + Botiga + " and dependenta = " + Dependenta + " ";
		Sql+="group by dependenta,nom ";

		conexion.recHit(estat[0].Valor, Sql).then(info => {
			let mis="Articles \n";
			for(i=0;i<info.rowsAffected;i++){
				mis+= info.recordset[i].q + ' ' + info.recordset[i].nom  + ' ' + '\n';
			}
			keyboard=msg.message.reply_markup.inline_keyboard;
			bot.deleteMessage(msg.from.id, msg.message.message_id).then(x => {
				bot.sendMessage(msg.from.id,mis, {
					reply_markup: JSON.stringify({
                        inline_keyboard: keyboard
                    })
                });
			});
		});
	});	
}	

function extreuBotiga(msg){
	if (msg.message===undefined) return -1;
	return msg.message.reply_markup.inline_keyboard[0][0].callback_data.substring(10, 100);
}
function extreuTaula(msg){
	if (msg.message===undefined) return -1;
	return msg.message.reply_markup.inline_keyboard[1][0].callback_data.substring(14, 100);
}






