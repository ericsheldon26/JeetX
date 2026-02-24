const Employee = require("@/rest/models/employee/employee.model");

const AddUserTypeDetails = async (userType, userId) => {
    const EmployeeTableUsers = ["employee", "admin"];
    let userTypeDetails = {};


    if (EmployeeTableUsers.includes(userType)) {
        try {
            const findUserTypeDetails = await Employee
                .findOne({ userId: userId })
                .select("mobileNumber.number mobileNumber.countryCode employeeCode organization userRoleName");

            if (findUserTypeDetails?._id) {
                userTypeDetails = findUserTypeDetails;
            }
        }
        catch (error) {
            console.error(`Error: ${error}`);
        }
    }
    else if (userType == "student") {
        userTypeDetails = {
            userRoleName: "Student"
        };
    }
    else if (userType == "parent") {
        userTypeDetails = {
            userRoleName: "Parent"
        };
    }

    return userTypeDetails;
}

module.exports = AddUserTypeDetails;