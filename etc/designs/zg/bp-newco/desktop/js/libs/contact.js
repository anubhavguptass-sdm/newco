(function ($) {
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
        var len = inputVal.value.length;
        countdisp.innerHTML = len;
    }


    $(document).ready(function () {
        $('#privacy').removeClass("external");
        $('#name').on('keyup focus', function (event) {
            validateForm('name');
        });
        $('#email').on('keyup focus', function (event) {
            validateForm('email');
        });
        $('#description').on('keyup focus', function (event) {
            validateForm('desc');
        });
        $('#00N9E000004hkmw').on('change keydown focus', function (event) {
            validateForm('country');
        });
        $('#subject').on('change keydown focus', function (event) {
            validateForm('subject');
            if(event.type == 'change'){
                let val = document.haleonForm.subject.value;
                document.getElementById('enquiryReqMsg').style.cssText = "color: #9e9e9e; display:block";
             if(val == 'Report a problem'){
                document.getElementById("enquiryReqMsg").innerHTML = 'Please provide as much detail as possible, including: product variant, expiration date and LOT/BATCH numbers. In case of product quality reports, we might follow up and request a photo showing the defect.';
                // $('#description').attr('placeholder', 'Please provide as much detail as possible, including: product variant, expiration date and LOT/BATCH numbers. In case of product quality reports, we might follow up and request a photo showing the defect.');
             } 
            else if(val == 'Brand or Product question'){
                document.getElementById("enquiryReqMsg").innerHTML =  'Got a question to ask or something to tell us? We’re here for you.';
             } 
             else if(val == 'Anything else'){
                document.getElementById("enquiryReqMsg").innerHTML =   'If your enquiry is related to commercial and distribution, promotions, sponsorship or anything else, we will point you in the right direction so your question is answered as quickly as possible.';
             } 
             else {
                validateForm('subject');
             } 
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

    function OnfocusField(event) {
        
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
        else if (!document.haleonForm.checkbox_1.checked) {
            document.haleonForm.checkbox_1.focus();
        }
        else{
            ValidateEmail(event);
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
                document.getElementById('name').style.cssText = "border-color: #c30000; outline: 1px solid #c30000";
                document.getElementById("nameReqMsg").innerHTML = "This field must contain at least five characters.";
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
                document.getElementById('enquiryReqMsg').style.cssText = "color: #c30000; display: block";
                document.getElementById("enquiryReqMsg").innerHTML ="Required";

            } else {
                document.getElementById('subject').style.cssText = "border-color: #EAEAEA; outline: 1px solid #EAEAEA";
            }
        }
        if ((type == 'desc' || type == 'all')) {
            if (desc == "") {
                document.getElementById('description').style.cssText = "border-color: #c30000; outline: 1px solid #c30000";
                document.getElementById("descReqMsg").innerHTML = "Required.";
                document.getElementById('descReqMsg').style.display = 'block';
            } 
            else if (desc.length < 20) {
                document.getElementById('description').style.cssText = "border-color: #c30000; outline: 1px solid #c30000";
                document.getElementById("descReqMsg").innerHTML = "This field must contain at least 20 characters.";
                document.getElementById('descReqMsg').style.display = 'block';
            }
            else {
                document.getElementById('description').style.cssText = "border-color: #EAEAEA; outline: 1px solid #EAEAEA";
                document.getElementById('descReqMsg').style.display = 'none';
            }
        }
    }

    function ValidateEmail(event) {
       
        var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if(document.haleonForm.name.value.length < 5){
            event.preventDefault();
            document.haleonForm.name.focus();
            return false;
        }
        if(document.haleonForm.description.value.length < 20){
            event.preventDefault();
            document.haleonForm.description.focus();
            return false;
        }
        if (document.haleonForm.email.value.match(mailformat)) {
                    document.haleonForm.retURL.value = `${window.location.origin}/contact-us/thank-you/`;
                    window.location.href = document.haleonForm.retURL.value;
                    document.getElementById("enquiryReqMsg").innerHTML = '';
                   document.getElementById("haleonForm").submit();
                   setTimeout(document.haleonForm.reset(), 2000);
                   return true;
       }
       else {
        event.preventDefault();
        document.haleonForm.email.focus();
        return false;
    }
        
       
      
        
        
       
    }

})(Cog.jQuery());