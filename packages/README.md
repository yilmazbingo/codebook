- Whenever we use Lerna, we do not manually NPM install modules. We just forget `npm install` command even exists.

  `lerna add`

**NOTE:** If you add `lerna add <packageName>` this will add that dependency each of directory inside "/packages". Instead we have to scope `lerna add`.
