import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Rodape } from './rodape';

describe('Rodape', () => {
  let component: Rodape;
  let fixture: ComponentFixture<Rodape>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Rodape],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(Rodape);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
