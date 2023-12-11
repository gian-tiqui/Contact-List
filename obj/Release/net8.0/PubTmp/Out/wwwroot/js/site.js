/*
*   User Data
*/

let user = JSON.parse(localStorage.getItem("user"));

/*
*   Table Loader
*/

const getMonthName = (monthNum) => {

    const mNum = parseInt(monthNum);

    switch (mNum) {
        case 1:
            return "January";
        case 2:
            return "February";
        case 3:
            return "March";
        case 4:
            return "April";
        case 5:
            return "May";
        case 6:
            return "June";
        case 7:
            return "July";
        case 8:
            return "August";
        case 9:
            return "September";
        case 10:
            return "October";
        case 11:
            return "November";
        case 12:
            return "December";


            
    }
    return "Undefined";
}

const displayTableData = async () => {
    try {
        const response = await fetch("http://www.contactlistdata.com/api/contacts.php");

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const xmlData = await response.text();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlData, "text/xml");
        const contacts = xmlDoc.getElementsByTagName("contact");

        const tableBody = document.getElementById("contactsTableBody");

        if (!tableBody) {
            return;
        }

        tableBody.innerHTML = "";

        for (let i = 0; i < contacts.length; i++) {
            const contact = contacts[i];
            const contactOf = contact.querySelector("contact_of").textContent;

            if (contactOf === user?.uid) {
                const id = contact.getAttribute("id");
                const firstName = contact.querySelector("first_name").textContent;
                const middleName = contact.querySelector("middle_name").textContent;
                const lastName = contact.querySelector("last_name").textContent;
                const sex = contact.querySelector("sex").textContent;
                const civilStatus = contact.querySelector("civil_status").textContent;
                const address = contact.querySelector("address").textContent;
                const phoneNumber = contact.querySelector("phone_number").textContent;
                const birthMonth = contact.querySelector("birthmonth").textContent;
                const birthDay = contact.querySelector("birthday").textContent;
                const birthYear = contact.querySelector("birthyear").textContent;
                const email = contact.querySelector("email").textContent;

                const newRow = tableBody.insertRow(); 
                newRow.className = "text-lightblue";

                newRow.insertCell(0).textContent = `${firstName} ${middleName[0]}. ${lastName}`;
                newRow.insertCell(1).textContent = sex;
                newRow.insertCell(2).textContent = `${getMonthName(birthMonth)} ${birthDay}, ${birthYear}`;
                newRow.insertCell(3).textContent = civilStatus;
                newRow.insertCell(4).textContent = address;
                newRow.insertCell(5).textContent = phoneNumber;
                newRow.insertCell(6).textContent = email;

                const buttonCell = newRow.insertCell(7);

                const editButton = document.createElement("button");
                editButton.textContent = "Edit";
                editButton.className = "btn btn-sm bg-lightblue text-dark mr-2 mx-2";
                editButton.addEventListener("click", () => {
                    console.log("Edit button clicked for contact ID:", id);

                    localStorage.setItem("contact", new XMLSerializer().serializeToString(contact));

                    window.location.href = "/Home/EditContact"
                });

                const deleteButton = document.createElement("button");
                deleteButton.textContent = "Delete";
                deleteButton.className = "btn btn-sm btn-danger mx-2";
                deleteButton.addEventListener("click", () => {
                    const contactId = id;

                    if (!contactId || isNaN(contactId)) {
                        alert("Please enter a valid contact ID.");
                        return;
                    }

                    fetch('http://www.contactlistdata.com/api/delete_contact.php', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                        },
                        body: 'contactId=' + encodeURIComponent(contactId),
                    })
                        .then(response => response.text())
                        .then(result => {
                            location.reload();
                        })
                        .catch(error => {
                            console.error('Error:', error);
                        });
                });

                buttonCell.appendChild(editButton);
                buttonCell.appendChild(deleteButton);
            }
        }
    } catch (error) {
        console.error("Error fetching XML data:", error);
    }
};



document.addEventListener("DOMContentLoaded", displayTableData);

if (user !== null) {
    $("#login").hide();
    $("#currentuser").text(user.username);
    $("#currentuser").show();
    $("#contactsDiv").show();
    $("#noUser").hide();
    displayTableData();

} else {
    $("#logout").hide();  
    $("#currentuser").hide();
    $("#contactsDiv").hide();
    $("#noUser").show();
}

/*
*   Button Redirections
*/

$("#sign_up").on("click", () => window.location.href = "/Home/Register");
$("#gotoLogin").on("click", () => window.location.href = "/Home/Auth");
$("#profile").on("click", () => window.location.href = "/Home/Profile");
$("#gotoLogin2").on("click", () => window.location.href = "/Home/Auth");
$("#addContact").on("click", () => window.location.href = "/Home/AddContact");

/*
*   Login Button
*/

$("#loginbtn").on("click", (event) => {
    const username = $("#username").val();
    const password = $("#password").val();

    $.ajax({
        method: "POST",
        url: "http://www.contactlistdata.com/api/login.php",
        data: { username: username, password: password },
        success: (response) => {
            if (response.error) {
                console.error("Login error:", response.error);
                alert("Login failed. Please check your credentials and try again.");
            } else {
                console.log("Login successful:", response.message);
                localStorage.setItem("user", JSON.stringify(response.user));
                user = response.user;

                $("#login").hide();
                $("#logout").show();
                window.location.href = "/";
            }
        },
        error: (error) => {
            console.error("Login error:", error);
            alert("Login failed. Please try again.");
        }
    });
});

/*
*   Logout Button
*/

$("#logout").on("click", (event) => {
    event.preventDefault();

    user = null;
    localStorage.clear();

    $("#login").show();
    $("#logout").hide();
    $("#currentuser").hide();

    window.location.href = "/";
});


$(document).on("click", (event) => {
    var clickover = $(event.target);
    var opened = $(".navbar-collapse").hasClass("show");
    if (opened === true && !clickover.hasClass("navbar-toggler")) {
        $(".navbar-toggler").on("click", () => { });
    }
});

/*
*   Register Button
*/

$("#registerBtn").on("click", (event) => {
    event.preventDefault();

    const rUsername = $("#rUsername").val();
    const firstName = $("#firstName").val();
    const middleName = $("#middleName").val();
    const lastName = $("#lastName").val();
    const birthYear = $("#birthYear").val();
    const birthMonth = $("#birthMonth").val();
    const birthDay = $("#birthDay").val();
    const sex = $("#sex").val();
    const address = $("#address").val();
    const civilStatus = $("#civilStatus").val();
    const rEmail = $("#rEmail").val();
    const rPassword = $("#rPassword").val();
    const cPassword = $("#cPassword").val();
    const phoneNum = $("#phone").val();

    if (!rUsername || !firstName || !middleName || !lastName || !birthYear || !birthMonth || !birthDay || !sex || !address || !civilStatus || !rEmail || !rPassword || !cPassword || !phoneNum) {
        alert("Please fill all the fields");
        return; 
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(rEmail)) {
        alert("Invalid email format");
        return;
    }

    if (rPassword !== cPassword) {
        alert("Passwords do not match");
        return;
    }

    $.ajax({
        method: "POST",
        url: "http://www.contactlistdata.com/api/register_user.php",
        data: {
            usname: rUsername,
            firstName: firstName,
            middleName: middleName,
            lastName: lastName,
            birthYear: birthYear,
            birthMonth: birthMonth,
            birthDay: birthDay,
            sex: sex,
            address: address,
            civilStatus: civilStatus,
            email: rEmail,
            pass: rPassword,
            phone: phoneNum
        },
        success: (response) => {
            if (response.error) {
                alert(response.error);
            } else {
                alert(response.message);
                window.location.href = "/Home/Auth";
            }
        },
        error: (error) => {
            console.error("Registration error:", error);
            alert("Registration failed. Please try again.");
        }
    });
});



/*
*   Change Password Button
*/

$("#changePassBtn").on("click", () => {
    const oldPass = $("#oldPass").val();
    const newPass = $("#newPass").val();
    const cNewPass = $("#cNewPass").val();

    if (!oldPass || !newPass || !cNewPass) {
        alert("Please fill all fields");
        return;
    }

    if (newPass !== cNewPass) {
        alert("Passwords do not match");
        return;
    }

    const username = user.username; 

    $.ajax({
        method: "POST",
        url: "http://www.contactlistdata.com/api/change_password.php",
        data: { username: username, oldPass: oldPass, newPass: newPass },
        success: (response) => {
            alert(response.message);
            window.location.href = "/";
        },
        error: (error) => {
            console.error("Password change error:", error);
            alert("Password change failed. Please try again.");
        }
    });
});

/*
*   Add Contact Button
*/

$("#addContactBtn").on("click", (event) => {
    event.preventDefault();

    var cFirstName = $("#cFirstName").val();
    var cMiddleName = $("#cMiddleName").val();
    var cLastName = $("#cLastName").val();
    var cSex = $("#cSex").val();
    var cCivilStatus = $("#cCivilStatus").val();
    var cBirthYear = $("#cBirthYear").val();
    var cBirthMonth = $("#cBirthMonth").val();
    var cBirthDay = $("#cBirthDay").val();
    var cAddress = $("#cAddress").val();
    var cPhone = $("#cPhone").val();
    var cEmail = $("#cEmail").val();
    var contactOf = user.uid;

    if (!cFirstName || !cMiddleName || !cLastName || !cSex || !cCivilStatus || !cBirthYear || !cBirthMonth || !cBirthDay || !cAddress || !cPhone || !cEmail) {
        alert("Please fill all the fields");
        return;
    }

    const postData = {
        cFirstName: cFirstName,
        cMiddleName: cMiddleName,
        cLastName: cLastName,
        cSex: cSex,
        cCivilStatus: cCivilStatus,
        cBirthYear: cBirthYear,
        cBirthMonth: cBirthMonth,
        cBirthDay: cBirthDay,
        cAddress: cAddress,
        cPhone: cPhone,
        cEmail: cEmail,
        contactOf: contactOf
    };

    $.ajax({
        type: "POST",
        url: "http://www.contactlistdata.com/api/add_contact.php",
        data: postData,
        success: function (data) {
            alert("Contact added successfully.");
            window.location.href = "/Home/Contacts";
        },
        error: function (error) {
            console.error('Error:', error);
            alert('An error occurred while adding the contact.');
        }
    });
});

