const fetch = require('node-fetch');

async function main() {
  const resp = await fetch('http://localhost:3000/api/prisma?collection=community&method=findMany', {
    method: 'POST',
    body: JSON.stringify({
      where: {
        name: {
          contains: 'Eusoff Hall',
        }
      }
    })
  })

  console.log(await resp.json());
}

main().catch(console.error);