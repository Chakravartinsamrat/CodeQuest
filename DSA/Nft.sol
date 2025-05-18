// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Nft is ERC721URIStorage, Ownable {
    uint256 public tokenId=0;
    address public initialOwner;
    mapping(uint256 => uint256) public tokenAmount;
    mapping(uint256 => address) public tokenOwner;

    struct Trade {
        address partyA;
        uint256 tokenA;
        address partyB;
        uint256 tokenB;
        bool approvedA;
        bool approvedB;
        bool completed;
    }

    mapping(uint256 => Trade) public trades;
    uint256 public tradeCount;

    event Minted(uint256 indexed tokenId, address indexed owner, string tokenURI, uint256 amount);
    event ApprovedNFT(uint256 indexed tokenId, address indexed owner);
    event TransferredNFT(uint256 indexed tokenId, address indexed from, address indexed to);
    event AmountUpdated(uint256 indexed tokenId, uint256 newAmount);
    event TradeProposed(uint256 tradeId, address indexed partyA, uint256 tokenA, address indexed partyB, uint256 tokenB);
    event TradeApproved(uint256 tradeId, address indexed approver);
    event TradeCompleted(uint256 tradeId, address indexed partyA, uint256 tokenA, address indexed partyB, uint256 tokenB);

    constructor(address _initialOwner) ERC721("Pokemon", "POKE") Ownable(_initialOwner) {
        initialOwner = _initialOwner;
        tokenId = 0;
    }

    function mint(address to, string memory _tokenURI, uint256 _amount) public onlyOwner returns (uint256) {
        tokenId++;
        uint256 newTokenId = tokenId;
        tokenAmount[newTokenId] = _amount;

        _mint(to, newTokenId);
        _setTokenURI(newTokenId, _tokenURI);
        tokenOwner[newTokenId] = to;

        emit Minted(newTokenId, to, _tokenURI, _amount);
        return newTokenId;
    }

    function proposeTrade(uint256 tokenA, uint256 tokenB, address partyB) public {
        require(ownerOf(tokenA) == msg.sender, "You do not own tokenA");
        require(ownerOf(tokenB) == partyB, "PartyB does not own tokenB");

        tradeCount++;
        trades[tradeCount] = Trade({
            partyA: msg.sender,
            tokenA: tokenA,
            partyB: partyB,
            tokenB: tokenB,
            approvedA: false,
            approvedB: false,
            completed: false
        });

        emit TradeProposed(tradeCount, msg.sender, tokenA, partyB, tokenB);
    }

    function approveTrade(uint256 tradeId) public {
        Trade storage trade = trades[tradeId];
        require(!trade.completed, "Trade already completed");

        if (msg.sender == trade.partyA) {
            trade.approvedA = true;
        } else if (msg.sender == trade.partyB) {
            trade.approvedB = true;
        } else {
            revert("You are not part of this trade");
        }

        emit TradeApproved(tradeId, msg.sender);

        if (trade.approvedA && trade.approvedB) {
            executeTrade(tradeId);
        }
    }

    function executeTrade(uint256 tradeId) internal {
        Trade storage trade = trades[tradeId];
        require(trade.approvedA && trade.approvedB, "Both parties must approve");
        require(!trade.completed, "Trade already executed");

        address ownerA = ownerOf(trade.tokenA);
        address ownerB = ownerOf(trade.tokenB);

        _transfer(ownerA, ownerB, trade.tokenA);
        _transfer(ownerB, ownerA, trade.tokenB);

        trade.completed = true;

        emit TradeCompleted(tradeId, ownerA, trade.tokenA, ownerB, trade.tokenB);
    }

    function getTradeStatus(uint256 tradeId) public view returns (bool approvedA, bool approvedB, bool completed) {
        Trade storage trade = trades[tradeId];
        return (trade.approvedA, trade.approvedB, trade.completed);
    }

    function getTokenAmount(uint256 _tokenId) public view returns (uint256) {
        return tokenAmount[_tokenId];
    }

    function approvalNFT(uint256 _tokenID) public {
        require(msg.sender == ownerOf(_tokenID), "You are not the owner of this NFT");
        approve(address(this), _tokenID);
        require(address(this) == getApproved(_tokenID), "NFT is not approved");
        emit ApprovedNFT(_tokenID, msg.sender);
    }

    function transferNFT(address from, address to, uint256 _tokenId) public {
        // require(address(this) == getApproved(_tokenId), "NFT is not approved");
        require(from == ownerOf(_tokenId), "You are not the owner of this NFT");

        // uint256 amount = tokenAmount[_tokenId]; 
        // require(msg.value >= amount, "Insufficient payment for the NFT");

        // payable(from).transfer(amount);
        _transfer(from, to, _tokenId);
        tokenOwner[_tokenId] = to;
        require(to == ownerOf(_tokenId), "NFT is not transferred");

        emit TransferredNFT(_tokenId, from, to);
    }

    function getTokenURI(uint256 _tokenId) public view returns (string memory) {
        return tokenURI(_tokenId);
    }

    function updateAmount(uint256 _tokenId, uint256 _amount) public {
        require(tokenOwner[_tokenId] == msg.sender, "You are not the owner of this NFT");
        tokenAmount[_tokenId] = _amount;

        emit AmountUpdated(_tokenId, _amount);
    }
}