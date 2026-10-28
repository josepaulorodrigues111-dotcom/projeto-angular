
import { Component, OnInit, inject, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
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

  id: number | null = null;

  carregando = signal(false);
  guardando = signal(false);
  erro = signal('');

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
    const param = this.route.snapshot.paramMap.get('id');
    this.id = param ? Number(param) : null;

    if (this.id !== null) {
      this.carregando.set(true);
      this.erro.set('');

      this.produtoService.obterPorId(this.id).subscribe({
        next: (produto) => {
          this.form.patchValue(produto);
          this.carregando.set(false);
        },
        error: (err) => {
          this.erro.set(this.produtoService.mensagemErro(err));
          this.carregando.set(false);
        },
      });
    }
  }

  submeter(): void {
    if (this.form.invalid || this.guardando()) {
      this.form.markAllAsTouched();
      return;
    }

    this.guardando.set(true);
    this.erro.set('');

    const dados = this.form.getRawValue();
    const id = this.id;

    const pedido =
      id !== null
        ? this.produtoService.editar(id, dados)
        : this.produtoService.criar(dados);

    pedido.subscribe({
      next: () => {
        this.router.navigate(['/admin']);
      },
      error: (err) => {
        this.erro.set(this.produtoService.mensagemErro(err));
        this.guardando.set(false);
      },
    });
  }
}
