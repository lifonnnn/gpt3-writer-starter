import Head from 'next/head';
import Image from 'next/image';
import buildspaceLogo from '../assets/buildspace-logo.png';
import { useState } from 'react';

const Home = () => {
  const [userInput, setUserInput] = useState('');
  const onUserChangedText = (event) => {
    setUserInput(event.target.value);
  };
  const [apiOutput, setApiOutput] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)

  const callGenerateEndpoint = async () => {
    setIsGenerating(true);
    
    console.log("Calling OpenAI...")
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userInput }),
    });

    const data = await response.json();
    const { output } = data;
    console.log("OpenAI replied...", output.text)

    setApiOutput(`${output.text}`);
    setIsGenerating(false);
  }
  return (
    <div className="root">
      <Head>
        <title>GPT-3 Writer | buildspace</title>
      </Head>
      <div className="container">
        <div className="header">
          <div className="header-title">
            <h1>ai resume generator</h1>
          </div>
          <div className="header-subtitle">
            <h2>Take the Stress Out of Resume Writing. Let AI take care of the hard work so you can focus on the job search.</h2>
            <h2>How it works (READ THIS): The purpose of this tool is to take what you want on your resume in plain english, and translate it into actionable dot points you can put directly into your resume. You can be as detailed or brief as you want, the AI will interpret it accordingly. If you want/don't want specific sections, just mention which. If you want certain sections to be detailed, just mention which. Basically, you can customise your resume exactly how you want it, and if you're not sure about certain parts, let the AI figure it out for you. What this tool is NOT is a generic resume generator. It will not do a very good job without details. The more details you provide, the better the result will be :) </h2>
          </div>
        </div>
        {/* Add this code here*/}
        <div className="prompt-container">
          <textarea placeholder="start typing here" className="prompt-box" value={userInput} onChange={onUserChangedText}/>
          {/* New code I added here */}
          <div className="prompt-buttons">
            <a
              className={isGenerating ? 'generate-button loading' : 'generate-button'}
              onClick={callGenerateEndpoint}
            >
              <div className="generate">
              {isGenerating ? <span className="loader"></span> : <p>Generate</p>}
              </div>
            </a>
          </div>
          {/* New code I added here */}
          {apiOutput && (
          <div className="output">
            <div className="output-header-container">
              <div className="output-header">
                <h3>Output</h3>
              </div>
            </div>
            <div className="output-content">
              <p>{apiOutput}</p>
            </div>
          </div>
        )}
        </div>
      </div>
      <div className="badge-container grow">
        <a
          href="https://buildspace.so/builds/ai-writer"
          target="_blank"
          rel="noreferrer"
        >
          <div className="badge">
            <Image src={buildspaceLogo} alt="buildspace logo" />
            <p>build with buildspace</p>
          </div>
        </a>
      </div>
    </div>
  );
};

export default Home;
