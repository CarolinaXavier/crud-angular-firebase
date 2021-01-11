import { Injectable } from '@angular/core';
import { Product } from 'src/app/models/product.model';
import { AngularFireDatabase } from '@angular/fire/database';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private PATH = 'products/';
  private model = new Product();
  constructor(private db: AngularFireDatabase) { }

  getAll() {
    return this.db.list(this.PATH, ref => ref.orderByChild('actived').equalTo(true)
    )
      .snapshotChanges()
      .pipe(
        map(changes => {
          return changes.map((c: any) => ({ key: c.payload.key, ...c.payload.val() }));
        })
      );
  }

  get(key: string) {
    return this.db.object(this.PATH + key).snapshotChanges()
      .pipe(
        map((c: any) => {
          return { key: c.key, ...c.payload.val() };
        })
      );
  }

  getEqual(name) {
    var ref = this.db.database.ref(this.PATH);
    ref.orderByChild("name")
      .equalTo(name)
      .on("value", function (snapshot) {
        console.log(snapshot.val());
        var exists = (snapshot.val() !== null);
        let item = snapshot.key.valueOf();
        console.log(item);
        if (exists) {
          console.log('user ' + name + ' exists!');
        } else {
          console.log('user ' + name + ' does not exist!');
        }
      });
  }



  insert(product: Product) {
    console.log('insert', this.toAPI(product))
    return this.db.list(this.PATH).push(this.toAPI(product))
      .then((result: any) => {
        console.log(result.key);
        return result.key;
      });
  }

  update(product: Product, key: string) {
    this.db.list(this.PATH).update(key, this.toAPI(product))
      .catch((error: any) => {
        console.error(error);
      });
  }

  delete(key: string) {
    this.db.object(this.PATH + `${key}`).remove();
  }


  toAPI(model) {
    let json: any = new Object();
    Object.assign(json, model);
    return json;
  }

  fromAPI(json: any) {
    let obj: any;
    Object.assign(obj, json);
    return obj;
  }


}
