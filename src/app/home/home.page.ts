import { Component, OnInit} from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ActivatedRoute, NavigationExtras } from '@angular/router';
import { ToastController} from '@ionic/angular';
import {Storage} from '@capacitor/storage';
import { ApiService } from '../servicios/api.service';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  public rol:boolean = true;
  usuario: any = {
    usser: '',
    pass: '',
    token: '1000300130',
  };

  campoError:string ="";

  constructor(public alertCtrl: AlertController,private router: Router,public toastController: ToastController,private api: ApiService) {Storage.remove({key:'logeado'});}

  ngOnInit(){

  }

  obtenerUsuarios() {
    this.api.getUsuarios().subscribe((resultado) => {
      console.log(resultado);
    });
  }

  loginUsuarios() {
    if (this.validarModelo(this.usuario)) {
      var login = { correo: this.usuario.usser, password: this.usuario.pass, token_equipo: this.usuario.token};
      this.api.postLogin(login).subscribe((resultado) => {
        var result = JSON.stringify(resultado);
        var respuesta = JSON.parse(result);
        console.log(respuesta.result);
        console.log(respuesta.result[0]);
        if (respuesta.result === 'Login incorrecto') {
          this.mensajeToast('Usuario o contraseña incorrecto');
        } else {
          if (this.rol == false) {
        
            var infoJson = JSON.stringify(this.usuario);
            Storage.set({ key: 'usuario', value: infoJson });
            Storage.set({ key: 'logeado', value: 'ok' });
            Storage.set({ key: 'datos', value: JSON.stringify(respuesta.result[0]) });
            this.router.navigate(['/inicio-chofer']);
            
          }else {
            var infoJson = JSON.stringify(this.usuario);
            Storage.set({ key: 'usuario', value: infoJson });
            Storage.set({ key: 'logeado', value: 'ok' });
            Storage.set({ key: 'datos', value: JSON.stringify(respuesta.result[0]) });
            this.router.navigate(['/inicio']);
          }
        }
      });
    } else {
      this.mensajeToast("Debe ingresar todos los campos");
    }
 }

  registro() {
    this.router.navigate(['/registro']);
  }

  cambiopass() {
    this.router.navigate(['/recuperar']);
  }
  change() {
    console.log(this.rol);
  }
  validarModelo(model: any)
  {
    for(var [key, value] of Object.entries(model))
    {
      console.log(key+" value: "+value);
      if(value=="")
      {
        this.campoError = key;
        return false;
      }
    }
    return true;
  }

  async mensajeToast(message:string, duration?:number)
  {
    const toast = await this.toastController.create(
      {
        message :message,
        duration: duration?duration:3000
      }
    );

    toast.present();
  }

}