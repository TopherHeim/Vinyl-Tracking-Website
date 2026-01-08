
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

interface AlbumMetadata {
  genre: string;
  year: number;
  description: string;
  spineColor: string;
  correctArtist: string;
  correctTitle: string;
}

export const fetchAlbumMetadata = async (title: string, artist: string): Promise<AlbumMetadata | null> => {
  try {
    const prompt = `Provide metadata for the vinyl album "${title}" by "${artist}". 
    1. Identify the official canonical spelling and capitalization for the Artist and Album Title.
    2. Provide the primary genre.
    3. Provide the release year.
    4. Provide a short one-sentence description.
    5. Provide a hex color code for the spine based on the cover art.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            correctArtist: { type: Type.STRING },
            correctTitle: { type: Type.STRING },
            genre: { type: Type.STRING },
            year: { type: Type.INTEGER },
            description: { type: Type.STRING },
            spineColor: { type: Type.STRING }
          },
          required: ["correctArtist", "correctTitle", "genre", "year", "description", "spineColor"]
        }
      }
    });

    return JSON.parse(response.text) as AlbumMetadata;
  } catch (error) {
    console.error("Failed to fetch album metadata:", error);
    return null;
  }
};

export const getAIRecommendations = async (ownedAlbums: {title: string, artist: string}[]): Promise<any[]> => {
  try {
    const collectionSummary = ownedAlbums.map(a => `${a.title} by ${a.artist}`).join(', ');
    const prompt = `Based on my record collection: [${collectionSummary}], suggest 3 specific vinyl albums I should consider getting next. Focus on high-quality pressings and similar vibes. 
    Include the genre, release year, and a suggested spine color (hex).
    Provide a "reason" field that is witty and related to my existing taste.`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              artist: { type: Type.STRING },
              reason: { type: Type.STRING },
              genre: { type: Type.STRING },
              year: { type: Type.INTEGER },
              spineColor: { type: Type.STRING }
            },
            required: ["title", "artist", "reason", "genre", "year", "spineColor"]
          }
        }
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Failed to get AI recommendations:", error);
    return [];
  }
};
