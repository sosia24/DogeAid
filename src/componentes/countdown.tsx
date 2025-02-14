import { useState, useEffect } from 'react';

// Função para calcular o tempo restante com UTC
const calculateTimeLeft = (targetDate: string) => {
  // Criar a data-alvo como UTC
  const target = new Date(targetDate).getTime();
  // Pegar o tempo atual em UTC
  const now = new Date().getTime();
  // Calcular a diferença
  const difference = target - now;

  if (difference <= 0) {
    return "Expired";
  }

  const days = Math.floor(difference / (1000 * 60 * 60 * 24));
  const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((difference % (1000 * 60)) / 1000);

  return `${days}D:${hours}H:${minutes}M:${seconds}S`;
};

interface CountdownProps {
  targetDate: string; // Deve estar em formato ISO UTC: "YYYY-MM-DDTHH:mm:ssZ"
}

const Countdown: React.FC<CountdownProps> = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState<string>('');

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft(targetDate));
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <div>
      <p className='bg-gradient-to-r from-[#f60d53de] to-[#fe4a00] text-transparent bg-clip-text font-semibold text-[50px] sm:text-[30px] mb-[30px]'>
        {timeLeft}
      </p>
    </div>
  );
};

export default Countdown;
