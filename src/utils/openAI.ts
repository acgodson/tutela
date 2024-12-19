import { ChatOpenAI, ChatOpenAICallOptions } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { StringOutputParser } from "@langchain/core/output_parsers";

export const getFullChain = (
  model: ChatOpenAI<ChatOpenAICallOptions>,
  context?: any | null
) => {
  const contextChain = PromptTemplate.fromTemplate(
    `You are tutela's AI assistant. Use context when needed. Reply in short sentences. Stay on topic:
  
  Context: {context}
  Question: {question}
  Answer:`
  ).pipe(model);

  const generalChain = PromptTemplate.fromTemplate(
    `You are tutela's AI assistant. Use short sentences. Answer:
  
  Question: {question}
  Answer:`
  ).pipe(model);

  const classificationPromptTemplate =
    PromptTemplate.fromTemplate(`tutela monitors pig farm health status by storing updates from the iOt on blockchain. farm category is about records from the iot in the users farm. regional is queries analized fron aggregated records from a particular region. general is like a general comment or question  that requires no context from tutelas data. 
  Classify as 'general' or regional' or 'farm'. One word only.
  
  <question>
  {question}
  </question>
  
  Classification:`);

  const classificationChain = RunnableSequence.from([
    classificationPromptTemplate,
    model,
    new StringOutputParser(),
  ]);

  const route = async ({
    topic,
    question,
    context,
  }: {
    topic: string;
    question: string;
    context?: string;
  }) => {
    if (context) {
      return contextChain.invoke({ context, question });
    } else {
      return generalChain.invoke({ question });
    }
  };

  const fullChain = RunnableSequence.from([
    {
      topic: async (input) => {
        const classificationResult = await classificationChain.invoke({
          question: input.question,
        });
        return classificationResult.trim();
      },
      question: (input) => input.question,
      context: (input) => input.context || null,
    },
    route,
  ]);

  return fullChain;
};

export async function fetchQueryResponse(
  prompt: string,
  apiKey: string,
  context?: any | null
) {
  const model = new ChatOpenAI({
    modelName: "gpt-3.5-turbo",
    openAIApiKey: apiKey,
  });

  const fullChain = getFullChain(model, context);

  const result: any = await fullChain.invoke({
    question: prompt,
    context,
  });

  return result.content;
}
