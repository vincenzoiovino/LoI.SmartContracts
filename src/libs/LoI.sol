// SPDX-License-Identifier: GPL-3.0
// Adapted from code of Christian Reitwiessner and Mustafa Al-Bassam (mus@musalbas.com, https://github.com/musalbas/solidity-BN256G2)

pragma solidity ^0.8.0;

import {BN254} from "./BN254.sol";
import {LoI_DAO_GoogleOrg} from "../LoI_DAO_GoogleOrg.sol";

library LoI {
    struct PK {
        BN254.G2 PointG2;
    }
    struct Signature {
        BN254.G2 C;
        BN254.G1 E;
        BN254.G1 F;
        BN254.G1 pi_A;
        uint256 pi_z;
    }

    function verifySignature(
        Signature memory sig,
        bytes memory id,
        address M,
        bytes memory fullemail
    ) external view returns (bool success) {
        LoI_DAO_GoogleOrg D = LoI_DAO_GoogleOrg(address(this));
        BN254.G2 memory mpk = PK(D.getMPK()).PointG2;
        BN254.G1[] memory p1 = new BN254.G1[](2);

        p1[0] = BN254.hashToG1(id);
        p1[1] = BN254.negate(sig.F);

        BN254.G2[] memory p2 = new BN254.G2[](2);
        p2[0] = sig.C;
        p2[1] = BN254.P2();

        if (!BN254.pairing(p1, p2)) return false;
        p1[0] = sig.E;
        p2[0] = mpk;
        p1[1] = BN254.negate(BN254.P1());
        p2[1] = sig.C;
        if (!BN254.pairing(p1, p2)) return false;

        bytes memory dot = bytes(".");
        bytes memory message = abi.encodePacked(
            sig.E.X,
            dot,
            sig.pi_A.X,
            dot,
            M,
            dot,
            fullemail
        );
        uint256 e = uint256(sha256(message));

        p1[0] = BN254.mul(sig.E, e);
        p1[0] = BN254.pointAdd(sig.pi_A, p1[0]);
        p1[1] = BN254.mul(BN254.P1(), sig.pi_z);
        success = BN254.equals(p1[0], p1[1]);
    }
}

