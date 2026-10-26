import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { beforeEach, describe, expect, it } from 'vitest';
import { App } from './app';

describe('App', () => {
  beforeEach(() => TestBed.resetTestingModule());

  it('compõe o cabeçalho, o espaço de navegação e o rodapé', () => {
    TestBed.configureTestingModule({ imports: [App], providers: [provideRouter([])] });
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const html = fixture.nativeElement as HTMLElement;

    expect(html.querySelector('app-cabecalho')).not.toBeNull();
    expect(html.querySelector('router-outlet')).not.toBeNull();
    expect(html.querySelector('app-rodape')).not.toBeNull();
  });
});
