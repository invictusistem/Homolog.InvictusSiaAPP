import { FocusMonitor } from '@angular/cdk/a11y';
import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import {
    Component,
    ElementRef,
    Inject,
    Input,
    OnDestroy,
    Optional,
    Self,
    ViewChild
} from '@angular/core';
import {
    AbstractControl,
    ControlValueAccessor,
    FormBuilder,
    FormControl,
    FormGroup,
    NgControl,
    Validators
} from '@angular/forms';
import { MAT_FORM_FIELD, MatFormField, MatFormFieldControl } from '@angular/material/form-field';
import { Subject } from 'rxjs';
import { MyTime } from './myTime.model';




/* 

@Component({
  selector: 'form-field-custom-control-example',
  templateUrl: 'form-field-custom-control-example.html',
})
export class FormFieldCustomControlExample {
  form: FormGroup = new FormGroup({
    tel: new FormControl(new MyTel('', '', ''))
  });
}
*/

/** Custom `MatFormFieldControl` for telephone number input. */
@Component({
    selector: 'mytime-input',
    templateUrl: 'time-input.html',
    styleUrls: ['time-input.scss'],
    providers: [{ provide: MatFormFieldControl, useExisting: MyTimeInput }],
    host: {
        '[class.example-floating]': 'shouldLabelFloat',
        '[id]': 'id',
    }
})


export class MyTimeInput
    implements ControlValueAccessor, MatFormFieldControl<MyTime>, OnDestroy {
    static nextId = 0;
    @ViewChild('hora') horaInput!: HTMLInputElement;
    @ViewChild('minuto') minutoInput!: HTMLInputElement;
    //@ViewChild('ano') anoInput: HTMLInputElement;

    parts!: FormGroup;
    stateChanges = new Subject<void>();
    focused = false;
    controlType = 'example-time-input';
    id = `example-time-input-${MyTimeInput.nextId++}`;
    onChange = (_: any) => { };
    onTouched = () => { };

    get empty() {
        const {
            value: { hora, minuto }
        } = this.parts;

        return !hora && !minuto;
    }

    get shouldLabelFloat() {
        return this.focused || !this.empty;
    }

    @Input('aria-describedby') userAriaDescribedBy!: string;

    @Input()
    get placeholder(): string {
        return this._placeholder;
    }
    set placeholder(value: string) {
        this._placeholder = value;
        this.stateChanges.next();
    }
    private _placeholder!: string;

    @Input()
    get required(): boolean {
        return this._required;
    }
    set required(value: boolean) {
        this._required = coerceBooleanProperty(value);
        this.stateChanges.next();
    }
    private _required = false;

    @Input()
    get disabled(): boolean {
        return this._disabled;
    }
    set disabled(value: boolean) {
        this._disabled = coerceBooleanProperty(value);
        this._disabled ? this.parts.disable() : this.parts.enable();
        this.stateChanges.next();
    }
    private _disabled = false;

    @Input()
    get value(): any | null {
        if (this.parts.valid) {
            let {
                value: { hora, minuto }
            } = this.parts;
            
            
            let time = new MyTime(hora, minuto)
            if(parseInt(time.hora) > 23){
                let hour = 23
                time.hora = hour.toString()
                this.parts.get('hora')?.setValue(time.hora)
            }

            if(parseInt(time.minuto) > 59){
                let minuto = 59
                time.minuto = minuto.toString()
                this.parts.get('minuto')?.setValue(time.minuto)
            }

            //console.log(parseInt(time.hora))

            //this.parts = time

            return `${time.hora}:${time.minuto}`;// time;//new MyDate(dia, mes, ano);
        }
        return null;
    }

    sliceItem: string[] = new Array<string>()
    set value(time: any | null) {
        //const {hora,minuto};
        let hora;
        let minuto;

        try {

            const { hora, minuto } = time || new MyTime('', '');
            this.parts.setValue({ hora, minuto });
        } catch {

            this.sliceItem = time.split(':')
           // console.log(this.sliceItem[0])
            hora = this.sliceItem[0]
            minuto = this.sliceItem[1]
            // if(parseInt(time.hora) > 23){
            //     let hour = 23
            //     time.hora = hour.toString()
            // }
            console.log(time)
            this.parts.setValue({ hora, minuto });
        }

        this.stateChanges.next();
    }

    get errorState(): boolean {
        return this.parts.invalid && this.parts.dirty;
    }

    constructor(
        formBuilder: FormBuilder,
        private _focusMonitor: FocusMonitor,
        private _elementRef: ElementRef<HTMLElement>,
        @Optional() @Inject(MAT_FORM_FIELD) public _formField: MatFormField,
        @Optional() @Self() public ngControl: NgControl) {

        this.parts = formBuilder.group({
            hora: [
                null,
                [Validators.required, Validators.minLength(2), Validators.maxLength(2)]
            ],
            minuto: [
                null,
                [Validators.required, Validators.minLength(2), Validators.maxLength(2)]
            ]
            // ano: [
            //     null,
            //     [Validators.required, Validators.minLength(4), Validators.maxLength(4)]
            // ]
        });

        _focusMonitor.monitor(_elementRef, true).subscribe(origin => {
            if (this.focused && !origin) {
                this.onTouched();
            }
            this.focused = !!origin;
            this.stateChanges.next();
        });

        if (this.ngControl != null) {
            this.ngControl.valueAccessor = this;
        }
    }

    autoFocusNext(control: AbstractControl, nextElement?: HTMLInputElement): void {
        if (!control.errors && nextElement) {
            this._focusMonitor.focusVia(nextElement, 'program');
        }
    }

    autoFocusPrev(control: AbstractControl, prevElement: HTMLInputElement): void {
        if (control.value.length < 1) {
            this._focusMonitor.focusVia(prevElement, 'program');
        }
    }

    ngOnDestroy() {
        this.stateChanges.complete();
        this._focusMonitor.stopMonitoring(this._elementRef);
    }

    setDescribedByIds(ids: string[]) {
        const controlElement = this._elementRef.nativeElement
            .querySelector('.example-time-input-container')!;
        controlElement.setAttribute('aria-describedby', ids.join(' '));
    }

    onContainerClick() {
        if (this.parts.get('minuto')?.valid) {
            this._focusMonitor.focusVia(this.minutoInput, 'program');
        } else if (this.parts.get('hora')?.valid) {
            this._focusMonitor.focusVia(this.minutoInput, 'program');
        } else {
            this._focusMonitor.focusVia(this.horaInput, 'program');
        }
    }

    writeValue(date: MyTime | null): void {
        this.value = date;
    }

    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }

    _handleInput(control: AbstractControl, nextElement?: HTMLInputElement): void {
        this.autoFocusNext(control, nextElement);
        this.onChange(this.value);
    }

    static ngAcceptInputType_disabled: BooleanInput;
    static ngAcceptInputType_required: BooleanInput;
}


/**  Copyright 2021 Google LLC. All Rights Reserved.
    Use of this source code is governed by an MIT-style license that
    can be found in the LICENSE file at http://angular.io/license */