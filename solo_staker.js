var Web3 = require('aion-web3')
const BN = require('bn.js');

var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

let AMITY = "0xa056337bb14e818f3f53e13ab0d93b6539aa570cba91ce65c716058241989be9";
let MAINNET = "0xa0733306c2ee0c60224b0e59efeae8eee558c0ca1b39e7e5a14a575124549416";

/**
 *  You need to prepare two accounts, one is responsible for managing the staking process,
 *  the other is used as the identity of a staker and take pos rewards.
 */
const posManagementPrivateKey = "<YOUR_MANAGEMENT_ACCOUNT_PRIVATE_KEY>";
const posManagementAccount = web3.eth.accounts.privateKeyToAccount(posManagementPrivateKey);
/**
 * posRewardAccount is also the pos block producer account 
*/
const posRewardAccount = "<YOUR_STAKER_ACCOUNT_ADDRESS>";

let contractAddress = AMITY;

/**
 *  staker registry
 *  amount must > 1000
 */
async function solo_staker_registry(amount) {

    let data = web3.avm.contract.method("registerStaker")
    .inputs(["Address","Address","Address"],
    [posRewardAccount,posRewardAccount,posRewardAccount]).encode();

    const txObject = {
        from: posManagementAccount.address,
        to: contractAddress,
        data: data,
        gasPrice: 10000000000,
        gas: 2000000,
        value: web3.utils.toNAmp(amount),
        type: '0x1'
    }
    //client signing
    const signed = await web3.eth.accounts.signTransaction(
        txObject, posManagementAccount.privateKey
    ).then((res) => signedCall = res); 

    console.log(signed);
    const re = await web3.eth.sendSignedTransaction( signed.rawTransaction
    ).on('receipt', receipt => {
        console.log("Receipt received!\ntxHash =", receipt.transactionHash)
    });

   console.log(re); //reciept
   console.log(re.logs[0].topics); //log topic
}

/**
 * Bonds the stake to the staker. 
 * Any liquid coins, passed along the call become locked stake.
*/
async function bond(amount) {

    let data = web3.avm.contract.method("bond")
    .inputs(["Address"],[posRewardAccount]).encode();

    const txObject = {
        from: posManagementAccount.address,
        to: contractAddress,
        data: data,
        gasPrice: 10000000000,
        gas: 2000000,
        value: web3.utils.toNAmp(amount),
        type: '0x1'
    }

    //client signing
    const signed = await web3.eth.accounts.signTransaction(
        txObject, posManagementAccount.privateKey
    ).then((res) => signedCall = res); 

    console.log(signed);
    const re = await web3.eth.sendSignedTransaction( signed.rawTransaction
    ).on('receipt', receipt => {
        console.log("Receipt received!\ntxHash =", receipt.transactionHash)
    });

   console.log(re); //reciept
   console.log(re.logs[0].topics); //log topic
}

/**
     * Unbonds for a staker, After a successful unbond, 
     * the locked coins will be released to the original bonder (management address).
*/
async function unbond(amount) {

    let data = web3.avm.contract.method("unbond")
    .inputs(["Address","BigInteger","BigInteger"],
    [posRewardAccount,new BN(amount),new BN("0"),]).encode();

    const txObject = {
        from: posManagementAccount.address,
        to: contractAddress,
        data: data,
        gasPrice: 10000000000,
        gas: 2000000,
        type: '0x1'
    }

    //client signing
    const signed = await web3.eth.accounts.signTransaction(
        txObject, posManagementAccount.privateKey
    ).then((res) => signedCall = res); 

    console.log(signed);
    const re = await web3.eth.sendSignedTransaction( signed.rawTransaction
    ).on('receipt', receipt => {
        console.log("Receipt received!\ntxHash =", receipt.transactionHash)
    });

   console.log(re); //reciept
   console.log(re.logs[0].topics); //log topic

}

solo_staker_registry("1001");
//bond("1000");
//unbond("500");