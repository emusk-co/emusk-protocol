// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
pragma experimental ABIEncoderV2;
import "./common/Ownable.sol";
import "./common/roles/SignerRole.sol";
import "./token/erc1155/ERC1155Base.sol";
contract ERC1155EMUSK is Ownable, SignerRole, ERC1155Base {
    string public name;
    string public symbol;

    constructor(string memory _name, string memory _symbol, address signer, string memory contractURI, string memory tokenURIPrefix) ERC1155Base(contractURI, tokenURIPrefix) {
        name = _name;
        symbol = _symbol;

        _addSigner(signer);
        _registerInterface(bytes4(keccak256("MINT_WITH_ADDRESS")));
    }

    function mint(uint256 id, uint8 v, bytes32 r, bytes32 s, Fee[] memory fees, uint256 supply, string memory uri) public {
        require(isSigner(ecrecover(toEthSignedMessageHash(keccak256(abi.encodePacked(this, id))), v, r, s)), "signer should sign tokenId");
        _mint(id, fees, supply, uri);
    }

    function toEthSignedMessageHash(bytes32 hash) internal pure returns (bytes32)
    {
        return keccak256(
            abi.encodePacked("\x19Ethereum Signed Message:\n32", hash)
        );
    }

    function encodePackedData(uint256 id) public view returns (bytes32) {
        return keccak256(abi.encodePacked(this, id));
    }


    function getecrecover(uint256 id, uint8 v, bytes32 r, bytes32 s) public view returns (address) {
        return ecrecover(toEthSignedMessageHash(keccak256(abi.encodePacked(this, id))), v, r, s);
    }
}
