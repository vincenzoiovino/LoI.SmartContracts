# LoI.SmartContracts
This repo contains examples of  Ethereum smart contracts to be used in combination with the [League of Identity](https://github.com/aragonzkresearch/leagueofidentity) (LoI) system.

## LoI for Google Business domains
As an example we provide a template of a DAO whose members can be the owners of emails of the form `user@domain.com` where `domain.com` is a parameter of the DAO.
Only users with such emails can cast votes for proposals. Moreover, the content of a proposal is encrypted: only owners of emails that end in `@domain.com` can read the proposal.

