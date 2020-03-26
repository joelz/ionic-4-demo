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

    rangeYear = 25;
    textValue = '6';

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
        firstName: ['first name', Validators.required],
        interestRates: this.fb.array([
            this.fb.group({
                periodFrom: this.fb.control(1),
                periodTo: this.fb.control(this.rangeYear * 12),
                periodToStr: this.fb.control('' + this.rangeYear * 12),
                rate: this.fb.control(2.375),
                rateStr: this.fb.control('2.375'),
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

    changeValuesInRatesForm(index, name, typeOrValue) {
        const maxRate = 12;
        const minRate = 0;
        const rateStep = 0.125;
        const periodStep = 1;
        if (name === 'periodTo') {
            let currentValue = this.interestRates.at(index).get('periodTo').value;
            if (typeOrValue === '+') {
                currentValue += periodStep;
            } else if (typeOrValue === '-') {
                currentValue -= periodStep;
            } else {
                currentValue = typeOrValue;
            }
            if (index === this.interestRates.length - 1) {// last
                currentValue = this.rangeYear * 12;
                this.interestRates.at(index).get('periodTo').setValue(currentValue);
                this.interestRates.at(index).get('periodToStr').setValue('' + currentValue);
            } else {
                const min = this.interestRates.at(index).get('periodFrom').value;
                const max = this.interestRates.at(index + 1).get('periodTo').value;
                if (currentValue < min) {
                    currentValue = min;
                }
                if (currentValue >= max) {
                    currentValue = max - 1;
                }
                this.interestRates.at(index).get('periodTo').setValue(currentValue);
                this.interestRates.at(index).get('periodToStr').setValue('' + currentValue);
                this.interestRates.at(index + 1).get('periodFrom').setValue(currentValue + 1);
            }
        } else if (name === 'rate') {
            let currentValue = this.interestRates.at(index).get('rate').value;
            if (typeOrValue === '+') {
                currentValue += rateStep;
            } else if (typeOrValue === '-') {
                currentValue -= rateStep;
            } else {
                currentValue = typeOrValue;
            }
            if (currentValue < minRate) {
                currentValue = minRate;
            }
            if (currentValue > maxRate) {
                currentValue = maxRate;
            }
            this.interestRates.at(index).get('rate').setValue(currentValue);
            this.interestRates.at(index).get('rateStr').setValue(currentValue.toFixed(3));
        }
    }

    periodToStrChange(ev, index) {
        console.log('periodToStrChange', this.interestRates.at(index).value);
        const currentValue = parseInt(this.interestRates.at(index).get('periodToStr').value, 10);
        if (isNaN(currentValue)) {
            this.interestRates.at(index).get('periodToStr').setValue(this.interestRates.at(index).get('periodTo').value);
            return;
        }
        this.changeValuesInRatesForm(index, 'periodTo', currentValue); // update periodTo
    }

    rateStrKeyup(ev, index) {
        console.log('rateStrKeyup', this.interestRates.at(index).value);
        const currentValue = parseFloat(this.interestRates.at(index).get('rateStr').value);
        this.interestRates.at(index).get('rate').setValue(currentValue); // update rate
    }

    rateStrChange(ev, index) {
        console.log('rateStrChange', this.interestRates.at(index).value);
        const currentValue = parseFloat(this.interestRates.at(index).get('rateStr').value);
        this.interestRates.at(index).get('rateStr').setValue(currentValue.toFixed(3)); // format rateStr
    }

    addRate() {
        const maxRatesCount = 10;
        const slice = Math.floor(this.rangeYear * 12 / maxRatesCount);
        let index = this.interestRates.length - 1;
        for (; index >= 0; index--) {
            this.interestRates.at(index).get('payCapital').enable();
            const delta = this.interestRates.at(index).get('periodTo').value - this.interestRates.at(index).get('periodFrom').value;
            console.log(index, delta, slice);
            if (delta >= slice) {
                const prevRate = this.interestRates.at(index).value;
                console.log(prevRate);
                this.interestRates.at(index).get('periodTo').setValue(prevRate.periodFrom + slice - 1);
                this.interestRates.at(index).get('periodToStr').setValue(prevRate.periodFrom + slice - 1);
                this.interestRates.insert(index + 1, this.fb.group({
                    periodFrom: this.fb.control(prevRate.periodFrom + slice),
                    periodTo: this.fb.control(prevRate.periodTo),
                    periodToStr: this.fb.control(prevRate.periodTo),
                    rate: this.fb.control(prevRate.rate),
                    rateStr: this.fb.control(prevRate.rateStr),
                    payCapital: this.fb.control(!!prevRate.payCapital)
                }));
                break;
            }
        }

        this.interestRates.at(this.interestRates.length - 1).get('payCapital').disable();
    }

    deleteRate(index: number) {
        if (index === this.interestRates.controls.length - 1) {// last
            this.interestRates.at(index - 1).get('periodTo').setValue(this.rangeYear * 12);
            this.interestRates.at(index - 1).get('periodToStr').setValue(this.rangeYear * 12);
            this.interestRates.at(index - 1).get('payCapital').setValue(true);
            this.interestRates.at(index - 1).get('payCapital').disable();
        } else if (index === 0) {// first
            this.interestRates.at(1).get('periodFrom').setValue(1);
        } else {
            this.interestRates.at(index + 1).get('periodFrom').setValue(this.interestRates.at(index).get('periodFrom').value);
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

    valueChanged($event, type) {
        if (type === 10) {
            console.log(new Date());
            this.rangeYear = parseFloat(this.textValue);
        } else if (type === 20) {
            console.log('range value changed:', $event);
            this.textValue = this.rangeYear.toFixed(3);
        }

        this.updateLastPeriod(this.rangeYear * 12);
    }

    updateLastPeriod(lastPeriod) {
        let index = this.interestRates.length - 1;
        for (; index >= 0; index--) {
            if (this.interestRates.at(index).get('periodFrom').value <= lastPeriod) {
                this.interestRates.at(index).get('periodTo').setValue(lastPeriod);
                this.interestRates.at(index).get('periodToStr').setValue(lastPeriod);
                break;
            } else {
                this.interestRates.removeAt(index);
            }
        }
    }
}
