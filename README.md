# validatedNel

validatedNel is used to validate multiple problems and then merge them together into a single error
string. 

This repo shows how to handle this in a fp-ts context. It uses `pipe` and 

```
let Ap = TE.getApplicativeTaskValidation(T.ApplyPar,
  pipe(string.Semigroup, S.intercalate(", "))
)
```

## run

`tsx ./src/app.run.ts`