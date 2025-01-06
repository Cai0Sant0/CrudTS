import { useState, useEffect, useRef, FormEvent } from "react";
import { FiTrash } from "react-icons/fi";
import { api } from "./services/api";

interface CustomerProps {
  id: string;
  name: string;
  email: string;
  status: boolean;
  criadoEm: string;
}

export default function App() {
  const [customers, setCustomers] = useState<CustomerProps[]>([]);

  const nameRef = useRef<HTMLInputElement | null>(null);
  const emailRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    loadCustomers();
  }, []);

  async function loadCustomers() {
    const response = await api.get("/customers");

    setCustomers(response.data);
  }

  async function handleSubmit(evento: FormEvent) {
    evento.preventDefault(); // impede o comportamento padrão do formulário

    if (!nameRef.current?.value || !emailRef.current?.value) return; //Verifica se o valor é nulo

    const response = await api.post("/customer", {
      name: nameRef.current?.value,
      email: emailRef.current?.value,
    });

    setCustomers((allCustomers) => [...allCustomers, response.data]);

    nameRef.current.value = "";
    emailRef.current.value = "";
  }

  async function handleDelete(id: string) {
    try {
      await api.delete("/customer", {
        params: {
          id: id,
        },
      });

      const allCustomers = customers.filter((customer) => customer.id !== id);
      setCustomers(allCustomers);
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className="w-full min-h-screen bg-gray-900 flex justify-center px-4">
      <main className="my-10 w-full md: max-w-2xl">
        <h1 className="text-4xl font-medium text-white text-center">Clientes</h1>
        <form className="flex flex-col my-6" onSubmit={handleSubmit}>
          <label htmlFor="nome" className="font-medium text-white">
            Nome:
          </label>
          <input
            type="text"
            name="nome"
            id="nome"
            ref={nameRef}
            placeholder="Digite seu nome completo"
            autoComplete="off"
            className="w-full mb-5 p-2 rounded"
          />
          <label htmlFor="email" className="font-medium text-white">
            Email:
          </label>
          <input
            type="email"
            name="email"
            id="email"
            ref={emailRef}
            placeholder="Digite seu email"
            autoComplete="off"
            className="w-full mb-5 p-2 rounded"
          />
          <input
            type="submit"
            value="Cadastrar"
            className="cursor-pointer w-full p-2 bg-green-500 rounded font-medium"
          />
        </form>

        <section className="flex flex-col gap-4">
          {customers.map((customer) => (
            <article
              className="w-full bg-white rounded p-2 relative hover:scale-105 duration-200"
              key={customer.id}
            >
              <p>
                <span className="font-medium">Nome:</span> {customer.name}
              </p>
              <p>
                <span className="font-medium">Email:</span> {customer.email}
              </p>
              <p>
                <span className="font-medium">Status:</span>{" "}
                {customer.status ? "ATIVO" : "INATIVO"}
              </p>

              <button
                className="bg-red-500 w-7 h-7 flex items-center justify-center rounded-lg absolute right-2 -top-2"
                onClick={() => handleDelete(customer.id)}
              >
                <FiTrash size={18} color="#fff" />
              </button>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}
