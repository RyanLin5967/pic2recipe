import re 
import psycopg2
from psycopg2.extras import execute_batch


EQUIPMENT_KEYWORDS = [
    "oven", "stovetop", "grill",'broiler', 'griddle', 'microwave', 'slow cooker', 
    'pressure cooker', 'instant pot', 'air fryer', 'smoker', 'deep fryer', 'rice cooker', 'toaster oven',

    'skillet', 'frying pan', 'saucepan', 'stockpot', 'dutch oven', 'wok', 'cast iron', 'roasting pan',
    'sheet pan', 'baking sheet', 'baking dish', 'casserole dish', 'loaf pan', 'cake pan', 'pie pan',
    'muffin tin', 'springform pan',

    'blender', 'food processor', 'stand mixer',  'hand mixer', 'immersion blender', 'juicer', 'mortar and pestle',
    
    'whisk', 'rolling pin', 'thermometer', 'kitchen scale', 'candy thermometer', 'mandoline', 'grater', 'peeler', 
    'colander' 'stainer', 'sieve', 'parchment paper', 'aluminum foil'
]

TIME_PATTERN = re.compile(
    r"(\d+(?:\s+\d/\d)?|\d+/\d|\d+\.\d+|\d+)\s*"
    r"(hours?|hrs?|minutes?|mins?|seconds?|secs?)\b",
    re.IGNORECASE,
)

def parse_fraction(s):
    s = s.strip()
    if " " in s:
        whole, frac = s.split()
        num, den = frac.split("/")
        return int(whole) + int(num)/int(den)
    if "/" in s: 
        num, den = s.split('/')
        return int(num)/int(den)
    return float(s)
def parse_cook_time(directions):
    text = ' '.join(directions).lower()
    total_minutes = 0.0
    for value, unit in TIME_PATTERN.findall(text):
        try:
            n = parse_fraction(value)
        except (ValueError, ZeroDivisionError):
            continue
        u = unit.lower()
        if u.startswith("hour") or u.startswith("hr"):
            total_minutes += n* 60
        elif u.startswith("min"):
            total_minutes += n
        elif u.startswith("sec"):
            total_minutes += n/60
    if total_minutes <= 0:
        return None
    if total_minutes > 600:
        return 600
    return int(round(total_minutes)) if total_minutes > 0 else None

def parse_equipment(directions):
    text = ' '.join(directions).lower()
    found = []
    for kw in EQUIPMENT_KEYWORDS:
        if re.search(rf"\b{re.escape(kw)}\b", text):
            found.append(kw)
    return found if found else None

def parse_difficulty(ingredients, directions):
    ing_count = len(ingredients)
    step_count = len(directions)

    if ing_count <= 6 and step_count <= 5:
        return "Easy"
    if ing_count <= 12 and step_count <= 10:
        return "Medium"
    return "Hard"

BATCH_SIZE = 1000
def main():
    conn = psycopg2.connect(
        user="pic2recipe",
        password="password6967",
        host="127.0.0.1",
        port="5433",
        database="pic2recipe",
    )
    cur = conn.cursor()
    cur.execute("SELECt COUNT(*) FROM recipes;")
    total = cur.fetchone()[0]
    print(f"total recipes: {total:,}")

    last_id = 0
    processed = 0

    while True:
        cur.execute(
            """
            SELECT id, ingredients, directions
            FROM recipes 
            WHERE id > %s
            ORDER BY id
            LIMIT %s;
            """,
            (last_id, BATCH_SIZE)
        )   
        rows = cur.fetchall()
        if not rows:
            break

        updates = []
        for row_id, ingredients, directions in rows:
            cook_time = parse_cook_time(directions)
            equipment = parse_equipment(directions)
            difficulty = parse_difficulty(ingredients, directions)
            updates.append((cook_time, equipment, difficulty, row_id))
        
        execute_batch(
            cur,
            """
            UPDATE recipes
            SET cook_time_minutes = %s,
                equipment = %s,
                difficulty = %s
            WHERE id = %s;
            """,
            updates,
            page_size=BATCH_SIZE
        )
        conn.commit()

        last_id = rows[-1][0]
        processed += len(rows)
        if processed % 10000 == 0 or processed == total:
            print(f"[{processed:,}/{total:,}]")
    cur.close()
    conn.close()
    print("done")

if __name__ == "__main__":
    main()