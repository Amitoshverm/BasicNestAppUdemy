import { UseInterceptors, NestInterceptor, ExecutionContext, CallHandler } from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { plainToClass } from "class-transformer";
import { UserDto } from "src/users/dtos/user.dto";



export interface ClassConstructor {
    new (...args: any[]) : {};
}

export function Serialize (dto: any) {
    return UseInterceptors(new SerializeInterceptor(dto))
}


export class SerializeInterceptor implements NestInterceptor{

    constructor(private dto: any){}

    intercept(context: ExecutionContext, handler: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
       
        
        return handler.handle().pipe(
            map((data: any) => {
            const newResponse = {
          statusCode: context.switchToHttp().getResponse().statusCode,
          // * with this i wont be exposing any sensitive details like password
          data: plainToClass(this.dto, data, {excludeExtraneousValues: true}),
          status: data ? data.status : null,
          message: data ? data.message : null,
        };
        return newResponse;

            }
            )
        )
    }

}
