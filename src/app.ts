import Logger from "jst-logger"
import { pipe } from "fp-ts/lib/function.js"
import * as TE from "fp-ts/lib/TaskEither.js"
import * as T from "fp-ts/lib/Task.js"
import * as S from "fp-ts/lib/Semigroup.js"
import { string } from "fp-ts"

import { sequenceT } from "fp-ts/lib/Apply.js"

Logger.useDefaults()
Logger.setLevel(Logger.DEBUG)

type Bucket = "contest-sources"

type Input = {
  fileName: string
  bucket: Bucket
}

// prettier-ignore
export const handler = async (event: any) => {
  Logger.info(`request: ${JSON.stringify(event, null, 2)}`)
  let input = JSON.parse(event.body) as Input

  let Ap = TE.getApplicativeTaskValidation(T.ApplyPar,
    pipe(string.Semigroup, S.intercalate(", "))
  )

  let res = await pipe(
    sequenceT(Ap)(
      validateFileName(input.fileName),
      validateBucket(input.bucket),
    ),
    TE.mapLeft((it)=> Error(it)),
    TE.fold(
      (err) => T.of(err.message),
      (it) => T.of(`ok: ${it.join(", ")}`)
    )
    )()
  
  return res
}

let validateFileName = (fileName?: string): TE.TaskEither<string, string> => {
  if (!fileName) return TE.left("fileName is required")
  if (!fileName.match(/.*(-all|-docs|)\.zip/))
    return TE.left("fileName not supported")
  return TE.right(fileName)
}

let validateBucket = (bucket?: Bucket): TE.TaskEither<string, string> => {
  if (!bucket) return TE.left("bucket is required")
  if (bucket !== "contest-sources") return TE.left("bucket not supported")
  return TE.right(bucket)
}
