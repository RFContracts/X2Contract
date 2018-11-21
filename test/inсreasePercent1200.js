import EVMRevert from './helpers/EVMRevert';
import ether from './helpers/ether';
import { advanceBlock } from './helpers/advanceToBlock';

const testUtil = require('solidity-test-util');
const BigNumber = web3.BigNumber;

require('chai')
    .use(require('chai-as-promised'))
    .use(require('chai-bignumber')(BigNumber))
    .should();

var X2Contract = artifacts.require("X2Contract");

contract('X2Contract', function(accounts) {

    before(async function () {
        await advanceBlock();
    });

    let owner = accounts[0];
    let X2ContractContract;

    beforeEach(async function() {
        X2ContractContract = await X2Contract.deployed();
    });

    it('is able to accept funds', async function () {
        await X2ContractContract.sendTransaction({ value: ether(10), from: owner });
        const X2ContractAddress = await X2ContractContract.address;
        assert.equal(web3.eth.getBalance(X2ContractAddress).toNumber(), ether(8.8));
    });

    it('is should return number of investments', async function () {
        let deposit = await X2ContractContract.deposit(owner);
        deposit.should.be.bignumber.equal(ether(10));
    });

    it('is able to accept to withdraw', async function () {
        await testUtil.evmIncreaseTime(60*1440*2);
        web3.currentProvider.send({
            jsonrpc: '2.0',
            method: 'evm_mine',
            params: [],
            id: 5777
        });
        await X2ContractContract.sendTransaction({ value: ether(0), from: owner });

        let withdrawals = await X2ContractContract.withdrawals(owner);
        withdrawals.should.be.bignumber.equal(ether(0.4));

        let balance = await X2ContractContract.getUserBalance(owner);
        balance.should.be.bignumber.equal(ether(0));
    });

    it('is able to accept to withdraw after increase percent', async function () {
        await testUtil.evmIncreaseTime(60*1440*2);
        web3.currentProvider.send({
            jsonrpc: '2.0',
            method: 'evm_mine',
            params: [],
            id: 5777
        });

        await X2ContractContract.sendTransaction({ value: ether(99), from: accounts[3] });
        await X2ContractContract.sendTransaction({ value: ether(99), from: accounts[4] });
        await X2ContractContract.sendTransaction({ value: ether(99), from: accounts[5] });
        await X2ContractContract.sendTransaction({ value: ether(99), from: accounts[6] });
        await X2ContractContract.sendTransaction({ value: ether(99), from: accounts[7] });
        await X2ContractContract.sendTransaction({ value: ether(99), from: accounts[8] });
        await X2ContractContract.sendTransaction({ value: ether(99), from: accounts[9] });
        await X2ContractContract.sendTransaction({ value: ether(99), from: accounts[10] });
        await X2ContractContract.sendTransaction({ value: ether(99), from: accounts[11] });
        await X2ContractContract.sendTransaction({ value: ether(99), from: accounts[12] });
        await X2ContractContract.sendTransaction({ value: ether(99), from: accounts[13] });
        await X2ContractContract.sendTransaction({ value: ether(99), from: accounts[14] });
        await X2ContractContract.sendTransaction({ value: ether(99), from: accounts[15] });
        await X2ContractContract.sendTransaction({ value: ether(99), from: accounts[16] });
        await X2ContractContract.sendTransaction({ value: ether(65), from: accounts[17] });

        let balance = await web3.eth.getBalance(X2ContractContract.address).toNumber();
        balance.should.be.bignumber.above(ether(1200));

        let percentPhase = await X2ContractContract.getPhasePercent();
        percentPhase.should.be.bignumber.equal(40);

        balance = await X2ContractContract.getUserBalance(owner);
        balance.should.be.bignumber.equal(ether(0.8));

        await X2ContractContract.sendTransaction({ value: ether(0), from: owner });

        let withdrawals = await X2ContractContract.withdrawals(owner);
        withdrawals.should.be.bignumber.equal(ether(1.2));

        balance = await X2ContractContract.getUserBalance(owner);
        balance.should.be.bignumber.equal(ether(0));

        balance = await web3.eth.getBalance(X2ContractContract.address).toNumber();
        balance.should.be.bignumber.above(ether(1200));
    });

    it('is able to accept to withdraw after reduce percent', async function () {
        await testUtil.evmIncreaseTime(60*1440*220);
        web3.currentProvider.send({
            jsonrpc: '2.0',
            method: 'evm_mine',
            params: [],
            id: 5777
        });

        let balance = await X2ContractContract.getUserBalance(owner);
        balance.should.be.bignumber.equal(ether(88));

        await X2ContractContract.sendTransaction({ value: ether(0), from: owner });

        balance = await X2ContractContract.getUserBalance(owner);
        balance.should.be.bignumber.equal(ether(0));

        balance = await web3.eth.getBalance(X2ContractContract.address).toNumber();
        balance.should.be.bignumber.below(ether(1200));

        await testUtil.evmIncreaseTime(60*1440*2);
        web3.currentProvider.send({
            jsonrpc: '2.0',
            method: 'evm_mine',
            params: [],
            id: 5777
        });

        balance = await X2ContractContract.getUserBalance(owner);
        balance.should.be.bignumber.equal(ether(0));
    });

});

