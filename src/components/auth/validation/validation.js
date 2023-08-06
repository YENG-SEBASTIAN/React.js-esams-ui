
const validation = (values) => {

    let errors = {};

    if(!values.username){
        errors.username = 'Index number is required';
    }else if(values.username.length < 10){
        errors.username = 'Index number be 10 degit';
    }else if(values.username.length > 10){
        errors.username = 'Index number must be 10 degit'
    }

    if(!values.fullName){
        errors.fullName = 'Name is required';
    }

    if(!values.courseName){
        errors.fullName = 'This field is required';
    }

    if(!values.email){
        errors.email = 'Email is required';
    }else if(!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9]+(?:\.[a-zA-Z0-9]+)*$/.test(values.email)){
        errors.email = 'Email is invalid';
    }

    if(!values.level){
        errors.level = 'Select level'
    }

    if(!values.role){
        errors.level = 'Select role'
    }

    if(!values.password){
        errors.password = 'Password is required';
    }
    else if(values.password.length < 8){
        errors.password = 'Password must be 8 to 24 long';
    }else if(!/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/.test(values.password)){
        errors.password = 'Password must contain numbers, symbols, uppercase & lowercase letters'
    }

    if(!values.re_password){
        errors.re_password = 'Password is required';
    }else if(values.re_password.length < 8){
        errors.re_password = 'Password must be 8 to 24 long';
    }else if(values.password !== values.re_password){
        errors.re_password = 'Password does not match'
    }

    if(!values.new_password){
        errors.new_password = 'Password is required';
    }else if(values.new_password.length < 8){
        errors.new_password = 'Password must be 8 to 24 long';
    }else if(!/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/.test(values.new_password)){
        errors.new_password = 'Password must contain numbers, symbols, uppercase & lowercase letters'
    }

    if(!values.re_new_password){
        errors.re_new_password = 'Password is required';
    }else if(values.re_new_password.length < 8){
        errors.re_new_password = 'Password must be 8 to 24 long';
    }else if(values.new_password !== values.re_new_password){
        errors.re_new_password = 'Password does not match'
    }


    return errors
}

export default validation;