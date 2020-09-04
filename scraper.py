import pandas as pd

js = pd.read_json('out.json')

js

js.groupby('name').count()
