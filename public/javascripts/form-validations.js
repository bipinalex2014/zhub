$(document).ready(function () {
    $('#formNewCompany').validate({
        rules: {
            name: {
                required: true,
            },
            address: {
                required: true
            },
            email: {
                required: true,
                validEmailid:true,
            },
            contactperson: {
                required: true
            },
            designation: {
                required: true
            },
            roomno: {
                required: true
            },
            floorno: {
                required: true
            },
            building: {
                required: true
            },
            username: {
                required: true
            },
            password: {
                required: true,
                strongPassword:true,
            },
            confirmpassword: {
                required: true,
                equalTo: '#password'
            },
            contactnumber: {
                required: true,
                indianMobileNumber:true,
            }

        },
        messages:{
            indianMobileNumber:'Enter a valid Mobile Number'
        },
        errorPlacement: (error, element) => {

            error.addClass('text-danger')
            error.appendTo(element.parent('div'))
        },
        // highlight: function (element) {
        //     $(element).addClass('invalid').removeClass('valid')
        // },
        // unhighlight: function (element) {
        //     $(element).removeClass('invalid')
        // },
    })

    $('#formCreateNews').validate({
        rules: {
            title:{
                required:true,
            },
            shortdesc:{
                required:true,
            },
            body:{
                required:true,
            },
            photo:{
                required:true,
            },
            author:{
                required:true,
            },
            tags:{

            },

        },
        errorPlacement: (error, element) => {

            error.addClass('text-danger')
            error.appendTo(element.parent('div'))
        },
    })
    $('#formCreateVideo').validate({
        rules: {
            title:{
                required:true,
            },
           subtitle:{
                required:true,
            },
            videos:{
                required:true,
            }

        },
        errorPlacement: (error, element) => {

            error.addClass('text-danger')
            error.appendTo(element.parent('div'))
        },
    })

    $('#formCreatePhoto').validate({
        rules: {
            title:{
                required:true,
            },
           subtitle:{
                required:true,
            },
            photos:{
                required:true,
            }

        },
        errorPlacement: (error, element) => {

            error.addClass('text-danger')
            error.appendTo(element.parent('div'))
        },
    })



    //Custom validator for input is a Mobile Phone Number
    $.validator.addMethod("indianMobileNumber", function (value, element) {
        return this.optional(element) || /^(?:(?:\+|0{0,2})91(\s*[\ -]\s*)?|[0]?)?[789]\d{9}|(\d[ -]?){10}\d$/.test(value)
    }, "Enter a valid indian mobile number without country code");
    //Custom validator for input is an email address
    $.validator.addMethod("validEmailid", function (value, element) {
        return this.optional(element) || /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value)
    }, "Enter email address like yourname@example.com");
    $.validator.addMethod("strongPassword", function (value, element) {
        return this.optional(element) || /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/.test(value)
    }, "Password contains\n1. At least one digit, At least one lowercase character, At least one uppercase character , At least one special character, At least 8 characters in length, but no more than 16.");

})