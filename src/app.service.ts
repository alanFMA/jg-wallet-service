import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return '<h1>Hello World!</h1><p>Este é um HTML vindo do Service</p>';
  }
}
