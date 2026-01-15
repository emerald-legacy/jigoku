class NewsService {
    constructor(db) {
        this.news = db.collection('news');
    }

    async getRecentNewsItems(options) {
        let cursor = this.news.find({}).sort({ datePublished: -1 });
        if(options.limit) {
            cursor = cursor.limit(parseInt(options.limit));
        }
        return cursor.toArray();
    }

    async addNews(news) {
        const result = await this.news.insertOne(news);
        return { ...news, _id: result.insertedId };
    }
}

module.exports = NewsService;
