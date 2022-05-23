(function ($) {
    console.log('check-js-contact')
    $('form').each(function() { this.reset() });
    if(document.getElementById('checkboxpot')){
        const checkbox = document.getElementById('checkboxpot')
        //  honeypot checkbox disable button validation
        checkbox.addEventListener('change', (event) => {
            if (event.currentTarget.checked) {
                document.getElementById("submitbtn").disabled = true;
            } else {
                document.getElementById("submitbtn").disabled = false;
            }
        }) 
    }
    
    const form = document.getElementById('submitbtn')
    form.addEventListener('submit', (event) => {
        ValidateEmail(event);
    }) 

   if(document.getElementById('textCharacterCount')){
    setTimeout(function () {
        document.getElementById("description").removeAttribute("tabindex")
    }, 1000);
    var inputVal = document.getElementById('description');
    var countdisp = document.getElementById('textCharacterCount');
    countdisp.innerHTML = 0;
   }
   
    inputVal.addEventListener('keydown', count);    

    function count(e) {
        var len = inputVal.value.length;
        countdisp.innerHTML = len;
    }

    $(document).ready(function () {
       
        $('#name').on('keyup focus', function (event) {
            validateForm('name');
        });
        $('#email').on('keyup', function (event) {
            validateForm('email');
        });
        $('#description').on('keyup', function (event) {
            validateForm('desc');
        });
        $('#00N9E000004hkmw').on('change keydown', function (event) {
            validateForm('country');
        });
        $('#subject').on('change keydown', function (event) {
            validateForm('subject');
        });
        $('#subject').on('change keydown', function (event) {
            validateForm('subject');
        });
        $('#submitbtn').click(function(event){
            ValidateEmail(event);
            validateForm('all');
            OnfocusField();
       });
        $('#name').on('keypress', function (event) {
            if ($('#name').val().length == 0 && event.which === 32) {
                event.preventDefault();
                return false;
            } else if (event.which === 32) {
                return true;
            } else {
                var regex = new RegExp("^[a-zA-Z ]+$");
                var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
                if (regex.test(key)) {
                    return true;
                }

                event.preventDefault();
                return false;
            }
        })

        $('#email').on('keypress', function (event) {
            if (event.which === 32) {
                return false;
            } else {
                validateForm('email');
            }
        })

    });

    function emailValidation() {
        var element = document.getElementById("emailGroup");
        var val = document.getElementById("email");
        var reg = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (val.value.match(reg)) {
            element.classList.remove("emailValidation");
            document.getElementById('emailError').style.display = 'none';
            document.getElementById('emailReqMsg').style.display = 'none';
        } else {
            element.classList.add("emailValidation");
            document.getElementById('emailError').style.display = 'block';
            document.getElementById('emailReqMsg').style.display = 'none';
        }
    }

    function OnfocusField() {
        if (document.haleonForm.name.value == '') {
            document.haleonForm.name.focus();
        } else if (document.haleonForm.email.value == '') {
            document.haleonForm.email.focus();
        } else if (document.forms["haleonForm"]["00N9E000004hkmw"].value == '') {
            document.forms["haleonForm"]["00N9E000004hkmw"].focus();
        } else if (document.haleonForm.subject.value == '') {
            document.haleonForm.subject.focus();
        } else if (document.haleonForm.description.value == '') {
            document.haleonForm.description.focus();
        }
    }

    function validateForm(type) {
        let name = document.forms["haleonForm"]["name"].value;
        let email = document.forms["haleonForm"]["email"].value;
        let country = document.forms["haleonForm"]["00N9E000004hkmw"].value;
        let enquiry = document.forms["haleonForm"]["subject"].value;
        let desc = document.forms["haleonForm"]["description"].value;
        let element = document.getElementById("emailGroup");
        if ((type == 'name' || type == 'all')) {
            if (name == "") {
                document.getElementById('name').style.cssText = "border-color: #c30000; outline: 1px solid #c30000";
                document.getElementById("nameReqMsg").innerHTML = "Required";
                document.getElementById('nameReqMsg').style.display = 'block';
            } else if (name.length < 5) {
                console.log(name.length);
                document.getElementById("nameReqMsg").innerHTML = "This field must contain at least 5 characters.";
                document.getElementById('nameReqMsg').style.display = 'block';
            } else {
                document.getElementById('name').style.cssText = "border-color: #EAEAEA; outline: 1px solid #EAEAEA";
                document.getElementById('nameReqMsg').style.display = 'none';
            }
        }

        if ((type == 'email' || type == 'all')) {
            if (email == '') {
                element.classList.remove("emailValidation");
                document.getElementById('email').style.cssText = "border-color: #c30000; outline: 1px solid #c30000";
                document.getElementById('emailError').style.display = 'none';
                document.getElementById('emailReqMsg').style.display = 'block';
            } else {
                document.getElementById('email').style.cssText = "border-color: #EAEAEA; outline: 1px solid #EAEAEA";
                document.getElementById('emailReqMsg').style.display = 'none';
                emailValidation();
            }
        }

        if ((type == 'country' || type == 'all')) {
            if (country == "") {
                document.getElementById('00N9E000004hkmw').style.cssText = "border-color: #c30000; outline: 1px solid #c30000";
                document.getElementById('countryReqMsg').style.display = 'block';
            } else {
                document.getElementById('00N9E000004hkmw').style.cssText = "border-color: #EAEAEA; outline: 1px solid #EAEAEA";
                document.getElementById('countryReqMsg').style.display = 'none';
            }
        }
        if ((type == 'subject' || type == 'all')) {
            if (enquiry == "") {
                document.getElementById('subject').style.cssText = "border-color: #c30000; outline: 1px solid #c30000";
                document.getElementById('enquiryReqMsg').style.display = 'block';
            } else {
                document.getElementById('subject').style.cssText = "border-color: #EAEAEA; outline: 1px solid #EAEAEA";
                document.getElementById('enquiryReqMsg').style.display = 'none';
            }
        }
        if ((type == 'desc' || type == 'all')) {
            if (desc == "") {
                document.getElementById('description').style.cssText = "border-color: #c30000; outline: 1px solid #c30000";
                document.getElementById('descReqMsg').style.display = 'block';
            } else {
                document.getElementById('description').style.cssText = "border-color: #EAEAEA; outline: 1px solid #EAEAEA";
                document.getElementById('descReqMsg').style.display = 'none';
            }
        }
    }

    function ValidateEmail(event) {
        var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (document.haleonForm.email.value.match(mailformat)) {
            document.haleonForm.retURL.value = "https://haleon-com.preprod-cf65.ch.adobecqms.net/contact-us/thank-you";
            document.haleonForm.action = "https://crms--crmssit.my.salesforce.com/servlet/servlet.WebToCase?encoding=UTF-8";
            document.getElementById("haleonForm").submit();
            setTimeout(document.haleonForm.reset(), 2000);
            return true;
        } else {
            event.preventDefault();
            document.haleonForm.email.focus();
            return false;
        }
    }

    function ClearForm() {
        document.haleonForm.reset();
    }
})(Cog.jQuery());