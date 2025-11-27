const path = require('path');

module.exports = function (options, webpack) {
  return {
    ...options,
    externals: [],
    output: {
      ...options.output,
      libraryTarget: 'commonjs2',
    },
    module: {
      ...options.module,
      rules: [
        ...options.module.rules,
        {
          test: /\.d\.ts$/,
          loader: 'ignore-loader',
        },
        {
          test: /\.js\.map$/,
          loader: 'ignore-loader',
        },
      ],
    },
    plugins: [
      ...options.plugins,
      new webpack.IgnorePlugin({
        checkResource(resource) {
          const lazyImports = [
            '@nestjs/microservices',
            '@nestjs/microservices/microservices-module',
            '@nestjs/websockets/socket-module',
            '@mikro-orm/core',
            '@nestjs/mongoose',
            '@nestjs/sequelize',
            '@nestjs/sequelize/dist/common/sequelize.utils',
            '@nestjs/typeorm',
            '@nestjs/typeorm/dist/common/typeorm.utils',
            'cache-manager',
            'class-validator',
            'class-transformer',
          ];
          if (!lazyImports.includes(resource)) {
            return false;
          }
          try {
            require.resolve(resource, {
              paths: [process.cwd()],
            });
          } catch (err) {
            return true;
          }
          return false;
        },
      }),
    ],
  };
};
