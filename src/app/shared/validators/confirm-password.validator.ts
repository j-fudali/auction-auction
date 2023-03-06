import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function validatePassword(): ValidatorFn{
    return (control: AbstractControl) : ValidationErrors | null => {
        const password = control.get('password')
        const repassword = control.get('rePassword')
        const error = password && repassword && password.value === repassword.value ? null : {passwordsNotMatch: true}
        repassword?.setErrors(error ? {...repassword.errors, ...error} : repassword.errors ? {...repassword.errors} : null)
        return error
    }
}