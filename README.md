# LoI.SmartContracts
This repo contains examples of  Ethereum smart contracts to be used in combination with the [League of Identity](https://github.com/aragonzkresearch/leagueofidentity) (LoI) system.

## Blik for web3
[Here](https://hackmd.io/noiVZo2dTJ6Wiejt2IJvMg?view#Polish-BLIK-for-web3) we described applications of `LoI` to a sort of BLIK system for web3 that we call `Blik3`. In `Blik3` Alice can make a deposit in favour of Bob by just specifying Bob's email address and nobody, except Bob, will be able to see that the deposit is in favour of him.
Note that this on-chain payment system can be seen as a variant of the [Bank3 for Wallets](https://github.com/vincenzoiovino/bank3) system.
We implemented the idea in the contract [`Blik.sol`](https://github.com/vincenzoiovino/LoI.SmartContracts/blob/main/src/Blik.sol) that can be used in combination with `LoI` tools as follows.
The system has two variants, a basic one that can be used when Alice and Bob communicate at deposit time and a general one that does not need pre-communication. The reason on why the basic variant can be used only when Alice and Bob communicate at deposit time is that if the basic variant were used naively without pre-communication then Alice could perform an alleged deposit in favour of Bob but Alice could still know the witness that can be used to perform the withdrawal, that is even if Bob verifies that there is a deposit in favour of himself this would not be sufficient to exclude that Alice can claim it back. For this reason, this variant can be used only in a setting where, at deposit time, it is Bob the one to compute the ciphertext and request Alice to deposit it onchain along with the coins. The general one does not suffer this issue. 


### How to Test the basic and general variants
We assume the reader familiar with the basic `LoI` commands described [here](https://github.com/aragonzkresearch/leagueofidentity) and we assume that the contract `Blik.sol` has been deployed to Ethereum.

Precisely, recall that when you compute the master public key with the command:
```bash
node compute_shares -t 2 -n 3 --ethereum
```
you will get an output that contains the following lines (among others):
```bash
reconstructed master public key: 1 23898a0ae202d5b67a91f2074176cb8dabd3399fecfbd7022aa39c80b66fa066 1e4d9b127927dfc64355a53b75d6b03d92eedf5bd9b660f76d085b236c63c38a 2abbd2f34f5fbb09e6d7474a4037d0e300b9eb00df83db94c5e521fffc43893c 2dddbf99aaabe6352a17aba4a7bbd5a8eb2eb40d25f95ee6f9b10e2cf8c564a4
reconstructed master public key as Ethereum tuple: [[13706502950207910343706560538280652811815673551122904553485492739850509730698,16073960482686030108142259199455609210079009765551608569343005038231348551782],[20745873763960892318317663603992660951953361594491582428518987779361705649316,19328995967969664651933314377729245708471534526295335040608300242158949206332]]
```

In that case, we suppose that the file `mpk` contains the first string (i.e., `1 23898a0ae202d5b67a91f2074176cb8dabd3399fecfbd7022aa39c80b66fa066 1e4d9b127927dfc64355a53b75d6b03d92eedf5bd9b660f76d085b236c63c38a 2abbd2f34f5fbb09e6d7474a4037d0e300b9eb00df83db94c5e521fffc43893c 2dddbf99aaabe6352a17aba4a7bbd5a8eb2eb40d25f95ee6f9b10e2cf8c564a4`) and the `Blik.sol` contract must be initialized with the latter string (i.e., `[[13706502950207910343706560538280652811815673551122904553485492739850509730698,16073960482686030108142259199455609210079009765551608569343005038231348551782],[20745873763960892318317663603992660951953361594491582428518987779361705649316,19328995967969664651933314377729245708471534526295335040608300242158949206332]]`). 

#### Make a deposit in the basic variant
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

#### Make a withdrawal in the basic variant
Bon sees the transaction for the deposit corresponding to `h` and the hex string `CT` and save it ino the file `ciphertext`.
Bob can now get his Google access token via the `LoI` web interface and use it to get a token for his email address from the `LoI` nodes and does the follwing. Suppose that Bob has stored the token into the file `google_tok`.

Run the command:
```bash
node decrypt -k "$(cat mpk)" -T "$(cat google_tok)"  -e bob@oldcrypto.com -c "$(cat ciphertext)"  --ethereum -t -h -hm
```
This will output an hex string of the form `fd5daac9cd0e8b4e1f80d34c8ff90b35cc5450eaf6422168b3f50402da88f865`. Let `x` be the previous string with `0x` prepended.
Bob can now invoke the method `MakeWithdrawal` of `Blik.sol` with input `h` and `x`. This will transfer the `n` coins from the contract to Bob.


#### Make a deposit in the general variant
Suppose Alice wants to make a deposit of `n` coins in favour of Bob who owns the email address `bob@oldcrypto.com`. We suppose that `oldcrypto.com` is a Google Business domain.
Alice does the following. 

Run the command:
```bash
node encrypt.js -k "$(cat mpkbn)" -e alice@oldcrypto.com   --cca2 --ethereum -bf hash -oc ciphertext  -t -h
```
This command will write into the file `ciphertext` a string of the form `32647a7236776532` and in the file `hash` a string containing an EC point.
Moreover, the output will include a message like:
```bash
value D as ethereum tuple: [20039651900519730257582757773924744163471503432786585826868686284353366380540,5916035560252728744096875982989936654058849764497868132090780995319525482272]
```
Let us call `CT` the first string with `0x` prepended (i.e. `0x32647a7236776532`) and `D` the latter string (i.e., `[20039651900519730257582757773924744163471503432786585826868686284353366380540,5916035560252728744096875982989936654058849764497868132090780995319525482272]`).

Alice can invoke the method `MakeDepositFill` of the `Blik` contract with the so given parameters `D` and `CT` along with a transfer of `n` coins.
The coins have been now deposited into the contract and it is not visibile to anyone, except to Bob, that the deposit is in favour of `bob@oldcrypto.com`.
#### Verify that there is a payment in favour of yourself
Bob can at any time get the values `CT` and `D` from the chain and store them resp. in the files `ciphertext` and `hash`.
(Precisely, the file `hash` should contain the point `D` in the format expected by the `mcl` library. We are supposing that this has been already done. As TODO, the file `hash` input to the next command should contain a point in the ethereum tuple format and convert it internally.)
Bob can now get his Google access token via the `LoI` web interface and use it to get a token for his email address from the `LoI` nodes and does the follwing. Suppose that Bob has stored the token into the file `google_tok`.
Bob can run the following command:
```bash
node decrypt.js -T "$(cat google_tok)" -k "$(cat mpkbn)" -e mrguizzo@gmail.com --ethereum --cca2 -c "$(cat ciphertext)" -bfi hash --addr "6A38Ea6a701c568545dCfcB03FcB875f56beddD4" -t -h -hm
``` 
In the latter command, the option `addr` takes as parameter the Bob's Ethereum address (without `0x` prepended) that we will henceforth denotes as `addr`.
The command wil give an output like:
```bash
DEBUG: Verification of token: success.
{
 "data": {
             "success:": "1",
             "ciphertext:": "0x32633471356f7133",
             "addr:": "5B38Da6a701c568545dCfcB03FcB875f56beddC4",
             "MPK:": "[[17650401953877851439635577206110766953856761406923475418003307457561889540315,21200720758627169108385381836933178062103968834651067635052438190446348782562],[19663398795984464822343332592454950952846592629461984989829477392159714729078,21167609696476223494515294740194964327788425825089244977948745836321546859634]]",
             "D:": "[20039651900519730257582757773924744163471503432786585826868686284353366380540,5916035560252728744096875982989936654058849764497868132090780995319525482272]",
             "pi_as_ethereum_tuple:": "[[20039651900519730257582757773924744163471503432786585826868686284353366380540,5916035560252728744096875982989936654058849764497868132090780995319525482272],[17964776762919115480908951166088615983588472323663818354342475952795604807310,6026072288148381358375565042527336562160721558147760609754174411574469710041],[17896744319167655821192979500890807436364245859728727217059398812965234769019,14902363746557910617337415691210656913190411209282532776782689108758256696992],[21619743767606051892633712027137783914414978270016625281386141462123867712341,5450653621643048376967433768114031560732860631210870758560469946337282342214],16948305800401486008714704305374081004295372365741481924480239224850706571412]",
            }
}
decrypted flag+message: 1daa239b83f75f89f415c03c9f856378eb51480784a1e48e9d6fd65b5ebcb6116
```
The field ``success` in the JSON string indicates that the deposit is withdrawable. In that case the ethereum tuples ``pi_as_ethereum_tuple`` is the witness that Bob can use to perform a withdrawal. Henceforth we will indicate such a tuple as ``pi``.


#### Make a withdrawal in the general variant
After that Bob has verified above that a certain deposit is in favour of himself, Bob can decide to withdraw by 
invoking the method `MakeWithdrawalFull` of `Blik.sol` with input the above string `pi`. This will transfer the `n` coins from the contract to Bob.
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

Deploy the contract with the parameters ``mpk`` set to the latter tuple (i.e., ``[[13706502950207910343706560538280652811815673551122904553485492739850509730698,16073960482686030108142259199455609210079009765551608569343005038231348551782],[20745873763960892318317663603992660951953361594491582428518987779361705649316,19328995967969664651933314377729245708471534526295335040608300242158949206332]]``) and domain set to the domain of your organisation.
Moreover, store the first string (i.e., ``1 23898a0ae202d5b67a91f2074176cb8dabd3399fecfbd7022aa39c80b66fa066 1e4d9b127927dfc64355a53b75d6b03d92eedf5bd9b660f76d085b236c63c38a 2abbd2f34f5fbb09e6d7474a4037d0e300b9eb00df83db94c5e521fffc43893c 2dddbf99aaabe6352a17aba4a7bbd5a8eb2eb40d25f95ee6f9b10e2cf8c564a4``) in the file ``mpk`` that will be used for next commands.

##### Register a user in the DAO
Suppose the user Alice who owns the email ``alice@oldcrypto.com`` wants to register in the DAO.

Alice gets her Google access token via the `LoI` web interface and stores it in the file ``google_at`` and performs off-chain e.g. the following commands:

```bash
node get_token.js -t 2 -n 3 -A $(cat google_at) -l 1 http://localhost:8001 2 http://localhost:8002 -ot google_tok --ethereum -m 1.2024
node get_token.js -t 2 -n 3 -A $(cat google_at) -l 1 http://localhost:8001 2 http://localhost:8002 -ot google_tokgroup --ethereum -m 1.2024
```
She will get two crypto tokens, the token ``google_tok`` for her personl account ``alice@oldcrypto.com`` and the token ``google_tokgroup`` for the entire group ``oldcrypto.com`` that will allow her to read encrypted proposals.
Note that we used parameter `-m 1.2024` to get a token for the month of February 2024, change it according to your current date.

Suppose Alice's Eth address is stored in the file ``addr`` (the address is the hexadecimal string without `0x` prepended).
Alice can compute the following signature:
```bash
node sign -k "$(cat mpk)" -T "$(cat google_tok)" -e alice@oldcrypto.com -os signature.json -j -h --ethereum < addr
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

#### Read an encrypted proposal
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
