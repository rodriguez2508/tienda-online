// src/config/typeorm.config.ts
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import { join } from 'path'; // Necesitas join para las rutas de entidades y migraciones

export const getTypeOrmConfig = async (configService: ConfigService): Promise<TypeOrmModuleOptions> => {
  const logger = new Logger('TypeOrmConfig'); // Logger específico para esta configuración

  const uri =
    configService.get<string>('DB_URL') ||
    'postgresql://DB_USERNAME:DB_PASSWORD@localhost:5432/postresql_bd'; // Considera si esta URL por defecto es necesaria o si siempre usarás variables de entorno

  // Si usas DB_URL, TypeORM la parseará. Si no, usará host, port, etc.
  // Es mejor ser consistente y usar solo DB_URL o solo las propiedades separadas.
  // Si DB_URL está presente, las otras propiedades (host, port, etc.) pueden ser ignoradas por TypeORM.
  // Vamos a priorizar DB_URL si existe, de lo contrario, usar las propiedades separadas.

  const typeOrmOptions: TypeOrmModuleOptions = {
    type: 'postgres', // Asegúrate de que este sea el tipo correcto de tu base de datos
    // Si DB_URL está definida, úsala. De lo contrario, usa las propiedades separadas.
    ...(configService.get<string>('DB_URL') ? { url: uri } : {
      host: configService.get<string>('DB_HOST') || 'localhost',
      port: parseInt(configService.get<string>('DB_PORT') || '5432', 10),
      username: configService.get<string>('DB_USERNAME') || 'postgres',
      password: configService.get<string>('DB_PASSWORD') || '',
      database: configService.get<string>('DB_NAME') || 'postgres',
    }),
    autoLoadEntities: true, // Carga automáticamente las entidades
    synchronize: configService.get<string>('NODE_ENV') !== 'production', // solo true en desarrollo
    ssl:
      configService.get<string>('DB_SSL') === 'true'
        ? { rejectUnauthorized: false } // Configuración SSL para producción
        : false, // Sin SSL en desarrollo
    logging: configService.get<string>('NODE_ENV') === 'development', // Logging solo en desarrollo
    retryAttempts: 25, // Número de reintentos de conexión inicial
    retryDelay: 6000, // Retraso entre reintentos en ms
    // Asegúrate de que la ruta a las entidades sea correcta desde la raíz del proyecto o dist
    entities: [join(__dirname, '..', '**', '*.entity.{ts,js}')],
    // Asegúrate de que la ruta a las migraciones sea correcta
    migrations: [join(__dirname, '..', 'database', 'migrations', '*{.ts,.js}')],
    migrationsRun: false, // Controla si las migraciones se ejecutan automáticamente al iniciar
  };

  // Log de la configuración final (sin mostrar credenciales sensibles)
  logger.log(`TypeORM configured for database type: ${typeOrmOptions.type}`);
  if ('url' in typeOrmOptions) {
      logger.log(`Connecting using URL.`);
  } else {
      logger.log(`Connecting to host: ${typeOrmOptions.host}, port: ${typeOrmOptions.port}, database: ${typeOrmOptions.database}`);
  }
  logger.log(`Synchronize: ${typeOrmOptions.synchronize}`);
  logger.log(`Logging: ${typeOrmOptions.logging}`);
  logger.log(`SSL enabled: ${!!typeOrmOptions.ssl}`);


  return typeOrmOptions;
};

// import { TypeOrmModuleOptions } from '@nestjs/typeorm';

// import * as dotenv from 'dotenv';

// // Cargar variables de entorno según el entorno actual
// if (process.env.NODE_ENV !== 'production') {
//   console.log('ORMCONFIG', process.env.NODE_ENV);
//   dotenv.config(); // Cargar variables de entorno de .env para desarrollo
// } else {
//   dotenv.config({ path: '.env.production' }); // Cargar variables de entorno de .env.prod para producción
// }

// export const config: TypeOrmModuleOptions = {
//   type: 'postgres',
//   url:
//     process.env.DB_URL ||
//     `postgresql://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@localhost:5432/${process.env.DB_NAME}`,
//   host: process.env.DB_HOST,
//   port: parseInt(process.env.DB_PORT),
//   username: process.env.DB_USERNAME,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
//   autoLoadEntities: true,
//   synchronize: true,
//   ssl:
//     process.env.DB_SSL === 'true'
//       ? {
//           rejectUnauthorized: false,
//         }
//       : null,
//   logging: true,

//   migrationsRun: false,
//   migrations: [__dirname + '/database/migrations/*.ts'],
// };

// // migrationsRun: true,
// //     migrations: [__dirname + "/database/migrations/*.ts"],
// //     cli: {
// //         "migrationsDir": __dirname + "/database/migrations",
// //     }
