// SPDX-License-Identifier: GPL-3.0
// Adapted from code of Christian Reitwiessner and Mustafa Al-Bassam (mus@musalbas.com, https://github.com/musalbas/solidity-BN256G2)

pragma solidity ^0.8.0;

library BN254 {
    struct G1 {
        uint256 X;
        uint256 Y;
    }

    struct G2 {
        uint256[2] X;
        uint256[2] Y;
    }

    // The order of the generator G1
    uint256 constant R =
        21888242871839275222246405745257275088548364400416034343698204186575808495617;
    uint256 constant N =
        21888242871839275222246405745257275088696311157297823662689037894645226208583;

    /**
     * The generator point of G1
     */
    function P1() internal pure returns (G1 memory) {
        return
            G1(
                0x0000000000000000000000000000000000000000000000000000000000000001,
                0x0000000000000000000000000000000000000000000000000000000000000002
            );
    }

    /**
     * The generator point of G2
     */
    function P2() internal pure returns (G2 memory) {
        return
            G2(
                [
                    0x198E9393920D483A7260BFB731FB5D25F1AA493335A9E71297E485B7AEF312C2,
                    0x1800DEEF121F1E76426A00665E5C4479674322D4F75EDADD46DEBD5CD992F6ED
                ],
                [
                    0x090689D0585FF075EC9E99AD690C3395BC4B313370B38EF355ACDADCD122975B,
                    0x12C85EA5DB8C6DEB4AAB71808DCB408FE3D1E7690C43D37B4CE6CC0166FA7DAA
                ]
            );
    }

    /**
     * The inverse of a generator P2
     */
    function P2Neg() internal pure returns (G2 memory) {
        return
            G2(
                [
                    0x198E9393920D483A7260BFB731FB5D25F1AA493335A9E71297E485B7AEF312C2,
                    0x1800DEEF121F1E76426A00665E5C4479674322D4F75EDADD46DEBD5CD992F6ED
                ],
                [
                    0x275DC4A288D1AFB3CBB1AC09187524C7DB36395DF7BE3B99E673B13A075A65EC,
                    0x1D9BEFCD05A5323E6DA4D435F3B617CDB3AF83285C2DF711EF39C01571827F9D
                ]
            );
    }

    function equals(G1 memory a, G1 memory b) internal pure returns (bool) {
        return a.X == b.X && a.Y == b.Y;
    }

    /// @return the result of computing the pairing check
    /// e(p1[0], p2[0]) *  .... * e(p1[n], p2[n]) == 1
    /// For example pairing([P1(), P1().negate()], [P2(), P2()]) should
    /// return true.
    function pairing(G1[] memory p1, G2[] memory p2)
        internal
        view
        returns (bool)
    {
        require(p1.length == p2.length, "pairing-lengths-failed");
        uint256 elements = p1.length;
        uint256 inputSize = elements * 6;
        uint256[] memory input = new uint256[](inputSize);
        for (uint256 i = 0; i < elements; i++) {
            input[i * 6 + 0] = p1[i].X;
            input[i * 6 + 1] = p1[i].Y;
            input[i * 6 + 2] = p2[i].X[0];
            input[i * 6 + 3] = p2[i].X[1];
            input[i * 6 + 4] = p2[i].Y[0];
            input[i * 6 + 5] = p2[i].Y[1];
        }
        uint256[1] memory out;
        bool success;
        // solium-disable-next-line security/no-inline-assembly
        assembly {
            success := staticcall(
                sub(gas(), 2000),
                8,
                add(input, 0x20),
                mul(inputSize, 0x20),
                out,
                0x20
            )
            // Use "invalid" to make gas estimation work
            switch success
            case 0 {
                invalid()
            }
        }
        // require(success, "pairing-opcode-failed");
        return out[0] != 0;
    }

    /// @return the negation of p, i.e. p.add(p.negate()) should be zero.
    function negate(G1 memory p) internal pure returns (G1 memory) {
        // The prime q in the base field F_q for G1
        uint256 q = 21888242871839275222246405745257275088696311157297823662689037894645226208583;
        if (p.X == 0 && p.Y == 0) return G1(0, 0);
        return G1(p.X, q - (p.Y % q));
    }

    /// return the sum of two points of G1
    function pointAdd(G1 memory p1, G1 memory p2)
        internal
        view
        returns (G1 memory r)
    {
        uint256[4] memory input;
        input[0] = p1.X;
        input[1] = p1.Y;
        input[2] = p2.X;
        input[3] = p2.Y;
        bool success;
        assembly {
            success := staticcall(sub(gas(), 2000), 6, input, 0xc0, r, 0x60)
            // Use "invalid" to make gas estimation work
            switch success
            case 0 {
                invalid()
            }
        }
        require(success);
    }

    /// return the product of a point on G1 and a scalar, i.e.
    /// p == p.mul(1) and p.add(p) == p.mul(2) for all points p.
    function mul(G1 memory p, uint256 s) internal view returns (G1 memory r) {
        uint256[3] memory input;
        input[0] = p.X;
        input[1] = p.Y;
        input[2] = s;
        bool success;
        assembly {
            success := staticcall(sub(gas(), 2000), 7, input, 0x80, r, 0x60)
            // Use "invalid" to make gas estimation work
            switch success
            case 0 {
                invalid()
            }
        }
        require(success);
    }

    function sqrt(uint256 xx) internal view returns (uint256 x, bool hasRoot) {
        bool callSuccess;
        // solium-disable-next-line security/no-inline-assembly
        assembly {
            let freemem := mload(0x40)
            mstore(freemem, 0x20)
            mstore(add(freemem, 0x20), 0x20)
            mstore(add(freemem, 0x40), 0x20)
            mstore(add(freemem, 0x60), xx)
            // (N + 1) / 4 = 0xc19139cb84c680a6e14116da060561765e05aa45a1c72a34f082305b61f3f52
            mstore(
                add(freemem, 0x80),
                0xc19139cb84c680a6e14116da060561765e05aa45a1c72a34f082305b61f3f52
            )
            // N = 0x30644e72e131a029b85045b68181585d97816a916871ca8d3c208c16d87cfd47
            mstore(
                add(freemem, 0xA0),
                0x30644e72e131a029b85045b68181585d97816a916871ca8d3c208c16d87cfd47
            )
            callSuccess := staticcall(
                sub(gas(), 2000),
                5,
                freemem,
                0xC0,
                freemem,
                0x20
            )
            x := mload(freemem)
            hasRoot := eq(xx, mulmod(x, x, N))
        }
        require(callSuccess, "sqrt modexp call failed");
    }

    /**
     * Hash a message value to the G1 point
     */
    function hashToG1(bytes memory data) external view returns (G1 memory P) {
        bytes32 h = sha256(data);
        uint256 x = uint256(h) % N;
        uint256 y;
        bool found = false;
        while (true) {
            y = mulmod(x, x, N);
            y = mulmod(y, x, N);
            y = addmod(y, 3, N);
            (y, found) = sqrt(y);
            if (found) {
                P.X = x;
                P.Y = y;
                break;
            }
            x = addmod(x, 1, N);
        }
        return P;
    }
}

