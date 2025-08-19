import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RolComponent } from './rol';

describe('RolComponent', () => {
  let component: RolComponent;
  let fixture: ComponentFixture<RolComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RolComponent],
    })
    .compileComponents();

    fixture = TestBed.createComponent(RolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
