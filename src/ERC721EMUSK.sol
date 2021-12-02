// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
pragma experimental ABIEncoderV2;
import "./common/Ownable.sol";
import "./interfaces/erc721/IERC721.sol";
// import "./interfaces/erc721/IERC721Metadata.sol";
import "./token/erc721/ERC721Burnable.sol";
import "./token/erc721/ERC721Base.sol";
/**
 * @title ERC721EMUSK
 * @dev anyone can mint token.
 */
contract ERC721EMUSK is Ownable, IERC721, ERC721Burnable, ERC721Base {

    constructor (string memory _name, string memory _symbol, address newOwner, string memory contractURI, string memory tokenURIPrefix) ERC721Base(_name, _symbol, contractURI, tokenURIPrefix) {
        _registerInterface(bytes4(keccak256("MINT_WITH_ADDRESS")));
        transferOwnership(newOwner);
    }

    function mint(uint256 tokenId, uint8 v, bytes32 r, bytes32 s, Fee[] memory _fees, string memory _tokenURI) public {
        require(owner() == ecrecover(keccak256(abi.encodePacked(this, tokenId)), v, r, s), "owner should sign tokenId");
        _mint(msg.sender, tokenId, _fees);
        _setTokenURI(tokenId, _tokenURI);
    }

    function setTokenURIPrefix(string memory tokenURIPrefix) public onlyOwner {
        _setTokenURIPrefix(tokenURIPrefix);
    }

    function setContractURI(string memory contractURI) public onlyOwner {
        _setContractURI(contractURI);
    }
    /**
     * @dev Internal function to burn a specific token.
     * Reverts if the token does not exist.
     * Deprecated, use _burn(uint256) instead.
     * @param owner owner of the token to burn
     * @param tokenId uint256 ID of the token being burned by the msg.sender
     */
    function _burn(address owner, uint256 tokenId) internal virtual override(ERC721, ERC721Base) {
        ERC721Base._burn(owner, tokenId);
    }
    /**
     * @dev Internal function to transfer ownership of a given token ID to another address.
     * As opposed to transferFrom, this imposes no restrictions on msg.sender.
     * @param from current owner of the token
     * @param to address to receive the ownership of the given token ID
     * @param tokenId uint256 ID of the token to be transferred
     */
    function _transferFrom(address from, address to, uint256 tokenId) internal virtual override(ERC721,ERC721Base) {
        ERC721Base._transferFrom(from, to, tokenId);
    }
    /**
     * @dev Internal function to mint a new token.
     * Reverts if the given token ID already exists.
     * @param to The address that will own the minted token
     * @param tokenId uint256 ID of the token to be minted
     */
    function _mint(address to, uint256 tokenId) internal virtual override(ERC721, ERC721Base) {
        ERC721Base._mint(to, tokenId);
    }
}