// SPDX-License-Identifier: GPL-3.0
// Copyright Vincenzo Iovino, 2024

pragma solidity >=0.7.0 <0.9.0;

contract Blik {
    struct Deposit {
        uint256 nCoins; // the amount of coins (in wei units) to be transferred
        bytes8 CT; // the ciphertext encrypting a random value x under a certain identity.
        //Precisely the "ciphertext" is represented by an 8 characters string that in turn represents the path for a tinyurl website from which it is possible to retrieve the actual ciphertext
    }
    uint256 public Id;
    mapping(bytes32 => Deposit) public deposits; // each deposit is associated with a bytes32 identifier representing the hash of the random value x needed to claim the coins

    function MakeDeposit(bytes32 h, bytes8 CT) external payable {
        require(deposits[h].CT == 0 && msg.value != 0);
        deposits[h].nCoins = msg.value;
        deposits[h].CT = CT;
    }

    function MakeWithdrawal(bytes32 h, bytes memory x) external {
        require(sha256(x) == h && deposits[h].nCoins > 0);
        payable(msg.sender).transfer(deposits[h].nCoins);
        deposits[h].nCoins = 0;
    }
}

