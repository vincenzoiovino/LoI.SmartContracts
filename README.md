# LoI.SmartContracts
This repo contains examples of  Ethereum smart contracts to be used in combination with the [League of Identity](https://github.com/aragonzkresearch/leagueofidentity) (LoI) system.

## Blik for web3
[Here](https://hackmd.io/noiVZo2dTJ6Wiejt2IJvMg?view#Polish-BLIK-for-web3) we described applications of `LoI` to a sort of BLIK system for web3 that we call `Blik3`. In `Blik3` Alice can make a deposit in favour of Bob by just specifying Bob's email address and nobody, except Bob, will be able to see that the deposit is in favour of him.
Note that this on-chain payment system can be seen as a variant of the [Bank3 for Wallets](https://github.com/vincenzoiovino/bank3) system.
We implemented the idea in the contract [`Blik.sol`](https://github.com/vincenzoiovino/LoI.SmartContracts/blob/main/src/Blik.sol) that can be used in combination with `LoI` tools as follows.

### How to Test it
We assume the reader familiar with the basic `LoI` commands described [here](https://github.com/aragonzkresearch/leagueofidentity) and we assume that the contract `Blik.sol` has been deployed to Ethereum.
Moreover, we suppose that the file `mpk` contains the master public key of the `LoI` system.
#### Make a deposit
Suppose Alice wants to make a deposit of `n` coins in favour of Bob who owns the email address `bob@oldcrypto.com`. We suppose that `oldcrypto.com` is a Google Business domain.
Alice does the following. 

Run the command:
```bash
node encrypt -k "$(cat mpk)"  -e bob@oldcrypto.com -oc ciphertext --ethereum -t -h -b hash
```
This command will write into the file `ciphertext` a string of the form `32647a7236776532` and in the file `hash` a string of the form `266f787b7a631888c2b97dd64b910cc9d4e5bf5f93fd7c90fee73f45bff0c0e2`.
Let us call `CT` the first string (with `0x` prepended) and `h` the second string (with `0x` prepended).

Alice can invoke the method `MakeDeposit` of the `Blik` contract with the so given parameters `h` and `CT` along with a transfer of `n` coins.
The coins have been now deposited into the contract and it is not visibile to anyone, except to Bob, that the deposit is in favour of `bob@oldcrypto.com`.

#### Make a withdrawal
Bon sees the transaction for the deposit corresponding to `h` and the hex string `CT` and save it ino the file `ciphertext`.
Bob can now get his Google access token via the `LoI` web interface and use it to get a token for his email address from the `LoI` nodes and does the follwing. Suppose that Bob has stored the token into the file `google_tok`.

Run the command:
```bash
node decrypt -k "$(cat mpk)" -T "$(cat google_tok)"  -e bob@oldcrypto.com -c "$(cat ciphertext)"  --ethereum -t -h -hm
```
This will output an hex string of the form `fd5daac9cd0e8b4e1f80d34c8ff90b35cc5450eaf6422168b3f50402da88f865`. Let `x` be the previous string with `0x` prepended.
Bob can now invoke the method `MakeWithdrawal` of `Blik.sol` with input `h` and `x`. This will transfer the `n` coins from the contract to Bob.


#### Deposits in favour of phone numbers
The contract and the commands can be also used to make deposits in favour of phone numbers as in the original Polish BLIK system.
Bob just needs to have (or create) a Google account and to verify his phone number in that Google account.
Then, as explained [here](https://github.com/aragonzkresearch/leagueofidentity#phone-number-encryption-phencryption), Bob can get a token for his phone number. 
Alice can make the deposit specifying the Bob's phone number instead of his email address.


## DAOs of Google Business domains
As an example we provide a template of a DAO whose members can be the owners of emails of the form `user@domain.com` where `domain.com` is a parameter of the DAO.
Only users with such emails can cast votes for proposals. Moreover, the content of a proposal is encrypted: only owners of emails that end in `@domain.com` can read the proposal.

### How to Test it
We assume the reader familiar with the basic `LoI` commands described [here](https://github.com/aragonzkresearch/leagueofidentity).

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

Alice can invoke the method ``verifyIdentity`` of the contract with parameter ``sig`` equal to ``Sig``, parameter ``username`` equal to ``alice`` and parameter ``date`` equal to ``..2024..1``, possibly adapting the date based on the value previously passed with the option ``-m`` to the command ``get_token``. This costs about 400k GAS.
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
### Alternative and wallet-less system
In the current design we associate an account to an email address to save GAS cost: once the association is done the subsequent transactions are cheaper (about 60/70k GAS).
In theory, it would be possible to have a system that eliminates wallets at all.
The user could submit to an off-chain service his/her transaction that includes the signature of his/her own voting option for a given proposal. The service takes in charge the submission of the transaction on-chain.
The service must be trusted only to not censor transactions; however, the user can check that and in the case can re-submit the transaction from a wallet.

Observe that in this case the signature is relative, as before, to user's email but the signed message consists of a proposal ID and a voting option (rather than just an address) and all such signatures are computed from the same token. This witnesses the power and flexibility of the identity-based approach.

### Other web2 and web3 applications
Observe that the token can be used not only to register in the smart contract but also to sign any sort of data, e.g., invoices, reviews, etc. So ``oldcrypto.com`` can make internal use of such signatures without having a PKI.

The `LoI` token could be profitably used in other blockchains like `Cosmos` to remove or have less dependency from accounts. You could have a smart contract in which the transactions can be submitted only by users who can submit signatures for certain types of identities. 
