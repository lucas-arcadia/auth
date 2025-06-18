import { PrismaClient } from "../generated/prisma/client";
const prisma = new PrismaClient();

try {
  console.log("Seeding data...");
  const companyCSITech = await prisma.company.create({
    data: {
      name: "CSI TECH INFORMATICA LTDA",
      surname: "CSI TECH",
      ein: "13019142000142",
    },
  });

  const companyRBM = await prisma.company.create({
    data: {
      name: "RBM - RECUPERADORA BRASILEIRA DE METAIS S/A",
      surname: "RBM",
      ein: "12698756000135",
    },
  });

  const companyLINDOYA = await prisma.company.create({
    data: {
      name: "EMPRESA DE MINERAÇÃO VALE DAS BROTAS DE LINDOYA LTDA",
      surname: "LINDOYA",
      ein: "49593908000145",
    },
  });

  const roleCSITechAdmin = await prisma.role.create({
    data: {
      companyId: companyCSITech.id,
      name: "Admin",
      description: "Administrador do sistema, responsável por gerenciar todos os usuários, grupos e empresas.",
      roles: {
        read_company: true,
        create_company: true,
        update_company: true,
        delete_company: true,
        restore_company: true,

        read_role: true,
        create_role: true,
        update_role: true,
        delete_role: true,
        restore_role: true,

        create_user: true,
        read_user: true,
        update_user: true,
        delete_user: true,
        restore_user: true,
        reset_password: true,
      },
      notes: [{ note: "Role created by the system" }],
    },
  });

  const roleCSITechUser = await prisma.user.create({
    data: {
      companyId: companyCSITech.id,
      Role: {
        connect: {
          id: roleCSITechAdmin.id,
        },
      },
      name: "Irapuan Menezes",
      email: "irapuan.menezes@csitech.com.br",
      phone: "+5511992000071",
      password: await Bun.password.hash("12345678", { algorithm: "bcrypt", cost: 10 }),
    },
  });

  // const roleCSITechEditor = await prisma.role.create({
  //   data: {
  //     name: "Editor",
  //     description: "Editor do sistema, responsável por gerenciar todos os usuários, grupos e empresas.",
  //     companyId: companyCSITech.id,
  //     roles: {
  //       create_user: true,
  //       read_user: true,
  //       update_user: true,
  //       delete_user: true,
  //     },
  //   },
  // });

  // const roleCSITechViewer = await prisma.role.create({
  //   data: {
  //     name: "Viewer",
  //     description: "Visualizador do sistema, responsável por visualizar todos os usuários, grupos e empresas.",
  //     companyId: companyCSITech.id,
  //     roles: {
  //       read_user: true,
  //     },
  //   },
  // });

  // const roleCSITechSupport = await prisma.role.create({
  //   data: {
  //     name: "Support",
  //     description: "Suporte do sistema, responsável por suportar todos os usuários, grupos e empresas.",
  //     companyId: companyCSITech.id,
  //     roles: {
  //       read_user: true,
  //       restore_user: true,
  //       reset_password: true,
  //     },
  //   },
  // });

  // const roleCSITechManager = await prisma.role.create({
  //   data: {
  //     name: "Manager",
  //     description: "Gerente do sistema, responsável por gerenciar todos os usuários, grupos e empresas.",
  //     companyId: companyCSITech.id,
  //     roles: {
  //       create_user: true,
  //       read_user: true,
  //       update_user: true,
  //       delete_user: true,
  //       restore_user: true,
  //       manage_groups: true,
  //       reset_password: true,
  //     },
  //   },
  // });

  // const roleRBMComplaintDenunciante = await prisma.role.create({
  //   data: {
  //     name: "Complaint Denunciante",
  //     description: "Pessoa que registra a denúncia de assédio moral ou sexual, podendo ser vítima, testemunha ou terceiro. Pode optar por anonimato devido à natureza sensível do tema.",
  //     notes: [{ note: "O sistema deve garantir anonimato (anonymize_data) para proteger a identidade, especialmente em denúncias de assédio sexual." }, { note: "A interface pode incluir orientações para suporte psicológico ou jurídico." }],
  //     companyId: companyRBM.id,
  //     roles: {
  //       create_complaint: "Criar uma nova denúncia de assédio.",
  //       add_documents: "Anexar evidências (ex.: mensagens, fotos, documentos).",
  //       add_comments: "Adicionar comentários ou responder a solicitações do tratador.",
  //       read_complaints: "Visualizar apenas o status e detalhes da própria denúncia.",
  //     },
  //   },
  // });

  // const roleRBMComplaintTratadorDeDenuncias = await prisma.role.create({
  //   data: {
  //     name: "Complaint Tratador",
  //     description: "Profissional capacitado para receber, analisar e tratar denúncias de assédio. Deve ter treinamento específico em questões de assédio moral e sexual para garantir sensibilidade e imparcialidade.",
  //     notes: [{ note: "O sistema deve garantir anonimato (anonymize_data) para proteger a identidade, especialmente em denúncias de assédio sexual." }, { note: "Pode ter acesso limitado a denúncias envolvendo superiores para evitar conflitos de interesse." }],
  //     companyId: companyRBM.id,
  //     roles: {
  //       // Herdadas do Denunciante
  //       read_complaints: "Restrito às denúncias atribuídas, não apenas próprias.",
  //       add_comments: "Para interagir com o denunciante ou documentar o caso.",
  //       add_documents: "Anexar evidências (ex.: mensagens, fotos, documentos).",

  //       // Próprias
  //       add_notes: "Notas internas são exclusivas para a equipe administrativa, não acessíveis ao denunciante.",
  //       change_status: "Apenas tratadores e superiores podem alterar o status. (ex.: 'Em análise', 'Pendende', 'Resolvida').",
  //       request_additional_info: "Solicitação formal de informações, restrita ao processo de tratamento.",
  //       escalate_complaint: "Permissão para encaminhar casos complexos.",
  //     },
  //   },
  // });

  // const roleRBMComplaintSupervisor = await prisma.role.create({
  //   data: {
  //     name: "Complaint Supervisor",
  //     description: "Responsável por supervisionar os tratadores, tomar decisões em casos escalados e garantir que o processo siga as políticas da empresa e a legislação.",
  //     notes: [{ note: "O supervisor deve ser imparcial, especialmente em denúncias envolvendo a alta gestão." }, { note: "Pode atuar como mediador em casos de conflito entre tratadores e denunciantes." }],
  //     companyId: companyRBM.id,
  //     roles: {
  //       // Herdadas do Denunciante
  //       read_complaints: "Restrito às denúncias atribuídas ou escaladas.",
  //       add_comments: "Para interagir com denunciantes ou tratadores.",
  //       add_documents: "Para adicionar evidências em casos escalados.",

  //       // Herdadas do Tratador
  //       add_notes: "Adicionar notas internas.",
  //       change_status: "Alterar o status da denúncia.",
  //       request_additional_info: "Solicitar informações adicionais.",
  //       escalate_complaint: "Escalar casos para o Comitê ou Ouvidor, se necessário.",

  //       // Próprias
  //       assign_complaint: "Atribuir ou reatribuir denúncias a tratadores.",
  //       close_complaint: "Aprovar o encerramento de uma denúncia.",
  //       reopen_complaint: "Reabrir uma denúncia fechada para revisão.",
  //       view_sensitive_data: "Acessar denúncias sensíveis, como aquelas envolvendo a alta gestão.",
  //       monitor_performance: "Acessar métricas de desempenho (ex.: tempo médio de resolução).. KPIs do sistema.",
  //     },
  //   },
  // });

  // const roleRBMComplaintAuditor = await prisma.role.create({
  //   data: {
  //     name: "Complaint Auditor",
  //     description: "Responsável por auditar o processo de tratamento de denúncias, garantindo conformidade com leis trabalhistas, LGPD e políticas internas da empresa.",
  //     notes: [{ note: "Auditores externos podem ser envolvidos em denúncias graves para garantir imparcialidade." }, { note: "Devem assegurar que o sistema siga normas como LGPD e leis trabalhistas (ex.: art. 216-A do Código Penal para assédio sexual)." }],
  //     companyId: companyRBM.id,
  //     roles: {
  //       // Herdadas do Denunciante
  //       read_complaints: "Acesso amplo, incluindo denúncias arquivadas.",
  //       add_comments: "Para documentar auditorias ou solicitar esclarecimentos.",
  //       add_documents: "Para anexar relatórios de auditoria.",

  //       // Herdadas do Tratador
  //       add_notes: "Adicionar notas de auditoria.",
  //       change_status: "Restrito a casos em auditoria. Se necessário.",
  //       request_additional_info: "Para esclarecimentos durante a auditoria.",
  //       escalate_complaint: "Para escalar casos com irregularidades.",

  //       // Herdadas do Supervisor
  //       assign_complaint: "Para reatribuir casos em auditoria.",
  //       close_complaint: "Em casos de auditoria finalizada.",
  //       reopen_complaint: "Para revisar casos mal resolvidos.",
  //       view_sensitive_data: "Acesso a todas as denúncias, incluindo sensíveis.",
  //       monitor_performance: "Para avaliar o desempenho do sistema).. KPIs do sistema.",

  //       // Próprias
  //       audit_complaint: "Acessar o histórico de ações de uma denúncia para auditoria.",
  //       generate_audit_report: "Gerar relatórios para auditorias internas ou externas.",
  //       restrict_access: "Restringir acesso a denúncias sensíveis durante auditoria.",
  //     },
  //   },
  // });

  // const roleRBMComplaintComiteDeEticaOuCompliance = await prisma.role.create({
  //   data: {
  //     name: "Complaint Comitê de Ética ou Compliance",
  //     description: "Grupo que delibera sobre denúncias graves ou estratégicas, como assédio sexual envolvendo a alta gestão.",
  //     notes: [{ note: "O comitê é acionado para casos de alto impacto, como assédio sexual com potencial de exposição pública." }, { note: "Deve incluir membros diversos para garantir decisões equilibradas." }],
  //     companyId: companyRBM.id,
  //     roles: {
  //       // Herdadas do Denunciante
  //       read_complaints: "Acesso a todas as denúncias, incluindo sensíveis.",
  //       add_comments: "Para documentar decisões/deliberações ou solicitar esclarecimentos.",
  //       add_documents: "Para anexar documentos de decisões, evidências ou relatórios.",

  //       // Herdadas do Tratador
  //       add_notes: "Documentar deliberações internas.",
  //       change_status: "Para atualizar status após decisõe.",
  //       request_additional_info: "Para esclarecimentos.",
  //       escalate_complaint: "Para autoridades externas, se necessário.",

  //       // Herdadas do Supervidor
  //       assign_complaint: "Reatribuir casos, se necessário.",
  //       close_complaint: "Encerrar denúncias após deliberação.",
  //       reopen_complaint: "Reabrir casos para revisão.",
  //       view_sensitive_data: "Acessar denúncias sensíveis.",
  //       monitor_performance: "Avaliar o desempenho do sistema.",

  //       // Herdadas do Auditor
  //       audit_complaint: "Revisar histórico de denúncias.",
  //       generate_audit_report: "Aprovar relatórios para divulgação.",
  //       restrict_access: "Proteger denúncias sensíveis.",

  //       // Próprias
  //       approve_decision: "Aprovar medidas disciplinares ou recomendações finais.",
  //     },
  //   },
  // });

  // const roleRBMComplaintOuvidorIndependente = await prisma.role.create({
  //   data: {
  //     name: "Complaint Ouvidor Independente",
  //     description: "Ator externo ou interno com independência para atuar como última instância em denúncias não resolvidas ou mal tratadas.",
  //     notes: [{ note: "O ouvidor deve ser independente, especialmente em denúncias contra a alta gestão." }, { note: "Pode recomendar suporte à vítima, como acesso a assistência psicológica." }],
  //     companyId: companyRBM.id,
  //     roles: {
  //       // Herdadas do Denunciante
  //       read_complaints: "Acesso a denúncias não resolvidas ou escaladas.",
  //       add_comments: "Para interagir com denunciantes.",
  //       add_documents: "Para anexar evidências ou relatórios.",

  //       // Herdadas do Tratador
  //       add_notes: "Documentar análises internas.",
  //       change_status: "Para atualizar status de denúncias revisadas.",
  //       request_additional_info: "Solicitar esclarecimentos.",
  //       escalate_complaint: "Para autoridades externas, se necessário.",

  //       // Herdadas do Supervisor
  //       assign_complaint: "Reatribuir casos, se necessário.",
  //       close_complaint: "Encerrar denúncias após revisão.",
  //       reopen_complaint: "Reabrir casos mal resolvidos.",
  //       view_sensitive_data: "Acessar denúncias sensíveis.",
  //       monitor_performance: "Avaliar o processo de tratamento.",

  //       // Herdadas do Auditor
  //       audit_complaint: "Revisar histórico de denúncias.",
  //       generate_audit_report: "Gerar relatórios para a alta gestão.",
  //       restrict_access: "Proteger dados sensíveis.",

  //       // Próprias
  //       escalate_to_authorities: "Encaminhar denúncias para autoridades externas (ex.: Ministério Público).",
  //     },
  //   },
  // });

  // const roleRBMComplaintAdmin = await prisma.role.create({
  //   data: {
  //     name: "Complaint Admin",
  //     description: "Gerencia a infraestrutura técnica e a segurança do canal de denúncias.",
  //     notes: [{note: "Não interage diretamente com o conteúdo das denúncias, mas garante a segurança e funcionalidade do sistema."}, {note: "Essencial para proteger dados sensíveis em denúncias de assédio."}],
  //     companyId: companyRBM.id,
  //     roles: {
  //       // Próprias
  //       manage_users: "Criar, editar ou desativar contas de tratadores, supervisores, auditores, etc.",
  //       configure_system: "Configurar fluxos, categorias (ex.: assédio moral, assédio sexual) e prazos.",
  //       log_access: "Registrar todas as ações no sistema para rastreabilidade.",
  //       enforce_2fa: "Implementar autenticação de dois fatores.",
  //       restrict_ip: "Limitar acesso a IPs confiáveis.",
  //       anonymize_data: "Garantir anonimato do denunciante.",
  //     },
  //   },
  // });
} catch (error) {
  console.error(error);
  await prisma.$disconnect();
  process.exit(1);
}
