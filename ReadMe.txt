
-- deploy 
 npx hardhat deploy --network kovan  
-- verify exchange contract
npx hardhat verify --network kovan  0x546c7C7D95c4d38a65EFeF3e0aC5fe3cD36b4F86 "0x092a2e2ddd8bbf36de0a06b35e4473a5c2c7f7f7" "0xa17bda5ee019c9a77a94c77567dbbdcb9588c133"  "0x3d061f687ec833c5af5a6077702ae45ca62d5256" "0x30e3bdce14a7ade31d88c2f3bd6e47167c6464a3" "0x8c4f213d6ec0d48db1cd736670d0d4180e558fc6" "0x3814de21909d4c14d166898f1a2510dba0c8702d" "0x80aea81791ded20568221346c79b0ad4e0890faa"
npx hardhat verify --network kovan 0x6a10A46F4692b4F44BDB8A11ae457542641760C2 "ERC721EMUSK" "EMUSK" "0x80aea81791ded20568221346c79b0ad4e0890faa" "https://api.emusk.com/contractMetadata/{address}" "https://ipfs.io/"
npx hardhat verify --network kovan 0x40A2d5ABE17B0B77a050e6c33102937aab476EcC "ERC1155EMUSK" "EMUSK" "0x80aea81791ded20568221346c79b0ad4e0890faa" "https://api.emusk.com/contractMetadata/{address}" "https://ipfs.io/"

-- test running contracts
npx hardhat run scripts/exchange.js
