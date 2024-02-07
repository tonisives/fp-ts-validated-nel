import { handler } from "./app.js"

handler(
  {
    body: JSON.stringify({
      // fileName: `my-zip.zip`, // dont input filename
      bucket: `not correct bucket id`,
    }),
    headers: {},
  } as any,
)
  .then((res: any) => {
    console.log(`response: ${res}`)
  })
  .catch((err: any) => {
    console.log(err)
  })
