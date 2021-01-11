import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product } from '../../../models/product.model';
@Injectable({
  providedIn: 'root'
})
export class ProductDataService {

  private productSource = new BehaviorSubject({ product: null, key: '' });
  currentProduct = this.productSource.asObservable();

  constructor() { }

  changeProduct(product: Product, key: string) {
    this.productSource.next({ product: product, key: key });
  }
}
