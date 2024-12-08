# Vanilla Js atsiskaitomoji užduotis

Final Project Task: Meal Search Application with Figma Design and MealDB API Integration

## Mokykimės iš klaidų

Norėjosi padaryti protingai, bet gavosi tikrai pernelyg sudėtingai. Ypač tokios apimties aplikacijai.

### Nepagrįsti dizaino sprendimai

Idėja buvo minimizuoti API calls, per daug nedidinant UX clicks. Stengiamasi nekrauti API resurso be vartotojo sutikimo, pvz. tiktai užėjus į puslapį ir pradedant browser sesiją. Todėl UX yra vietų, kur vartotojas turi atlikti paspaudimą, kad būtų siunčiami duomenys iš API.

Taip pat siekiama kiek įmanoma minimizuoti DOM manipuliacijas, perstumdyti HTML elementus jų neperkuriant, jeigu jie jau egzistuoja. Su React tokių problemų išvis nebūtų, nes visu tuo pasirūpina pats React.

### Struktūra ir ES6

Naudojamos klasės, extend, callback, funkcijų ir ojektų ref perdavinėjimai tarp komponentų. Šiaip stengčiausi organizuoti src failus, naudoti kodo komentarus `//#region` ir `/** JSDoc */`, tačiau ne šį kartą, todėl ir pačiam sunku susigaudyti kode.

Be to, naudojant ES5 transpiliavimą sunkiau debug'inti kai naudojama daug ES6 struktūrų, nes dažnai neišeina atsekti stack trace. Tai galbūt tada reiktų ieškant klaidų šaltinio perjungti į webpack debug režimą be transpiliavimo, o transpiliavimą naudoti jau išgaudžius klaidas ir testuojant galutinį build.
