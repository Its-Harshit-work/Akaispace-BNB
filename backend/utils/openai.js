import OpenAI from "openai";

/**
 * Function to determine the best description and update user ratings using GPT-4 Vision.
 * @param {string} imageUrl - The URL of the image.
 * @param {Array<Object>} labels - Array of labels, each with textDescription and userRating.
 * @returns {Object} - The final description and updated ratings.
 */
const getConsensusAndUpdatedRatings = async (imageUrl, labels) => {
  try {
    // Construct the text part of the prompt
    console.log(labels);
    console.log(imageUrl);
    const labelText = labels
      .map(
        (label, index) =>
          `Label ${index + 1}: "${label.textDescription}",rating ${
            index + 1
          }: ${label.userRating}`
      )
      .join("\n");

    const prompt = `
Hi, I want to label an image and need you to do the consensus. I have provided you the image and also some text labeling from 5 different individuals.
Kindly go through each of these texts and compare it with the image to see if it correctly describes the image.
I have also provided ratings for each of the users (out of 5). Use these ratings to determine the reliability of the users' labels.
In the end, use all of this information to give me a final description of 20 words that best describes the image.
Based on this, also evaluate the users and give them an updated rating.

${labelText}

You are supposed to give the output in the following format:
Final Description: [Your description here]
Updated rating 1:
Updated rating 2:
Updated rating 3:
Updated rating 4:
Updated rating 5:
`;
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            {
              type: "image_url",
              image_url: { url: imageUrl },
            },
          ],
        },
      ],
    });

    // Parse and return the GPT-4 response
    const output = response.choices[0];
    return output;
  } catch (error) {
    console.error("Error while getting consensus and updated ratings:", error);
    throw new Error("Failed to process consensus and update ratings.");
  }
};
export default getConsensusAndUpdatedRatings;
