import { Injectable } from '@angular/core';
import { FormControl, FormGroup, AbstractControl, FormBuilder } from '@angular/forms';


@Injectable()
export class FormCustomValidator {
	private alertsMsg: any;

	constructor( public formBuilder: FormBuilder) {

	}


	public validateAllFormFields(formGroup) {
		Object.keys(formGroup.controls).forEach(field => {
			const control = formGroup.get(field);
			if (control instanceof FormControl && control.enabled) {
				control.markAsTouched({ onlySelf: true });
			} else if (control instanceof FormGroup) {
				this.validateAllFormFields(control);
			}
		});
	}

	public isFieldValid(field: string, form: FormGroup) {
		if (!form.get(field)) {
			throw new Error('Não tem o formControlName ' + field);
		}
		return !form.get(field).valid && form.get(field).touched;
	}

	public displayFieldCss(field: string, form: FormGroup) {
		if (!form.get(field)) {
			throw new Error('Não tem o formControlName ' + field);
		}
		return {
			'has-error': this.isFieldValid(field, form),
			'has-valid': !this.isFieldValid(field, form) && form.get(field).touched
		};
	}

	public createForm(model: any) {
		return this.formBuilder.group(model.toFormGroup());
	}

	public createFormGroup(form: any) {
		return this.formBuilder.group(form);
	}

	public isAllFieldsValid(formGroup) {
		for (let field of Object.keys(formGroup.controls)) {
			const control = formGroup.get(field);
			if (control.valid === false && control.enabled) {
				return false;
			}
		}
		return true;
	}

	public allFormIsValid(formArray) {
		for (let form of formArray) {
			if (form.valid === false) {
				return false;
			}
		}
		return true;
	}

	public countFormErros(formGroup) {
		return Object.keys(formGroup.controls).filter(field => !formGroup.get(field).valid && formGroup.get(field).enabled).length;
	}

	public formPatchValue(field, form, value) {
		form.get(field).patchValue(value);
	}

	public invalidFieldsCounter(form, fields: any[] = []) {
		return fields.filter(field => !form.get(field).valid && form.get(field).enabled).length;
	}

	public convertDatePickerToDate(control: AbstractControl) {
		if (control.value && control.value.day && control.value.month && control.value.year) {
			console.log(control.value);
			control.patchValue('wfijweofjo');
			console.log(control);
		}
	}

	getInvalidFields(form: FormGroup) {
		let erros = [];
		Object.keys(form.controls).forEach(field => {
			const control = form.get(field);
			if (control.invalid) {
				erros.push(control);
			}
		});
		return erros;
	}
}
