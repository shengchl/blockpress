/**
 * This is a simple adapter service because the bitcoin RPC interfaces are awful
 *
 * // Deploy next to a Bitcoin ABC node
 */
var bitcoin = require('bitcoin');
var bch = require('bitcoincashjs');
var bodyParser = require('body-parser');
const bs58 = require('bs58')
var bitcoinjslib = require('bitcoinjs-lib')

var rpc = require('json-rpc2');
// var jsonrpc = require('jsonrpc-tcp');
// var clientrpc = rpc.Client.$create(50010, 'localhost');
var jayson = require('jayson');

// create a client
var clientrpc = jayson.client.tcp({
    // host: 'ip-172-31-46-206.us-west-2.compute.internal',
    host: 'localhost',
    port: 50010
});

// Call add function on the server

var jsonParser = bodyParser.json()
var client = new bitcoin.Client({
    host: 'localhost',
    port: 8332,
    user: 'bpsecretuser',
    pass: 'bps7cret'
});


console.log('Connecting to Electrumx and negotiating server version');
clientrpc.request('server.version', ['bprpc', '1.2'], 'id', function(err, error, result) {
    if (err) {
        console.log('Error starting up', err);
        return;
    }
    console.log('Negotiated', result);
});


const express = require('express');
const app = express();

function hexStringToByte(str) {
    if (!str) {
        return new Uint8Array();
    }
    var a = [];
    for (var i = 0, len = str.length; i < len; i+=2) {
        a.push(parseInt(str.substr(i,2),16));
    }

    return new Uint8Array(a);
}

app.post('/broadcast_tx', jsonParser, (req, res) => {
    console.log('req.params', req.body);
    client.sendRawTransaction(req.body.raw_tx_hex, function(err, data) {
        if (err) {
            console.error(err);
            res.send({success: false, message: "dust"});
            return
        }
        res.send({success: true, raw_tx_broadcasted: req.raw_tx_hex});
    });
});

app.get('/tx/:hash', (req, res) => {
    client.getRawTransaction(req.params.hash, true, function(err, data) {
        if (err) {
            console.error(err);
        }
        res.send(data);
    });
});

app.get('/mempool', (req, res) => {
    client.getRawMemPool(true, function(err, data) {
        if (err) {
            console.error(err);

        }
        res.send(data);
    });
});

app.get('/balances/:address', (req, res) => {
    console.log('/balance/' + req.params.address);
    clientrpc.request('blockchain.address.get_balance', [req.params.address], 'id', function(err, error, result) {
        if (err) {
            console.log('Error', err);
            res.send({
                success: false,
                message: 'server error',
            })
            return;
        }
        res.send(result)
    });
});

app.get('/blockheight', (req, res) => {
    client.getBlockCount(function(err, response) {
        if (err) {
            return console.error(err, response);
        }
        res.send({
            height: response
        });
    });
});

app.get('/listunspent/:address', (req, res) => {
    console.log('/listunspent/' + req.params.address);
    clientrpc.request('blockchain.address.listunspent', [req.params.address], 'id', function(err, error, result) {
        if (err) {
            console.log('Error', err);
            res.send({
                success: false,
                message: 'server error',
            })
            return;
        }
        res.send(result)
    });
});

app.post('/build_and_broadcast_tx', jsonParser, (req, res) => {
    console.log('build_and_broadcast_tx, params: ', Object.assign({}, req.body, {wif: 0}));
    const privateKey = new bch.PrivateKey(req.body.wif);
    const utxo = {
        'txId' : req.body.tx_hash,
        'outputIndex' : req.body.output_index,
        'address' : req.body.output_recipient_address,
        'command': req.body.command,
        'params': req.body.payload,
        'script' : req.body.script_hex,
        'satoshis' : parseInt(req.body.satoshis_in_output)
    };

    // Create OP_RETURN script
    var opReturn = new bch.Script();
    opReturn.add(bch.Opcode.OP_RETURN);
    command = new Buffer(req.body.command, 'hex');
    opReturn.add(command);
    // Prepare to estimate cost of tx
    var byteSizeOutput = 0;
    // Loop through and add all arguments to be encoded in OP_RETURN
    for (var param of req.body.params) {
        opReturn.add(new Buffer(param, 'hex'))
        // Add the total length of buffer and the size byte for fee estimation
        byteSizeOutput += Buffer.byteLength(param) + 1
    }
    // Add the OP_RETURN to the tx
    let transaction = new bch.Transaction().from(utxo);
    transaction.addOutput(new bch.Transaction.Output({
        script: opReturn,
        satoshis: 0
    }));
    console.log('base tx created', transaction.toJSON());
    // Determine whether we need to add outputs based on whether it is a tip or not
    let tip = req.body.tip;
    let address_id_getting_tipped = req.body.address_id_getting_tipped;
    if (tip != 0 && tip != '' && tip != undefined && tip != null && tip <= 500000 &&
        address_id_getting_tipped && address_id_getting_tipped != '') {
        var feeEstimate = 10 + 148*1 + 34*2 + 10 + byteSizeOutput + 3; // 1 extra for safety
        transaction
            .to(req.body.address_id_getting_tipped, tip)
            .to(req.body.output_recipient_address, req.body.satoshis_in_output - tip - feeEstimate)
            .sign(privateKey);

    } else {
        var feeEstimate = 10 + 148*1 + 34*1 + 10 + byteSizeOutput + 3; // 1 extra for safety
        console.log('non-tip tx');
        console.log('10 + 148×n + 34×t + out', feeEstimate, 'byteSizeOutput', byteSizeOutput);

        transaction.to(req.body.output_recipient_address, req.body.satoshis_in_output - feeEstimate).sign(privateKey);
    }

    var obj = {
        success: true,
        tx_hash: transaction.hash,
        input_tx_hash: req.body.tx_hash,
        output_number: req.body.output_index,
        raw_tx: transaction.toString(),
        tx_obj: transaction.toJSON()
    };
    console.log('About to broadcast: ', obj);
    client.sendRawTransaction(transaction.toString(), function(err, data) {
        if (err) {
            console.error('Error', JSON.stringify(err), 'message', err.message, 'code', err.code, req.body.tx_hash, err.code, data);
            res.send({success: false, message: err.message, code: err.code});
            return;
        }
        console.log('Success, Done');
        res.send(obj);
    });
});

app.listen(8081, () => {
    console.log('BitcoinRrpcAdapterService app listening on port 8081!');
});