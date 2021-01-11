import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { Product } from 'src/app/models/product.model';
import { ProductDataService } from 'src/app/services/products/shared/product-data.service';
import { ProductService } from 'src/app/services/products/shared/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  products: any[];
  page = 1;
  count = 0;
  tableSize = 7;
  tableSizes = [3, 6, 9, 12];
  constructor(
    public router: Router,
    private productService: ProductService,
    public route: ActivatedRoute,
    private productDataService: ProductDataService) { }

  ngOnInit() {
    this.fetchPosts();
  }

  delete(product: Product, key) {
    product.deleted_date = new Date();
    product.actived = false;
    this.productService.update(product, key);
  }

  edit(product: Product, key: string) {
    let navigationExtras: NavigationExtras = {
      state: {
        lista: this.products,
        isAdd: false
      }
    };
    this.productDataService.changeProduct(product, key);
    this.router.navigate(['/product/add'], navigationExtras);
  }

  add() {
    let navigationExtras: NavigationExtras = {
      state: {
        lista: this.products,
        isAdd: true
      }
    };
    this.router.navigate(['/product/add'], navigationExtras);
  }

  onTableDataChange(event) {
    this.page = event;
    this.fetchPosts();
  }

  onTableSizeChange(event): void {
    this.tableSize = event.target.value;
    this.page = 1;
    this.fetchPosts();
  }

  fetchPosts() {
    this.productService.getAll().subscribe((data: any) => {
      console.log(data);
      this.products = data;
    });
  }

}
