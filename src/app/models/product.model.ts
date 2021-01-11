import { FormGroup, Validators } from "@angular/forms";

export class Product {
    name: string;
    description: string;
    images: any[];
    production_cost: number;
    sales_value: number;
    profit_amount: number;
    percentage_profit: number;
    created_date: any = new Date();
    updated_date: any ;
    deleted_date: any ;
    expiration_date: any;
    actived: boolean = true;
    photo_default: number;
    main_image: string;
    constructor(

    ) {
        this.images = [];
    }
    fromFormGroup(form: FormGroup) {
        console.log(form);
        let value = form.value;
        this.name = value.name;
        this.description = value.description;
        this.production_cost = value.production_cost;
        this.sales_value = value.sales_value;
        this.profit_amount = value.profit_amount;
        this.percentage_profit = value.percentage_profit;
        this.created_date = value.created_date;
        this.updated_date = value.updated_date;
        this.deleted_date = value.deleted_date;
        this.actived = value.actived;
        this.expiration_date = value.expiration_date;
        this.photo_default = value.photo_default;
        this.images = value.images;
    }

    toFormGroup() {
        return {
            name: [this.name, Validators.required],
            description: [this.description, Validators.required],
            production_cost: [this.production_cost, Validators.required],
            sales_value: [this.sales_value, Validators.required],
            profit_amount: [this.profit_amount, Validators.required],
            percentage_profit: [this.percentage_profit],
            created_date: [this.created_date],
            updated_date: [this.updated_date],
            deleted_date: [this.deleted_date],
            actived: [this.actived],
            expiration_date: [this.expiration_date],
            photo_default: [this.photo_default],
            images: [this.images]
        };
    }
    public fromAPI(json: any) {
        Object.assign(this, json);
    }

    public toAPI() {
        let json: any = new Object();
        Object.assign(json, this);
        return json;
    }
}