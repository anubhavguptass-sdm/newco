(function ($) {

    (function () {
        if (document.addEventListener) {
            window.addEventListener('pageshow', function (event) {
                    if (event.persisted || window.performance &&
                        window.performance.navigation.type == 2) {
                        window.location.reload();
                    }
                },
                false);
        }
    })();
    if (document.getElementById('checkboxpot')) {
        const checkbox = document.getElementById('checkboxpot')
        //  honeypot checkbox disable button validation
        checkbox.addEventListener('change', (event) => {
            if (event.currentTarget.checked) {
                document.getElementById("submit").disabled = true;
            } else {
                document.getElementById("submit").disabled = false;
            }
        })
    }
    if (document.getElementById('textCharacterCount')) {
        setTimeout(function () {
            document.getElementById("description").removeAttribute("tabindex")
        }, 1000);
        var inputVal = document.getElementById('description');
        var countdisp = document.getElementById('textCharacterCount');
        countdisp.innerHTML = 0;
    }

    inputVal.addEventListener('keyperss', count);
    inputVal.addEventListener('keyup', count);

    function count(e) {
        var len = inputVal.value.trim();
        countdisp.innerHTML = len.length;
    }


    $(document).ready(function () {
        $('#privacy').removeClass("external");
        $('#name').on('blur', function (event) {
            validateForm('name');
        });
        $('#email').on('blur', function (event) {
            validateForm('email');
        });
        $('#description').on('blur', function (event) {
            validateForm('desc');
        });
        $('#00N1t00000Kz8CI').on('change keydown', function (event) {
            validateForm('country');
        });
        $('#subject').on('change keydown', function (event) {
            validateForm('subject');
            if (event.type == 'change') {
                let val = document.haleonForm.subject.value;
                document.getElementById('subjectDescription').style.cssText = "color: #000; display:block";
                var subjectMap = {
                    "none": "",
                    "Brand or Product question": "Got a question to ask or something to tell us? We’re here for you.",
                    "Product Availability": "Please provide the details of the product variant in question, as well as your location. Our team will be able to advise of any out of stock items within our supply chain and estimate when the product is expected to be back in stock. ",
                    "Report a problem": "Please provide as much detail as possible, including: product variant, expiry date and LOT/BATCH numbers. In case of product quality reports we might follow up and request a photo showing the defect.",
                    "Anything else": "If your enquiry is related to commercial and distribution, promotions, sponsorship or anything else, we'll point you in the right direction so your question is answered as quickly as possible."
                };
                document.getElementById("subjectDescription").innerHTML = subjectMap[val];
                validateForm('subject');
            }
        });

        $('#submit').click(function (event) {
            validateForm('all');
            OnfocusField(event);
        });
        $('#name').on('keypress', function (event) {
            if ($('#name').val().length == 0 && event.which === 32) {
                event.preventDefault();
                return false;
            } else if (event.which === 32) {
                return true;
            }
             else {
                var regex = new RegExp("^[a-zA-Z-]+$");
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
                return true;
            }
        })

    });

    function emailValidation() {
        var val = document.haleonForm.email.value;;
        var reg = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (val.match(reg)) {
            $('#email').removeClass('error');
            $('#email').addClass('success');
            document.getElementById('emailError').style.display = 'none';
            document.getElementById('emailReqMsg').style.display = 'none';
            return true;
        } else {
            document.getElementById('emailError').style.display = 'block';
            document.getElementById('emailReqMsg').style.display = 'none';
            return false;
        }
    }
    var flagVal = false;
    var eventObj = {
        'name': '',
        'email': '',
        'country': '',
        'subject': '',
        'discription': '',
        'termsAndconditions': '',

    }

    function OnfocusField(event) {
        if (document.haleonForm.name.value == '') {
            document.haleonForm.name.focus();
            EventTriger();
        } else if (document.haleonForm.email.value == '') {
            document.haleonForm.email.focus();
            EventTriger();
        } else if (document.forms["haleonForm"]["00N1t00000Kz8CI"].value == '' || document.forms["haleonForm"]["00N1t00000Kz8CI"].value == 'none') {
            document.forms["haleonForm"]["00N1t00000Kz8CI"].focus();
            EventTriger();
        } else if (document.haleonForm.subject.value == '' || document.haleonForm.subject.value == 'none') {
            document.haleonForm.subject.focus();
            EventTriger();
        } else if (document.haleonForm.description.value == '') {
            document.haleonForm.description.focus();
            EventTriger();
        } else if (!document.haleonForm.termsAndconditions.checked) {
            document.haleonForm.termsAndconditions.focus();
            EventTriger(termsAndconditions);
        } else {
            ValidateEmail(event);
        }
    }

    function validateForm(type) {
        let name = document.forms["haleonForm"]["name"].value.trim();
        let email = document.forms["haleonForm"]["email"].value;
        let country = document.forms["haleonForm"]["00N1t00000Kz8CI"].value;
        let enquiry = document.forms["haleonForm"]["subject"].value;
        let desc = document.forms["haleonForm"]["description"].value.trim();
        let element = document.getElementById("emailGroup");
        if ((type == 'name' || type == 'all')) {
            name.trim();
            if (name == "") {
                $('#name').removeClass('success');
                $('#name').addClass('error');
                document.getElementById("nameReqMsg").innerHTML = "Required";
                document.getElementById('nameReqMsg').style.display = 'block';
            } else if (name.length < 5) {
                $('#name').removeClass('success');
                $('#name').addClass('error');
                document.getElementById("nameReqMsg").innerHTML = "This field must contain at least five characters.";
                document.getElementById('nameReqMsg').style.display = 'block';
            } else {
                $('#name').removeClass('error');
                $('#name').addClass('success');
                document.getElementById('nameReqMsg').style.display = 'none';
            }
        }

        if ((type == 'email' || type == 'all')) {
            if (email == '') {
                $('#email').removeClass('success');
                $('#email').addClass('error');
                document.getElementById('emailError').style.display = 'none';
                document.getElementById('emailReqMsg').style.display = 'block';
            } else {
                $('#email').removeClass('success');
                $('#email').addClass('error');
                document.getElementById('emailReqMsg').style.display = 'none';
                emailValidation();
            }
        }

        if ((type == 'country' || type == 'all')) {
            if (country == "none" || country == "") {
                $('#00N1t00000Kz8CI').removeClass('success');
                $('#00N1t00000Kz8CI').addClass('error');
                document.getElementById('countryReqMsg').style.display = 'block';
            } else {
                $('#00N1t00000Kz8CI').removeClass('error');
                $('#00N1t00000Kz8CI').addClass('success');
                document.getElementById('countryReqMsg').style.display = 'none';
            }
        }
        if ((type == 'subject' || type == 'all')) {
            if (enquiry == "" || enquiry == 'none') {
                $('#subject').removeClass('success');
                $('#subject').addClass('error');
                document.getElementById('subjectDescription').style.cssText = "color: #f41811; display:block";
                document.getElementById("subjectDescription").innerHTML = "Required";

            } else {
                $('#subject').removeClass('error');
                $('#subject').addClass('success');
                document.getElementById('subjectDescription').style.display = 'blick';
            }
        }
        if ((type == 'desc' || type == 'all')) {
            desc = desc.trim();
            if (desc == "") {
                $('#description').removeClass('success');
                $('#description').addClass('error');
                document.getElementById("descReqMsg").innerHTML = "Required.";
                document.getElementById('descReqMsg').style.display = 'block';
            } else if (desc.length < 20) {
                $('#description').removeClass('success');
                $('#description').addClass('error');
                document.getElementById("descReqMsg").innerHTML = "This field must contain at least 20 characters.";
                document.getElementById('descReqMsg').style.display = 'block';
            } else {
                $('#description').removeClass('error');
                $('#description').addClass('success');
                document.getElementById('descReqMsg').style.display = 'none';
            }
        }
    }

    function ValidateEmail(event) {
        var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        let val = document.haleonForm.name.value;
        val = val.trim();
        let flag = false;
        if (val.length) {
            let a = Object.values(val);
            a.filter(entry => entry != ' ');
            a.forEach((elem) => {
                var regex = new RegExp("^[a-zA-Z-]+$");
                if(elem != ' '){
                    if (regex.test(elem)) {
                        return true;
                    }
                else{
                    flag = true;
                }
                }
            })
            if (val.length < 5 || flag) {
                if(flag){
                    $('#name').removeClass('success');
                    $('#name').addClass('error');
                    document.getElementById("nameReqMsg").innerHTML = "Numeric value and special character not allowed";
                    document.getElementById('nameReqMsg').style.display = 'block';
                }
                event.preventDefault();
                document.haleonForm.name.focus();
                EventTriger();
                return false;
            }

        }
        else{
            event.preventDefault();
                document.haleonForm.name.focus();
                EventTriger();
                return false; 
        }
        let text = document.haleonForm.description.value;
        text = text.trim();
        if (text.length < 20) {
            event.preventDefault();
            document.haleonForm.description.focus();
            EventTriger();
            return false;
        }
        if (document.haleonForm.email.value.match(mailformat)) {
            flagVal = true;
            EventTriger();
            document.haleonForm.retURL.value = `${window.location.origin}/contact-us/thank-you/`;
            window.location.href = document.haleonForm.retURL.value;
            document.getElementById("subjectDescription").innerHTML = '';
            document.getElementById("haleonForm").submit();
            return true;
        } else {
            event.preventDefault();
            document.haleonForm.email.focus();
            EventTriger(emailError);
            return false;
        }
    }

    function EventTriger(e = null) {
        let a = document.haleonForm.name.value;
        a = a ? a.trim() : '';
        let c = document.haleonForm.description.value;
        c = c ? c.trim() : '';
        eventObj = {
            'name': a && a.length > 4 ? '' : 'Contact Name',
            'email': document.haleonForm.email.value ? '' : 'email',
            'country': document.forms["haleonForm"]["00N1t00000Kz8CI"].value ? '' : 'Country',
            'subject': document.haleonForm.subject.value ? '' : 'Type of Enquiry',
            'discription': c && c.length > 19 ? '' : 'Description',
            'termsAndconditions': document.haleonForm.termsAndconditions.checked ? '' : 'Privacy Policy',

        }
        if (!flagVal) {
            eventObj.email = 'email';
        }
        let b = Object.values(eventObj)
        b.forEach((elem) => {
            if (elem === '') {
                b.splice(0, 1);
            }
        })
        let label = b.toString();
        dataLayer.push({
            event: 'customEvent',
            eventCategory: 'form : General Enquiry',
            eventAction: flagVal ? 'Submission Complete' : 'Validation Error',
            eventLabel: flagVal ? location.href : label

        });
    }
})(Cog.jQuery());