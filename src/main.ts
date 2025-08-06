import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { NextFunction, Request, Response } from 'express';
import { join } from 'path';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {

  if (process.env.NODE_ENV !== 'production') {
    //  Cargar variables de entorno de .env para desarrollo

    // -- PARA DESARROLLO
    dotenv.config({ path: '.env' }); // Cargar variables de entorno de .env para desarrollo
  } else {
    // -- PARA PRODUCCION
    dotenv.config({ path: '.env.production' }); // Cargar variables de entorno de .env.prod para producción
  }

  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('Tienda Online API')
    .setDescription('The Tienda Online API description')
    .setVersion('1.0')
    .addTag('tienda-online')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);


  /* 
   * Habilita CORS (Cross-Origin Resource Sharing) para permitir solicitudes desde orígenes específicos, evitando así problemas de seguridad al realizar peticiones desde clientes web en diferentes dominios.
 
   */
  app.enableCors({
    origin: [
      ...(process.env.NODE_ENV !== 'production' ? ['http://localhost:3000', 'http://localhost:4200',] : []),
    ],
  });

  /*  */
  app.setGlobalPrefix(process.env.API_PREFIX ?? 'api/v1');


  /* 
  *
  * Configuración global de pipes de validación para todas las rutas de la aplicación
  * Se habilita la whitelist para solo permitir propiedades definidas en el DTO
  y se prohíben propiedades no permitidas en la whitelist
  * También se habilita la transformación de datos para que se ajusten al tipo de dato esperado
  */
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );


  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
