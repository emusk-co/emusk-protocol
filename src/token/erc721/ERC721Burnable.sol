// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "../../common/Context.sol";
import "./ERC721.sol";
/**
 * @title ERC721 Burnable Token
 * @dev ERC721 Token that can be irreversibly burned (destroyed).
 */
contract ERC721Burnable is Context, ERC721 {
    /**
     * @dev Burns a specific ERC721 token.
     * @param tokenId uint256 id of the ERC721 token to be burned.
     */
    function burn(uint256 tokenId) public {
        //solhint-disable-next-line max-line-length
        require(_isApprovedOrOwner(_msgSender(), tokenId), "ERC721Burnable: caller is not owner nor approved");
        _burn(tokenId);
    }
}
