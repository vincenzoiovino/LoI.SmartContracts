// SPDX-License-Identifier: GPL-3.0
// Copyright Vincenzo Iovino, 2024

// initialize the contract with:
// [[17650401953877851439635577206110766953856761406923475418003307457561889540315,21200720758627169108385381836933178062103968834651067635052438190446348782562],[19663398795984464822343332592454950952846592629461984989829477392159714729078,21167609696476223494515294740194964327788425825089244977948745836321546859634]]

pragma solidity >=0.7.0 <0.9.0;
import {BN254} from "./libs/BN254.sol";
import {LoI} from "./libs/LoI.sol";

contract AnonIBP {
    LoI.PK public MPK;

    constructor(BN254.G2 memory mpk) {
        MPK.PointG2 = mpk;
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
    struct DepositFull {
        uint256 nCoins; // the amount of coins (in wei units) to be transferred
        bytes8 CT; // the ciphertext encrypting a random value under a certain identity.
        //Precisely the "ciphertext" is represented by an 8 characters string that in turn represents the path for a tinyurl website from which it is possible to retrieve the actual ciphertext
        BN254.G1 D;
        uint256 id;
    }

    uint256 public Id=1;
    mapping(bytes32 => Deposit) public deposits; // each deposit is associated with the hash of a value x, where x is the random value needed to claim the deposits
    mapping(uint256 => bytes32) public deposits_index;
    // to search for withdrawable deposits the API will look for deposits_index[Id] to get the value h and then
    // can use deposits[h] to get the Deposit struct data corresponding to this deposit
    mapping(uint256 => DepositFull) public deposits_full; // each deposit is associated with the X coordinate of the G1 point H(id)^r, where r is the random value encrypted in the ciphertext.
    // The withdrawal can be done sending a ZK proof of correct decryption
    mapping(uint256 => uint256) public deposits_full_index;

    // to search for withdrawable deposits the API will look for deposits_full_index[Id] to get the value h
    // (corresponding in turn to the X coordinate of the point D) and then can use deposits[h] to get the Deposit struct data corresponding to this deposit

    function MakeDeposit(bytes32 h, bytes8 CT) external payable {
        require(deposits[h].CT == 0 && msg.value != 0);
        deposits[h].nCoins = msg.value;
        deposits[h].CT = CT;
        deposits_index[Id++] = h;
    }

    function MakeDepositFull(
        uint256 Dx,
        uint256 Dy,
        bytes8 CT
    ) external payable {
        BN254.G1 memory D;
        require(deposits_full[Dx].CT == 0 && msg.value != 0); // before here there was D.X but I think it was a bug
        deposits_full[Dx].nCoins = msg.value;
        deposits_full[Dx].CT = CT;
        D.X = Dx;
        D.Y = Dy;
        deposits_full[Dx].D = D;
        deposits_full[Dx].id = Id;
        deposits_full_index[Id++] = Dx;
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

    function getId() external view returns (uint256) {
        return Id;
    }

    function getIdFromDx(uint256 Dx) external view returns (uint256) {
        return deposits_full[Dx].id;
    }

    function getDxFromId(uint256 id) external view returns (uint256) {
        return deposits_full_index[id];
    }

    function getDyFromDx(uint256 Dx) external view returns (uint256) {
        return deposits_full[Dx].D.Y;
    }

    function getnCoinsFromDx(uint256 Dx) external view returns (uint256) {
        return deposits_full[Dx].nCoins;
    }

    function getCTFromDx(uint256 Dx) external view returns (bytes8) {
        return deposits_full[Dx].CT;
    }

    function toString() public view returns (bytes memory) {
        return abi.encodePacked(msg.sender);
    }

    function TestToken(
        uint256 Ex,
        uint256 Ey,
        uint256 tokenprimex,
        uint256 tokenprimey
    ) internal view returns (bool) {
        BN254.G1[] memory p1 = new BN254.G1[](2);
        p1[0].X = tokenprimex;
        p1[0].Y = tokenprimey;
        p1[1].X = Ex;
        p1[1].Y = Ey;

        BN254.G2[] memory p2 = new BN254.G2[](2);
        p2[0] = BN254.P2();
        p2[1] = MPK.PointG2;

        return BN254.pairing(p1, p2);
    }

    function LastCheckAndPay(
        uint256 Dx,
        uint256 Dy,
        uint256 Ex,
        uint256 Ey,
        uint256 pi_Ax,
        uint256 pi_Ay,
        uint256 pi_z
    ) internal {
        BN254.G1 memory p0;

        uint256 e = uint256(sha256(abi.encodePacked(Ex, pi_Ax, msg.sender)));
        BN254.G1 memory tmp;

        tmp.X = Ex;
        tmp.Y = Ey;
        p0 = BN254.mul(tmp, e);

        tmp.X = pi_Ax;
        tmp.Y = pi_Ay;

        p0 = BN254.pointAdd(tmp, p0);
        tmp.X = Dx;
        tmp.Y = Dy;
        tmp = BN254.mul(tmp, pi_z);
        require(BN254.equals(p0, tmp) == true);
        payable(msg.sender).transfer(deposits_full[Dx].nCoins);
        deposits_full[Dx].nCoins = 0;
    }

    function LastCheckAndPay2(
        uint256 Dx,
        uint256 Dy,
        uint256 Ex,
        uint256 Ey,
        uint256 pi_Ax,
        uint256 pi_Ay,
        uint256 pi_z,
        address addr
    ) internal {
        BN254.G1 memory p0;

        uint256 e = uint256(sha256(abi.encodePacked(Ex, pi_Ax, addr)));
        BN254.G1 memory tmp;

        tmp.X = Ex;
        tmp.Y = Ey;
        p0 = BN254.mul(tmp, e);

        tmp.X = pi_Ax;
        tmp.Y = pi_Ay;

        p0 = BN254.pointAdd(tmp, p0);
        tmp.X = Dx;
        tmp.Y = Dy;
        tmp = BN254.mul(tmp, pi_z);
        require(BN254.equals(p0, tmp) == true);
        payable(addr).transfer(deposits_full[Dx].nCoins);
        deposits_full[Dx].nCoins = 0;
    }


    function MakeWithdrawalFull(
        uint256 Dx,
        uint256 Dy,
        uint256 Ex,
        uint256 Ey,
        uint256 tokenprimex,
        uint256 tokenprimey,
        uint256 pi_Ax,
        uint256 pi_Ay,
        uint256 pi_z
    ) external {
        require(TestToken(Ex, Ey, tokenprimex, tokenprimey));
        LastCheckAndPay(Dx, Dy, Ex, Ey, pi_Ax, pi_Ay, pi_z);
    }

  function MakeWithdrawalFullForSomeoneelse(
        uint256 Dx,
        uint256 Dy,
        uint256 Ex,
        uint256 Ey,
        uint256 tokenprimex,
        uint256 tokenprimey,
        uint256 pi_Ax,
        uint256 pi_Ay,
        uint256 pi_z,
        address addr
    ) external {
        require(TestToken(Ex, Ey, tokenprimex, tokenprimey));
        LastCheckAndPay2(Dx, Dy, Ex, Ey, pi_Ax, pi_Ay, pi_z, addr);
    }
  function ChangeOwner(
        uint256 Dx,
        bytes8 newCT,
        uint256 newDx,
        uint256 newDy
    ) internal {
 // changing the owner
        BN254.G1 memory D;
        deposits_full[newDx].nCoins = deposits_full[Dx].nCoins;
        deposits_full[newDx].CT = newCT;
        D.X = newDx;
        D.Y = newDy;
        deposits_full[newDx].D = D;
        deposits_full[newDx].id = deposits_full[Dx].id;
        deposits_full_index[deposits_full[newDx].id] = Dx;
        deposits_full[Dx].nCoins = 0;
    }
       

  function LastCheck3(
        uint256 Dx,
        uint256 Dy,
        uint256 Ex,
        uint256 Ey,
        uint256 pi_Ax,
        uint256 pi_Ay,
        uint256 pi_z,
        bytes8 newCT,
        uint256 newDx,
        uint256 newDy
    ) internal view  {
        BN254.G1 memory p0;

        uint256 e = uint256(sha256(abi.encodePacked(Ex, pi_Ax, newCT, newDx, newDy)));
        BN254.G1 memory tmp;

        tmp.X = Ex;
        tmp.Y = Ey;
        p0 = BN254.mul(tmp, e);

        tmp.X = pi_Ax;
        tmp.Y = pi_Ay;

        p0 = BN254.pointAdd(tmp, p0);
        tmp.X = Dx;
        tmp.Y = Dy;
        tmp = BN254.mul(tmp, pi_z);
        require(BN254.equals(p0, tmp) == true);
       

     
    }


 function MakeWithdrawalFullUpdate(
        uint256 Dx,
        uint256 Dy,
        uint256 Ex,
        uint256 Ey,
        uint256 tokenprimex,
        uint256 tokenprimey,
        uint256 pi_Ax,
        uint256 pi_Ay,
        uint256 pi_z,
        bytes8 newCT,
        uint256 newDx,
        uint256 newDy
       ) external {
        require(TestToken(Ex, Ey, tokenprimex, tokenprimey));
        LastCheck3(Dx, Dy, Ex, Ey, pi_Ax, pi_Ay, pi_z, newCT, newDx, newDy);
        require(deposits_full[newDx].CT == 0);
        ChangeOwner(Dx, newCT, newDx, newDy);
    }


}

