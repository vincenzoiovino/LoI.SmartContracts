var web3, ethereum, wallet;
const CHAIN_ID = 11155111; // Goerli = 5, Sepolia = 11155111
const infuraID = ""; // Your InfuraID

const KEY = "https://sepolia.infura.io/v3/" + infuraID; // infura api key - IN A REAL IMPLEMENTATION THIS SHOULD NOT BE PUBLIC AND SHOULD BE HIDDEN IN THE BACKEND

/*
const WalletConnectProvider = window.WalletConnectProvider.default;
const providerOptions = {
    walletconnect: {
      package: WalletConnectProvider,
      options: {
        infuraId: infuraID,
      }
    },

  };

const Web3Modal = window.Web3Modal.default;

const web3Modal = new Web3Modal({
    cacheProvider: false, // optional
    providerOptions, // required
    disableInjectedProvider: true, // optional. For MetaMask / Brave / Opera.
  });
*/

const MMSDK = new MetaMaskSDK.MetaMaskSDK({
    dappMetadata: {
        name: "AZKR DAPP",
        url: window.location.href
    }
    // Other options.
});

var isMobile;
try {
    isMobile = navigator.userAgentData.mobile;
} catch (err) {
    isMobile = null;
}
web3 = new Web3(new Web3.providers.HttpProvider(KEY, ), );
async function Connect() {
    if (ethereum !== undefined) return;
    if (!isMobile || isMobile == undefined) {
        ethereum = window.ethereum;
        wallet = new Web3(ethereum);
    } else {
        try {
            var _ethereum = await MMSDK.getProvider(); // to use Metamask SDK
            //var _ethereum = await web3Modal.connect();
            //await _ethereum.request({ method: 'eth_requestAccounts' });
            ethereum = _ethereum;
            wallet = new Web3(ethereum);
            //web3 = new Web3(new Web3.providers.HttpProvider(KEY));
            //await window.ethereum.enable();
        } catch (error) {
            document.getElementById("status1").style.color = "red";
            document.getElementById("status1").innerText = "Failed to connect to Metamask: " + error;
            console.error("Failed to connect to MetaMask:", error);

            return;
        }
    }
    document.getElementById("status1").style.color = "green";
    document.getElementById("status1").innerText = "Connected to Metamask";

}
//document.getElementById("connectButton").addEventListener("click", async () => { await Connect(); });
const GOOGLE_CLIENT_ID = "525900358521-qqueujfcj3cth26ci3humunqskjtcm56.apps.googleusercontent.com"; // (google) client id
const FB_CLIENT_ID = "377291984666448"; // (facebook) client id
var CHAIN = "Sepolia";
const API_TINY_URL = "https://tinyurl.com/api-create.php?url=";
const TINYURL_SERVICE = "https://tinyurl.com/";
var API_URL_FOR_TINY = "https://demo.azkr.ch:5002";
const API_URL_FOR_TINY_PATH = "/";
API_URL_FOR_TINY = API_URL_FOR_TINY + API_URL_FOR_TINY_PATH;
const threshold = 2;
const no_nodes = 3;
var t = 0;
var List = [];
List[0] = "1";
List[1] = "https://demo.azkr.ch:8004";
List[2] = "2";
List[3] = "https://demo.azkr.ch:8005";
List[4] = "3";
List[5] = "https://demo.azkr.ch:8006";


const Mpk_hex = "1 2edf2ec65e7af8c70d9af1faad9866ec3eb9cfe58d8545af3ad694a87cc6cbe2 2705c602e4f0319dfb1dfddeb4a7f2daf8c42151b9d03c6417cb92f4325b08db 2ecc7148d0b12657a6550cc535357e7ce71642a8d53786f830a02d89a9527472 2b7916dd9329825d7abbf16569c1f28bde5864bfe4f31dd91aeae475d14e5c76";
// initialize the contract with e.g.:
// [[17650401953877851439635577206110766953856761406923475418003307457561889540315,21200720758627169108385381836933178062103968834651067635052438190446348782562],[19663398795984464822343332592454950952846592629461984989829477392159714729078,21167609696476223494515294740194964327788425825089244977948745836321546859634]]

const contractAnonIBPAddress = "0x79b2231A9104Cbb4c7786910b429991B98eA81d9";
const contractAnonIBPABI = [{
    "inputs": [{
        "internalType": "bytes32",
        "name": "h",
        "type": "bytes32"
    }, {
        "internalType": "bytes8",
        "name": "CT",
        "type": "bytes8"
    }],
    "name": "MakeDeposit",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
}, {
    "inputs": [{
        "internalType": "uint256",
        "name": "Dx",
        "type": "uint256"
    }, {
        "internalType": "uint256",
        "name": "Dy",
        "type": "uint256"
    }, {
        "internalType": "bytes8",
        "name": "CT",
        "type": "bytes8"
    }],
    "name": "MakeDepositFull",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
}, {
    "inputs": [{
        "internalType": "bytes32",
        "name": "h",
        "type": "bytes32"
    }, {
        "internalType": "bytes",
        "name": "x",
        "type": "bytes"
    }],
    "name": "MakeWithdrawal",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "inputs": [{
        "internalType": "uint256",
        "name": "Dx",
        "type": "uint256"
    }, {
        "internalType": "uint256",
        "name": "Dy",
        "type": "uint256"
    }, {
        "internalType": "uint256",
        "name": "Ex",
        "type": "uint256"
    }, {
        "internalType": "uint256",
        "name": "Ey",
        "type": "uint256"
    }, {
        "internalType": "uint256",
        "name": "tokenprimex",
        "type": "uint256"
    }, {
        "internalType": "uint256",
        "name": "tokenprimey",
        "type": "uint256"
    }, {
        "internalType": "uint256",
        "name": "pi_Ax",
        "type": "uint256"
    }, {
        "internalType": "uint256",
        "name": "pi_Ay",
        "type": "uint256"
    }, {
        "internalType": "uint256",
        "name": "pi_z",
        "type": "uint256"
    }],
    "name": "MakeWithdrawalFull",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "inputs": [{
        "components": [{
            "internalType": "uint256[2]",
            "name": "X",
            "type": "uint256[2]"
        }, {
            "internalType": "uint256[2]",
            "name": "Y",
            "type": "uint256[2]"
        }],
        "internalType": "struct BN254.G2",
        "name": "mpk",
        "type": "tuple"
    }],
    "name": "setMPK",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "inputs": [{
        "components": [{
            "internalType": "uint256[2]",
            "name": "X",
            "type": "uint256[2]"
        }, {
            "internalType": "uint256[2]",
            "name": "Y",
            "type": "uint256[2]"
        }],
        "internalType": "struct BN254.G2",
        "name": "mpk",
        "type": "tuple"
    }],
    "stateMutability": "nonpayable",
    "type": "constructor"
}, {
    "inputs": [{
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
    }],
    "name": "deposits",
    "outputs": [{
        "internalType": "uint256",
        "name": "nCoins",
        "type": "uint256"
    }, {
        "internalType": "bytes8",
        "name": "CT",
        "type": "bytes8"
    }],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [{
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
    }],
    "name": "deposits_full",
    "outputs": [{
        "internalType": "uint256",
        "name": "nCoins",
        "type": "uint256"
    }, {
        "internalType": "bytes8",
        "name": "CT",
        "type": "bytes8"
    }, {
        "components": [{
            "internalType": "uint256",
            "name": "X",
            "type": "uint256"
        }, {
            "internalType": "uint256",
            "name": "Y",
            "type": "uint256"
        }],
        "internalType": "struct BN254.G1",
        "name": "D",
        "type": "tuple"
    }, {
        "internalType": "uint256",
        "name": "id",
        "type": "uint256"
    }],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [{
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
    }],
    "name": "deposits_full_index",
    "outputs": [{
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
    }],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [{
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
    }],
    "name": "deposits_index",
    "outputs": [{
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
    }],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [{
        "internalType": "uint256",
        "name": "Dx",
        "type": "uint256"
    }],
    "name": "getCTFromDx",
    "outputs": [{
        "internalType": "bytes8",
        "name": "",
        "type": "bytes8"
    }],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [{
        "internalType": "uint256",
        "name": "id",
        "type": "uint256"
    }],
    "name": "getDxFromId",
    "outputs": [{
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
    }],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [{
        "internalType": "uint256",
        "name": "Dx",
        "type": "uint256"
    }],
    "name": "getDyFromDx",
    "outputs": [{
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
    }],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [],
    "name": "getId",
    "outputs": [{
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
    }],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [{
        "internalType": "uint256",
        "name": "Dx",
        "type": "uint256"
    }],
    "name": "getIdFromDx",
    "outputs": [{
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
    }],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [],
    "name": "getMPK",
    "outputs": [{
        "components": [{
            "internalType": "uint256[2]",
            "name": "X",
            "type": "uint256[2]"
        }, {
            "internalType": "uint256[2]",
            "name": "Y",
            "type": "uint256[2]"
        }],
        "internalType": "struct BN254.G2",
        "name": "mpk",
        "type": "tuple"
    }],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [{
        "internalType": "uint256",
        "name": "Dx",
        "type": "uint256"
    }],
    "name": "getnCoinsFromDx",
    "outputs": [{
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
    }],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [],
    "name": "Id",
    "outputs": [{
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
    }],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [],
    "name": "MPK",
    "outputs": [{
        "components": [{
            "internalType": "uint256[2]",
            "name": "X",
            "type": "uint256[2]"
        }, {
            "internalType": "uint256[2]",
            "name": "Y",
            "type": "uint256[2]"
        }],
        "internalType": "struct BN254.G2",
        "name": "PointG2",
        "type": "tuple"
    }],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [],
    "name": "toString",
    "outputs": [{
        "internalType": "bytes",
        "name": "",
        "type": "bytes"
    }],
    "stateMutability": "view",
    "type": "function"
}];

const last = document.getElementById('status2');
var waitdepositinterval;
var waitwithdrawalinterval;
var Metamask;
const setWaitDeposit = () => {
    setTimeout(() => last.innerHTML = ".", 100);
    setTimeout(() => last.innerHTML = "Pls wait for.", 500);
    setTimeout(() => last.innerHTML = "Pls wait for confirm.", 900);
    setTimeout(() => last.innerHTML = "Pls wait for confirmation..", 1300);
    setTimeout(() => last.innerHTML = "Pls wait for confirmation of deposit...", 1700);
    setTimeout(() => last.innerHTML = "Pls wait for confirmation of deposit and save the identifier...", 2100);

}
const setWaitWithdrawal = () => {
    setTimeout(() => last.innerHTML = ".", 100);
    setTimeout(() => last.innerHTML = "Pls wait for.", 500);
    setTimeout(() => last.innerHTML = "Pls wait for confirm.", 900);
    setTimeout(() => last.innerHTML = "Pls wait for confirmation..", 1300);
    setTimeout(() => last.innerHTML = "Pls wait for confirmation of withdrawal...", 1700);

}

var flag = 0;
var Token = [];
var Mpk;
mcl.init(mcl.BN_SNARK1).then(() => {
    G1Base = G1Base();
    G2Base = G2Base();
    Mpk = new mcl.G2();
    Mpk.setStr(Mpk_hex, 16);
}).catch(function(err) {
    console.error(err.message);
});





const ORDER = 21888242871839275222246405745257275088548364400416034343698204186575808495617n;
const ORDER_Field = 21888242871839275222246405745257275088696311157297823662689037894645226208583n;

function G1Base() {

    var X = new mcl.Fp();
    var Y = new mcl.Fp();
    var Z = new mcl.Fp();
    var P = new mcl.G1();
    X.setStr("0000000000000000000000000000000000000000000000000000000000000001", 16);
    Y.setStr("0000000000000000000000000000000000000000000000000000000000000002", 16);
    Z.setStr("1");
    P.setX(X);
    P.setY(Y);
    P.setZ(Z);
    return P;
}

function G2Base() {

    const x0 = new mcl.Fp()
    const x1 = new mcl.Fp()
    const y0 = new mcl.Fp()
    const y1 = new mcl.Fp()
    const z0 = new mcl.Fp()
    const z1 = new mcl.Fp()
    var X = new mcl.Fp2();
    var Y = new mcl.Fp2();
    var Z = new mcl.Fp2();
    var P = new mcl.G2();
    x1.setStr("198E9393920D483A7260BFB731FB5D25F1AA493335A9E71297E485B7AEF312C2", 16);
    x0.setStr("1800DEEF121F1E76426A00665E5C4479674322D4F75EDADD46DEBD5CD992F6ED", 16);
    y1.setStr("090689D0585FF075EC9E99AD690C3395BC4B313370B38EF355ACDADCD122975B", 16);
    y0.setStr("12C85EA5DB8C6DEB4AAB71808DCB408FE3D1E7690C43D37B4CE6CC0166FA7DAA", 16);
    z0.setInt(1);
    z1.setInt(0);
    X.set_a(x0);
    X.set_b(x1);
    Y.set_a(y0);
    Y.set_b(y1);
    Z.set_a(z0);
    Z.set_b(z1);
    P.setX(X);
    P.setY(Y);
    P.setZ(Z);
    return P;
}

var Ciphertext_Ethereum, D_EthereumX, D_EthereumY, E_EthereumX, E_EthereumY, tokenprime_EthereumX, tokenprime_EthereumY, pi_A_EthereumX, pi_A_EthereumY, pi_z_Ethereum, D_Serialized, Addr;
var nCoinsinput;
var email, Provider, month, year;
var Indices = [];
var Addresses = [];
var pk = [];
var hash = [];
var Q = [];
var lambda = [];
const date_path = "now";
var provider;
const group = "0";
const fetch_friends = "null";
const fetch_anon = "0";
const fetch_ethereum = "1";

async function get_token(access_token, list) {
    for (let i = 0; i < threshold; i++) {
        let k = parseInt(list[i * 2]);
        if (k > no_nodes || k < 1) {
            console.error("error");
            return;
        }
        Indices[i] = list[i * 2];
        Addresses[i] = list[i * 2 + 1];
    }
    t = threshold;
    await get_token_main(threshold, access_token);
}

function hexToBytes(hex) {
    if (typeof hex !== "string")
        throw new Error("hex string expected, got " + typeof hex);
    const len = hex.length;
    if (len % 2)
        throw new Error("padded hex string expected, got unpadded hex of length " + len);
    const array = new Uint8Array(len / 2);
    for (let i = 0; i < array.length; i++) {
        const j = i * 2;
        const hexByte = hex.slice(j, j + 2);
        const byte = Number.parseInt(hexByte, 16);
        if (Number.isNaN(byte) || byte < 0)
            throw new Error("Invalid byte sequence");
        array[i] = byte;
    }
    return array;
}

async function get_token_main(threshold, access_token) {
    var error;
    for (let i = 0; i < threshold; i++) {
        Q[i] = BigInt(Indices[i]);
        error = await fetch(Addresses[i] + "/" + provider + "/" + group + "/" + date_path + "/" + access_token + "/" + fetch_friends + "/" + fetch_anon + "/" + fetch_ethereum, {
            referrerPolicy: "unsafe-url"
        }).then(async function(response) {
            await serverReceipt(i, response);
        }).catch((err) => {
            console.error(err.message);
            swal("Server " + Addresses[i] + " not responding. Try later", {
                icon: "error",
            });
            throw (Addresses[i]);
        });
    }
}

async function serverReceipt(i, response) {
    if (!response.ok) {
        console.error("Server " + Indices[i] + " (" + Addresses[i] + ")" + " response status: " + response.status + ". Try later.");
        return;

    } else {
        await response.text().then(async function(text) {
            console.log("DEBUG: Value received by server " + Indices[i] + " (" + Addresses[i] + "): " + text);
            if (!email) email = String.fromCharCode(...hexToBytes(text.split('..')[2]));
            else if (String.fromCharCode(...hexToBytes(text.split('..')[2])) != email) throw ("Inconsistent values received from different servers");
            if (!month) {
                month = text.split('..')[4];
            } else if (text.split('..')[4] != month) throw ("Inconsistent values received from different servers or invalid parameters");
            if (!year) year = text.split('..')[3];
            else if (text.split('..')[3] != year) throw ("Inconsistent values received from different servers or invalid parameters");
            if (!Provider) Provider = text.split('..')[1];
            else if (text.split('..')[1] != Provider) throw ("Inconsistent values received by different servers or invalid parameters");
            var FrTmp = new mcl.G2();
            FrTmp.setStr(text.split('..')[5], 16);
            pk[Q[i]] = FrTmp;
            FrTmp = new mcl.G1();
            FrTmp.setStr(text.split('..')[6], 16);
            hash[Q[i]] = FrTmp;
            t--;
            if (t == 0) {
                Provider = undefined;
                await Finalize();
            }
        }).catch(function(err) {
            console.error(err);
        });
    }
}




function utf8ToBytes(str) {
    if (typeof str !== "string")
        throw new Error(`utf8ToBytes expected string, got ${typeof str}`);
    return new Uint8Array(new TextEncoder().encode(str));
}




function Finalize() {
    ComputeLagrangeCoefficients(lambda, threshold, Q);
    var tmp = mcl.sub(G2Base, G2Base);
    var tmp2 = mcl.sub(G1Base, G1Base);
    for (let i = 0n; i < threshold; i++) {
        pk[Q[i]] = mcl.mul(pk[Q[i]], lambda[Q[i]]);
        hash[Q[i]] = mcl.mul(hash[Q[i]], lambda[Q[i]]);
        tmp = mcl.add(tmp, pk[Q[i]]);
        tmp2 = mcl.add(tmp2, hash[Q[i]]);
    }
    var mpk, token;
    mpk = new mcl.G2();
    mpk.setStr(tmp.getStr());
    token = new mcl.G1();
    token.setStr(tmp2.getStr());
    console.log("DEBUG: reconstructed master public key: " + mpk.getStr(16));
    console.log("reconstructed master public key as Ethereum tuple: " + "[[" + mpk.getStr(10).split(' ')[2] + "," + mpk.getStr(10).split(' ')[1] + "],[" + mpk.getStr(10).split(' ')[4] + "," + mpk.getStr(10).split(' ')[3] + "]]");
    const id = "LoI.." + provider + ".." + email + ".." + year + ".." + month + ".." + fetch_friends + ".." + fetch_anon + ".." + fetch_ethereum;
    console.log("DEBUG: token is for email: " + email);
    const msg = utf8ToBytes(id);
    const h = hashToCurve(msg);
    const t1 = mcl.pairing(h, mpk);
    const t2 = mcl.pairing(token, G2Base);
    if (!t1.isEqual(t2)) {
        console.error("Verification of reconstructed token: failure.");
        return;
    }
    console.log("DEBUG: reconstructed token: " + token.getStr(16) + " for identity " + id);
    console.log("DEBUG: Verification of reconstructed token: success.");
    Token[provider + "." + email] = token.getStr(16);
    document.getElementById("status2").style.color = "green";
    document.getElementById("status2").innerText = document.getElementById("status2").innerText + "\nYou got your crypto token: [" + Token[provider + "." + email] + "]";
}

function ComputeLagrangeCoefficients(lambda, t, Q) {

    var I, J, tmp, FrTmp, FrTmp2;
    for (let i = 0n; i < t; i++) {
        FrTmp = new mcl.Fr();
        FrTmp.setInt(1);
        tmp = FrTmp;
        I = Q[i];
        for (let j = 0n; j < t; j++) {
            J = Q[j];
            if (j == i) continue;

            FrTmp = new mcl.Fr();
            FrTmp2 = new mcl.Fr();
            FrTmp.setStr((J - I).toString());
            FrTmp2.setStr(J.toString());
            tmp = mcl.mul(mcl.div(FrTmp2, FrTmp), tmp);
        }
        FrTmp = new mcl.Fr();
        FrTmp.setStr(tmp.getStr());
        lambda[Q[i]] = FrTmp;

    }
}


function hashToCurve(id) {
    const fp = nobleCurves.Field(ORDER_Field);
    const derived = nobleHashes.sha256(id);
    var three = fp.create(3n);
    var one = fp.create(1n);
    var x = fp.create(fp.fromBytes(derived));
    var y;
    while (true) {
        y = fp.mul(x, x);
        y = fp.mul(y, x);
        y = fp.add(y, three);
        try {
            y = fp.sqrt(y);
            break;
        } catch (err) {
            x = fp.add(x, one);
        }
    }
    var X = new mcl.Fp();
    var Y = new mcl.Fp();
    var Z = new mcl.Fp();
    var P = new mcl.G1();
    X.setStr(nobleCurves.bytesToHex(fp.toBytes(x)), 16);
    Y.setStr(nobleCurves.bytesToHex(fp.toBytes(y)), 16);
    Z.setStr("1");
    P.setX(X);
    P.setY(Y);
    P.setZ(Z);
    return P;
}


async function checkMetaMaskAvailability() {
    await Connect();
    await ethereum.request({
        method: 'eth_requestAccounts'
    });
    if (ethereum !== undefined) {
        try {
            // Request access to MetaMask accounts
            // await ethereum.request({
            //    method: "eth_requestAccounts"
            // });
            flag = 1;
            await wallet.eth.net.getId().then(netId => {
                if (netId != CHAIN_ID + "") flag = 0;
            })
            if (flag === 0) {
                document.getElementById("status1").style.color = "red";
                document.getElementById("status1").innerText = "Pls connect to Sepolia Network";
                Metamask = "";
                return false;
            }
            document.getElementById("status1").innerText = "Connected to MetaMask (" + CHAIN + " Testnet)";
            Metamask = "Connected to MetaMask (" + CHAIN + " Testnet)";
            document.getElementById("status1").style.color = "green";

            return true;
        } catch (err) {
            document.getElementById("status1").style.color = "red";
            document.getElementById("status1").innerText = "Failed to read infor from Metamask: " + err;
            console.error("Failed to connect to MetaMask:", err);
            Metamask = "";
            return false;
        }
    } else {
        document.getElementById("status1").style.color = "red";
        document.getElementById("status1").innerText = "Metamask not found";
        Metamask = "";
        console.error("MetaMask not found");
        return false;
    }
}

document.getElementById("instructions").addEventListener("click", async () => {
    document.getElementById("status2").style.color = "white";
    document.getElementById("status3").style.color = "yellow";
    document.getElementById("status4").style.color = "white";
    document.getElementById("status5").style.color = "white";
    status2.innerText = "";
    status3.innerText = "";
    status4.innerText = "";
    status5.innerText = "";
    status2.innerHTML = "<h3>💸Deposit💸</h3>Choose a provider (Gmail or Facebook), input the quantity of ether (e.g. 0.0003) and the email or phone number of the receiver in favour of whom you want to make the deposit and click on \"Deposit\".<br>You need to sign the transaction with your wallet and after the transaction is confirmed you will receiver an id number." +
        "<h3>🏧🔍Search for a deposit and withdraw🏧🔍</h3>To withdraw a deposit choose your provider (Gmail or Facebook), input an id number in the corresponding box and click the \"Search for Deposits\" button.<br>You will be asked to log into your Gmail or Facebook account and then you will be told whether there is a deposit corresponding to your profile and id number. In that case you can choose to perform a withdrawal using your wallet. The withdrawal will be carried out in favour of the Eth address specified in the corresponding field (it defaults to the address selected in your Wallet if empty).<h3>📞Phone numbers📞</h3>If the deposit has been done for your phone number, in order to perform a withdrawal, you need to link your phone number to your Gmail profile and make the phone number public. Then you can withdraw as explained above choosing Gmail as provider.<h4>📌Note on this demo📌</h4>1. The mobile version is unstable yet!<br>2. This demo is connected to a free developer Google account and as such if you want to test it your email address needs to be manually inserted into the list of test users. Contact ✉️vincenzo.iovino@azkr.org✉️<br>For more info check out the documentation at " + "<a href=\"https://github.com/vincenzoiovino/LoI.SmartContracts/\">Github</a>";

    const contract = new web3.eth.Contract(contractAnonIBPABI, contractAnonIBPAddress);
    const Id = await contract.methods.getId().call();
    status3.innerText = "Contract at address: " + contractAnonIBPAddress + "\n" + "Latest id assigned to a deposit: " + (Id - 1) + "\nContract balance: " + web3.utils.fromWei(await web3.eth.getBalance(contractAnonIBPAddress), "ether") + "ETH";


});

document.getElementById("minus").addEventListener("click", async () => {

    document.getElementById("status2").innerText = "";
    document.getElementById("status3").innerText = "";
    document.getElementById("status4").innerText = "";
    document.getElementById("status5").innerText = "";
});

hello.on('auth.logout', function() {
    document.getElementById("status1").style.color = "red";
    document.getElementById("status1").innerText = "disconnected";
});

hello.init({
    google: GOOGLE_CLIENT_ID,
    facebook: FB_CLIENT_ID
});


document.getElementById("depositButton").addEventListener("click", async () => {
    Provider = document.getElementById("menu").value;
    nCoinsinput = document.getElementById("nCoinsinput").value;
    const email = document.getElementById("emailinput").value;
    await deposit(email);
    const metaMaskAvailable = await checkMetaMaskAvailability();
    if (metaMaskAvailable === false) {
        await swal("Metamask is not available or you are not connected to Sepolia network. Pls check your Metamask Wallet before using it.", {
            icon: "error",
        });
        return;
    }
    document.getElementById("status5").innerText = "Wait.";
    const accounts = await wallet.eth.getAccounts();
    const from = accounts[0];
    //   const amount = document.getElementById("amountinput").value;
    const amount = nCoinsinput;
    const amountWei = await wallet.utils.toWei(amount, "ether");
    document.getElementById("status5").innerText = "Wait..";
    const contract = new wallet.eth.Contract(contractAnonIBPABI, contractAnonIBPAddress);
    document.getElementById("status5").innerText = "Wait...";

    const encodedDx = await wallet.eth.abi.encodeParameter('uint256', BigInt(D_EthereumX));
    const encodedDy = await wallet.eth.abi.encodeParameter('uint256', BigInt(D_EthereumY));
    const encodedCT = await wallet.eth.abi.encodeParameter('bytes8', "0x" + Ciphertext_Ethereum).slice(0, 18);
    document.getElementById("status5").innerText = "Wait....";


    //await ethereum.request({ method: 'eth_requestAccounts' }).then(async function () {
    await contract.methods.MakeDepositFull(encodedDx, encodedDy, encodedCT).send({
            from: from,
            value: amountWei
        }).on("confirmation", async function(confirmationNumber, receipt) {
            console.log("confirmationNumber", confirmationNumber);
            //var gasUsed = confirmationNumber.receipt.gasUsed;
            var txn = confirmationNumber.receipt.transactionHash;
            clearInterval(waitdepositinterval);
            clearInterval(waitwithdrawalinterval);
            const Id = await contract.methods.getIdFromDx(encodedDx).call();
            if (Id + "" == "0")
                document.getElementById("status5").innerText = "Unable to retrieve id of deposit. Check out latest contract IDs.";
            else document.getElementById("status5").innerText = "Id of deposit: " + Id + "\nStore it for future use";
            document.getElementById("status5").style.color = "green";
            document.getElementById("status4").innerHTML = "Deposit in favour of " + email + " carried out successfully. Check out transaction " + "<a href=\"https://" + CHAIN + ".etherscan.io/tx/" + txn + "\"target=\"_blank\">here" + "</a>";
            document.getElementById("status4").style.color = "green";
            document.getElementById("status2").innerText = "";
            document.getElementById("status3").innerText = "";


        })
        .on('sent', function() {
            document.getElementById("status2").style.color = "white";
            waitdepositinterval = setInterval(setWaitDeposit, 2700);
        });
    //});
    document.getElementById("status5").innerText = "";

});

function permutelist(List) {
    const r = Math.floor(Math.random() * 3);
    const r2 = Math.floor(Math.random() * 2) + 1;
    var list = List.slice();
    var tmp = list[0 * 2];
    list[0 * 2] = list[r * 2];
    list[r * 2] = tmp;
    tmp = list[1 * 2];
    list[1 * 2] = list[r2 * 2];
    list[r2 * 2] = tmp;

    tmp = list[0 * 2 + 1];
    list[0 * 2 + 1] = list[r * 2 + 1];
    list[r * 2 + 1] = tmp;
    tmp = list[1 * 2 + 1];
    list[1 * 2 + 1] = list[r2 * 2 + 1];
    list[r2 * 2 + 1] = tmp;
    return list;
}

document.getElementById("withdrawButton").addEventListener("click", async () => {


    const network = document.getElementById("menu").value;


    const options = (network === "google" || network === "google.phone") ? {
        scope: 'email, https://www.googleapis.com/auth/user.phonenumbers.read'
    } : {
        // scope: 'email, user_friends, public_profile, user_likes'
        scope: 'email, user_friends, public_profile'
    };



    var access_token, _network;
    if (network === "google.phone") _network = "google";
    else _network = network;
    await hello(_network).login(options).then(async function() {
        //var email;
        console.log(hello(_network).getAuthResponse());
        await hello(_network).api('/me').then(async function(resp) {
            document.getElementById("status2").style.color = "white";
            document.getElementById("status2").innerText = "Hello, " + resp.name + " (" + resp.email + ")";
            document.getElementById("status2").style.color = "green";
            access_token = await hello(_network).getAuthResponse().access_token;
            //email = (network === "google.phone") ? document.getElementById("emailinput").value : resp.email;
            email = (network === "google.phone") ? "" : resp.email;
        });
        var list = permutelist(List);
        Provider = provider = network;
        document.getElementById("status5").innerText = "Wait.";
        try {
            if (Token[provider + "." + email] == undefined) await get_token(access_token, list); // a call to get_token stores the token in the variable Token[provider + "." + email]
        } catch (err) {
            document.getElementById("status5").innerText = "";
            return;
        }
        console.log(provider + email + Token[provider + "." + email]);
        console.log(Token[provider + "." + email]);
        console.log(Token[Provider + "." + email]);
        document.getElementById("status5").innerText = "Wait..";


        const id = document.getElementById("idinput").value;
        const contract = new web3.eth.Contract(contractAnonIBPABI, contractAnonIBPAddress);
        const encodedId = web3.eth.abi.encodeParameter('uint256', BigInt(id));
        document.getElementById("status5").innerText = "Wait...";
        const Dx = await contract.methods.getDxFromId(encodedId).call();
        console.log("Dx:" + Dx);
        const encodedDx = web3.eth.abi.encodeParameter('uint256', BigInt(Dx));
        document.getElementById("status5").innerText = "Wait.... ";
        const Dy = await contract.methods.getDyFromDx(encodedDx).call();
        document.getElementById("status5").innerText = "Wait.....";
        console.log("Dy:" + Dy);
        var X = new mcl.Fp();
        var Y = new mcl.Fp();
        var Z = new mcl.Fp();
        var D = new mcl.G1();
        X.setStr(Dx + "", 10);
        Y.setStr(Dy + "", 10);
        Z.setStr("1");
        D.setX(X);
        D.setY(Y);
        D.setZ(Z);
        D_Serialized = D.getStr(16);
        const nCoins = await contract.methods.getnCoinsFromDx(encodedDx).call();
        document.getElementById("status5").innerText = "Wait......";
        console.log("nCoins:" + nCoins);
        const CT = await contract.methods.getCTFromDx(encodedDx).call();
        document.getElementById("status5").innerText = "Wait.......";
        console.log("CT:" + CT);
        Ciphertext_Ethereum = CT.substr(2);
        //    Addr = "0xc4B22276E2e86E05baFecF4c08F3C682Eb91a9b1";

        Provider = document.getElementById("menu").value;
        Addr = "0000000000000000000000000000000000000000000000000000000000000001"; //perform verification with respect to arbitrary address
        var success = await decryptAndVerify(email);
        document.getElementById("status5").innerText = "Wait........";
        if (success === "1" && web3.utils.fromWei(nCoins, "ether") === "0.") await swal("You already withdrew this deposit.", {
            icon: "error",
        });
        else if (success === "0") await swal("There is no deposit for you corresponding to this identifier and provider", {
            icon: "error",
        });
        else if (await swal('There is a deposit of ' + web3.utils.fromWei(nCoins, "ether") + 'ETH in favour of you corresponding to this identifier and provider. Do you want to proceed to withdraw it?', {
                buttons: [true, true],
                icon: "warning",
            })) {
            // withdraw
            // TODO: remove the need for double decryptAndVerify. The first one should be used only to perform a verification without computing the proof
            const metaMaskAvailable = await checkMetaMaskAvailability();
            if (metaMaskAvailable === false) {
                await swal("Metamask is not available or you are not connected to Sepolia network. Pls check your Metamask Wallet before using it.", {
                    icon: "error",
                });
                return;
            }
            const accounts = await wallet.eth.getAccounts();
            Addr = document.getElementById("addrinput").value;
            if (Addr == "") Addr = accounts[0];
            await decryptAndVerify(email);
            const contract = new wallet.eth.Contract(contractAnonIBPABI, contractAnonIBPAddress);
            const encodedDx = wallet.eth.abi.encodeParameter('uint256', BigInt(D_EthereumX));
            const encodedDy = wallet.eth.abi.encodeParameter('uint256', BigInt(D_EthereumY));
            const encodedEx = wallet.eth.abi.encodeParameter('uint256', BigInt(E_EthereumX));
            const encodedEy = wallet.eth.abi.encodeParameter('uint256', BigInt(E_EthereumY));
            const encodedtokenprimex = wallet.eth.abi.encodeParameter('uint256', BigInt(tokenprime_EthereumX));
            const encodedtokenprimey = wallet.eth.abi.encodeParameter('uint256', BigInt(tokenprime_EthereumY));
            const encodedpi_Ax = wallet.eth.abi.encodeParameter('uint256', BigInt(pi_A_EthereumX));
            const encodedpi_Ay = wallet.eth.abi.encodeParameter('uint256', BigInt(pi_A_EthereumY));
            const encodedpi_z = wallet.eth.abi.encodeParameter('uint256', BigInt(pi_z_Ethereum));
            document.getElementById("status5").innerText = "Wait.";
            //await ethereum.request({ method: 'eth_requestAccounts' }).then(async function () {
            await contract.methods.MakeWithdrawalFull(encodedDx, encodedDy, encodedEx, encodedEy, encodedtokenprimex, encodedtokenprimey, encodedpi_Ax, encodedpi_Ay, encodedpi_z).send({
                    from: Addr,
                    value: 0
                }).on("confirmation", async function(confirmationNumber, receipt) {
                    console.log("confirmationNumber", confirmationNumber);
                    clearInterval(waitdepositinterval);
                    clearInterval(waitwithdrawalinterval);
                    document.getElementById("status5").innerText = "";
                    var txn = confirmationNumber.receipt.transactionHash;
                    document.getElementById("status5").innerHTML = "Withdrawal of " + wallet.utils.fromWei(nCoins, "ether") + "in favour of address " + Addr + "ETH carried out successfully. Check out transaction " + "<a href=\"https://" + CHAIN + ".etherscan.io/tx/" + txn + "\"target=\"_blank\">here" + "</a>";
                    document.getElementById("status5").style.color = "green";
                    document.getElementById("status4").innerText = "";
                    document.getElementById("status4").style.color = "green";
                    document.getElementById("status2").innerText = "";
                    document.getElementById("status3").innerText = "";


                })
                .on('sent', function() {
                    document.getElementById("status5").innerText = "";
                    document.getElementById("status2").style.color = "white";
                    document.getElementById("status4").style.color = "white";
                    document.getElementById("status5").style.color = "white";
                    document.getElementById("status4").innerText = "";
                    document.getElementById("status5").innerText = "";
                    document.getElementById("status3").innerText = "";
                    waitwithdrawalinterval = setInterval(setWaitWithdrawal, 2700);
                });
            //});
            document.getElementById("status5").innerText = "";
        }
        document.getElementById("status5").innerText = "";

    });

});









//document.getElementById("logout").addEventListener("click", async () => { hello('google').logout(); });



function getTinyURL(CT) {
    var request = API_TINY_URL + API_URL_FOR_TINY + CT;

    return fetch(request).then(function(response) {
        return response.text();
    });
}

async function FinalizeDeposit(ciphertext) {

    await getTinyURL(ciphertext).then(function(text) {
        text = new URL(text).pathname.substr(API_URL_FOR_TINY_PATH.length);
        text = nobleCurves.bytesToHex(nobleCurves.utf8ToBytes(text));
        console.log("ciphertext in tinyurl format+hex:" + text);
        Ciphertext_Ethereum = text;
    }).catch((err) => {
        console.error("tinyurl.com service not working. Try later" + err.message);

        return;
    });

}

function xor(hex1, hex2) {
    var result = "";
    for (let index = 0; index < hex1.length; index++) {
        const temp = (parseInt(hex1.charAt(index), 16) ^ parseInt(hex2.charAt(index), 16)).toString(16).toUpperCase()
        result += temp;
    }
    return result;
}


async function cca(msg, email, fp) {
    const provider = Provider;
    var InputAIBC = msg;
    const sigma = new Uint8Array(msg.length);
    self.crypto.getRandomValues(sigma);
    const sigma_msg = new Uint8Array(sigma.length + msg.length);
    sigma_msg.set(sigma);
    sigma_msg.set(msg, sigma.length);
    const derived = nobleHashes.hkdf(nobleHashes.sha256, sigma_msg, undefined, 'application', 32);
    var FrTmp = new mcl.Fr();
    FrTmp.setStr(nobleCurves.numberToHexUnpadded(fp.create(nobleCurves.bytesToNumberBE(derived))), 16);
    const s = FrTmp;
    const A = mcl.mul(G2Base, s);
    const mpk_to_s = mcl.mul(Mpk, s);
    const id = nobleCurves.utf8ToBytes("LoI.." + provider + ".." + email + ".." + year + ".." + month + ".." + fetch_friends + ".." + fetch_anon + ".." + fetch_ethereum);
    const h = hashToCurve(id);
    const g_id = mcl.pairing(h, mpk_to_s);
    var B = g_id.getStr(16);
    const length = msg.length;
    const B_expanded = nobleHashes.hkdf(nobleHashes.sha256, B, undefined, 'application', length);
    msg = nobleCurves.bytesToHex(msg);
    B = xor(nobleCurves.bytesToHex(B_expanded), nobleCurves.bytesToHex(sigma));
    const sigma_expanded = nobleHashes.hkdf(nobleHashes.sha256, sigma, undefined, 'application', sigma.length);
    //console.log("msg to hex:" + msg);
    const C = xor(nobleCurves.bytesToHex(sigma_expanded), msg);
    var ciphertext = length + "." + A.getStr(16) + "." + B + "." + C;
    await FinalizeDeposit(ciphertext);
    FrTmp = new mcl.Fr();
    FrTmp.setStr(nobleCurves.numberToHexUnpadded(fp.create(nobleCurves.bytesToNumberBE(InputAIBC))), 16);
    const D = mcl.mul(h, FrTmp);
    ciphertext = ciphertext + "." + D.getStr(16);
    console.log("DEBUG: value D as ethereum tuple: " + "[" + D.getStr(10).split(' ')[1] + "," + D.getStr(10).split(' ')[2] + "]\",\n");
    D_EthereumX = D.getStr(10).split(' ')[1];
    D_EthereumY = D.getStr(10).split(' ')[2];
    D_Serialized = D.getStr(16);
}





async function deposit(email) {
    // recall that before calling deposit you should set Provider = document.getElementById("menu").value;
    const date = new Date();
    month = date.getMonth();
    year = date.getFullYear();
    const InputAIBC = new Uint8Array(32);
    self.crypto.getRandomValues(InputAIBC);
    const fp = nobleCurves.Field(ORDER);
    await cca(InputAIBC, email, fp);


}


async function getLongURL(CT) {
    var request = TINYURL_SERVICE + CT;
    return fetch(request).then(function(response) {
        return response.url;
    }).catch(function(err) {

        console.error("Unable to decrypt. The problem can be due to an invalid ciphertext or the tinyurl.com service not working. Try later");
        return;
    });
}

async function decryptAndVerify(email) { // it expects that the global variable D_Serialized contains D and Ciphertext_Ethereum the ciphertext and Addr the withdrawal address
    var addr = Addr.substr(2);
    var provider = Provider;
    const AIBCInput = D_Serialized;
    const date = new Date();
    month = date.getMonth();
    year = date.getFullYear();
    const mpk = Mpk;
    var FrTmp = new mcl.G1();
    FrTmp.setStr(Token[provider + "." + email], 16);
    const token = FrTmp;

    var ciphertext = Ciphertext_Ethereum;
    ciphertext = new TextDecoder().decode(hexToBytes(ciphertext));
    ciphertext = await getLongURL(ciphertext);
    try {
        ciphertext = decodeURI(new URL(ciphertext).pathname.substr(API_URL_FOR_TINY_PATH.length));
    } catch (err) {
        return "0";
    }
    FrTmp = new mcl.G2();
    FrTmp.setStr(ciphertext.split('.')[1], 16);
    const A = FrTmp;
    const B = ciphertext.split('.')[2];
    const length = parseInt(ciphertext.split('.')[0]);
    const C = ciphertext.split('.')[3];


    const id = utf8ToBytes("LoI.." + provider + ".." + email + ".." + year + ".." + month + ".." + fetch_friends + ".." + fetch_anon + ".." + fetch_ethereum);
    const h = hashToCurve(id);
    const t1 = mcl.pairing(h, mpk);
    const t2 = mcl.pairing(token, G2Base);
    if (!t1.isEqual(t2)) {
        console.error("Verification of token: failure.");
        return "0";
    }
    console.log("DEBUG: Verification of token: success.");
    const g_id = mcl.pairing(token, A);
    var B_computed = g_id.getStr(16);
    const B_expanded = nobleHashes.hkdf(nobleHashes.sha256, B_computed, undefined, 'application', length);
    B_computed = nobleCurves.bytesToHex(B_expanded);
    const sigma = hexToBytes(xor(B_computed, B));
    const sigma_expanded = nobleHashes.hkdf(nobleHashes.sha256, sigma, undefined, 'application', sigma.length);
    const msg = hexToBytes(xor(nobleCurves.bytesToHex(sigma_expanded), C));
    const sigma_msg = new Uint8Array(sigma.length + msg.length);
    sigma_msg.set(sigma);
    sigma_msg.set(msg, sigma.length);
    var derived = nobleHashes.hkdf(nobleHashes.sha256, sigma_msg, undefined, 'application', 32);

    FrTmp = new mcl.Fr();
    const fp = nobleCurves.Field(ORDER);
    FrTmp.setStr(nobleCurves.numberToHexUnpadded(fp.create(nobleCurves.bytesToNumberBE(derived))), 16);
    var s = FrTmp;
    const A_computed = mcl.mul(G2Base, s);
    var success_flag;


    success_flag = A_computed.getStr(16) === A.getStr(16) ? "1" : "0";
    var decoder = new TextDecoder();

    FrTmp = new mcl.Fr();
    FrTmp.setStr(nobleCurves.numberToHexUnpadded(fp.create(nobleCurves.bytesToNumberBE(msg))), 16);
    const r = FrTmp;
    const Dprime = mcl.mul(h, r);
    const D = new mcl.G1();
    D.setStr(AIBCInput, 16);

    var json_success = Dprime.getStr(16) === D.getStr(16) ? "1" : "0";
    console.log("DEBUG: the ciphertex is withdrawable: " + json_success);
    var randtmp = new Uint8Array(32);
    // 
    //randtmp[31]=1; // new
    //console.log(randtmp);
    self.crypto.getRandomValues(randtmp);
    derived = nobleHashes.hkdf(nobleHashes.sha256, randtmp, undefined, 'application', 32);
    s = new mcl.Fr();
    s.setStr(nobleCurves.numberToHexUnpadded(fp.create(nobleCurves.bytesToNumberBE(derived))), 16);
    //    s.setStr(nobleCurves.numberToHexUnpadded(fp.create(nobleCurves.bytesToNumberBE(randtmp))), 16); // new and commented above
    const E = mcl.mul(D, s);
    var tokenprime = mcl.mul(token, r);
    const s_negate = mcl.neg(s);
    tokenprime = mcl.mul(tokenprime, s_negate); // Token'=Token^{-r*s}
    self.crypto.getRandomValues(randtmp);
    //randtmp = new Uint8Array(32); // new
    //randtmp[31]=1; // new
    derived = nobleHashes.hkdf(nobleHashes.sha256, randtmp, undefined, 'application', 32);
    const a = new mcl.Fr();
    a.setStr(nobleCurves.numberToHexUnpadded(fp.create(nobleCurves.bytesToNumberBE(derived))), 16);
    //a.setStr(nobleCurves.numberToHexUnpadded(fp.create(nobleCurves.bytesToNumberBE(randtmp))), 16); // new and commented above
    const pi_A = mcl.mul(D, a);
    //const dot = utf8ToBytes(".");
    //const input = new Uint8Array([...hexToBytes(pad(E.getStr(16).split(' ')[1])), ...dot, ...hexToBytes(pad(pi_A.getStr(16).split(' ')[1])), ...dot, ...hexToBytes(addr)]); // we hash input = statement E + first message pi_A + addr. TODO: there is currently no check on the format of addr, it should represent an ETH address and this should be checked.
    const input = new Uint8Array([...hexToBytes(pad(E.getStr(16).split(' ')[1])), ...hexToBytes(pad(pi_A.getStr(16).split(' ')[1])), ...hexToBytes(addr)]); // we hash input = statement E + first message pi_A + addr. TODO: there is currently no check on the format of addr, it should represent an ETH address and this should be checked.
    //var packed=web3.utils.encodePacked(hexToBytes(pad(E.getStr(16).split(' ')[1])), hexToBytes(pad(pi_A.getStr(16).split(' ')[1])), hexToBytes(addr));

    /*
        const encodedEx = web3.eth.abi.encodeParameter('uint256', BigInt(E.getStr(10).split(' ')[1]));
        const encodedpi_Ax = web3.eth.abi.encodeParameter('uint256', BigInt(pi_A.getStr(10).split(' ')[1]));
        const contract = new web3.eth.Contract(contractAnonIBPABI, contractAnonIBPAddress);
     input = await contract.methods.encodeParams(encodedEx,encodedpi_Ax).call();
    console.log(input);
    //input = input._hex.substr(2);
    console.log(input.toBigInt());
    console.log("2"+typeof input);
      //  derived = nobleHashes.sha256(input2);
        const e = new mcl.Fr();
    console.log("3"+typeof input);
        randtmp = new Uint8Array(32);
        randtmp[31] = 153; // new
    console.log("4"+input._hex.substr(2));
    //     e.setStr(nobleCurves.numberToHexUnpadded(input.toNumber()), 16); // new
         e.setStr(nobleCurves.numberToHexUnpadded(fp.create(input.toBigInt())), 16); // new
    //     e.setStr(nobleCurves.numberToHexUnpadded(fp.create(nobleCurves.bytesToNumberBE(hexToBytes(input._hex.substr(2))  ))), 16); // new
    //e.setStr(input._hex.substr(2),16);
    console.log("5"+e.getStr(10));
    //     e.setStr(nobleCurves.numberToHexUnpadded(fp.create(nobleCurves.bytesToNumberBE(derived))), 16); // new
        //e.setStr(nobleCurves.numberToHexUnpadded(fp.create(nobleCurves.bytesToNumberBE(randtmp))), 16); // new
    */
    derived = nobleHashes.sha256(input);
    const e = new mcl.Fr();
    e.setStr(nobleCurves.numberToHexUnpadded(fp.create(nobleCurves.bytesToNumberBE(derived))), 16); // new

    // e is the hash of input converted to scalar
    const pi_z = mcl.add(a, mcl.mul(e, s)); // pi_z = a + e*s
    const Json =
        "{\n" +
        " \"data\": {\n" +
        "             \"success:\": \"" + json_success + "\",\n" +
        "             \"ciphertext:\": \"0x" + ciphertext + "\",\n" +
        "             \"addr:\": \"0x" + addr + "\",\n" +
        "             \"MPK:\": \"" + "[[" + mpk.getStr(10).split(' ')[2] + "," + mpk.getStr(10).split(' ')[1] + "],[" + mpk.getStr(10).split(' ')[4] + "," + mpk.getStr(10).split(' ')[3] + "]]" + "\",\n" +
        "             \"D:\": \"[" + D.getStr(10).split(' ')[1] + "," + D.getStr(10).split(' ')[2] + "]\",\n" +
        "             \"pi_as_ethereum_tuple:\": \"[[" + D.getStr(10).split(' ')[1] + "," + D.getStr(10).split(' ')[2] + "],[" + E.getStr(10).split(' ')[1] + "," + E.getStr(10).split(' ')[2] + "],[" + tokenprime.getStr(10).split(' ')[1] + "," + tokenprime.getStr(10).split(' ')[2] + "],[" + pi_A.getStr(10).split(' ')[1] + "," + pi_A.getStr(10).split(' ')[2] + "]," + pi_z.getStr() + "]\",\n" +
        //          "             \"Dx:\": \"" + D.getStr(16).split(' ')[1] + "\",\n" +
        //        "             \"Dy:\": \"" + D.getStr(16).split(' ')[2] + "\",\n" +
        //      "             \"Ex:\": \"" + E.getStr(16).split(' ')[1] + "\",\n" +
        //    "             \"Ey:\": \"" + E.getStr(16).split(' ')[2] + "\",\n" +
        //  "             \"Token\'x:\": \"" + tokenprime.getStr(16).split(' ')[1] + "\",\n" +
        // "             \"Token\'y:\": \"" + tokenprime.getStr(16).split(' ')[2] + "\",\n" +
        // "             \"pi_Ax\":   \"" + pi_A.getStr(16).split(' ')[1] + "\",\n" +
        // "             \"pi_Ay\":   \"" + pi_A.getStr(16).split(' ')[2] + "\",\n" +
        // "             \"pi_z\":    \"" + pi_z.getStr(16) + "\"\n" +
        "            }\n" +
        "}";
    D_EthereumX = D.getStr(10).split(' ')[1];
    D_EthereumY = D.getStr(10).split(' ')[2];
    E_EthereumX = E.getStr(10).split(' ')[1];
    E_EthereumY = E.getStr(10).split(' ')[2];
    tokenprime_EthereumX = tokenprime.getStr(10).split(' ')[1];
    tokenprime_EthereumY = tokenprime.getStr(10).split(' ')[2];
    pi_A_EthereumX = pi_A.getStr(10).split(' ')[1];
    pi_A_EthereumY = pi_A.getStr(10).split(' ')[2];
    pi_z_Ethereum = pi_z.getStr(10);

    console.log("DEBUG: Json: " + Json);
    console.log("decrypted flag+message: " + success_flag + nobleCurves.bytesToHex(msg));

    return success_flag && json_success;



}

function pad(s) {
    var n = 64 - s.length;
    for (let i = 0; i < n; i++) s = "0" + s;
    return s;
}
