let emailSent = false;

module.exports = {
    isEmailSent: function() {
        console.log(emailSent);
        return emailSent;
    },
    setEmailSent: function(status) {
        emailSent = status;
    }
};