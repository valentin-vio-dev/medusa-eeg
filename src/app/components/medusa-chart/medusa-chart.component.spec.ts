import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MedusaChartComponent } from './medusa-chart.component';

describe('MedusaChartComponent', () => {
  let component: MedusaChartComponent;
  let fixture: ComponentFixture<MedusaChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MedusaChartComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MedusaChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
