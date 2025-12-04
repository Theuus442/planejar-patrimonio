import React, { useState } from 'react';
import Icon from './Icon';

interface ForgotPasswordScreenProps {
  onSendReset: (email: string) => Promise<boolean>;
  onBackToLogin: () => void;
}

const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps> = ({ onSendReset, onBackToLogin }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setError('Por favor, digite seu e-mail.');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Por favor, insira um endereço de e-mail válido.');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      const result = await onSendReset(email);
      if (result) {
        setSuccess(true);
        setEmail('');
      } else {
        setError('Não foi possível enviar o e-mail. Tente novamente mais tarde.');
      }
    } catch (err) {
      console.error('Forgot password error:', err);
      setError('Ocorreu um erro ao enviar o e-mail. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-secondary flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <svg viewBox="0 0 250 80" xmlns="http://www.w3.org/2000/svg" className="mx-auto w-64 h-auto" role="img" aria-labelledby="logoTitle">
            <title id="logoTitle">Planejar Patrimônio Logo</title>
            <g>
              <path d="M44 11V36C44 43.2 38.3 51 30.7 51C23 51 17.3 43.2 17.3 36V11H44ZM46.7 8H14.7V36C14.7 44.5 21.8 53.5 30.7 53.5C39.5 53.5 46.7 44.5 46.7 36V8Z" fill="white"/>
              <path d="M22.7 23.3H38.7V20.7H22.7V23.3Z" fill="white"/>
              <path d="M26.7 39.3H34.7V23.3H26.7V39.3Z" fill="white"/>
              <path d="M22.7 43.3H38.7V40.7H22.7V43.3Z" fill="white"/>
            </g>
            <g>
              <text x="60" y="27" fontFamily="Book Antiqua, serif" fontSize="18" fill="white">PLANEJAR</text>
              <text x="60" y="50" fontFamily="Book Antiqua, serif" fontSize="18" fill="white" fontWeight="bold">PATRIMÔNIO</text>
              <text x="60" y="65" fontFamily="Book Antiqua, serif" fontSize="11" fill="white">Proteja sua família</text>
            </g>
          </svg>
        </div>
        
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200 mt-4">
          {!success ? (
            <>
              <h2 className="text-2xl font-bold text-center text-brand-dark mb-2">Recuperar Senha</h2>
              <p className="text-center text-gray-600 mb-6 text-sm">
                Digite seu e-mail para receber um link de redefinição de senha.
              </p>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="email" className="text-sm font-medium text-gray-700 text-left block">
                    Endereço de e-mail
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center">
                      <Icon name="email" className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-brand-secondary focus:border-brand-secondary sm:text-sm"
                      placeholder="voce@exemplo.com"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                {error && <p className="text-sm text-red-600 text-center">{error}</p>}

                <div className="space-y-2">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-secondary hover:bg-brand-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-accent transition-colors disabled:bg-gray-400"
                  >
                    {isLoading ? 'Enviando...' : 'Enviar Link de Redefinição'}
                  </button>

                  <button
                    type="button"
                    onClick={onBackToLogin}
                    className="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-accent transition-colors"
                  >
                    Voltar para Login
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="text-center space-y-4">
              <div className="flex justify-center mb-4">
                <Icon name="check" className="h-16 w-16 text-green-500" />
              </div>
              <h3 className="text-lg font-semibold text-brand-dark">E-mail Enviado!</h3>
              <p className="text-gray-600 text-sm">
                Se o e-mail estiver cadastrado em nosso sistema, você receberá um link para redefinir sua senha em breve.
              </p>
              <p className="text-gray-600 text-xs">
                Verifique também sua pasta de spam.
              </p>
              <button
                onClick={onBackToLogin}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-secondary hover:bg-brand-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-accent transition-colors"
              >
                Voltar para Login
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordScreen;
