const { getPresignedUrl } = require("./utils");

// @ts-ignore
exports.handler = async (event) => {
  const { stage, fileName, id, category, ContentType } = event;
  console.log("contenttype ====>>>", ContentType);

  try {
    // Construct the path
    const path = `${stage}/${category}/${id}/${fileName}`;
    // Get the presigned put url
    const url = await getPresignedUrl(path, ContentType);

    return url;
  } catch (error) {
    const response = {
      statusCode: 400,
      body: JSON.stringify(error),
    };

    return response;
  }
};
