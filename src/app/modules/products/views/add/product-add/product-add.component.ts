import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Product } from 'src/app/models/product.model';
import { ProductDataService } from 'src/app/services/products/shared/product-data.service';
import { ProductService } from 'src/app/services/products/shared/product.service';
import { FormCustomValidator } from '../../../../../services/formCustomValidator.service';
import { Router } from '@angular/router';
import { UploadService } from 'src/app/services/upload/upload.service';
import { AngularFireStorage } from "@angular/fire/storage";
import { finalize } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-product-add',
  templateUrl: './product-add.component.html',
  styleUrls: ['./product-add.component.css']
})
export class ProductAddComponent implements OnInit {
  @ViewChild('alert') private alert: any;
  public model: Product = new Product();
  title: string;
  public form: FormGroup;
  product: Product;
  key: string = '';
  selectedFile: File = null;
  products: any[];
  isAdd: boolean;
  constructor(
    private productService: ProductService,
    private productDataService: ProductDataService,
    public router: Router,
    public uploadService: UploadService,
    private toast: ToastrService,
    private storage: AngularFireStorage,
    public formCustom: FormCustomValidator) {
    this.model = new Product();
    if (this.router.getCurrentNavigation().extras.state && this.router.getCurrentNavigation().extras.state.lista) {
      this.products = this.router.getCurrentNavigation().extras.state.lista;
      this.isAdd = this.router.getCurrentNavigation().extras.state.isAdd;
    } else {
      this.router.navigateByUrl("/");
      return;
    }
  }

  ngOnInit(): void {
    if (this.isAdd) {
      this.model = new Product();
      this.form = this.formCustom.createForm(this.model);
      this.title = 'Adicionar'
    }
    else {
      this.productDataService.currentProduct.subscribe(data => {
        if (data.product && data.key) {
          this.model.fromAPI(data.product);
          this.key = data.key;
          this.title = 'Editar: ' + this.model.name;
          this.form = this.formCustom.createForm(this.model);
        } else {
          this.model = new Product();
          this.form = this.formCustom.createForm(this.model);
        }
      })
    }

  }

  onSave() {
    if (this.key) {
      if (this.form.valid) {
        if (this.listCheckedEqual()) {
          if (this.model.images.length > 0) {
            this.onSetDefaultImage();
            let validated_date = new Date();
            validated_date.setDate(validated_date.getDate() + 60);
            console.log(validated_date);
            this.form.patchValue({ created_date: new Date() });
            this.form.patchValue({ expiration_date: new Date() });
            this.form.get('expiration_date').patchValue(validated_date);
            this.form.patchValue({ updated_date: new Date() });
            this.model.fromFormGroup(this.form);
            this.productService.update(this.model, this.key);
            this.router.navigate(['/']);
          } else {
            this.toast.error('Selecione pelo menos uma imagem!');
          }
        } else {
          this.toast.error('Este nome já existe!');
        }
      } else {
        this.formCustom.validateAllFormFields(this.form);
        this.toast.error('Por favor, Corrija os campos destacados em vermelho!');
      }
    } else {
      if (this.form.valid) {
        if (this.listCheckedEqual()) {
          this.onSetDefaultImage();
          this.productService.insert(this.model).then(result => {
            this.key = result;
            if (this.key) {
              let validated_date = new Date();
              validated_date.setDate(validated_date.getDate() + 60);
              this.form.patchValue({ created_date: new Date() });
              this.form.patchValue({ expiration_date: validated_date });
              this.model.fromFormGroup(this.form);
              this.productService.update(this.model, this.key);
            }
          });
          this.router.navigate(['/']);
        } else {
          this.toast.error('Este nome já existe!');
        }
      } else {
        this.formCustom.validateAllFormFields(this.form);
        this.toast.error('Por favor, Corrija os campos destacados em vermelho!');
      }
    }
  }

  async onFileSelected(event) {
    const file = event.target.files[0];
    if (this.model.images.length <= 5) {
      if (file) {
        var n = Date.now();
        const filePath = `products/${n}`;
        const fileRef = this.storage.ref(filePath);
        const task = this.storage.upload(filePath, file);
        task
          .snapshotChanges()
          .pipe(
            finalize(() => {
              fileRef.getDownloadURL().subscribe(url => {
                this.model.images.push({
                  name: Date.now(),
                  default: false,
                  url: url
                }
                );
              })
            })
          ).subscribe();
        console.log(this.model.images);
      }
    } else {
      this.toast.error('Limite de imagens atingidos!');
    }
  }

  onDefault(event) {
    const found = this.model.images.find(element => element.name === event);
    this.model.images.forEach(file => {
      file.default = false;
    })
    if (found !== undefined) {
      found.default = true;
      this.model.main_image = found.url;
    }
  }

  productionChange(event) {
    let sales_value = event;
    let production_cost = this.form.get('production_cost').value;
    // calcular valor lucro
    let profit = parseFloat(sales_value) - parseFloat(production_cost);
    this.form.patchValue({ profit_amount: profit });
    // calcular porcentagem lucro
    let percentage_profit = profit / sales_value * 100;
    percentage_profit.toFixed(2);
    this.form.patchValue({ percentage_profit: percentage_profit });
  }

  listCheckedEqual() {
    let name = this.form.get('name').value;
    const found = this.products.find(element => element.name === name);
    if (found === undefined) {
      return true;
    } else {
      if (this.key === found.key) {
        return true;
      } else {
        return false;
      }
    }
  }

  removeImage(index, url) {
    console.log(index);
    this.model.images.splice(index);
    this.uploadService.deleteFileStorage(url);
  }

  onBack() {
    if (!this.key) {
      this.model.images.forEach(async file => {
        await this.uploadService.deleteFileStorage(file.url);
      })
    }
    this.model = null;
    this.router.navigate(['/']);
  }
  onSetDefaultImage() {
    if (this.model.images.length === 1) {
      this.model.images.forEach(element => {
        element.default = true;
        this.model.main_image = element.url;
      });
    }
  }
}
