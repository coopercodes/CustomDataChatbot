import { createClient } from "@supabase/supabase-js";
import { Configuration, OpenAIApi } from "openai";

// Initialize our Supabase client
const supabaseClient = createClient("https://pedailrbwlfhsiwhwued.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBlZGFpbHJid2xmaHNpd2h3dWVkIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODI0NTI2MTQsImV4cCI6MTk5ODAyODYxNH0.8rQquv5lw7WGtxclk8OXr69DbqnxihWumH003GzSvwQ");

// generateEmbeddings
async function generateEmbeddings() {
    // Initialize OpenAI API
    const configuration = new Configuration({ apiKey: "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" });
    const openai = new OpenAIApi(configuration);
    // Create some custom data (Cooper Codes)
    const documents = [
        "Cooper Codes is a YouTuber with 5,300 subscribers",
        "Cooper Codes has a website called coopercodes.com",
        "Cooper Codes likes clam chowder",
        "Cooper Codes has a video covering how to create a custom chatbot with Supabase and OpenAI API"
    ];

    for(const document of documents) {
        const input = document.replace(/\n/g, '');

        // Turn each string (custom data) into an embedding
        const embeddingResponse = await openai.createEmbedding({
            model: "text-embedding-ada-002", // Model that creates our embeddings
            input
        });

        const [{ embedding }] = embeddingResponse.data.data;

        // Store the embedding and the text in our supabase DB
        await supabaseClient.from('documents').insert({
            content: document,
            embedding
        });
    }
}

async function askQuestion() {
    const { data, error } = await supabaseClient.functions.invoke('ask-custom-data', {
        body: JSON.stringify({ query: "What is Cooper Codes favorite food?" }),
      })
    console.log(data);
    console.log(error);
}

askQuestion();

// /ask-custom-data -> getting relevant documents, asking chatgpt, returning the response
// Supabase command line interface