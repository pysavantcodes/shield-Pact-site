export const tokenABI = [
	"function name() external view returns (string)",
	"function symbol() external view returns (string)",
	"function decimals() external view returns (uint8)",
	"function totalSupply() external view returns (uint256)",
	"function balanceOf(address) external view returns (uint256)",
	"function allowance(address, address) external view returns (uint256)",
	"function approve(address, uint256) external returns (bool)",
	"function owner() public view returns (address)"
];

export const nftABI = [...tokenABI,
  "function getApproved(uint256) public view returns(address)",
  "function mint(string) public",
  "function itemCreated() public view returns (uint256[])",
  "function ownerOf(uint256) public view returns (address)",
  "function itemInfo(uint256 itemId) public view returns (tuple( string cid, uint256 created))",
  "event Approval(address indexed owner, address indexed approved, uint256 indexed tokenId)",
  "event Minted(address minter, uint256 itemId)",
];

export const marketABI = [
  "function owner() public view returns(address)",
  "function busdAddress() public view returns(address)",
  "function sellItem(uint256, uint256, bool) public",
  "function get20Products(uint32) public",
  "function toggleForSale(uint256) public",
  "function purchaseItemBNB(uint256) public payable",
  "function purchaseItemBUSD(uint256) public",
  "function withdrawBUSD() public",
  "function withdrawBNB() public",
  "function productInfo(uint256 productId) public view returns(tuple(uint256 price, bool isBNB, bool forSale))",
  "function totalInterestBNB() public view returns(uint256)",
  "function totalInterestBUSD() public view returns(uint256)",
  "function feePercent() public view returns(uint32)",
  "event ProductCreated(address owner, uint256 productId)",
  "event ProductUpdated(address owner, uint256 productId)",
  "event ProductAdded(uint256 productId)",
  "event ProductRemoved(uint256 productId)",
  "event ProductPurchased(address seller, address buyer, uint256 productId, uint256 price)"
];


export const tokenFactoryABI= [
  "function createStandardToken(string memory name, string memory symbol, uint8 decimals, uint256 totalSupply) public payable",
  "function createReflectToken(string memory name, string memory symbol, uint8 decimals, uint256 totalSupply) public payable",
  "function createLiquidToken(string memory name, string memory symbol, uint8 decimals, uint256 totalSupply, uint16 taxBps, uint16 liqBps) public payable",
  "function createdToken() public view returns (address[] memory)",
  "function getRecievedFee() public view returns (uint256)",
  "function withdrawFee() public",
  "function fee() public view returns (uint256)",
  "function allTokens(uint256) public view returns (address)",
  "event TokenCreated(address creator, address token)",
  "event FeeWithdrawn(uint256 amount)",
  "function owner() public view returns (address)"
];


export const launchFactoryABI = [
  "function getRecievedFee() public view returns (uint256)",
  "function withdrawFee() public",
  "function allPads(uint256) public view returns(address)",
  "function fee() public view returns(uint256)",
  "function owner() public view returns(address)",
  `function totalTokenNeeded(
    uint256 capped_,
    uint256 saleRate_,
    uint256 dexRate_,
    uint16 dexBps_,
    uint16 bnbFeeBps_,
    uint16 tkFeeBps_) public view returns (uint256)`,
  "function createdPad() public view returns (address[] memory)",
  "function lengthOfAllPads() public view returns (uint256)",
  `function createPad(
        uint8 _launchType,
        address token_,
        bool payTypeIsBNB,
        uint256 _capped,
        uint16 _dexBps,
        uint256[] memory _preDexRate,
        uint256[] memory MinMaxBuy,
        uint256[] memory _startEndTime,
        uint256 _lpLockPeriod,
        string memory _CID,
        bool _enableWhiteList
    )public payable`,

      `function pank(
        uint8 _launchType,
        address token_,
        bool[] calldata payTypeIsBNB_enableWhiteList,
        uint16[] calldata _dexBps_lpLockPeriod,
        uint256[] calldata _capped_preDexRate_MinMaxBuy_startEndTime,
        string calldata _CID
        )external payable`,
    "event PadCreated(address creator, address pad)",
    "event FeeWithdrawn(uint256 amount)"

  ]

export const launchPadABI = [
  "function dexBps() public view returns(uint16)",
  "function capped() public view returns(address)",
  "function saleToken() public view returns(address)",
  "function buyToken() public view returns(address)",
  "function infoHash() public view returns(string memory)",
  "function tokenForPreSale() public view returns(uint256)",
  "function tokenForDexSale() public view returns(uint256)",
  "function preSaleRate() public view returns(uint256)",
  "function dexSaleRate() public view returns(uint256)",
  "function payType() public view returns(uint8)",
  "function startTime() public view returns(uint256)",
  "function endTime() public view returns(uint256)",
  "function dexPercent() public view returns(uint256)",
  "function LpTokenLockPeriod() public view returns(uint256)",
  "function minPurchasePrice() public view returns(uint256)",
  "function maxPurchasePrice() public view returns(uint256)",
  "function totalParticipant() public view returns(uint256)",
  "function totalSale() public view returns(uint256)",
  "function enableWhiteList() public view returns(address)",
  "function calculateToken(uint256 amount) public view returns(uint256)",
  "function owner() public view returns(address)",
  "function remainingToken() public view returns(uint256)",
  "function investedAmount(address) public view returns(uint256)",
  "function purchaseTokenByBNB() payable public",
  "function purchaseTokenByToken(uint256 amount) public",
  "function preSaleCompleted() public view returns(bool)",
  "function completePreSale() public"
  ]

export const stakeABI = [
    "function owner() public view returns(address)",
    "function WBNB() public view returns(address)",
    "function stakeInterest(address, address) public view returns(tuple(uint256 reward, uint256 totalRewardAmount, uint256 duration))",
    "function stakeBNB(address) public payable",
    "function stakeToken(address sTk, address bTk, uint256 amount)",
    "function claim(uint256) public",
    "function setStakeableBNB(address bToken, uint256 _amount, uint256 _reward, uint256 _totalRewardAmount, uint256 _duration)",
    "function setStakeable(address sToken, address bToken, uint256 _amount, uint256 _reward, uint256 _totalRewardAmount, uint256 _duration)",
    "function getOwnedStake() public view returns(uint256[])",
    `function bank(address, uint256) public view returns(tuple( 
      uint256 id,
        address sTk,
        address bTk,
        uint256 amount,
        uint256 endTime,
        uint256 reward))`

]