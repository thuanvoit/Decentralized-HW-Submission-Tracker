// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

contract HomeworkContract {
    enum Role {
        NONE,
        STUDENT,
        TEACHER
    }
    mapping(address => Role) private roles;
    mapping(address => string) private studentIds;

    modifier onlyStudent() {
        require(
            roles[msg.sender] == Role.STUDENT,
            "Only students can call this function"
        );
        _;
    }

    modifier onlyTeacher() {
        require(
            roles[msg.sender] == Role.TEACHER,
            "Only teachers can call this function"
        );
        _;
    }

    modifier onlyStudentOrTeacher() {
        require(
            roles[msg.sender] == Role.STUDENT ||
                roles[msg.sender] == Role.TEACHER,
            "Only students or teachers can call this function"
        );
        _;
    }

    function assignTeacher(string memory _password) public {
        require(
            (keccak256(abi.encodePacked((_password))) ==
                keccak256(abi.encodePacked(("0000")))),
            "Incorrect Password to Assign Teacher."
        );
        roles[msg.sender] = Role.TEACHER;
    }

    function assignStudent(string memory _studentId) external {
        roles[msg.sender] = Role.STUDENT;
        studentIds[msg.sender] = _studentId;
    }

    function getCurrentRole() public view returns (Role) {
        require(roles[msg.sender] != Role.NONE, "Role not assigned for this address");

        return roles[msg.sender];
    }


    struct Homework {
        uint256 id;
        string studentId;
        uint256 assignmentId;
        uint256 timestamp;
        string contentHash;
        string comment;
        int256 grade;
        string feedback;
    }

    mapping(uint256 => Homework) submissionById;
    mapping(string => Homework[]) submissions;
    mapping(uint256 => uint256) submissionCountByAssignment;
    uint256 private submissionCounter;

    event FeedbackProvided(uint256 indexed submissionId, string feedback);
    event SubmissionGraded(uint256 indexed submissionId, int256 grade);

    function submit(
        uint256 _assignmentId,
        uint256 _timestamp,
        string memory _contentHash,
        string memory _comment
    ) public onlyStudent {
        string memory _studentId = getStudentId();

        require((keccak256(abi.encodePacked((_studentId))) !=
                keccak256(abi.encodePacked(("")))), "You don't have student ID");

        require(_assignmentId > 0 && _assignmentId < assignmentCounter, "Invalid assignment ID");
        
        uint256 newSubmissionId = submissionCounter++;

        // create new submission
        submissionById[newSubmissionId] = Homework({
            id: newSubmissionId,
            studentId: _studentId,
            assignmentId: _assignmentId,
            timestamp: _timestamp,
            contentHash: _contentHash,
            comment: _comment,
            grade: -1,
            feedback: ""
        });

        // add that submission to list
        submissions[_studentId].push(submissionById[newSubmissionId]);

        // increase counter
        submissionCountByAssignment[_assignmentId]++;
    }

    function getMySubmissions()
        public
        view
        onlyStudent
        returns (Homework[] memory)
    {
        string memory _studentId = getStudentId();
        return submissions[_studentId];
    }

    function getSubmissionsByStudentId(string memory _studentId)
        public
        view
        onlyTeacher
        returns (Homework[] memory)
    {
        return submissions[_studentId];
    }

    function getSubmissionCountForAssignment(uint256 _assignmentId)
        public
        view
        onlyTeacher
        returns (uint256)
    {
        return submissionCountByAssignment[_assignmentId];
    }

    function getSubmissionById(uint256 _submissionId)
        public
        view
        onlyTeacher
        returns (Homework memory)
    {
        return submissionById[_submissionId];
    }

    function gradeSubmission(uint256 _submissionId, int256 _grade, string memory _feedback)
    public
    onlyTeacher
{
    require(
        _grade >= 0 && _grade <= 100,
        "Grade must be between 0 and 100"
    ); // Ensure grade is within valid range

    Homework storage submission = submissionById[_submissionId];
    require(submission.id > 0, "Submission does not exist"); // Ensure submission exists

    submission.grade = _grade; // Update submission grade
    submission.feedback = _feedback; // Update submission feedback

    // Update submissions mapping with graded submission details
    string memory studentId = submission.studentId;
    Homework[] storage studentSubmissions = submissions[studentId];
    for (uint256 i = 0; i < studentSubmissions.length; i++) {
        if (studentSubmissions[i].id == _submissionId) {
            studentSubmissions[i].grade = _grade;
            studentSubmissions[i].feedback = _feedback;
            break;
        }
    }

    // notify
    emit SubmissionGraded(_submissionId, _grade);
    emit FeedbackProvided(_submissionId, _feedback);
}

    function getSubmissionsByTimestampRange(
        uint256 _startTime,
        uint256 _endTime
    ) public view onlyStudentOrTeacher returns (Homework[] memory) {
        uint256 totalSubmissions = submissionCounter;
        Homework[] memory result = new Homework[](totalSubmissions);
        uint256 count = 0;

        for (uint256 i = 0; i < totalSubmissions; i++) {
            Homework memory submission = submissionById[i];
            if (
                submission.timestamp >= _startTime &&
                submission.timestamp <= _endTime
            ) {
                result[count] = submission;
                count++;
            }
        }

        // Resize result array to remove any empty elements
        assembly {
            mstore(result, count)
        }

        return result;
    }

    function getTotalSubmission() public view onlyTeacher returns (uint256) {
        return submissionCounter - 1;
    }

    function getStudentId() public onlyStudent view returns (string memory) {
        address _studentAddress = msg.sender;
        require(
            roles[_studentAddress] == Role.STUDENT,
            "Address is not assigned as a student"
        );
        return studentIds[_studentAddress];
    }

    struct Assignment {
        uint256 id;
        string name;
    }

    mapping(uint256 => Assignment) public assignments;
    uint256 private assignmentCounter;

    event AssignmentCreated(uint256 indexed id, string name);

    constructor() {
        assignmentCounter = 1;
        submissionCounter = 1;
        roles[msg.sender] = Role.NONE;
    }

    function createAssignment(string memory _name) public onlyTeacher {
        assignments[assignmentCounter] = Assignment({
            id: assignmentCounter,
            name: _name
        });

        emit AssignmentCreated(assignmentCounter, _name);

        assignmentCounter++;
    }

    function getAllAssignments() public onlyStudentOrTeacher view returns (Assignment[] memory) {
        Assignment[] memory allAssignments = new Assignment[](assignmentCounter - 1);
        for (uint256 i = 1; i < assignmentCounter; i++) {
            allAssignments[i - 1] = assignments[i];
        }
        return allAssignments;
    }

    function getAssignmentById(uint256 _id) public onlyStudentOrTeacher view returns (Assignment memory) {
        require(_id > 0 && _id < assignmentCounter, "Assignment ID does not exist");
        return assignments[_id];
    }

    function getAssignmentCount() public onlyStudentOrTeacher view returns (uint256) {
        return assignmentCounter - 1;
    }

    function getSubmissionsByAssignmentId(uint256 _assignmentId) public view onlyTeacher returns (Homework[] memory) {
    uint256 totalSubmissions = submissionCounter;
    Homework[] memory result = new Homework[](totalSubmissions);
    uint256 count = 0;

    for (uint256 i = 1; i < totalSubmissions; i++) {
        Homework memory submission = submissionById[i];
        if (submission.assignmentId == _assignmentId) {
            result[count] = submission;
            count++;
        }
    }

    // Resize result array to remove any empty elements
    assembly {
        mstore(result, count)
    }

    return result;
}

}
