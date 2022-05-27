const request = require('request');
const ProxyAgent = require('socks-proxy-agent');
const chalk = require('chalk');
const fs = require('fs');
const RandExp = require('randexp');
const readline = require("readline");

var proxies = fs.readFileSync('./data/proxies.txt', 'utf-8').replace(/\r/gi, '').split('\n');

process.on('uncaughtException', err => {});
process.on('unhandledRejection', err => {});

var retries = 0;
var work = 0;

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function write(content, file) {
    fs.appendFile(file, content, function(err) {});
}

class Spotify {
	static async Main(){
		process.title = "[313] Spotify Acc Creator"; 
		console.log(chalk.hex("00FF00")(`
				╔════════════════════════════════════════════════╗ 
			             ╔═╗╔═╗╔═╗╔╦╗╦╔═╗╦ ╦  ╔═╗╔═╗╔═╗╔═╗╦ ╦╔╗╔╔╦╗
			             ╚═╗╠═╝║ ║ ║ ║╠╣ ╚╦╝  ╠═╣║  ║  ║ ║║ ║║║║ ║ 
			             ╚═╝╩  ╚═╝ ╩ ╩╚   ╩   ╩ ╩╚═╝╚═╝╚═╝╚═╝╝╚╝ ╩ 
						╔═╗╦═╗╔═╗╔═╗╔╦╗╔═╗╦═╗                     
						║  ╠╦╝║╣ ╠═╣ ║ ║ ║╠╦╝                     
						╚═╝╩╚═╚═╝╩ ╩ ╩ ╚═╝╩╚═
				╚════════════════════════════════════════════════╝         
					Yeezy#2685 `));
		Spotify.setUsername();
	}
	static async setUsername(){
		rl.question(chalk.hex("00FF00")("[?] What Username Do you wish to use? "), function(name) {
			rl.question(chalk.hex("00FF00")("[?] How Many Do you wish to create? "), function(amount) {
				console.log("");
				var i = 0;
				var int = setInterval(() => {
					if (i >= amount) return clearInterval(int);
						Spotify.create(name);
				}, 0);
			});
		});
	}
    static create(DisplayName) {
		var sex = ["male","female"];
		var gender = sex[Math.floor(Math.random()*sex.length)];
		var domain = ["@gmail.com","@sus.com","@Yeezy.com", "@Yeezy.com"] 
		var email = new RandExp(/([a-zA-Z0-9]{20})/).gen() + domain[Math.floor(Math.random()*domain.length)];
		var password = new RandExp(/([a-zA-Z0-9_-]{15})$/).gen();
		
		let proxy = proxies[~~(Math.random() * proxies.length)];
		let agent = new ProxyAgent('socks4://' + proxy);
	
		let req = request.defaults({
			agent,
			jar: request.jar()
		});
		
		req.post("https://spclient.wg.spotify.com/signup/public/v1/account", { 
			headers: {
				'User-agent': 'S4A/2.0.15 (com.spotify.s4a; build:201500080; iOS 13.4.0) Alamofire/4.9.0',
				'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
				'Accept': 'application/json, text/plain;q=0.2, */*;q=0.1',
				'App-Platform': 'IOS',
				'Spotify-App': 'S4A',
				'Accept-Language': 'en-TZ;q=1.0',
				'Spotify-App-Version': '2.0.15'
			},
		body: `birth_day=12&birth_month=03&birth_year=1999&collect_personal_info=undefined&creation_flow=&creation_point=https%3A%2F%2Fwww.spotify.com%2Fuk%2F&displayname=${DisplayName}&gender=${gender}&iagree=1&key=a1e486e2729f46d6bb368d6b2bcda326&platform=www&referrer=&send-email=1&thirdpartyemail=0&email=${email}&password=${password}&password_repeat=${password}&fb=0`,
	
		}, (err,res,body) => {
			if(res && res.statusCode === 200){
				if(/"status":1,"/.exec(body)){
					work++;
					console.log(chalk.hex("00FF00")(`[CREATED] ${chalk.white('%s:%s')} | Display Name: %s | Gender: %s  `),email,password,DisplayName,gender);
					write(email + ":" + password + "\n", "./data/created.txt");
				}
				else if(/"status":20,"/.exec(body)){
					console.log(email);
					console.log(chalk.hex("FFFF00")("Email Registered"));
				}
			}
			else{
				retries++;
				setTimeout(() => Spotify.create(name), 50);
			}
		})
		process.title = `[313] Spotify Acc Creator | Working ${work} | Retries: ${retries}`;	
	}
}
Spotify.Main();


