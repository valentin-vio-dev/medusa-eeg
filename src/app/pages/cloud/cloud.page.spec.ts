import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CloudPage } from './cloud.page';

describe('CloudPage', () => {
  let component: CloudPage;
  let fixture: ComponentFixture<CloudPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CloudPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CloudPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
