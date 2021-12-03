const express = require('express');
const app = express();
const path = require('path');
const util = require('util');
const dotenv = require('dotenv').config();
const port = process.env.DEV_PORT;
const bodyParser = require('body-parser');
app.use(bodyParser.json());

const { Configuration, PlaidApi, PlaidEnvironments, Products, CountryCode } = require('plaid');
// const plaid = require('plaid');

// const plaidClient = new plaid.PlaidApi({
//     clientId: process.env.CLIENT_ID,
//     secret: process.env.SECRET,
//     env: plaid.PlaidEnvironments.sandbox
// });

const configuration = new Configuration({
  basePath: PlaidEnvironments[process.env.PLAID_ENV],
      baseOptions: {
        headers: {
          'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID,
          'PLAID-SECRET': process.env.PLAID_SECRET,
        },
      },
    });
const client = new PlaidApi(configuration);

// const client = new plaid.Client({
//     clientID: process.env.PLAID_CLIENT_ID,
//     secret: process.env.PLAID_SECRET,
//     env: plaid.environments.sandbox,
//     });


app.get('/create-link-token', async (req, res) => {
    const { data: {link_token: linkToken }} = await client.linkTokenCreate({
        user: {
            client_user_id: 'unique-id'
        },
        client_name: 'Napoleons Plaid Test',
        products: [Products.Auth],
        country_codes: [CountryCode.Us],
        language: 'en'
    });

    res.json({ linkToken });
});

app.post('/token-exchange', async (req, res) => {
    console.log("TOKEN EXHCNAGED RAN")
    const { publicToken } = req.body;
    const { access_token: accessToken } = await client.exchangePublicToken(publicToken);

    const authResponse = await client.getAuth(accessToken);
    console.log('---------------------')
    console.log('AUTH RES: ')
    console.log(util.inspect(authResponse, false, null, true));

    const identityResponse = await client.getIdentity(accessToken);
    console.log('---------------------')
    console.log('AUTH RES: ')
    console.log(util.inspect(identityResponse, false, null, true));

    const balanceResponse = await client.getBalance(accessToken);
    console.log('---------------------')
    console.log('AUTH RES: ')
    console.log(util.inspect(balanceResponse, false, null, true));

    res.sendStatus(200);
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});
