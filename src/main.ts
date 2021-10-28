import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import {ValidationPipe} from "./pipes/validation.pipe";

async function bootstrap() {
  const port = process.env.DEFAULT_APP_PORT || 5000
  const hostname = process.env.DEFAULT_APP_HOSTNAME || 'localhost'

  const app = await NestFactory.create(AppModule)

  app.useGlobalPipes(new ValidationPipe())

  await app.listen(port, hostname, () => console.log(`Server running at ${hostname}:${port}`))
}
bootstrap();
