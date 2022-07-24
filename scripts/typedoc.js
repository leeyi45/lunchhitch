const typedoc = require('typedoc');

async function main() {
  const app = new typedoc.Application();

  app.bootstrap({
    entryPoints: ['src/**'],
    entryPointStrategy: 'resolve',
    out: 'typedoc_out',
  });

  const project = app.convert();

  if (project) {
    await app.generateDocs();
  }
}

main().catch(console.error);
