import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginStausComponent } from './login-staus.component';

describe('LoginStausComponent', () => {
  let component: LoginStausComponent;
  let fixture: ComponentFixture<LoginStausComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginStausComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginStausComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
