# LegitBot
I'm just writing here because the github hello world tutorial said so.
^ nice work 🤙

## Installation

#### From Docker
- Install `docker`
- ```
  docker run -dit --name=legit --restart always \
  -e TOKEN=NDYxNjc4XXX2MzMwNDA2OTIy.XXXXX.lkmINsnj7qOvpTTpXXXrWGNWUJg \
  -e DB_SERVER=ip:port -e DB_NAME=legit -e DB_USER=user -e DB_PASS=pass <image>
  ```

#### From Source
- Install `nodejs` v10+
- Clone repository to a local directory
- Create a new file in the project directory called .env with the [contents below](#sample-env) filled accordingly
- Install dependencies: `npm install`
- `npm start`
- Bot should now be connected


#### SAMPLE .ENV:
```
TOKEN=NDYxNjc4XXX2MzMwNDA2OTIy.XXXXX.lkmINsnj7qOvpTTpXXXrWGNWUJg
DB_SERVER=ip:port
DB_NAME=legit
DB_USER=user
DB_PASS=pass
```
