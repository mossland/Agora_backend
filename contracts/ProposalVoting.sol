pragma solidity ^0.8.0;

interface ERC20 {
    function balanceOf(address account) external view returns (uint256);

    function transfer(address recipient, uint256 amount)
        external
        returns (bool);
}

contract TokenWeightedVoting {
    enum Vote {
        For,
        Against,
        Abstain
    }

    struct Voter {
        address voterAddress;
        Vote vote;
        uint256 mocBalanceAtVoteTime;
        uint256 mocBalanceAtVoteClose;
    }

    struct Proposal {
        uint256 id;
        uint256 startDate;
        uint256 endDate;
        bool closed;
        bool extended;
        address[] voterAddresses; // Track voter addresses separately
        mapping(address => Voter) votesHistory;
        address proponent;
    }

    mapping(uint256 => Proposal) public proposals;
    mapping(uint256 => uint256) public forVotes; // Map proposalId to total for votes
    mapping(uint256 => uint256) public againstVotes; // Map proposalId to total against votes
    mapping(uint256 => uint256) public abstainVotes; // Map proposalId to total abstain votes

    ERC20 public mocToken; // Interface of the MOC token contract
    uint256 public proposalCount;

    address[] public admins;

    event VoteCast(
        uint256 proposalId,
        address voter,
        Vote vote,
        uint256 mocBalanceAtVoteTime
    );

    event VotingResult(uint256 proposalId, int256 result);
    event VotingClosed(uint256 proposalId);

    event ProposalCreated(
        uint256 proposalId,
        string proposalIdMongo,
        uint256 startDate,
        uint256 endDate,
        address proponent
    );
    event EndDateExtended(uint256 proposalId, uint256 newEndDate);

    constructor(address _mocToken, address[] memory _admins) {
        mocToken = ERC20(_mocToken); // Initialize the MOC token interface with the token contract address
        admins = _admins;
    }

    modifier votingOpen(uint256 proposalId) {
        require(
            block.timestamp >= proposals[proposalId].startDate,
            "Voting has not started yet"
        );
        require(
            block.timestamp < proposals[proposalId].endDate,
            "Voting has ended"
        );
        _;
    }

    modifier notClosed(uint256 proposalId) {
        require(!proposals[proposalId].closed, "Voting already closed");
        _;
    }

    modifier onlyAdmin() {
        require(isAdmin(msg.sender), "Only admins can call this function");
        _;
    }

    function isAdmin(address addr) public view returns (bool) {
        for (uint256 i = 0; i < admins.length; i++) {
            if (admins[i] == addr) {
                return true;
            }
        }
        return false;
    }

    // Function to create a new proposal
    function createProposal(
        uint256 _startDate,
        uint256 _endDate,
        string memory proposalIdMongo
    ) external returns (uint256) {
        require(_startDate < _endDate, "Start date must be before end date");

        proposalCount++;
        Proposal storage newProposal = proposals[proposalCount];
        newProposal.id = proposalCount;
        newProposal.startDate = _startDate;
        newProposal.endDate = _endDate;
        newProposal.closed = false;
        newProposal.extended = false;
        newProposal.proponent = msg.sender;

        emit ProposalCreated(
            proposalCount,
            proposalIdMongo,
            _startDate,
            _endDate,
            msg.sender
        );

        return proposalCount;
    }

    function getVoteHistory(uint256 proposalId, address voterAddress)
        external
        view
        returns (Voter memory)
    {
        return proposals[proposalId].votesHistory[voterAddress];
    }

    // Cast vote for a proposal
    function vote(uint256 proposalId, Vote votee)
        external
        votingOpen(proposalId)
        notClosed(proposalId)
    {
        require(
            votee == Vote.For || votee == Vote.Against || votee == Vote.Abstain,
            "Invalid vote"
        );
        require(mocToken.balanceOf(msg.sender) > 0, "No tokens to vote");

        uint256 mocBalanceAtVoteTime = mocToken.balanceOf(msg.sender);
        Voter memory voter = Voter({
            voterAddress: msg.sender,
            vote: votee,
            mocBalanceAtVoteTime: mocBalanceAtVoteTime,
            mocBalanceAtVoteClose: 0
        });

        proposals[proposalId].votesHistory[msg.sender] = voter;
        proposals[proposalId].voterAddresses.push(msg.sender); // Add voter address to array

        if (votee == Vote.For) {
            forVotes[proposalId] += mocBalanceAtVoteTime;
        } else if (votee == Vote.Against) {
            againstVotes[proposalId] += mocBalanceAtVoteTime;
        } else {
            abstainVotes[proposalId] += mocBalanceAtVoteTime;
        }

        emit VoteCast(proposalId, msg.sender, votee, mocBalanceAtVoteTime);
    }

    // Admin function to close voting for a proposal
    function closeVoting(uint256 proposalId) external {
        require(
            block.timestamp >= proposals[proposalId].endDate,
            "Voting has not ended yet"
        );
        require(!proposals[proposalId].closed, "Voting already closed");

        proposals[proposalId].closed = true;

        for (
            uint256 i = 0;
            i < proposals[proposalId].voterAddresses.length;
            i++
        ) {
            address voterAddress = proposals[proposalId].voterAddresses[i];
            uint256 mocBalanceAtVoteClose = mocToken.balanceOf(voterAddress);
            proposals[proposalId]
                .votesHistory[voterAddress]
                .mocBalanceAtVoteClose = mocBalanceAtVoteClose;
        }

        int256 result = calculateResult(proposalId);
        emit VotingClosed(proposalId);
        emit VotingResult(proposalId, result);
    }

    function extendEndDate(uint256 proposalId, uint256 newEndDate) external onlyAdmin notClosed(proposalId) {
        require(newEndDate > proposals[proposalId].endDate, "New end date must be later than current end date");

        proposals[proposalId].endDate = newEndDate;
        proposals[proposalId].extended = true;

        emit EndDateExtended(proposalId, newEndDate);
    }


    // Function to calculate the voting result of a proposal
    function calculateResult(uint256 proposalId)
        internal
        view
        returns (int256)
    {
        int256 totalForVotes = 0;
        int256 totalAgainstVotes = 0;

        for (uint256 i = 0; i < proposalCount; i++) {
            uint256 mocBalanceAtVoteClose = proposals[proposalId]
                .votesHistory[msg.sender]
                .mocBalanceAtVoteClose;

            // Multiply the vote count by the voter's token balance
            if (
                proposals[proposalId].votesHistory[msg.sender].vote == Vote.For
            ) {
                totalForVotes += int256(mocBalanceAtVoteClose);
            } else if (
                proposals[proposalId].votesHistory[msg.sender].vote ==
                Vote.Against
            ) {
                totalAgainstVotes += int256(mocBalanceAtVoteClose);
            }
        }

        int256 result = totalForVotes - totalAgainstVotes;
        return result;
    }

    // Function to get the final voting result of a proposal
    function getResult(uint256 proposalId) external view returns (int256) {
        require(proposalId <= proposalCount, "Invalid proposal");
        require(
            block.timestamp >= proposals[proposalId].endDate,
            "Voting has not ended yet"
        );
        return calculateResult(proposalId);
    }

    // Function to calculate the predicted voting result of a proposal based on current votes and user's MOC balance at vote time
    function calculatePredictedResult(uint256 proposalId)
        external
        view
        returns (int256)
    {
        int256 totalForVotes = 0;
        int256 totalAgainstVotes = 0;

        // Iterate through all votes for the proposal
        for (uint256 i = 0; i < proposalCount; i++) {
            address voterAddress = proposals[proposalId]
                .votesHistory[msg.sender]
                .voterAddress;
            uint256 mocBalanceAtVoteTime = proposals[proposalId]
                .votesHistory[voterAddress]
                .mocBalanceAtVoteTime;

            // Multiply the vote count by the voter's token balance at vote time
            if (
                proposals[proposalId].votesHistory[voterAddress].vote ==
                Vote.For
            ) {
                totalForVotes += int256(mocBalanceAtVoteTime);
            } else if (
                proposals[proposalId].votesHistory[voterAddress].vote ==
                Vote.Against
            ) {
                totalAgainstVotes += int256(mocBalanceAtVoteTime);
            }
        }

        // Calculate the predicted result based on the current state of votes
        int256 predictedResult = totalForVotes - totalAgainstVotes;
        return predictedResult;
    }
}
