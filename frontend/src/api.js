import axios from 'axios';

export const transformText = async (action, text) => {
  try {
    const response = await axios.post('http://localhost:1789/api/transform', {
      action,
      text,
    });
    return response.data;
  } catch (error) {
    console.error('Error transforming text', error);
    return { transformedText: 'Error processing the text.' };
  }
};
