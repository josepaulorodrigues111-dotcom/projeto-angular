import { Component, OnInit, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProdutoService } from '../../services/produto.service';

@Component({
  imports: [ReactiveFormsModule, RouterLink],
  selector: 'app-produto-form',
  styleUrl: './produto-form.css',
  templateUrl: './produto-form.html',
})
export class ProdutoForm implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly produtoService = inject(ProdutoService);

  id: string | null = null;
  carregando = signal(false);
  erro = signal(false);

  form = new FormGroup({
    title: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(3)],
    }),
    description: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(10)],
    }),
    price: new FormControl(0, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(0.01)],
    }),
    category: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    stock: new FormControl(0, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(0)],
    }),
    thumbnail: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  get modoEdicao(): boolean {
    return this.id !== null;
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');

    if (this.id) {
      this.carregando.set(true);
      this.produtoService.obterPorId(this.id).subscribe({
        next: (p) => {
          this.form.patchValue(p);
          this.carregando.set(false);
        },
        error: () => {
          this.erro.set(true);
          this.carregando.set(false);
        },
      });
    }
  }

  submeter(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const dados = this.form.getRawValue();

    const pedido = this.id
      ? this.produtoService.editar(this.id, dados)
      : this.produtoService.criar(dados);

    pedido.subscribe({
      next: () => this.router.navigate(['/produtos']),
      error: () => this.erro.set(true),
    });
  }
}