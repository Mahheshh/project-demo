// SPDX-License-Identifier: GPL-3.0

pragma solidity = 0.8.28;

contract Authority {
    address[] public judges;

    constructor() {
        judges.push(msg.sender);
    }

    modifier onlyJudge() {
        bool isJudge = false;
        for (uint i = 0; i < judges.length; i++) {
            if (judges[i] == msg.sender) {
                isJudge = true;
                break;
            }
        }
        require(isJudge, "Only a judge can perform this action");
        _;
    }

    function addJudge(address judge) public onlyJudge {
        judges.push(judge);
    }
}

contract Court is Authority {
    struct CaseData {
        uint version;
        string[] hashesh;
    }

    struct CourtData {
        uint caseNo;
        CaseData[] data;
    }

    CourtData[] public cases;

    event CaseCreated(uint caseNo);
    event DocumentAdded(uint indexed caseNo, uint indexed versionId);

    function createCase() public onlyJudge {
        cases.push();

        CourtData storage newCase = cases[cases.length - 1];
        
        newCase.caseNo = cases.length;
        
        newCase.data.push();
        
        newCase.data[0].version = 0;

        emit CaseCreated(newCase.caseNo);
    }

    function addDocument(uint caseNo, string[] memory hashArray) public onlyJudge {
        CourtData storage courtCase = cases[caseNo - 1];

        uint newVersion = 1;
        if (courtCase.data.length > 0) {
            newVersion = courtCase.data[courtCase.data.length - 1].version + 1;
        }

        courtCase.data.push();

        CaseData storage newData = courtCase.data[courtCase.data.length - 1];

        newData.hashesh = hashArray;
        newData.version = newVersion;

        emit DocumentAdded(caseNo, newVersion);
    }

    function getCase(uint caseNo) public view returns (CourtData memory) {
        CourtData storage courtCase = cases[caseNo - 1];
        return courtCase;
    }
}
