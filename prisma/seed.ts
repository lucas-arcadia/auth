// csi-auth-api/prisma/seed.ts

import { PrismaClient } from "../generated/prisma/client";
const prisma = new PrismaClient();

try {
  console.log("Seeding data...");

  // Company CSI TECH INFORMATICA LTDA
  const companyCSITech = await prisma.company.create({
    data: {
      name: "CSI TECH INFORMATICA LTDA",
      surname: "CSI TECH",
      ein: "13019142000142",
    },
  });

  const roleAdmin = await prisma.role.create({
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

  const userAdmin = await prisma.user.create({
    data: {
      companyId: companyCSITech.id,
      Role: {
        connect: {
          id: roleAdmin.id,
        },
      },
      name: "Irapuan Menezes",
      email: "irapuan.menezes@csitech.com.br",
      phone: "+5511992000071",
      password: await Bun.password.hash("12345678", { algorithm: "bcrypt", cost: 10 }),
    },
  });

  const roleSupport = await prisma.role.create({
    data: {
      companyId: companyCSITech.id,
      name: "Support",
      description: "Suporte do sistema, responsável por suportar todos os usuários e grupos.",
      roles: {
        read_company: true,

        read_role: true,

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

  // Company RBM - RECUPERADORA BRASILEIRA DE METAIS S/A
  const companyRBM = await prisma.company.create({
    data: {
      id: "0197312c-2634-76a1-9e82-046f2949cb75",
      name: "RBM - RECUPERADORA BRASILEIRA DE METAIS S/A",
      surname: "RBM",
      ein: "12698756000135",
    },
  });

  const roleComplaintAdmin = await prisma.role.create({
    data: {
      companyId: companyRBM.id,
      name: "Administrador Canal Denúncias",
      description: "Gerencia a infraestrutura técnica e a segurança do canal de denúncias.",
      roles: {
        // System
        read_company: true,
        read_role: true,
        create_user: true,
        read_user: true,
        update_user: true,
        delete_user: true,
        restore_user: true,
        reset_password: true,
        anonymize_data: true,
        configure_system: true,
      },
      notes: [{ note: "Role created by the system" }],
    },
  });

  const userComplaintAdmin = await prisma.user.create({
    data: {
      companyId: companyRBM.id,
      Role: {
        connect: {
          id: roleComplaintAdmin.id,
        },
      },
      name: "Ouvidor",
      email: "ouvidoria.admin@rbmmetais.com.br",
      phone: "+551124500010",
      password: await Bun.password.hash("12345678", { algorithm: "bcrypt", cost: 10 }),
    },
  });

  const roleComplaintSupervisor = await prisma.role.create({
    data: {
      companyId: companyRBM.id,
      name: "Supervisor Canal Denúncias",
      description: "Responsável por supervisionar os tratadores, tomar decisões em casos escalados e garantir que o processo siga as políticas da empresa e a legislação.",
      roles: {
        // Herdadas do Denunciante
        read_complaint: true,
        add_comments: true,
        add_documents: true,

        // Herdadas do Tratador
        add_notes: true,
        change_status: true,
        request_additional_info: true,
        escalate_complaint: true,

        // Próprias
        assign_complaint: true,
        close_complaint: true,
        reopen_complaint: true,
        view_sensitive_data: true,
        monitor_performance: true,
      },
      notes: [{ note: "Role created by the system" }],
    },
  });

  const userComplaintSupervisor = await prisma.user.create({
    data: {
      companyId: companyRBM.id,
      Role: {
        connect: {
          id: roleComplaintSupervisor.id,
        },
      },
      name: "Supervisor",
      email: "ouvidoria.supervisor@rbmmetais.com.br",
      phone: "+551124500010",
      password: await Bun.password.hash("12345678", { algorithm: "bcrypt", cost: 10 }),
    },
  });

  const roleComplaintTratador = await prisma.role.create({
    data: {
      companyId: companyRBM.id,
      name: "Tratador Canal Denúncias",
      description: "Profissional capacitado para receber, analisar e tratar denúncias de assédio. Deve ter treinamento específico em questões de assédio moral e sexual para garantir sensibilidade e imparcialidade.",
      roles: {
        // Herdadas do Denunciante
        read_complaint: true,
        add_comments: true,
        add_documents: true,

        // Próprias
        add_notes: true,
        change_status: true,
        request_additional_info: true,
        escalate_complaint: true,
      },
      notes: [{ note: "Role created by the system" }],
    },
  });

  const userComplaintTratador = await prisma.user.create({
    data: {
      companyId: companyRBM.id,
      Role: {
        connect: {
          id: roleComplaintTratador.id,
        },
      },
      name: "Tratador",
      email: "ouvidoria.tratador@rbmmetais.com.br",
      phone: "+551124500010",
      password: await Bun.password.hash("12345678", { algorithm: "bcrypt", cost: 10 }),
    },
  });

  const roleComplaintAuditor = await prisma.role.create({
    data: {
      companyId: companyRBM.id,
      name: "Auditor Canal Denúncias",
      description: "Responsável por auditar o processo de tratamento de denúncias, garantindo conformidade com leis trabalhistas, LGPD e políticas internas da empresa.",
      roles: {
        // Herdadas do Denunciante
        read_complaint: true,
        add_comments: true,
        add_documents: true,

        // Herdadas do Tratador
        add_notes: true,
        change_status: true,
        request_additional_info: true,
        escalate_complaint: true,

        // Herdadas do Supervisor
        assign_complaint: true,
        close_complaint: true,
        reopen_complaint: true,
        view_sensitive_data: true,
        monitor_performance: true,

        // Próprias
        audit_complaint: true,
        generate_audit_report: true,
        restrict_access: true,
      },
      notes: [{ note: "Role created by the system" }],
    },
  });

  const userComplaintAuditor = await prisma.user.create({
    data: {
      companyId: companyRBM.id,
      Role: {
        connect: {
          id: roleComplaintAuditor.id,
        },
      },
      name: "Auditor",
      email: "ouvidoria.auditor@rbmmetais.com.br",
      phone: "+551124500010",
      password: await Bun.password.hash("12345678", { algorithm: "bcrypt", cost: 10 }),
    },
  });

  const roleComplaintComiteDeEtica = await prisma.role.create({
    data: {
      companyId: companyRBM.id,
      name: "Comitê de Ética Canal Denúncias",
      description: "Grupo que delibera sobre denúncias graves ou estratégicas, como assédio sexual envolvendo a alta gestão.",
      roles: {
        // Herdadas do Denunciante
        read_complaint: true,
        add_comments: true,
        add_documents: true,

        // Herdadas do Tratador
        add_notes: true,
        change_status: true,
        request_additional_info: true,
        escalate_complaint: true,

        // Herdadas do Supervisor
        assign_complaint: true,
        close_complaint: true,
        reopen_complaint: true,
        view_sensitive_data: true,
        monitor_performance: true,

        // Herdadas do Auditor
        audit_complaint: true,
        generate_audit_report: true,
        restrict_access: true,

        // Próprias
        approve_decision: true,
      },
      notes: [{ note: "Role created by the system" }],
    },
  });

  const userComplaintComiteDeEtica = await prisma.user.create({
    data: {
      companyId: companyRBM.id,
      Role: {
        connect: {
          id: roleComplaintComiteDeEtica.id,
        },
      },
      name: "Comitê de Ética",
      email: "ouvidoria.comite@rbmmetais.com.br",
      phone: "+551124500010",
      password: await Bun.password.hash("12345678", { algorithm: "bcrypt", cost: 10 }),
    },
  });

  const roleComplaintOuvidorIndependente = await prisma.role.create({
    data: {
      companyId: companyRBM.id,
      name: "Ouvidor Independente Canal Denúncias",
      description: "Ator externo ou interno com independência para atuar como última instância em denúncias não resolvidas ou mal tratadas.",
      roles: {
        // Herdadas do Denunciante
        read_complaint: true,
        add_comments: true,
        add_documents: true,

        // Herdadas do Tratador
        add_notes: true,
        change_status: true,
        request_additional_info: true,
        escalate_complaint: true,

        // Herdadas do Supervisor
        assign_complaint: true,
        close_complaint: true,
        reopen_complaint: true,
        view_sensitive_data: true,
        monitor_performance: true,

        // Herdadas do Auditor
        audit_complaint: true,
        generate_audit_report: true,
        restrict_access: true,

        // Herdadas do Comitê de Ética ou Compliance

        // Próprias
        escalate_to_authorities: true,
      },
      notes: [{ note: "Role created by the system" }],
    },
  });

  const userComplaintOuvidorIndependente = await prisma.user.create({
    data: {
      companyId: companyRBM.id,
      Role: {
        connect: {
          id: roleComplaintOuvidorIndependente.id,
        },
      },
      name: "Ouvidor Independente",
      email: "ouvidoria.independente@rbmmetais.com.br",
      phone: "+551124500010",
      password: await Bun.password.hash("12345678", { algorithm: "bcrypt", cost: 10 }),
    },
  });
} catch (error) {
  console.error(error);
  await prisma.$disconnect();
  process.exit(1);
}
