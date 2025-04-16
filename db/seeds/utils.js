const db = require("../../db/connection");

exports.convertTimestampToDate = ({ created_at, ...otherProperties }) => {
  if (!created_at) return { ...otherProperties };
  return { created_at: new Date(created_at), ...otherProperties };
};

exports.referenceObject = (articlesArr)=>{
  if(articlesArr.length === 0) {
    return {}
  }
  const result = {}
  articlesArr.forEach((article)=>{
    result[article.title] = article.article_id
  })
  
  return result 
}


