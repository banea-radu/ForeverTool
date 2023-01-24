import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProspectiComponent } from './prospecti.component';

describe('ProspectiComponent', () => {
  let component: ProspectiComponent;
  let fixture: ComponentFixture<ProspectiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProspectiComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProspectiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
