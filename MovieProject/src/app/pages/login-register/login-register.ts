import { Component } from '@angular/core';
import { UserService, Usuario } from '../../services/user';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth';

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
      if (params['cadastro'] === 'true') {
        this.modoCadastro = true;
      } else {
        this.modoCadastro = false;
      }
    });
  }

  fazerLogin() {
    this.userService.login(this.email, this.senha).subscribe({
      next: usuario => {
        this.authService.login(usuario.email);
        this.router.navigate(['/']);
      },
      error: () => alert('Login falhou! Email ou senha incorretos.')
    });
  }

  cadastrar() {
    const novoUsuario: Usuario = {
      nome: this.nome,
      email: this.emailCadastro,
      senha: this.senhaCadastro
    };

    this.userService.register(novoUsuario).subscribe({
      next: usuario => {
        alert('Cadastro realizado com sucesso!');
        this.modoCadastro = false;
        this.email = this.emailCadastro;
        this.senha = this.senhaCadastro;
        this.fazerLogin();
      },
      error: () => alert('Erro ao cadastrar usuário.')
    });
  }

  alternarModo() {
    this.modoCadastro = !this.modoCadastro;
  }
}
