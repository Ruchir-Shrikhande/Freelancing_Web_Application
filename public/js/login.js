$("#login-form").submit(function (event) {
    event.preventDefault();
    let username = $('#usernameInput').val()
    let password = $('#passwordInput').val()
    try {
        validateUsername(username);
        validatePassword(password);
        validateTags([username, password])
    }
    catch (e) {
        event.preventDefault()
        alert(e)
        return
    }
    if (username && password) {
        var requestConfig = {
            method: 'POST',
            url: '/login',
            contentType: 'application/json',
            data: JSON.stringify({
                usernameInput: username,
                passwordInput: password
            })
        };
        $.ajax(requestConfig).then(function (responseMessage) {
            console.log(responseMessage)
            window.location.href = "/home";
        }, function (responseMessage) {
            data = JSON.parse(responseMessage.responseText)
            alert(data.error)
            return
        });
    }
});

const validateTags = (str) => {
    str.forEach(s => {
        if (s.match(/(<([^>]+)>)/ig)) {
            throw "Input contains html tags"
        }
    })
}

const validateUsername = (inputUsername) => {
    if (!inputUsername) throw "Username not provided.";
    if (typeof inputUsername !== "string") throw "Either the userName or Password is incorrect.";
    if (inputUsername.trim().length === 0) throw "Either the userName or Password is incorrect.";
    if (inputUsername.includes(" ")) throw "Either the userName or Password is incorrect.";
    if (inputUsername.length < 4) throw "Either the userName or Password is incorrect.";
    const regexLetters = /[a-zA-Z]/;
    if (inputUsername.search(regexLetters) < 0) {
        throw "Either the userName or Password is incorrect.";
    }
    const regex = new RegExp("^[a-zA-Z0-9]*$");
    if (!regex.test(inputUsername)) throw "Either the userName or Password is incorrect.";
};

const validatePassword = (inputPassword) => {
    if (!inputPassword) throw "Password not provided.";
    if (typeof inputPassword !== "string") throw "Either the userName or Password is incorrect.";
    if (inputPassword.trim().length === 0) throw "Either the userName or Password is incorrect.";
    if (inputPassword.includes(" ")) throw "Either the userName or Password is incorrect.";
    if (inputPassword.length < 6) throw "Either the userName or Password is incorrect.";
    const regexDigit = /[0-9]/;
    if (inputPassword.search(regexDigit) < 0) {
        throw "Either the userName or Password is incorrect.";
    }
    const regexUppercase = /[A-Z]/;
    if (inputPassword.search(regexUppercase) < 0) {
        throw "Either the userName or Password is incorrect.";
    }
    const regexSpecialCharacter = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    if (inputPassword.search(regexSpecialCharacter) < 0) {
        throw "Either the userName or Password is incorrect.";
    }
};