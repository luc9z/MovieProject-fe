import { Component } from '@angular/core';
import { UserService, Usuario } from '../../services/user';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login-register.html',
  styleUrls: ['./login-register.css']
})
export class LoginRegisterComponent {
  email = '';
  senha = '';

  nome = '';
  emailCadastro = '';
  senhaCadastro = '';

  modoCadastro = false;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.route.queryParams.subscribe(params => {
      this.modoCadastro = params['cadastro'] === 'true';
    });
  }

  fazerLogin() {
    if (!this.email || !this.senha) {
      Swal.fire('Atenção', 'Preencha email e senha.', 'warning');
      return;
    }
    this.userService.login(this.email, this.senha).subscribe({
      next: usuario => {
        this.authService.login(usuario.email, usuario); // usando email como "token"
        Swal.fire('Sucesso', 'Login realizado!', 'success').then(() => {
          this.router.navigate(['/']);
        });
      },
      error: err => {
        Swal.fire('Erro', 'Login falhou! Email ou senha incorretos.', 'error');
      }
    });
  }

  cadastrar() {
    if (!this.nome || /\d/.test(this.nome)) {
      Swal.fire('Erro', 'O nome não pode conter números.', 'error');
      return;
    }
    if (!this.emailCadastro || !this.emailCadastro.match(/^[^@\s]+@[^@\s]+\.[^@\s]+$/)) {
      Swal.fire('Erro', 'Email inválido.', 'error');
      return;
    }
    if (!this.senhaCadastro || this.senhaCadastro.length < 4) {
      Swal.fire('Erro', 'A senha deve ter pelo menos 4 caracteres.', 'error');
      return;
    }

    const novoUsuario: Usuario = {
      nome: this.nome,
      email: this.emailCadastro,
      senha: this.senhaCadastro
    };

    this.userService.register(novoUsuario).subscribe({
      next: usuario => {
        this.userService.login(this.emailCadastro, this.senhaCadastro).subscribe({
          next: user => {
            this.authService.login(user.email, user); // usando email como "token"
            Swal.fire('Sucesso', 'Cadastro realizado com sucesso!', 'success').then(() => {
              this.router.navigate(['/']);
            });
          },
          error: () => {
            Swal.fire('Erro', 'Erro ao realizar login após cadastro.', 'error');
          }
        });
      },
      error: err => {
        if (err.status === 409) {
          Swal.fire('Erro', 'Email já está sendo usado.', 'error');
        } else {
          Swal.fire('Erro', 'Erro ao cadastrar usuário.', 'error');
        }
      }
    });
  }

  alternarModo() {
    this.modoCadastro = !this.modoCadastro;
  }
}
