# LoI.SmartContracts
This repo contains examples of  Ethereum smart contracts to be used in combination with the [League of Identity](https://github.com/aragonzkresearch/leagueofidentity) (LoI) system.

## LoI for Google Business domains
As an example we provide a template of a DAO whose members can be the owners of emails of the form `user@domain.com` where `domain.com` is a parameter of the DAO.
Only users with such emails can cast votes for proposals. Moreover, the content of a proposal is encrypted: only owners of emails that end in `@domain.com` can read the proposal.

### How to Test it
We assume the reader familiar with the basic `LoI` commands [here](https://github.com/aragonzkresearch/leagueofidentity).

#### Initialize the contract
The contract [`LoI_DAO_GoogleOrg.sol`](https://github.com/vincenzoiovino/LoI.SmartContracts/blob/main/src/LoI_DAO_GoogleOrg.sol) must be initialized with two parameters: `mpk` and `domain`.
The domain string must be the domain of your organisation, e.g. ``oldcrypto.com``.

With the command e.g.
```bash 
node compute_shares -t 2 -n 3 --ethereum
```
you will get an output that contains the following lines (among others):
```bash
reconstructed master public key: 1 23898a0ae202d5b67a91f2074176cb8dabd3399fecfbd7022aa39c80b66fa066 1e4d9b127927dfc64355a53b75d6b03d92eedf5bd9b660f76d085b236c63c38a 2abbd2f34f5fbb09e6d7474a4037d0e300b9eb00df83db94c5e521fffc43893c 2dddbf99aaabe6352a17aba4a7bbd5a8eb2eb40d25f95ee6f9b10e2cf8c564a4
reconstructed master public key as Ethereum tuple: [[13706502950207910343706560538280652811815673551122904553485492739850509730698,16073960482686030108142259199455609210079009765551608569343005038231348551782],[20745873763960892318317663603992660951953361594491582428518987779361705649316,19328995967969664651933314377729245708471534526295335040608300242158949206332]]
```

Deploy the contract with the parameters ``mpk`` set to ``[[13706502950207910343706560538280652811815673551122904553485492739850509730698,16073960482686030108142259199455609210079009765551608569343005038231348551782],[20745873763960892318317663603992660951953361594491582428518987779361705649316,19328995967969664651933314377729245708471534526295335040608300242158949206332]]`` and domain set to the domain of your organisation.
Moreover, store the first string ``1 23898a0ae202d5b67a91f2074176cb8dabd3399fecfbd7022aa39c80b66fa066 1e4d9b127927dfc64355a53b75d6b03d92eedf5bd9b660f76d085b236c63c38a 2abbd2f34f5fbb09e6d7474a4037d0e300b9eb00df83db94c5e521fffc43893c 2dddbf99aaabe6352a17aba4a7bbd5a8eb2eb40d25f95ee6f9b10e2cf8c564a4`` in the file ``mpk`` that will be used for next commands.

##### Register a user in the DAO
Suppose the user Alice who owns the email ``alice@oldcrypto.com`` wants to register in the DAO.

Alice gets her Google access token via the `LoI` web interface and stores it in the file ``google_at`` and performs off-chain e.g. the following commands:

```bash
node get_token.js -t 2 -n 3 -A $(cat google_at) -l 1 http://localhost:8001 2 http://localhost:8002 -ot google_tok --ethereum -m 1.2024
node get_token.js -t 2 -n 3 -A $(cat google_at) -l 1 http://localhost:8001 2 http://localhost:8002 -ot google_tokgroup --ethereum -m 1.2024
```
She will get two crypto tokens, the token ``google_tok`` for her personl account ``alice@oldcrypto.com`` and the token ``google_tokgroup`` for the entire group ``oldcrypto.com`` that will allow her to read encrypted proposals.
Note that we used parameter `-m 1.2024` to get a token for the month of February 2024, change it according to your current date.

Suppose Alice's Eth address is stored in the file ``addr``.
Alice can compute the following signature:
```bash
node sign -k "$(cat mpk)" -T "$(cat google_tok)" -e alicee@oldcrypto.com -os signature.json -j -h --ethereum < addr
```
The Json file ``signature.json`` will contain a field ``asTuple`` that we suppose henceforth to be the string ``Sig``.

Alice can invoke the method ``verifyIdentity`` of the contract with parameter ``sig`` equal to ``Sig``, parameter ``username`` equal to ``alice`` and parameter ``date`` equal to ``..2024..1``, possibly adapting the date based on the value previously passed with the option ``-m`` to the command ``get_token``.
From this moment Alice is registered.
She can at any time repeat this operation whenever she wants to associate her email address to a different Eth address.

#### Create a proposal with encrypted content
Suppose that Charlie wants to  submit a proposal to the DAO. Let us say that the content of the proposal is in the file ``Prop``.
Charlie runs the following command off-chain:
```bash
node encrypt -k "$(cat mpk)"  -e oldcrypto.com -oc ciphertext -cca2 --ethereum -t -h < Prop
```
Observe that Charlie does not need to contact the `LoI` nodes to execute the latter command. 
The file ``ciphertext`` will contain a string of the form ``3237786b6c396174``. The string ``0x3237786b6c396174`` will be the parameter ``encryptedProposal`` that Charlie must use next.

Charlie can invoke the method ``setProposalReferendum`` with parameter ``proposalReferendumID`` set to a random ``uint256``, the so computed parameter ``encryptedProposal``, and the ``uint256`` values ``startBlock`` and ``endBlock`` representing resp. the start and the end block of the voting process for the given proposal.

#### Read an encryptedd proposal
Any member of the DAO who owns the token ``google_tokgroup`` (i.e., any person with an account of the form ``user@oldcrypto.com``) can perform the following actions.

Invoke the method ``getProposalReferendum`` with parameter the proposal ID to get a string of the form ``3237786b6c396174``. Store the following string in the file ``ciphertext``.
Run the following command:
```bash
node decrypt -k "$(cat mpk)" -T "$(cat google_tokgroup)"  -e oldcrypto.com -c "$(cat ciphertext)" -cca2 --ethereum -t -h
```
The output will be the decrypted proposal that was set by Charlie.
Nobody else, except the members of ``@oldcrypto.com`` can decrypt the proposal.

##### Cast a vote
Now Alice can cast a YES/NO vote by just invoking the method ``voteProposalReferendum`` with parameter username set to ``alice``, parameter preference set to ``0`` (for NO) or ``1`` (for YES) and ``proposalReferendumID`` set to the ID of the proosal (see above).
#### Result of the voting process
When ``endBlock`` is reached anyone can get the result invoking the method ``getProposalReferendumResult`` with input the proposal ID.

### What happens if Alice leaves oldcrypto.com?
Suppose that Alice Simpson leaves the company ``oldcrypto.com`` and a new person named Alice Johnson enters the company and gets the same email address ``alice@oldcrypto.com``.
The natural question is how to prevent Alice Simpson to still participate in the DAO.

The solution is the following.
Alice Johnson can register and get a token for a different month (strictly higher than the one corresponding to the token of Alice Simpson) and can use this token to register again her email address under a new Ethereum address.
This will invalidate the token of Alice Simpson.
The implicit assumption here is that email addresses pass over persons with a frequency of at least one month that is reasonable in organisations.

Similar tweaks can be used to limit the readability of encrypted proposals to ex members of the organisation.
