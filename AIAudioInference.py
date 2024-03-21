import nltk
import sys
# nltk.download('vader_lexicon')
from nltk.sentiment import SentimentIntensityAnalyzer

user = str(sys.argv[1])

def analyze_sentiment(text):
    sid = SentimentIntensityAnalyzer()
    sentiment_score = sid.polarity_scores(text)

    if sentiment_score['compound'] >= 0.05:
        return "Happy"
    elif sentiment_score['compound'] <= -0.05:
        return "Sad"
    else:
        return "Neutral"

if __name__ == "__main__":
    user_text = user
    sentiment = analyze_sentiment(user_text)
    print(f"Sentiment: {sentiment}")
