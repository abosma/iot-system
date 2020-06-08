# iot-system
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/a5ecbff88ed3463083463e5edcb1b7ef)](https://app.codacy.com/manual/abosma/iot-system?utm_source=github.com&utm_medium=referral&utm_content=abosma/iot-system&utm_campaign=Badge_Grade_Dashboard)
[![Build Status](https://travis-ci.org/abosma/iot-system.svg?branch=master)](https://travis-ci.org/abosma/iot-system)

IoT system for thesis by Atilla Bosma.

## Prerequisites  
### Software
[Node JS (system tested on LTS (v12.18.0))](https://nodejs.org/en/download/)

[MQTT Broker (any broker works, system tested with Mosquitto)](https://mosquitto.org/download/)

[Postgres Database (version doesn't matter)](https://www.postgresql.org/download/)  
[*Database Schema for Postgres Database*](https://pastebin.com/mi05AAhe)

[SFTP Server (any kind works, system tested with OpenSSH)](https://winscp.net/eng/docs/guide_windows_openssh_server)
### Security Certificates
Certificates for MQTT (CA, Client Certificate and Client Key)  
[Tutorial for setting up Mosquitto with TLS encryption](http://www.steves-internet-guide.com/mosquitto-tls/)

Certificates for Postgres (only the Client Certificate and Key are needed for this)  
[Tutorial for setting up Postgres with TLS encryption](https://www.postgresql.org/docs/10/ssl-tcp.html)

*If you don't want to use certificates, you can remove the certificate loading code from mqtt_connector and database_connector*

## Setup

1. Clone the Git into an empty folder.

2. Run the command 'npm install'. This will install all needed dependencies.

3. Make a copy of the .sample-env file, and rename it to .env.
   - Fill in all of the variables, the .sample-env file explains what needs to be filled into every variable.

4. Start the Postgres, MQTT and SFTP servers.

5. Run the program with Node JS. (The command for that is: 'node ./bin/www')
