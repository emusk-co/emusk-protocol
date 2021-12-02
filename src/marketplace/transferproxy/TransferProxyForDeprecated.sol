// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "../../common/roles/OwnableOperatorRole.sol";
import "../../interfaces/erc721/IERC721.sol";
contract TransferProxyForDeprecated is OwnableOperatorRole {

    function erc721TransferFrom(IERC721 token, address from, address to, uint256 tokenId) external onlyOperator {
        token.transferFrom(from, to, tokenId);
    }
}