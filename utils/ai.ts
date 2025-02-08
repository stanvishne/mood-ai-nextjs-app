import { ChatOpenAI, OpenAI, OpenAIEmbeddings } from '@langchain/openai'
import { StructuredOutputParser } from 'langchain/output_parsers'
import z from 'zod'
import { PromptTemplate } from '@langchain/core/prompts'
import { Document } from 'langchain/document'
import { loadQARefineChain } from 'langchain/chains'
import { MemoryVectorStore } from 'langchain/vectorstores/memory'

const parser = StructuredOutputParser.fromZodSchema(
  z.object({
    sentimentScore: z
      .number()
      .describe(
        'sentiment of the text and rated on a scale from -10 to 10, where -10 is extremely negative, 0 is neutral, and 10 is extremely positive.'
      ),
    mood: z
      .string()
      .describe('the mood of the person who wrote the journal entry.'),
    summary: z.string().describe('quick summary of the entire entry.'),
    subject: z.string().describe('the subject of the journal entry.'),
    color: z.string()
      .describe(`a hexidecimal color code that reperesents the mood of the entry. Example 
        #0101fe for blue representing happines`),
    negative: z
      .boolean()
      .describe(
        'is the journal entry negative ? (i.e. does it contain negative emotions)'
      ),
  })
)

const getPrompt = async (content: any) => {
  const formatted_instructions = parser.getFormatInstructions()
  //   console.log('!!!!', formatted_instructions)
  const prompt = new PromptTemplate({
    template: `Analyze the following journal entry. Follow the instructions and format your response to match the format instructions, no matter what! \n
      {formatted_instructions}\n{entry}`,

    inputVariables: ['entry'],
    partialVariables: { formatted_instructions },
  })
  const res = await prompt.format({
    entry: content,
  })
  //   console.log('!!!', res)
  return res
}

export const analyze = async (content: any) => {
  const input = await getPrompt(content)
  //   console.log('!!', input)
  const model = new ChatOpenAI({ temperature: 0, modelName: 'gpt-3.5-turbo' })
  // const result = await model.invoke(prompt)
  const result = await model.invoke(input)
  //   console.log('????', result.content)
  try {
    return parser.parse(result.content as any)
  } catch (e) {
    console.log(e)
  }
}

export const qa = async (question: string, entries: any[]) => {
  const docs = entries.map((entry) => {
    return new Document({
      pageContent: entry.content,
      metadata: { id: entry.id, createdAt: entry.createdAt },
    })
  })
  const model = new ChatOpenAI({
    temperature: 0,
    modelName: 'gpt-3.5-turbo',
  })
  const chain = loadQARefineChain(model)
  const embeddings = new OpenAIEmbeddings()
  const store = await MemoryVectorStore.fromDocuments(docs, embeddings)
  const relevantDocs = await store.similaritySearch(question)
  const res = await chain.call({
    input_documents: relevantDocs,
    question,
  })
  return res.output_text
}
