import { ReactNode } from "react"

interface LoginLayoutProps {
  children: ReactNode
}

const LoginLayout = ({ children }: LoginLayoutProps) => {
  return <div className="flex flex-col content-center gap-1">
    <header className="text-center px-2">
      <div className="my-6">
        <h1 className="text-xl">
          Black Jack
        </h1>
        <p className="text-">Esta página simula uma tela de login. Insira as informações dos placeholders para prosseguir. </p>
      </div>
    </header>
    <main className="px-2">
      {children}
    </main>
  </div>
}

export default LoginLayout