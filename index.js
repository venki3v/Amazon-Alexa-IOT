/**
    Copyright 2014-2015 Amazon.com, Inc. or its affiliates. All Rights Reserved.
    Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
        http://aws.amazon.com/apache2.0/
    or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/



/**
 * App ID for the skill
 */
var APP_ID = "amzn1.ask.skill.cd844e81-f898-4c78-8721-fa861820a487"; //replace with "amzn1.echo-sdk-ams.app.[your-unique-value-here]";

/**
 * The AlexaSkill prototype and helper functions
 */
var AlexaSkill = require('./AlexaSkill');
var http = require('http');

/**
 * JerrysCar is a child of AlexaSkill.
 * To read more about inheritance in JavaScript, see the link below.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Introduction_to_Object-Oriented_JavaScript#Inheritance
 */
var JerrysCar = function () {
    AlexaSkill.call(this, APP_ID);
};

// Extend AlexaSkill
JerrysCar.prototype = Object.create(AlexaSkill.prototype);
JerrysCar.prototype.constructor = JerrysCar;

JerrysCar.prototype.eventHandlers.onSessionStarted = function (sessionStartedRequest, session) {
    console.log("JerrysCar onSessionStarted requestId: " + sessionStartedRequest.requestId
        + ", sessionId: " + session.sessionId);
    // any initialization logic goes here
};

JerrysCar.prototype.eventHandlers.onLaunch = function (launchRequest, session, response) {
    console.log("JerrysCar onLaunch requestId: " + launchRequest.requestId + ", sessionId: " + session.sessionId);
    //var speechOutput = "Welcome to covisint car kit, built on Covisint platform.";
   // var repromptText = "You can say vehicle commands like start the engine ";
    //response.ask(speechOutput, repromptText);
};

JerrysCar.prototype.eventHandlers.onSessionEnded = function (sessionEndedRequest, session) {
    console.log("JerrysCar onSessionEnded requestId: " + sessionEndedRequest.requestId
        + ", sessionId: " + session.sessionId);
    // any cleanup logic goes here
};

JerrysCar.prototype.intentHandlers = {
    // register custom intent handlers

    "JerrysCarIntent": function (intent, session, response) {
        //response.tellWithCard("Hello World!", "Hello World", "Hello World!");
        var cmd = ""; 
        var sensorSlot = intent.slots.sensor;
        var lockunlockSlot = intent.slots.lockunlock;
        var startstopSlot = intent.slots.startstop;
    
        var sensor = sensorSlot ? intent.slots.sensor.value : "";
        var lockunlock = lockunlockSlot ? intent.slots.lockunlock.value : "";
        var startstop = startstopSlot ? intent.slots.startstop.value : "stop";
        var dirPath = '/api/startCar';
        console.log ("sensor="+sensor);

        if(sensor == "car" && startstop =="start"){
              cmd = "enginestartcmd";
        }else if(sensor == "car" && startstop =="stop"){
              cmd = "enginestopcmd";
              dirPath = '/api/stopCar'
        }else if(sensor == "door" && lockunlock =="lock"){ 
             cmd = "doorlockcmd" ;
        }else if(sensor == "door" && lockunlock =="unlock"){
             cmd = "doorunlockcmd" ; 
        } 
        if (cmd.length > 0 ){
           
                console.log ("path="+dirPath);
                var username = 'xxxx';
                var password = 'xxxxx';
                var auth = 'Basic ' + new Buffer(username + ':' + password).toString('base64');
                console.log ('auth='+auth);

                var options = {
                  host: '104.xxx.xx.95',
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

// Create the handler that responds to the Alexa Request.
exports.handler = function (event, context) {
    // Create an instance of the JerrysCar skill.
    var jcar = new JerrysCar();
    jcar.execute(event, context);
};