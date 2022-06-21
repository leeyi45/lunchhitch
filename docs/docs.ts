import * as TypeDoc from 'typedoc';

async function main() {
  const app = new TypeDoc.Application();

  app.options.addReader(new TypeDoc.TSConfigReader());
  app.options.addReader(new TypeDoc.TypeDocReader());

  app.bootstrap({
    entryPoints: ['src/common/formik_wrapper/formik_wrapper.tsx'],
  });

  const project = app.convert();
  if (project) {
    await app.generateDocs(project, 'docs/src/developer/types');
  }
}

main().catch(console.error);