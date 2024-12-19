import { ChatOpenAI, ChatOpenAICallOptions } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { z } from "zod";


const classificationSchema = z.enum(["general", "regional", "farm"]);
type Classification = z.infer<typeof classificationSchema>;

export interface ChainResponse {
  content: string;
  needsContext: boolean;
  classification: Classification;
}

export interface Message {
  id: number;
  text: string;
  sender: "user" | "agent";
  needsContext?: boolean;
  classification?: Classification;
  attachments?: any[];
}

export const getFullChain = (model: ChatOpenAI<ChatOpenAICallOptions>) => {
  // Chain for context-aware responses
  const contextChain = PromptTemplate.fromTemplate(
    `
    You are tutela's AI assistant for pig farm health monitoring. 
    Provide concise, accurate responses using the context provided.
    
    Context: {context}
    Question: {question}
    
    Response (stay factual and specific to the data provided):
  `
  ).pipe(model);

  // Chain for general responses
  const generalChain = PromptTemplate.fromTemplate(
    `
    You are tutela's AI assistant for pig farm health monitoring. 
    Provide helpful responses for general queries about pig farming and health monitoring.
    Keep responses concise and practical.
    
    Question: {question}
    
    Response:
  `
  ).pipe(model);

  // Enhanced classification prompt
  const classificationPromptTemplate = PromptTemplate.fromTemplate(`
    You are classifying questions for tutela's pig farm health monitoring system.
    
    Categories:
    - 'farm': Questions about specific farm data, individual pig health, or farm-level metrics
    - 'regional': Questions about regional statistics, trends, or comparisons
    - 'general': General questions about pig farming, system usage, or unrelated topics
    
    Respond with exactly one category word.
    
    Question: {question}
    
    Classification:
  `);

  const classificationChain = RunnableSequence.from([
    classificationPromptTemplate,
    model,
    new StringOutputParser(),
    //cleanup step to remove quotes and trim
    (text: string) => text.replace(/['"]/g, "").trim().toLowerCase(),
  ]);

  const route = async ({
    classification,
    question,
    context,
  }: {
    classification: Classification;
    question: string;
    context?: string;
  }): Promise<ChainResponse> => {
    let response;

    switch (classification) {
      case "farm":
      case "regional":
        // Only use context chain if context is provided
        if (context) {
          response = await contextChain.invoke({ context, question });
        } else {
          // If no context but question needs it, indicate this in response
          return {
            content:
              "I'll need to check the latest data to answer this accurately. Let me fetch that for you.",
            needsContext: true,
            classification,
          };
        }
        break;
      case "general":
        response = await generalChain.invoke({ question });
        break;
    }

    return {
      content: response.content.toString(),
      needsContext: false,
      classification,
    };
  };

  return {
    classify: classificationChain,
    route,
  };
};

export async function fetchQueryResponse(
  prompt: string,
  apiKey: string,
  context?: string | null
): Promise<ChainResponse> {
  const model = new ChatOpenAI({
    modelName: "gpt-3.5-turbo",
    openAIApiKey: apiKey,
  });

  const chain = getFullChain(model);

  // First, classify the question
  const rawClassification = await chain.classify.invoke({ question: prompt });

  // Parse the classification after cleaning it
  const classification = classificationSchema.parse(rawClassification);

  // Then route to appropriate handler
  return chain.route({
    classification,
    question: prompt,
    context: context || undefined,
  });
}
