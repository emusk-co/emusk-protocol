// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "../shared/HasSecondarySaleFees.sol";
import "../shared/HasContractURI.sol";
import "../shared/HasTokenURI.sol";
import "./ERC721.sol";
import "./ERC721Enumerable.sol";

/**
 * @title Full ERC721 Token with support for tokenURIPrefix
 * This implementation includes all the required and some optional functionality of the ERC721 standard
 * Moreover, it includes approve all functionality using operator terminology
 * @dev see https://eips.ethereum.org/EIPS/eip-721
 */
contract ERC721Base is HasSecondarySaleFees, ERC721, HasContractURI, HasTokenURI, ERC721Enumerable {
    // Token name
    string public name;

    // Token symbol
    string public symbol;

    struct Fee {
        address payable recipient;
        uint256 value;
    }

    // id => fees
    mapping (uint256 => Fee[]) public fees;

    /*
     *     bytes4(keccak256('name()')) == 0x06fdde03
     *     bytes4(keccak256('symbol()')) == 0x95d89b41
     *     bytes4(keccak256('tokenURI(uint256)')) == 0xc87b56dd
     *
     *     => 0x06fdde03 ^ 0x95d89b41 ^ 0xc87b56dd == 0x5b5e139f
     */
    bytes4 private constant _INTERFACE_ID_ERC721_METADATA = 0x5b5e139f;

    /**
     * @dev Constructor function
     */
    constructor (string memory _name, string memory _symbol, string memory contractURI, string memory _tokenURIPrefix) HasContractURI(contractURI) HasTokenURI(_tokenURIPrefix) {
        name = _name;
        symbol = _symbol;

        // register the supported interfaces to conform to ERC721 via ERC165
        _registerInterface(_INTERFACE_ID_ERC721_METADATA);
    }

    function getFeeRecipients(uint256 id) public view virtual override returns (address payable[] memory) {
        Fee[] memory _fees = fees[id];
        address payable[] memory result = new address payable[](_fees.length);
        for (uint i = 0; i < _fees.length; i++) {
            result[i] = _fees[i].recipient;
        }
        return result;
    }

    function getFeeBps(uint256 id) public view virtual override returns (uint[] memory) {
        Fee[] memory _fees = fees[id];
        uint[] memory result = new uint[](_fees.length);
        for (uint i = 0; i < _fees.length; i++) {
            result[i] = _fees[i].value;
        }
        return result;
    }

    function _mint(address to, uint256 tokenId, Fee[] memory _fees) internal {
        _mint(to, tokenId);
        address[] memory recipients = new address[](_fees.length);
        uint[] memory bps = new uint[](_fees.length);
        for (uint i = 0; i < _fees.length; i++) {
            require(_fees[i].recipient != address(0x0), "Recipient should be present");
            require(_fees[i].value != 0, "Fee value should be positive");
            fees[tokenId].push(_fees[i]);
            recipients[i] = _fees[i].recipient;
            bps[i] = _fees[i].value;
        }
        if (_fees.length > 0) {
            emit SecondarySaleFees(tokenId, recipients, bps);
        }
    }

    /**
     * @dev Returns an URI for a given token ID.
     * Throws if the token ID does not exist. May return an empty string.
     * @param tokenId uint256 ID of the token to query
     */
    function tokenURI(uint256 tokenId) external view virtual returns (string memory) {
        require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");
        return super._tokenURI(tokenId);
    }

    /**
     * @dev Internal function to set the token URI for a given token.
     * Reverts if the token ID does not exist.
     * @param tokenId uint256 ID of the token to set its URI
     * @param uri string URI to assign
     */
    function _setTokenURI(uint256 tokenId, string memory uri) internal virtual override {
        require(_exists(tokenId), "ERC721Metadata: URI set of nonexistent token");
        super._setTokenURI(tokenId, uri);
    }

    /**
     * @dev Internal function to burn a specific token.
     * Reverts if the token does not exist.
     * Deprecated, use _burn(uint256) instead.
     * @param owner owner of the token to burn
     * @param tokenId uint256 ID of the token being burned by the msg.sender
     */
    function _burn(address owner, uint256 tokenId) internal virtual override(ERC721, ERC721Enumerable) {
        ERC721Enumerable._burn(owner, tokenId);
        _clearTokenURI(tokenId);
    }
    /**
     * @dev Internal function to transfer ownership of a given token ID to another address.
     * As opposed to transferFrom, this imposes no restrictions on msg.sender.
     * @param from current owner of the token
     * @param to address to receive the ownership of the given token ID
     * @param tokenId uint256 ID of the token to be transferred
     */
    function _transferFrom(address from, address to, uint256 tokenId) internal virtual override(ERC721,ERC721Enumerable) {
        ERC721Enumerable._transferFrom(from, to, tokenId);
    }
        /**
     * @dev Internal function to mint a new token.
     * Reverts if the given token ID already exists.
     * @param to The address that will own the minted token
     * @param tokenId uint256 ID of the token to be minted
     */
    function _mint(address to, uint256 tokenId) internal virtual override(ERC721, ERC721Enumerable) {
        ERC721Enumerable._mint(to, tokenId);
    }
}
