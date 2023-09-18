const BigNumber = require('bignumber.js');
const { userFromJSON } = require('opensea-js/lib/utils/utils');
const qs = require('qs');
const web3 = require('web3');
let exchanges = require('./exchanges.json')
let arbitrum = require('./arbitrum.json');
let avalanche = require('./avalanche.json');
let bsc = require('./bsc.json');
let celo = require('./celo.json');
let mainnet = require('./ethereum.json');
let fantom = require('./fantom.json');
let goerli = require('./goerli.json');
let mumbai = require('./mumbai.json');
let optimism = require('./optimism.json');
let polygon = require('./polygon.json');

let chains = require('./chains.json');

let chainExplorer;
let chainsList = [mainnet, arbitrum, optimism, polygon, bsc, fantom, celo, avalanche, goerli, mumbai]
let tokenListJSON = mainnet;
let currentTrade = {};
let currentChain;
let currentSelectSide;
let tokens;
let clickedToAmount;
let clickedfromAmount;
let isTokenHere
let mainnetUrl = "https://api.0x.org/"
let fromBalanceToImport;
let toBalanceToImport;
let ethInfo;
let usdcInfo;
let ethUsdcPrice;
let fromUsdValue;
let gasPrice;
let gasWei;
let gasCost;
let floatSlippage;
let currentExchange;
let removedExhcanges = [];

const arberc20abi = [{"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"},{"indexed":false,"internalType":"bytes","name":"data","type":"bytes"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[],"name":"DOMAIN_SEPARATOR","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"bridgeBurn","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"bridgeMint","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"subtractedValue","type":"uint256"}],"name":"decreaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"deposit","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"depositTo","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"addedValue","type":"uint256"}],"name":"increaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"_name","type":"string"},{"internalType":"string","name":"_symbol","type":"string"},{"internalType":"uint8","name":"_decimals","type":"uint8"},{"internalType":"address","name":"_l2Gateway","type":"address"},{"internalType":"address","name":"_l1Address","type":"address"}],"name":"initialize","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"l1Address","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"l2Gateway","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"nonces","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"},{"internalType":"uint256","name":"deadline","type":"uint256"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"permit","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_to","type":"address"},{"internalType":"uint256","name":"_value","type":"uint256"},{"internalType":"bytes","name":"_data","type":"bytes"}],"name":"transferAndCall","outputs":[{"internalType":"bool","name":"success","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"withdraw","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"withdrawTo","outputs":[],"stateMutability":"nonpayable","type":"function"},{"stateMutability":"payable","type":"receive"}]
const erc20abi = [{ "inputs": [ { "internalType": "string", "name": "name", "type": "string" }, { "internalType": "string", "name": "symbol", "type": "string" }, { "internalType": "uint256", "name": "max_supply", "type": "uint256" } ], "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "owner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "spender", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" } ], "name": "Approval", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "from", "type": "address" }, { "indexed": true, "internalType": "address", "name": "to", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" } ], "name": "Transfer", "type": "event" }, { "inputs": [ { "internalType": "address", "name": "owner", "type": "address" }, { "internalType": "address", "name": "spender", "type": "address" } ], "name": "allowance", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" } ], "name": "approve", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "account", "type": "address" } ], "name": "balanceOf", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "amount", "type": "uint256" } ], "name": "burn", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "account", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" } ], "name": "burnFrom", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "decimals", "outputs": [ { "internalType": "uint8", "name": "", "type": "uint8" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "subtractedValue", "type": "uint256" } ], "name": "decreaseAllowance", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "addedValue", "type": "uint256" } ], "name": "increaseAllowance", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "name", "outputs": [ { "internalType": "string", "name": "", "type": "string" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "symbol", "outputs": [ { "internalType": "string", "name": "", "type": "string" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "totalSupply", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "recipient", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" } ], "name": "transfer", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "sender", "type": "address" }, { "internalType": "address", "name": "recipient", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" } ], "name": "transferFrom", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "nonpayable", "type": "function" }]
const optimism20abi = [{"inputs":[{"indexed":true,"internalType":"address","name":"src","type":"address"},{"indexed":true,"internalType":"address","name":"guy","type":"address"},{"indexed":false,"internalType":"uint256","name":"wad","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"dst","type":"address"},{"indexed":false,"internalType":"uint256","name":"wad","type":"uint256"}],"name":"Deposit","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"src","type":"address"},{"indexed":true,"internalType":"address","name":"dst","type":"address"},{"indexed":false,"internalType":"uint256","name":"wad","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"src","type":"address"},{"indexed":false,"internalType":"uint256","name":"wad","type":"uint256"}],"name":"Withdrawal","type":"event"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"constant":true,"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"guy","type":"address"},{"internalType":"uint256","name":"wad","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"deposit","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"dst","type":"address"},{"internalType":"uint256","name":"wad","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"src","type":"address"},{"internalType":"address","name":"dst","type":"address"},{"internalType":"uint256","name":"wad","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"wad","type":"uint256"}],"name":"withdraw","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}]
const polygon20abi = [{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"setParent","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"bytes","name":"sig","type":"bytes"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"bytes32","name":"data","type":"bytes32"},{"internalType":"uint256","name":"expiration","type":"uint256"},{"internalType":"address","name":"to","type":"address"}],"name":"transferWithSig","outputs":[{"internalType":"address","name":"from","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"withdraw","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"user","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"deposit","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"_childChain","type":"address"},{"internalType":"address","name":"_token","type":"address"}],"name":"initialize","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"parent","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"parentOwner","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"renounceOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"currentSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"bytes32","name":"hash","type":"bytes32"},{"internalType":"bytes","name":"sig","type":"bytes"}],"name":"ecrecovery","outputs":[{"internalType":"address","name":"result","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"isOwner","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"networkId","outputs":[{"internalType":"bytes","name":"","type":"bytes"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[],"name":"EIP712_TOKEN_TRANSFER_ORDER_SCHEMA_HASH","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"name":"disabledHashes","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"tokenIdOrAmount","type":"uint256"},{"internalType":"bytes32","name":"data","type":"bytes32"},{"internalType":"uint256","name":"expiration","type":"uint256"}],"name":"getTokenTransferOrderHash","outputs":[{"internalType":"bytes32","name":"orderHash","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"CHAINID","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"EIP712_DOMAIN_HASH","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"EIP712_DOMAIN_SCHEMA_HASH","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"token","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"token","type":"address"},{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"input1","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"output1","type":"uint256"}],"name":"Deposit","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"token","type":"address"},{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"input1","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"output1","type":"uint256"}],"name":"Withdraw","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"token","type":"address"},{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"input1","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"input2","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"output1","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"output2","type":"uint256"}],"name":"LogTransfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"token","type":"address"},{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"input1","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"input2","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"output1","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"output2","type":"uint256"}],"name":"LogFeeTransfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"}]
const bsc20abi = [{"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"guy","type":"address"},{"name":"wad","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"src","type":"address"},{"name":"dst","type":"address"},{"name":"wad","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"wad","type":"uint256"}],"name":"withdraw","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"dst","type":"address"},{"name":"wad","type":"uint256"}],"name":"transfer","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"deposit","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":true,"name":"src","type":"address"},{"indexed":true,"name":"guy","type":"address"},{"indexed":false,"name":"wad","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"src","type":"address"},{"indexed":true,"name":"dst","type":"address"},{"indexed":false,"name":"wad","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"dst","type":"address"},{"indexed":false,"name":"wad","type":"uint256"}],"name":"Deposit","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"src","type":"address"},{"indexed":false,"name":"wad","type":"uint256"}],"name":"Withdrawal","type":"event"}]
const ftm20abi = [{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"account","type":"address"}],"name":"Paused","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"account","type":"address"}],"name":"PauserAdded","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"account","type":"address"}],"name":"PauserRemoved","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"account","type":"address"}],"name":"Unpaused","type":"event"},{"constant":true,"inputs":[],"name":"ERR_INVALID_ZERO_VALUE","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"ERR_NO_ERROR","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"addPauser","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"subtractedValue","type":"uint256"}],"name":"decreaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"deposit","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"addedValue","type":"uint256"}],"name":"increaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"isPauser","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"pause","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"paused","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"renouncePauser","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"unpause","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"withdraw","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"}]
const celo20abi = [{"inputs":[{"internalType":"bool","name":"test","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"factor","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"lastUpdated","type":"uint256"}],"name":"InflationFactorUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"rate","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"updatePeriod","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"lastUpdated","type":"uint256"}],"name":"InflationParametersUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"registryAddress","type":"address"}],"name":"RegistrySet","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"string","name":"comment","type":"string"}],"name":"TransferComment","type":"event"},{"constant":true,"inputs":[{"internalType":"address","name":"accountOwner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"accountOwner","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"value","type":"uint256"}],"name":"burn","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"bytes","name":"blsKey","type":"bytes"},{"internalType":"bytes","name":"blsPop","type":"bytes"}],"name":"checkProofOfPossession","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"feeRecipient","type":"address"},{"internalType":"address","name":"gatewayFeeRecipient","type":"address"},{"internalType":"address","name":"communityFund","type":"address"},{"internalType":"uint256","name":"refund","type":"uint256"},{"internalType":"uint256","name":"tipTxFee","type":"uint256"},{"internalType":"uint256","name":"gatewayFee","type":"uint256"},{"internalType":"uint256","name":"baseTxFee","type":"uint256"}],"name":"creditGasFees","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"debitGasFees","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"decreaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"internalType":"uint256","name":"aNumerator","type":"uint256"},{"internalType":"uint256","name":"aDenominator","type":"uint256"},{"internalType":"uint256","name":"bNumerator","type":"uint256"},{"internalType":"uint256","name":"bDenominator","type":"uint256"},{"internalType":"uint256","name":"exponent","type":"uint256"},{"internalType":"uint256","name":"_decimals","type":"uint256"}],"name":"fractionMulExp","outputs":[{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"bytes","name":"header","type":"bytes"}],"name":"getBlockNumberFromHeader","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getEpochNumber","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"uint256","name":"blockNumber","type":"uint256"}],"name":"getEpochNumberOfBlock","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getEpochSize","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getExchangeRegistryId","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getInflationParameters","outputs":[{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"uint256","name":"blockNumber","type":"uint256"}],"name":"getParentSealBitmap","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"bytes","name":"header","type":"bytes"}],"name":"getVerifiedSealBitmapFromHeader","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getVersionNumber","outputs":[{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"pure","type":"function"},{"constant":true,"inputs":[{"internalType":"bytes","name":"header","type":"bytes"}],"name":"hashHeader","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"increaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"string","name":"_name","type":"string"},{"internalType":"string","name":"_symbol","type":"string"},{"internalType":"uint8","name":"_decimals","type":"uint8"},{"internalType":"address","name":"registryAddress","type":"address"},{"internalType":"uint256","name":"inflationRate","type":"uint256"},{"internalType":"uint256","name":"inflationFactorUpdatePeriod","type":"uint256"},{"internalType":"address[]","name":"initialBalanceAddresses","type":"address[]"},{"internalType":"uint256[]","name":"initialBalanceValues","type":"uint256[]"},{"internalType":"string","name":"exchangeIdentifier","type":"string"}],"name":"initialize","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"initialized","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"isOwner","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"uint256","name":"blockNumber","type":"uint256"}],"name":"minQuorumSize","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"minQuorumSizeInCurrentSet","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"mint","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"numberValidatorsInCurrentSet","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"uint256","name":"blockNumber","type":"uint256"}],"name":"numberValidatorsInSet","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"registry","outputs":[{"internalType":"contract IRegistry","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"renounceOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"rate","type":"uint256"},{"internalType":"uint256","name":"updatePeriod","type":"uint256"}],"name":"setInflationParameters","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"registryAddress","type":"address"}],"name":"setRegistry","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"},{"internalType":"string","name":"comment","type":"string"}],"name":"transferWithComment","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"internalType":"uint256","name":"units","type":"uint256"}],"name":"unitsToValue","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"uint256","name":"index","type":"uint256"}],"name":"validatorSignerAddressFromCurrentSet","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"uint256","name":"index","type":"uint256"},{"internalType":"uint256","name":"blockNumber","type":"uint256"}],"name":"validatorSignerAddressFromSet","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"uint256","name":"value","type":"uint256"}],"name":"valueToUnits","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"}]
const avax20abi = [{"inputs":[{"indexed":true,"internalType":"address","name":"src","type":"address"},{"indexed":true,"internalType":"address","name":"guy","type":"address"},{"indexed":false,"internalType":"uint256","name":"wad","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"dst","type":"address"},{"indexed":false,"internalType":"uint256","name":"wad","type":"uint256"}],"name":"Deposit","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"src","type":"address"},{"indexed":true,"internalType":"address","name":"dst","type":"address"},{"indexed":false,"internalType":"uint256","name":"wad","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"src","type":"address"},{"indexed":false,"internalType":"uint256","name":"wad","type":"uint256"}],"name":"Withdrawal","type":"event"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"constant":true,"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"guy","type":"address"},{"internalType":"uint256","name":"wad","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"deposit","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"dst","type":"address"},{"internalType":"uint256","name":"wad","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"src","type":"address"},{"internalType":"address","name":"dst","type":"address"},{"internalType":"uint256","name":"wad","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"wad","type":"uint256"}],"name":"withdraw","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}]
const goerli20abi = [{"inputs":[{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"symbol","type":"string"},{"internalType":"uint8","name":"decimals","type":"uint8"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[],"name":"DOMAIN_SEPARATOR","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"EIP712_REVISION","outputs":[{"internalType":"bytes","name":"","type":"bytes"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"PERMIT_TYPEHASH","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"subtractedValue","type":"uint256"}],"name":"decreaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"addedValue","type":"uint256"}],"name":"increaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"mint","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"value","type":"uint256"}],"name":"mint","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"nonces","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"},{"internalType":"uint256","name":"deadline","type":"uint256"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"permit","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"}]
const mumbai20abi = [{"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"},{"name":"_data","type":"bytes"}],"name":"transferAndCall","outputs":[{"name":"success","type":"bool"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_subtractedValue","type":"uint256"}],"name":"decreaseApproval","outputs":[{"name":"success","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"success","type":"bool"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_addedValue","type":"uint256"}],"name":"increaseApproval","outputs":[{"name":"success","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_spender","type":"address"}],"name":"allowance","outputs":[{"name":"remaining","type":"uint256"}],"payable":false,"type":"function"},{"inputs":[],"payable":false,"type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"},{"indexed":false,"name":"data","type":"bytes"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"spender","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Approval","type":"event"}]

let abiList = [erc20abi, arberc20abi, optimism20abi, polygon20abi, bsc20abi, ftm20abi, celo20abi, avax20abi, goerli20abi, mumbai20abi]
let currentAbi = abiList[0]


document.getElementById("chainNameId").textContent = chains[0].name
document.getElementById("chainImageId").src = chains[0].logoURI
currentChain = chains[0]
async function init() {
  connect();
  //if (currentChain.name)
  //tokenListJSON = currentChain.name 
  await listAvailableTokens();
  await listAvailableChains();
  await listExchanges();
  
  //document.getElementById("chainModal").style.display = "block"
  if (document.getElementById("chainNameId").textContent.toLowerCase() === "bsc".toLowerCase()) {
    for (const i in tokens){ 
      if(tokens[i].symbol == "BNB") {
        document.getElementById("from_token_img").src = tokens[i].logoURI;
        document.getElementById("from_token_text").innerHTML = tokens[i].symbol;
        currentTrade["from"] = tokens[i]
        ethInfo = tokens[i]
      };
      if(tokens[i].symbol == "USDC"){
        document.getElementById("to_token_img").src = tokens[i].logoURI;
        document.getElementById("to_token_text").innerHTML = tokens[i].symbol;
        currentTrade["to"] = tokens[i]
        usdcInfo = tokens[i]
      };
    };
  }
  if (document.getElementById("chainNameId").textContent.toLowerCase() === "celo".toLowerCase()) {
    for (const i in tokens){ 
      if(tokens[i].symbol == "CELO") {
        console.log("Asdasdasd", tokens[i].symbol)
        document.getElementById("from_token_img").src = tokens[i].logoURI;
        document.getElementById("from_token_text").innerHTML = tokens[i].symbol;
        currentTrade["from"] = tokens[i]
        ethInfo = tokens[i]
      };
      if(tokens[i].symbol == "USDC"){
        document.getElementById("to_token_img").src = tokens[i].logoURI;
        document.getElementById("to_token_text").innerHTML = tokens[i].symbol;
        currentTrade["to"] = tokens[i]
        usdcInfo = tokens[i]
      };
    
    };
  }
  if (document.getElementById("chainNameId").textContent.toLowerCase() === "Fantom".toLowerCase()) {
    for (const i in tokens){ 
      if(tokens[i].symbol == "FTM") {
        document.getElementById("from_token_img").src = tokens[i].logoURI;
        document.getElementById("from_token_text").innerHTML = tokens[i].symbol;
        currentTrade["from"] = tokens[i]
        ethInfo = tokens[i]
      };
      if(tokens[i].symbol == "USDC"){
        document.getElementById("to_token_img").src = tokens[i].logoURI;
        document.getElementById("to_token_text").innerHTML = tokens[i].symbol;
        currentTrade["to"] = tokens[i]
        usdcInfo = tokens[i]
      };
    
    };
  }
  if (document.getElementById("chainNameId").textContent.toLowerCase() === "Polygon".toLowerCase() || document.getElementById("chainNameId").textContent.toLowerCase() === "Mumbai".toLowerCase()) {
    for (const i in tokens){ 
      if(tokens[i].symbol == "MATIC") {
        document.getElementById("from_token_img").src = tokens[i].logoURI;
        document.getElementById("from_token_text").innerHTML = tokens[i].symbol;
        currentTrade["from"] = tokens[i]
        ethInfo = tokens[i]
      };
      if(tokens[i].symbol == "USDC"){
        document.getElementById("to_token_img").src = tokens[i].logoURI;
        document.getElementById("to_token_text").innerHTML = tokens[i].symbol;
        currentTrade["to"] = tokens[i]
        usdcInfo = tokens[i]
      };
    };
  }

  if (document.getElementById("chainNameId").textContent.toLowerCase() === "Avalanche".toLowerCase()) {
    for (const i in tokens){ 
      if(tokens[i].symbol == "AVAX") {
        document.getElementById("from_token_img").src = tokens[i].logoURI;
        document.getElementById("from_token_text").innerHTML = tokens[i].symbol;
        currentTrade["from"] = tokens[i]
        ethInfo = tokens[i]
      };
      if(tokens[i].symbol == "USDC"){
        document.getElementById("to_token_img").src = tokens[i].logoURI;
        document.getElementById("to_token_text").innerHTML = tokens[i].symbol;
        currentTrade["to"] = tokens[i]
        usdcInfo = tokens[i]
      };
    };
  }

  if (document.getElementById("chainNameId").textContent.toLowerCase() === "goerli".toLowerCase()) {
    for (const i in tokens){ 
      if(tokens[i].symbol == "WETH") {
        document.getElementById("from_token_img").src = tokens[i].logoURI;
        document.getElementById("from_token_text").innerHTML = tokens[i].symbol;
        currentTrade["from"] = tokens[i]
        ethInfo = tokens[i]
      };
      if(tokens[i].symbol == "UNI"){
        document.getElementById("to_token_img").src = tokens[i].logoURI;
        document.getElementById("to_token_text").innerHTML = tokens[i].symbol;
        currentTrade["to"] = tokens[i]
        usdcInfo = tokens[i]
      };
    };
  }
  
  if (document.getElementById("chainNameId").textContent.toLowerCase() === "arbitrum".toLowerCase() || document.getElementById("chainNameId").textContent.toLowerCase() === "optimism".toLowerCase() || document.getElementById("chainNameId").textContent.toLowerCase() === "mainnet".toLowerCase()) {
    for (const i in tokens){ 
      if(tokens[i].symbol == "ETH") {
        console.log("Asdasdasd", tokens[i].symbol)
        document.getElementById("from_token_img").src = tokens[i].logoURI;
        document.getElementById("from_token_text").innerHTML = tokens[i].symbol;
        currentTrade["from"] = tokens[i]
        ethInfo = tokens[i]
      };
      if(tokens[i].symbol == "USDC"){
        document.getElementById("to_token_img").src = tokens[i].logoURI;
        document.getElementById("to_token_text").innerHTML = tokens[i].symbol;
        currentTrade["to"] = tokens[i]
        usdcInfo = tokens[i]
      };
    };
  };
  getEthUsdRate();
}

function reverseTrade() {
  let fromTokenToReverse = document.getElementById("from_token_text").innerHTML.toUpperCase()
  let toTokenToReverse = document.getElementById("to_token_text").innerHTML.toUpperCase()
  for (const i in tokens){
    if(tokens[i].symbol.toUpperCase() == toTokenToReverse) {
      document.getElementById("from_token_img").src = tokens[i].logoURI;
      document.getElementById("from_token_text").innerHTML = tokens[i].symbol;
      currentTrade["from"] = tokens[i]
    };
    if(tokens[i].symbol.toUpperCase() == fromTokenToReverse) {
      document.getElementById("to_token_img").src = tokens[i].logoURI;
      document.getElementById("to_token_text").innerHTML = tokens[i].symbol;
      currentTrade["to"] = tokens[i]
    };
  };
  getWalletBalance();
};

async function listAvailableChains() {
  let chainsParent = document.getElementById("chainList");
  for (const i in chains){
      // Token row in the modal token list
      let div = document.createElement("div");
      div.className = `chain_row${i}`;
      let html = `
      <img class="chain_list_img" src="${chains[i].logoURI}">
        <span class="chain_list_text">${chains[i].name} </span>
        `;
      div.innerHTML = html;
      div.onclick = () => {
        selectChain(chains[i]);
      };
      chainsParent.appendChild(div);
  };
}

async function listExchanges() {
  let exchangesParent = document.getElementById("exchangesList");
  for (const i in exchanges){
      // Token row in the modal token list
      let div = document.createElement("div");
      div.className = `exchange_row`;
      div.id = `exchange_row`
      let html = `
      <span id=${exchanges[i].name}Text class="exchange_list_text">${exchanges[i].name} <input class="exchangeCheckbox" id=${exchanges[i].name}Input type="checkbox" checked></span>
      `;
      div.innerHTML = html;
      div.onclick = () => {
        selectExchange(exchanges[i]);
      };
      exchangesParent.appendChild(div);
  };
}

function tokenSearch (value) {
  const childDivs = document.getElementById('token_list').getElementsByTagName('div');
  for ( i=0; i< childDivs.length; i++ ) {
    const childDiv = childDivs[i];
    childDiv.style.display = "none";
  }
  listAvailableTokens()
  for ( i=0; i< childDivs.length; i++ ) {
    const childDiv = childDivs[i];
    var childDivElement = childDiv.getElementsByClassName('token_list_text')
    var childDivElementInner = childDivElement[0].innerHTML.toLowerCase();
    const isVisible = childDivElementInner.includes(value)
    if (!isVisible) {
      childDiv.style.display = "none";
      //childDiv.style.visibility = "hidden";
    }
  
    //if (isVisible) {
    //  console.log(childDiv)
    //  childDivs.appendChild(childDivs.childDiv);
    //  //childDiv.style.visibility = "visible";
    //}
    //console.log(childDiv.innerHTML)
  };

  if (value.length === 42) {
    document.getElementById("selectNewToken").style.display = "none";
    findToken(addressToSearch=value);
  };
};

async function listAvailableTokens(){
  console.log("initializing");
  //let response = await fetch('https://raw.githubusercontent.com/sushiswap/list/master/lists/token-lists/default-token-list/tokens/ethereum.json');
  //let tokenListJSON = await response.json();
  console.log("listing available tokens: ", tokenListJSON);
  tokens = tokenListJSON;
  console.log("tokens: ", tokens);

  // Create token list for modal
  let parent = document.getElementById("token_list");
  for (const i in tokens){
      // Token row in the modal token list
      let div = document.createElement("div");
      div.className = "token_row";
      let html = `
      <img class="token_list_img" src="${tokens[i].logoURI}">
        <span class="token_list_text">${tokens[i].symbol} </span>
        `;
      div.innerHTML = html;
      div.onclick = () => {
          selectToken(tokens[i]);
          getWalletBalance();
      };
      parent.appendChild(div);
  };
}

async function selectExchange (exchange) {
  currentExchange = exchange;
  console.log("Current Exchange:", currentExchange)
  renderExchangeInterface();
}

function renderExchangeInterface() {
  if (document.getElementById(`${currentExchange.name}Input`).checked === true) {
    document.getElementById(`${currentExchange.name}Input`).checked = false;
  }
  else {
    document.getElementById(`${currentExchange.name}Input`).checked = true;
  }
  if (document.getElementById(`${currentExchange.name}Input`).checked === false) {
    removedExhcanges.push(currentExchange.name)
  }
  if (document.getElementById(`${currentExchange.name}Input`).checked === true) {
    function arrayRemove(arr, value) { 
      return arr.filter(function(ele){ 
          return ele != value; 
      });
  }
  removedExhcanges = arrayRemove(removedExhcanges, currentExchange.name);
  }
}

async function selectToken(token){
  closeModal();
  currentTrade[currentSelectSide] = token;
  console.log("currentTrade: ", currentTrade);
  renderInterface();
}
async function selectChain(chain){
  await connect();
  closeChainModal();
  currentChain = chain;
  console.log("currentChain: ", currentChain);
  renderChainInterface();
  for (i in chains) {
    if (document.getElementById("chainNameId").textContent.toLowerCase() === chains[i].name.toLowerCase()) {
      tokenListJSON = chainsList[i]
      currentAbi = abiList[i]
      if (document.getElementById("chainNameId").textContent.toLowerCase() !== "mainnet") {
        mainnetUrl = `https://${document.getElementById("chainNameId").textContent.toLowerCase()}.api.0x.org/`
      }
      else {
        mainnetUrl = "https://api.0x.org/"
      }
    };
  };
  const clearChains = document.getElementById("chainList");
  clearChains.replaceChildren();
  const clearTokens = document.getElementById("token_list");
  clearTokens.replaceChildren();
  init();
}

function renderChainInterface() {
  document.getElementById("chainNameId").textContent = currentChain.name;
  document.getElementById("chainImageId").src = currentChain.logoURI;
}

function renderInterface(){
  if (currentTrade.from){
      console.log(currentTrade.from)
      document.getElementById("from_token_img").src = currentTrade.from.logoURI;
      document.getElementById("from_token_text").innerHTML = currentTrade.from.symbol;
  }
  if (currentTrade.to){
      console.log(currentTrade.to)
      document.getElementById("to_token_img").src = currentTrade.to.logoURI;
      document.getElementById("to_token_text").innerHTML = currentTrade.to.symbol;
  }
}

async function connect() {
  if (typeof window.ethereum !== "undefined") {
    for (const i in chains) {
      if (document.getElementById("chainNameId").textContent.toLowerCase() === chains[i].name.toLowerCase()) {
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: chains[i].chainId }],
          });
        } catch (error) {
          if (error.code === 4902) {
            console.log(error)
            try {
              await window.ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [
                  {
                    chainId: chains[i].chainId,
                    chainName: chains[i].chainName,
                    nativeCurrency: {
                      name: chains[i].name,
                      symbol: chains[i].symbol, // 2-6 characters long
                      decimals: chains[i].decimals
                    },
                    blockExplorerUrls: [chains[i].blockExplorerUrls],
                    rpcUrls: [chains[i].rpcUrls],
                  },
                ],
              });
            } catch (error) {
              console.log(error)
            }
          }
        }
      };
    };
      try {
        console.log("connecting");
        await ethereum.request({ method: "eth_requestAccounts" });
      } catch (error) {
        console.log(error);
      }
      
      let accounts = await ethereum.request({ method: "eth_accounts" });
      let takerAddress = accounts[0];
      document.getElementById("login_button").innerHTML = `${takerAddress.substring(0, 5)}...${takerAddress.substring(38, 42)}`;
      document.getElementById("swap_button").disabled = false;
      await getWalletBalance();
      
  } 
  else {
    document.getElementById("login_button").innerHTML =
      "Please install MetaMask";
  };
}
  


async function openModal(side){
  currentSelectSide = side;
  document.getElementById("token_modal").style.display = "block";
}
async function openChainModal(){
  if(document.getElementById("chainModal").style.display === "block") {
    document.getElementById("chainModal").style.display = "none";
  }
  else {
    document.getElementById("chainModal").style.display = "block";
  }
  
}
async function openSettingsModal(){
  document.getElementById("settingsModal").style.display = "block";
}
async function openExchagesModal(){
  if (document.getElementById("exchangesModal").style.display === "block") {
    document.getElementById("exchangesModal").style.display = "none";
  }
  else {
    document.getElementById("exchangesModal").style.display = "block";
  }
}
async function closeExchagesModal(){
  document.getElementById("exchangesModal").style.display = "none";
}
async function closeModal(){
  document.getElementById("token_modal").style.display = "none";
  document.getElementById("chainModal").style.display = "none";
  document.getElementById("findtoken_modal").style.display = "none";
  document.getElementById("settingsModal").style.display = "none";
  document.getElementById("receiptBackground").style.display = "none";
}
async function closeChainModal(){
  document.getElementById("chainModal").style.display = "none";
}
async function closeFoundTokenModal(){
  document.getElementById("findtoken_modal").style.display = "none";
}
document.getElementById("to_amount").onclick = () => {
  clickedToAmount = true;
  clickedfromAmount = false;
  getEthUsdRate();

};
document.getElementById("from_amount").onclick = () => {
  clickedToAmount = false;
  clickedfromAmount = true;
  getEthUsdRate();
  
};

function txSummary () {
  chainExplorer = currentChain.blockExplorerUrls
  let txId = document.getElementById("receiptTokenSymbol").innerHTML;
  window.open(`${chainExplorer}/tx/${txId}`, '_blank');
}

async function getEthUsdRate() {
  const ethPriceParams = {
    sellToken: ethInfo.address,
    buyToken: usdcInfo.address,
    sellAmount: 1000000000000000000,
    slippagePercentage:0.01,
  }

const ethPriceResponse = await fetch(`${mainnetUrl}swap/v1/price?${qs.stringify(ethPriceParams)}`);

ethPriceJson = await ethPriceResponse.json();
console.log("Price: ", ethPriceJson);
ethUsdcPrice = parseFloat(ethPriceJson.buyTokenToEthRate)
};

async function getPrice(){ 
  console.log("Getting Price", !currentTrade.from, !currentTrade.to, !document.getElementById("from_amount").value, clickedToAmount);
  

  if (!currentTrade.from || !currentTrade.to || !document.getElementById("from_amount").value || clickedToAmount) {
    console.log("1")
    if (!currentTrade.from || !currentTrade.to || document.getElementById("to_amount").value) {
      let toAmount = Number(document.getElementById("to_amount").value * 10 ** currentTrade.to.decimals).toLocaleString('fullwide', {useGrouping:false});
      console.log(toAmount)

      
      const params = {
        sellToken: currentTrade.to.address,
        buyToken: currentTrade.from.address,
        sellAmount: toAmount,
        slippagePercentage:1,
    }
  
    // Fetch the swap price.
    
  
    const response = await fetch(`${mainnetUrl}swap/v1/price?${qs.stringify(params)}`);
    
    swapPriceJSON = await response.json();
    console.log("Price: ", swapPriceJSON);
    floatSlippage = parseFloat(swapPriceJSON.expectedSlippage);

    toUsdValue = ethUsdcPrice / parseFloat(swapPriceJSON.sellTokenToEthRate) * parseFloat(document.getElementById("to_amount").value)
    document.getElementById("toDollarVal").innerHTML = `$${toUsdValue.toFixed(2)} (%${(floatSlippage * 100).toFixed(2)})`;

    document.getElementById("from_amount").value = swapPriceJSON.buyAmount / (10 ** currentTrade.from.decimals);

    gasPrice = web3.utils.fromWei(swapPriceJSON.gasPrice, 'gwei');
    gasWei = `${(parseFloat(gasPrice) * parseFloat(swapPriceJSON.gas)).toFixed(0)}000000000`;
    gasCost = ethUsdcPrice * parseFloat(web3.utils.fromWei(gasWei, 'ether')) ;
    document.getElementById("gas_estimate").innerHTML = `$${gasCost.toFixed(2)}`;
    fromUsdValue = ethUsdcPrice / parseFloat(swapPriceJSON.buyTokenToEthRate) * parseFloat(document.getElementById("from_amount").value);
    document.getElementById("fromDollarVal").innerHTML = `$${fromUsdValue.toFixed(2)}`;

    return swapPriceJSON;
    }
    else {
      return;
    }
  };
  console.log("3")
  let amount = Number(document.getElementById("from_amount").value * 10 ** currentTrade.from.decimals).toLocaleString('fullwide', {useGrouping:false});
  console.log(amount)

  console.log("hmmm", typeof amount)
  const params = {
      sellToken: currentTrade.from.address,
      buyToken: currentTrade.to.address,
      sellAmount: amount,
      slippagePercentage:1,

  }

  // Fetch the swap price.

  const response = await fetch(`${mainnetUrl}swap/v1/price?${qs.stringify(params)}`);
  
  swapPriceJSON = await response.json();
  console.log("Price: ", swapPriceJSON);

  fromUsdValue = ethUsdcPrice / parseFloat(swapPriceJSON.sellTokenToEthRate) * parseFloat(document.getElementById("from_amount").value)
  document.getElementById("fromDollarVal").innerHTML = `$${fromUsdValue.toFixed(2)}`;
  console.log(fromUsdValue)
  document.getElementById("to_amount").value = swapPriceJSON.buyAmount / (10 ** currentTrade.to.decimals);

  gasPrice = web3.utils.fromWei(swapPriceJSON.gasPrice, 'gwei');
  gasWei = `${(parseFloat(gasPrice) * parseFloat(swapPriceJSON.gas)).toFixed(0)}000000000`;

  gasCost = ethUsdcPrice * parseFloat(web3.utils.fromWei(gasWei, 'ether'));
  document.getElementById("gas_estimate").innerHTML = `$${gasCost.toFixed(2)}`;
  floatSlippage = parseFloat(swapPriceJSON.expectedSlippage);
  toUsdValue = ethUsdcPrice / parseFloat(swapPriceJSON.buyTokenToEthRate) * parseFloat(document.getElementById("to_amount").value);
  document.getElementById("toDollarVal").innerHTML = `$${toUsdValue.toFixed(2)} (%${(floatSlippage * 100).toFixed(2)})`;
  
  return swapPriceJSON;
}

async function getQuote(account){
  console.log("Getting Quote");
  if (!currentTrade.from || !currentTrade.to || !document.getElementById("from_amount").value) return;
  let amount = Number(document.getElementById("from_amount").value * 10 ** currentTrade.from.decimals);
  let params = {
    sellToken: currentTrade.from.address,
    buyToken: currentTrade.to.address,
    sellAmount: amount,
    takerAddress: account,
  }

  console.log("ASdasdasd", document.getElementById("gasInput").value === "" && "ASdasdasd", document.getElementById("slippageInput").value === "")
  if (document.getElementById("gasInput").value === "" && document.getElementById("slippageInput").value === "") {
    console.log("BOTH EMPTY")
    params = {
    sellToken: currentTrade.from.address,
    buyToken: currentTrade.to.address,
    sellAmount: amount,
    takerAddress: account,
    }
  }
  if (document.getElementById("gasInput").value !== "" && document.getElementById("slippageInput").value !== "") {
    console.log("Both Filled")
    let slippagePercent = document.getElementById("slippageInput").value / 100
    params = {
    sellToken: currentTrade.from.address,
    buyToken: currentTrade.to.address,
    sellAmount: amount,
    takerAddress: account,
    slippagePercentage: slippagePercent,
    gasPrice: `${document.getElementById("gasInput").value}000000000`
    }
  }
  if (document.getElementById("gasInput").value === "" && document.getElementById("slippageInput").value !== "") {
    console.log("Slippage is filled")
    let slippagePercent = document.getElementById("slippageInput").value / 100
    params = {
    sellToken: currentTrade.from.address,
    buyToken: currentTrade.to.address,
    sellAmount: amount,
    takerAddress: account,
    slippagePercentage: slippagePercent
    }
  }
  if (document.getElementById("gasInput").value !== "" && document.getElementById("slippageInput").value === "") {
    console.log("Gas is filled")
    params = {
    sellToken: currentTrade.from.address,
    buyToken: currentTrade.to.address,
    sellAmount: amount,
    takerAddress: account,
    gasPrice: `${document.getElementById("gasInput").value}000000000`
    }
  }

  if (removedExhcanges.length !== 0) {
    let removeExchange = removedExhcanges.toString();
    params.excludedSources = removeExchange;
  }
  console.log("PARAMETEEEERS",params)
  

  // Fetch the swap quote.
  console.log(params)
  const response = await fetch(`${mainnetUrl}swap/v1/quote?${qs.stringify(params)}`);
  
  swapQuoteJSON = await response.json();
  console.log("Quote: ", swapQuoteJSON);
  
  document.getElementById("to_amount").value = swapQuoteJSON.buyAmount / (10 ** currentTrade.to.decimals);

  return swapQuoteJSON;
}
async function findToken(addressToSearch){
  console.log(addressToSearch)
  const web3 = new Web3(Web3.givenProvider);
  const fromTokenAddress = addressToSearch;
  const ERC20TokenContract = new web3.eth.Contract(currentAbi, fromTokenAddress);
  const getSymbol = await ERC20TokenContract.methods.symbol(
  ).call()
  const getName = await ERC20TokenContract.methods.name(
    ).call()
  const getDecimals = await ERC20TokenContract.methods.decimals(
    ).call()
  console.log("getSymbol", getSymbol)
  
  document.getElementById("findtoken_modal").style.display = "none";
  document.getElementsByClassName("foundTokenName")[0].innerHTML = getName;
  document.getElementsByClassName("foundTokenSymbol")[0].innerHTML = getSymbol;
  for (const i in tokenListJSON){ 
    if(tokenListJSON[i].address.toLowerCase() === addressToSearch.toLowerCase()) {
      document.getElementsByClassName("foundTokenState")[0].innerHTML = "Already Imported";
      document.getElementById("search").value = tokenListJSON[i].symbol;
      tokenSearch(tokenListJSON[i].symbol.toLowerCase());
    }
  };
  if (document.getElementsByClassName("foundTokenState")[0].innerHTML !== "Already Imported") {
    document.getElementById("findtoken_modal").style.display = "block";
    const newToken = {name: getName, symbol: getSymbol, address: addressToSearch, decimals: getDecimals}
    document.getElementById("selectNewToken").style.display = "block";

    document.getElementById("selectNewToken").onclick = () => {
      if (currentSelectSide === "from") {
        currentTrade["from"] = newToken
        console.log(currentTrade.from)
        //document.getElementById("from_token_img").src = currentTrade.from.logoURI;
        document.getElementById("from_token_text").innerHTML = getSymbol;
        document.getElementById("from_token_img").src = "";
        
      //selectToken(tokens[i]);
      };
      if (currentSelectSide === "to") {
        currentTrade["to"] = newToken
        console.log(currentTrade.to)
        //document.getElementById("from_token_img").src = currentTrade.to.logoURI;
        document.getElementById("to_token_text").innerHTML = getSymbol;
        document.getElementById("to_token_img").src = "";
      //selectToken(tokens[i]);
      };
      document.getElementById("findtoken_modal").style.display = "none";
      closeModal();    
    };
  };
  document.getElementsByClassName("foundTokenState")[0].innerHTML = "";
};

//function getBalance() {
//  const web3 = new Web3(Web3.givenProvider);
//  const fromTokenAddress = currentTrade.from.address;
//  const ERC20TokenContract = new web3.eth.Contract(currentAbi, fromTokenAddress);
//  let accounts = await ethereum.request({ method: "eth_accounts" });
//  let takerAddress = accounts[0];
//  
//}

async function getWalletBalance() {
  const fromTokenDecimal = currentTrade.from.decimals;
  const toTokenDecimal = currentTrade.to.decimals;
  let fromDecimal;
  let toDecimal;
  if (fromTokenDecimal == 18) {
    fromDecimal = "ether"
  }
  if (fromTokenDecimal == 6) {
    fromDecimal = "mwei"
  }
  if (fromTokenDecimal == 9) {
    fromDecimal = "gwei"
  }
  if (toTokenDecimal == 18) {
    toDecimal = "ether"
  }
  if (toTokenDecimal == 6) {
    toDecimal = "mwei"
  }
  if (toTokenDecimal == 9) {
    toDecimal = "gwei"
  }
  const fromTokenAddress = currentTrade.from.address;
  const toTokenAddress = currentTrade.to.address;
  const web3 = new Web3(Web3.givenProvider);
  let accountsBalance = await ethereum.request({ method: "eth_accounts" });
  let takerAddressBalance = accountsBalance[0];

  if (fromTokenAddress.length < 10) {
    const FromBalance = await web3.eth.getBalance(takerAddressBalance)
    const fromBalanceToShow = parseFloat(web3.utils.fromWei(FromBalance, fromDecimal));
    console.log(fromBalanceToShow.toFixed(0).length)
    if(fromBalanceToShow.toFixed(0).length >= 6) {
      document.getElementById("fromTokenBalance").innerHTML = ( `Max: ${fromBalanceToShow.toFixed(0)}`)
    }
    else {
      document.getElementById("fromTokenBalance").innerHTML = ( `Max: ${fromBalanceToShow.toFixed(6)}`)
    }
    fromBalanceToImport = fromBalanceToShow
  }
  if (toTokenAddress.length < 10) {
    const toBalance = await web3.eth.getBalance(takerAddressBalance)
    const toBalanceToShow = parseFloat(web3.utils.fromWei(toBalance, toDecimal));
    if(toBalanceToShow.toFixed(0).length >= 6) {
      document.getElementById("toTokenBalance").innerHTML = ( `Max: ${toBalanceToShow.toFixed(0)}`)
    }
    else {
      document.getElementById("toTokenBalance").innerHTML = ( `Max: ${toBalanceToShow.toFixed(6)}`)
    }
    toBalanceToImport = toBalanceToShow
  }
  if (fromTokenAddress.length > 10) {
    const ERC20FromContract = new web3.eth.Contract(currentAbi, fromTokenAddress);
    let FromBalance = await ERC20FromContract.methods.balanceOf(
        takerAddressBalance
      ).call();
    const fromBalanceToShow = parseFloat(web3.utils.fromWei(FromBalance, fromDecimal));
    if(fromBalanceToShow.toFixed(0).length >= 6) {
      document.getElementById("fromTokenBalance").innerHTML = ( `Max: ${fromBalanceToShow.toFixed(0)}`)
    }
    else {
      document.getElementById("fromTokenBalance").innerHTML = ( `Max: ${fromBalanceToShow.toFixed(6)}`)
    }
    fromBalanceToImport = fromBalanceToShow
  }
  
  if (toTokenAddress.length > 10) {
    const ERC20ToContract = new web3.eth.Contract(currentAbi, toTokenAddress);
    let toBalance = await ERC20ToContract.methods.balanceOf(
      takerAddressBalance
    ).call();
    const toBalanceToShow = parseFloat(web3.utils.fromWei(toBalance, toDecimal));
    if(toBalanceToShow.toFixed(0).length >= 6) {
      document.getElementById("toTokenBalance").innerHTML = ( `Max: ${toBalanceToShow.toFixed(0)}`)
    }
    else {
      document.getElementById("toTokenBalance").innerHTML = ( `Max: ${toBalanceToShow.toFixed(6)}`)
    }
    toBalanceToImport = toBalanceToShow
  }
  
  
  
  
};

function fromMaxTrade() {
  getEthUsdRate();
  toAmountListener.value = ''
  document.getElementById("from_amount").value = fromBalanceToImport
  getPrice();
};
function toMaxTrade() {
  getEthUsdRate();
  fromAmountListener.value = ''
  document.getElementById("to_amount").value = toBalanceToImport
  getPrice();
};

async function trySwap(){
  console.log("trying swap");
  if (currentTrade.from.address.length < 10) {
    const web3 = new Web3(Web3.givenProvider);
    let accounts = await ethereum.request({ method: "eth_accounts" });
    let takerAddress = accounts[0];
    console.log("takerAddress: ", takerAddress);
    const swapQuoteJSON = await getQuote(takerAddress);
    
    const receipt = await web3.eth.sendTransaction(swapQuoteJSON);
    document.getElementById("receiptBackground").style.display = "block";
    document.getElementById("receiptTokenSymbol").innerHTML = receipt["transactionHash"]  
    getWalletBalance();
    console.log("Receipt: ", receipt["transactionHash"])
  }
  else {
    const fromTokenAddress = currentTrade.from.address;

    // Only work if MetaMask is connect
    // Connecting to Ethereum: Metamask
    const web3 = new Web3(Web3.givenProvider);
    //const web3Alchemy = new Web3("https://eth-mainnet.g.alchemy.com/v2/");
    //const fromTokenAddress = currentTrade.from.address;
    const ERC20TokenContract = new web3.eth.Contract(currentAbi, fromTokenAddress);
    //const ERC20TokenContractAlchemy = new web3Alchemy.eth.Contract(erc20abi, fromTokenAddress);  
    // The address, if any, of the most recently used account that the caller is permitted to access
    let accounts = await ethereum.request({ method: "eth_accounts" });
    let takerAddress = accounts[0];
    console.log("takerAddress: ", takerAddress);

    const maxApproval = new BigNumber(2).pow(256).minus(1);
    console.log("approval amount: ", maxApproval);

    const getAllowance = await ERC20TokenContract.methods.allowance(
      takerAddress,
      swapPriceJSON.allowanceTarget
    ).call()

    const balance = await ERC20TokenContract.methods.balanceOf(
      takerAddress
    ).call()
    
    console.log("BALANCE", web3.utils.fromWei(balance, "ether"))

    var floatmaxApproval = parseFloat(maxApproval);
    var floatAllowance = parseFloat(getAllowance);
    console.log("Current Allowance: ", floatAllowance)

    if(floatAllowance < floatmaxApproval) {
      console.log("WE NEEED APPPPROVAL")
      const tx = await ERC20TokenContract.methods.approve(
        swapPriceJSON.allowanceTarget,
        maxApproval,
      ).send({ from: takerAddress }).then(tx => {console.log("tx: ", tx)})
      console.log("allow tx sent jasnmdkasndkasnd")
      
    };
    
    const swapQuoteJSON = await getQuote(takerAddress);

    // Set Token Allowance
    // Set up approval amount
    console.log("setup ERC20TokenContract: ", ERC20TokenContract);

    // Grant the allowance target an allowance to spend our tokens.
    
    // Perform the swap
    //const receipt = await web3.eth.sendTransaction(swapQuoteJSON);
    //console.log("receipt: ", receipt);
    const receipt = await web3.eth.sendTransaction(swapQuoteJSON);
    document.getElementById("receiptBackground").style.display = "block";
    document.getElementById("receiptTokenSymbol").innerHTML = receipt["transactionHash"] 
    getWalletBalance();
    console.log("Receipt: ", receipt)
  }
}
  


const fromAmountListener = document.getElementById("from_amount")
const toAmountListener = document.getElementById("to_amount")
//async function emptyFromAmount(){
//  fromAmountListener.value = '';
//}
//fromAmountListener.onclick = emptyFromAmount;
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    closeModal();
  }
  if (e.key === 'Backspace') {
    if (!fromAmountListener.value || fromAmountListener.value == 0 || toAmountListener.value == "NaN") {
      toAmountListener.value = ''
      document.getElementById("toDollarVal").innerHTML = "$0,00"
    }
    if (!toAmountListener.value || toAmountListener.value == 0 || fromAmountListener.value == "NaN") {
      fromAmountListener.value = ''
      document.getElementById("fromDollarVal").innerHTML = "$0,00"
    }
  };
});

fromAmountListener.addEventListener("input", e => {
  if (!fromAmountListener.value || fromAmountListener.value == 0) {
    toAmountListener.value = ''
    document.getElementById("toDollarVal").innerHTML = "$0,00"
  }
  else {
    getPrice();
  };
});

toAmountListener.addEventListener("input", e => {
  if (!toAmountListener.value || toAmountListener.value == 0) {
    fromAmountListener.value = ''
    document.getElementById("fromDollarVal").innerHTML = "$0,00"
  }
  else {
    getPrice();
  };
});



const searchInput = document.querySelector("[data-search]");
searchInput.addEventListener("input", e => {
  /////ADD CAPS OR NO CAPS FUNCTIONALITY
  tokenSearch(e.target.value.toLowerCase());
    
});


//console.log(childrenDivs);

//searchInput.addEventListener("input", (e) => {
//  const value = e.target.value
//  childrenDivs.forEach(t => {
//    console.log(t)
//    
//  });  
//});

init();
document.getElementById("reverseButton").onclick = reverseTrade;
document.getElementById("chainNameId").onclick = openChainModal;
document.getElementById("chainImageId").onclick = openChainModal;
document.getElementById("login_button").onclick = connect;
document.getElementById("from_token_select").onclick = () => {
  openModal("from");
};
document.getElementById("to_token_select").onclick = () => {
  openModal("to");
};
document.getElementById("modal_close").onclick = closeModal;
//document.getElementById("from_amount").onblur = getPrice;
document.getElementById("swap_button").onclick = trySwap;
document.getElementById("findmodal_close").onclick = closeFoundTokenModal;
document.getElementById("fromTokenBalance").onclick = fromMaxTrade;
document.getElementById("toTokenBalance").onclick = toMaxTrade;
document.getElementById("closeSettings").onclick = closeModal;
document.getElementById("settingsButton").onclick = openSettingsModal;
document.getElementById("exchangesButton").onclick = openExchagesModal;
document.getElementById("closeExchanges").onclick = closeExchagesModal;
document.getElementById("closeTx").onclick = closeModal;
document.getElementById("receiptTokenSymbol").onclick = txSummary;

