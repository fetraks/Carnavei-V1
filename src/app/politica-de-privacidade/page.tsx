import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Política de Privacidade — Carnavei",
  description: "Saiba como a Carnavei coleta, usa e protege seus dados pessoais.",
};

export default function PoliticaDePrivacidade() {
  return (
    <main
      style={{
        background: "#FBF8F4",
        color: "#2B2530",
        minHeight: "100vh",
        fontFamily: "var(--font-sans, sans-serif)",
      }}
    >
      <div
        style={{
          maxWidth: 720,
          margin: "0 auto",
          padding: "64px 24px 80px",
        }}
      >
        <Link
          href="/"
          style={{
            display: "inline-block",
            marginBottom: 40,
            fontSize: 14,
            color: "#D46429",
            textDecoration: "none",
            letterSpacing: "0.02em",
          }}
        >
          ← Voltar à loja
        </Link>

        <h1
          style={{
            fontFamily: "var(--font-heading, serif)",
            fontSize: "clamp(28px, 5vw, 42px)",
            fontWeight: 600,
            fontStyle: "italic",
            marginBottom: 8,
            lineHeight: 1.2,
          }}
        >
          Política de Privacidade
        </h1>
        <p style={{ fontSize: 14, color: "#7a6f7a", marginBottom: 48 }}>
          Última atualização: junho de 2026
        </p>

        <Section title="1. Quem somos">
          <p>
            A <strong>Carnavei</strong> é uma marca de acessórios artesanais femininos. Nosso site
            é <a href="https://carnavei.com.br" style={linkStyle}>carnavei.com.br</a>. Para
            dúvidas sobre privacidade, entre em contato pelo e-mail{" "}
            <a href="mailto:contato@carnavei.com.br" style={linkStyle}>contato@carnavei.com.br</a>.
          </p>
        </Section>

        <Section title="2. Dados que coletamos">
          <p>Coletamos os seguintes dados pessoais apenas quando necessário:</p>
          <ul style={listStyle}>
            <li>
              <strong>Dados de cadastro:</strong> nome, e-mail e senha (quando você cria uma conta).
            </li>
            <li>
              <strong>Dados de entrega:</strong> endereço completo e CPF, para processar pedidos.
            </li>
            <li>
              <strong>Dados de pagamento:</strong> processados de forma segura pelo Mercado Pago. A
              Carnavei não armazena dados de cartão.
            </li>
            <li>
              <strong>Dados de navegação:</strong> coletados via Google Analytics (GA4) e Hotjar
              para melhorar a experiência do site. Nenhum dado identificável é enviado a essas
              ferramentas.
            </li>
          </ul>
        </Section>

        <Section title="3. Como usamos seus dados">
          <ul style={listStyle}>
            <li>Processar e entregar seus pedidos.</li>
            <li>Enviar confirmações de compra e atualizações de entrega por e-mail.</li>
            <li>Melhorar nossos produtos, site e atendimento.</li>
            <li>
              Exibir anúncios relevantes nas redes sociais (Meta/Facebook e Instagram), com base em
              seu interesse pelos nossos produtos.
            </li>
          </ul>
        </Section>

        <Section title="4. Cookies e rastreamento">
          <p>
            Utilizamos cookies para manter sua sessão ativa, lembrar o carrinho e analisar o
            tráfego do site. Você pode desativar cookies no seu navegador, mas algumas
            funcionalidades podem não funcionar corretamente.
          </p>
          <p style={{ marginTop: 12 }}>
            Também utilizamos o Pixel da Meta (Facebook/Instagram) para medir o desempenho de
            anúncios e exibir publicidade relevante a quem já visitou nossa loja.
          </p>
        </Section>

        <Section title="5. Compartilhamento de dados">
          <p>
            Seus dados são compartilhados somente com parceiros essenciais para a operação:
          </p>
          <ul style={listStyle}>
            <li>
              <strong>Mercado Pago</strong> — processamento de pagamentos.
            </li>
            <li>
              <strong>Melhor Envio</strong> — cálculo e geração de etiquetas de frete.
            </li>
            <li>
              <strong>Resend</strong> — envio de e-mails transacionais.
            </li>
            <li>
              <strong>Google</strong> — analytics e login social (se utilizado).
            </li>
            <li>
              <strong>Meta (Facebook/Instagram)</strong> — exibição de anúncios relevantes.
            </li>
          </ul>
          <p style={{ marginTop: 12 }}>
            Não vendemos nem alugamos seus dados a terceiros.
          </p>
        </Section>

        <Section title="6. Seus direitos (LGPD)">
          <p>
            De acordo com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018), você tem direito
            a:
          </p>
          <ul style={listStyle}>
            <li>Acessar os dados que temos sobre você.</li>
            <li>Corrigir dados incompletos ou desatualizados.</li>
            <li>Solicitar a exclusão dos seus dados.</li>
            <li>Revogar o consentimento a qualquer momento.</li>
          </ul>
          <p style={{ marginTop: 12 }}>
            Para exercer esses direitos, entre em contato:{" "}
            <a href="mailto:contato@carnavei.com.br" style={linkStyle}>
              contato@carnavei.com.br
            </a>
          </p>
        </Section>

        <Section title="7. Segurança">
          <p>
            Adotamos medidas técnicas e organizacionais para proteger seus dados contra acesso não
            autorizado, perda ou vazamento. Todas as comunicações entre seu navegador e nosso
            servidor são criptografadas via HTTPS.
          </p>
        </Section>

        <Section title="8. Alterações nesta política">
          <p>
            Podemos atualizar esta política periodicamente. A data de "Última atualização" no topo
            indica quando a versão atual entrou em vigor. Alterações significativas serão
            comunicadas por e-mail.
          </p>
        </Section>

        <div
          style={{
            marginTop: 56,
            paddingTop: 32,
            borderTop: "1px solid #E7DFD6",
            fontSize: 13,
            color: "#7a6f7a",
          }}
        >
          Dúvidas?{" "}
          <a href="mailto:contato@carnavei.com.br" style={linkStyle}>
            contato@carnavei.com.br
          </a>
        </div>
      </div>
    </main>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section style={{ marginBottom: 36 }}>
      <h2
        style={{
          fontFamily: "var(--font-heading, serif)",
          fontSize: 20,
          fontWeight: 600,
          marginBottom: 12,
          color: "#2B2530",
        }}
      >
        {title}
      </h2>
      <div style={{ fontSize: 15, lineHeight: 1.75, color: "#3d3340" }}>{children}</div>
    </section>
  );
}

const linkStyle: React.CSSProperties = {
  color: "#D46429",
  textDecoration: "underline",
};

const listStyle: React.CSSProperties = {
  paddingLeft: 20,
  lineHeight: 1.9,
};
