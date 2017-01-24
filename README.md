# Amazon-Alexa-IOT
Nodejs Alexa script shows connected vehicle demo

Make a src.zip(containing alexaskill.js and index.js and then upload to amazon lambda)

Create a skill in amazon delivery portal using intentschema and sampleutternances

testhttpget.js is the business logic code to be included and can be ignored for customized calls

api url can be modifed to call a different endpoint like particle.io or amazon iot.

In this use case we query a car tire pressure message from the platform and issue a command to start and stop the car using the platform API
Platform would call the right device and issue the right command and send the response back to the alexa to read
