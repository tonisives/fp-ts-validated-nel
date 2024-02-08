import Logger from "jst-logger"
import { pipe } from "fp-ts/lib/function.js"
import * as TE from "fp-ts/lib/TaskEither.js"
import * as E from "fp-ts/lib/Either.js"
import * as T from "fp-ts/lib/Task.js"
import * as S from "fp-ts/lib/Semigroup.js"
import * as A from "fp-ts/lib/Apply.js"

import { string } from "fp-ts"

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

  let res = await pipe(
    validateInput(input),
    TE.fromEither,
    TE.fold(
      (err) => T.of(err.message),
      (it) => T.of(`ok: ${JSON.stringify(it)}`)
    )
  )()
  
  return res
}

let validateInput = (input: Input): E.Either<Error, Input> => {
  let Ap = E.getApplicativeValidation(
    pipe(string.Semigroup, S.intercalate(", "))
  )
  let apS = A.apS(Ap)

  let res = pipe(
    E.Do,
    apS("fileName", validateFileName(input.fileName)),
    apS("bucket", validateBucket(input.bucket)),
    E.fold(
      (err) => E.left(new Error(err)),
      () => E.right(input)
    )
  )

  return res
}

let validateFileName = (fileName?: string): E.Either<string, string> => {
  if (!fileName) return E.left("fileName is required")
  if (!fileName.match(/.*(-all|-docs|)\.zip/))
    return E.left("fileName not supported")
  return E.right(fileName)
}

let validateBucket = (bucket?: Bucket): E.Either<string, string> => {
  if (!bucket) return E.left("bucket is required")
  if (bucket !== "contest-sources") return E.left("bucket not supported")
  return E.right(bucket)
}
