# קופת הנהג — ניהול כסף לדריבר

אפליקציית ווב (PWA) בעברית, מותאמת למובייל, לניהול כסף של נהגי דריבר בישראל.
סגנון נקי, מקצועי, דק ואלגנטי — ללא צבעים ילדותיים. RTL.

## מודל עסקי

- **הכנסה** — נסיעות (ברוטו שהנהג קיבל).
- **סדרן** — מי שמסדר נסיעות, מקבל **אחוז קבוע מכל נסיעה** (ברירת מחדל 30%).
- **רכב** — שכירות חודשית קבועה (למשל ₪6,000 לחודש ÷ 24 ימי עבודה = ₪250 ליום).
- **הוצאות** — דלק, קניות, כלים וכו'.

רווח נטו = הכנסות ברוטו − עמלת סדרן − הוצאות − עלות רכב יומית.

## קבצים

| קובץ | תפקיד |
|------|-------|
| `index.html` | כל האפליקציה (HTML/CSS/JS מוטבע) — גרסה 2.2 |
| `manifest.json` | מניפסט PWA להתקנה במסך הבית |
| `sw.js` | Service Worker — מאפשר עבודה אופליין ועדכונים |
| `guide.html` | מדריך התקנה וענן בעברית, שלב-אחר-שלב |
| `icon-192.png`, `icon-512.png`, `icon-180.png`, `icon-maskable.png` | אייקונים |
| `README.md` | הקובץ הזה |

## אחסון

- **לוקלי:** `localStorage` (מפתח `kupaNehed.v2`).
- **ענן (אופציונלי):** גיבוי ל-**GitHub Gist פרטי** באמצעות REST API.
  - טוקן מאוחסן ב-`localStorage('kupa.gh')`.
  - מזהה הגיסט ב-`state.settings.gistId`.
  - סנכרון: דחיפה אחרי כל שמירה (debounce 1500ms), משיכה כל 5 דקות ובחזרה לטב.

## מבנה ה-State

```js
state = {
  settings: {
    name, pct:30, dark, goal, fundPct:10, ownerPhone, remindOn, remindTime,
    lastMethod, rent:6000, workDays:24, autoRent:true, gistId
  },
  tx: [],        // עסקאות {id,type,cat,amount,date,note,ts,method}
  shifts: [],    // משמרות
  fund: {balance, log:[]},
  meta: {best, goalToast, notified, coveredDay, dismiss},
  updatedAt
}
```

### קטגוריות עסקאות

- הכנסה: `rides` (נסיעות), `income` (הכנסות אחרות).
- הוצאה: `commission` (לסדרן), `rent` (שכירות רכב), `fuel` (דלק), `expense` (הוצאות אחרות).

### לוגיקת סכומים

- `sums(list)` מחזיר `{inc, com, exp, rides}`.
- עמלת סדרן: `rides × pct / 100`.
- נטו: `inc − סדרן − exp`.
- עלות רכב יומית: `rent / workDays`.

## הגדרות עיקריות (באפליקציה)

- שכירות רכב חודשית, ימי עבודה, שכירות אוטומטית בהוצאות.
- עמלת סדרן (%), טלפון סדרן.
- עמלת סדרן אוטומטית מתווספת בכל רישום נסיעה (תחת "לסדרן").

## טכנולוגיה

- HTML + CSS + Vanilla JS, ללא תלות בחבילות.
- Font: Google Fonts (עברית).
- PWA: manifest + service worker + אייקונים.

## פריסה לענן (GitHub Pages)

מעלים את כל הקבצים ל-repo בשם `kupa`, מפעילים Pages מ-Settings → Pages → Branch `main`, ומתחברים
ב-`https://USERNAME.github.io/kupa/`. המדריך המלא: `guide.html`.
