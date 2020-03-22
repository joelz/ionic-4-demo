import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Validators } from '@angular/forms';
import { FormArray } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';

@Component({
    selector: 'app-list',
    templateUrl: 'list.page.html',
    styleUrls: ['list.page.scss']
})
export class ListPage implements OnInit {
    private selectedItem: any;
    private icons = [
        'flask',
        'wifi',
        'beer',
        'football',
        'basketball',
        'paper-plane',
        'american-football',
        'boat',
        'bluetooth',
        'build'
    ];
    public items: Array<{ title: string; note: string; icon: string }> = [];
    constructor(private fb: FormBuilder) {
        for (let i = 1; i < 4; i++) {
            this.items.push({
                title: 'Item ' + i,
                note: 'This is item #' + i,
                icon: this.icons[Math.floor(Math.random() * this.icons.length)]
            });
        }

        this.interestRates.valueChanges.pipe(debounceTime(500)).subscribe(x => {
            console.log('interest rates value changed');
            console.log(x);
        });
    }

    calculatorForm = this.fb.group({
        firstName: ['', Validators.required],
        interestRates: this.fb.array([
            this.fb.group({
                periodFrom: this.fb.control(1),
                periodTo: this.fb.control(36),
                rate: this.fb.control(2.375),
                payCapital: this.fb.control({
                    value: true,
                    disabled: true
                })
            })
        ])
    });

    get interestRates() {
        return this.calculatorForm.get('interestRates') as FormArray;
    }

    updateProfile() {
        this.calculatorForm.patchValue({
            firstName: 'Nancy',
            address: {
                street: '123 Drew Street'
            }
        });
    }

    changeValuesInRatesForm(index, name, type) {
        if (name === 'periodTo') {
            let currentValue = this.interestRates.at(index).get('periodTo').value;
            if (type === '+') {
                currentValue += 1;
            } else {
                currentValue -= 1;
            }
            this.interestRates.at(index).get('periodTo').setValue(currentValue);
        } else if (name === 'rate') {
            let currentValue = this.interestRates.at(index).get('rate').value;
            if (type === '+') {
                currentValue += 0.125;
            } else {
                currentValue -= 0.125;
            }
            this.interestRates.at(index).get('rate').setValue(currentValue);
        }
    }

    addRate() {
        // TODO- maximus rates? 10?
        // totalMonth/10 per period
        this.interestRates.at(this.interestRates.controls.length - 1).get('payCapital').enable();
        this.interestRates.push(this.fb.group({
            periodFrom: this.fb.control(37),
            periodTo: this.fb.control(36),
            rate: this.fb.control(2.375),
            payCapital: this.fb.control({ value: true, disabled: true })
        }));
    }

    deleteRate(index: number) {
        // TODO- payCapital of last rate must be true
        if (index === this.interestRates.controls.length - 1) {
            this.interestRates.at(index - 1).get('payCapital').setValue(true);
            this.interestRates.at(index - 1).get('payCapital').disable();
        }

        this.interestRates.removeAt(index);
    }

    onSubmit() {
        console.warn(this.calculatorForm.value);
    }

    ngOnInit() {
    }
    // add back when alpha.4 is out
    // navigate(item) {
    //   this.router.navigate(['/list', JSON.stringify(item)]);
    // }

    rangeValue = 6;
    textValue = '6';

    valueChanged($event, type) {
        if (type === 10) {
            console.log(new Date());
            this.rangeValue = parseFloat(this.textValue);
        } else if (type === 20) {
            console.log('range value changed:', $event);
            this.textValue = this.rangeValue.toFixed(3);
        }
    }
}
