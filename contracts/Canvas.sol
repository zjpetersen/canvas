pragma solidity ^0.8.4;

contract Canvas {
    struct Section {
        address payable owner;
        string encodedColor;
        bytes colorBytes;
        uint offer;
        uint ask;
        bool updatedColor;
        address offerer;
        bool hasOwner;
    }

    Section[100] public sections;
    mapping(address => uint) pendingReturns;
    address public admin;

    event SectionPurchased(uint sectionId, address buyer, address seller, uint price);
    event AskUpdated(uint sectionId, address owner, uint ask);
    event ColorUpdated(uint sectionId, address owner, string updatedColor);
    event ColorBytesUpdated(uint sectionId, address owner, bytes updatedColor);

    /// The region id must be 0-99
    error InvalidRegion();

    constructor() {
        admin = msg.sender;

        //TODO delete these methods used for testing
        getSectionForFree(10);
        setColor(10, "blue");
    }

    function getOwner(uint regionId) public view returns (address) {
        return getValidRegion(regionId).owner;
    }

    function getOffer(uint regionId) public view returns (uint) {
        return getValidRegion(regionId).offer;
    }

    function getColor(uint regionId) public view returns (string memory) {
        return getValidRegion(regionId).encodedColor;
    }

    function getColorBytes(uint regionId) public view returns (bytes memory) {
        return getValidRegion(regionId).colorBytes;
    }

    function getSection(uint regionId) public view returns (Section memory) {
        return getValidRegion(regionId);
    }

    function getSections() public view returns (Section[100] memory) {
        return sections;
    }

    function getSectionForFree(uint sectionId) public {
        Section storage section = getValidRegion(sectionId);
        require(!section.hasOwner);

        section.owner = payable(msg.sender);
        section.hasOwner = true;
    }

    function ask(uint regionId, uint askPrice) public {
        Section storage section = getValidRegion(regionId);
        require(isOwner(section));

        section.ask = askPrice;
        emit AskUpdated(regionId, msg.sender, askPrice);
    }

    function acceptAsk(uint regionId) public payable {
        Section storage section = getValidRegion(regionId);
        if (section.ask == 0) {
            revert("There isn't an ask for this section");
        }
        if (msg.value != section.ask) {
            revert("Value does not match ask");
        }

        addPendingReturn(section);
        address payable oldOwner = section.owner;
        section.owner = payable(msg.sender);
        section.updatedColor = false;
        section.offer = 0;
        section.ask = 0;
        emit SectionPurchased(regionId, msg.sender, oldOwner, msg.value);

        oldOwner.transfer(msg.value);
    }

    function setColor(uint regionId, string memory color) public {
        Section storage section = getValidRegion(regionId);
        require(isOwner(section));
        require(!section.updatedColor);
        //TODO validate color string

        section.encodedColor = color;
        section.updatedColor = true;
        emit ColorUpdated(regionId, msg.sender, color);
    }

    function setColorBytes(uint regionId, bytes memory color) public {
        Section storage section = getValidRegion(regionId);
        require(isOwner(section));
        require(!section.updatedColor);
        //TODO validate color string

        section.colorBytes = color;
        section.updatedColor = true;
        emit ColorBytesUpdated(regionId, msg.sender, color);
    }

    function getValidRegion(uint regionId) private view returns (Section storage) {
        require(regionId >= 0 && regionId < 100);
        return sections[regionId];
    }

    function addPendingReturn(Section memory section) private {
        if (section.offerer != address(0)) {
            pendingReturns[section.offerer] += section.offer;
        }

    }

    function isOwner(Section memory section) private view returns (bool) {
        if (msg.sender == section.owner) {
            return true;
        }
        return false;
        

    }


 
}