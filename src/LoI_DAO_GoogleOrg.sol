// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

import {BN254} from "./libs/BN254.sol";
import {LoI} from "./libs/LoI.sol";

contract LoI_DAO_GoogleOrg {
    struct accountVerification {
        bytes date; // the date corresponding to the token used to register.
        // If an email account in the organisation passes over from Alice to Bob, Bob can register with a token for a strictly increasing date and the old token of Alice will not longer be valid.
        // The implict assumption here is that email accounts cannot pass from a person to another in less than one month. This seems reasonable for organisations.
        // Observe that if an email account never pass to a different person, the token verification is done only once and successively only a super cheap verification of about 3k GAS cost will be carried out.
        address addr; // the address associated to this email account
    }
    struct ProposalReferendum {
        uint256 startBlock; // when the voting process starts
        uint256 endBlock; // when the voting process ends
        bytes8 encryptedProposal; // tinyurl.com (seems to) give links with path of only 8 characters. If you use a different tinyurl service change this.
        uint256 numberYES;
        uint256 numberNO;
        mapping(bytes => bool) alreadyVoted;
    }
    mapping(bytes => accountVerification) public verifiedAccounts;
    mapping(uint256 => ProposalReferendum) public ProposalsReferendum;

    LoI.PK public MPK;
    string Domain; // of the form aragon.org

    constructor(BN254.G2 memory mpk, string memory domain) {
        MPK.PointG2 = mpk;
        Domain = domain;
    }

    function setMPK(BN254.G2 calldata mpk) public {
        // this should be invoked once for ever since MPK is not supposed to change over the time. Alternatively MPK can be set as a constant in the contract.
        MPK.PointG2 = mpk;
    }

    function getMPK() external view returns (BN254.G2 memory mpk) {
        mpk = MPK.PointG2;
    }

    function getDomain() external view returns (string memory domain) {
        domain = string(Domain);
    }

    function setProposalReferendum(
        uint256 proposalReferendumId,
        bytes8 encryptedProposal,
        uint256 startBlock,
        uint256 endBlock
    ) public {
        ProposalsReferendum[proposalReferendumId]
            .encryptedProposal = encryptedProposal;
        ProposalsReferendum[proposalReferendumId].startBlock = startBlock;
        ProposalsReferendum[proposalReferendumId].endBlock = endBlock;
    }

    function getProposalReferendum(uint256 proposalReferendumId)
        public
        view
        returns (bytes32)
    {
        return ProposalsReferendum[proposalReferendumId].encryptedProposal;
    }

    function voteProposalReferendum(
        string memory username,
        bool preference,
        uint256 proposalReferendumId
    ) public {
        //require (Proposalsreferendum[proposalReferendumId].alreadyVoted[bytes(username)] ==false && block.number >= ProposalsReferendum[proposalReferendumId].startBlock && block.number <= ProposalsReferendum[proposalReferendumId].endBlock && VerifyIdentity(username)==true);
        require(
            ProposalsReferendum[proposalReferendumId].alreadyVoted[
                bytes(username)
            ] ==
                false &&
                verifyIdentity(username) == true
        );
        if (preference == true)
            ProposalsReferendum[proposalReferendumId].numberYES++;
        else if (preference == false)
            ProposalsReferendum[proposalReferendumId].numberNO++;

        ProposalsReferendum[proposalReferendumId].alreadyVoted[
            bytes(username)
        ] = true;
    }

    function getProposalRefereundumResult(uint256 proposalReferendumId)
        public
        view
        returns (uint256)
    {
        // 1 YES, 2 NO, 0 TIE, 3 Proposal vote not ended yet.
        //   if (block.number < Proposals[proposalId].endBlock) return 3;
        if (
            ProposalsReferendum[proposalReferendumId].numberNO >
            ProposalsReferendum[proposalReferendumId].numberYES
        ) return 2;
        if (
            ProposalsReferendum[proposalReferendumId].numberYES >
            ProposalsReferendum[proposalReferendumId].numberNO
        ) return 1;
        return 0;
    }

    function verifyIdentity(string memory username) public view returns (bool) {
        if (verifiedAccounts[bytes(username)].addr != msg.sender) return false;
        return true;
    }

    function verifyIdentity(
        LoI.Signature memory sig,
        string memory username,
        string memory date // of the form "..2024..1" - months start from 0 (Jan) and end in 11 (December).
    ) public returns (bool success) {
        string memory prefix = "LoI..google.."; // specific for the token used for this smart contract
        bytes memory emailBytes = abi.encodePacked(username, "@", Domain);
        string memory email = string(emailBytes);
        string memory suffix = "..null..0..1"; // specific for the token used for this smart contract
        bytes memory id = abi.encodePacked(prefix, email, date, suffix);

        if (!LoI.verifySignature(sig, id, msg.sender, emailBytes)) return false;
        verifiedAccounts[bytes(username)].addr = msg.sender;
        if (
            uint256(bytes32(verifiedAccounts[bytes(username)].date)) >
            uint256(bytes32(bytes(date)))
        ) return false;
        verifiedAccounts[bytes(username)].date = bytes(date);
        verifiedAccounts[bytes(username)].addr = msg.sender;

        success = true;
    }

    //TODO: possibly it makes sense to implement a mechanism such that an Eth user with address X who is verifed under email E can transfer the ownership of email E to a different Eth address Y.
    // This is possible now by re-executing the verifyIdentity method with a new signature under address Y. It is possible to avoid this expensive step.

    /* the rest of code of the DAO */
}

