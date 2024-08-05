// SPDX-License-Identifier: GPL-3.0
// Copyright Vincenzo Iovino, 2024

pragma solidity >=0.7.0 <0.9.0;
import {BN254} from "./libs/BN254.sol";
import {LoI} from "./libs/LoI.sol";

contract Blik {
        LoI.PK public MPK;
constructor(LoI.PK memory mpk){
    MPK=mpk;
}
    struct Proof {
        BN254.G1 D;
        BN254.G1 E;
        BN254.G1 tokenprime;
        BN254.G1 pi_A;
        uint256 pi_z;
    }
    struct Deposit {
        uint256 nCoins; // the amount of coins (in wei units) to be transferred
        bytes8 CT; // the ciphertext encrypting a random value under a certain identity.
        //Precisely the "ciphertext" is represented by an 8 characters string that in turn represents the path for a tinyurl website from which it is possible to retrieve the actual ciphertext
    }
    uint256 public Id;
    mapping(bytes32 => Deposit) public deposits; // each deposit is associated with the hash of a value x, where x is the random value needed to claim the deposits
    mapping(uint256 => Deposit) public deposits_full;   // each deposit is associated with the X coordinate of the G1 point H(id)^r, where r is the random value encrypted in the ciphertext. 
    // The withdrawal can be done sending a ZK proof of correct decryption
    function MakeDeposit(bytes32 h, bytes8 CT) external payable {
        require(deposits[h].CT == 0 && msg.value != 0);
        deposits[h].nCoins = msg.value;
        deposits[h].CT = CT;
    }
 function MakeDepositFull(uint256 h, bytes8 CT) external payable {
        require(deposits_full[h].CT == 0 && msg.value != 0);
        deposits_full[h].nCoins = msg.value;
        deposits_full[h].CT = CT;
    }
    function MakeWithdrawal(bytes32 h, bytes memory x) external {
        require(sha256(x) == h && deposits[h].nCoins > 0);
        payable(msg.sender).transfer(deposits[h].nCoins);
        deposits[h].nCoins = 0;
    }
 function setMPK(BN254.G2 calldata mpk) public {
        // this should be invoked once for ever since MPK is not supposed to change over the time. Alternatively MPK can be set as a constant in the contract.
        MPK.PointG2 = mpk;
    }

    function getMPK() external view returns (BN254.G2 memory mpk) {
        mpk = MPK.PointG2;
    }
     function MakeWithdrawalFull(Proof memory pi
        ) external {
        BN254.G1[] memory p1 = new BN254.G1[](2);
        p1[0] = pi.tokenprime;
        p1[1] = pi.E;

        BN254.G2[] memory p2 = new BN254.G2[](2);
        p2[0] = BN254.P2();
        p2[1] = MPK.PointG2;

        require (BN254.pairing(p1, p2));
      
        bytes memory dot = bytes(".");
        bytes memory message = abi.encodePacked(
            pi.E.X,
            dot,
            pi.pi_A.X,
            dot,
            msg.sender
        );
        uint256 e = uint256(sha256(message));

        p1[0] = BN254.mul(pi.E, e);
        p1[0] = BN254.pointAdd(pi.pi_A, p1[0]);
        p1[1] = BN254.mul(pi.D, pi.pi_z);
        require( BN254.equals(p1[0], p1[1]) == true);
        payable(msg.sender).transfer(deposits_full[pi.D.X].nCoins);
        deposits_full[pi.D.X].nCoins = 0;
    }
}

