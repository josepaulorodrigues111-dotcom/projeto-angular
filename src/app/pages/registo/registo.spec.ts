
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Registo } from './registo';

describe('Registo', () => {
  let component: Registo;
  let fixture: ComponentFixture<Registo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Registo],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(Registo);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
