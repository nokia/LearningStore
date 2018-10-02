import json 
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

from html.parser import HTMLParser
import string

def strip_tags(html):
    s = MLStripper()
    s.feed(html)
    return s.get_data()
    
class MLStripper(HTMLParser):
    def __init__(self):
        #super().__init__()
        self.reset()
        self.strict = False
        self.convert_charrefs= True
        self.fed = []
    def handle_data(self, d):
        self.fed.append(d)
    def get_data(self):
        return ''.join(self.fed)
        
def cleanDataFrame(ds, useDescription, useObjectives, useKeywords):
    for idx, row in ds.iterrows():
        # remove html tags
        description = ""
        if useDescription == 'on' and 'Description' in ds.columns:
            description += str(row['Description'])
        if useObjectives == 'on' and 'Objectives' in ds.columns:
            description += str(row['Objectives'])
        if useKeywords == 'on' and 'Keywords' in ds.columns:
            description += str(row['Keywords'])
        description = strip_tags(description)
        # description = strip_tags(row['Description'])
        # remove whitespace and punctuation
        words = description.split()
        words = [word.lower() for word in words]
        table = str.maketrans('', '', string.punctuation)
        description = [w.translate(table) for w in words]
        description = ' '.join(map(str, description))
        
        # remove stop words
        stop_words = ['i', 'me', 'my', 'myself', 'we', 'our', 'ours', 'ourselves', 'you', 'your', 'yours', 'yourself', 'yourselves', 'he', 'him', 'his', 'himself', 'she', 'her', 'hers', 'herself', 'it', 'its', 'itself', 'they', 'them', 'their', 'theirs', 'themselves', 'what', 'which', 'who', 'whom', 'this', 'that', 'these', 'those', 'am', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'having', 'do', 'does', 'did', 'doing', 'a', 'an', 'the', 'and', 'but', 'if', 'or', 'because', 'as', 'until', 'while', 'of', 'at', 'by', 'for', 'with', 'about', 'against', 'between', 'into', 'through', 'during', 'before', 'after', 'above', 'below', 'to', 'from', 'up', 'down', 'in', 'out', 'on', 'off', 'over', 'under', 'again', 'further', 'then', 'once', 'here', 'there', 'when', 'where', 'why', 'how', 'all', 'any', 'both', 'each', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very', 's', 't', 'can', 'will', 'just', 'don', 'should', 'now', 'd', 'll', 'm', 'o', 're', 've', 'y', 'ain', 'aren', 'couldn', 'didn', 'doesn', 'hadn', 'hasn', 'haven', 'isn', 'ma', 'mightn', 'mustn', 'needn', 'shan', 'shouldn', 'wasn', 'weren', 'won', 'wouldn']
        for stop_word in stop_words:
            description = description.replace(' '+stop_word+' ', ' ')
        
        ds.set_value(idx,'Description',description) 
    return ds;
    
class Recommendation(object):
    index = 0
    title = ""
    score = 0

    # The class "constructor" - It's actually an initializer 
    def __init__(self, index, title, score):
        self.index = index
        self.title = title
        self.score = score
        
def make_recommendation(index, title, score):
    recommendation = Recommendation(index, title, score)
    return recommendation
    
def return_recommendations_for_id(itemid):
    recommendations = []
    try:
        recs = results[itemid][:num]
        i = 1;
        for rec in recs:
            if rec[0] > 0.3:
                recommendations.append(rec[1])
                i += 1
        # Do something
    except KeyError:
        pass    
    return recommendations;

ds = pd.read_json('5g.json') #you can plug in your own list of products or movies or books here as csv file
ds = cleanDataFrame(ds, 'off', 'off', 'on');
tf = TfidfVectorizer(analyzer='word', ngram_range=(1, 3), min_df=0, stop_words='english')

tfidf_matrix = tf.fit_transform(ds['Description'].astype(str))
cosine_similarities = cosine_similarity(tfidf_matrix,tfidf_matrix)

results = {} # dictionary created to store the result in a dictionary format (ID : (Score,item_id))

for idx, row in ds.iterrows(): #iterates through all the rows
    # the below code 'similar_indice' stores similar ids based on cosine similarity. sorts them in ascending order. [:-5:-1] is then used so that the indices with most similarity are got. 0 means no similarity and 1 means perfect similarity
    similar_indices = cosine_similarities[idx].argsort()[:-12:-1] #stores 10 most similar books, you can change it as per your needs
    similar_items = [(cosine_similarities[idx][i], ds['ID'][i]) for i in similar_indices]
    results[row['ID']] = similar_items[1:]
    
num = 5
itemid =  "d.1"


with open('5g.json', encoding="utf8") as f:
    data = json.load(f)
for row in data:
    recommendations = return_recommendations_for_id(row.get("ID"))
    row['Recommendations'] = recommendations 
    
with open('5g.json', 'w') as f:
    json.dump(data, f, indent=4)
  



