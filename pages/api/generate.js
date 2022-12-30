import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const basePromptPrefix = 
`
Interpret the following information and create a professional resume. Only include sections which can be filled out with the information provided. For example, if no information on education has been provided, do not add an education section to the resume. If information on experience has been provided, then for each role, analyse the tasks completed and extrapulate 2-3 skills required for each job and add them to a skills section. If the information states to not add a particular section, don't add it. If it states to add a section, add it.

Information:
`
const generateAction = async (req, res) => {
    // Run first prompt
    console.log(`API: ${basePromptPrefix}${req.body.userInput}`)

    const baseCompletion = await openai.createCompletion({
        model: 'text-davinci-003',
        prompt: `${basePromptPrefix}${req.body.userInput}\n`,
        temperature: 0.9,
        max_tokens: 700,
    });
  
    const basePromptOutput = baseCompletion.data.choices.pop();

    // I build Prompt #2.
    const secondPrompt = 
    `
    Take the following resume and reword it to make it sound more professional in the hopes that it will entice employers to hire the person with this experience and skills. For the 3-4 sub tasks of each entry in experience, don't just simply reword them, estimate the kind of work they have done and try and transform them into professionally written, actionable tasks written in the style of a resume or CV. It would be best if each point was an actionable task. List the sub tasks in order of importance.     
    
    ${basePromptOutput.text}
  
    Here is the resume after being reworded:
    `

    // I call the OpenAI API a second time with Prompt #2
    const secondPromptCompletion = await openai.createCompletion({
        model: 'text-davinci-003',
        prompt: `${secondPrompt}`,
        // I set a higher temperature for this one. Up to you!
        temperature: 0.85,
            // I also increase max_tokens.
        max_tokens: 700,
    });

    // Get the output
    const secondPromptOutput = secondPromptCompletion.data.choices.pop();

    const thirdPrompt = 
    `
    Here is a resume:

    ${secondPrompt}

    For entries in Skills, they should not be more than 1-2 words. If the person is proficient in a programming language, just put the language and nothing more. For example, "PHP programming" should be "PHP". Also it is preferrable to put down one word skills instead of 2-3 words. For example, "Team collaboration" can be reworded to become "communication", as without the skill of communication, team collaboration is not possible. Interpret the skills and try and reword them into 1 or maximum 2 word skills please. Thanks

    Resume reworded:
    `

    const thirdPromptCompletion = await openai.createCompletion({
        model: 'text-davinci-003',
        prompt: `${thirdPrompt}`,
        // I set a higher temperature for this one. Up to you!
        temperature: 0.75,
            // I also increase max_tokens.
        max_tokens: 700,
    });

    // Get the output
    const thirdPromptOutput = thirdPromptCompletion.data.choices.pop();


    res.status(200).json({ output: thirdPromptOutput });
};

export default generateAction;