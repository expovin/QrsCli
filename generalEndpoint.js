var https = require('https');
var http = require('http');
var fs = require('fs');

var generalEndpoint = {

	'GET' : 
		function get(options, program, key) {
				var str='';
				if(program.full) 
					options.path = options.path.concat('/full');

				options.path = options.path.concat('?xrfkey='+key);

				console.log(options);
				

				try {
				 	var req = https.get(options, function(res) {

						res.on('data', function (chunk) {
						    str += chunk;
						});

						res.on('end', function () {
							if(program.write) {
								fs.writeFileSync(program.args[0], str);
							} else {
								console.log(res.statusCode);
							    console.log(JSON.parse(str));
							}
						}); 
					});

					req.on('error', function(error){
						console.log("Errore :"+error);
					});


				     } catch (err) {
				     	console.log("Errore :"+err);
				} 
		},

	'POST' : 
		function post(options , program, key) {

				var str='';
				if(program.many)
					options.path = options.path.concat('/many');

				options.path = options.path.concat('?xrfkey='+key);
				

				var postData = JSON.parse(fs.readFileSync(program.args[0], 'utf8'));
				options.headers["Content-Type"] = 'application/json';
				options.headers["Accept-Charset"] = 'utf-8; q=0.9, us-ascii;q=0.1, iso-8859-1';
				options.headers["Accept"] = 'text/xml; q=0.1, application/json; q=0.2';
				options.headers["User-Agent"] = 'Mozilla/5.0 (Windows NT 6.3; WOW64; rv:26.0) Gecko/20100101 Firefox/26.0';

				try {
					var post_req = https.request(options, function(res)  {

				      	res.setEncoding('utf8');
				        res.on('response', function (response, body) {
				            statusCode = res.statusCode;
				            console.log(statusCode);
						});
						res.on('data', function (chunk) {
						    str += chunk;
						    console.log('Response: ' + chunk);
						});

						res.on('end', function () {				
							console.log('Response: ' + str);
						}); 
					});	

					post_req.on('error', function(error) {
					  	console.log(error);
					});

					post_req.write(JSON.stringify(postData));
					post_req.end();

				} catch (err) {
				   	console.log("Errore :"+err);
				} 

		},

	'DELETE' : 
		function post(options , program, key) {

				var str='';
				options.path = options.path.concat('/'+program.args[0]+'?xrfkey='+key);
				

				try {
					var post_req = https.request(options, function(res)  {

				      	res.setEncoding('utf8');
				        res.on('response', function (response, body) {
				            statusCode = res.statusCode;
				            console.log(statusCode);
						});
						res.on('data', function (chunk) {
						    str += chunk;
						    console.log('Response: ' + chunk);
						});

						res.on('end', function () {				
							console.log('Response: ' + str);
						}); 
					});	

					post_req.on('error', function(error) {
					  	console.log(error);
					});
					post_req.end();

				} catch (err) {
				   	console.log("Errore :"+err);
				} 

		}


};

module.exports = generalEndpoint;