import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrimaryFeePaymentComponent } from './primary-fee-payment.component';

describe('PrimaryFeePaymentComponent', () => {
  let component: PrimaryFeePaymentComponent;
  let fixture: ComponentFixture<PrimaryFeePaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrimaryFeePaymentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrimaryFeePaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
