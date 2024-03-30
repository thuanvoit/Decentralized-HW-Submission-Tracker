// Create a new web3 instance with the provider
const web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:7545"));

let myAddress = "";
let homeworkContract = null;
let currentRole = 0;

// Fetch available accounts asynchronously
web3.eth
    .getAccounts()
    .then((accounts) => {
        // Check if there are any accounts available
        if (accounts.length > 0) {
            populateAccounts(accounts);
            setAccount(accounts[0]);
            console.log("Default Account:", web3.eth.defaultAccount);
            deployContract();
            getCurrentRole();
        } else {
            console.error("No accounts available.");
        }
    })
    .catch((error) => {
        console.error("Error fetching accounts:", error);
    });

function setAccount(account) {
    myAddress = account;
    web3.eth.defaultAccount = account;
    console.log("Connected to account:", account);
    document.getElementById(
        "current-account"
    ).innerText = `Account: ${account}`;
    web3.eth
        .getBalance(account)
        .then((balance) => {
            document.getElementById(
                "account-balance"
            ).innerText = `Balance: ${web3.utils.fromWei(
                balance,
                "ether"
            )} ETH`;

            createAlert(
                "select-account-card",
                `Connected to account: ${account}`
            );
        })
        .catch((error) => {
            console.error("Error fetching balance:", error);
        });
}

function populateAccounts(accounts) {
    const select = document.getElementById("accounts");
    select.innerHTML = "";
    accounts.forEach((account, index) => {
        const option = document.createElement("option");
        option.value = account;
        option.text = `Acc ${index} - ${account.substring(
            0,
            6
        )}...${account.substring(account.length - 4)}`;
        select.appendChild(option);
    });
}

function connectAccount() {
    const select = document.getElementById("accounts");
    const account = select.value;
    if (account) {
        setAccount(account);
        getCurrentRole();
    } else {
        console.error("No account selected.");
    }
}

function deployContract() {
    homeworkContract = new web3.eth.Contract(
        homeworkSubmissionContractDetails,
        deployedContractAddress
    );
}

function getCurrentRole() {
    if (homeworkContract != null) {
        homeworkContract.methods
            .getCurrentRole()
            .call({ from: myAddress })
            .then((role) => {
                currentRole = role;
                roleProcess();
                console.log("Current role:", role);
                document.getElementById("select-role-card").style.display =
                    "none";
                document.getElementById("student-id-input").style.display =
                    "none";
                document.getElementById(
                    "teacher-password-input"
                ).style.display = "none";
                document.getElementById("role").innerText = `Role: ${
                    role == 1 ? "Student" : "Teacher"
                }`;
            })
            .catch((error) => {
                console.error("Error:", error);
                console.log("Selecting role");
                document.getElementById(
                    "role"
                ).innerText = `Please select your role.`;
                document.getElementById("select-role-card").style.display =
                    "block";
                document.getElementById(
                    "teacher-password-input"
                ).style.display = "none";
            });
    }
}

function selectStudentRole() {
    document.getElementById("student-id-input").style.display = "block";
    document.getElementById("teacher-password-input").style.display = "none";
}

function selectTeacherRole() {
    document.getElementById("student-id-input").style.display = "none";
    document.getElementById("teacher-password-input").style.display = "block";
}

function setStudentRole() {
    const studentId = document.getElementById("student-id").value;
    if (studentId) {
        homeworkContract.methods
            .assignStudent(studentId)
            .send({ from: myAddress })
            .then((receipt) => {
                console.log("Receipt:", receipt);
                getCurrentRole();
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    } else {
        console.error("No student id provided.");
    }
}

function setTeacherRole() {
    const teacherPassword = document.getElementById("teacher-password").value;
    if (teacherPassword) {
        homeworkContract.methods
            .assignTeacher(teacherPassword)
            .send({ from: myAddress })
            .then((receipt) => {
                console.log("Receipt:", receipt);
                getCurrentRole();
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    } else {
        console.error("No teacher password provided.");
    }
}

function createAssignment() {
    const assignmentName = document.getElementById("assignmentName").value;
    homeworkContract.methods
        .createAssignment(assignmentName)
        .send({ from: myAddress })
        .then((receipt) => {
            createAlert("create-hw-card", "Assignment created.");
        })
        .catch((error) => {
            console.error("Error:", error);
        });
}

async function getAllHWs() {
    const homeworks_select = document.getElementById("homeworks");
    const grader_assignment = document.getElementById("grader-assignment");

    homeworks_select.innerHTML = "";
    grader_assignment.innerHTML = "";

    // append 1 empty option to each
    const empty_option = document.createElement("option");
    empty_option.value = "";
    empty_option.text = "Select an assignment";
    homeworks_select.appendChild(empty_option);

    const empty_option2 = document.createElement("option");
    empty_option2.value = "";
    empty_option2.text = "Select an assignment";
    grader_assignment.appendChild(empty_option2);

    homeworkContract.methods
        .getAllAssignments()
        .call({ from: myAddress })
        .then(function (result) {
            console.log(result);

            result.forEach((hw, index) => {
                const option = document.createElement("option");
                option.value = hw.id;
                option.text = hw.name;
                homeworks_select.appendChild(option);

                const option2 = document.createElement("option");
                option2.value = hw.id;
                option2.text = hw.name;
                grader_assignment.appendChild(option2);
            });

            getAssignmentCount();
        });
}

function roleProcess() {
    if (currentRole == 1) {
        getAllHWs();
        document.getElementById("create-hw-card").style.display = "none";
        document.getElementById("submit-hw-card").style.display = "block";
        document.getElementById("grader-hw-card").style.display = "none";
        document.getElementById("my-hw-card").style.display = "block";
        // STUDENT
        getAllMySubmissions();
    }
    if (currentRole == 2) {
        // THIS IS TEACHER
        getAllHWs();
        document.getElementById("create-hw-card").style.display = "block";
        document.getElementById("submit-hw-card").style.display = "none";
        document.getElementById("grader-hw-card").style.display = "block";
        document.getElementById("my-hw-card").style.display = "none";
    }
}

async function calculateHash(fileInput) {
    const file = fileInput.files[0];

    const hashBuffer = await crypto.subtle.digest(
        "SHA-256",
        await file.arrayBuffer()
    );
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray
        .map((byte) => byte.toString(16).padStart(2, "0"))
        .join("");

    // console.log(hashHex);
    return hashHex;
}

function submitHomework() {
    const fileInput = document.getElementById("submission-file");
    const homeworkId = document.getElementById("homeworks").value;
    const comment = document.getElementById("submission-comment").value;
    const timestamp = new Date().getTime();
    calculateHash(fileInput).then((hash) => {
        // console.log(homeworkId, timestamp, hash, comment);
        homeworkContract.methods
            .submit(homeworkId, timestamp, hash, comment)
            .send({ from: myAddress, gas: "1000000" })
            .then((receipt) => {
                console.log("Receipt:", receipt);
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    });
}

function getAllSubmissionByAssignmentId(id) {
    const grader_submission = document.getElementById("grader-submission");
    const grader_assignment_id =
        document.getElementById("grader-assignment").value;

    homeworkContract.methods
        .getSubmissionsByAssignmentId(grader_assignment_id)
        .call({ from: myAddress })
        .then(function (result) {
            console.log(result);
            grader_submission.innerHTML = "";

            result.forEach((submission, index) => {
                const option = document.createElement("option");
                option.value = submission.id;
                option.text = `StudentID:  ${
                    submission.studentId
                } - (${timestampToDate(submission.timestamp)})`;
                grader_submission.appendChild(option);
            });
        });

    getSubmissionCountForAssignment();
}

function getAllMySubmissions() {
    const my_submissions = document.getElementById("my-submissions");
    my_submissions.innerHTML = "";

    homeworkContract.methods
        .getMySubmissions()
        .call({ from: myAddress })
        .then(function (result) {
            for (let i = 0; i < result.length; i++) {
                const submission = result[i];
                const assignment = getAssignmentByIdAsync(
                    submission.assignmentId
                );
                assignment.then((assignment) => {
                    const option = document.createElement("option");
                    option.value = submission.id;
                    option.text = `${assignment.name} - (${timestampToDate(
                        submission.timestamp
                    )})`;
                    my_submissions.appendChild(option);
                });
            }
        });
}

function getSubmissionById() {
    const grader_submission_id =
        document.getElementById("grader-submission").value;
    homeworkContract.methods
        .getSubmissionById(grader_submission_id)
        .call({ from: myAddress })
        .then(function (result) {
            console.log(result);
            setSubmissionDetails(
                "submission-details",
                [
                    "sd-studentid",
                    "sd-datetime",
                    "sd-filehash",
                    "sd-comment",
                    "sd-grade",
                    "sd-feedback",
                ],
                [
                    result.studentId,
                    result.timestamp,
                    result.contentHash,
                    result.comment,
                    result.grade,
                    result.feedback,
                ]
            );
            document.getElementById("save-grade").disabled = true;
        });
}

function getSubmissionCountForAssignment() {
    const assignmentTotalSubmission = document.getElementById(
        "assignment-total-submission"
    );
    const assignment_id = document.getElementById("grader-assignment").value;
    homeworkContract.methods
        .getSubmissionCountForAssignment(assignment_id)
        .call({ from: myAddress })
        .then(function (result) {
            assignmentTotalSubmission.innerHTML = `${result} total submissions`;
        });
}

function getAssignmentCount() {
    const assignmentTotal = document.getElementById("assignment-total");
    homeworkContract.methods
        .getAssignmentCount()
        .call({ from: myAddress })
        .then(function (result) {
            assignmentTotal.innerHTML = `${result} assignments created`;
        });
}

function getMySubmissionById() {
    const my_submission_id = document.getElementById("my-submissions").value;
    homeworkContract.methods
        .getMySubmissions()
        .call({ from: myAddress })
        .then(function (allResults) {
            // find the result that have id == grader_submission_id
            console.log(allResults);
            const result = allResults.find((r) => r.id == my_submission_id);
            setSubmissionDetails(
                "submission-details",
                [
                    "my-sd-studentid",
                    "my-sd-datetime",
                    "my-sd-filehash",
                    "my-sd-comment",
                    "my-sd-grade",
                    "my-sd-feedback",
                ],
                [
                    result.studentId,
                    result.timestamp,
                    result.contentHash,
                    result.comment,
                    result.grade,
                    result.feedback,
                ]
            );
        });
}

function setSubmissionDetails(frame_id, eid, edata) {
    const submission_details_frame = document.getElementById(frame_id);

    // set details based on html above
    document.getElementById(eid[0]).innerText = edata[0];
    document.getElementById(eid[1]).innerText = timestampToDate(edata[1]);
    document.getElementById(eid[2]).innerText = edata[2];
    document.getElementById(eid[3]).value = edata[3];
    if (edata[4] >= 0) {
        document.getElementById(eid[4]).value = edata[4];
    } else {
        document.getElementById(eid[4]).value = "";
    }
    document.getElementById(eid[5]).value = edata[5];
}

function timestampToDate(timestamp) {
    return new Date(Number(timestamp)).toLocaleString();
}

function readyToSave() {
    let grade = document.getElementById("sd-grade").value;
    if (grade == "") {
        const saveButton = document.getElementById("save-grade");
        saveButton.disabled = true;
        return;
    }
    grade = Number(grade);
    if (grade >= 0 && grade <= 100) {
        const saveButton = document.getElementById("save-grade");
        saveButton.disabled = false;
    } else {
        const saveButton = document.getElementById("save-grade");
        saveButton.disabled = true;
        console.error("Invalid grade.");
    }
}

function saveGrade() {
    const grade = document.getElementById("sd-grade").value;
    const feedback = document.getElementById("sd-feedback").value;
    const submissionId = document.getElementById("grader-submission").value;

    homeworkContract.methods
        .gradeSubmission(submissionId, grade, feedback)
        .send({ from: myAddress, gas: "1000000" })
        .then((receipt) => {
            createAlert("submission-details", "Grade and feedback saved.");
        })
        .catch((error) => {
            console.error("Error:", error);
        });
}

function createAlert(frame_id, msg) {
    const frame = document.getElementById(frame_id);
    // create alert bootstrap
    const alert = document.createElement("div");
    alert.className = "alert alert-success";
    alert.role = "alert";
    alert.innerText = msg;
    // frame.appendChild(alert);

    // append on top
    frame.insertBefore(alert, frame.firstChild);

    // remove alert after 3 seconds
    setTimeout(() => {
        frame.removeChild(alert);
    }, 3000);
}

async function getAssignmentByIdAsync(id) {
    try {
        const result = await homeworkContract.methods
            .getAssignmentById(id)
            .call({ from: myAddress });
        return result;
    } catch (error) {
        console.error(error);
        throw error;
    }
}
