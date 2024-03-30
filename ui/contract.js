const deployedContractAddress = "0x6BcfaC1d09c60b17a8E5Dadfc0238D5274bC70F9";

const homeworkSubmissionContractDetails = [
    {
        inputs: [],
        stateMutability: "nonpayable",
        type: "constructor",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "uint256",
                name: "id",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "string",
                name: "name",
                type: "string",
            },
        ],
        name: "AssignmentCreated",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "uint256",
                name: "submissionId",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "string",
                name: "feedback",
                type: "string",
            },
        ],
        name: "FeedbackProvided",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "uint256",
                name: "submissionId",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "int256",
                name: "grade",
                type: "int256",
            },
        ],
        name: "SubmissionGraded",
        type: "event",
    },
    {
        inputs: [
            {
                internalType: "string",
                name: "_studentId",
                type: "string",
            },
        ],
        name: "assignStudent",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "string",
                name: "_password",
                type: "string",
            },
        ],
        name: "assignTeacher",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "",
                type: "uint256",
            },
        ],
        name: "assignments",
        outputs: [
            {
                internalType: "uint256",
                name: "id",
                type: "uint256",
            },
            {
                internalType: "string",
                name: "name",
                type: "string",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "string",
                name: "_name",
                type: "string",
            },
        ],
        name: "createAssignment",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [],
        name: "getAllAssignments",
        outputs: [
            {
                components: [
                    {
                        internalType: "uint256",
                        name: "id",
                        type: "uint256",
                    },
                    {
                        internalType: "string",
                        name: "name",
                        type: "string",
                    },
                ],
                internalType: "struct HomeworkContract.Assignment[]",
                name: "",
                type: "tuple[]",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "_id",
                type: "uint256",
            },
        ],
        name: "getAssignmentById",
        outputs: [
            {
                components: [
                    {
                        internalType: "uint256",
                        name: "id",
                        type: "uint256",
                    },
                    {
                        internalType: "string",
                        name: "name",
                        type: "string",
                    },
                ],
                internalType: "struct HomeworkContract.Assignment",
                name: "",
                type: "tuple",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "getAssignmentCount",
        outputs: [
            {
                internalType: "uint256",
                name: "",
                type: "uint256",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "getCurrentRole",
        outputs: [
            {
                internalType: "enum HomeworkContract.Role",
                name: "",
                type: "uint8",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "getMySubmissions",
        outputs: [
            {
                components: [
                    {
                        internalType: "uint256",
                        name: "id",
                        type: "uint256",
                    },
                    {
                        internalType: "string",
                        name: "studentId",
                        type: "string",
                    },
                    {
                        internalType: "uint256",
                        name: "assignmentId",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256",
                        name: "timestamp",
                        type: "uint256",
                    },
                    {
                        internalType: "string",
                        name: "contentHash",
                        type: "string",
                    },
                    {
                        internalType: "string",
                        name: "comment",
                        type: "string",
                    },
                    {
                        internalType: "int256",
                        name: "grade",
                        type: "int256",
                    },
                    {
                        internalType: "string",
                        name: "feedback",
                        type: "string",
                    },
                ],
                internalType: "struct HomeworkContract.Homework[]",
                name: "",
                type: "tuple[]",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "getStudentId",
        outputs: [
            {
                internalType: "string",
                name: "",
                type: "string",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "_submissionId",
                type: "uint256",
            },
        ],
        name: "getSubmissionById",
        outputs: [
            {
                components: [
                    {
                        internalType: "uint256",
                        name: "id",
                        type: "uint256",
                    },
                    {
                        internalType: "string",
                        name: "studentId",
                        type: "string",
                    },
                    {
                        internalType: "uint256",
                        name: "assignmentId",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256",
                        name: "timestamp",
                        type: "uint256",
                    },
                    {
                        internalType: "string",
                        name: "contentHash",
                        type: "string",
                    },
                    {
                        internalType: "string",
                        name: "comment",
                        type: "string",
                    },
                    {
                        internalType: "int256",
                        name: "grade",
                        type: "int256",
                    },
                    {
                        internalType: "string",
                        name: "feedback",
                        type: "string",
                    },
                ],
                internalType: "struct HomeworkContract.Homework",
                name: "",
                type: "tuple",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "_assignmentId",
                type: "uint256",
            },
        ],
        name: "getSubmissionCountForAssignment",
        outputs: [
            {
                internalType: "uint256",
                name: "",
                type: "uint256",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "_assignmentId",
                type: "uint256",
            },
        ],
        name: "getSubmissionsByAssignmentId",
        outputs: [
            {
                components: [
                    {
                        internalType: "uint256",
                        name: "id",
                        type: "uint256",
                    },
                    {
                        internalType: "string",
                        name: "studentId",
                        type: "string",
                    },
                    {
                        internalType: "uint256",
                        name: "assignmentId",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256",
                        name: "timestamp",
                        type: "uint256",
                    },
                    {
                        internalType: "string",
                        name: "contentHash",
                        type: "string",
                    },
                    {
                        internalType: "string",
                        name: "comment",
                        type: "string",
                    },
                    {
                        internalType: "int256",
                        name: "grade",
                        type: "int256",
                    },
                    {
                        internalType: "string",
                        name: "feedback",
                        type: "string",
                    },
                ],
                internalType: "struct HomeworkContract.Homework[]",
                name: "",
                type: "tuple[]",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "string",
                name: "_studentId",
                type: "string",
            },
        ],
        name: "getSubmissionsByStudentId",
        outputs: [
            {
                components: [
                    {
                        internalType: "uint256",
                        name: "id",
                        type: "uint256",
                    },
                    {
                        internalType: "string",
                        name: "studentId",
                        type: "string",
                    },
                    {
                        internalType: "uint256",
                        name: "assignmentId",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256",
                        name: "timestamp",
                        type: "uint256",
                    },
                    {
                        internalType: "string",
                        name: "contentHash",
                        type: "string",
                    },
                    {
                        internalType: "string",
                        name: "comment",
                        type: "string",
                    },
                    {
                        internalType: "int256",
                        name: "grade",
                        type: "int256",
                    },
                    {
                        internalType: "string",
                        name: "feedback",
                        type: "string",
                    },
                ],
                internalType: "struct HomeworkContract.Homework[]",
                name: "",
                type: "tuple[]",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "_startTime",
                type: "uint256",
            },
            {
                internalType: "uint256",
                name: "_endTime",
                type: "uint256",
            },
        ],
        name: "getSubmissionsByTimestampRange",
        outputs: [
            {
                components: [
                    {
                        internalType: "uint256",
                        name: "id",
                        type: "uint256",
                    },
                    {
                        internalType: "string",
                        name: "studentId",
                        type: "string",
                    },
                    {
                        internalType: "uint256",
                        name: "assignmentId",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256",
                        name: "timestamp",
                        type: "uint256",
                    },
                    {
                        internalType: "string",
                        name: "contentHash",
                        type: "string",
                    },
                    {
                        internalType: "string",
                        name: "comment",
                        type: "string",
                    },
                    {
                        internalType: "int256",
                        name: "grade",
                        type: "int256",
                    },
                    {
                        internalType: "string",
                        name: "feedback",
                        type: "string",
                    },
                ],
                internalType: "struct HomeworkContract.Homework[]",
                name: "",
                type: "tuple[]",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "getTotalSubmission",
        outputs: [
            {
                internalType: "uint256",
                name: "",
                type: "uint256",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "_submissionId",
                type: "uint256",
            },
            {
                internalType: "int256",
                name: "_grade",
                type: "int256",
            },
            {
                internalType: "string",
                name: "_feedback",
                type: "string",
            },
        ],
        name: "gradeSubmission",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "_assignmentId",
                type: "uint256",
            },
            {
                internalType: "uint256",
                name: "_timestamp",
                type: "uint256",
            },
            {
                internalType: "string",
                name: "_contentHash",
                type: "string",
            },
            {
                internalType: "string",
                name: "_comment",
                type: "string",
            },
        ],
        name: "submit",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
];
