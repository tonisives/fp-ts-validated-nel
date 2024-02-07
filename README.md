# validatedNel

Check out my [blog
post](https://tonisives.com/blog/2024/02/07/how-to-achieve-validatednel-with-fp-ts/) for more information.

In short, validatedNel is used to validate multiple problems and then merge them together into a single error
string. 

This repo shows how to handle this in a fp-ts context. It uses `pipe` and 

```
let Ap = TE.getApplicativeTaskValidation(T.ApplyPar,
  pipe(string.Semigroup, S.intercalate(", "))
)
```

## run

`tsx ./src/app.run.ts`