import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return `
    <script>
      setTimeout(() => {
        document.body.style.margin = 0;
        document.body.style.overflow = 'hidden';
      }, 1000);
    </script>
    <iframe style="width: 100vw; height: 100vh;border: none;" src="https://docs.nestjs.com/" />
    `;
  }
}
