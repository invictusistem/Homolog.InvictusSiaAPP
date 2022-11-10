import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BaseService } from "src/app/_shared/services/base.service";

@Injectable()
export class ComercialService extends BaseService {

    constructor(private http: HttpClient) { super(); }

}