
-- deploy 
 npx hardhat deploy --network kovan  
-- verify exchange contract on kovan
npx hardhat verify --network kovan  0x546c7C7D95c4d38a65EFeF3e0aC5fe3cD36b4F86 "0x092a2e2ddd8bbf36de0a06b35e4473a5c2c7f7f7" "0xa17bda5ee019c9a77a94c77567dbbdcb9588c133"  "0x3d061f687ec833c5af5a6077702ae45ca62d5256" "0x30e3bdce14a7ade31d88c2f3bd6e47167c6464a3" "0x8c4f213d6ec0d48db1cd736670d0d4180e558fc6" "0x3814de21909d4c14d166898f1a2510dba0c8702d" "0x80aea81791ded20568221346c79b0ad4e0890faa"
npx hardhat verify --network kovan 0x6a10A46F4692b4F44BDB8A11ae457542641760C2 "ERC721EMUSK" "EMUSK" "0x80aea81791ded20568221346c79b0ad4e0890faa" "https://api.emusk.com/contractMetadata/{address}" "https://ipfs.io/"
npx hardhat verify --network kovan 0x40A2d5ABE17B0B77a050e6c33102937aab476EcC "ERC1155EMUSK" "EMUSK" "0x80aea81791ded20568221346c79b0ad4e0890faa" "https://api.emusk.com/contractMetadata/{address}" "https://ipfs.io/"

-- verify exchange contract on bsc
npx hardhat verify --network bsc 0xcc22b79de394ef078c8583e5b55ce819892d1ae5 "0xeaa1fed18bc08bdee188abb34239884597b88e1a" "0xc2bb46c09d9ee587a22d776404a45b3a5244a228" "0x1b0555645079b0e4e2953195c215e08d6fc78709" "0x13a60e9ab67b629a8c2499865d77f3c7b28f1db7" "0xec9fdf5c7aeb89ecb829bf7b00b67ad15907e58b" "0xaefaf0d3716431417af27d0d736f71b3ccf507a6" "0x80aea81791ded20568221346c79b0ad4e0890faa"
npx hardhat verify --network bsc 0xeaA75F2644892034C8C4dc6cF8ffD4E1a7192B74 "ERC721EMUSK" "EMUSK" "0x80aea81791ded20568221346c79b0ad4e0890faa" "https://api.emusk.com/contractMetadata/{address}" "https://ipfs.io/"
npx hardhat verify --network bsc 0x08a481B20aAcD934d87243fDB60d4423A7312275 "ERC1155EMUSK" "EMUSK" "0x80aea81791ded20568221346c79b0ad4e0890faa" "https://api.emusk.com/contractMetadata/{address}" "https://ipfs.io/"

-- test running contracts
npx hardhat run scripts/exchange.js
