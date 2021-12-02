
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "../../common/roles/OwnableOperatorRole.sol";
import "../../interfaces/erc721/IERC721.sol";
import "../../interfaces/erc1155/IERC1155.sol";
contract TransferProxy is OwnableOperatorRole {

    function erc721safeTransferFrom(IERC721 token, address from, address to, uint256 tokenId) external onlyOperator {
        token.safeTransferFrom(from, to, tokenId);
    }

    function erc1155safeTransferFrom(IERC1155 token, address from, address to, uint256 id, uint256 value, bytes calldata data) external onlyOperator {
        token.safeTransferFrom(from, to, id, value, data);
    }
}