import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { AngularFireModule } from 'angularfire2';
import { AngularFireAuth } from 'angularfire2/auth';

import { config } from '../../../testing/mock-config';

import { AccountService } from '../shared/account.service';
import { LoggerService } from '../../core/logger.service';
import { MockLoggerService } from '../../../testing/mock-logger.service';

import { AccountDeleteComponent } from './account-delete.component';

describe('AccountDeleteComponent', () => {
  let component: AccountDeleteComponent;
  let fixture: ComponentFixture<AccountDeleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountDeleteComponent ],
      imports: [
        AngularFireModule.initializeApp(config),
        RouterTestingModule,
      ],
      providers: [
        AngularFireAuth,
        AccountService,
        { provide: LoggerService, useClass: MockLoggerService },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});