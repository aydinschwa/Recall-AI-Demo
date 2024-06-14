const youtubesearchapi = require("youtube-search-api");

const getYouTubeVideos = async (searchTerm) => {
  const result = await youtubesearchapi.GetListByKeyword(searchTerm, false, 10);
  const { items } = result;
  const relevantInfo = items.map((item) => {
    return {
      title: item.title,
      channelTitle: item.channelTitle,
      url: `https://www.youtube.com/watch?v=${item.id}`,
    };
  });
  return relevantInfo;
};

module.exports = { getYouTubeVideos };
