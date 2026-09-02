import React from "react";
import m1 from "../assets/m1.png";
import m2 from "../assets/m2.png";
import w1 from "../assets/w1.png";
import w2 from "../assets/w2.png";
import { motion } from "framer-motion";

const MH2 = motion.h2;
const MDiv = motion.div;

const testimonials = [
  {
    name: "Rafael Mendes",
    role: "Tech Lead na Agenda Acessoria",
    review:
      "Lucca entregou interfaces responsivas e acessíveis com excelência. Sua atenção aos detalhes e foco na experiência do usuário foram fundamentais para o sucesso do app de Prova de Vida.",
    image: m1,
  },
  {
    name: "Ana Paula Costa",
    role: "Product Designer",
    review:
      "Trabalhar com o Lucca foi uma experiência incrível. Ele une design e código de forma natural, sempre buscando a melhor solução para o usuário final.",
    image: w1,
  },
  {
    name: "Marcos Oliveira",
    role: "Gerente de Projetos na Agir Ambiental",
    review:
      "Profissional dedicado e proativo. O Lucca transformou requisitos complexos em aplicações web modernas e escaláveis para nossos clientes parceiros.",
    image: m2,
  },
  {
    name: "Camila Santos",
    role: "Desenvolvedora Full Stack",
    review:
      "Domínio sólido de Angular e React, além de grande capacidade de colaboração em equipe. Recomendo fortemente o trabalho do Lucca.",
    image: w2,
  },
];

function Testimonials() {
  return (
    <section
      id="testimonials"
      className="relative min-h-screen bg-black text-white flex flex-col items-center justify-center px-6 py-20"
    >
      <MH2
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl font-bold mb-16"
      >
        What People Say
      </MH2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-10 max-w-6xl w-full">
        {testimonials.map((testi, idx) => (
          <MDiv
            key={testi.name + idx}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: idx * 0.2 }}
            viewport={{ once: true }}
            className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 flex flex-col items-center text-center transform transition duration-500 hover:scale-105 hover:-rotate-1"
          >
            <img
              src={testi.image}
              alt={testi.name}
              className="w-20 h-20 rounded-full border-2 border-white/40 mb-4 object-cover"
              loading="lazy"
            />

            <p className="text-gray-200 italic mb-4">
              "{testi.review}"
            </p>

            <h3 className="text-lg font-semibold">{testi.name}</h3>
            <p className="text-sm text-gray-400">{testi.role}</p>
          </MDiv>
        ))}
      </div>
    </section>
  );
}

export default Testimonials;
