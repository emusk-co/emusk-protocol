// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
pragma experimental ABIEncoderV2;
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "./common/Ownable.sol";
import "./interfaces/IERC20.sol";
import "./libraries/SafeMath.sol";
import "./libraries/TransferHelper.sol";

contract TokenPresale is Ownable, ReentrancyGuard {
    using SafeMath for uint256;

    uint256 private _rate;
    IERC20 public depositToken;

    bool public isPaused;
    uint256 public endICO;
    uint256 public minPurchase;
    uint256 public maxPurchase;

    uint256 private _availableICOAmount;
    uint256 private _weiRaised;

    event TokenPurchased(address indexed purchaser, uint256 value, uint256 amount);

    constructor(uint256 rate, address depositTokenAddress) {
        require(rate > 0, "rate should be greater 0");
        require(depositTokenAddress != address(0), "deposit token can't be zero address");
        _rate = rate;
        depositToken = IERC20(depositTokenAddress);
    }

    function startICO(
        uint256 endDate,
        uint256 _minPurchase,
        uint256 _maxPurchase
    ) external onlyOwner {
        require(endDate > block.timestamp, "end date is invalid.");
        endICO = endDate;
        minPurchase = _minPurchase;
        maxPurchase = _maxPurchase;
    }

    function buyTokens() external payable nonReentrant icoActive {
        require(msg.value > minPurchase, "too small value");
        uint256 tokenAmount = _getTokenAmount(msg.value);
        _availableICOAmount -= tokenAmount;
        _weiRaised += msg.value;
        TransferHelper.safeTransfer(address(depositToken), _msgSender(), tokenAmount);
        emit TokenPurchased(_msgSender(), msg.value, tokenAmount);
    }

    function depositICOTokens(uint256 depositAmount) external onlyOwner {
        _availableICOAmount += depositAmount;
        TransferHelper.safeTransferFrom(address(depositToken), msg.sender, address(this), depositAmount);
    }

    function takeICOTokens(uint256 tokenAmount) external onlyOwner {
        require(_availableICOAmount > tokenAmount, "insufficient token balance");
        _availableICOAmount -= tokenAmount;
        TransferHelper.safeTransfer(address(depositToken), _msgSender(), tokenAmount);
    }

    function _getTokenAmount(uint256 weiAmount) internal view returns (uint256) {
        return weiAmount.mul(_rate).div(10**18);
    }

    function withdraw() external onlyOwner {
        require(address(this).balance > 0, "Contract has no balance");
        payable(msg.sender).transfer(address(this).balance);
    }

    function setDepositToken(address depositTokenAddress) external onlyOwner {
        depositToken = IERC20(depositTokenAddress);
    }

    function setRate(uint256 newRate) external onlyOwner {
        _rate = newRate;
    }

    function setAvaialbleTokens(uint256 newAmount) external onlyOwner {
        _availableICOAmount = newAmount;
    }

    function weiRaised() public view returns (uint256) {
        return _weiRaised;
    }

    function getRate() public view returns (uint256) {
        return _rate;
    }

    modifier icoActive() {
        require(endICO > block.timestamp && _availableICOAmount > 0, "ico should be active");
        _;
    }
}
