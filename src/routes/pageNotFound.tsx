import FuzzyText from '../blocks/TextAnimations/FuzzyText/FuzzyText';

type pageNotFoundProps = {
  message: string;
  details: string;
  stack: string | undefined;
}

export default function PageNotFound({message, details, stack} : pageNotFoundProps) {
    return (
        <>
        <div className="bg-black h-full">
        
        <main className="pt-16 p-1 container mx-auto bg-black text-white">
          <FuzzyText 
  baseIntensity={0.3} 
  hoverIntensity={1} 
  enableHover={true}>
  {message}
</FuzzyText>
<FuzzyText 
  baseIntensity={0.3} 
  hoverIntensity={1} 
  enableHover={true}>
  {details}
</FuzzyText>
      
      {stack && (
        <pre className="w-full p-4 overflow-x-auto bg-black">
          <code>{stack}</code>
        </pre>
      )}
    </main>
    </div>
        </>
    )
}


