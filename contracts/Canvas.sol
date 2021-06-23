pragma solidity ^0.8.4;

contract Canvas {
    struct Section {
        address payable owner;
        bytes colorBytes;
        uint ask;
        bool updatedColor;
        bool hasOwner;
    }

    struct Offer {
        address payable offerer;
        uint amount;
    }

    Section[100] public sections;
    //key: sectionId, value: offers array
    mapping(uint => Offer[]) offerMap;
    // mapping(uint => mapping(address => uint)) offerMap;
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
    }

    function getOwner(uint sectionId) public view returns (address) {
        return getValidRegion(sectionId).owner;
    }

    function getColorBytes(uint sectionId) public view returns (bytes memory) {
        return getValidRegion(sectionId).colorBytes;
    }

    function getAsk(uint sectionId) public view returns (uint) {
        return getValidRegion(sectionId).ask;
    }

    function getSection(uint sectionId) public view returns (Section memory) {
        return getValidRegion(sectionId);
    }

    function getSections() public view returns (Section[100] memory) {
        return sections;
    }

    function getOffersForSection(uint sectionId) public view returns (Offer[] memory) {
        getValidRegion(sectionId);

        return offerMap[sectionId];
    }

    function getSectionForFree(uint sectionId) public {
        Section storage section = getValidRegion(sectionId);
        require(!section.hasOwner);

        section.owner = payable(msg.sender);
        section.hasOwner = true;
    }


    //Trading functions
    function ask(uint sectionId, uint amount) public {
        Section storage section = getValidRegion(sectionId);
        require(isOwner(section));

        Offer[] storage offers = offerMap[sectionId];
        Offer memory highestOffer;
        uint position;
        for (uint i = 0; i < offers.length; i++) {
            if (offers[i].amount >= amount && highestOffer.amount < amount) {
                highestOffer = offers[i];
            }
            position = i;
        }

        if (highestOffer.amount >= amount) {
            revert("There is already an offer at or above the ask price, use acceptOffer instead");
        }

        section.ask = amount;
        emit AskUpdated(sectionId, msg.sender, amount);
    }

    function removeAsk(uint sectionId) public {
        Section storage section = getValidRegion(sectionId);
        require(isOwner(section));

        section.ask = 0;
        emit AskUpdated(sectionId, msg.sender, 0);
    }

    function acceptAsk(uint sectionId) public payable {
        Section storage section = getValidRegion(sectionId);
        require(!isOwner(section));
        if (section.ask == 0) {
            revert("There isn't an ask for this section");
        }
        if (msg.value != section.ask) {
            revert("Value does not match ask");
        }

        addPendingReturn(section);
        updateOwner(section, sectionId, msg.sender, msg.value);
    }

    function offer(uint sectionId) public payable {
        Section storage section = getValidRegion(sectionId);
        require(!isOwner(section));
        if (section.ask != 0 && section.ask < msg.value) {
            revert("There is already an ask lower than the offer, resend with the ask price");
        } else if (section.ask != 0 && section.ask == msg.value) { //Accept the offer right away
            // addPendingReturn(msg.value - section.ask);
            updateOwner(section, sectionId, msg.sender, section.ask);
        } else {
            Offer[] storage offers = offerMap[sectionId];
            // mapping(address => uint) storage offers = offerMap[sectionId];
            // bool hadPrevOffer;
            for (uint i = 0; i < offers.length; i++) {
                if (offers[i].offerer == msg.sender) {
                    // offers[i].amount = msg.value;
                    // hadPrevOffer = true;
                    revert("Cannot have multiple offers for the same section, if you want to submit a new offer first delete the old one.");
                }
            }

            // if (!hadPrevOffer) {
              Offer memory newOffer = Offer({offerer: payable(msg.sender), amount: msg.value});
              offers.push(newOffer);
            // }
        }
    }

    function acceptOffer(uint sectionId, uint amount) public {
        Section storage section = getValidRegion(sectionId);
        require(isOwner(section));
        Offer[] storage offers = offerMap[sectionId];
        // mapping(address => uint) storage offers = offerMap[sectionId];
        Offer memory winningOffer;
        uint position;
        for (uint i = 0; i < offers.length; i++) {
            if (offers[i].amount >= amount && winningOffer.amount < offers[i].amount) {
                winningOffer = offers[i];
                position = i;
            }
        }

        if (winningOffer.offerer == address(0)) {
            revert("There must be an offer equal to or higher than the specified amount");
        }

        offers[position]=offers[offers.length-1];
        offers.pop();

        addPendingReturn(section);
        updateOwner(section, sectionId, winningOffer.offerer, winningOffer.amount);

    } 

    function removeOffer(uint sectionId) public {
        Section storage section = getValidRegion(sectionId);
        require(!isOwner(section));


        Offer[] storage offers = offerMap[sectionId];
        // mapping(address => uint) storage offers = offerMap[sectionId];
        Offer memory offerToRemove;
        uint position;
        for (uint i = 0; i < offers.length; i++) {
            if (offers[i].offerer == msg.sender) {
              offerToRemove = offers[i];
              position = i;
            }
        }

        if (offerToRemove.offerer == address(0)) {
            revert("There is no offer to remove");
        }

        uint amount = offerToRemove.amount;
        offers[position]=offers[offers.length-1];
        offers.pop();

        payable(msg.sender).transfer(amount);
    }

    //End trading functions

    function setColorBytes(uint sectionId, bytes memory color) public {
        Section storage section = getValidRegion(sectionId);
        require(isOwner(section));
        require(!section.updatedColor);
        //TODO validate color string

        section.colorBytes = color;
        section.updatedColor = true;
        emit ColorBytesUpdated(sectionId, msg.sender, color);
    }

    function updateOwner(Section storage section, uint sectionId, address newOwner, uint amount) private {
        address payable oldOwner = section.owner;
        section.owner = payable(newOwner);
        section.updatedColor = false;
        section.ask = 0;
        emit SectionPurchased(sectionId, msg.sender, oldOwner, amount);

        oldOwner.transfer(amount);
    }

    function getValidRegion(uint sectionId) private view returns (Section storage) {
        require(sectionId >= 0 && sectionId < 100);
        return sections[sectionId];
    }

    function addPendingReturn(Section memory section) private {
        // if (section.offerer != address(0)) {
        //     pendingReturns[section.offerer] += section.offer;
        // }
    }

    function isOwner(Section memory section) private view returns (bool) {
        if (msg.sender == section.owner) {
            return true;
        }
        return false;
    }


 
}