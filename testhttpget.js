var username = 'dfdfdfdx';
                var password = 'dfdfd';
                var auth = 'Basic ' + new Buffer(username + ':' + password).toString('base64');
                console.log ('auth='+auth);

                var options = {
                  host: 'xxx.xx.xx.xx',
                  port: 80,
                  path: dirPath,
                  method: 'GET',
                  headers:{
                        'Authorization': auth
                  } 

                };

                var req = http.get(options, function(res) {
                console.log('STATUS: ' + res.statusCode);
                //console.log ('body:'+res.data)
                
                res.on('data', function (chunk) {
                    console.log('BODY: ' + chunk);
                    var statusString = chunk;
                    
                    if (res.statusCode == 200){
                         console.log("success");
                         console.log("status string ="+chunk);
                         if (dirPath == "/api/startCar"){ 
                            if (chunk == "Low tire pressure") {
                                response.tellWithCard("Your car has started and has a low tire pressure");
                            }else {
                             
                              response.tellWithCard("Your car has started");
                            }  
                         } else {
                            response.tellWithCard("Your  Car engine has stopped"); 
                         }
                   }else {
                       response.tellWithCard("There was a problem connecting to the car");
                   }
                  });
                
                
               
                  //console.log('HEADERS: ' + JSON.stringify(res.headers));
                  //res.setEncoding('utf8');
                  
                });
                
                 

                req.on('error', function(e) {
                  console.log('problem with request: ' + e.message);
                });

                // write data to request body
                //req.write('data\n');
                //req.write('data\n');
                req.end();
        }     
        
    },
    "JerrysCarHelpIntent": function (intent, session, response) {
        response.ask("You can issue engine start and stop  commands")
    }    
};