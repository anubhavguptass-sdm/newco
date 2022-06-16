(function ($) {
    // window.onbeforeunload = function() { 
    //     setTimeout(document.haleonForm.reset(), 2000);
    //  };
    (function () {
        window.onpageshow = function(event) {
            if (event.persisted) {
                window.location.reload();
            }
        };
    })();
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
   if(document.getElementById('textCharacterCount')){
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
        $('#name').on('keydown keypress', function (event) {
            validateForm('name');
        });
        $('#email').on('keydown', function (event) {
            validateForm('email');
        });
        $('#description').on('keydown keypress', function (event) {
            validateForm('desc');
        });
        $('#00N1q000000v7U5').on('change keydown', function (event) {
            validateForm('country');
        });
        $('#subject').on('change keydown', function (event) {
            validateForm('subject');
            if(event.type == 'change'){
                let val = document.haleonForm.subject.value;
                document.getElementById('subjectDescription').style.cssText = "color: #9e9e9e; display:block";
            //  if(val == 'Report a problem'){
            //     document.getElementById("subjectDescription").innerHTML = 'Please provide as much detail as possible, including: product variant, expiration date and LOT/BATCH numbers. In case of product quality reports, we might follow up and request a photo showing the defect.';
            //     // $('#description').attr('placeholder', 'Please provide as much detail as possible, including: product variant, expiration date and LOT/BATCH numbers. In case of product quality reports, we might follow up and request a photo showing the defect.');
            //  } 
            // else if(val == 'Brand or Product question'){
            //     document.getElementById("subjectDescription").innerHTML =  'Got a question to ask or something to tell us? We’re here for you.';
            //  } 
            //  else if(val == 'Anything else'){
            //     document.getElementById("subjectDescription").innerHTML =   'If your enquiry is related to commercial and distribution, promotions, sponsorship or anything else, we will point you in the right direction so your question is answered as quickly as possible.';
            //  } 
            var subjectMap = {
                "none": "",
                "Brand or Product question": "Got a question to ask or something to tell us? We’re here for you.",
                "Product Availability": "Please provide the details of the product variant in question, as well as your location. Our team will be able to advise of any out of stock items within our supply chain and estimate when the product is expected to be back in stock. ",
                "Report a problem": "Please provide as much detail as possible, including: product variant, expiry date and LOT/BATCH numbers. In case of product quality reports we might follow up and request a photo showing the defect.",
                "Anything else": "If your enquiry is related to commercial and distribution, promotions, sponsorship or anything else, we'll point you in the right direction so your question is answered as quickly as possible."
            };
           document.getElementById("subjectDescription").innerHTML = subjectMap[val];
            validateForm('subject');
            //  else {
            //     validateForm('subject');
            //  } 
            }
        });
       
        $('#submitbtn').click(function(event){
            validateForm('all');
            OnfocusField(event);
       });
        $('#name').on('keypress', function (event) {
            if ($('#name').val().length == 0 && event.which === 32) {
                event.preventDefault();
                return false;
            } else if (event.which === 32) {
                return true;
            } else {
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
                validateForm('email');
            }
        })

    });

    function emailValidation() {
        var val = document.getElementById("email");
        var reg = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (val.value.match(reg)) {
        $('#email').removeClass('error');
        $('#email').addClass('success');
            document.getElementById('emailError').style.display = 'none';
            document.getElementById('emailReqMsg').style.display = 'none';
        } else {
            document.getElementById('emailError').style.display = 'block';
            document.getElementById('emailReqMsg').style.display = 'none';
        }
    }

    function OnfocusField(event) {
        
        if (document.haleonForm.name.value == '') {
            document.haleonForm.name.focus();
        } else if (document.haleonForm.email.value == '') {
            document.haleonForm.email.focus();
        } else if (document.forms["haleonForm"]["00N1q000000v7U5"].value == '' || document.forms["haleonForm"]["00N1q000000v7U5"].value == 'none') {
            document.forms["haleonForm"]["00N1q000000v7U5"].focus();
        } else if (document.haleonForm.subject.value == '' || document.haleonForm.subject.value == 'none') {
            document.haleonForm.subject.focus();
        } else if (document.haleonForm.description.value == '') {
            document.haleonForm.description.focus();
        }
        else if (!document.haleonForm.termsAndconditions.checked) {
            document.haleonForm.termsAndconditions.focus();
        }
        else{
            ValidateEmail(event);
        }
    }

    function validateForm(type) {
        debugger
        let name = document.forms["haleonForm"]["name"].value.trim();
        let email = document.forms["haleonForm"]["email"].value;
        let country = document.forms["haleonForm"]["00N1q000000v7U5"].value;
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
                document.getElementById('emailReqMsg').style.display = 'none';
                emailValidation();
            }
        }

        if ((type == 'country' || type == 'all')) {
            if (country == "none" || country == "") {
                $('#00N1q000000v7U5').removeClass('success');
                $('#00N1q000000v7U5').addClass('error');
                document.getElementById('countryReqMsg').style.display = 'block';
            } else {
                $('#00N1q000000v7U5').removeClass('error');
                $('#00N1q000000v7U5').addClass('success');
                document.getElementById('countryReqMsg').style.display = 'none';
            }
        }
        if ((type == 'subject' || type == 'all')) {
            if (enquiry == "" || enquiry == 'none') {
                $('#subject').removeClass('success');
                $('#subject').addClass('error');
                document.getElementById('subjectDescription').style.display = 'block';
                document.getElementById("subjectDescription").innerHTML ="Required";

            } else {
                $('#subject').removeClass('error');
                $('#subject').addClass('success');
                document.getElementById('subjectDescription').style.display = 'none';
            }
        }
        if ((type == 'desc' || type == 'all')) {
            desc = desc.trim();
            if (desc == "") {
                $('#description').removeClass('success');
                $('#description').addClass('error');
                document.getElementById("descReqMsg").innerHTML = "Required.";
                document.getElementById('descReqMsg').style.display = 'block';
            } 
            else if (desc.length < 20) {
                $('#description').removeClass('success');
                $('#description').addClass('error');
                document.getElementById("descReqMsg").innerHTML = "This field must contain at least 20 characters.";
                document.getElementById('descReqMsg').style.display = 'block';
            }
            else {
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
        if(val.length < 5){
            event.preventDefault();
            document.haleonForm.name.focus();
            return false;
        }
        let text =document.haleonForm.description.value;
            text = text.trim();
        if(text.length < 20){
            event.preventDefault();
            document.haleonForm.description.focus();
            return false;
        }
        if (document.haleonForm.email.value.match(mailformat)) {
                    document.haleonForm.retURL.value = `${window.location.origin}/contact-us/thank-you/`;
                    window.location.href = document.haleonForm.retURL.value;
                    document.getElementById("subjectDescription").innerHTML = '';
                   document.getElementById("haleonForm").submit();
                   return true;
       }
       else {
        event.preventDefault();
        document.haleonForm.email.focus();
        return false;
    }
    }

})(Cog.jQuery());