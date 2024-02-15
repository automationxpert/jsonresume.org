import { ChatGPTAPI } from 'chatgpt';
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://itxuhvvwryeuzuyihpkp.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);
/*
#todo
 - add an input box to post the job description
  - save JD in local storage
 - buttons that can change tone of the letter
  - save settings in local storage




#wishlist
 - google the company, and include as much up to date information as possible in the prompt

*/

export default async function handler(req, res) {
  const { username, jobDescription, tone } = req.body;

  const { data } = await supabase
    .from('resumes')
    .select()
    .eq('username', username);

  const resume = JSON.parse(data[0].resume);

  const resumeString = JSON.stringify(resume);

  const api = new ChatGPTAPI({
    apiKey: process.env.OPENAI_API_KEY,
    model: 'gpt-3.5-32k-turbo',
    completionParams: {
      temperature: 0.85,
    },
  });

  let prompt = [
    `
You are a human candidate for a job. Read the supplied resume and pretend you are that person. Your resume has been supplied to them.

This is your resume in the JSON format. Reference it for the cover letter.

  ${resumeString}

  `,
  ];

  if (jobDescription) {
    prompt.push(`

    Here is the job description I am applying for;
     ${jobDescription}.

    `);
  }

  prompt.push(
    `Using a ${tone} tonality. Format your response using Markdown. Don't be afraid to name your lack of experience the candidate might have but focus on your strengths. Keep it two a couple short paragraphs only 300 words.`
  );

  prompt.push(
    'Please write a short cover letter. Make sure you write a cover letter.'
  );

  console.log({ prompt });

  const res2 = await api.sendMessage(prompt.join(''));

  return res.status(200).send(res2.text);
}
